const actionTypes = {
    MARK_INSTRUCTION_AS_COMPLETE: 'MARK_INSTRUCTION_AS_COMPLETE',
    NEXT_INSTRUCTION: 'NEXT_INSTRUCTION',
    LOAD_NEW_TUTORIAL: 'LOAD_NEW_TUTORIAL',
    SET_FOCUS_TARGET: 'SET_FOCUS_TARGET'
}

const initialState = {
    isComplete: false,
    target: null,
    steps: [],
    currentStep: null,
    currentInstruction: null
}

const getNextStepAndInstruction = (state) => {
    const { steps, currentStep, currentInstruction } = state;
    return getNextStepAndInstructionHelper({ steps, currentStep, currentInstruction });
}

const getNextStepAndInstructionHelper = ({ currentStep, currentInstruction, steps }) => {
    let nextStep = null;
    let nextInstruction = null;
    if (steps.length === 0) return { nextStep, nextInstruction };
    if (currentInstruction < steps[currentStep].instructions.length - 1) {
        nextStep = currentStep;
        nextInstruction = currentInstruction + 1;
    } else if (currentStep < steps.length - 1) {
        nextStep = currentStep + 1;
        nextInstruction = 0;
    } else {
        // last step, last instruction
    }
    return { nextStep, nextInstruction };
}

const tutorialReducer = (state, action) => {
    if (typeof state === 'undefined') state = initialState;

    let stepIdx
    switch (action.type) {
        case actionTypes.MARK_INSTRUCTION_AS_COMPLETE: {
            const { stepIdx, instructionIdx } = action;
            const { nextStep, nextInstruction } = getNextStepAndInstructionHelper({ currentStep: stepIdx, currentInstruction: instructionIdx, steps: state.steps });
            return Object.assign({}, state, {
                steps: state.steps.map((step, idx) => {
                    if (idx === stepIdx) {
                        return stepReducer(step, action);
                    } else {
                        return step;
                    }
                }),
                currentStep: nextStep,
                currentInstruction: nextInstruction,
                isComplete: nextStep === null
            });
        }
        case actionTypes.NEXT_INSTRUCTION:
            const { nextStep, nextInstruction } = getNextStepAndInstruction(state);
            stepIdx = state.currentStep;
            return Object.assign({}, state, {
                steps: state.steps.map((step, idx) => {
                    if (idx === stepIdx) {
                        return stepReducer(step, { ...action, instructionIdx: state.currentInstruction });
                    } else {
                        return step;
                    }
                }),
                currentStep: nextStep,
                currentInstruction: nextInstruction,
                isComplete: nextStep === null
            });
        case actionTypes.LOAD_NEW_TUTORIAL:
            return Object.assign({}, state, {
                steps: action.steps,
                currentStep: 0,
                currentInstruction: 0
            })
        case actionTypes.SET_FOCUS_TARGET:
            return Object.assign({}, state, {
                target: action.target
            })

        default:
            return state;
    }
}

const stepReducer = (step, action) => {
    let instructionIdx = action.instructionIdx;
    switch (action.type) {
        case actionTypes.MARK_INSTRUCTION_AS_COMPLETE:
            return Object.assign({}, step, {
                instructions: step.instructions.map((inst, idx) => {
                    if (idx === instructionIdx) {
                        return Object.assign({}, inst, { isComplete: true });
                    } else {
                        return inst;
                    }
                })
            })
        case actionTypes.NEXT_INSTRUCTION:
            return Object.assign({}, step, {
                instructions: step.instructions.map((inst, idx) => {
                    if (idx === instructionIdx) {
                        return Object.assign({}, inst, { isComplete: true });
                    } else {
                        return inst;
                    }
                })
            })
        default:
            return step;
    }
}

const markInstructionComplete = (stepIdx, instructionIdx) => ({
    type: actionTypes.MARK_INSTRUCTION_AS_COMPLETE,
    stepIdx,
    instructionIdx
});

const nextInstruction = () => ({
    type: actionTypes.NEXT_INSTRUCTION
});

const loadNewTutorial = (steps) => ({
    type: actionTypes.LOAD_NEW_TUTORIAL,
    steps
})

const setFocusTarget = (target) => ({
    type: actionTypes.SET_FOCUS_TARGET,
    target
})


export {
    tutorialReducer as default,
    initialState as tutorialInitialState,
    markInstructionComplete,
    nextInstruction,
    loadNewTutorial,
    setFocusTarget,
    actionTypes
}