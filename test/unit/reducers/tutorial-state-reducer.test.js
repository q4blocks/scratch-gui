import tutorialStateReducer, { markInstructionComplete, nextInstruction, loadNewTutorial } from '../../../src/reducers/tutorial';
import { testModeAPI } from 'react-ga';

test("initialState", () => {
    let defaultState
    expect(tutorialStateReducer(defaultState, { type: 'anything' })).toBeDefined();
    expect(tutorialStateReducer(defaultState, { type: 'anything' }).currentStep).toBe(null);
    expect(tutorialStateReducer(defaultState, { type: 'anything' }).currentInstruction).toBe(null);
    expect(tutorialStateReducer(defaultState, { type: 'anything' }).target).toBe(null);
    expect(tutorialStateReducer(defaultState, { type: 'anything' }).steps).toEqual([]);
    expect(tutorialStateReducer(defaultState, { type: 'anything' }).isComplete).toBe(false);
});

test("next instruction", () => {
    let state = {
        currentStep: 0, currentInstruction: 0, target: null, isComplete: false,
        steps: [
            {
                description: "step 1",
                instructions: [
                    { description: "instruction 1" }, { description: "instruction 2" }
                ]
            },
            {
                description: "step 2",
                instructions: [
                    { description: "instruction 1" }, { description: "instruction 2" }
                ]
            }
        ]
    }


    const newState1 = tutorialStateReducer(state, markInstructionComplete(0, 0));
    const instruction = newState1.steps[0].instructions[0];
    expect(instruction).toBeDefined();
    expect(instruction.isComplete).toBe(true);
    expect(newState1.currentStep).toBe(0);
    expect(newState1.currentInstruction).toBe(1);

    const newState1ByNext = tutorialStateReducer(state, nextInstruction());
    expect(newState1ByNext).toEqual(newState1);

    const newState2 = tutorialStateReducer(newState1, markInstructionComplete(0, 1));
    expect(newState2.steps[0].instructions[1].isComplete).toBe(true);
    const newState2ByNext = tutorialStateReducer(newState1, nextInstruction());
    expect(newState2ByNext).toEqual(newState2);

    const newState3 = tutorialStateReducer(newState2, markInstructionComplete(1, 0));
    expect(newState3.steps[1].instructions[0].isComplete).toBe(true);

    const newState3ByNext = tutorialStateReducer(newState2, nextInstruction());
    expect(newState3ByNext).toEqual(newState3);
    expect(newState3ByNext.isComplete).toBe(false);

    const newState4 = tutorialStateReducer(newState3, markInstructionComplete(1, 1));
    expect(newState4.isComplete).toBe(true);

    const newState4ByNext = tutorialStateReducer(newState3, nextInstruction());
    expect(newState4ByNext).toEqual(newState4);
    expect(newState4ByNext.isComplete).toBe(true);

    // console.log(JSON.stringify(newState4, null, 2));
})

test("load new tutorial", () => {
    let defaultState
    const steps =  [
        {
            description: "step 1",
            instructions: [
                { description: "instruction 1" }, { description: "instruction 2" }
            ]
        },
        {
            description: "step 2",
            instructions: [
                { description: "instruction 1" }, { description: "instruction 2" }
            ]
        }
    ]

    const newState = tutorialStateReducer(defaultState, loadNewTutorial(steps));
    expect(newState).toBeDefined();
    console.log(newState);
});