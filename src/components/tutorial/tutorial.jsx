import React from 'react';
import '!style-loader!css-loader!../../css/steps-index.css';
import '!style-loader!css-loader!../../css/steps-iconfont.css';

import Steps, { Step } from 'rc-steps';

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
            height: 10,
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


const steps = [
    {
        title: 'Create a custom block',
        descriptions: `Create a custom block and name it "Swing`
    }, {
        title: 'Use the custom block',
        description: `Copy the highlighted blocks`
    }, {
        title: 'Add parameter to the custom block',
        description: `Allow your custom block to perform a variation`
    }
]

const target = document.querySelector(".scratchCategoryMenu > div:nth-child(9)");

const Tutorial = props => (
    <div className={'firstStep'}>
        <Steps current={0} direction={'horizontal'}>
            {steps.map((step, key) => (
                <Steps.Step key={key} title={step.title} description={step.descriptions} />
            ))}
        </Steps>

        <Popper referenceElement={props.target ? props.target : virtualReferenceElement} placement="right">
            {({ ref, style, placement, arrowProps }) => (
                
                    <div ref={ref} style={{...style, zIndex:100}} data-placement={placement}>
                        <span style={{ color: '#f04', fontSize: 34, zIndex: 100 }}>◉</span>
                        <div ref={arrowProps.ref} style={{...arrowProps.style}} />
                    </div>
            )}
        </Popper>


    </div>
);

export default Tutorial;

