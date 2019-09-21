import React from 'react';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, RENAMABLE_CUSTOM_BLOCK, DUPLICATE_CONSTANT_HINT_TYPE } from "../../lib/hints/constants";
import { ExtractCustomBlockHint, ControlComponent } from './extract-custom-block';

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

class HintOverlayComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        const { hints, blocksSharableHints, renamables, options } = this.props.hintState;
        const allHints = hints.concat(blocksSharableHints).concat(renamables);
        return (
            <div>
                {allHints
                    .filter(h => h.styles)
                    .map(h => {
                        switch (h.type) {
                            case "duplicate_code":
                                return <ExtractCustomBlockHint key={h.hintId + "_floater"} hint={h} {...this.props} />
                        }

                    }

                    )
                }
            </div>
        );
    }

};


export default HintOverlayComponent;