import React from 'react';
import '!style-loader!css-loader!../../css/steps-index.css';
import '!style-loader!css-loader!../../css/steps-iconfont.css';

import Steps, { Step } from 'rc-steps';

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

const Tutorial = props => (
    <Steps current={0} direction={'horizontal'}>
        {steps.map(step => (
            <Steps.Step title={step.title} description={step.descriptions} />
        ))}
    </Steps>
);

export default Tutorial;

