import React from 'react';
import classNames from 'classnames';
import styles from './selection.css';
import closeIconSvg from './icon--close.svg';

const CloseButton = props => (
    <div className={classNames(styles.floaterHeader)}>
        <div className={styles.closeButton}>
            <img className={classNames(styles.small, styles.closeIcon)} src={closeIconSvg} onClick={props.onClose} />
        </div>
    </div>
)

export {CloseButton};