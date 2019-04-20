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

const modalMaxSize = {
    'default': 500,
    'large': 1000
}

const modalContainerStyle = {
    width: '40vw',
    // height: '30vh',
    padding: '2rem',
    background: 'white',
    borderRadius: '10px',
    textAlign: 'center'
}

const modalContentStyle = {
    marginBottom:'20px',
    lineHeight: 1.6,
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    color: 'rgb(102, 102, 102)'
}

const toolTipContentStyle = {
    
}

const FloaterContent = props => {
    const {instruction, onNextInstruction} = props;
    return !instruction.isModal ? (
        <div style={toolTipContentStyle}>
            {instruction.description?(<span>{instruction.description}</span>):(instruction.customContent&&renderHTML(instruction.customContent))}
            {instruction.checkUserCode ? (<button className={classnames(styles.nextButton)} onClick={() => onNextInstruction()}>Next</button>) : null}
        </div>
    ) :
        (<div style={modalContainerStyle}>
            <div dangerouslySetInnerHTML={{ __html: instruction.description||instruction.customContent }} style={modalContentStyle}></div>
            <button className={classnames(styles.nextButton)} onClick={() => onNextInstruction()}>{instruction.customizedNextButtonText || 'Next'}</button>
        </div>);
}

const TutorialFloater = props => {
    const { currentStep, currentInstruction, onNextInstruction, instruction } = props;
    return (
        <Floater
            content={!instruction.isModal && <FloaterContent instruction={instruction} onNextInstruction={onNextInstruction}/>}
            component={instruction.isModal &&<FloaterContent instruction={instruction} onNextInstruction={onNextInstruction}/>}
            disableAnimation
            event="hover"
            key={`step_${currentStep}_${currentInstruction}`}
            offset={5}
            placement={instruction.floaterPlacement ? instruction.floaterPlacement : "auto"}
            open={true}
            styles={{
                tooltip: {
                    maxWidth: modalMaxSize[instruction.modalSize || 'default'],
                    width: "100%"
                },
                options: { zIndex: 550 }
            }}
            getPopper={popper => {
                setTimeout(() => popper.instance.scheduleUpdate(), 0);
            }}
        >
            <span style={beaconStyle} className="BeaconTarget">◉</span>
        </Floater>
    );
}

const Tutorial = props => {
    const { target, currentStep, currentInstruction, steps} = props;
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

            {props.isDevMode && <button onClick={() => {
                const testInstructionIdx =  instructions.findIndex(inst=>inst.test);
                props.onMarkInstructionComplete(0, testInstructionIdx-1);
            }}>Fast forward to test instruction</button>}

            <Popper referenceElement={target ? target : virtualReferenceElement} placement={instruction.beaconAlign}>
                {({ ref, style, placement, arrowProps, scheduleUpdate }) => (

                    <div ref={ref} style={{ ...style, zIndex: 1000 }} data-placement={placement}>
                        <TutorialFloater {...props} instruction={instruction} />
                        <div ref={arrowProps.ref} style={{ ...arrowProps.style }} />
                    </div>
                )}
            </Popper>
            {instruction.isModal && <div className='overlay' />}

        </div>
    )
};

export default Tutorial;

