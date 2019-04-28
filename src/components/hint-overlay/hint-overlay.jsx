import React from 'react';
import Floater from 'react-floater';
import HintIcon from './hint-icon.jsx';
import {DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE} from "../../lib/hints/constants";

const getHintOverlayText = function (type) {
    switch (type) {
        case DUPLICATE_CODE_SMELL_HINT_TYPE:
            return "You can create a custom block for the highlighted code. Right click to see options.";
        case SHAREABLE_CODE_HINT_TYPE:
            return "This custom block can be shared. Right click to see options";
        default:
            return "Code hint available."
    }
};

const HintOverlayComponent = props => {
    const { hints, blocksSharableHints, options } = props.hintState;
    const allHints = hints.concat(blocksSharableHints);
    return (
        <div>
            {allHints
                .filter(h => h.styles)
                .map(h => <Floater
                    content={getHintOverlayText(h.type)}
                    event="hover"
                    key={h.hintId + "_floater"}
                    target={".hint_icon_" + h.hintId}
                    placement="right"
                    offset={30}
                >
                    <HintIcon key={h.hintId} hint={h} options={options}
                              onHandleHintMenuItemClick={() => itemAction => props.onHandleHintMenuItemClick(h, itemAction)}
                              onMouseEnter={() => props.onMouseEnter(h)}
                              onMouseLeave={() => props.onMouseLeave(h)}
                    />
                </Floater>)
            }
        </div>
    );
};


export default HintOverlayComponent;