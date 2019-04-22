import customMenuReducer, { toggleCustomFeature, setCustomFeatureToggleVisible, featureNames } from '../../../src/reducers/custom-menu';

test('initialState', () => {
    let defaultState
    expect(customMenuReducer(defaultState, { type: 'anything' })).toBeDefined();
    expect(customMenuReducer(defaultState, { type: 'anything' }).procedureShareToggleVisible).toBe(false);
    expect(customMenuReducer(defaultState, { type: 'anything' }).qualityHintToggleVisible).toBe(false);
})

test("toggle feature", () => {
    let defaultState
    let nextState = customMenuReducer(defaultState, setCustomFeatureToggleVisible(featureNames.PROCEDURE_SHARE, true));
    expect(nextState.procedureShareToggleVisible).toBe(true);
    nextState = customMenuReducer(nextState, setCustomFeatureToggleVisible(featureNames.PROCEDURE_SHARE, false));
    expect(nextState.procedureShareToggleVisible).toBe(false);
    expect(nextState.qualityHintToggleVisible).toBe(false);
})