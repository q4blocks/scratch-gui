import analytics from './analytics';

const { Stitch, AnonymousCredential, RemoteMongoClient } = require('mongodb-stitch-browser-sdk');
const stitchClientId = 'toolkit-users-vzjer';

const stitchClient = Stitch.hasAppClient(stitchClientId) ? Stitch.getAppClient(stitchClientId) : Stitch.initializeDefaultAppClient(stitchClientId);
const db = stitchClient.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('user-study');

stitchClient.auth.loginWithCredential(new AnonymousCredential()).then(user => {
    console.log('user id', user.id);
    initializeAnalytics(user.id);
});




const initializeAnalytics = userId => {
    // GoogleAnalytics.initialize('UA-138525408-1', {
    //     debug: true,
    //     gaOptions: {
    //         userId: userId
    //     }
    // });
    analytics.set({ userId: userId });
}

const sendFeedbackData = data => {
    console.log('feedback sent');
    stitchClient.auth.loginWithCredential(new AnonymousCredential()).then(user=>{
        db.collection('feedback').updateOne({userId: stitchClient.auth.user.id}, {$set:data}, {upsert:true})
    })
}


export default analytics;
export { stitchClient, sendFeedbackData };

