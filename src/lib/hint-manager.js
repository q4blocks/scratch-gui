import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';
import { addBlocksToWorkspace, testBlocks, getTestHints } from './hints/hint-test-workspace-setup';
import { putAllHints, putHintMap } from '../reducers/hints-state';
import { sendAnalysisReq, getProgramXml } from './hints/analysis-server-api';
import { computeHintLocationStyles, analysisInfoToHints, generateShareableCodeHints } from './hints/hints-util';
import { applyTransformation } from './hints/transform-api';
import debounce from 'lodash.debounce';
import ScratchBlocks from 'scratch-blocks';

import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, CONTEXT_MENU_REFACTOR, CONTEXT_MENU_INFO, CONTEXT_MENU_CODE_SHARE } from './hints/constants';
const highlightDuplicateBlocks = function (state, workspace, analysisInfo) {
    if (!state) {
        workspace.removeHighlightBox();
        return;
    }
    for (let recordKey of Object.keys(analysisInfo['records'])) {
        let record = analysisInfo['records'][recordKey];
        debugger;
        if (record.smell.type === 'DuplicateCode') {
            let fragments = record.smell['fragments'];
            for (let fNo in fragments) {
                let blockFragments = fragments[fNo].stmtIds;
                workspace.drawHighlightBox(blockFragments[0], blockFragments[blockFragments.length - 1]);
            }
        }
    }
};

const populateHintIcons = function (currentTargetName, workspace, analysisInfo) {
    for (let recordKey of Object.keys(analysisInfo['records'])) {
        let record = analysisInfo['records'][recordKey];
        if (record.smell.type === 'DuplicateCode') {
            let fragments = record.smell['fragments'];
            let f = fragments[0]; //use first fragment
            let anchorBlockId = f.stmtIds[0]; //and first block of each fragment clone to place hint
            let block = workspace.getBlockById(anchorBlockId);
            if (block) {
                if (!block.isShadow_ && !block.hint) {
                    block.setHintText(record.smell.id || record.smell.smellId);
                }
                if (block.hint) {
                    block.hint.setVisible(true);
                }
            }
        }
        // if(record.smell.type === 'DuplicateSprite'){
        //     let sprites = record.smell['sprites'];
        //     let targets = sprites.map(s=>s.spriteName);
        //     if(targets.indexOf(currentTargetName)>-1){
        //         console.log('TODO: show hint at this editing target' + currentTargetName);
        //         const hintData = {"id": record.smell.id||record.smell.smellId};
        //         workspace.setHint(hintData);
        //         workspace.showHint();   
        //     }
        // }
    }
}

const addFunctionListener = (object, property, callback) => {
    const oldFn = object[property];
    object[property] = function () {
        const result = oldFn.apply(this, arguments);
        callback.call(this, result);
        return result;
    };
};

const isTesting = false;
const isProductionMode = true;
class HintManager {
    constructor(vm, workspace, dispatch, hintState, options) {
        this.hintState = hintState;
        this.vm = vm;
        this.workspace = workspace;
        this.dispatch = dispatch;
        this.projectId = options?options.projectId:'0';

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
        if (!(['ui', 'endDrag'].includes(e.type))) {
            if (this.hintState.options.showQualityHint) {
                this.generateHints(DUPLICATE_CODE_SMELL_HINT_TYPE);
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

    getAnalysisInfo(){
        return this.analysisInfo;
    }

    computeQualityHints() {
        const _vm = this.vm;
        return Promise.resolve()
            .then(() => getProgramXml(_vm))
            .then(xml => sendAnalysisReq(this.projectId, 'duplicate_code', xml, isProductionMode))
            .then(json => {
                const analysisInfo = json;
                this.analysisInfo = analysisInfo;
                return analysisInfo ? analysisInfoToHints(analysisInfo) : [];
            }).then(hints => {
                const trackedHints = this.calculateHintTracking(hints);
                this.dispatch(putAllHints(trackedHints, DUPLICATE_CODE_SMELL_HINT_TYPE));
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

    applyTransformation(hintId){
        this.workspace.removeChangeListener(this.blockListener);
        applyTransformation(hintId, this.vm, this.workspace, this.analysisInfo);
        this.workspace.addChangeListener(
            this.blockListener);
    }


    onWorkspaceMetricsChange() {
        console.log('metric change')
    }

    generateHints(hintType) {
        if (hintType === DUPLICATE_CODE_SMELL_HINT_TYPE) {
            this.computeQualityHintsDebounced();
        } else if (hintType === SHAREABLE_CODE_HINT_TYPE) {
            this.computeSharableCustomBlocks();
        }
    }

    clearAll(hintType) {
        this.dispatch(putAllHints([], hintType));
    }

    updateHintTracking() {
        //when no need to reanalyze (but only update its location tracking)
        const {hints, blocksSharableHints} = this.hintState;
        this.dispatch(putHintMap(
            {
                hints: this.calculateHintTracking(hints),
                blocksSharableHints: this.calculateHintTracking(blocksSharableHints)
            }
        ));
    }

    onWorkspaceUpdate() {
        if (isTesting && !this.alreadySetup) {
            // addBlocksToWorkspace(this.workspace, testBlocks.simpleDuplicate);
            // addBlocksToWorkspace(this.workspace, testBlocks.simpleDuplicate2);
            // addBlocksToWorkspace(this.workspace, testBlocks.simpleProcedure);
            // addBlocksToWorkspace(this.workspace, testBlocks.bug);
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


export {
    highlightDuplicateBlocks,
    populateHintIcons,
    HintManager as default
}