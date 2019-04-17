import React from 'react';
import TutorialComponent from '../components/tutorial/tutorial.jsx';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';
import { loadNewTutorial, nextInstruction, setFocusTarget } from '../reducers/tutorial';
import ScratchBlocks from 'scratch-blocks';

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
                floaterPlacement: 'right'
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
        this.onNextInstruction = this.onNextInstruction.bind(this);
        this.props.onLoadNewTutorial(steps);
        bindAll(this, [
            'onWorkspaceUpdate'
        ]);
        
    }

    onNextInstruction(delay = 0) {
        setTimeout(() => {
            this.props.onNextInstruction();
        }, delay);
    }

    onWorkspaceUpdate() {
        // const steps = this.props.tutorial.steps;
        // const initialTarget = eval(steps[0].instructions[0].selectorExpr);
        // this.setState(Object.assign({}, this.state, {
        //     target: initialTarget
        // }));
        // this.props.onSetFocusTarget(initialTarget);
        this.workspace = ScratchBlocks.getMainWorkspace()|| Blockly.getMainWorkspace();
    }


    componentDidMount() {
        this.props.vm.addListener('workspaceUpdate', this.onWorkspaceUpdate);
    }

    render() {
        const { steps, currentStep, currentInstruction } = this.props.tutorial;
        if (steps.length > 0 && !!!currentStep) {
            
            const instruction = steps[currentStep].instructions[currentInstruction];
            const target = eval(instruction.selectorExpr);
            const triggerNextTarget = eval(instruction.triggerNextTarget);
            if (triggerNextTarget||target) {
                (triggerNextTarget||target).addEventListener("click", () => {
                    this.onNextInstruction(instruction.delayNextInstruction||200);
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