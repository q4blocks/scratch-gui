
import React from 'react';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import Floater from 'react-floater';
import styles from './selection.css';
import HintIcon from './hint-icon.jsx';
import hintIconSvg from "./light-bulb-icon.svg";
import { CloseButton } from './common-component.jsx';
// import { applyBlocksTransformation } from '../../lib/hints/transform-api';
import {DUPLICATE_SPRITE_HINT_TYPE} from '../../lib/hints/constants.js';

class ExtractParentSprite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            showHintMessage: !this.state.showHintMessage,
            showRefactoringControl: !this.state.showRefactoringControl
        });
    }

    onMouseEnter() {
        if (!this.state.showRefactoringControl) {
            this.setState({ showHintMessage: true });
        }
    }

    onMouseLeave() {
        if (this.state.showHintMessage) {
            this.setState({ showHintMessage: false });
        }
    }

    createOnClose() {
        return () => {
            this.setState({ showRefactoringControl: !this.state.showRefactoringControl, showHintMessage: false });
        }
    }

    shouldShowFloater() {
        return this.state.showHintMessage || this.state.showRefactoringControl;
    }

    onRefactoringClick(){
        const {hint} = this.props;
        this.props.hintManager.applyTransformation(hint.hintId).then(()=>{
            this.props.hintManager.clearAll(DUPLICATE_SPRITE_HINT_TYPE);
        });
    }

    getFloaterComponent() {
        const HintMessage = props => (
            <div className={styles.hintMessage}>
                <h3>Sprite Cloneables</h3>
                <p>Consider creating clones from this sprite instead.
                Click <img className={styles.msgHintIcon} src={hintIconSvg} /> to see how.</p>
            </div>
        );

        const RefactoringComponent = props => (
            <div className={styles.hintControlStepGuide}>
                <CloseButton onClose={this.createOnClose()} />
                <button onClick={this.onRefactoringClick}>Extract a Parent Sprite</button>
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

    componentDidUpdate(){
        this.popper&&this.popper.instance.scheduleUpdate();
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
                    this.popper = popper;
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

export default ExtractParentSprite;