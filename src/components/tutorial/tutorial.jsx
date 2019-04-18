import React from 'react';
import '!style-loader!css-loader!../../css/steps-index.css';
import '!style-loader!css-loader!../../css/steps-iconfont.css';
import '!style-loader!css-loader!./tutorial.css';
import styles from './tutorial.css';
import Steps, { Step } from 'rc-steps';

import classnames from 'classnames';

import { Popper } from 'react-popper';
import Floater from 'react-floater';
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


const Tutorial = props => {
    const { target, currentStep, currentInstruction, steps, onNextInstruction } = props;
    const instructions = steps[currentStep].instructions;
    const instruction = instructions[currentInstruction];
    return (
        <div className='Tutorial'>
            <Steps current={currentStep} direction={'horizontal'} >
                {steps.map((step, key) => (
                    <Steps.Step key={key} title={step.title} description={step.description} />
                ))}
            </Steps>
            {props.isDevMode && <button onClick={()=>{
                props.onMarkInstructionComplete(0,6);
                }}>step2</button>}
            <Popper referenceElement={target ? target : virtualReferenceElement} placement={instruction.beaconAlign}>
                {({ ref, style, placement, arrowProps, scheduleUpdate }) => (

                    <div ref={ref} style={{ ...style, zIndex: 1000 }} data-placement={placement}>
                        <Floater
                            content={!instruction.isModal ? (
                                <div>
                                    {instruction.description}
                                    {instruction.checkUserCode ? (<button className={classnames(styles.nextButton)} onClick={() => onNextInstruction()}>Next</button>) : null}
                                </div>
                            ) :
                                (<div>
                                    <p>{instruction.description}</p>
                                    <button className={classnames(styles.nextButton)} onClick={() => onNextInstruction()}>{instruction.customizedNextButtonText || 'Next'}</button>
                                </div>)
                            }
                            disableAnimation
                            event="hover"
                            key={`step_${currentStep}_${currentInstruction}`}
                            offset={5}
                            placement={instruction.floaterPlacement ? instruction.floaterPlacement : "auto"}
                            open={true}
                            styles={{
                                tooltip: {
                                    maxWidth: 500,
                                    width: "100%"
                                },
                                options: { zIndex: 550 }
                            }}
                            getPopper={popper => {
                                setTimeout(() => popper.instance.scheduleUpdate(), 0);
                            }}

                        >
                            <span style={beaconStyle} className="BeaconTarget">
                                ◉
                            </span>
                        </Floater>
                        <div ref={arrowProps.ref} style={{ ...arrowProps.style }} />
                    </div>
                )}
            </Popper>
            {instruction.isModal && <div className='overlay' />}

        </div>
    )
};

export default Tutorial;

