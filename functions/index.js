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
        createdDate: admin.firestore.Timestamp.fromDate(new Date()),
        isAdmin : false,
        isApprover: false,
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


// exports.insertUserRole = functions.firestore.document('/teams/{documentId}')
//     .onUpdate((change, context) => {
//         const teamID = context.params.documentId;
//         return admin.firestore().collection('users').doc('users')
//             .set({ members: [userID] }, { merge: true })
//             .catch(err => {
//             console.log(err);
//             return;
//     });
// });

exports.sendEmail = functions.firestore.document('teams/{leadUser}')
    .onUpdate( async (change, context) => {
        console.log(change);
        
        let newApproverID = change.after.get("leadUser");
        let retiredApproverID = change.before.get("leadUser");
        console.log("new " + newApproverID);
        console.log("ret " + retiredApproverID);

        return admin.firestore().collection('users').doc(newApproverID).set({ isApprover: true }, { merge: true })
            .then(doc => {
                admin.firestore().collection('users').doc(retiredApproverID).set({ isApprover: false }, { merge: true })
            })
            .catch(err => console.log(err))
    });