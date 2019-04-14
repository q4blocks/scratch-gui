import React from 'react';
import TutorialComponent from '../components/tutorial/tutorial.jsx';

class Tutorial extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (<TutorialComponent />);
    }
}


export default Tutorial;