import React from 'react';
import TutorialComponent from '../components/tutorial/tutorial.jsx';

class Tutorial extends React.Component {
    constructor(props) {
        super(props);
        this.state = { target: null };
    }

    componentDidMount() {
        setTimeout(() => {
            const myBlockTarget = document.querySelector(".scratchCategoryMenu > div:nth-child(9)");
            const makeBlockTarget = document.querySelectorAll(".blocklyFlyoutButton")[2];
            this.setState({
                target: myBlockTarget
            });
            myBlockTarget.addEventListener("click", ()=>{console.log("My Block!")});
            makeBlockTarget.addEventListener("click", ()=>{console.log("Make a Block!")});
            console.log('set target');
        }, 5000);
    }

    render() {
        return (<TutorialComponent target={this.state.target} />);
    }
}


export default Tutorial;