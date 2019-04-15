import React from 'react';
import TutorialComponent from '../components/tutorial/tutorial.jsx';

const steps = [
    {
        title: 'Create a custom block',
        description: `Create a custom block and name it "Swing`,
        instructions: [
            {
                description: `Let's get started!`,
                selectorExpr: `document.querySelectorAll("div.rc-steps-item-description")[0]`,
                isModal: true,
                beaconAlign: 'right-start'
            },
            {
                description: `Click My Blocks`,
                selectorExpr: `document.querySelector(".scratchCategoryMenu > div:nth-child(9)")`
            },
            {
                description: `Click Make a Block`,
                selectorExpr: `document.querySelectorAll(".blocklyFlyoutButton")[2]`
            }
        ]
    }, {
        title: 'Use the custom block',
        description: `Copy the highlighted blocks`
    }, {
        title: 'Add parameter to the custom block',
        description: `Allow your custom block to perform a variation`
    }
]

class Tutorial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            target: null
            , steps: steps, currentStep: 0, currentInstruction: 0
        };

        this.onNextInstruction = this.onNextInstruction.bind(this);
    }

    onNextInstruction(delay=0) {
        const { steps, currentStep, currentInstruction } = this.state;
        let nextStep = currentStep, nextInstruction;
        if (currentInstruction < steps[currentStep].instructions.length) {
            nextInstruction = currentInstruction + 1;
        } else if (currentStep < steps.length) {
            nextStep = currentStep + 1;
            nextInstruction = 0;
        } else {
            console.log("complete");
        }

        setTimeout(() => {
            this.setState(Object.assign({}, this.state, {
                currentStep: nextStep,
                currentInstruction: nextInstruction,
                target: eval(steps[currentStep].instructions[nextInstruction].selectorExpr)
            }));
        }, delay);

        console.log(this.state);
    }


    componentDidMount() {
        const initialTarget = eval(steps[0].instructions[0].selectorExpr);
        this.setState(Object.assign({}, this.state, {
            target: initialTarget
        }));

        setTimeout(() => {
            const myBlockTarget = document.querySelector(".scratchCategoryMenu > div:nth-child(9)");
            const makeBlockTarget = document.querySelectorAll(".blocklyFlyoutButton")[2];
            const { steps, currentStep, currentInstruction } = this.state;

            myBlockTarget.addEventListener("click", () => this.onNextInstruction(500));

            makeBlockTarget.addEventListener("click", () => this.onNextInstruction());
        }, 1000);
    }

    render() {
        return (<TutorialComponent {...this.state} onNextInstruction={this.onNextInstruction}
        // target={this.state.target} steps={this.state.steps}
        />);
    }
}


export default Tutorial;