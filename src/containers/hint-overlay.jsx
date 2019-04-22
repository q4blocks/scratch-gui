import React from "react";
import bindAll from 'lodash.bindall';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';

import VM from 'scratch-vm';
import ScratchBlocks from 'scratch-blocks';

import { updateHint, putAllHints, removeHint, hintOptions } from '../reducers/hints-state';
import HintOverlayComponent from '../components/hint-overlay/hint-overlay.jsx';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, CONTEXT_MENU_REFACTOR, CONTEXT_MENU_INFO, CONTEXT_MENU_CODE_SHARE } from '../lib/hints/constants';
import { computeHintLocationStyles, analysisInfoToHints, getProcedureEntry, generateShareableCodeHints, highlightDuplicateBlocks } from '../lib/hints/hints-util';
import { sendAnalysisReq, getProgramXml } from '../lib/hints/analysis-server-api';
import { applyTransformation } from '../lib/hints/transform-api';
import { addBlocksToWorkspace, testBlocks, getTestHints } from '../lib/hints/hint-test-workspace-setup';


const isProductionMode = true;
const isTesting = true;


const addFunctionListener = (object, property, callback) => {
    const oldFn = object[property];
    object[property] = function () {
        const result = oldFn.apply(this, arguments);
        callback.call(this, result);
        return result;
    };
};

const SNIPPET_LOCAL_STORAGE_KEY = '__snippet__';
const updateShareSnippetOnLocalStorage = snippetEntry => {
    const serializedSnippet = JSON.stringify(snippetEntry);
    localStorage.setItem(SNIPPET_LOCAL_STORAGE_KEY, serializedSnippet);
}

class HintOverlay extends React.Component {
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
        addFunctionListener(this.workspace, 'translate', debounce(() => this.onWorkspaceMetricsChange(), 100, { leading: true }));
        addFunctionListener(this.workspace, 'zoom', debounce(() => this.onWorkspaceMetricsChange(), 100, { leading: true }));
        addFunctionListener(ScratchBlocks.Gesture.prototype, 'updateDragDelta_', debounce(() => this.hideHint()));
    }

    detachVM() {
        this.props.vm.removeListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.removeListener('targetsUpdate', this.onTargetsUpdate);
    }

    onWorkspaceUpdate(data) {
        if (isTesting && !this.alreadySetup) {
            addBlocksToWorkspace(this.workspace, testBlocks.simpleDuplicate);
            addBlocksToWorkspace(this.workspace, testBlocks.simpleDuplicate2);
            addBlocksToWorkspace(this.workspace, testBlocks.simpleProcedure);
            this.workspace.cleanUp();
            this.alreadySetup = true;
        }
    }

    onTargetsUpdate() {
        //         console.log('TODO: show hint that is only relevant to the current target');
    }

    onWorkspaceMetricsChange() {
        //disregard metrics change when workspace for custom block is shown
        const isProcedureEditorOpened = this.workspace.id !== Blockly.getMainWorkspace().id;

        if (this.props.hintState.hints.length <= 0 || isProcedureEditorOpened) return;
        this.hideHint();

        const options = this.props.hintState.options;

        if (this.props.hintState.options.isVisible) {
            const hints = options.showProcedureSharingHint ? generateShareableCodeHints(this.workspace, this.props.hintState) : [];
            if (hints.length > 0) {
                this.props.putAllHints(hints);
                this.alreadyShown = false;
                this.alreadyHidden = true;
                setTimeout(() => this.showHint(), 500);
            }
        }
        console.log(this.props.hintState);
    }

    hideHint() {
        if (this.props) {
            this.props.hintState.hints.map(h => {
                //update hint styles to be invisible
                this.props.onUpdateHint(h.hintId, {
                    styles: {
                        display: 'none'
                    }
                });
            });
            this.alreadyHidden = true;
            this.alreadyShown = false;
        }
    }

    showHint() {
        const { showProcedureSharingHint, showQualityHint } = this.props.hintState.options;
        if (showProcedureSharingHint) {
            this.props.hintState.hints.map(h => h.type === SHAREABLE_CODE_HINT_TYPE && this.updateHintTracking(h));
        }
        if (showQualityHint) {
            this.props.hintState.hints.map(h => h.type === DUPLICATE_CODE_SMELL_HINT_TYPE && this.updateHintTracking(h));
        }
        this.alreadyShown = true;
        this.alreadyHidden = false;
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
                updateShareSnippetOnLocalStorage(entry);
                //todo: remove the hint
                window.open('/playground-authoring');
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
                return analysisInfo ? analysisInfoToHints(analysisInfo) : [];
            }).then(hints => {
                this.props.putAllHints(hints);
            });
    }

    blockListener(e) {
        if (this.workspace.isDragging()) return;
        if (!this.props.hintState) return;
        // console.log('TODO: logic to delay analyzing hints waiting for a good time');
        const options = this.props.hintState.options;
        if (e.type === 'create' && e.xml.getAttribute('type') === 'procedures_definition') {
            const hints = options.showProcedureSharingHint ? generateShareableCodeHints(this.workspace, this.props.hintState) : [];
            if (hints.length > 0) {
                this.props.putAllHints(hints);
                this.showHint();
            }
        }

        if (e.type === 'delete') {
            this.props.hintState.hints.filter(h => !this.workspace.getBlockById(h.blockId)).forEach(h => {
                this.props.removeHint(h.hintId);
            });
        }

        if (this.timeout) {
            clearTimeout(this.timeout);
        }


        this.timeout = setTimeout(() => {
            this.analyzeAndGenerateHints().then(() => {
                const options = this.props.hintState.options;
                const hints = generateShareableCodeHints(this.workspace, this.props.hintState);
                if (hints.length > 0) {
                    this.props.putAllHints(hints);
                }
                this.alreadyShown = false;
                this.alreadyHidden = true;
                if (this.props.hintState.hints.length > 0 && options.isVisible) {
                    this.showHint();
                }
            });
        }, 1000);
    }

    onMouseEnter(hintId) {
        const hint = this.props.hintState.hints.find(h => h.hintId === hintId);
        switch (hint.type) {
            case DUPLICATE_CODE_SMELL_HINT_TYPE:
                highlightDuplicateBlocks(hintId, true, this.workspace, this.analysisInfo);
                break;
        }
    }

    onMouseLeave(hintId) {
        const hint = this.props.hintState.hints.find(h => h.hintId === hintId);
        switch (hint.type) {
            case DUPLICATE_CODE_SMELL_HINT_TYPE:
                highlightDuplicateBlocks(hintId, false, this.workspace, this.analysisInfo);
                break;
        }
    }

    componentDidUpdate() {
        const { showProcedureSharingHint, showQualityHint } = this.props.hintState.options;
        if (showProcedureSharingHint && !this.alreadyShown) {
            this.showHint();
        } else if (!showProcedureSharingHint && !this.alreadyHidden) {
            this.hideHint();
        }

    }

    render() {
        const componentProps = omit(this.props, ['asset', 'vm']);
        return (
            <HintOverlayComponent
                hints={this.props.hintState}
                onHandleHintMenuItemClick={this.onHandleHintMenuItemClick}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                {...componentProps}
            />
        );
    }
}

HintOverlay.propTypes = {
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
        onUpdateHint: (hintId, changes) => {
            dispatch(updateHint(hintId, changes));
        },
        removeHint: hintId => {
            dispatch(removeHint(hintId))
        },
        // putHint: hint => dispatch(putHint(hint)),
        putAllHints: hints => dispatch(putAllHints(hints))
    }
};

const ConnectedComponent = connect(
    mapStateToProps, mapDispatchToProps
)(HintOverlay);

export default ConnectedComponent;
