
import React from 'react';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import Floater from 'react-floater';
import styles from './selection.css';
import HintIcon from './hint-icon.jsx';
import hintIconSvg from "./light-bulb-icon.svg";
import {CloseButton} from './common-component.jsx';
import { applyBlocksTransformation } from '../../lib/hints/transform-api';
import {DUPLICATE_CONSTANT_HINT_TYPE} from '../../lib/hints/constants';

import refactorDemoAbstract from './extract-const-before-after.png';

class ExtractConstantHint extends React.Component {
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
            // showHintMessage: false,
            // clicked: true,
            // showRefactoringControl: true
            showHintMessage: !this.state.showHintMessage,
            showRefactoringControl: !this.state.showRefactoringControl
        });
    }

    onMouseEnter() {
        // if (!this.state.clicked) {
        if (!this.state.showRefactoringControl) {
            this.setState({ showHintMessage: true });
        }
        this.props.hint.valueIds.forEach(id => this.props.workspace.highlightField(id));
    }

    onMouseLeave() {
        if (!this.state.clicked) {
            this.setState({ showHintMessage: false });
        }
        this.props.hint.valueIds.forEach(id => this.props.workspace.unHighlightField(id));
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
                <h3>Reusable Constant Values!</h3>
                <p>Consider creating a constant variable for these constant values and giving it a descriptive name.
                Click <img className={styles.msgHintIcon} src={hintIconSvg} /> to see how.</p>
            </div>
        );

        const RefactoringComponent = props => (
            <div className={styles.demoAbstractContainer}>
                <CloseButton onClose={this.createOnClose()} />
                <h3>Extract Constant Variable</h3>
                <img src={refactorDemoAbstract} className={styles.imgDemoAbstract}/>
                <button onClick={this.onRefactoringClick}>Extract Constant</button>
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
        applyBlocksTransformation(workspace, actions).then(()=>{
            this.props.hintManager.clearAll(DUPLICATE_CONSTANT_HINT_TYPE);
            this.props.hintManager.generateHints(DUPLICATE_CONSTANT_HINT_TYPE);
        });
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

export default ExtractConstantHint;