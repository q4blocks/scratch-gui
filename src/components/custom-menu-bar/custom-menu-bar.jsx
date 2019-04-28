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
import analytics from "../../lib/custom-analytics";
import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, CONTEXT_MENU_REFACTOR, CONTEXT_MENU_INFO, CONTEXT_MENU_CODE_SHARE } from '../../lib/hints/constants';
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
import Toggle from 'react-toggled';
import Toggle2 from 'react-toggle';
import '!style-loader!css-loader!react-toggle/style.css';



const FeatureToggle = props => {
  const { featureName, checked, handleOnChange } = props;
  return (
    <div className={classNames(props.className, customStyles.featureItemWrapper)}>
      <div>{featureName}</div>
      <Toggle2
        checked={checked}
        name='burritoIsReady'
        value='yes'
        onChange={handleOnChange} />
    </div>
  )
};


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
          <div className='projectIdInput' style={{ display: 'flex', padding: '4px', marginRight: '50px' }}>
            <ProjectIdInput
              className={classNames(styles.titleFieldGrowable)}
              onUpdateProjectId={this.props.onUpdateProjectId}
            />
          </div>
          {this.props.qualityHintToggleVisible ? <FeatureToggle
            className='code-hint-feature-toggle'
            featureName='Code Wizard'
            checked={this.props.showQualityHint}
            handleOnChange={() => {
              const isEnabled = !this.props.showQualityHint;
              this.props.onToggleQualityHintFeature(isEnabled)
              if(isEnabled){
                this.props.hintManager.generateHints(DUPLICATE_CODE_SMELL_HINT_TYPE);
              }else{
                this.props.hintManager.clearAll(DUPLICATE_CODE_SMELL_HINT_TYPE);
              }
              
              analytics.event({
                category: "Feature",
                action: "Tap Code Hint Toggle",
                label: JSON.stringify({ enabled: !this.props.showQualityHint, projectId: this.props.projectId, withinTutorial: this.props.showTutorial })
              });
            }}
          /> : null}

          {this.props.procedureShareToggleVisible ? <FeatureToggle
             className='procedure-share-feature-toggle'
             featureName='Custom Block Sharing'
            checked={this.props.showProcedureSharingHint}
            handleOnChange={() => {
              const isEnabled = !this.props.showProcedureSharingHint;
              this.props.onToggleProcedureShareFeature(isEnabled);
              if(isEnabled){
                this.props.hintManager.generateHints(SHAREABLE_CODE_HINT_TYPE);
              }else{
                this.props.hintManager.clearAll(SHAREABLE_CODE_HINT_TYPE);
              }
              analytics.event({
                category: "Feature",
                action: "Tap Custom Block Sharing Toggle",
                label: JSON.stringify({ enabled: isEnabled, projectId: this.props.projectId, withinTutorial: this.props.showTutorial })
              });
            }}
          /> : null}
        </div>
      </div>
    </React.Fragment>);
  }
}

const mapStateToProps = (state, props) => {
  const { showProcedureSharingHint, showQualityHint } = state.scratchGui.hintState.options;
  return {
    fileMenuOpen: fileMenuOpen(state),
    procedureShareToggleVisible: props.procedureShareToggleVisible || state.scratchGui.customMenu.procedureShareToggleVisible,
    qualityHintToggleVisible: props.qualityHintToggleVisible || state.scratchGui.customMenu.qualityHintToggleVisible,
    showProcedureSharingHint: showProcedureSharingHint,
    showQualityHint: showQualityHint,
    projectId: state.scratchGui.projectState.projectId,
    showTutorial: props.showTutorial,
    hintManager: state.scratchGui.hintState.hintManager
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onToggleProcedureShareFeature: (isOn) => {
    dispatch(setHintOptions({
      showProcedureSharingHint: isOn
    }))
  },
  onToggleQualityHintFeature: (isOn) => {
    dispatch(setHintOptions({
      showQualityHint: isOn
    }))
  },
  onUpdateProjectId: (value) => {
    window.open('/editor/' + value, "_self"); //todo: later detect if has updateProjectId callback otherwise use hash mechanism #
  }
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomizedMenuBar));