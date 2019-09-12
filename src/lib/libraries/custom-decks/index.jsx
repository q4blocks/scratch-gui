import React from 'react';
import { FormattedMessage } from 'react-intl';

// Intro
import libraryIntro from './intro/lib-getting-started.jpg';
import stepMove from './intro/intro1.gif';
import stepMoveSayHello from './intro/intro2.gif';
import inspectCode from './intro/figure-out-code-1.gif'
import deleteCode from './intro/delete-code.gif';
import sayRandomNum from './intro/say-random-number.gif';
import coloringTheCat from './intro/coloring-the-cat.gif';
import spriteAndMedia from './intro/sprite-and-media.gif';
import jump0 from './intro/tutorial-noparam-custom-block.gif';
import jump1 from './intro/tutorial-1param-custom-block.gif'
import cloningConcept from './intro/cloning-concept.gif';
import walkingMovement from './intro/walking-movement.gif';
import catCloning from './intro/cat-cloning.png';
import originalVsGoal from './custom-block-deck/custom-card-original-vs-goal.png';
import copyPasteReuse from './custom-block-deck/copy-paste-modify.gif';

//QI
import customBlockCfg from './intro/custom-block-cfg.png';
import modifyBrightness from './custom-block-deck/modify-brightness-effect.png';
import modifyRepeat from './custom-block-deck/modify-repeat.png';
import enableHintRefactoring from './custom-block-deck/enable-hint-refactoring.gif';
import modifyChangeXBy from './custom-block-deck/modify-change-x-by.png';

//study tasks
import cloneAction from './study-tasks/clone-action.png';
import createCloneSeq from './study-tasks/create-clone-seq.png';
import studyTask1 from './study-tasks/study-task-1.gif';
import studyTask2 from './study-tasks/study-task-2.gif';
import studyTask3 from './study-tasks/study-task-3.gif';

export default {
    'scratch-basics': {
        name: (
            <FormattedMessage
                defaultMessage="Getting Started"
                description="Name for the 'Getting Started' how-to"
                id="gui.howtos.intro-move-sayhello-hat.name"
            />
        ),
        tags: ['help', 'stuck', 'how', 'can', 'say'],
        img: libraryIntro,
        steps: [
            // {
            //     id: 'intro-vid',
            //     video: 'rpjvs3v9gj'
            // },
            {
                id: 'move-say',
                title: (
                    <p>Exercise: Follow the animated instruction below and click "Check"</p>
                ),
                image: stepMove,
                expected: [["motion_movesteps", "looks_sayforsecs"]],
            }, {
                id: 'gf-move-say',
                title: (
                    <p>Exercise: Put "When Green Flag Clicked" block at the top, click the "Green Flag" button to run your first program.</p>
                ),
                image: stepMoveSayHello,
                expected: [["event_whenflagclicked", "motion_movesteps", "looks_sayforsecs"]],
            }, 
            {
                id: 'tip-inspect',
                title: (
                    <p>Tip: Separate each code part and click it to see what it does.</p>
                ),
                image: inspectCode,
            },
            {
                id: 'tip-delete',
                title: (
                    <p>Tip: Right click a block then select "Delete Block" to delete it.
                    When a block is dragged, the block sequence connected below it will also move along. 
                    Placing a block or a sequence of blocks to the toolbox area to delete.
                    </p>
                ),
                image: deleteCode,
                shouldCleanup: true
            }, 
            {   id: 'color-random',
                title: (
                    <p>Exercise: Create a program that makes the cat turns purple 1 second when the green flag is clicked.
                        Experiment with the following color effect values (50,100,140,180).</p>
                ),
                image: coloringTheCat,
                shouldCleanup: true,
                expected: [[//140
                    "event_whenflagclicked", "looks_seteffectto", "control_wait", "looks_cleargraphiceffects"]],
                customCheck: "Blockly.getMainWorkspace().getAllBlocks().filter(b=>b.type==='looks_seteffectto').filter(b=>b.getChildren()[0].getFieldValue('NUM')==='140').length === 1"
            }, 
            {
                id: 'concept-sprite',
                title: (
                    <p>Concept: A Scratch program can contain many sprites.
                    Each sprite has Code, Costumes and Sounds associated with it.</p>
                ),
                image: spriteAndMedia,
                shouldCleanup: true
            }, 
            {
                id: 'walking-anim',
                title: (
                    <p>Exercise: Create a basic walking animation.</p>
                ),
                image: walkingMovement,
                expected: [
                    ["event_whenflagclicked", "control_forever","looks_switchcostumeto","control_wait","looks_switchcostumeto","control_wait"]
                ],
                shouldCleanup: true
            },
            {
                id: 'exercise-custom-block',
                title: (
                    <p> The setup program animates cat jumping continuously.
                        Click Green Flag to see the jumping animation. 
                        We can make a "jump" custom block out of the program part that performs the jumping action. <br/>
                        Exercise: Follow the steps below to make a jump block and use it in the code.
                        Click Green Flag to check whether the "jump" custom block indeed makes the cat jumps. 
                        </p>
                ),
                image: jump0,
                setupCode:
                "<xml xmlns='http://www.w3.org/1999/xhtml'><variables><variable type='' id='`jEk@4|i[#Fk?(8x)AV.-my variable' islocal='false' iscloud='false'>my variable</variable></variables><block type='event_whenflagclicked' id='XG3B]7tQO?9{fcPe${Ek' x='200' y='329'><next><block type='control_forever' id='r6NRa`6c|S6Q?:^orT2C'><statement name='SUBSTACK'><block type='control_repeat' id='NLH?/iZ2KT4gTJ`G]t!v'><value name='TIMES'><shadow type='math_whole_number' id='Qa-pGAX@}=-#K*YsMl.r'><field name='NUM'>10</field></shadow></value><statement name='SUBSTACK'><block type='motion_changeyby' id='w9@CehxUS_72Tcx4_z;S'><value name='DY'><shadow type='math_number' id='Mc`LlV3LKet:yE308yP8'><field name='NUM'>2</field></shadow></value></block></statement><next><block type='control_wait' id='{r=;7@mSu*cOh|.*Npz('><value name='DURATION'><shadow type='math_positive_number' id='9,7lBs/r~PiI,Utq_-3T'><field name='NUM'>0.1</field></shadow></value><next><block type='control_repeat' id=']$L98xB}[blm)*2@8^$D'><value name='TIMES'><shadow type='math_whole_number' id='cCSAEMik`Xh*V9E$;JK,'><field name='NUM'>10</field></shadow></value><statement name='SUBSTACK'><block type='motion_changeyby' id='U^cvx=fq1}V(B{iy5NgV'><value name='DY'><shadow type='math_number' id='Vr6HQ/R6dmfQg/^?x)!b'><field name='NUM'>-2</field></shadow></value></block></statement></block></next></block></next></block></statement></block></next></block></xml>", 
                // "<xml xmlns='http://www.w3.org/1999/xhtml'><block type='event_whenflagclicked' id='*2_U~)FT}hV}IOw`WpgI' x='85' y='-257'><next><block type='procedures_call' id='g=H`Y5OO:g%1*FQZ6|?`'><mutation proccode='jump' argumentids='[]' warp='false'></mutation><next><block type='looks_sayforsecs' id='Z#w){$DU+bEc%yC6C~{9'><value name='MESSAGE'><shadow type='text' id='O|Bgc[[|w0V`3Gz6;13J'><field name='TEXT'>Hello!</field></shadow></value><value name='SECS'><shadow type='math_number' id='3E)nusFZxU6MrHR/[N0k'><field name='NUM'>2</field></shadow></value><next><block type='procedures_call' id='t!lUpD{h{:qsfvVIIxHC'><mutation proccode='jump' argumentids='[]' warp='false'></mutation></block></next></block></next></block></next></block><block type='procedures_definition' id='+T)h:,DF~eAw@DD)7Q#-' x='442' y='-254'><statement name='custom_block'><shadow type='procedures_prototype' id='rz~]Ha`+;%uQvVA|qn%C'><mutation proccode='jump' argumentids='[]' argumentnames='[]' argumentdefaults='[]' warp='false'></mutation></shadow></statement><next><block type='motion_changeyby' id='k(AUhXY}Q][D%L;Q+a|#'><value name='DY'><shadow type='math_number' id='U@zOSWEJ1Gc|kVcEiT61'><field name='NUM'>10</field></shadow></value><next><block type='control_wait' id='e7n0whD12mI*HElF-01A'><value name='DURATION'><shadow type='math_positive_number' id='[ss53aQ(PuYF}3SI?m9g'><field name='NUM'>0.5</field></shadow></value><next><block type='motion_changeyby' id='ru7G};a,FsP~}VE/9CkB'><value name='DY'><shadow type='math_number' id='9FHdK6P-J.{];3Qj=**S'><field name='NUM'>-10</field></shadow></value></block></next></block></next></block></next></block></xml>",
                expected: [
                     ["event_whenflagclicked", "control_forever", "procedures_call"],
                    ["procedures_definition", "control_repeat", "motion_changeyby", "control_wait", "control_repeat", "motion_changeyby"]
                ],
                shouldCleanup: true
            },
            {
                id: 'exercise-custom-block-param',
                title: (
                    <p> We want to make the cat jump with different heights.
                        Exercise: Follow the steps below to introduce a height parameter to the "jump" custom block. 
                        Modify the program so the cat alternates between high jump (jump 15) and low jump (jump 5).
                        Click Green Flag to see whether the change to "jump" custom block indeed makes the cat jump with different heights.
                    </p>
                ),
                image: jump1,
                // setupCode:
                // "<xml xmlns='http://www.w3.org/1999/xhtml'><variables><variable type='' id='`jEk@4|i[#Fk?(8x)AV.-my variable' islocal='false' iscloud='false'>my variable</variable></variables><block type='event_whenflagclicked' id='XG3B]7tQO?9{fcPe${Ek' x='213' y='80'><next><block type='control_forever' id='r6NRa`6c|S6Q?:^orT2C'><statement name='SUBSTACK'><block type='procedures_call' id='8lsqu%un%`2q{0%*Wqm#'><mutation proccode='jump' argumentids='[]' warp='false'></mutation></block></statement></block></next></block><block type='procedures_definition' id='LI-IL[,^qf_-B=I=Bjez' x='474' y='80'><statement name='custom_block'><shadow type='procedures_prototype' id='u5H]H[72J4}JhDqh!=7l'><mutation proccode='jump' argumentids='[]' argumentnames='[]' argumentdefaults='[]' warp='false'></mutation></shadow></statement><next><block type='control_repeat' id='NLH?/iZ2KT4gTJ`G]t!v'><value name='TIMES'><shadow type='math_whole_number' id='Qa-pGAX@}=-#K*YsMl.r'><field name='NUM'>10</field></shadow></value><statement name='SUBSTACK'><block type='motion_changeyby' id='w9@CehxUS_72Tcx4_z;S'><value name='DY'><shadow type='math_number' id='Mc`LlV3LKet:yE308yP8'><field name='NUM'>2</field></shadow></value></block></statement><next><block type='control_wait' id='{r=;7@mSu*cOh|.*Npz('><value name='DURATION'><shadow type='math_positive_number' id='9,7lBs/r~PiI,Utq_-3T'><field name='NUM'>0.1</field></shadow></value><next><block type='control_repeat' id=']$L98xB}[blm)*2@8^$D'><value name='TIMES'><shadow type='math_whole_number' id='cCSAEMik`Xh*V9E$;JK,'><field name='NUM'>10</field></shadow></value><statement name='SUBSTACK'><block type='motion_changeyby' id='U^cvx=fq1}V(B{iy5NgV'><value name='DY'><shadow type='math_number' id='Vr6HQ/R6dmfQg/^?x)!b'><field name='NUM'>-2</field></shadow></value></block></statement></block></next></block></next></block></next></block></xml>", 
                expected: [
                    ["event_whenflagclicked", "control_forever", "procedures_call", "procedures_call"],
                    ["procedures_definition", "control_repeat", "motion_changeyby", "control_wait", "control_repeat", "motion_changeyby", "argument_reporter_string_number", "argument_reporter_string_number"]
                ], // customCheck: 1. cb has a param, 2 jumps (with string input) 
            },
            {   
                id: 'concept-cloning',
                title: (
                    <p>Concept: Sprite cloning is creating multiple copies of the character sprite 
                        by using "create clone of "myself" and "when I start as a clone" blocks.</p>
                ),
                image: cloningConcept,
                shouldCleanup: true,
            },
            {
                id: 'exercise-cloning',
                title: (
                    <p>A small program in the workspace creates 5 invisible cat clones, each go to a random position, 
                        becomes visible, and says "Hello!"<br />
                        Exercise: Modify the program so each cat clone goes to a random position,
                        says a random number (1-10), and set itself to a random color effect (1-200)</p>
                ),
                image: catCloning,
                setupCode: "<xml xmlns='http://www.w3.org/1999/xhtml'><block type='event_whenflagclicked' id='Ed+KUz?n--I~Td}6xi2I' x='99' y='-250'><next><block type='looks_hide' id='{8jqxUwd*%?pt6oC2Wq!'><next><block type='control_repeat' id='gIU9=Mv12Wh@~awauzub'><value name='TIMES'><shadow type='math_whole_number' id='lkypM}p}o-Lz/pqMeSzw'><field name='NUM'>5</field></shadow></value><statement name='SUBSTACK'><block type='control_create_clone_of' id='`^yOe_.aB{y|A}Fej8QL'><value name='CLONE_OPTION'><shadow type='control_create_clone_of_menu' id='[[8S}#7`aMP[IN#;{e|,'><field name='CLONE_OPTION'>_myself_</field></shadow></value></block></statement></block></next></block></next></block><block type='control_start_as_clone' id='enXotOX{(Gyls@7Yb=JV' x='99' y='56'><next><block type='looks_show' id='X%,+1;_b#2bd.4g,l^mt'><next><block type='motion_goto' id='%c3q3613gGFNkD$D66(o'><value name='TO'><shadow type='motion_goto_menu' id='_pdjAzCJtp4#Vdz0bm#0'><field name='TO'>_random_</field></shadow></value><next><block type='looks_say' id='s7owYH^c0?k{~10Y^p7q'><value name='MESSAGE'><shadow type='text' id='KN(cq~:7%TBk|8jdsEX-'><field name='TEXT'>Hello!</field></shadow></value></block></next></block></next></block></next></block></xml>",
                shouldCleanup: true
            }, 
            {
                id: 'completion',
                title: (
                    <p>Please copy and paste the completion code below to the main survey.</p>
                ),
                completionCode: 'scratch101',
                recordCompletion: true
            }
        ],
        urlId: 'getStarted'
    },

    'color-shade-generator': {
        steps: [
            {
                title: (
                    <p> The program behind this card generates a rows of green squares with decreasingly lighter shades (left).<br />
                       You will modify this program so that it generates a blue triangles row.</p>
                ),
                image: originalVsGoal
            },{
                title: (<p>Copy and paste the existing program part.<br/> 
                Modify the code:  1) switch costume to triangle 2) set go to x, y  to -215 and 60 respectively, and 3) set the color effect to 85 for blue.
                </p>),
                image: copyPasteReuse
            }, 
            {
                title: (<p>Experiment: Let's modify the two repeat blocks by changing it from 5 to 9.
                Make sure to change the values in two places!
                </p>),
                image: modifyRepeat,
                customCheck: "Blockly.getMainWorkspace().getAllBlocks().filter(b=>b.type==='control_repeat').filter(b=>b.getChildren()[0].getFieldValue('NUM')==='9').length === 2"
            },
            {
                title: (<p>Experiment: The brightness increases too dramatically. Let's change it from 15 to 9.
                Make sure to change the values in two places!</p>),
                image: modifyBrightness,
                customCheck: "Blockly.getMainWorkspace().getAllBlocks().filter(b=>b.type==='looks_changeeffectby').filter(b=>b.getChildren()[0].getFieldValue('NUM')==='9').length === 2"
            }, 
            {
                title: (<p>Tip: You can extract a custom block from common program parts that tend to be modified together.<br />
                Such common program parts perform a specific action and are often the result of copying and pasting code.<br />
                The next instruction will guide you how to improve your code.
                </p>)
            },
            {
                title: (<p>Toggle the Code Wizard to see improvement hints and follow its suggestion! Click check when you are done.</p>),
                onlyVisibleToGroup: 'automated',
                image: enableHintRefactoring,
                customCheck: "(Blockly.getMainWorkspace().getAllBlocks().filter(b=>b.type==='procedures_prototype').length === 1)&&(Blockly.getMainWorkspace().getAllBlocks().filter(b=>b.type==='procedures_call').length===2)"
            }, 
            {
                title: (<p>We can make use of a custom block that we learn previously! Let's do it!</p>),
                onlyVisibleToGroup: 'manual',
                video: 'apchqdve3p',
                customCheck: "(Blockly.getMainWorkspace().getAllBlocks().filter(b=>b.type==='procedures_prototype').length === 1)&&(Blockly.getMainWorkspace().getAllBlocks().filter(b=>b.type==='procedures_call').length===2)"
            }, {
                title: (<p style={{}}>Experiment: Almost there! We need to increase the distance between each shape clone so that they fill the available area.<br/>
                Try 30, 40 and 50. If the right value is used, clicking "Check" will show continue button.</p>),
                image: modifyChangeXBy,
                customCheck: "Blockly.getMainWorkspace().getAllBlocks().filter(b=>b.type==='motion_changexby').filter(b=>b.getChildren()[0].getFieldValue('NUM')==='40').length === 1"
            },
            {
                title: (<p>Please enter the completion code below to the main survey.</p>),
                completionCode: 'abstraction',
                recordCompletion: true
            }
        ]
    },
    'particle-radiator': {
        steps: [
            {
                title: (
                    <div><h2>Particle Radiator</h2>
                    <p>
                    The next two cards provide an overview of what each program part does.
                    The remain instructions ask you to modify the program to match the expected animation.
                    </p></div>
                )
            },
            {
                image: cloneAction
            },
            {
                image: createCloneSeq
            },
            {
                title: (<p>Modify the input of the Repeat block in the "When I start as a clone" by changing it from 8 to 20</p>),
                image: studyTask1
            },
            {
                title: (<p>Add a block "change size by" and use 5 as its input</p>),
                image: studyTask2
            },
            {
                title: (<p>Gradually fade: Add change ghost effect and experiment with effect values (20, 15, 10, 5) so that it looks like the result below.<br/></p>),
                image: studyTask3
            },
            {
                title: (<p>
                    Download your completed work file to your computer and upload to the main survey.
                    To download your completed work, click File and then select "Save to your computer".
                </p>)
            },
            {
                title: (
                    <p>Please enter the completion code below to the main survey.</p>
                ),
                completionCode: 'happy-scratching',
                recordCompletion: true
            }
        ]
    }
}