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
        title: 'Learning the Basics of a Custom Block',
        description: `How does a Custom Block work?`,
        instructions: [
            {
                selectorExpr: `document.querySelectorAll("div.rc-steps-item-description")[0]`,
                isModal: true,
                customContent: `
                <h3>Welcome Scratchers!</h3> 
                <div style="text-align: left">
                <p><b>Procedure</b> is a very powerful concept known in Scratch as a <b>Custom Block</b>.
                In this tutorial, you will learn to:</p>
                    <ul>
                        <li>Master the use of a custom block</li>
                        <li>Share your custom block with others</li>
                    </ul>
                </div>`,
                modalSize: 'large',
                beaconAlign: 'right-start',
                floaterPlacement: 'center',
                workspaceSetupCode: "<xml xmlns='http://www.w3.org/1999/xhtml'><block type='event_whenflagclicked' id='3GgSEq2C3!UUHbO~!2wG' x='220' y='272'><next><block type='motion_movesteps' id=':L6MsjJxAuqwuVSw^8oO'><value name='STEPS'><shadow type='math_number' id='TXZwH5e3}+[}[RJz#DH)'><field name='NUM'>10</field></shadow></value><next><block type='motion_turnright' id='BKf`Tu?`rziW2g!-*QpM'><value name='DEGREES'><shadow type='math_number' id='JJ-pr9fYpv$me2!%C=K3'><field name='NUM'>15</field></shadow></value><next><block type='motion_pointindirection' id='#u=Td#wrIT0]I*9N:`s/'><value name='DIRECTION'><shadow type='math_angle' id='!z#aH]hyO|NfSDT]%/;}'><field name='NUM'>90</field></shadow></value><next><block type='motion_movesteps' id='m%)5Z67I8g-ofd@LwgX`'><value name='STEPS'><shadow type='math_number' id='+6ij{vIyaYP{9#X,QV/B'><field name='NUM'>10</field></shadow></value><next><block type='motion_turnright' id='%Cqf}+0Pz[Y^7w~Y{{VT'><value name='DEGREES'><shadow type='math_number' id='atI.x%~WQb$X?s.n8:V*'><field name='NUM'>15</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></xml>",
                customizedNextButtonText: 'Begin the tutorial'
            },
            {
                customContent: `Click <b>"My Blocks"</b>`,
                selectorExpr: `document.querySelector(".scratchCategoryMenu > div:nth-child(9)")`,
                delayNextInstruction: 600,
            },
            {
                customContent: `Click <b>"Make a Block"</b>`,
                selectorExpr: `document.querySelectorAll(".blocklyFlyoutButton")[2]`,
                beaconAlign: 'right'
            },
            {
                customContent: `<p>Give your custom block a meaningful name (e.g., "MOVEMENT"). When you are done, click <b>"OK"</b><p>`,
                selectorExpr: `document.querySelector("div.ReactModalPortal").querySelector("g.blocklyBlockCanvas")`,
                triggerNextTarget: `document.querySelector('div.ReactModalPortal').querySelectorAll('button')[1]`,
                beaconAlign: 'right'
            },
            {
                customContent: `
                <p><b>Nicely Done!</b> This is the signature block that you can define what it does!</p>
                <p>Let's make it do the MOVEMENT!
                Copy the code that perform MOVEMENT and snap it to this define block</p>`,
                selectorExpr: `this.workspace.getAllBlocks().find(b=>b.type==='procedures_definition').svgGroup_`,
                beaconAlign: 'right',
                floaterPlacement: 'right',
                checkUserCode: true
            },
            {
                customContent: `<p><b>Great Job!</b> All of your custom blocks will be available in <b>"My Blocks"</b> category.</p>
                    <p> Let's use the custom block you just created!
                    Let's replace the blocks in the workspace that do the MOVEMENT with the custom block</p>`,
                selectorExpr: `this.flyout.getAllBlocks().find(b=>b.type==='procedures_call').svgGroup_`,
                beaconAlign: 'bottom',
                floaterPlacement: 'bottom',
                checkUserCode: true
            },
            {
                customContent: `
                <b>Nicely Done!</b> 
                <p>Click <b>Green Flag</b> to test if everything is still working as expected.</p>`,
                selectorExpr: `document.querySelector('.greenFlag')`,
                // `this.workspace.topBlocks_.find(b=>b.type==='event_whenflagclicked').svgGroup_.children[0]`,
                beaconAlign: 'left',
                floaterPlacement: 'left',
                // workspaceSetupCode to be remove for production 
                delayNextInstruction: 2000
            },
            {
                customContent: `Looks like it's working just like before! 
                <p>What's better is that with a meaningful custom block's name, it helps make the code easier to understand.</p>`,
                isModal: true,
                floaterPlacement: 'center'
            }
        ]
    }, {
        title: 'Mastering the Custom Block',
        description: `Passing parameters to your custom block`,
        instructions: [
            {
                isModal: true,
                floaterPlacement: 'center',
                customContent: `<h3>You just learned the basics of a custom block!</h3> 
                <p>What if we want to make the Scratch Cat move a little bit differently?</p>
                <p>Luckily, we don't need to create another custom block.</p>

                <p>Next you will learn how to use <b>parameters</b> to make a custom block even more powerful.<p/>
                `,
                workspaceSetupCode: "<xml xmlns='http://www.w3.org/1999/xhtml'><block type='procedures_definition' id='PxH;Rp_Ia/gX3wGoj7O[' x='-508' y='-285'><statement name='custom_block'><shadow type='procedures_prototype' id='1{}?-zEWx!J3E27pwg2a'><mutation proccode='block name' argumentids='[]' argumentnames='[]' argumentdefaults='[]' warp='false'></mutation></shadow></statement><next><block type='motion_movesteps' id='m%)5Z67I8g-ofd@LwgX`'><value name='STEPS'><shadow type='math_number' id='+6ij{vIyaYP{9#X,QV/B'><field name='NUM'>10</field></shadow></value><next><block type='motion_turnright' id='%Cqf}+0Pz[Y^7w~Y{{VT'><value name='DEGREES'><shadow type='math_number' id='atI.x%~WQb$X?s.n8:V*'><field name='NUM'>15</field></shadow></value></block></next></block></next></block><block type='event_whenflagclicked' id='3GgSEq2C3!UUHbO~!2wG' x='-92' y='13'><next><block type='motion_movesteps' id=':L6MsjJxAuqwuVSw^8oO'><value name='STEPS'><shadow type='math_number' id='TXZwH5e3}+[}[RJz#DH)'><field name='NUM'>10</field></shadow></value><next><block type='motion_turnright' id='BKf`Tu?`rziW2g!-*QpM'><value name='DEGREES'><shadow type='math_number' id='JJ-pr9fYpv$me2!%C=K3'><field name='NUM'>15</field></shadow></value><next><block type='motion_pointindirection' id='#u=Td#wrIT0]I*9N:`s/'><value name='DIRECTION'><shadow type='math_angle' id='!z#aH]hyO|NfSDT]%/;}'><field name='NUM'>90</field></shadow></value></block></next></block></next></block></next></block></xml>",
                customizedNextButtonText: 'Continue'
            },
            {
                customContent: `Let's`,
                selectorExpr: `document.querySelectorAll(".blocklyFlyoutButton")[2]`,
                beaconAlign: 'right'
            }
        ]
    }, {
        title: 'Sharing your Custom Block with Others',
        description: ``
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
                        workspace.cleanUp();
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