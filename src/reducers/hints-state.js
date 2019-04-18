const SORT_HINTS = 'scratch-gui/hints-state/SORT_HINTS';
const UPDATE_HINT = 'UPDATE_HINT';
const PUT_ALL_HINTS = "PUT_ALL_HINTS";
const REMOVE_HINT = "REMOVE_HINT";
const SET_UPDATE_STATUS = "SET_UPDATE_STATUS";
const SWITCH_HINT_MODE = "SWITCH_HINT_MODE";
const SET_HINT_OPTIONS = "SET_HINT_OPTIONS";

const hintOptions = {
    isVisible: "isVisible",
    showHintOnly: "showHintOnly",
    showProcedureSharingHint: "showProcedureSharingHint"
}

const initialState = {
    hintMode: true,
    timestamp: null,
    hints: [],
    isUpdating: false,
    options: {
        isVisible: false,
        showHintOnly: true,
        showProcedureSharingHint: false
    }
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    const { timestamp, hints, isUpdating } = state;
    switch (action.type) {
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
        case PUT_ALL_HINTS:
            let hintMap = hints.reduce((map, h) => {
                map[h.hintId] = h;
                return map;
            }, {});
            hintMap = action.hints.reduce((map, h) => {
                map[h.hintId] = h;
                return map;
            }, hintMap);

            return Object.assign({}, state, {
                timestamp,
                hints: Object.values(hintMap).concat(),
                isUpdating: true
            })
        case REMOVE_HINT:
            return Object.assign({}, state,{
                timestamp,
                hints: hints.filter(h => h.hintId !== action.hintId),
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

const putAllHints = function (hints) {
    return {
        type: PUT_ALL_HINTS,
        hints
    };
}


const removeHint = function (hintId) {
    return {
        type: REMOVE_HINT,
        hintId
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

export {
    reducer as default,
    initialState as hintsInitialState,
    updateHint,
    putHint,
    putAllHints,
    removeHint,
    setUpdateStatus,
    setHintOptions,
    hintOptions
};