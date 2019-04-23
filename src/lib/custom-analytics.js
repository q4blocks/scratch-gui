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
    stitchClient.auth.loginWithCredential(new AnonymousCredential()).then(user => {
        const userId = stitchClient.auth.user.id;
        db.collection('feedback').findOne({ userId: userId }).then(res => {
            if (res) {
                const records = [...res.records, data]
                const entry = Object.assign({},res, {records:records});
                db.collection('feedback').updateOne({ userId: userId }, { $set: Object.assign({}, res, entry) }, { upsert: true })
            
            } else {
                const entry = {records:[data]};
                db.collection('feedback').updateOne({ userId: userId }, { $set: entry }, { upsert: true })
                console.log('new entry', JSON.stringify({ userId, ...entry }));
            }
        });
        // db.collection('feedback').updateOne({ userId: stitchClient.auth.user.id }, { $set: data }, { upsert: true })
    })
}



const saveProfileData = (key, value) => {
    console.log('saving data');
    const entry = {};
    entry[key] = value;

    stitchClient.auth.loginWithCredential(new AnonymousCredential()).then(user => {
        const userId = stitchClient.auth.user.id;
        db.collection('profile').findOne({ userId: userId }).then(res => {
            if (res) {
                db.collection('profile').updateOne({ userId: userId }, { $set: Object.assign({}, res, { ...entry }) }, { upsert: true })
            } else {
                // console.log('new entry', JSON.stringify({ userId, ...entry }));
                db.collection('profile').updateOne({ userId: userId }, { $set: { userId, ...entry } }, { upsert: true })
            }
        });
    })
}


export default analytics;
export { stitchClient, sendFeedbackData, saveProfileData };

