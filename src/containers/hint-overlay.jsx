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

import Selection from "../lib/hints/selection";
import { select } from "format-message";



const SNIPPET_LOCAL_STORAGE_KEY = '__snippet__';
const updateShareSnippetOnLocalStorage = snippetEntry => {
    const serializedSnippet = JSON.stringify(snippetEntry);
    localStorage.setItem(SNIPPET_LOCAL_STORAGE_KEY, serializedSnippet);
}

class HintOverlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clicked: false,
            open: false,
            selection: null
        }

        bindAll(this, [
            'onMouseEnter',
            'onMouseLeave',
            'onHandleHintMenuItemClick',
            'onHintIconClick',
            'createOnClose',
            'createOnBlockSelectAction'
        ]);
    }

    createOnBlockSelectAction(h, action) {
        const { hints } = this.props.hintState;
        return () => {
            this.handleBlockSelection(h,action);
        }
    }

    // https://repl.it/repls/WaterloggedKindQuote
    handleBlockSelection(hint,action) {
        const { selection } = this.state;
        switch(action){
            case REMOVE_LAST: {
                selection.removeLast();
                break;
            }
            case ADD_TO_LAST: {
                selection.addToLast();
                break;
            }
            case MOVE_UP: {
                selection.moveUp();
                break;
            }
            case MOVE_DOWN: {
                selection.moveDown();
                break;
            }
        }
        // let currentSelection = selection?selection.getUpdatedFragments():record.smell.fragments;
        //remove last
        // currentSelection = [{ "stmtIds": ["u0Hbl_$!O?.%ZF,^9zS#", "/FWW9+/trz,[dCr}KQ4:", "L0;%%}1bI}w~,ivJC@SI", "-ZAPxY0ur^|mgMMPN5SY", "tFwGzx|MFJ:%LACGyxVg"] }, { "stmtIds": ["LXwA[VJyg1rza;F$R`$/", "=3U}RCYakN,it35w{%ce", "|1yB]x7`h.hi6QtA1FW?", "rP0yU%a`)#0-H_[ydMCX", "(4O$sHR,g!3GAhtHeAO;"] }];

        this.setState({ selection: selection });
    }

    createOnClose(h) {
        return () => {
            this.setState({ open: !this.state.open, clicked: false, selection: null });
            // this.onMouseLeave(h);
            this.workspace.removeHighlightBox();
        }
    }

    onHintIconClick(hint) {
        const analysisInfo = this.props.hintManager.getAnalysisInfo();
        const record = analysisInfo['records'][hint.hintId];
        this.setState({ clicked: true, open: true, selection: new Selection(record.smell.fragments) });
    }

    onMouseEnter(hint) {
        switch (hint.type) {
            case DUPLICATE_CODE_SMELL_HINT_TYPE:
                highlightDuplicateBlocks(hint.hintId, true, this.workspace, this.props.hintManager.getAnalysisInfo());
                break;
            case DUPLICATE_CONSTANT_HINT_TYPE:
                hint.valueIds.forEach(id => this.workspace.highlightField(id));
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
            case DUPLICATE_CONSTANT_HINT_TYPE:
                hint.valueIds.forEach(id => this.workspace.unHighlightField(id));
                break;
        }
    }
    onHandleHintMenuItemClick(hint, itemAction) {
        switch (itemAction) {
            case CONTEXT_MENU_REFACTOR: {
                const res = this.props.hintManager.applyTransformation(hint.hintId);
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
            case CONTEXT_MENU_RENAME_BLOCK: {
                ScratchBlocks.Procedures.editProcedureCallback_(this.workspace.getBlockById(hint.blockId));
                break;
            }
        }
    }



    componentDidMount() {
        this.workspace = ScratchBlocks.getMainWorkspace();
        const options = {
            projectId: this.props.projectId,
            userStudyMode: this.props.userStudyMode
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
        //update highlighting for block selection
        if (this.state.selection) {
            updateHighlighting(this.workspace, this.state.selection.getUpdatedFragments());
        }
    }

    render() {
        const componentProps = omit(this.props, ['asset', 'vm']);
        return (
            <HintOverlayComponent
                onHandleHintMenuItemClick={this.onHandleHintMenuItemClick}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                onHandleUserSelection={this.onHandleUserSelection}
                onHintIconClick={this.onHintIconClick}
                createOnClose={this.createOnClose}
                createOnBlockSelectAction={this.createOnBlockSelectAction}
                clicked={this.state.clicked}
                open={this.state.open}
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
        showTutorial: props.showTutorial || state.scratchGui.customMenu.showTutorial
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
