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
import cloningConcept from './intro/cloning-concept.gif';
import walkingMovement from './intro/walking-movement.gif';
import catCloning from './intro/cat-cloning.png';
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
            {
                id: 'intro-vid',
                video: 'rpjvs3v9gj'
            },
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
                    <p>Exercise: Follow the animated instruction below and click "Check"</p>
                ),
                image: stepMoveSayHello,
                expected: [["event_whenflagclicked", "motion_movesteps", "looks_sayforsecs"]],
            }, {
                id: 'tip-delete',
                title: (
                    <p>Tip: Right click a block -> Delete to delete the block. <br />
                        Drag a block to toolbox to also delete all blocks that follow.</p>
                ),
                image: deleteCode,
                shouldCleanup: true
            }, {
                id: 'tip-inspect',
                title: (
                    <p>Tip: Separate each code part and click it to see what it does.</p>
                ),
                image: inspectCode,
            },
            {
                id: 'say-random-num',
                title: (
                    <p>Exercise: Make the cat say a random number (1  to 10) when the green flag is clicked. <br />
                        Click "Check" when you are done.</p>
                ),
                image: sayRandomNum,
                expected: [["event_whenflagclicked", "looks_say", "operator_random"]]
            },
            {   id: 'color-random',
                title: (
                    <p>Exercise: Change color of the cat for 1 second! Experiment with a different value (0 to 200). <br />
                        Click "Check" when you are done.</p>
                ),
                image: coloringTheCat,
                shouldCleanup: true,
                expected: [["event_whenflagclicked", "looks_seteffectto", "control_wait", "looks_cleargraphiceffects"]]
            }, {
                id: 'concept-sprite',
                title: (
                    <p>Concept: A Scratch program can contain many sprites. <br />
                        Each sprite has Code, Costumes and Sounds associated with it.</p>
                ),
                image: spriteAndMedia,
                shouldCleanup: true
            }, 
            {
                id: 'walking-anim',
                title: (
                    <p>Exercise: Create a basic walking animation using switching costume, wait, and forever blocks.<br />
                        Click "Check" when you are done.</p>
                ),
                image: walkingMovement,
                expected: [
                    ["event_whenflagclicked", "control_forever","looks_switchcostumeto","control_wait","looks_switchcostumeto","control_wait"]
                ]
            },
            {
                id: 'exercise-custom-block',
                title: (
                    <p>Exercise: Create your own block (custom blocks) for making a cat jump.</p>
                ),
                // setupCode: "<xml xmlns='http://www.w3.org/1999/xhtml'><variables><variable type='' id='`jEk@4|i[#Fk?(8x)AV.-my variable' islocal='false' iscloud='false'>my variable</variable></variables><block type='event_whenflagclicked' id='nS%|epzBTZ9MAh5R_[^C' x='193' y='-166'><next><block type='control_repeat' id='F)B7WS}*NK-yqCu|~0_}'><value name='TIMES'><shadow type='math_whole_number' id='G~am[V*qX:8pB?+93#2!'><field name='NUM'>10</field></shadow></value><statement name='SUBSTACK'><block type='procedures_call' id='Xlvcm4Dmce60TBqlmzO.'><mutation proccode='jump' argumentids='[]' warp='false'></mutation><next><block type='control_wait' id='BfqXgyLh]9;0$Y[OcH0S'><value name='DURATION'><shadow type='math_positive_number' id=':Dy#+PxNbf)e)xv,r%8F'><field name='NUM'>1</field></shadow></value></block></next></block></statement></block></next></block><block type='procedures_definition' id='4@]:LJ+nntkjHr4h)?F=' x='797' y='-173'><statement name='custom_block'><shadow type='procedures_prototype' id='Rm7[WQ9V@FE.A{TgiPQ@'><mutation proccode='jump' argumentids='[]' argumentnames='[]' argumentdefaults='[]' warp='false'></mutation></shadow></statement><next><block type='motion_changeyby' id='aC55:`CXO@oHd+lwV`BR'><value name='DY'><shadow type='math_number' id='r]6W%A~@1c2*NxLw5GQ)'><field name='NUM'>10</field></shadow></value><next><block type='control_wait' id='SIj}b!@@htQa4|tR+)/;'><value name='DURATION'><shadow type='math_positive_number' id='93l5{b40Hqc03n%b1DdT'><field name='NUM'>0.5</field></shadow></value><next><block type='motion_changeyby' id='O:R=%,,lF{3imodQ%N/f'><value name='DY'><shadow type='math_number' id='-1a#uN3j%.F#kzb7UMJD'><field name='NUM'>-10</field></shadow></value></block></next></block></next></block></next></block></xml>",
                expected: [
                    ["event_whenflagclicked", "control_repeat", "procedures_call", "control_wait"],
                    ["procedures_definition", "motion_changeyby", "control_wait", "motion_changeyby"]
                ]
            },
            {   
                id: 'concept-cloning',
                title: (
                    <p>Concept: Cloning in Scratch is creating multiple copies of itself <br />
                        by using "create clone of "myself" and "when I start as a clone" blocks.</p>
                ),
                image: cloningConcept,
                shouldCleanup: true,
                setupCode: "<xml xmlns='http://www.w3.org/1999/xhtml'><block type='event_whenflagclicked' id='Ed+KUz?n--I~Td}6xi2I' x='99' y='-250'><next><block type='looks_hide' id='{8jqxUwd*%?pt6oC2Wq!'><next><block type='control_repeat' id='gIU9=Mv12Wh@~awauzub'><value name='TIMES'><shadow type='math_whole_number' id='lkypM}p}o-Lz/pqMeSzw'><field name='NUM'>5</field></shadow></value><statement name='SUBSTACK'><block type='control_create_clone_of' id='`^yOe_.aB{y|A}Fej8QL'><value name='CLONE_OPTION'><shadow type='control_create_clone_of_menu' id='[[8S}#7`aMP[IN#;{e|,'><field name='CLONE_OPTION'>_myself_</field></shadow></value></block></statement></block></next></block></next></block><block type='control_start_as_clone' id='enXotOX{(Gyls@7Yb=JV' x='99' y='56'><next><block type='looks_show' id='X%,+1;_b#2bd.4g,l^mt'><next><block type='motion_goto' id='%c3q3613gGFNkD$D66(o'><value name='TO'><shadow type='motion_goto_menu' id='_pdjAzCJtp4#Vdz0bm#0'><field name='TO'>_random_</field></shadow></value><next><block type='looks_say' id='s7owYH^c0?k{~10Y^p7q'><value name='MESSAGE'><shadow type='text' id='KN(cq~:7%TBk|8jdsEX-'><field name='TEXT'>Hello!</field></shadow></value></block></next></block></next></block></next></block></xml>"
            },
            {
                id: 'exercise-cloning',
                title: (
                    <p>A small program is already setup for you. It creates 5 cat clones that go to random position and say "Hello!"<br />
                        Exercise: Modify the program so each cat clone goes to a random position,<br />
                        say a random number (1-10), and being set with a random color effect (1-200)<br />
                        Click "Check" when you are done.</p>
                ),
                image: catCloning,
                shouldCleanup: true
            }, 
            {
                id: 'completion',
                title: (
                    <p>Please enter the completion code below to the main survey.</p>
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
                    <p> This program generates rows of green squares and blue triangles with decreasingly lighter shades.<br />
                        The remaining instructions will guide you to improve this program.</p>
                )
            }, {
                title: (<p>Experiment: Let's modify the change x by ? so that color shades fill the available area.</p>)
            }, {
                title: (<p>Experiment: Let's modify repeat n so to gain a few more shades.</p>)
            }, {
                title: (<p>Tip: Toggle on the Code Wizard for help</p>),
                onlyVisibleToGroup: 'automated'
            }, {
                title: (<p>Tip: Program parts that are modified together often as a result of copy-and-paste code often <br />
                    suggest an improvement opportunity to extract a custom block from those parts</p>),
                onlyVisibleToGroup: 'manual'
            }, {
                title: (<p>Change x by 35 and change brightness by 8 seem to give a good result. <br />
                    Let's make these changes in the custom block definition that you just created. </p>)
            },
            {
                title: (<p>Please enter the completion code below to the main survey.</p>),
                completionCode: 'abstraction',
                recordCompletion: true
            }
        ]
    },
    'squares-in-motion': {
        steps: [
            {
                // video: 'apchqdve3p',
                title: (
                    <p>Squares in Motion</p>
                )
            }, {
                title: (<p>This program animates square clones of alternating color (blue and red) that move outward from the center and disappear. <br />
                    Exercise: Enhance the animation of the square clones flying outward so that
                    1) they move further to the edge of stage.
                    2) their color gradually fade out.
                    Hints are provided in the next card if needed.
                </p>)
            }, {
                title: (<p>
                    1) they move further to the edge of stage
                2) their color gradually fade out</p>)
            },
            {
                title: (
                    <p>Please enter the completion code below to the main survey.<br />
                        You will need the completed work file to upload to the main survey. <br />
                        Please download the work you have completed by clicking File => Save to your computer.
                    </p>
                ),
                completionCode: 'happy-remixing',
                recordCompletion: true
            }
        ]
    }
}