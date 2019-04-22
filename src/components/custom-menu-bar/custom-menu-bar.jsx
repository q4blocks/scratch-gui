import classNames from 'classnames';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import bindAll from 'lodash.bindall';
import React from 'react';
import customStyles from './custom-menu-bar.css';
import styles from '../menu-bar/menu-bar.css';
import SBFileUploader from '../../containers/sb-file-uploader.jsx';
import SB3Downloader from '../../containers/sb3-downloader.jsx';
import { MenuItem, MenuSection } from '../menu/menu.jsx';
import MenuBarMenu from '../menu-bar/menu-bar-menu.jsx';
import ProjectIdInput from './project-id-input.jsx';


import { setHintOptions } from '../../reducers/hints-state';
import {
  openAccountMenu,
  closeAccountMenu,
  accountMenuOpen,
  openFileMenu,
  closeFileMenu,
  fileMenuOpen,
  openEditMenu,
  closeEditMenu,
  editMenuOpen,
  openLanguageMenu,
  closeLanguageMenu,
  languageMenuOpen,
  openLoginMenu,
  closeLoginMenu,
  loginMenuOpen
} from '../../reducers/menus';
import Toggle from 'react-toggled'


const FeatureToggle = ({className, featureName, isOn, onToggle }) => (
  <Toggle onToggle={onToggle}>
    {({ on = isOn, getTogglerProps }) => (
      <div className={classNames(className,customStyles.featureItem)}>
        <div style={{ padding: '2px' }}>
          {featureName}
        </div>

        <span
          className="container"
          style={{
            position: "relative",
            display: "inline-block",
            width: "40px",
            height: "20px"
          }}
        >
          <input
            type="checkbox"
            style={{
              width: "100%",
              height: "100%",
              margin: 0
            }}
            {...getTogglerProps()}
          />
          <span
            className="switch"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "100%",
              pointerEvents: "none"
            }}
          >
            <span
              className="track"
              style={{
                flex: 1,
                height: "100%",
                borderRadius: "10px",
                background: on ? "#83b8fa" : "#0f58bd"
              }}
            />
            <span
              className="slider"
              style={{
                position: "absolute",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#fff1d7",
                transition: "transform 0.3s",
                transform: on ? "translateX(22px)" : "translateX(2px)"
              }}
            />
          </span>
        </span>

      </div>
    )}
  </Toggle>
)

const LoadFromFile = props => {
  return (
    <div className={styles.mainMenu}>
      <div className={styles.fileGroup}>
        <SBFileUploader onUpdateProjectTitle={props.onUpdateProjectTitle}>
          {(className, renderFileInput, loadProject) => (
            <div className={className} onClick={loadProject}>
              Load project
              {renderFileInput()}
            </div>
          )}
        </SBFileUploader>
      </div>
    </div>
  )
}

class CustomizedMenuBar extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, [
      // 'handleClickNew',
      // 'handleClickSave',
      // 'handleCloseFileMenuAndThen'
    ]);
  }

  render() {
    return (<React.Fragment>
      <div
        className={classNames(
          customStyles.customMenuBar
        )}
      >
        <div style={{ display: 'flex' }} className='custom-features'>
          <div className='projectIdInput' style={{ display: 'flex', padding: '4px', marginRight:'50px' }}>
            <ProjectIdInput
              className={classNames(styles.titleFieldGrowable)}
              onUpdateProjectId={this.props.onUpdateProjectId}
            />
          </div>
          {this.props.qualityHintToggleVisible ? <FeatureToggle
            className='code-hint-feature-toggle'
            featureName='Code Hints'
            isOn={this.props.isQualityHintEnabled}
            onToggle={this.props.onToggleQualityHintFeature}
          /> : null}
          {this.props.procedureShareToggleVisible ? <FeatureToggle
            className='procedure-share-feature-toggle'
            featureName='Procedure Sharing'
            isOn={this.props.isProcedureShareEnabled}
            onToggle={this.props.onToggleProcedureShareFeature}
          /> : null}
        </div>
      </div>
    </React.Fragment>);
  }
}

const mapStateToProps = (state, props) => {
  const { isVisible, showProcedureSharingHint, showQualityHint } = state.scratchGui.hintState.options;
  return {
    fileMenuOpen: fileMenuOpen(state),
    procedureShareToggleVisible: props.procedureShareToggleVisible || state.scratchGui.customMenu.procedureShareToggleVisible,
    qualityHintToggleVisible: props.qualityHintToggleVisible || state.scratchGui.customMenu.qualityHintToggleVisible,
    isProcedureShareEnabled: isVisible && showProcedureSharingHint,
    isQualityHintEnabled: isVisible && showQualityHint
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  onToggleProcedureShareFeature: (value) => dispatch(setHintOptions({
    isVisible: true,
    showProcedureSharingHint: value
  })),
  onToggleQualityHintFeature: (value) => dispatch(setHintOptions({
    isVisible: true,
    showQualityHint: value,
    hintWithRefactoringSupport: true,
  })),
  onUpdateProjectId: (value) => {
    console.log('updated', value);
    window.open('/#' + value, "_self");
  }
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomizedMenuBar));