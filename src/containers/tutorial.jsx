import React from "react";
import TutorialComponent from "../components/tutorial/tutorial.jsx";
import { connect } from "react-redux";
import bindAll from "lodash.bindall";
import {
    loadNewTutorial,
    nextInstruction,
    setFocusTarget,
    markInstructionComplete
} from "../reducers/tutorial";
import ScratchBlocks from "scratch-blocks";
import analytics, {
    stitchClient,
    sendFeedbackData
} from "../lib/custom-analytics";

import {
    addBlocksToWorkspace,
    testBlocks,
    workspaceFromXml
} from "../lib/hints/hint-test-workspace-setup";

import {
    setProjectId
} from '../reducers/project-state';

const HIGHLIGHT_COLOR = {GREEN:'#92C124',BLUE:'#3C91E6',RED:'#F15152'};

const steps = [
    {
        title: "Learning the Basics of a Custom Block",
        description: `How does a Custom Block work?`,
        instructions: [
            {
                selectorExpr: `document.querySelectorAll("div.rc-steps-item-description")[0]`,
                isModal: true,
                customContent: `
                <h3>Welcome Scratchers!</h3> 
                <div style="text-align: left">
                <p><b>Procedure</b> is a very powerful programming construct, supported in Scratch as a <b>Custom Block</b>.
                By completing this tutorial, you will learn how to:</p>
                    <ul>
                        <li>Define and use custom blocks</li>
                        <li>Share your custom blocks with other programmers</li>
                    </ul>
                </div>`,
                modalSize: "large",
                beaconAlign: "right-start",
                floaterPlacement: "center",
                workspaceSetupCode: 
                // "<xml xmlns='http://www.w3.org/1999/xhtml'><variables></variables><block type='event_whenflagclicked' id='__greenflag__' x='94' y='356'><next><block type='motion_pointindirection' id='5D8/lOi*ez?L?]g:Jf16'><value name='DIRECTION'><shadow type='math_angle' id='fdEf3Z{0RgCW|VA`:sWM'><field name='NUM'>90</field></shadow></value><next><block type='motion_gotoxy' id='qkU;n/VdHe*=6#O$BI*w'><value name='X'><shadow type='math_number' id=')|vDEhyVpv^37|86U_p:'><field name='NUM'>0</field></shadow></value><value name='Y'><shadow type='math_number' id=',N.d]yQ5GaEjyW(eqV!5'><field name='NUM'>0</field></shadow></value><next><block type='control_forever' id='[-9M@[PxGGZJ1-qt/frn'><statement name='SUBSTACK'><block type='control_repeat' id='__small-rotation__'><value name='TIMES'><shadow type='math_whole_number' id='41Q24urK5FdwuxP/%R_1'><field name='NUM'>36</field></shadow></value><statement name='SUBSTACK'><block type='motion_movesteps' id='@g`*zKNybwlqc|VR]eZ1'><value name='STEPS'><shadow type='math_number' id='?L2h~z?Rt}l^pF[%3Bz;'><field name='NUM'>8</field></shadow></value><next><block type='motion_turnright' id='Pv;`~cP%q/2RJl~$dF`r'><value name='DEGREES'><shadow type='math_number' id=':d=7D*9HnQBpVJ:ulBui'><field name='NUM'>10</field></shadow></value></block></next></block></statement></block></statement></block></next></block></next></block></next></block></xml>",
                "<xml xmlns='http://www.w3.org/1999/xhtml'><variables></variables><block type='event_whenflagclicked' id='__greenflag__' x='94' y='356'><next><block type='motion_pointindirection' id='5D8/lOi*ez?L?]g:Jf16'><value name='DIRECTION'><shadow type='math_angle' id='fdEf3Z{0RgCW|VA`:sWM'><field name='NUM'>90</field></shadow></value><next><block type='motion_gotoxy' id='qkU;n/VdHe*=6#O$BI*w'><value name='X'><shadow type='math_number' id=')|vDEhyVpv^37|86U_p:'><field name='NUM'>0</field></shadow></value><value name='Y'><shadow type='math_number' id=',N.d]yQ5GaEjyW(eqV!5'><field name='NUM'>0</field></shadow></value><next><block type='control_forever' id='[-9M@[PxGGZJ1-qt/frn'><statement name='SUBSTACK'><block type='control_repeat' id='__small-rotation__'><value name='TIMES'><shadow type='math_whole_number' id='41Q24urK5FdwuxP/%R_1'><field name='NUM'>36</field></shadow></value><statement name='SUBSTACK'><block type='motion_movesteps' id='@g`*zKNybwlqc|VR]eZ1'><value name='STEPS'><shadow type='math_number' id='?L2h~z?Rt}l^pF[%3Bz;'><field name='NUM'>8</field></shadow></value><next><block type='motion_turnright' id='Pv;`~cP%q/2RJl~$dF`r'><value name='DEGREES'><shadow type='math_number' id=':d=7D*9HnQBpVJ:ulBui'><field name='NUM'>10</field></shadow></value></block></next></block></statement><next><block type='control_repeat' id='__large-rotation__'><value name='TIMES'><shadow type='math_whole_number' id='Bh4DS?}@e,(y4u@FcmRG'><field name='NUM'>36</field></shadow></value><statement name='SUBSTACK'><block type='motion_movesteps' id='z=Q`YbRL`Uc)rxL7}WTV'><value name='STEPS'><shadow type='math_number' id='}X;Ch0|QdXHW`of%*O)u'><field name='NUM'>16</field></shadow></value><next><block type='motion_turnright' id='M8}K:4UF8|z:)i=RQjv2'><value name='DEGREES'><shadow type='math_number' id='Q[LO_[Ba5VN:lHCT@uX['><field name='NUM'>10</field></shadow></value></block></next></block></statement></block></next></block></statement></block></next></block></next></block></next></block></xml>",
                projectId: '303529631',
                customizedNextButtonText: "Begin the tutorial"
            },
            {
                customContent: `
                <p>We begin with a simple script that makes the sprite move repeatedly in a small circle (by the blocks inside the red line) 
                and then in a bigger circle (by the blocks inside the blue line).</p>
                <p>Click <b>Green Flag</b> to see what it does. Then click "Next"</p>
               `,
                selectorExpr: `this.workspace.getBlockById('__greenflag__').svgGroup_.firstElementChild`,
                focusBlocks: [{id1:'__small-rotation__',color:HIGHLIGHT_COLOR.RED}, {id1:'__large-rotation__',color:HIGHLIGHT_COLOR.BLUE}],
                beaconAlign: "right",
                floaterPlacement: "right",
                checkUserCode: true
            },
            {
                customContent: `
                <p>
                We will use these blocks for performing circle-around movement in multiple places in the code. Instead of duplicating these blocks, 
                it is better to create a <b>custom block</b>
                </p>
               `,
                selectorExpr: `this.workspace.getBlockById('__small-rotation__').svgGroup_`,
                focusBlocks: [{id1:'__small-rotation__',color:HIGHLIGHT_COLOR.RED}, {id1:'__large-rotation__',color:HIGHLIGHT_COLOR.BLUE}],
                beaconAlign: "right",
                floaterPlacement: "right",
                checkUserCode: true
            },
            {
                customContent: `
                <p>
                Let's create a custom block that only performs  <em>small</em> circle-around movement first.
                Don't worry! We will later make our custom block to also do <em>big</em> circle-around movement.
                </p>
               `,
                selectorExpr: `this.workspace.getBlockById('__small-rotation__').svgGroup_.firstElementChild`,
                focusBlocks: [{id1:'__small-rotation__',color:HIGHLIGHT_COLOR.RED}],
                beaconAlign: "right",
                floaterPlacement: "right",
                checkUserCode: true
            },
            {
                customContent: `To create a custom block, first click <b>"My Blocks"</b>`,
                selectorExpr: `document.querySelector(".scratchCategoryMenu > div:nth-child(9)")`,
                delayNextInstruction: 600
            },
            {
                customContent: `Click <b>"Make a Block"</b>`,
                selectorExpr: `document.querySelectorAll(".blocklyFlyoutButton")[2]`,
                beaconAlign: "right"
            },
            {
                customContent: `<p>Give your custom block a meaningful name (e.g., "Circle Around"). When you are done, click <b>"OK"</b><p>`,
                selectorExpr: `document.querySelector("div.ReactModalPortal").querySelector("g.blocklyBlockCanvas")`,
                triggerNextTarget: `document.querySelector('div.ReactModalPortal').querySelectorAll('button')[1]`,
                beaconAlign: "right"
            },
            {
                customContent: `
                <p>This is the <b>definition</b> block, which describes what your Custom Block does!</p>
                <p>Copy the code that performs the small circle-around movement highlighted in red and snap it to this definition block</p>`,
                selectorExpr: `this.workspace.getAllBlocks().find(b=>b.type==='procedures_definition').svgGroup_`,
                beaconAlign: "right",
                floaterPlacement: "right",
                checkUserCode: true,
                focusBlocks: [{id1:'__small-rotation__',color:HIGHLIGHT_COLOR.RED}]
            },
            {
                customContent: `<p><b>Great Job!</b> Scratch places all your custom blocks in the <b>"My Blocks"</b> category.</p>
                    <p>These custom blocks can be used to call your definition blocks from anywhere in the workspace. </p>
                    <p>Let's use the custom block you have just created!</p>
                    <p>Let's replace the blocks in the workspace that perform the small circle-around movement with our custom block</p>`,
                selectorExpr: `this.flyout.getAllBlocks().find(b=>b.type==='procedures_call').svgGroup_`,
                focusBlocks: [{id1:'__small-rotation__',color:HIGHLIGHT_COLOR.RED}],
                beaconAlign: "bottom",
                floaterPlacement: "bottom",
                checkUserCode: true
            },
            {
                customContent: `
                <p>Before moving on, click <b>Green Flag</b> to see if your code still works exactly like before. It should!</p>`,
                selectorExpr: `document.querySelector('.greenFlag')`,
                beaconAlign: "left",
                floaterPlacement: "left",
                delayNextInstruction: 2000
            },
            {
                customContent: `
                <p>Looks like it is working exactly like before! 
                You are on your way to master the use of custom block!</p>
                <p>But the custom block only performs a small circle-around movement though.</p>
                <p>Luckily, you don't need to create another custom block for performing a big circle-around movement.</p>
                </p>
                `,
                selectorExpr: `this.workspace.getAllBlocks().find(b=>b.type==='procedures_definition').svgGroup_`,
                beaconAlign: "right",
                floaterPlacement: "right",
                checkUserCode: true
            },
            {
                customContent: `
                <p>Taking a closer look, small circle-around movement moves 8 steps while the big circle-around movement moves 16 steps.</p> 
                <p>We need a way to call our custom block with these different inputs.</p>
                <p>We can do that by adjusting our custom block to take these inputs via custom block's <b>parameters</b></p>
                `,
                selectorExpr: `this.workspace.getAllBlocks().find(b=>b.type==='procedures_definition').svgGroup_`,
                beaconAlign: "right",
                floaterPlacement: "right",
                checkUserCode: true,
            },
            {
                //tutorial state setup
                test: true,
                customContent: ``,
                checkUserCode: true,
                workspaceSetupCode: "<xml xmlns='http://www.w3.org/1999/xhtml'><variables></variables><block type='procedures_definition' id='?[^2U*dVqjyP1/^;s03C' x='-326' y='-192'><statement name='custom_block'><shadow type='procedures_prototype' id='I/+O)jN.Mmt~DFf82iEu'><mutation proccode='Circle Around' argumentids='[]' argumentnames='[]' argumentdefaults='[]' warp='false'></mutation></shadow></statement><next><block type='control_repeat' id='__small-rotation__'><value name='TIMES'><shadow type='math_whole_number' id='41Q24urK5FdwuxP/%R_1'><field name='NUM'>36</field></shadow></value><statement name='SUBSTACK'><block type='motion_movesteps' id='@g`*zKNybwlqc|VR]eZ1'><value name='STEPS'><shadow type='math_number' id='?L2h~z?Rt}l^pF[%3Bz;'><field name='NUM'>8</field></shadow></value><next><block type='motion_turnright' id='Pv;`~cP%q/2RJl~$dF`r'><value name='DEGREES'><shadow type='math_number' id=':d=7D*9HnQBpVJ:ulBui'><field name='NUM'>10</field></shadow></value></block></next></block></statement></block></next></block><block type='event_whenflagclicked' id='__greenflag__' x='0' y='0'><next><block type='motion_pointindirection' id='5D8/lOi*ez?L?]g:Jf16'><value name='DIRECTION'><shadow type='math_angle' id='fdEf3Z{0RgCW|VA`:sWM'><field name='NUM'>90</field></shadow></value><next><block type='motion_gotoxy' id='qkU;n/VdHe*=6#O$BI*w'><value name='X'><shadow type='math_number' id=')|vDEhyVpv^37|86U_p:'><field name='NUM'>0</field></shadow></value><value name='Y'><shadow type='math_number' id=',N.d]yQ5GaEjyW(eqV!5'><field name='NUM'>0</field></shadow></value><next><block type='control_forever' id='[-9M@[PxGGZJ1-qt/frn'><statement name='SUBSTACK'><block type='procedures_call' id='~MpfTa3a5[b/eN3}PIqK'><mutation proccode='Circle Around' argumentids='[]' warp='false'></mutation><next><block type='control_repeat' id='__large-rotation__'><value name='TIMES'><shadow type='math_whole_number' id='Bh4DS?}@e,(y4u@FcmRG'><field name='NUM'>36</field></shadow></value><statement name='SUBSTACK'><block type='motion_movesteps' id='z=Q`YbRL`Uc)rxL7}WTV'><value name='STEPS'><shadow type='math_number' id='}X;Ch0|QdXHW`of%*O)u'><field name='NUM'>16</field></shadow></value><next><block type='motion_turnright' id='M8}K:4UF8|z:)i=RQjv2'><value name='DEGREES'><shadow type='math_number' id='Q[LO_[Ba5VN:lHCT@uX['><field name='NUM'>10</field></shadow></value></block></next></block></statement></block></next></block></statement></block></next></block></next></block></next></block></xml>",
                delayNextInstruction: 2000
            },
            {
                customContent: `
                <p>Let's adjust our <b>definition</b> block to take <b>steps</b> as an input parameter<p>
                <p>Right click on the definition block and select "Edit"</p>
                `,
                selectorExpr: `this.workspace.getAllBlocks().find(b=>b.type==='procedures_prototype').svgGroup_`,
                triggerNextTarget: `document.querySelectorAll('.goog-menuitem-content')[2]`,
                triggerTargetEvent: 'contextmenu',
                beaconAlign: "right",
                floaterPlacement: "right",
                delayNextInstruction: 100
            },
            {
                customContent: `
                <p>Click Edit</p>`,
                beaconAlign: "right",
                floaterPlacement: "right",
                selectorExpr: `document.querySelectorAll('.goog-menuitem')[2]`,
                triggerTargetEvent: 'mouseup',
                delayNextInstruction: 200,
                isIntermediateInstruction: true
            },
            {
                customContent: `
                <p>Click <b>Add an input</b> then click <b>OK</b></p>`,
                beaconAlign: "bottom",
                floaterPlacement: "bottom",
                selectorExpr:`document.querySelectorAll("div[class*='custom-procedures_option-card']")[0]`
            },
            {
                customContent: `Give a meaningful name to the input (e.g., steps). Then click OK.`,
                beaconAlign: "right",
                floaterPlacement: "right",
                selectorExpr: `Blockly.getMainWorkspace().getAllBlocks()[0].svgGroup_`,
                triggerNextTarget: `document.querySelector('div.ReactModalPortal').querySelectorAll('button')[1]`
            },
            {
                customContent: `
                <p>Let's call our custom block with an input value of 8 for the small circle-around movement.</p>
                <p>Type in 8 as the input to our custom block</p>`,
                beaconAlign: "right",
                floaterPlacement: "right",
                selectorExpr: `this.workspace.getAllBlocks().find(b=>b.type==='procedures_call').svgGroup_.firstElementChild`,
                checkUserCode: true
            },
            {
                customContent: `
                <p>This <b>steps</b> parameter block will hold the input value</p>
                <p>We can use <b>steps</b> parameter anywhere in our custom block's definition.</p>
                <p>To use, drag the <b>steps</b> parameter block and drop it into the move block's input (highlighted).
                Click "Next" when you are done.</p>
                `,
                beaconAlign: "right",
                floaterPlacement: "right",
                selectorExpr: `Blockly.getMainWorkspace().getAllBlocks().find(b=>b.type==='procedures_definition').svgGroup_.firstElementChild`,
                checkUserCode: true
            },
            {
                customContent: `
                <p>Almost there!, Let's click <b>Green Flag</b> once again just to see if the code still works correctly.</p>`,
                beaconAlign: "left",
                floaterPlacement: "left",
                selectorExpr: `document.querySelector('.greenFlag')`,
                delayNextInstruction: 2000
            },
            {
                customContent: `<p>Working great! With a parameter <b>steps</b>, our custom block is more useful.</p>
                <p>We can finally use it to perform big circle-around movement!<p>
                `,
                isModal: true,
                floaterPlacement: "center"
            },
            {
                customContent: `
                <p>Let's replace the code that performs big circle-around movement with our <b>Circle Around</b> custom block 
                and give it an input value of 16. Click "Next" when you are done.</p>`,
                beaconAlign: "left",
                floaterPlacement: "left",
                selectorExpr: `this.workspace.getBlockById('__large-rotation__').svgGroup_.firstElementChild`,
                checkUserCode: true
            },
            {
                customContent: `
                <p>Let's click <b>Green Flag</b> one last time to see if the code still works correctly.</p>`,
                beaconAlign: "left",
                floaterPlacement: "left",
                selectorExpr: `document.querySelector('.greenFlag')`,
                delayNextInstruction: 2000
            },
            {
                customContent: `Looks like it's working exactly like before, but your code is much easier to understand.
                <p>By creating a new custom block with a meaningful name, you made the code easier to understand.</p>`,
                isModal: true,
                floaterPlacement: "center"
            }
        ]
    },
    {
        title: "Sharing the Custom Block",
        description: `Sharing your custom block with others`,
        instructions: [
            {
                //tutorial state setup
                test: true,
                customContent: ``,
                checkUserCode: true,
                workspaceSetupCode: "<xml xmlns='http://www.w3.org/1999/xhtml'><variables></variables><block type='procedures_definition' id='?[^2U*dVqjyP1/^;s03C' x='0' y='0'><statement name='custom_block'><shadow type='procedures_prototype' id='I/+O)jN.Mmt~DFf82iEu'><mutation proccode='Circle Around %s' argumentids='[&quot;XS(PEf($kxid2SJp8?vB&quot;]' argumentnames='[&quot;steps&quot;]' argumentdefaults='[&quot;&quot;]' warp='false'></mutation><value name='XS(PEf($kxid2SJp8?vB'><shadow type='argument_reporter_string_number' id='~7SN6]al]dlnS{lR#Izf'><field name='VALUE'>steps</field></shadow></value></shadow></statement><next><block type='control_repeat' id='__small-rotation__'><value name='TIMES'><shadow type='math_whole_number' id='41Q24urK5FdwuxP/%R_1'><field name='NUM'>36</field></shadow></value><statement name='SUBSTACK'><block type='motion_movesteps' id='@g`*zKNybwlqc|VR]eZ1'><value name='STEPS'><shadow type='math_number' id='?L2h~z?Rt}l^pF[%3Bz;'><field name='NUM'>8</field></shadow><block type='argument_reporter_string_number' id='Pu^IF^Gwo|~A%5WECvo]'><field name='VALUE'>steps</field></block></value><next><block type='motion_turnright' id='Pv;`~cP%q/2RJl~$dF`r'><value name='DEGREES'><shadow type='math_number' id=':d=7D*9HnQBpVJ:ulBui'><field name='NUM'>10</field></shadow></value></block></next></block></statement></block></next></block><block type='event_whenflagclicked' id='__greenflag__' x='0' y='296'><next><block type='motion_pointindirection' id='5D8/lOi*ez?L?]g:Jf16'><value name='DIRECTION'><shadow type='math_angle' id='fdEf3Z{0RgCW|VA`:sWM'><field name='NUM'>90</field></shadow></value><next><block type='motion_gotoxy' id='qkU;n/VdHe*=6#O$BI*w'><value name='X'><shadow type='math_number' id=')|vDEhyVpv^37|86U_p:'><field name='NUM'>0</field></shadow></value><value name='Y'><shadow type='math_number' id=',N.d]yQ5GaEjyW(eqV!5'><field name='NUM'>0</field></shadow></value><next><block type='control_forever' id='[-9M@[PxGGZJ1-qt/frn'><statement name='SUBSTACK'><block type='procedures_call' id='~MpfTa3a5[b/eN3}PIqK'><mutation proccode='Circle Around %s' argumentids='[&quot;XS(PEf($kxid2SJp8?vB&quot;]' warp='false'></mutation><value name='XS(PEf($kxid2SJp8?vB'><shadow type='text' id='`|;Ie@q`g@_W4=tek-Y3'><field name='TEXT'>8</field></shadow></value><next><block type='procedures_call' id='rr:~Gke@`_XJ@TuOn76='><mutation proccode='Circle Around %s' argumentids='[&quot;XS(PEf($kxid2SJp8?vB&quot;]' warp='false'></mutation><value name='XS(PEf($kxid2SJp8?vB'><shadow type='text' id='3pv{QGgzqjrWiS9x*0i{'><field name='TEXT'>16</field></shadow></value></block></next></block></statement></block></next></block></next></block></next></block></xml>",
                delayNextInstruction: 2000,
                isIntermediateInstruction: true
            },
            {
                isModal: true,
                floaterPlacement: "center",
                customContent: `<h3>You just learned the basics of creating and calling custom blocks!</h3> 
                <p>What if we want to make Scratch Cat move a little bit differently?</p>
                <p>Luckily,  you don't need to create another custom block, but can simply add <b>parameters</b>.
                Next you will learn how to use <b>parameters</b> to make a custom block even more powerful!<p/>
                `,
                // workspaceSetupCode:
                //     "<xml xmlns='http://www.w3.org/1999/xhtml'><variables></variables><block type='event_whenflagclicked' id='__greenflag__' x='94' y='356'><next><block type='motion_pointindirection' id='5D8/lOi*ez?L?]g:Jf16'><value name='DIRECTION'><shadow type='math_angle' id='fdEf3Z{0RgCW|VA`:sWM'><field name='NUM'>90</field></shadow></value><next><block type='motion_gotoxy' id='qkU;n/VdHe*=6#O$BI*w'><value name='X'><shadow type='math_number' id=')|vDEhyVpv^37|86U_p:'><field name='NUM'>0</field></shadow></value><value name='Y'><shadow type='math_number' id=',N.d]yQ5GaEjyW(eqV!5'><field name='NUM'>0</field></shadow></value><next><block type='control_forever' id='[-9M@[PxGGZJ1-qt/frn'><statement name='SUBSTACK'><block type='control_repeat' id='__small-rotation__'><value name='TIMES'><shadow type='math_whole_number' id='41Q24urK5FdwuxP/%R_1'><field name='NUM'>36</field></shadow></value><statement name='SUBSTACK'><block type='motion_movesteps' id='@g`*zKNybwlqc|VR]eZ1'><value name='STEPS'><shadow type='math_number' id='?L2h~z?Rt}l^pF[%3Bz;'><field name='NUM'>8</field></shadow></value><next><block type='motion_turnright' id='Pv;`~cP%q/2RJl~$dF`r'><value name='DEGREES'><shadow type='math_number' id=':d=7D*9HnQBpVJ:ulBui'><field name='NUM'>10</field></shadow></value></block></next></block></statement><next><block type='control_repeat' id='__large-rotation__'><value name='TIMES'><shadow type='math_whole_number' id='Bh4DS?}@e,(y4u@FcmRG'><field name='NUM'>36</field></shadow></value><statement name='SUBSTACK'><block type='motion_movesteps' id='z=Q`YbRL`Uc)rxL7}WTV'><value name='STEPS'><shadow type='math_number' id='}X;Ch0|QdXHW`of%*O)u'><field name='NUM'>16</field></shadow></value><next><block type='motion_turnright' id='M8}K:4UF8|z:)i=RQjv2'><value name='DEGREES'><shadow type='math_number' id='Q[LO_[Ba5VN:lHCT@uX['><field name='NUM'>10</field></shadow></value></block></next></block></statement></block></next></block></statement></block></next></block></next></block></next></block></xml>",
                customizedNextButtonText: "Continue"
            },
            {
                customContent: `Let's`,
                selectorExpr: `document.querySelectorAll(".blocklyFlyoutButton")[2]`,
                beaconAlign: "right"
            }
        ]
    },
    {
        title: "Sharing your Custom Block with Others",
        description: ``
    }
];
// <p>A useful tip is to look for the similar code that you tend to make a copy of them to reuse in your project.</p>

class Tutorial extends React.Component {
    constructor(props) {
        super(props);
        this.onNextInstruction = this.onNextInstruction.bind(this);
        this.props.onLoadNewTutorial(steps);

        bindAll(this, ["onWorkspaceUpdate", "onWorkspaceSetup", "highlightFocusBlocks"]);
        this.state = {
            workspaceReady: false
        };
    }

    onNextInstruction(delay = 0) {
        analytics.event({
            category: "Tutorial",
            action: "Complete Step",
            label: `step: ${this.props.tutorial.currentStep}, instruction: ${
                this.props.tutorial.currentInstruction
                }`
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
                setTimeout(() => {
                    workspace.clear();
                    // addBlocksToWorkspace(workspace, instruction.workspaceSetupCode); //call it by onWsUpdate
                    workspaceFromXml(workspace, instruction.workspaceSetupCode);
                    workspace.cleanUp();
                    workspace.scrollCenter();
                }, 100);
            }
        }
    }

    onWorkspaceUpdate() {
        this.workspace =
            ScratchBlocks.getMainWorkspace() || Blockly.getMainWorkspace();
        this.flyout = Object.values(ScratchBlocks.Workspace.WorkspaceDB_).find(
            ws => ws.isFlyout
        );
        window.flyout = this.flyout;

        if (this.workspace) {
            this.onWorkspaceSetup();
        }

        sendFeedbackData({
            questionId: 1,
            question: "Do you like the hint?",
            feedback: "A lot"
        });
    }

    sendFeedback() {
        sendFeedbackData("data");
    }

    highlightFocusBlocks(id1,id2, color) {
        this.workspace.drawHighlightBox(id1, id2, color?{color:color}:null);
    }

    componentDidMount() {
        this.props.vm.addListener("workspaceUpdate", this.onWorkspaceUpdate);
        console.log('component did mount');
    }

    render() {
        const { steps, currentStep, currentInstruction } = this.props.tutorial;
        if (steps.length > 0) {
            const instruction = steps[currentStep].instructions[currentInstruction];
            if (this.workspace && instruction.workspaceSetupCode) {
                this.onWorkspaceSetup();
            }
            const target = eval(instruction.selectorExpr);

            //clean up highlight block for every render
            if(instruction&&this.workspace){
                this.workspace.removeHighlightBox();
            }
            if (instruction.focusBlocks) {
                instruction.focusBlocks.forEach(blocksHighlightObj=>{
                    this.highlightFocusBlocks(blocksHighlightObj.id1,blocksHighlightObj.id2,blocksHighlightObj.color);
                })
            }
            
            const triggerNextTarget = eval(instruction.triggerNextTarget);
            if (triggerNextTarget || target) {
                (triggerNextTarget || target).addEventListener(instruction.triggerTargetEvent||"click", () => {
                    this.onNextInstruction(instruction.delayNextInstruction || 200);
                }, {once:true});
            }
            return (
                <TutorialComponent
                    {...this.props.tutorial}
                    target={target}
                    isDevMode
                    onNextInstruction={this.props.onNextInstruction}
                    onMarkInstructionComplete={this.props.onMarkInstructionComplete}
                />
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => ({
    tutorial: state.scratchGui.tutorial,
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    onLoadNewTutorial: steps => dispatch(loadNewTutorial(steps)),
    onNextInstruction: () => dispatch(nextInstruction()),
    onSetFocusTarget: domTarget => dispatch(setFocusTarget(domTarget)),
    onMarkInstructionComplete: (stepIdx, instIdx) =>
        dispatch(markInstructionComplete(stepIdx, instIdx)),
    onFetchedProjectData: projectId => {
        dispatch(setProjectId(projectId));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tutorial);
