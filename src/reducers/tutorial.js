const actionTypes = {
    MARK_INSTRUCTION_AS_COMPLETE: 'MARK_INSTRUCTION_AS_COMPLETE',
    NEXT_INSTRUCTION: 'NEXT_INSTRUCTION'
}

const initialState = {
    isComplete: false,
    target: null,
    steps: [],
    currentStep: 0,
    currentInstruction: null
}

const getNextStepAndInstruction = (state) => {
    const { steps, currentStep, currentInstruction } = state;
    let nextStep = null;
    let nextInstruction = null;
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
    if (state.steps.length === 0) return state;
    const { nextStep, nextInstruction } = getNextStepAndInstruction(state);
    let stepIdx
    switch (action.type) {
        case actionTypes.MARK_INSTRUCTION_AS_COMPLETE:
            stepIdx = action.stepIdx;
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

        case actionTypes.NEXT_INSTRUCTION:
            stepIdx = state.currentStep;
            return Object.assign({}, state, {
                steps: state.steps.map((step, idx) => {
                    if (idx === stepIdx) {
                        return stepReducer(step, {...action, instructionIdx: state.currentInstruction});
                    } else {
                        return step;
                    }
                }),
                currentStep: nextStep,
                currentInstruction: nextInstruction,
                isComplete: nextStep === null
            });


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



export {
    tutorialReducer as default,
    initialState as tutorialInitialState,
    markInstructionComplete,
    nextInstruction,
    actionTypes
}