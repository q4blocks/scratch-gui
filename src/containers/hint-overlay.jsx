import React from "react";
import bindAll from 'lodash.bindall';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VM from 'scratch-vm';
import ScratchBlocks from 'scratch-blocks';

import { updateHint, putAllHints, removeHint, setHintManager, setHintOptions } from '../reducers/hints-state';
import HintOverlayComponent from '../components/hint-overlay/hint-overlay.jsx';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, RENAMABLE_CUSTOM_BLOCK, CONTEXT_MENU_RENAME_BLOCK, CONTEXT_MENU_REFACTOR, CONTEXT_MENU_INFO, CONTEXT_MENU_CODE_SHARE, DUPLICATE_CONSTANT_HINT_TYPE } from '../lib/hints/constants';
import { getProcedureEntry, highlightDuplicateBlocks, updateHighlighting, REMOVE_LAST, ADD_TO_LAST, MOVE_UP, MOVE_DOWN } from '../lib/hints/hints-util';

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
    }

    componentDidMount() {
        this.workspace = ScratchBlocks.getMainWorkspace();
        const options = {
            projectId: this.props.projectId,
            userStudyMode: this.props.userStudyMode,
            serviceEndpoint: this.props.serviceEndpoint
        }
        this.props.setHintManager(new HintManager(
            this.props.vm, this.workspace, this.props.dispatch, this.props.hintState,
            options));
        //quick fix for tutorial mode
        //auto switch on if showQualityHint is passed from parent
        this.props.dispatch(setHintOptions({
            showQualityHint: this.props.showQualityHint || false
        }));
    }

    componentDidUpdate() {
        this.props.hintManager.updateHintState(this.props.hintState);
        this.props.hintManager.updateOptions({ isTutorialMode: this.props.showTutorial });
    }

    render() {
        const componentProps = omit(this.props, ['asset', 'vm']);
        return (
            <HintOverlayComponent
                onHandleHintMenuItemClick={this.onHandleHintMenuItemClick}
                workspace={this.workspace}
                vm={this.props.vm}
                {...componentProps}
            />
        );
    }
}

HintOverlay.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = (state, props) => {
    const targets = state.scratchGui.targets;
    const currentTargetId = targets.editingTarget;
    return {
        vm: state.scratchGui.vm,
        hintState: state.scratchGui.hintState,
        hintManager: state.scratchGui.hintState.hintManager,
        currentTargetId,
        projectId: state.scratchGui.projectState.projectId,
        showTutorial: props.showTutorial || state.scratchGui.customMenu.showTutorial,
        deckId: state.scratchGui.customCards.activeDeckId
        //fix probably not the right place to put showTutorial in customMenu; should be part of state.scratchGui.tutorial
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
