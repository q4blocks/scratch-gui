import React from "react";
import bindAll from 'lodash.bindall';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import VM from 'scratch-vm';
import ScratchBlocks from 'scratch-blocks';

import { setHint, updateHint, putHint, removeHint } from '../reducers/hints-state';
import WsOverlayComponent from '../components/wsoverlay/wsoverlay.jsx';


const addFunctionListener = (object, property, callback) => {
    const oldFn = object[property];
    object[property] = function () {
        const result = oldFn.apply(this, arguments);
        callback.apply(this, result);
        return result;
    };
};

class WsOverlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: {
                position: 'absolute',
                top: '0px',
                left: '0px'
            }
        };

        bindAll(this, [
            // 'attachVM',
            // 'detachVM',
            'onWorkspaceUpdate',
            'onWorkspaceMetricsChange',
            'onTargetsUpdate',
            'blockListener',
            'onHandleHintMenuItemClick'
        ]);
        // Asset ID of the current sprite's current costume
        this.decodedAssetId = null;
    }

    componentDidUpdate(prevProps) {

    }

    componentDidMount() {
        this.workspace = ScratchBlocks.getMainWorkspace();
        this.attachVM();
    }

    attachVM() {
        if (!this.props.vm) return null;
        this.workspace.addChangeListener(this.blockListener);
        this.props.vm.addListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.addListener('targetsUpdate', this.onTargetsUpdate);
        addFunctionListener(this.workspace, 'translate', this.onWorkspaceMetricsChange);
        addFunctionListener(this.workspace, 'zoom', this.onWorkspaceMetricsChange);
    }

    detachVM() {
        this.props.vm.removeListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.removeListener('targetsUpdate', this.onTargetsUpdate);
    }

    onWorkspaceMetricsChange() {
        const { hintState: { hints } } = this.props;
        if (hints.length <= 0) return;
        this.showHint();
    }

    onWorkspaceUpdate(data) {

    }

    onTargetsUpdate() {

    }

    showHint() {
        const { hintState: { hints } } = this.props;
        hints.map(h => this.updateHintTracking(h));
    }

    updateHintTracking(hint) {
        const block = this.workspace.getBlockById(hint.blockId);
        if (!block) return;
        const blockSvg = block.getSvgRoot();
        const blockWidth = block.svgPath_.getBBox().width;
        const hintOffset = 10;
        const computeTop = (blockSvg, workspace) => blockSvg.getBoundingClientRect().y - workspace.svgBackground_.getBoundingClientRect().top;
        const computeLeft = (blockSvg, workspace) => {
            return blockSvg.getBoundingClientRect().x - workspace.svgBackground_.getBoundingClientRect().left + (blockWidth + hintOffset) * this.workspace.scale;
        }

        const changes = {
            styles: {
                position: 'absolute',
                top: computeTop(blockSvg, this.workspace) + 'px',
                left: computeLeft(blockSvg, this.workspace) + 'px'
            }
        };


        this.props.onUpdateHint(hint.hintId, changes);
    }

    onHandleHintMenuItemClick(hintId, itemAction) {
        const { hintState: { hints } } = this.props;
        const hint = hints.find(h => h.hintId === hintId);
        console.log('TODO for this hint menu item for ' + hintId + ":" + itemAction);
    }

    getTestHints() {
        const badBlocks = Object.values(Blockly.getMainWorkspace().blockDB_).filter(b => !b.isShadow_ && b.type === 'motion_movesteps');
        const hints = badBlocks.map(b => {
            let oldHint = this.props.hintState.hints.find(h => b.id === h.blockId);
            if (oldHint) return oldHint;
            let blockId = b.id;
            let hintId = blockId; //hintId is also block id;

            const hintMenuItems = [
                {
                    item_name: 'Help me extract method',
                    item_action: 'REFACTOR',
                    onHandleClick: this.handleClick
                },
                {
                    item_name: 'Learn more',
                    item_action: 'INFO',
                    onHandleClick: this.handleClick
                }
            ]
            return { hintId, blockId, hintMenuItems };
        });
        this.props.setHint(hints);
    }

    blockListener(e) {
        if (this.workspace.isDragging()) return;
        this.getTestHints();
        const { hintState: { hints } } = this.props;
        if (hints.length > 0) {
            this.showHint();
        }
    }

    render() {
        const componentProps = omit(this.props, ['asset', 'vm']);
        return (
            <div>
                <WsOverlayComponent
                    styles={this.state.styles}
                    hints={this.state.hintState}
                    onHandleHintMenuItemClick={this.onHandleHintMenuItemClick}
                    {...componentProps}
                />
            </div>
        );
    }
}

WsOverlay.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => {
    const targets = state.scratchGui.targets;
    const currentTargetId = targets.editingTarget;
    return {
        vm: state.scratchGui.vm,
        hintState: state.scratchGui.hintState,
        currentTargetId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setHint: hints => dispatch(setHint(hints)),
        onUpdateHint: (hintId, changes) => dispatch(updateHint(hintId, changes))
        , putHint, removeHint
    }
};

const ConnectedComponent = connect(
    mapStateToProps, mapDispatchToProps
)(WsOverlay);

export default ConnectedComponent;
