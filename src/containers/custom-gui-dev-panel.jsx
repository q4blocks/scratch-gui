import React from "react";
import bindAll from 'lodash.bindall';
import omit from 'lodash.omit';
import { connect } from 'react-redux';
import {setCustomFeatureToggleVisible, featureNames} from '../reducers/custom-menu';

class CustomGuiDevPanel extends React.Component {

    render(){
        return (
            <div>
                <button onClick={this.props.onShowProcedureShareToggle}>show procedure share feature</button>
                hintSetting: {JSON.stringify(this.props.hintOptions)}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        hintOptions: state.scratchGui.hintState.options
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onShowProcedureShareToggle: ()=> dispatch(setCustomFeatureToggleVisible(featureNames.PROCEDURE_SHARE,true))
    };
};

const ConnectedComponent = connect(
    mapStateToProps, mapDispatchToProps
)(CustomGuiDevPanel);

export default ConnectedComponent;