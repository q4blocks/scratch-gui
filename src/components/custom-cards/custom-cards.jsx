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
import { CopyToClipboard } from 'react-copy-to-clipboard';
// reference for latest update: https://github.com/LLK/scratch-gui/blob/develop/src/components/cards/cards.jsx

// analytics
import analytics from "../../lib/custom-analytics";

const enableCloseCard = false;
const bypassCheck = false;

const QISCardHeader = ({ onCloseCards, onShrinkExpandCards, totalSteps, step, expanded, dbManager }) => (
    <div className={styles.headerButtons}>
        <div className={styles.allButton}>
            <span>Instructions</span>
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

const charsum = function (s) {
    var i, sum = 0;
    for (i = 0; i < s.length; i++) {
        sum += (s.charCodeAt(i) * (i + 1));
    }
    return sum
};

const array_hash = function (a) {
    var i, sum = 0
    for (i = 0; i < a.length; i++) {
        var cs = charsum(a[i])
        sum = sum + (65027 / cs)
    }
    return ("" + sum).slice(0, 16)
}

function eqSet(as, bs) {
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
}

const checkStmtSequence = ({ topBlock, expected, shouldExcludeShadow }) => {


    const expectedHashes = new Set(expected.map(seq => array_hash(seq)));
    const allTopBlockHashes = new Set(topBlock.map(tb => {
        let actual = dfsTraverse(tb);
        let filteredActual = null;
        if (shouldExcludeShadow) {
            filteredActual = actual.filter(n => !n.isShadow_).map(b => b.type);
        }
        console.log('expected block sequence',filteredActual);
        return filteredActual;
    }).map(seq => array_hash(seq)));

    return expectedHashes.subSetOf(allTopBlockHashes);
}

const getCousinBlocks = topBlock => {
    let blocks = [];

    let curBlock = topBlock;
    while (curBlock) {
        blocks.push(curBlock);
        curBlock = curBlock.getNextBlock();
    }
    return blocks;
}

const dfsTraverse = (topBlock) => {
    let seen = [];
    let toExplore = [];
    getCousinBlocks(topBlock).reverse().forEach(b => toExplore.push(b));

    while (toExplore.length > 0) {
        let next = toExplore.pop();
        if (seen.indexOf(next) < 0) {
            seen.push(next); //if not already visited 
            // get all of its children and next block
            next.getChildren().reverse().forEach(c => toExplore.push(c));
        }
    }
    return seen;
}

Set.prototype.subSetOf = function (otherSet) {
    if (this.size > otherSet.size)
        return false;
    else {
        for (var elem of this) {
            if (!otherSet.has(elem))
                return false;
        }
        return true;
    }
}


const workspaceContainsScript = ({ workspace, expected, shouldExcludeShadow = true }) => {
    window.workspace = workspace;
    //test dfs
    let seen = dfsTraverse(workspace.getTopBlocks()[0]);
    // const found = workspace.getTopBlocks().find(topBlock => checkStmtSequence({ topBlock, expected, shouldExcludeShadow }));
    const found = checkStmtSequence({ topBlock: workspace.getTopBlocks(), expected, shouldExcludeShadow });
    return !!found;
}

const checkStepCompletion = ({ onCompleteStep, expected, currentInstructionId, customCheck }) => () => {
    let isComplete = null;
    if (!expected) {
        isComplete = true;//not specified => auto complete
    } else {
        const workspace = ScratchBlocks.getMainWorkspace();
        isComplete = workspaceContainsScript({ workspace, expected });
    }

    
    if(customCheck){
        isComplete = isComplete && eval(customCheck);
         
    }

    //analytics
    analytics.event({
        category: "Instruction",
        action: isComplete ? 'pass' : 'fail',
        label: currentInstructionId
    });


    isComplete ? onCompleteStep() : () => { };
}

const populateWorkspace = (setupCode) => {
    let workspace = Blockly.getMainWorkspace();
    if (workspace) {
        setTimeout(() => {
            workspaceFromXml(workspace, setupCode);
            setTimeout(() => {
                workspace.cleanUp();
            }, 0)
        }, 100);
    }
}



class ImageStep extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidUpdate(){
        const {
            isAlreadySetup, setUpdateCodeStatus, shouldCleanup, dragging, setupCode 
        } = this.props;

        if (setupCode&&!isAlreadySetup) {
            // clear
            const workspace = Blockly.getMainWorkspace();
            if (workspace && shouldCleanup && !dragging) {
                workspace.clear();
            }
            if (setupCode) {
                populateWorkspace(setupCode);
            }
            setUpdateCodeStatus(true);
        }
    }

    render(){
        const {
            title, image, completionCode} = this.props;
        return (
            <Fragment>
                <div className={styles.stepTitle}>
                    {title}
                </div>
                {completionCode && <div>
                    <div style={{ color: 'red', marginBottom: '30px', fontWeight: 'bold' }}>{completionCode}</div>
                    <CopyToClipboard text={completionCode}>
                        <button>Copy the completion code</button>
                    </CopyToClipboard>
                </div>
                }
                <div className={styles.stepImageContainer}>
                    <img
                        className={styles.stepImage}
                        draggable={false}
                        src={image}
                    />
                </div>
            </Fragment>
        )
    }
}


const NextPrevButtons = ({ isRtl, onNextStep, onPrevStep, expanded, stepCompleted, setUpdateCodeStatus, currentInstructionId }) => {
    return (
        <Fragment>
            {stepCompleted && onNextStep ? (
                <div>
                    <div className={expanded ? (isRtl ? styles.leftCard : styles.rightCard) : styles.hidden} />
                    <div
                        className={expanded ? (isRtl ? styles.leftButton : styles.rightButton) : styles.hidden}
                        onClick={(() => () => {
                            console.log('set update code status is called');
                            setUpdateCodeStatus(false); //clear setup status to false

                            //analytics
                            analytics.event({
                                category: "Instruction",
                                action: "view",
                                label: currentInstructionId
                            });

                            onNextStep();
                        })()}
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
    )
};



class CustomCards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAlreadySetup: false
        }
        this.setUpdateCodeStatus = this.setUpdateCodeStatus.bind(this);
    }

    setUpdateCodeStatus(alreadySetup) {
        this.setState({
            isAlreadySetup: alreadySetup
        })
    }

    render() {
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
            qualityHintToggleVisible,
            ...posProps
        } = this.props;
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

        let steps = null; 
        
        if(qualityHintToggleVisible){
            steps = content[activeDeckId].steps.filter(c=>c.onlyVisibleToGroup===undefined||c.onlyVisibleToGroup==='automated')
        }else{
            steps = content[activeDeckId].steps.filter(c=>c.onlyVisibleToGroup===undefined||c.onlyVisibleToGroup==='manual')
        }

        // populateWorkspace({ vm });
        if (steps[step].recordCompletion) {
            //dbmanager record tutorial completion
            console.log('record completion', activeDeckId);
            saveDataToMongo('completion', activeDeckId, new Date().toLocaleString('en-US', { timeZone: "America/New_York" }));
        }

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
                            {
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
                                            completionCode={steps[step].completionCode}
                                            shouldCleanup={steps[step].shouldCleanup}
                                            setupCode={steps[step].setupCode}
                                            isAlreadySetup={this.state.isAlreadySetup}
                                            setUpdateCodeStatus={this.setUpdateCodeStatus}
                                        />
                                    )
                            }
                            {steps[step].trackingPixel && steps[step].trackingPixel}
                        </div>

                        {!!(steps[step].expected||steps[step].customCheck) && <button onClick={checkStepCompletion({ 
                            onCompleteStep, vm, expected: steps[step].expected, customCheck:steps[step].customCheck })}>Check</button>}

                        

                        <NextPrevButtons
                            expanded={expanded}
                            isRtl={false}
                            dragging={dragging}
                            onNextStep={step < steps.length - 1 ? onNextStep : null}
                            onPrevStep={step > 0 ? onPrevStep : null}
                            stepCompleted={bypassCheck || (!steps[step].expected && !steps[step].customCheck)|| stepCompleted}
                            checkCompletion={checkStepCompletion({ onCompleteStep, vm, expected: steps[step].expected, currentInstructionId: steps[step].id })}
                            isAlreadySetup={this.state.isAlreadySetup}
                            setUpdateCodeStatus={this.setUpdateCodeStatus}
                            currentInstructionId={steps[step].id}
                        />
                    </div>
                </div>
            </Draggable>
        );
    }
}

export default CustomCards;
