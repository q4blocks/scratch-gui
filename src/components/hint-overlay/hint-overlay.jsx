import React from 'react';
import Floater from 'react-floater';
import HintIcon from './hint-icon.jsx';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, RENAMABLE_CUSTOM_BLOCK, DUPLICATE_CONSTANT_HINT_TYPE } from "../../lib/hints/constants";
import {REMOVE_LAST,ADD_TO_LAST,MOVE_UP, MOVE_DOWN} from '../../lib/hints/hints-util';
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

const CustomContent = props => {
    return (<div>
        <button>Extract</button>
        <button onClick={props.onRemoveLast}>RemoveLast</button>
        <button onClick={props.onAddToLast}>AddToLast</button>
        <button onClick={props.onMoveUp}>MoveUp</button>
        <button onClick={props.onMoveDown}>MoveDown</button>
        <button onClick={props.onClose}>Close</button>
    </div>)
}

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
                    .map(h => <Floater
                        content={
                            <CustomContent 
                                onClose={this.props.createOnClose(h)}
                                onRemoveLast={this.props.createOnBlockSelectAction(h, REMOVE_LAST)}
                                onAddToLast={this.props.createOnBlockSelectAction(h, ADD_TO_LAST)}
                                onMoveUp={this.props.createOnBlockSelectAction(h, MOVE_UP)}
                                onMoveDown={this.props.createOnBlockSelectAction(h, MOVE_DOWN)}
                            />
                        }//getHintOverlayText(h.type)
                        key={h.hintId + "_floater"}
                        target={".hint_icon_" + h.hintId}
                        placement="right"
                        offset={30}
                        open={this.props.open}
                    >
                        <HintIcon key={h.hintId} hint={h} options={options}
                            onHandleHintMenuItemClick={() => itemAction => this.props.onHandleHintMenuItemClick(h, itemAction)}
                            onMouseEnter={() => {this.props.onMouseEnter(h) }}
                            onMouseLeave={() => { !this.props.clicked&&this.props.onMouseLeave(h) }}
                            onMouseClick={() => {
                                this.props.onHintIconClick(h);
                                this.props.onMouseEnter(h);
                            }} // same for now
                        />
                    </Floater>)
                }
            </div>
        );
    }

};


export default HintOverlayComponent;