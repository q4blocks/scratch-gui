import React from 'react';
import '!style-loader!css-loader!../../css/steps-index.css';
import '!style-loader!css-loader!../../css/steps-iconfont.css';
import '!style-loader!css-loader!./tutorial.css';
import styles from './tutorial.css';
import Steps, { Step } from 'rc-steps';

import classnames from 'classnames';

import { Popper } from 'react-popper';
import Floater from 'react-floater';
import renderHTML from 'react-render-html';

import SurveyComponent from './survey.jsx';

import ReactModal from 'react-modal';


class VirtualReference {
    getBoundingClientRect() {
        return {
            top: 10,
            left: 10,
            bottom: 20,
            right: 100,
            width: 90,
            height: 10
        };
    }

    get clientWidth() {
        return this.getBoundingClientRect().width;
    }

    get clientHeight() {
        return this.getBoundingClientRect().height;
    }
}

// This is going to create a virtual reference element
// positioned 10px from top and left of the document
// 90px wide and 10px high
const virtualReferenceElement = new VirtualReference();

const beaconStyle = {
    animation: 'BeaconFlick 1s infinite',
    color: '#7FB800',
    fontSize: 32,
    cursor: 'default'
}

const modalSize = {
    'default': '30vw',
    'medium': '40vw',
    'large': '50vw'
}

const getModalContainerStyle = (size) => ({
    width: modalSize[size || 'default'],
    // height: '30vh',
    padding: '2rem',
    background: 'white',
    borderRadius: '10px',
    textAlign: 'center',
    lineHeight: 1.6,
    color: 'rgb(102, 102, 102)',
    fontSize: '14px',
    boxSizing: 'border-box'
})

const toolTipContentStyle = {

}

const FloaterContent = props => {
    const { instruction, onNextInstruction } = props;
    return !instruction.isModal ? (
        <div style={toolTipContentStyle}>
            {instruction.description ? (<span>{instruction.description}</span>) : (instruction.customContent && renderHTML(instruction.customContent))}
            {instruction.checkUserCode ? (<button className={classnames(styles.nextButton)}
                onClick={() => {
                    if (props.showSurvey && props.showSurveyCallBack) {
                        props.showSurveyCallBack();
                    } else {
                        onNextInstruction();
                    }
                }}>Next</button>) : null}
        </div>
    ) :
        (<div style={getModalContainerStyle(instruction.modalSize)}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}
                dangerouslySetInnerHTML={{ __html: instruction.description || instruction.customContent }}>
            </div>
            <button className={classnames(styles.nextButton)} onClick={() => onNextInstruction()}>{instruction.customizedNextButtonText || 'Next'}</button>
        </div>);
}

const TutorialFloater = props => {
    const { currentStep, currentInstruction, onNextInstruction, instruction, showSurveyCallBack } = props;
    return (
        <Floater
            content={!instruction.isModal && <FloaterContent instruction={instruction} onNextInstruction={onNextInstruction} />}
            component={instruction.isModal && <FloaterContent instruction={instruction} onNextInstruction={onNextInstruction} showSurveyCallBack={showSurveyCallBack} />}
            disableAnimation
            event="hover"
            key={`step_${currentStep}_${currentInstruction}`}
            offset={5}
            placement={instruction.floaterPlacement ? instruction.floaterPlacement : "auto"}
            open={true}
            styles={{
                tooltip: {
                    width: "100%"
                },
                options: {
                    zIndex: 550
                }
            }}
            getPopper={popper => {
                setTimeout(() => popper.instance.scheduleUpdate(), 0);
            }}
        >
            <span style={beaconStyle} className="BeaconTarget">◉</span>
        </Floater>
    );
}

const GotoStep = ({  steps, onMarkInstructionComplete }) => {
    return (<div className='stepGotos'>{
        steps.map((step, stepKey) => {
            return !step.instructions ? null :
                step.instructions.map((inst, instKey) => {
                    return inst.test && (<button key={stepKey + '' + instKey} onClick={() => {
                        onMarkInstructionComplete(stepKey, instKey - 1);
                    }}>Go to{stepKey}.{instKey}</button>)
                })
        })

    }</div>)
}

class Tutorial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finalModalHasClosed: false
        }
        this.handleFinalModalClose = this.handleFinalModalClose.bind(this);
    }

    handleFinalModalClose() {
        this.setState({
            finalModalHasClosed: true
        });
        this.props.showSurveyCallBack('post-tutorial-session');
    }
    render() {
        const { target, currentStep, currentInstruction, steps } = this.props;
        const instructions = steps[currentStep].instructions;
        const instruction = instructions[currentInstruction];

        return (
            <div className='Tutorial'>
                <Steps current={currentStep} direction={'horizontal'} >
                    {steps.map((step, key) => (
                        <Steps.Step key={key} title={step.title}
                        // description={step.description} 
                        />
                    ))}
                </Steps>

                {this.props.tutorialDevMode && <GotoStep steps={steps} onMarkInstructionComplete={this.props.onMarkInstructionComplete} />}

                {!instruction.showSurvey && <Popper referenceElement={target ? target : virtualReferenceElement} placement={instruction.beaconAlign}>
                    {({ ref, style, placement, arrowProps }) => (
                        <div ref={ref} style={{ ...style, zIndex: 1000 }} data-placement={placement}>
                            {(instruction.isIntermediateInstruction || instruction.autoNext) ? null : <TutorialFloater {...this.props} instruction={instruction} />}
                            <div ref={arrowProps.ref} style={{ ...arrowProps.style }} />
                        </div>
                    )}
                </Popper>}
                {instruction.isModal && !instruction.showSurvey && <div className='overlay' />}
                {instruction.showSurvey && (
                    <ReactModal isOpen={!this.state.finalModalHasClosed} className="ReactModal" overlayClassName="ReactOverlay">
                        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}
                            dangerouslySetInnerHTML={{ __html: instruction.description || instruction.customContent }}>
                        </div>
                        <button className={classnames(styles.nextButton)}
                            onClick={()=>this.handleFinalModalClose()}>{instruction.customizedNextButtonText}</button>
                    </ReactModal>)
                }

            </div>
        )
    };
}

export default Tutorial;

