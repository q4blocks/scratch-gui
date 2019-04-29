const TOGGLE_CUSTOM_FEATURE = 'TOGGLE_CUSTOM_FEATURE';
const SET_CUSTOM_FEATURE_TOGGLE_VISIBLE = 'SET_CUSTOM_FEATURE_TOGGLE_VISIBLE';
const SET_SHOW_TUTORIAL = 'SET_SHOW_TUTORIAL';

const initialState = {
    procedureShareToggleVisible: false,
    qualityHintToggleVisible: false,
    showTutorial: false
}

const featureNames = {
    PROCEDURE_SHARE: 'PROCEDURE_SHARE',
    QUALITY_HINT: 'QUALITY_HINT',
    TUTORIAL: 'TUTORIAL'
}

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case TOGGLE_CUSTOM_FEATURE:
            if (action.feature === featureNames.PROCEDURE_SHARE){
                return Object.assign({}, state, { procedureShareToggleVisible: !state.procedureShareToggleVisible });
            }
            else if(action.feature === featureNames.QUALITY_HINT) {
                return Object.assign({}, state, { qualityHintToggleVisible: !state.qualityHintToggleVisible });
            }
        case SET_CUSTOM_FEATURE_TOGGLE_VISIBLE:
            if (action.feature === featureNames.PROCEDURE_SHARE){
                return Object.assign({}, state, { procedureShareToggleVisible: action.isVisible });
            }
            else if(action.feature === featureNames.QUALITY_HINT) {
                return Object.assign({}, state, { qualityHintToggleVisible: action.isVisible });
            }
        case SET_SHOW_TUTORIAL:
            return Object.assign({}, state, {showTutorial: action.shouldShowTutorial});
        default:
            return state;
    }
}

const toggleCustomFeature = featureName =>({
    type: TOGGLE_CUSTOM_FEATURE,
    feature: featureName
});

const setCustomFeatureToggleVisible = (featureName, isVisible) =>({
    type: TOGGLE_CUSTOM_FEATURE,
    feature: featureName,
    visible: isVisible
});

const setShowTutorial = shouldShowTutorial => ({
    type: SET_SHOW_TUTORIAL,
    shouldShowTutorial
})

export {
    reducer as default,
    initialState as customMenuInitialState,
    toggleCustomFeature,
    setCustomFeatureToggleVisible,
    setShowTutorial,
    featureNames
};