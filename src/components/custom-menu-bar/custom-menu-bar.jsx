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
                <div className={styles.mainMenu}>
                    <div className={styles.fileGroup}>
                        <SBFileUploader onUpdateProjectTitle={this.props.onUpdateProjectTitle}>
                            {(className, renderFileInput, loadProject) => (
                                <div className={className} onClick={loadProject}>
                                    Load project
                                    {renderFileInput()}
                                </div>
                            )}
                        </SBFileUploader>
                    </div>
                </div>
            </div>
        </React.Fragment>);
    }
}

const mapStateToProps = state => {
    return {
        fileMenuOpen: fileMenuOpen(state),
    }
}

const mapDispatchToProps = dispatch => ({

});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomizedMenuBar));