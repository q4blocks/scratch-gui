// import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import Draggable from 'react-draggable';

import ScratchBlocks from 'scratch-blocks';

import styles from './custom-card.css';
import rightArrow from './icon--next.svg';
import leftArrow from './icon--prev.svg';
import closeIcon from './icon--close.svg';
import shrinkIcon from './icon--shrink.svg';
import expandIcon from './icon--expand.svg';
import isEqual from 'lodash.isequal';

import { workspaceFromXml, addBlocksToWorkspace } from '../../lib/hints/hint-test-workspace-setup.js';
import { saveDataToMongo, queryData } from "../../lib/custom-analytics";
// reference for latest update: https://github.com/LLK/scratch-gui/blob/develop/src/components/cards/cards.jsx

const enableCloseCard = false;
const bypassCheck = true;

const QISCardHeader = ({ onCloseCards, onShrinkExpandCards, totalSteps, step, expanded, dbManager }) => (
    <div className={styles.headerButtons}>
        <div className={styles.allButton}>
            <span>Tutorial</span>
        </div>
        {totalSteps > 1 ? (
            <div className={styles.stepsList}>
                {Array(totalSteps).fill(0)
                    .map((_, i) => (
                        <div
                            className={i === step ? styles.activeStepPip : styles.inactiveStepPip}
                            key={`pip-step-${i}`}
                        />
                    ))}
            </div>
        ) : null}

        <div
            className={styles.shrinkExpandButton}
            onClick={onShrinkExpandCards}
        >
            <img
                draggable={false}
                src={expanded ? shrinkIcon : expandIcon}
            />
            {expanded ?
                <span>Shrink</span> :
                <span>Expand</span>
            }
        </div>
        {enableCloseCard && <div
            className={styles.removeButton}
            onClick={onCloseCards}
        >
            <span>Close</span>
            <img
                className={styles.closeIcon}
                src={closeIcon}
            />
        </div>}

    </div>
)


// // Video step needs to know if the card is being dragged to cover the video
// // so that the mouseup is not swallowed by the iframe.
const VideoStep = ({ video, dragging }) => (
    <div className={styles.stepVideo}>
        {dragging ? (
            <div className={styles.videoCover} />
        ) : null}
        <iframe
            allowFullScreen
            allowTransparency="true"
            frameBorder="0"
            height="338"
            scrolling="no"
            src={`https://fast.wistia.net/embed/iframe/${video}?seo=false&videoFoam=true`}
            title="📹"
            width="600"
        />
        <script
            async
            src="https://fast.wistia.net/assets/external/E-v1.js"
        />
    </div>
);

const checkStmtSequence = ({ topBlock, expected }) => {
    window.topBlock = topBlock;
    let curBlock = topBlock;
    let actual = [];

    while (curBlock) {
        actual.push(curBlock.type);
        curBlock = curBlock.getNextBlock();
    }
    return isEqual(actual, expected);
}

const workspaceContainsScript = ({ workspace, expected }) => {
    window.workspace = workspace;
    const found = workspace.getTopBlocks().find(topBlock => checkStmtSequence({ topBlock, expected }));
    return !!found;
}

const checkStepCompletion = ({ onCompleteStep, vm, expected }) => () => {
    let isComplete = null;
    if (!expected) {
         isComplete =  true;//not specified => auto complete
    } else {
        //compute
        const workspace = ScratchBlocks.getMainWorkspace();
        isComplete = workspaceContainsScript({ workspace, expected });
        //simply complete
        // isComplete =  true;

        // iterate all top blocks
        // then check the presence of a sequence of blocks in each script
        // easiest is to check if workspace contains a specific block command
        // workspaceContainsBlock
        // workspaceContainsBlocks
        // workspaceContainsScript
        // if complete
    }

    isComplete ? onCompleteStep() : () => { };
}

const populateWorkspace = ({ vm }) => {
    const xml = "<xml xmlns='http://www.w3.org/1999/xhtml'><variables></variables><block type='event_whenflagclicked' id='Ony-C:+ZPxHTLTtaS.Xe' x='271' y='172'><next><block type='looks_say' id='b({q2a.SUmk:*heo3XyX'><value name='MESSAGE'><shadow type='text' id='y*vbe.Gw4tAB3:Eq24LA'><field name='TEXT'>Hello!</field></shadow></value></block></next></block></xml>";
    vm.addListener("workspaceUpdate", () => {
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
            setTimeout(() => {
                workspaceFromXml(workspace, xml);
                //auto check //to be removed
                setTimeout(() => { workspaceContainsScript({ workspace, script: null }), 1000 });

            }, 100);
        }
    });
}

const ImageStep = ({ title, image, stepCompleted, onCompleteStep }) => {
    return (
        <Fragment>
            <div className={styles.stepTitle}>
                {title}
            </div>
            <div className={styles.stepImageContainer}>
                <img
                    className={styles.stepImage}
                    draggable={false}
                    src={image}
                />
            </div>
        </Fragment>
    )
};

const NextPrevButtons = ({ isRtl, onNextStep, onPrevStep, expanded, stepCompleted, checkCompletion }) => (
    <Fragment>
        {stepCompleted&&onNextStep ? (
            <div>
                <div className={expanded ? (isRtl ? styles.leftCard : styles.rightCard) : styles.hidden} />
                <div
                    className={expanded ? (isRtl ? styles.leftButton : styles.rightButton) : styles.hidden}
                    onClick={onNextStep}
                >
                    <img
                        draggable={false}
                        src={isRtl ? leftArrow : rightArrow}
                    />
                </div>
            </div>
        ) : null}
        {onPrevStep ? (
            <div>
                <div className={expanded ? (isRtl ? styles.rightCard : styles.leftCard) : styles.hidden} />
                <div
                    className={expanded ? (isRtl ? styles.rightButton : styles.leftButton) : styles.hidden}
                    onClick={onPrevStep}
                >
                    <img
                        draggable={false}
                        src={isRtl ? rightArrow : leftArrow}
                    />
                </div>
            </div>
        ) : null}
    </Fragment>
);


// const PreviewsStep = ({deckIds, content, onActivateDeckFactory, onShowAll}) => (
//     <Fragment>
//         <div className={styles.stepTitle}>
//             <FormattedMessage
//                 defaultMessage="More things to try!"
//                 description="Title card with more things to try"
//                 id="gui.cards.more-things-to-try"
//             />
//         </div>
//         <div className={styles.decks}>
//             {deckIds.slice(0, 2).map(id => (
//                 <div
//                     className={styles.deck}
//                     key={`deck-preview-${id}`}
//                     onClick={onActivateDeckFactory(id)}
//                 >
//                     <img
//                         className={styles.deckImage}
//                         draggable={false}
//                         src={content[id].img}
//                     />
//                     <div className={styles.deckName}>{content[id].name}</div>
//                 </div>
//             ))}
//         </div>
//         <div className={styles.seeAll}>
//             <div
//                 className={styles.seeAllButton}
//                 onClick={onShowAll}
//             >
//                 <FormattedMessage
//                     defaultMessage="See more"
//                     description="Title for button to see more in how-to library"
//                     id="gui.cards.see-more"
//                 />
//             </div>
//         </div>
//     </Fragment>
// );


const CustomCards = props => {
    const {
        activeDeckId,
        content,
        dragging,
        isRtl,
        locale,
        onActivateDeckFactory,
        onCloseCards,
        onShrinkExpandCards,
        onDrag,
        onStartDrag,
        onEndDrag,
        onShowAll,
        onNextStep,
        onPrevStep,
        showVideos,
        step,
        expanded,
        stepCompleted,
        onCompleteStep,
        vm,
        ...posProps
    } = props;
    let { x, y } = posProps;

    if (activeDeckId === null) return;

    if (x === 0 && y === 0) {
        // initialize positions
        x = isRtl ? -292 : 292;
        // The tallest cards are about 385px high, and the default position is pinned
        // to near the bottom of the blocks palette to allow room to work above.
        const tallCardHeight = 385;
        const bottomMargin = 60; // To avoid overlapping the backpack region
        y = window.innerHeight - tallCardHeight - bottomMargin;
    }

    const steps = content[activeDeckId].steps;

    // populateWorkspace({ vm });
    if(steps[step].recordCompletion){
        //dbmanager record tutorial completion
        console.log('record completion', activeDeckId);
        saveDataToMongo('completion', activeDeckId, new Date().toLocaleString('en-US', { timeZone: "America/New_York" }));
    }

    queryData('5d4354c9de88f284614074bc', 'scratching-with-a-square2').then(res=>{
        console.log(res);
    });

    return (
        <Draggable bounds="parent" position={{ x: x, y: y }} onDrag={onDrag} >
            <div className={styles.cardContainer}>
                <div className={styles.card}>
                    <QISCardHeader
                        expanded={expanded}
                        step={step}
                        totalSteps={steps.length}
                        onCloseCards={onCloseCards}
                        onShowAll={onShowAll}
                        onShrinkExpandCards={onShrinkExpandCards}
                    />
                    <div className={expanded ? styles.stepBody : styles.hidden}>
                        {steps[step].deckIds ? (
                            // <PreviewsStep
                            //     content={content}
                            //     deckIds={steps[step].deckIds}
                            //     onActivateDeckFactory={onActivateDeckFactory}
                            //     onShowAll={onShowAll}
                            // />
                            <span>Preview</span>
                        ) : (
                                steps[step].video ? (
                                    <VideoStep
                                        dragging={dragging}
                                        video={steps[step].video}
                                    />
                                ) : (
                                        <ImageStep
                                            image={steps[step].image}
                                            title={steps[step].title}
                                            stepCompleted={stepCompleted}
                                        />
                                    )
                            )}
                        {steps[step].trackingPixel && steps[step].trackingPixel}
                    </div>
                    
                    {!steps[step].recordCompletion&&<button onClick={checkStepCompletion({ onCompleteStep, vm, expected: steps[step].expected })}>Check</button>}
                    
                    <NextPrevButtons
                        expanded={expanded}
                        isRtl={false}
                        onNextStep={step < steps.length - 1 ? onNextStep : null}
                        onPrevStep={step > 0 ? onPrevStep : null}
                        stepCompleted={stepCompleted}
                        checkCompletion={checkStepCompletion({ onCompleteStep, vm, expected: steps[step].expected })}
                    />
                </div>
            </div>
        </Draggable>
    );
};


export default CustomCards;
