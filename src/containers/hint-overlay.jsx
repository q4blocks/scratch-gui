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
        ]);


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
