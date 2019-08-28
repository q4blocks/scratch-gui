import bindAll from 'lodash.bindall';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, DUPLICATE_CONSTANT_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, RENAMABLE_CUSTOM_BLOCK } from './hints/constants';
import { putAllHints, putHintMap, setUpdateStatus, updateHint } from '../reducers/hints-state';
import { sendAnalysisReq, getProgramXml } from './hints/analysis-server-api';
import { computeHintLocationStyles, analysisInfoToHints, generateShareableCodeHints, generateRenamableCodeHints } from './hints/hints-util';
import { applyTransformation } from './hints/transform-api';
import debounce from 'lodash.debounce';
import ScratchBlocks from 'scratch-blocks';

import { addBlocksToWorkspace, testBlocks, getTestHints } from './hints/hint-test-workspace-setup';


const addFunctionListener = (object, property, callback) => {
    const oldFn = object[property];
    object[property] = function () {
        const result = oldFn.apply(this, arguments);
        callback.call(this, result);
        return result;
    };
};

const isTesting = true;
const isProductionMode = false;

class HintManager {
    constructor(vm, workspace, dispatch, hintState, options) {
        this.hintState = hintState;
        this.vm = vm;
        this.workspace = workspace;
        this.dispatch = dispatch;
        this.options = options;
        this.projectId = options ? options.projectId : '0';

        bindAll(this, [
            'blockListener',
            'onWorkspaceUpdate',
            'generateHints',
            'updateHintTracking'
        ]);
        this.attachVM();
        this.computeQualityHintsDebounced = debounce(this.computeQualityHints, 100);
    }

    blockListener(e) {
        //if hintState.options showQualityHint
        if (!(['ui', 'endDrag'].includes(e.type))) { //recompute upon code changes
            if (this.hintState.options.showQualityHint) {
                this.generateHints(DUPLICATE_CODE_SMELL_HINT_TYPE);
                this.generateHints(DUPLICATE_CONSTANT_HINT_TYPE);
                this.generateHints(RENAMABLE_CUSTOM_BLOCK);
            }
        } 
        if(e.type==='ui'){      
            const gesture = this.workspace.getGesture(e);  
            let targetHint = null;
            
            if(gesture&&gesture.startField_){
                const activeField = gesture.startField_;
                const shadowId = activeField.sourceBlock_.id;
                // todo: find any hints that its valueIds contains showdowId
                targetHint = this.hintState.hints.find(h => h.valueIds.indexOf(shadowId)>=0);
                
                if (e.newValue){
                    if (targetHint) {
                        if(targetHint.hintId!==this.currentHintId){
                            // a different hint so hide the previous one first
                            this.dispatch(updateHint(this.currentHintId, {
                                styles: Object.assign({}, targetHint.styles, { 'visibility': 'hidden' })
                            }));
                        }
                        this.currentHintId = targetHint.hintId; //keep track of currently shown hint
                        this.dispatch(updateHint(targetHint.hintId, {
                            blockId: shadowId,
                            styles: Object.assign({}, targetHint.styles, { 'visibility': 'visible' })
                        }));
                    } 
                }
            }
            
            // click on empty space 
            if(e.newValue===null){
                targetHint = this.hintState.hints.find(h => h.hintId === this.currentHintId);
                if(targetHint){
                    this.dispatch(updateHint(targetHint.hintId, {
                        styles: Object.assign({}, targetHint.styles, { 'visibility': 'hidden' })
                    }));
                    this.currentHintId = null;
                }
            }
        }
    }

    calculateHintTracking(hints) {
        const trackedHints = hints.map(h =>
            Object.assign({}, h, computeHintLocationStyles(h, this.workspace)));
        return trackedHints;
    }

    updateHintState(hintState) {
        this.hintState = hintState;
    }

    updateOptions(options) {
        this.options = Object.assign({}, this.options, options);
    }

    getAnalysisInfo() {
        return this.analysisInfo;
    }

    computeQualityHints(hintType) {
        this.dispatch(setUpdateStatus({ isUpdating: true }));
        const _vm = this.vm;
        return Promise.resolve()
            .then(() => getProgramXml(_vm))
            .then(xml => sendAnalysisReq(this.projectId, hintType, xml, isProductionMode))
            .then(json => {
                const analysisInfo = json;
                this.analysisInfo = analysisInfo;
                return analysisInfo ? analysisInfoToHints(analysisInfo) : [];
            }).then(hints => {
                const trackedHints = this.calculateHintTracking(hints);
                this.dispatch(putAllHints(trackedHints, DUPLICATE_CODE_SMELL_HINT_TYPE));
                this.dispatch(setUpdateStatus({ isUpdating: false }));
            });
    }

    computeSharableCustomBlocks() {
        Promise.resolve()
            .then(() => generateShareableCodeHints(this.workspace, this.hintState))
            .then(hints => {
                const trackedHints = this.calculateHintTracking(hints);
                this.dispatch(putAllHints(trackedHints, SHAREABLE_CODE_HINT_TYPE));
            });
    }

    computeRenamableCustomBlocks() {
        Promise.resolve()
            .then(() => generateRenamableCodeHints(this.workspace, this.hintState))
            .then(hints => {
                const trackedHints = this.calculateHintTracking(hints);
                this.dispatch(putAllHints(trackedHints, RENAMABLE_CUSTOM_BLOCK));
            });
    }

    applyTransformation(hintId) {
        this.workspace.removeChangeListener(this.blockListener);
        const actionSeq = applyTransformation(hintId, this.vm, this.workspace, this.analysisInfo);
        //TODO: better position the introduced procedure
        //quick fix for tutorial mode:
        if (this.options.isTutorialMode || this.options.userStudyMode) {
            actionSeq.then(() => {
                this.workspace.cleanUp();
            });
        }
        this.workspace.addChangeListener(
            this.blockListener);
    }

    generateHints(hintType) {
        if (hintType === DUPLICATE_CODE_SMELL_HINT_TYPE) {
            this.computeQualityHintsDebounced(hintType);
        } else if (hintType === SHAREABLE_CODE_HINT_TYPE) {
            this.computeSharableCustomBlocks();
        } else if (hintType === RENAMABLE_CUSTOM_BLOCK) {
            this.computeRenamableCustomBlocks();
        } else if (hintType === DUPLICATE_CONSTANT_HINT_TYPE) {
            this.computeQualityHintsDebounced(hintType); //merge with duplicate code
        }
    }

    clearAll(hintType) {
        this.dispatch(putAllHints([], hintType));
    }

    clearHintMap(hintTypes) {
        const map = {};
        hintTypes.forEach(t => map[t] = []);

        this.dispatch(putHintMap(map));
    }

    updateHintTracking() {
        //when no need to reanalyze (but only update its location tracking)
        const { hints, blocksSharableHints, renamables } = this.hintState;
        this.dispatch(putHintMap(
            {
                hints: this.calculateHintTracking(hints),
                blocksSharableHints: this.calculateHintTracking(blocksSharableHints),
                renamables: this.calculateHintTracking(renamables)
            }
        ));
    }

    onWorkspaceUpdate() {
        if (isTesting && !this.alreadySetup) {
            // addBlocksToWorkspace(this.workspace, testBlocks.simpleDuplicate);
            // addBlocksToWorkspace(this.workspace, testBlocks.simpleDuplicate2);
            // addBlocksToWorkspace(this.workspace, testBlocks.simpleProcedure);
            // addBlocksToWorkspace(this.workspace, testBlocks.bug);

            // Duplicate Constant
            // addBlocksToWorkspace(this.workspace, testBlocks.simpleDuplicateConst0);
            // addBlocksToWorkspace(this.workspace, testBlocks.simpleDuplicateConst1);
            // addBlocksToWorkspace(this.workspace, testBlocks.simpleDuplicateConst2);

            this.workspace.cleanUp();
            this.alreadySetup = true;
        }
    }

    attachVM() {
        if (!this.vm) return;
        this.workspace.addChangeListener(this.blockListener);
        this.vm.addListener('workspaceUpdate', this.onWorkspaceUpdate);
        // this.props.vm.addListener('targetsUpdate', this.onTargetsUpdate);
        addFunctionListener(this.workspace, 'translate', debounce(() => this.updateHintTracking()));
        addFunctionListener(this.workspace, 'zoom', debounce(() => this.updateHintTracking()));
        addFunctionListener(ScratchBlocks.Gesture.prototype, 'updateDragDelta_', debounce(() => this.updateHintTracking()));
    }

    detachVM() {
        this.vm.removeListener('workspaceUpdate', this.onWorkspaceUpdate);
        // this.props.vm.removeListener('targetsUpdate', this.onTargetsUpdate);
    }
}


export default HintManager;