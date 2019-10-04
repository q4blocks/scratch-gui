import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, RENAMABLE_CUSTOM_BLOCK, CONTEXT_MENU_REFACTOR, CONTEXT_MENU_INFO, CONTEXT_MENU_CODE_SHARE, DUPLICATE_CONSTANT_HINT_TYPE, BROAD_SCOPE_VAR_HINT_TYPE, DUPLICATE_SPRITE_HINT_TYPE } from '../lib/hints/constants';
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
    extract_const_hints: [],
    broad_scope_var_hints: [],
    extract_parent_sprite_hints: [],
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
                    hints: action.hints.filter(h=>h.type===DUPLICATE_CODE_SMELL_HINT_TYPE).concat(),
                })
            }else if(action.hintType===SHAREABLE_CODE_HINT_TYPE){
                return Object.assign({}, state, {
                    blocksSharableHints: action.hints.filter(h=>h.type===SHAREABLE_CODE_HINT_TYPE).concat(),
                })
            }else if(action.hintType===RENAMABLE_CUSTOM_BLOCK){
                return Object.assign({}, state, {
                    renamables: action.hints.filter(h=>h.type===RENAMABLE_CUSTOM_BLOCK).concat(),   //maybe renamables
                })
            } else if (action.hintType===DUPLICATE_CONSTANT_HINT_TYPE){
                return Object.assign({}, state, {
                    extract_const_hints: action.hints.filter(h=>h.type===DUPLICATE_CONSTANT_HINT_TYPE).concat(),
                })
            } else if (action.hintType===BROAD_SCOPE_VAR_HINT_TYPE){
                const hints = action.hints.filter(h=>h.type===BROAD_SCOPE_VAR_HINT_TYPE).concat();
                return Object.assign({}, state, {
                    broad_scope_var_hints: hints
                })
            } else if (action.hintType===DUPLICATE_SPRITE_HINT_TYPE){
                const hints = action.hints.filter(h=>h.type===DUPLICATE_SPRITE_HINT_TYPE).concat();
                return Object.assign({}, state, {
                    extract_parent_sprite_hints: hints
                })
            }
        }
        case PUT_HINT_MAP: {
            return Object.assign({}, state, {
                hints: action.hintMap.hints,
                blocksSharableHints: action.hintMap.blocksSharableHints,
                renamables: action.hintMap.renamables,
                extract_const_hints: action.hintMap.extract_const_hints,
                broad_scope_var_hints: action.hintMap.broad_scope_var_hints,
                extract_parent_sprite_hints: action.hintMap.extract_parent_sprite_hints
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

const putHintMap = function ({hints, blocksSharableHints, renamables, extract_const_hints, broad_scope_var_hints, extract_parent_sprite_hints}){
    return {
        type: PUT_HINT_MAP,
        hintMap: {hints, blocksSharableHints, renamables, extract_const_hints, broad_scope_var_hints, extract_parent_sprite_hints}
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

const setUpdateStatus = function ({isUpdating}) {
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