import React from 'react';
import TutorialComponent from '../components/tutorial/tutorial.jsx';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';
import { loadNewTutorial, nextInstruction, setFocusTarget, markInstructionComplete } from '../reducers/tutorial';
import ScratchBlocks from 'scratch-blocks';
import analytics, { stitchClient, sendFeedbackData } from '../lib/custom-analytics';

import { addBlocksToWorkspace, testBlocks , workspaceFromXml} from '../lib/hints/hint-test-workspace-setup';

const steps = [
    {
        title: 'Create a custom block',
        description: `Create a custom block and name it "Swing`,
        instructions: [
            {
                description: `Welcome Scratchers! Let's get started!`,
                selectorExpr: `document.querySelectorAll("div.rc-steps-item-description")[0]`,
                isModal: true,
                beaconAlign: 'right-start',
                floaterPlacement: 'center',
                workspaceSetupCode: "<xml xmlns='http://www.w3.org/1999/xhtml'><block type='event_whenflagclicked' id='3GgSEq2C3!UUHbO~!2wG' x='220' y='272'><next><block type='motion_movesteps' id=':L6MsjJxAuqwuVSw^8oO'><value name='STEPS'><shadow type='math_number' id='TXZwH5e3}+[}[RJz#DH)'><field name='NUM'>10</field></shadow></value><next><block type='motion_turnright' id='BKf`Tu?`rziW2g!-*QpM'><value name='DEGREES'><shadow type='math_number' id='JJ-pr9fYpv$me2!%C=K3'><field name='NUM'>15</field></shadow></value><next><block type='motion_pointindirection' id='#u=Td#wrIT0]I*9N:`s/'><value name='DIRECTION'><shadow type='math_angle' id='!z#aH]hyO|NfSDT]%/;}'><field name='NUM'>90</field></shadow></value><next><block type='motion_movesteps' id='m%)5Z67I8g-ofd@LwgX`'><value name='STEPS'><shadow type='math_number' id='+6ij{vIyaYP{9#X,QV/B'><field name='NUM'>10</field></shadow></value><next><block type='motion_turnright' id='%Cqf}+0Pz[Y^7w~Y{{VT'><value name='DEGREES'><shadow type='math_number' id='atI.x%~WQb$X?s.n8:V*'><field name='NUM'>15</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></xml>",
                customizedNextButtonText: 'OK'
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
                description: `Nicely Done! What you see is the signature block that we can define what it does!
                Let's make it do the MOVEMENT! Copy the code that perform MOVEMENT and snap it to this define block`,
                selectorExpr: `this.workspace.getAllBlocks().find(b=>b.type==='procedures_definition').svgGroup_`,
                beaconAlign: 'right',
                floaterPlacement: 'right',
                checkUserCode: true
            },
            {
                description: `Great Job!
                    All of your custom blocks will be available in "My Blocks" category. 
                    Let's use the custom block you just created!
                    Let's replace the blocks in the workspace that do the MOVEMENT with the custom block`,
                selectorExpr: `this.flyout.getAllBlocks().find(b=>b.type==='procedures_call').svgGroup_`,
                beaconAlign: 'bottom',
                floaterPlacement: 'bottom',
                checkUserCode: true
            }
        ]
    }, {
        title: 'Use the custom block',
        description: `Copy the highlighted blocks`,
        instructions: [
            {
                description: `Nicely Done! Click on Green Flag to test if everything is still working as expected.`,
                selectorExpr: `document.querySelector('.greenFlag')`,
                // `this.workspace.topBlocks_.find(b=>b.type==='event_whenflagclicked').svgGroup_.children[0]`,
                beaconAlign: 'left',
                floaterPlacement: 'left',
                // workspaceSetupCode to be remove for production 
                workspaceSetupCode: "<xml xmlns='http://www.w3.org/1999/xhtml'><block type='procedures_definition' id='PxH;Rp_Ia/gX3wGoj7O[' x='-508' y='-285'><statement name='custom_block'><shadow type='procedures_prototype' id='1{}?-zEWx!J3E27pwg2a'><mutation proccode='block name' argumentids='[]' argumentnames='[]' argumentdefaults='[]' warp='false'></mutation></shadow></statement><next><block type='motion_movesteps' id='m%)5Z67I8g-ofd@LwgX`'><value name='STEPS'><shadow type='math_number' id='+6ij{vIyaYP{9#X,QV/B'><field name='NUM'>10</field></shadow></value><next><block type='motion_turnright' id='%Cqf}+0Pz[Y^7w~Y{{VT'><value name='DEGREES'><shadow type='math_number' id='atI.x%~WQb$X?s.n8:V*'><field name='NUM'>15</field></shadow></value></block></next></block></next></block><block type='event_whenflagclicked' id='3GgSEq2C3!UUHbO~!2wG' x='-92' y='13'><next><block type='motion_movesteps' id=':L6MsjJxAuqwuVSw^8oO'><value name='STEPS'><shadow type='math_number' id='TXZwH5e3}+[}[RJz#DH)'><field name='NUM'>10</field></shadow></value><next><block type='motion_turnright' id='BKf`Tu?`rziW2g!-*QpM'><value name='DEGREES'><shadow type='math_number' id='JJ-pr9fYpv$me2!%C=K3'><field name='NUM'>15</field></shadow></value><next><block type='motion_pointindirection' id='#u=Td#wrIT0]I*9N:`s/'><value name='DIRECTION'><shadow type='math_angle' id='!z#aH]hyO|NfSDT]%/;}'><field name='NUM'>90</field></shadow></value></block></next></block></next></block></next></block></xml>"
            },
            {
                description: `description`,
                isModal: true
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
            'onWorkspaceUpdate',
            'onWorkspaceSetup'
        ]);
        this.state = {
            workspaceReady: false
        }
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

    onWorkspaceSetup() {
        const { steps, currentStep, currentInstruction } = this.props.tutorial;
        if (steps.length > 0) {
            const instruction = steps[currentStep].instructions[currentInstruction];
            if (this.workspace && instruction.workspaceSetupCode) {
                const workspace = this.workspace;
                setTimeout(
                    () => {
                        workspace.clear();
                        // addBlocksToWorkspace(workspace, instruction.workspaceSetupCode); //call it by onWsUpdate
                        workspaceFromXml(workspace, instruction.workspaceSetupCode);
                        workspace.scrollCenter();
                    }, 100
                )
            }
        }
    }


    onWorkspaceUpdate() {
        this.workspace = ScratchBlocks.getMainWorkspace() || Blockly.getMainWorkspace();
        this.flyout = Object.values(ScratchBlocks.Workspace.WorkspaceDB_).find(ws => ws.isFlyout);
        window.flyout = this.flyout;

        if (this.workspace) {
            this.onWorkspaceSetup();

        }

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
            if(this.workspace&&instruction.workspaceSetupCode){
                this.onWorkspaceSetup();
            }
            const target = eval(instruction.selectorExpr);
            const triggerNextTarget = eval(instruction.triggerNextTarget);
            if (triggerNextTarget || target) {
                (triggerNextTarget || target).addEventListener("click", () => {
                    this.onNextInstruction(instruction.delayNextInstruction || 200);
                });
            }
            return (<TutorialComponent {...this.props.tutorial} target={target} isDevMode
                onNextInstruction={this.props.onNextInstruction}
                onMarkInstructionComplete={this.props.onMarkInstructionComplete}
            />);
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
    onSetFocusTarget: domTarget => dispatch(setFocusTarget(domTarget)),
    onMarkInstructionComplete: (stepIdx, instIdx) => dispatch(markInstructionComplete(stepIdx, instIdx))
})

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial);