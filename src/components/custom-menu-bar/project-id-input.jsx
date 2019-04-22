import classNames from 'classnames';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import React from 'react';
import {defineMessages, intlShape, injectIntl} from 'react-intl';

import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import Input from '../forms/input.jsx';
const BufferedInput = BufferedInputHOC(Input);

import styles from './project-id-input.css';

class ProjectIdInput extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleUpdateProjectId'
        ]);
    }

    handleUpdateProjectId (projectId) {
        if (this.props.onUpdateProjectId) {
            this.props.onUpdateProjectId(projectId);
        }
    }
    render () {
        return (
            <BufferedInput
                className={classNames(styles.titleField, this.props.className)}
                maxLength="100"
                placeholder='Put the project ID you want to open here'
                tabIndex="0"
                type="text"
                value={this.props.projectId&&this.props.projectId!=='0'?this.props.projectId:''}
                onSubmit={this.handleUpdateProjectId}
            />
        );
    }
}

const mapStateToProps = state => ({
    projectId: state.scratchGui.projectState.projectId
});

const mapDispatchToProps = () => ({});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectIdInput));
