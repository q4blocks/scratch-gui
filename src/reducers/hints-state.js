const SORT_HINTS = 'scratch-gui/hints-state/SORT_HINTS';
const UPDATE_HINT = 'UPDATE_HINT';
const PUT_ALL_HINTS = "PUT_ALL_HINTS";
const REMOVE_HINT = "REMOVE_HINT";
const SET_UPDATE_STATUS = "SET_UPDATE_STATUS";
const SWITCH_HINT_MODE = "SWITCH_HINT_MODE";
const SET_HINT_OPTIONS = "SET_HINT_OPTIONS";
const CLEAR_ALL_HINTS = "CLEAR_ALL_HINT"
const SET_HINT_MANAGER = "SET_HINT_MANAGER";
const PUT_HINT_MAP = "PUT_HINT_MAP";
import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, RENAMABLE_CUSTOM_BLOCK, CONTEXT_MENU_REFACTOR, CONTEXT_MENU_INFO, CONTEXT_MENU_CODE_SHARE } from '../lib/hints/constants';

const hintOptions = {
    hintWithRefactoringSupport: "hintWithRefactoringSupport",
    showProcedureSharingHint: "showProcedureSharingHint"
}

const initialState = {
    hintMode: true,
    timestamp: null,
    hints: [],
    blocksSharableHints: [],
    renamables: [],
    isUpdating: false,
    hintManager: null,
    options: {
        showQualityHint: false,
        hintWithRefactoringSupport: true,
        showProcedureSharingHint: false
    }
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    const { timestamp, hints, isUpdating } = state;
    switch (action.type) {
        case SET_HINT_MANAGER:
            return Object.assign({}, state, {hintManager: action.hintManager})
        case UPDATE_HINT:
            const { hintId, changes } = action;
            return Object.assign({}, state,
                {
                    timestamp: state.timestamp,
                    hints: state.hints.map(h => {
                        if (h.hintId === hintId) {
                            return Object.assign({}, h, changes);
                        } else {
                            return h;
                        }
                    }),
                    isUpdating: true
                });
        case PUT_ALL_HINTS:{
            if(action.hintType===DUPLICATE_CODE_SMELL_HINT_TYPE){
                return Object.assign({}, state, {
                    hints: action.hints.concat(),
                })
            }else if(action.hintType===SHAREABLE_CODE_HINT_TYPE){
                return Object.assign({}, state, {
                    blocksSharableHints: action.hints.concat(),
                })
            }else if(action.hintType===RENAMABLE_CUSTOM_BLOCK){
                return Object.assign({}, state, {
                    renamables: action.hints.concat(),   //maybe renamables
                })
            }
        }
        case PUT_HINT_MAP: {
            return Object.assign({}, state, {
                hints: action.hintMap.hints,
                blocksSharableHints: action.hintMap.blocksSharableHints,
                renamables: action.hintMap.renamables
            })
        }

        case REMOVE_HINT:
            return Object.assign({}, state,{
                timestamp,
                hints: hints.filter(h => h.hintId !== action.hintId),
                isUpdating: true
            });
        case CLEAR_ALL_HINTS:
            return Object.assign({},state,{
                hints: [],
                isUpdating: true
            });

        case SET_UPDATE_STATUS:
            return Object.assign({}, state, { isUpdating: action.isUpdating })
        case SWITCH_HINT_MODE:
            return Object.assign({}, state, { hintMode: action.isInHintMode })
        case SET_HINT_OPTIONS:
            return Object.assign({}, state, { options: Object.assign({}, state.options, { ...action.options }) })
        default:
            return state;
    }
}


const updateHint = function (hintId, changes) {
    return {
        type: UPDATE_HINT,
        hintId,
        changes
    };
}


const putHint = function (hint) {
    return {
        type: PUT_HINT,
        hint
    };
}

const putAllHints = function (hints,hintType) {
    return {
        type: PUT_ALL_HINTS,
        hints,
        hintType
    };
}

const putHintMap = function ({hints, blocksSharableHints, renamables}){
    return {
        type: PUT_HINT_MAP,
        hintMap: {hints, blocksSharableHints, renamables}
    }
}


const removeHint = function (hintId) {
    return {
        type: REMOVE_HINT,
        hintId
    }
}

const clearAllHints = function () {
    return {
        type: CLEAR_ALL_HINTS
    }
}

const setUpdateStatus = function (isUpdating) {
    return {
        type: SET_UPDATE_STATUS,
        isUpdating
    }
}



const switchHintMode = function (isInHintMode) {
    return {
        type: SWITCH_HINT_MODE,
        isInHintMode
    }
}

const setHintOptions = function (options) {
    return {
        type: SET_HINT_OPTIONS,
        options
    }
}

const setHintManager = function(hintManager){
    return {
        type: SET_HINT_MANAGER,
        hintManager
    }
}

export {
    reducer as default,
    initialState as hintsInitialState,
    updateHint,
    putHint,
    putAllHints,
    removeHint,
    clearAllHints as clearHint,
    setUpdateStatus,
    setHintOptions,
    switchHintMode,
    setHintManager,
    putHintMap,
    hintOptions
};