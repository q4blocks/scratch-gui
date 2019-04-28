import React from "react";
import bindAll from 'lodash.bindall';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VM from 'scratch-vm';
import ScratchBlocks from 'scratch-blocks';

import { updateHint, putAllHints, removeHint, setHintManager } from '../reducers/hints-state';
import HintOverlayComponent from '../components/hint-overlay/hint-overlay.jsx';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, CONTEXT_MENU_REFACTOR, CONTEXT_MENU_INFO, CONTEXT_MENU_CODE_SHARE } from '../lib/hints/constants';
import {  getProcedureEntry, highlightDuplicateBlocks } from '../lib/hints/hints-util';

import HintManager from '../lib/hint-manager';
import analytics from "../lib/custom-analytics";

const SNIPPET_LOCAL_STORAGE_KEY = '__snippet__';
const updateShareSnippetOnLocalStorage = snippetEntry => {
    const serializedSnippet = JSON.stringify(snippetEntry);
    localStorage.setItem(SNIPPET_LOCAL_STORAGE_KEY, serializedSnippet);
}

class HintOverlay extends React.Component {
    constructor(props) {
        super(props);

        bindAll(this, [
            'onMouseEnter',
            'onMouseLeave',
            'onHandleHintMenuItemClick'
        ]);
    }

    onMouseEnter(hint) {
        switch (hint.type) {
            case DUPLICATE_CODE_SMELL_HINT_TYPE:
                highlightDuplicateBlocks(hint.hintId, true, this.workspace, this.props.hintManager.getAnalysisInfo());
                break;
        }
    }

    onMouseLeave(hint) {
        switch (hint.type) {
            case DUPLICATE_CODE_SMELL_HINT_TYPE: {
                highlightDuplicateBlocks(hint.hintId, false, this.workspace, this.props.hintManager.getAnalysisInfo());
                analytics.event({
                    category: "Feature",
                    action: "View Hints",
                    label: JSON.stringify({ projectId: this.props.projectId, withinTutorial: this.props.showTutorial })
                });
                break;
            }
        }
    }
    onHandleHintMenuItemClick(hint, itemAction) {
        switch (itemAction) {
            case CONTEXT_MENU_REFACTOR: {
                this.props.hintManager.applyTransformation(hint.hintId);
                analytics.event({
                    category: "Feature",
                    action: "Extract custom block",
                    label: JSON.stringify({ projectId: this.props.projectId, withinTutorial: this.props.showTutorial })
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
                    label: JSON.stringify({ projectId: this.props.projectId, withinTutorial: this.props.showTutorial })
                });
                window.open('/authoring');
                break;
            }
        }
    }

    componentDidMount() {
        this.workspace = ScratchBlocks.getMainWorkspace();
        this.props.setHintManager(new HintManager(
            this.props.vm, this.workspace, this.props.dispatch, {projectId:this.props.projectId}));
    }

    componentDidUpdate() {
        this.props.hintManager.updateHintState(this.props.hintState)
    }

    render() {
        const componentProps = omit(this.props, ['asset', 'vm']);
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
