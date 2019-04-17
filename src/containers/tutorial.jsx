import React from 'react';
import TutorialComponent from '../components/tutorial/tutorial.jsx';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';
import { loadNewTutorial, nextInstruction, setFocusTarget } from '../reducers/tutorial';
import ScratchBlocks from 'scratch-blocks';
import analytics, { stitchClient, sendFeedbackData } from '../lib/custom-analytics';

const steps = [
    {
        title: 'Create a custom block',
        description: `Create a custom block and name it "Swing`,
        instructions: [
            {
                description: `Let's get started!`,
                selectorExpr: `document.querySelectorAll("div.rc-steps-item-description")[0]`,
                isModal: true,
                beaconAlign: 'right-start',
                floaterPlacement: 'center'
            },
            {
                description: `Click My Blocks`,
                selectorExpr: `document.querySelector(".scratchCategoryMenu > div:nth-child(9)")`,
                delayNextInstruction: 600,
            },
            {
                description: `Click Make a Block`,
                selectorExpr: `document.querySelectorAll(".blocklyFlyoutButton")[2]`,
                beaconAlign: 'right'
            },
            {
                description: `Give procedure a name and click OK`,
                selectorExpr: `document.querySelector("div.ReactModalPortal").querySelector("g.blocklyBlockCanvas")`,
                triggerNextTarget: `document.querySelector('div.ReactModalPortal').querySelectorAll('button')[1]`,
                beaconAlign: 'right'
            },
            {
                description: `Copy the code that perform Action and put it under the define block`,
                selectorExpr: `this.workspace.getAllBlocks().find(b=>b.type==='procedures_definition').svgGroup_`,
                beaconAlign: 'right',
                floaterPlacement: 'right',
                checkUserCode: true
            }
        ]
    }, {
        title: 'Use the custom block',
        description: `Copy the highlighted blocks`,
        instructions: [
            {
                description: `Now we have our custom block that we can use. Replace the blocks in workspace with our custom block`,
                selectorExpr: `this.flyout.getAllBlocks().find(b=>b.type==='procedures_call').svgGroup_`,
                beaconAlign: 'right',
                floaterPlacement: 'right',
                checkUserCode: true
            },
            {
                description: `Nicely Done! Let's click Green Flag to see if everything is still working as expected.`,
                selectorExpr: `document.querySelectorAll("div.rc-steps-item-description")[0]`,
                isModal: true,
                floaterPlacement: 'center'
            }
        ]
    }, {
        title: 'Add parameter to the custom block',
        description: `Allow your custom block to perform a variation`
    }
]

class Tutorial extends React.Component {
    constructor(props) {
        super(props);
        this.onNextInstruction = this.onNextInstruction.bind(this);
        this.props.onLoadNewTutorial(steps);
        bindAll(this, [
            'onWorkspaceUpdate'
        ]);
    }

    onNextInstruction(delay = 0) {
        analytics.event({
            category: 'Tutorial',
            action: 'Complete Step',
            label: `step: ${this.props.tutorial.currentStep}, instruction: ${this.props.tutorial.currentInstruction}`
        });

        setTimeout(() => {
            this.props.onNextInstruction();
        }, delay);
    }

    onWorkspaceUpdate() {
        this.workspace = ScratchBlocks.getMainWorkspace() || Blockly.getMainWorkspace();
        this.flyout = Object.values(ScratchBlocks.Workspace.WorkspaceDB_).find(ws => ws.isFlyout);
        window.flyout = this.flyout;
        sendFeedbackData({ questionId: 1, question: 'Do you like the hint?', feedback: 'A lot' });
    }

    sendFeedback() {
        sendFeedbackData('data');
    }


    componentDidMount() {
        this.props.vm.addListener('workspaceUpdate', this.onWorkspaceUpdate);
    }

    render() {
        const { steps, currentStep, currentInstruction } = this.props.tutorial;
        console.log(currentStep, currentInstruction);
        if (steps.length > 0) {
            const instruction = steps[currentStep].instructions[currentInstruction];
            const target = eval(instruction.selectorExpr);
            const triggerNextTarget = eval(instruction.triggerNextTarget);
            if (triggerNextTarget || target) {
                (triggerNextTarget || target).addEventListener("click", () => {
                    this.onNextInstruction(instruction.delayNextInstruction || 200);
                });
            }
            return (<TutorialComponent {...this.props.tutorial} target={target} onNextInstruction={this.props.onNextInstruction} />);
        } else {
            return null;
        }
    }
}


const mapStateToProps = state => ({
    tutorial: state.scratchGui.tutorial,
    vm: state.scratchGui.vm,
});

const mapDispatchToProps = dispatch => ({
    onLoadNewTutorial: steps => dispatch(loadNewTutorial(steps)),
    onNextInstruction: () => dispatch(nextInstruction()),
    onSetFocusTarget: domTarget => dispatch(setFocusTarget(domTarget))
})

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial);