import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import lightBulbIcon from './light-bulb-icon.svg';
import codeShareIcon from './share-icon.svg';

import iconStyles from './hint-icon.css';
import { ContextMenuTrigger } from 'react-contextmenu';
import { ContextMenu, MenuItem } from '../context-menu/context-menu.jsx';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, DUPLICATE_CONSTANT_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, RENAMABLE_CUSTOM_BLOCK, BROAD_SCOPE_VAR_HINT_TYPE } from '../../lib/hints/constants';



const getIconSpec = (type) => {
    switch (type) {
        case DUPLICATE_CODE_SMELL_HINT_TYPE:
            return {
                className: "light-bulb",
                iconSvg: lightBulbIcon,
                iconStyles: iconStyles.lightBulb
            }
        case DUPLICATE_CONSTANT_HINT_TYPE:
            return {
                className: "light-bulb",
                iconSvg: lightBulbIcon,
                iconStyles: iconStyles.lightBulb
            }
        case SHAREABLE_CODE_HINT_TYPE:
            return {
                className: "light-bulb",
                iconSvg: codeShareIcon,
                iconStyles: iconStyles.lightBulb
            }
        case RENAMABLE_CUSTOM_BLOCK:
            return {
                className: "light-bulb",
                iconSvg: lightBulbIcon,
                iconStyles: iconStyles.lightBulb
            }
        case BROAD_SCOPE_VAR_HINT_TYPE:
            return {
                className: "light-bulb",
                iconSvg: lightBulbIcon,
                iconStyles: iconStyles.lightBulb
            }
        default:
            return {
                className: "light-bulb",
                iconSvg: lightBulbIcon,
                iconStyles: iconStyles.lightBulb
            }
    }
}

const HintIcon = props => {
    const options = props.options;
    const { type, hintId, styles, hintMenuItems } = props.hint;
    const { className, iconSvg, iconStyles } = getIconSpec(type);
    return !options.hintWithRefactoringSupport ?
        (<div style={styles}>
            <img className={classNames(className, iconStyles) + " hint_icon_" + hintId} src={iconSvg} />
        </div>
        ) : (
            <div style={styles}>
                <img
                    className={classNames(
                        className, iconStyles
                    ) + " hint_icon_" + hintId}
                    src={iconSvg}
                    onClick={props.onMouseClick}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}
                />
            </div>);
};


export default HintIcon;
