const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


exports.createUser = functions.auth.user().onCreate(async (userRecord, context) => {
    displayName = userRecord.displayName.split(' ')
    userDoc = {
        email : userRecord.email,
        firstName: displayName[0],
        lastName: displayName[1],
        avatarURL: userRecord.photoURL || '',
        createdDate: admin.firestore.Timestamp.fromDate(new Date())
    }
    return admin.firestore().collection('users').doc(userRecord.uid)
        .set(userDoc)
        .then(writeResult => {
            console.log('User Created result:', writeResult);
            return;
        })
        .catch(err => {
            console.log(err);
            return;
    });
});


exports.insertUserRole = functions.firestore.document('/users/{documentId}')
    .onCreate((snap, context) => {
        const userID = context.params.documentId;
        return admin.firestore().collection('userRoles').doc('users')
            .set({ members: [userID] }, { merge: true })
            .catch(err => {
            console.log(err);
            return;
    });
});

