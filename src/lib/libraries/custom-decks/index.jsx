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
import customBlockConcept from './intro/custom-block-concept.gif';
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
                video: 'rpjvs3v9gj'
            },
            {
                title: (
                    <p>Exercise: Follow the animated instruction below and click "Check"</p>
                ),
                image: stepMove,
                expected: ["motion_movesteps", "looks_sayforsecs"],
            }, {
                title: (
                    <p>Exercise: Follow the animated instruction below and click "Check"</p>
                ),
                image: stepMoveSayHello,
                expected: ["event_whenflagclicked", "motion_movesteps", "looks_sayforsecs"],
            }, {
                title: (
                    <p>Tip: Right click a block -> Delete to delete the block. <br/>
                        Drag a block to toolbox to also delete all blocks that follow.</p>
                ),
                image: deleteCode,
                shouldCleanup: true
            }, {
                title: (
                    <p>Tip: Separate each code part and click it to see what it does.</p>
                ),
                image: inspectCode,
            },
            {
                title: (
                    <p>Exercise: Make the cat say a random number (1  to 10) when the green flag is clicked. <br/>
                    Click "Check" when you are done.</p>
                ),
                image: sayRandomNum,
                expected: ["event_whenflagclicked", "looks_say"]
            }, {
                title: (
                    <p>Exercise: Change color of the cat for 1 second! Experiment with a different value (0 to 200). <br/>
                    Click "Check" when you are done.</p>
                ),
                image: coloringTheCat,
                expected: ["event_whenflagclicked", "looks_seteffectto", "control_wait", "looks_cleargraphiceffects"],
                shouldCleanup: true
            }, {
                title: (
                    <p>Concept: A Scratch program can contain many sprites. <br/>
                    Each sprite has Code, Costumes and Sounds associated with it.</p>
                ),
                image: spriteAndMedia,
                shouldCleanup: true
            }, {
                title: (
                    <p>Exercise: Create a basic walking animation using switching costume, wait, and forever blocks.<br/> 
                    Click "Check" when you are done.</p>
                ),
                image: walkingMovement
            }, 
            {
                title: (
                    <p>Concept: Cloning in Scratch is creating multiple copies of itself <br/>
                    by using "create clone of "myself" and "when I start as a clone" blocks.</p>
                ),
                image: customBlockConcept,
                shouldCleanup: true,
                setupCode: "<xml xmlns='http://www.w3.org/1999/xhtml'><block type='event_whenflagclicked' id='Ed+KUz?n--I~Td}6xi2I' x='99' y='-250'><next><block type='looks_hide' id='{8jqxUwd*%?pt6oC2Wq!'><next><block type='control_repeat' id='gIU9=Mv12Wh@~awauzub'><value name='TIMES'><shadow type='math_whole_number' id='lkypM}p}o-Lz/pqMeSzw'><field name='NUM'>5</field></shadow></value><statement name='SUBSTACK'><block type='control_create_clone_of' id='`^yOe_.aB{y|A}Fej8QL'><value name='CLONE_OPTION'><shadow type='control_create_clone_of_menu' id='[[8S}#7`aMP[IN#;{e|,'><field name='CLONE_OPTION'>_myself_</field></shadow></value></block></statement></block></next></block></next></block><block type='control_start_as_clone' id='enXotOX{(Gyls@7Yb=JV' x='99' y='56'><next><block type='looks_show' id='X%,+1;_b#2bd.4g,l^mt'><next><block type='motion_goto' id='%c3q3613gGFNkD$D66(o'><value name='TO'><shadow type='motion_goto_menu' id='_pdjAzCJtp4#Vdz0bm#0'><field name='TO'>_random_</field></shadow></value><next><block type='looks_say' id='s7owYH^c0?k{~10Y^p7q'><value name='MESSAGE'><shadow type='text' id='KN(cq~:7%TBk|8jdsEX-'><field name='TEXT'>Hello!</field></shadow></value></block></next></block></next></block></next></block></xml>"
            }, 
            {
                title: (
                    <p>A small program is already setup for you. It creates 5 cat clones that go to random position and say "Hello!"<br/>
                    Exercise: Modify the program so each cat clone goes to a random position,<br/> 
                    say a random number (1-10), and being set with a random color effect (1-200)<br/>
                    Click "Check" when you are done.</p>
                ),
                image: catCloning,
                shouldCleanup: true
            }, {
                title: (
                    <p>Please enter the completion code below to the main survey.</p>
                ),
                completionCode: 'scratch101',
                recordCompletion: true
            }
        ],
        urlId: 'getStarted'
    },

    'shape-styling': {
        steps: [
            {
                title: (
                    <p>Shape Styling</p>
                )
            },
            {
                title: (
                    <p>Please enter the completion code below to the main survey.</p>
                ),
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
            },
            {
                title: (
                    <p>Please enter the completion code below to the main survey.</p>
                ),
                completionCode: 'happy-remixing',
                recordCompletion: true
            }
        ]
    }
}