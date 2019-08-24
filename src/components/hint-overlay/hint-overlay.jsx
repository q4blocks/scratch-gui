import React from 'react';
import Floater from 'react-floater';
import HintIcon from './hint-icon.jsx';
import {DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, RENAMABLE_CUSTOM_BLOCK, DUPLICATE_CONSTANT_HINT_TYPE} from "../../lib/hints/constants";

const getHintOverlayText = function (type) {
    switch (type) {
        case DUPLICATE_CODE_SMELL_HINT_TYPE:
            return "Consider creating a custom block for the highlighted code. Right click on the hint icon to see options.";
        case DUPLICATE_CONSTANT_HINT_TYPE:
                return "Consider creating a variable to hold this commonly used value. Right click on the hint icon to see options.";
        case SHAREABLE_CODE_HINT_TYPE:
            return "This custom block can be shared. Right click on the hint icon to see options";
        case RENAMABLE_CUSTOM_BLOCK:
            return "Consider renaming this custom block to something more meaningful. Right click on the hint icon to see options.";
        default:
            return "Code hint available."
    }
};

const HintOverlayComponent = props => {
    const { hints, blocksSharableHints, renamables, options } = props.hintState;
    const allHints = hints.concat(blocksSharableHints).concat(renamables);
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