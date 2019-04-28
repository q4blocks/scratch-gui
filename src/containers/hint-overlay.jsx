import React from "react";
import bindAll from 'lodash.bindall';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';

import VM from 'scratch-vm';
import ScratchBlocks from 'scratch-blocks';

import { updateHint, putAllHints, removeHint, clearAllHints, hintOptions, setHintManager } from '../reducers/hints-state';
import HintOverlayComponent from '../components/hint-overlay/hint-overlay.jsx';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, CONTEXT_MENU_REFACTOR, CONTEXT_MENU_INFO, CONTEXT_MENU_CODE_SHARE } from '../lib/hints/constants';
import { computeHintLocationStyles, analysisInfoToHints, getProcedureEntry, generateShareableCodeHints, highlightDuplicateBlocks } from '../lib/hints/hints-util';
import { sendAnalysisReq, getProgramXml } from '../lib/hints/analysis-server-api';
import { applyTransformation } from '../lib/hints/transform-api';
import { addBlocksToWorkspace, testBlocks, getTestHints } from '../lib/hints/hint-test-workspace-setup';

import HintManager from '../lib/hint-manager';
import analytics from "../lib/custom-analytics";

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
            // 'onWorkspaceMetricsChange',
            // 'blockListener',
            // 'onWorkspaceUpdate'
            'onMouseEnter',
            'onMouseLeave',
            'onHandleHintMenuItemClick'
        ]);


    }

    onMouseEnter(hintId) {
        const hint = this.props.hintState.hints.find(h => h.hintId === hintId);
        switch (hint.type) {
            case DUPLICATE_CODE_SMELL_HINT_TYPE:
                highlightDuplicateBlocks(hintId, true, this.workspace, this.props.hintManager.getAnalysisInfo());
                break;
        }
    }

    onMouseLeave(hintId) {
        const hint = this.props.hintState.hints.find(h => h.hintId === hintId);
        switch (hint.type) {
            case DUPLICATE_CODE_SMELL_HINT_TYPE:{
                highlightDuplicateBlocks(hintId, false, this.workspace, this.props.hintManager.getAnalysisInfo());
                analytics.event({
                    category: "Feature",
                    action: "View Hints",
                    label: JSON.stringify({projectId:this.props.projectId, withinTutorial: this.props.showTutorial})
                });
                break;
            }
        }
    }
    onHandleHintMenuItemClick(hintId, itemAction) {
        const hint = this.props.hintState.hints.find(h => h.hintId === hintId);

        switch (itemAction) {
            case CONTEXT_MENU_REFACTOR: {
                // applyTransformation(hintId, this.props.vm, this.workspace, this.props.hintManager.getAnalysisInfo());
                this.props.hintManager.applyTransformation(hintId);
                // this.props.removeHint(hintId); //remove hint when the specified action is taken
                analytics.event({
                    category: "Feature",
                    action: "Extract custom block",
                    label: JSON.stringify({projectId:this.props.projectId, withinTutorial: this.props.showTutorial})
                });
                break;
            }
            case CONTEXT_MENU_CODE_SHARE: {
                const block = this.workspace.getBlockById(hint.blockId);
                const entry = getProcedureEntry(block);
                updateShareSnippetOnLocalStorage(entry);

                analytics.event({
                    category: "Feature",
                    action: "Share Custom Block",
                    label: JSON.stringify({projectId:this.props.projectId, withinTutorial: this.props.showTutorial})
                });
                window.open('/authoring');
                break;
            }
        }
    }

    componentDidMount() {
        console.log('mounted');
        this.workspace = ScratchBlocks.getMainWorkspace();
        this.props.setHintManager(new HintManager(
            this.props.vm, this.workspace, this.props.dispatch));
    }

    componentDidUpdate() {
        this.props.hintManager.updateHintState(this.props.hintState)
    }

    render() {
        const componentProps = omit(this.props, ['asset', 'vm']);
        // console.log('hint-overlay', this.props.hintState.options);
        return (
            <HintOverlayComponent
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
        hintManager: state.scratchGui.hintState.hintManager,
        currentTargetId,
        projectId: state.scratchGui.projectState.projectId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onUpdateHint: (hintId, changes) => dispatch(updateHint(hintId, changes)),
        removeHint: hintId => dispatch(removeHint(hintId)),
        putAllHints: hints => dispatch(putAllHints(hints)),
        setHintManager: hm => dispatch(setHintManager(hm)),
        dispatch
    }
};

const ConnectedComponent = connect(
    mapStateToProps, mapDispatchToProps
)(HintOverlay);

export default ConnectedComponent;
