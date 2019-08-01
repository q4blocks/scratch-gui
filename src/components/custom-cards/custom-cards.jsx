// import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import {FormattedMessage} from 'react-intl';
import Draggable from 'react-draggable';

import styles from './custom-card.css';
import rightArrow from './icon--next.svg';
import leftArrow from './icon--prev.svg';
import closeIcon from './icon--close.svg';
import shrinkIcon from './icon--shrink.svg';
import expandIcon from './icon--expand.svg';
// import helpIcon from '../../lib/assets/icon--tutorials.svg';

// import {translateVideo} from '../../lib/libraries/decks/translate-video.js';

const QISCardHeader = ({ onCloseCards, onShrinkExpandCards, totalSteps, step, expanded }) => (
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
        {/* <div
                className={styles.removeButton}
                onClick={onCloseCards}
            >
                <span>Close</span>
                <img
                    className={styles.closeIcon}
                    src={closeIcon}
                />
            </div> */}

    </div>
)


// // Video step needs to know if the card is being dragged to cover the video
// // so that the mouseup is not swallowed by the iframe.
// const VideoStep = ({video, dragging}) => (
//     <div className={styles.stepVideo}>
//         {dragging ? (
//             <div className={styles.videoCover} />
//         ) : null}
//         <iframe
//             allowFullScreen
//             allowTransparency="true"
//             frameBorder="0"
//             height="338"
//             scrolling="no"
//             src={`https://fast.wistia.net/embed/iframe/${video}?seo=false&videoFoam=true`}
//             title="📹"
//             width="600"
//         />
//         <script
//             async
//             src="https://fast.wistia.net/assets/external/E-v1.js"
//         />
//     </div>
// );

const ImageStep = ({ title, image }) => (
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
);

const NextPrevButtons = ({ isRtl, onNextStep, onPrevStep, expanded }) => (
    <Fragment>
        {onNextStep ? (
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

    return (
        <Draggable bounds="parent">
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
                                    // <VideoStep
                                    //     dragging={dragging}
                                    //     video={translateVideo(steps[step].video, locale)}
                                    // />
                                    <span>Video</span>
                                ) : (
                                        <ImageStep
                                            image={steps[step].image}
                                            title={steps[step].title}
                                        />
                                    )
                            )}
                        {steps[step].trackingPixel && steps[step].trackingPixel}
                    </div>
                    <NextPrevButtons
                        expanded={expanded}
                        isRtl={false}
                        onNextStep={step < steps.length - 1 ? onNextStep : null}
                        onPrevStep={step > 0 ? onPrevStep : null}
                    />
                </div>
            </div>
        </Draggable>
    );
};


export default CustomCards;
