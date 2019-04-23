import React from 'react';
//In your react App.js or yourComponent.js file add these lines to import
import * as Survey from "survey-react";
import '!style-loader!css-loader!survey-react/survey.css';

import analytics, { stitchClient, sendFeedbackData } from "../../lib/custom-analytics";

const json = {
    questions: [
        {
            type: "rating",
            name: "helpfulness-code-hint",
            title: "How helpful did you find the Code Wizard's hint in helping you see where you can improve your code?",
            minRateDescription: "Not at all helpful",
            maxRateDescription: "Extremely helpful"
        },
        {
            type: "rating",
            name: "helpfulness-extract-custom-block",
            title: `How helpful did you find the Code Wizard's Extract a Custom Block helpful`,
            minRateDescription: "Not at all helpful",
            maxRateDescription: "Extremely helpful"
        },
        {
            type: "comment",
            name: "other-comments",
            title: "Any other comments  (e.g., What did you like/dislike? How the Code Wizard feature can be improved?, etc.)"
        }
    ]
};

class SurveyComponent extends React.Component {
    constructor(props){
        super(props);
    }
    //Define a callback methods on survey complete
    onComplete(survey, options) {
        //Write survey results into database
        //   console.log("Survey results: " + JSON.stringify(survey.data));
        sendFeedbackData({...survey.data, timestamp:new Date().toLocaleString()});
    }
    render() {
        //Create the model and pass it into react Survey component
        //You may create survey model outside the render function and use it in your App or component
        //The most model properties are reactive, on their change the component will change UI when needed.
        var model = new Survey.Model(json);
        return (<Survey.Survey model={model} onComplete={this.onComplete} />);
        /*
        //The alternative way. react Survey component will create survey model internally
        return (<Survey.Survey json={this.json} onComplete={this.onComplete}/>);
        */
        //You may pass model properties directly into component or set it into model
        // <Survey.Survey model={model} mode="display"/>
        //or 
        // model.mode="display"
        // <Survey.Survey model={model}/>
        // You may change model properties outside render function. 
        //If needed react Survey Component will change its behavior and change UI.
    }
}

export default SurveyComponent;