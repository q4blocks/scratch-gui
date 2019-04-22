import hintStateReducer, { updateHint, putAllHints, removeHint, setUpdateStatus, setHintOptions } from '../../../src/reducers/hints-state';

test("initialState", () => {
    let defaultState
    expect(hintStateReducer(defaultState, { type: 'anything' })).toBeDefined();
    expect(hintStateReducer(defaultState, { type: 'anything' }).hints).toEqual([]);
    expect(hintStateReducer(defaultState, { type: 'anything' }).timestamp).toBe(null);
    expect(hintStateReducer(defaultState, { type: 'anything' }).isUpdating).toBe(false);
});


test("update hint item", () => {
    let state = {

        timestamp: 'date',
        hints: [{
            hintId: 'id1',
            type: 'Extract Procedure',
            target: 'sprite1',
            visible: false
        }, {
            hintId: 'id2',
            type: 'Extract Procedure',
            target: 'sprite2',
            visible: false
        }, {
            hintId: 'id3',
            type: 'Extract Procedure',
            target: 'sprite2',
            visible: false
        }]
    };

    const newState = hintStateReducer(state, updateHint('id2', { visible: true }));
    expect(newState.hints.find(h => h.hintId === 'id2').visible).toBe(true);
});



test("put all hints", () => {
    let state = {
        timestamp: 'date',
        hints: [{
            hintId: 'id1',
            type: 'Extract Procedure',
            target: 'sprite1',
            visible: true
        }]
    };

    const newState = hintStateReducer(state, putAllHints([
        { hintId: 'id2', type: 'Extract Procedure', target: 'Sprite3' },
        { hintId: 'id1', type: 'Extract Procedure', target: 'Sprite3', visible: false },
        { hintId: 'id3', type: 'Extract Procedure', target: 'Sprite4' }
    ]));
    expect(newState.hints.find(h => h.hintId === 'id2')).toBeDefined();
    expect(newState.hints.find(h => h.hintId === 'id1').visible).toBe(false);
    expect(newState.hints.length).toBe(3);
});

test("remove hint", () => {
    let state = {
        timestamp: 'date',
        hints: [{
            hintId: 'id1',
            type: 'Extract Procedure',
            target: 'sprite1',
            visible: false
        }, {
            hintId: 'id2',
            type: 'Extract Procedure',
            target: 'sprite2',
            visible: false
        }, {
            hintId: 'id3',
            type: 'Extract Procedure',
            target: 'sprite2',
            visible: false
        }]
    };

    const newState = hintStateReducer(state, removeHint('id2'));
    expect(newState.hints.find(h => h.hintId === 'id2')).not.toBeDefined();
    expect(newState.hints.length).toBe(2);
});

test("update status", () => {
    let state = {
        timestamp: 'date',
        hints: [],
        isUpdating: false
    };
    const newState1 = hintStateReducer(state, setUpdateStatus(true));
    expect(newState1.isUpdating).toBe(true);

    const newState2 = hintStateReducer(newState1, setUpdateStatus(false));
    expect(newState2.isUpdating).toBe(false);

});


test("hint options", () => {
    let state = {
        hints: [],
        options: {
            isVisible: true,
            showQualityHint: false,
            showProcedureSharingHint: true
        }
    };

    const newState1 = hintStateReducer(state, setHintOptions({}));
    expect(newState1.options).toEqual({
        isVisible: true,
        showQualityHint: false,
        showProcedureSharingHint: true
    });

    const newState2 = hintStateReducer(state, setHintOptions({
        showQualityHint: true,
        showProcedureSharingHint: false
    }));

    expect(newState2.options).toEqual({
        isVisible: true,
        showQualityHint: true,
        showProcedureSharingHint: false
    });
});