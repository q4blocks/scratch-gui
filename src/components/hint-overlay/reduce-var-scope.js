
import React from 'react';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import Floater from 'react-floater';
import styles from './selection.css';
import HintIcon from './hint-icon.jsx';
import hintIconSvg from "./light-bulb-icon.svg";
import {CloseButton} from './common-component.jsx';
import { applyBlocksTransformation } from '../../lib/hints/transform-api';

class ReduceVarScopeHint extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
            showRefactoringControl: false,
            showHintMessage: false
        }
        bindAll(this, [
            'onHintIconClick',
            'onMouseEnter',
            'onMouseLeave',
            'shouldShowFloater',
            'getFloaterComponent',
            'createOnClose',
            'onRefactoringClick'
        ]);
    }

    onHintIconClick() {
        this.setState({
            showHintMessage: false,
            clicked: true,
            showRefactoringControl: true
        });
    }

    onMouseEnter() {
        if (!this.state.clicked) {
            this.setState({ showHintMessage: true });
        }
    }

    onMouseLeave() {
        if (!this.state.clicked) {
            this.setState({ showHintMessage: false });
        }
    }

    createOnClose() {
        return () => {
            this.setState({ showRefactoringControl: !this.state.showRefactoringControl, clicked: false, showHintMessage: false });
        }
    }

    shouldShowFloater() {
        return this.state.showHintMessage || this.state.showRefactoringControl;
    }

    getFloaterComponent() {
        const HintMessage = props => (
            <div className={styles.hintMessage}>
                <h3>A variable for this sprite only?</h3>
                <p>The variable has been assigned value to from this sprite only. <br/>
                    Consider making this variable available to this sprite only.
                Click <img className={styles.msgHintIcon} src={hintIconSvg} /> to see how.</p>
            </div>
        );

        const RefactoringComponent = props => (
            <div className={styles.hintMessage}>
                <CloseButton onClose={this.createOnClose()} />
                <button onClick={this.onRefactoringClick}>Reduce Variable Scope</button>
            </div>
        );

        if (this.state.showHintMessage) {
            return <HintMessage />;
        } else if (this.state.showRefactoringControl) {
            return <RefactoringComponent />;
        } else {
            return props => <div></div>;
        }
    }

    onRefactoringClick(){
        const {workspace, hint} = this.props;
        let actions = this.props.hintManager.getAnalysisInfo().records[hint.hintId].refactoring.actions;
        applyBlocksTransformation(workspace, actions);
    }

    render() {
        const h = this.props.hint;
        return (
            <Floater
                component={this.getFloaterComponent()}
                open={this.shouldShowFloater()}
                target={".hint_icon_" + h.hintId}
                placement="right"
                offset={30}
                getPopper={(popper, origin) => {
                    this.props.hintManager.setUpdateTrackingCallback(h.hintId, () => {
                        popper.instance.scheduleUpdate();
                    });
                }}
                disableAnimation={true}
                styles={{
                    arrow: {
                        display: this.shouldShowFloater() ? 'inline-flex' : 'none',
                    }
                }}
            >
                <HintIcon key={h.hintId} hint={h} options={this.props.hintState.options}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    onMouseClick={this.onHintIconClick}
                />
            </Floater>
        );
    }
}

export default ReduceVarScopeHint;