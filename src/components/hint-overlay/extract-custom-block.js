import React from 'react';
import bindAll from 'lodash.bindall';
import Floater from 'react-floater';
import HintIcon from './hint-icon.jsx';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, DUPLICATE_CONSTANT_HINT_TYPE } from "../../lib/hints/constants";
import { highlightDuplicateBlocks, updateHighlighting, REMOVE_LAST, ADD_TO_LAST, MOVE_UP, MOVE_DOWN } from '../../lib/hints/hints-util';
import { sendRefactoringAnalysisReq, getProgramXml } from '../../lib/hints/analysis-server-api';
import { applyBlocksTransformation } from '../../lib/hints/transform-api';

import styles from './selection.css';
import classNames from 'classnames';

//button
import removeButton from './remove-button.svg';
import addButton from './add-button.svg';
import moveUpButton from './move-up-button.svg';
import moveDownButton from './move-down-button.svg';
import extractButton from './extract-button.svg';
import closeIcon from './icon--close.svg';

// improve or remove?
import animatedAdd from './animated-add.gif';
import animatedRemove from './animated-remove.gif';
import animatedMoveUp from './animated-up.gif';
import animatedMoveDown from './animated-down.gif';
import defaultPreview from './default.gif';

import Selection from "../../lib/hints/selection";
import analytics from "../../lib/custom-analytics";
import controls from '../../containers/controls.jsx';

import hintIcon from "./light-bulb-icon.svg";

const ActionPreview = ({ type }) => {
    const mapping = {
        [ADD_TO_LAST]: animatedAdd,
        [REMOVE_LAST]: animatedRemove,
        [MOVE_UP]: animatedMoveUp,
        [MOVE_DOWN]: animatedMoveDown,
        default: defaultPreview
    };

    return <img src={mapping[type]} />
}

const ActionButton = ({ onActionClick, type, actionName, onMouseEnterAction, onMouseLeaveAction }) => {
    const mapping = {
        [REMOVE_LAST]: removeButton,
        [ADD_TO_LAST]: addButton,
        [MOVE_UP]: moveUpButton,
        [MOVE_DOWN]: moveDownButton,
        "Extract": extractButton,
        default: removeButton
    }
    return (<div onClick={onActionClick}
        onMouseEnter={onMouseEnterAction}
        onMouseLeave={onMouseLeaveAction}
    >{<img src={mapping[type]} className={styles.actionButton} />}
    </div>)
}

const CloseButton = props => (
    <div className={classNames(styles.floaterHeader)}>
        <div className={styles.closeButton}>
            <img className={classNames(styles.small, styles.closeIcon)} src={closeIcon} onClick={props.onClose} />
        </div>
    </div>
)

const ControlComponent = (props) => {
    return (
        <div className={styles.floaterLayout}>

            <div className={classNames(styles.body)}>

                <div className={classNames(styles.selectActionContainer)}>
                    <CloseButton onClose={props.onClose} />
                    <ActionButton actionName="MoveUp"
                        type={MOVE_UP}
                        onActionClick={props.onMoveUp}
                        onMouseEnterAction={props.onMouseEnterAction(MOVE_UP)}
                        onMouseLeaveAction={props.onMouseLeaveAction(MOVE_UP)}
                    />
                    <ActionButton actionName="MoveDown"
                        type={MOVE_DOWN}
                        onMouseEnterAction={props.onMouseEnterAction(MOVE_DOWN)}
                        onMouseLeaveAction={props.onMouseLeaveAction(MOVE_DOWN)}
                        onActionClick={props.onMoveDown}
                    />
                    <ActionButton actionName="AddToLast"
                        type={ADD_TO_LAST}
                        onActionClick={props.onAddToLast}
                        onMouseEnterAction={props.onMouseEnterAction(ADD_TO_LAST)}
                        onMouseLeaveAction={props.onMouseLeaveAction(ADD_TO_LAST)}
                    />
                    <ActionButton actionName="RemoveLast"
                        type={REMOVE_LAST}
                        onActionClick={props.onRemoveLast}
                        onMouseEnterAction={props.onMouseEnterAction(REMOVE_LAST)}
                        onMouseLeaveAction={props.onMouseLeaveAction(REMOVE_LAST)}
                    />
                    <ActionButton actionName="Extract"
                        type={"Extract"}
                        onActionClick={props.onCustomBlockExtractClick}
                        onMouseEnterAction={() => { }}
                        onMouseLeaveAction={() => { }}
                    />
                    {/* <div className={classNames(styles.preview, styles.outline)}>
                        <ActionPreview type={props.currentActionHovered || 'default'} />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

class ExtractCustomBlockHint extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
            showRefactoringControl: false,
            selection: null,
            currentActionHovered: null,
            showHintMessage: false
        }
        bindAll(this, [
            'onMouseEnter',
            'onMouseLeave',
            'onHintIconClick',
            'handleBlockSelection',
            'onCustomBlockExtractClick',
            'createOnClose',
            'onMouseEnterAction',
            'onMouseLeaveAction',
        ]);
    }

    onMouseEnter(hint) {
        switch (hint.type) {
            case DUPLICATE_CODE_SMELL_HINT_TYPE:
                highlightDuplicateBlocks(hint.hintId, true, this.props.workspace, this.props.hintManager.getAnalysisInfo());
                break;
            case DUPLICATE_CONSTANT_HINT_TYPE:
                hint.valueIds.forEach(id => this.props.workspace.highlightField(id));
                break;
        }
        if (!this.state.clicked) {
            this.setState({ showHintMessage: true });
        }
    }

    onMouseLeave(hint) {
        switch (hint.type) {
            case DUPLICATE_CODE_SMELL_HINT_TYPE: {
                highlightDuplicateBlocks(hint.hintId, false, this.props.workspace, this.props.hintManager.getAnalysisInfo());
                analytics.event({
                    category: "Feature",
                    action: "View Hints",
                    label: JSON.stringify({ projectId: this.props.projectId, withinTutorial: this.props.showTutorial })
                });
                break;
            }
            case DUPLICATE_CONSTANT_HINT_TYPE:
                hint.valueIds.forEach(id => this.props.workspace.unHighlightField(id));
                break;
        }
        if (!this.state.clicked) {
            this.setState({ showHintMessage: false });
        }
    }

    onMouseEnterAction(type) {
        return () => {
            this.setState({ currentActionHovered: type })
        }
    }

    onMouseLeaveAction(type) {
        return () => {
            this.setState({ currentActionHovered: null })
        }
    }

    createOnClose(h) {
        return () => {
            this.setState({ showRefactoringControl: !this.state.showRefactoringControl, clicked: false, selection: null, showHintMessage: false });
            this.props.workspace.removeHighlightBox();
        }
    }

    onHintIconClick(hint) {
        const analysisInfo = this.props.hintManager.getAnalysisInfo();
        const record = analysisInfo['records'][hint.hintId];
        this.setState({
            showHintMessage: false,
            clicked: true,
            showRefactoringControl: true,
            selection: new Selection(record.smell.fragments)
        });
    }

    componentDidUpdate() {
        if (this.state.selection) {
            updateHighlighting(this.props.workspace, this.state.selection.getSelectedFragments());
        }
    }


    handleBlockSelection(hint, action) { // https://repl.it/repls/WaterloggedKindQuote
        const { selection } = this.state;
        selection.apply(action);
        this.setState({ selection: selection });
    }

    createOnBlockSelectAction(h, action) {
        const { hints } = this.props.hintState;
        return () => {
            this.handleBlockSelection(h, action);
        }
    }

    onCustomBlockExtractClick() {
        const fragments = this.state.selection.getSelectedFragments();
        this.setState({ selection: null });
        Promise.resolve()
            .then(() => getProgramXml(this.props.vm))
            .then(xml => {
                const request = {
                    type: "ExtractCustomBlock",
                    projectId: this.props.projectId,
                    xml: xml,
                    params: JSON.stringify({
                        target: "Square",
                        fragments: Object.values(fragments).map(entry => entry.stmtIds)
                    }),
                    isProductionMode: false
                }
                // console.log(JSON.stringify(request));
                return sendRefactoringAnalysisReq(request);
            })
            .then(res => {
                // this.workspace.removeHighlightBox();
                if (res.result.metadata.success) {
                    applyBlocksTransformation(this.props.workspace, res.result.actions);
                }
            });
    }


    render() {
        const h = this.props.hint;
        const { showHintMessage, showRefactoringControl } = this.state;
        let component = null;
        let empty = props => (<div></div>);
        if (showRefactoringControl) {
            component = (
                <ControlComponent
                    onClose={this.createOnClose(h)}
                    onRemoveLast={this.createOnBlockSelectAction(h, REMOVE_LAST)}
                    onAddToLast={this.createOnBlockSelectAction(h, ADD_TO_LAST)}
                    onMoveUp={this.createOnBlockSelectAction(h, MOVE_UP)}
                    onMoveDown={this.createOnBlockSelectAction(h, MOVE_DOWN)}
                    onMouseEnterAction={this.onMouseEnterAction}
                    onMouseLeaveAction={this.onMouseLeaveAction}
                    currentActionHovered={this.state.currentActionHovered}
                    onCustomBlockExtractClick={this.onCustomBlockExtractClick}
                />);
        } else if (showHintMessage) {
            component = props => (
                <div className={styles.hintMessage}>
                    <h3>Reusable Repeats!</h3>
                    <p>You can extract a custom block from these repeated program parts.
                    Click <img className={styles.msgHintIcon} src={hintIcon} /> to see options!
                    </p>
                </div>
            );
        }
        const shouldShow = showHintMessage || showRefactoringControl;
        return (
            <Floater
                component={component ? component : empty}
                target={".hint_icon_" + h.hintId}
                placement="right"
                offset={30}
                open={shouldShow}
                getPopper={(popper, origin) => {
                    window.popper = popper;
                    this.props.hintManager.addUpdateTrackingCallback(() => {
                        popper.instance.scheduleUpdate();
                    });
                }}
                disableAnimation={false}
                styles={{
                    arrow: {
                        display: shouldShow ? 'inline-flex' : 'none',
                    }
                }}
            >
                <HintIcon key={h.hintId} hint={h} options={this.props.hintState.options}
                    onMouseEnter={() => { this.onMouseEnter(h) }}
                    onMouseLeave={() => { !this.state.clicked && this.onMouseLeave(h) }}
                    onMouseClick={() => {
                        this.onHintIconClick(h);
                    }} // same for now
                />
            </Floater>
        )
    }
}

export {
    ControlComponent,
    ExtractCustomBlockHint
}