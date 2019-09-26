import React, { Fragment } from 'react';
import styles from './reference.css';
import inspectCode from '../../lib/libraries/custom-decks/intro/figure-out-code-1.gif';
import createCustomBlock from '../../lib/libraries/custom-decks/reference/simple-custom-block.gif';
// import inspectCode from '../../lib/libraries/custom-decks/intro/figure-out-code-1.gif'
import customCardStyles from './custom-card.css';
import upIcon from './up-icon.png';

const Card = ({ id, title, image }) => (
    <div className={styles.card}>
        <h4 id={id}>{title}</h4>
        <div className={styles.imageContainer}>
            <img className={styles.cardImage} src={image} />
        </div>
    </div>
);

const Link = ({ id, title }) => (
    <div className={styles.linkContainer}>
        <a href={"#" + id} className={styles.cardLink} onClick={ev => {
            document.getElementById(id).scrollIntoView();
            ev.preventDefault();
        }}>{title}</a>
    </div>
)

const cardContents = [
    {
        id: "inspect",
        title: "Inspect code",
        image: inspectCode
    },
    {
        id: "create-custom-block",
        title: "Create a custom block",
        image: createCustomBlock
    }
];

const Reference = ({ expanded}) => {
    return (
        <div className={expanded? styles.container:customCardStyles.hidden}>
            <h3 id="top">Quick Reference</h3>
            {/* <a href="#inspect" onClick={ev=>{    
                document.getElementById("inspect").scrollIntoView();
                ev.preventDefault();
            }}>abc</a> */}
            <div className={styles.toc}>
                {cardContents.map(c => <Link key={c.id} id={c.id} title={c.title} image={c.image} />)}
            </div>
            {cardContents.map(c => <Card key={c.id} id={c.id} title={c.title} image={c.image} />)}

            <div className={styles.topButton} onClick={ev => {
                document.getElementById("top").scrollIntoView();
                ev.preventDefault();
            }}>
                <img className={styles.upIcon} src={upIcon} />
            </div>
        </div>
    );
}

export default Reference;