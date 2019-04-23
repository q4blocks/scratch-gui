import React from "react";
import TutorialComponent from "../components/tutorial/tutorial.jsx";
import { connect } from "react-redux";
import bindAll from "lodash.bindall";
import { loadNewTutorial, nextInstruction, setFocusTarget, markInstructionComplete } from "../reducers/tutorial";
import ScratchBlocks from "scratch-blocks";
import analytics, { stitchClient, sendFeedbackData } from "../lib/custom-analytics";

import { addBlocksToWorkspace, testBlocks, workspaceFromXml } from "../lib/hints/hint-test-workspace-setup";

import { setProjectId } from '../reducers/project-state';
import { setCustomFeatureToggleVisible, featureNames } from '../reducers/custom-menu';

const HIGHLIGHT_COLOR = { GREEN: '#92C124', BLUE: '#3C91E6', RED: '#F15152' };

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
                // modalSize: "large",
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
                <p>We begin with a simple script that makes the sprite move repeatedly in a small circle (expressed by the blocks inside the red line) 
                and then in a bigger circle (expressed by the blocks inside the blue line).</p>
                <p>Click <b>Green Flag</b> to see what it does. Then click "Next"</p>
               `,
                selectorExpr: `this.workspace.getBlockById('__greenflag__').svgGroup_.firstElementChild`,
                focusBlocks: [{ id1: '__small-rotation__', color: HIGHLIGHT_COLOR.RED }, { id1: '__large-rotation__', color: HIGHLIGHT_COLOR.BLUE }],
                beaconAlign: "right",
                floaterPlacement: "right",
                checkUserCode: true
            },
            {
                customContent: `
                <p>
                We will use these blocks to perform a circle-around movement in multiple places in the code. Instead of duplicating these blocks, 
                it would be better to create a <b>custom block</b>
                </p>
               `,
                selectorExpr: `this.workspace.getBlockById('__small-rotation__').svgGroup_`,
                focusBlocks: [{ id1: '__small-rotation__', color: HIGHLIGHT_COLOR.RED }, { id1: '__large-rotation__', color: HIGHLIGHT_COLOR.BLUE }],
                beaconAlign: "right",
                floaterPlacement: "right",
                checkUserCode: true
            },
            {
                customContent: `
                <p>
                Let's create a custom block that only performs a <em>small</em> circle-around movement first.
                Don't worry! We will later make our custom block to also perform a<em>big</em> circle-around movement.
                </p>
               `,
                selectorExpr: `this.workspace.getBlockById('__small-rotation__').svgGroup_.firstElementChild`,
                focusBlocks: [{ id1: '__small-rotation__', color: HIGHLIGHT_COLOR.RED }],
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
                <p>This is a <b>definition</b> block. It describes what your Custom Block does!</p>
                <p>Copy the code that performs the small circle-around movement highlighted in red and snap it to this definition block</p>`,
                selectorExpr: `this.workspace.getAllBlocks().find(b=>b.type==='procedures_definition').svgGroup_`,
                beaconAlign: "right",
                floaterPlacement: "right",
                checkUserCode: true,
                focusBlocks: [{ id1: '__small-rotation__', color: HIGHLIGHT_COLOR.RED }]
            },
            {
                customContent: `<p><b>Great Job!</b> Scratch places all your custom blocks in the <b>"My Blocks"</b> category.</p>
                    <p>These custom blocks can be used to call your definition blocks from anywhere in the workspace. </p>
                    <p>Let's use the custom block you have just created!</p>
                    <p>Let's replace the blocks in the workspace that perform the small circle-around movement with our custom block</p>`,
                selectorExpr: `this.flyout.getAllBlocks().find(b=>b.type==='procedures_call').svgGroup_`,
                focusBlocks: [{ id1: '__small-rotation__', color: HIGHLIGHT_COLOR.RED }],
                beaconAlign: "bottom",
                floaterPlacement: "bottom",
                checkUserCode: true
            },
            {
                customContent: `
                <p>Before moving on, click <b>Green Flag</b> to check if your code still works the same way. It should!</p>`,
                selectorExpr: `document.querySelector('.greenFlag')`,
                beaconAlign: "left",
                floaterPlacement: "left",
                delayNextInstruction: 2000
            },
            {
                customContent: `
                <p>Looks like it works exactly like before! 
                You are on your way to mastering the use of custom blocks!</p>
                <p>But this custom block only performs a small circle-around movement though.</p>
                <p>Luckily, you don't need to create another custom block to perform a big circle-around movement.</p>
                </p>
                `,
                selectorExpr: `this.workspace.getAllBlocks().find(b=>b.type==='procedures_definition').svgGroup_`,
                beaconAlign: "right",
                floaterPlacement: "right",
                checkUserCode: true
            },
            {
                customContent: `
                <p>Taking a closer look, the small circle-around movement moves 8 steps while the big circle-around movement moves 16 steps.</p> 
                <p>We need a way to pass different inputs when calling our custom block.</p>
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
                delayNextInstruction: 2000,
                autoNext: true
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
                selectorExpr: `document.querySelectorAll("div[class*='custom-procedures_option-card']")[0]`
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
                <p>Let's call our custom block with the input value of 8 for the small circle-around movement.</p>
                <p>Type in 8 as the input to our custom block</p>`,
                beaconAlign: "right",
                floaterPlacement: "right",
                selectorExpr: `this.workspace.getAllBlocks().find(b=>b.type==='procedures_call').svgGroup_.firstElementChild`,
                checkUserCode: true
            },
            {
                customContent: `
                <p>This <b>steps</b> parameter block will hold the input value</p>
                <p>We can use this <b>steps</b> parameter anywhere in our custom block's definition.</p>
                <p>To use, drag the <b>steps</b> parameter block and drop it into the move block's input (highlighted).
                Click "Next" when you are done.</p>
                `,
                beaconAlign: "top",
                floaterPlacement: "top",
                // selectorExpr: `Blockly.getMainWorkspace().getAllBlocks().find(b=>b.type==='procedures_definition').svgGroup_.firstElementChild`,
                selectorExpr: `Blockly.getMainWorkspace().getAllBlocks().find(b=>b.type==='argument_reporter_string_number').svgGroup_`,
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
                <p>We can finally use it to perform the big circle-around movement!<p>
                `,
                isModal: true,
                floaterPlacement: "center"
            },
            {
                customContent: `
                <p>Let's replace the code that performs the big circle-around movement with our <b>Circle Around</b> custom block 
                and give it the input value of 16. Click "Next" when you are done.</p>`,
                beaconAlign: "left",
                floaterPlacement: "left",
                selectorExpr: `this.workspace.getBlockById('__large-rotation__').svgGroup_.firstElementChild`,
                checkUserCode: true,
                focusBlocks: [{ id1: '__large-rotation__', color: HIGHLIGHT_COLOR.BLUE }]
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
                customContent: `Looks like it works exactly like before, but your code looks much better.
                <p><b>Custom blocks</b> is your best friend if you want to make your code easy to understand and reuse.</p>
                `,
                isModal: true,
                floaterPlacement: "center"
            }
        ]
    },
    {
        title: "Bonus Feature: Code Wizard",
        description: ``,
        instructions: [
            {
                //tutorial state setup
                test: true,
                customContent: ``,
                checkUserCode: true,
                workspaceSetupCode: "<xml xmlns='http://www.w3.org/1999/xhtml'><variables></variables><block type='event_whenflagclicked' id='__greenflag__' x='94' y='356'><next><block type='motion_pointindirection' id='5D8/lOi*ez?L?]g:Jf16'><value name='DIRECTION'><shadow type='math_angle' id='fdEf3Z{0RgCW|VA`:sWM'><field name='NUM'>90</field></shadow></value><next><block type='motion_gotoxy' id='qkU;n/VdHe*=6#O$BI*w'><value name='X'><shadow type='math_number' id=')|vDEhyVpv^37|86U_p:'><field name='NUM'>0</field></shadow></value><value name='Y'><shadow type='math_number' id=',N.d]yQ5GaEjyW(eqV!5'><field name='NUM'>0</field></shadow></value><next><block type='control_forever' id='[-9M@[PxGGZJ1-qt/frn'><statement name='SUBSTACK'><block type='control_repeat' id='__small-rotation__'><value name='TIMES'><shadow type='math_whole_number' id='41Q24urK5FdwuxP/%R_1'><field name='NUM'>36</field></shadow></value><statement name='SUBSTACK'><block type='motion_movesteps' id='@g`*zKNybwlqc|VR]eZ1'><value name='STEPS'><shadow type='math_number' id='?L2h~z?Rt}l^pF[%3Bz;'><field name='NUM'>8</field></shadow></value><next><block type='motion_turnright' id='Pv;`~cP%q/2RJl~$dF`r'><value name='DEGREES'><shadow type='math_number' id=':d=7D*9HnQBpVJ:ulBui'><field name='NUM'>10</field></shadow></value></block></next></block></statement><next><block type='control_repeat' id='__large-rotation__'><value name='TIMES'><shadow type='math_whole_number' id='Bh4DS?}@e,(y4u@FcmRG'><field name='NUM'>36</field></shadow></value><statement name='SUBSTACK'><block type='motion_movesteps' id='z=Q`YbRL`Uc)rxL7}WTV'><value name='STEPS'><shadow type='math_number' id='}X;Ch0|QdXHW`of%*O)u'><field name='NUM'>16</field></shadow></value><next><block type='motion_turnright' id='M8}K:4UF8|z:)i=RQjv2'><value name='DEGREES'><shadow type='math_number' id='Q[LO_[Ba5VN:lHCT@uX['><field name='NUM'>10</field></shadow></value></block></next></block></statement></block></next></block></statement></block></next></block></next></block></next></block></xml>",
                delayNextInstruction: 2000,
                isIntermediateInstruction: true,
                autoNext: true
            },
            {
                isModal: true,
                floaterPlacement: "center",
                customContent: `<h3>Bonus Feature: Code Wizard Unlocked!</h3>
                <p><b>Code Wizard</b> feature provides you with suggestions and helps to create <b>Custom Blocks</b> in your project.</p>
                `,
                customizedNextButtonText: "Try it out",
                customAction: "this.props.onShowCodeHintToggle()"
            },
            {
                customContent: `Tap the toggle to enable the "Code Wizard" feature`,
                selectorExpr: `document.querySelector('.code-hint-feature-toggle')`,
                beaconAlign: "bottom"
            },
            {
                customContent: `
                <p>Let's see how it works with the original example.</p>
                <p><b>Code Wizard</b> is available to help when you see the light bulb hint icons.</p>
                `,
                isModal: true,
                selectorExpr: `document.querySelector('.code-hint-feature-toggle')`
            },
            {
                customContent: `<p>You will create a custom block again. Don't worry it will be quick this time 
                with the help of <b>Code Wizard</b></p>
                <p><b>Mouse over</b> the hint icon to view the improvement suggestions. Click Next when you are done.</p>
                `,
                selectorExpr: `this.workspace.getBlockById('__greenflag__').svgGroup_`,
                checkUserCode: true,
                beaconAlign: "left",
                floaterPlacement: "left"
            },
            {
                customContent: `
                <p>There is no magic really! You already know how to do all of this!</p>
                <p>The wizard is not that smart though... you should <b>Right click</b> the definition block to change 
                the names of custom blocks and their input parameters. You know your code better than anyone!</p>
                `,
                selectorExpr: `this.workspace.getBlockById('__greenflag__').svgGroup_`,
                beaconAlign: "left",
                floaterPlacement: "left",
                checkUserCode: true
            },
            {
                customContent: `
                <p> The Wizard is here to help but you don't have to follow all the hints. It's entirely up to you!</p> 
                <p>You can tap the toggle to enable or disable the Wizard at any time.</p>
                `,
                selectorExpr: `document.querySelector('.code-hint-feature-toggle')`,
                beaconAlign: "bottom",
                checkUserCode: true
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
                isIntermediateInstruction: true,
                autoNext: true
            },
            {
                isModal: true,
                floaterPlacement: "center",
                customContent: `<p>
                Well done! You have just learned the basics of creating and calling custom blocks!
                </p>`,
                customAction: "this.props.onShowProcedureShareToggle()",
                customizedNextButtonText: "Continue"
            },
            {
                customContent: `
                You have unlocked the <b>Custom Block Sharing</b> feature!
                You can learn more about this feature by following this link to a short video.</p>
                `,
                selectorExpr: `document.querySelector('.procedure-share-feature-toggle')`,
                beaconAlign: "bottom",
                checkUserCode: true,
                isModal: true
            },
            {
                customContent: `<p>
                    We are working on the <b>Code Wizard</b> feature and would like to hear your feedback!
                    <ul>
                        <li>How helpful did you find the Code Wizard's hint in helping you see where you can improve your code? (Scale 1 (least helpful) - 5(helpful))</li>
                        <li>How helpful did you find the Code Wizard's "Extract a Custom Block" helpful? (Scale 1-5)</li>
                        <li>Any other comments  (e.g., What did you like/dislike? 
                            How the <b>Code Wizard</b> feature can be improved ? (optional text input)</li>
                    </ul>
                </p>`,
                floaterPlacement: "center",
                isModal: true,
                modalSize: "large",
                customizedNextButtonText: "Exit"
            }
        ]
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
                    if (instruction.autoNext) {
                        this.props.onNextInstruction();
                    }
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

    highlightFocusBlocks(id1, id2, color) {
        this.workspace.drawHighlightBox(id1, id2, color ? { color: color } : null);
    }

    componentDidMount() {
        this.props.vm.addListener("workspaceUpdate", this.onWorkspaceUpdate);
    }

    componentDidUpdate() {
        const { steps, currentStep, currentInstruction } = this.props.tutorial;
        if (steps.length > 0) {
            const instruction = steps[currentStep].instructions[currentInstruction];
            if (instruction.customAction) {
                eval(instruction.customAction);
            }
        }
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
            if (instruction && this.workspace) {
                this.workspace.removeHighlightBox();
            }
            if (instruction.focusBlocks) {
                instruction.focusBlocks.forEach(blocksHighlightObj => {
                    this.highlightFocusBlocks(blocksHighlightObj.id1, blocksHighlightObj.id2, blocksHighlightObj.color);
                })
            }

            const triggerNextTarget = eval(instruction.triggerNextTarget);
            if (triggerNextTarget || target) {
                (triggerNextTarget || target).addEventListener(instruction.triggerTargetEvent || "click", () => {
                    this.onNextInstruction(instruction.delayNextInstruction || 200);
                }, { once: true });
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
    },
    onShowProcedureShareToggle: () => dispatch(setCustomFeatureToggleVisible(featureNames.PROCEDURE_SHARE, true)),
    onShowCodeHintToggle: () => dispatch(setCustomFeatureToggleVisible(featureNames.QUALITY_HINT, true))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tutorial);
