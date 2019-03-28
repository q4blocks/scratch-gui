import React from "react";
import bindAll from 'lodash.bindall';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import VM from 'scratch-vm';
import ScratchBlocks from 'scratch-blocks';

import { setHint, updateHint, putHint, removeHint, setUpdateStatus } from '../reducers/hints-state';
import WsOverlayComponent from '../components/wsoverlay/wsoverlay.jsx';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, CONTEXT_MENU_REFACTOR, CONTEXT_MENU_INFO, CONTEXT_MENU_CODE_SHARE } from '../lib/hints/constants';
import { computeHintLocationStyles, analysisInfoToHints, getProcedureEntry, buildHintContextMenu, highlightDuplicateBlocks } from '../lib/hints/hints-util';
import { sendAnalysisReq, getProgramXml } from '../lib/qtutor-server-api';
import { applyTransformation } from '../lib/transform-api';
import { addBlocksToWorkspace, simpleDuplicateXml, getTestHints } from '../lib/hints/hint-test-workspace-setup';

const isProductionMode = true;
const isTesting = true;

const addFunctionListener = (object, property, callback) => {
    const oldFn = object[property];
    object[property] = function () {
        const result = oldFn.apply(this, arguments);
        callback.apply(this, result);
        return result;
    };
};


class WsOverlay extends React.Component {
    constructor(props) {
        super(props);

        bindAll(this, [
            'onWorkspaceUpdate',
            'onWorkspaceMetricsChange',
            'onTargetsUpdate',
            'blockListener',
            'onHandleHintMenuItemClick',
            'onMouseEnter',
            'onMouseLeave'
        ]);
    }

    componentDidMount() {
        this.workspace = ScratchBlocks.getMainWorkspace();
        this.attachVM();
    }

    attachVM() {
        if (!this.props.vm) return;
        this.workspace.addChangeListener(this.blockListener);
        this.props.vm.addListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.addListener('targetsUpdate', this.onTargetsUpdate);
        addFunctionListener(this.workspace, 'translate', this.onWorkspaceMetricsChange);
        addFunctionListener(this.workspace, 'zoom', this.onWorkspaceMetricsChange);
    }

    detachVM() {
        this.props.vm.removeListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.removeListener('targetsUpdate', this.onTargetsUpdate);
    }

    onWorkspaceUpdate(data) {
        if (isTesting && !this.alreadySetup) {
            addBlocksToWorkspace(this.workspace, simpleDuplicateXml);
        }
        this.alreadySetup = true;
    }

    onTargetsUpdate() {
        console.log('TODO: show hint that is only relevant to the current target');
    }

    onWorkspaceMetricsChange() {
        //disregard metrics change when workspace for custom block is shown
        const isProcedureEditorOpened = this.workspace.id !== Blockly.getMainWorkspace().id;

        if (this.props.hintState.hints.length <= 0 || isProcedureEditorOpened) return;
        this.showHint();
    }

    showHint() {
        this.props.hintState.hints.map(h => this.updateHintTracking(h));
    }

    updateHintTracking(hint) {
        const changes = computeHintLocationStyles(hint, this.workspace);
        this.props.onUpdateHint(hint.hintId, changes);
    }

    onHandleHintMenuItemClick(hintId, itemAction) {
        const hint = this.props.hintState.hints.find(h => h.hintId === hintId);

        switch (itemAction) {
            case CONTEXT_MENU_REFACTOR: {
                applyTransformation(hintId, this.props.vm, this.workspace, this.analysisInfo);
                this.props.removeHint(hintId); //remove hint when the specified action is taken
                break;
            }
            case CONTEXT_MENU_CODE_SHARE: {
                console.log('Post request to save procedure to library');
                const block = this.workspace.getBlockById(hint.blockId);
                const entry = getProcedureEntry(block);
                console.log(entry);
                break;
            }
        }
    }

    analyzeAndGenerateHints() {
        const _vm = this.props.vm;
        return Promise.resolve()
            .then(() => getProgramXml(_vm))
            .then(xml => sendAnalysisReq('projectId', 'duplicate_code', xml, isProductionMode))
            .then(json => {
                const analysisInfo = this.analysisInfo = json;
                if (analysisInfo) {
                    let targetName = _vm.editingTarget.getName();
                    return analysisInfoToHints(analysisInfo);
                }
                return [];
            }).then(hints => {
                this.props.setHint(hints);
                return true;
            });
    }

    blockListener(e) {
        if (this.workspace.isDragging()) return;
        const { hintState: { hints } } = this.props;
        console.log('TODO: remove hints that become invalid by code changes');
        if (hints.length === 0) {
            this.analyzeAndGenerateHints().then(() => {
                if (this.props.hintState.hints.length > 0) {
                    this.showHint();
                }
            });
        }
    }

    onMouseEnter(hintId) {
        const hint = this.props.hintState.hints.find(h => h.hintId === hintId);
        switch (hint.type) {
            case DUPLICATE_CODE_SMELL_HINT_TYPE:
                highlightDuplicateBlocks(true, this.workspace, this.analysisInfo);
                break;
        }
    }

    onMouseLeave(hintId) {
        const hint = this.props.hintState.hints.find(h => h.hintId === hintId);
        switch (hint.type) {
            case DUPLICATE_CODE_SMELL_HINT_TYPE:
                highlightDuplicateBlocks(false, this.workspace, this.analysisInfo);
                break;
        }
    }

    render() {
        const componentProps = omit(this.props, ['asset', 'vm']);
        return (
            <WsOverlayComponent
                hints={this.props.hintState}
                onHandleHintMenuItemClick={this.onHandleHintMenuItemClick}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                {...componentProps}
            />
        );
    }
}

WsOverlay.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => {
    const targets = state.scratchGui.targets;
    const currentTargetId = targets.editingTarget;
    return {
        vm: state.scratchGui.vm,
        hintState: state.scratchGui.hintState,
        currentTargetId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setHint: hints => {
            dispatch(setHint(hints));
        },
        onUpdateHint: (hintId, changes) => {
            dispatch(updateHint(hintId, changes));
        },
        setUpdateStatus: isUpdating => dispatch(setUpdateStatus(isUpdating)),
        removeHint: hintId => {
            dispatch(removeHint(hintId))
        }
        , putHint
    }
};

const ConnectedComponent = connect(
    mapStateToProps, mapDispatchToProps
)(WsOverlay);

export default ConnectedComponent;
