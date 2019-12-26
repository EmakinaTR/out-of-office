const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onCreateUser = functions.auth.user().onCreate(async (userRecord, context) => {
    displayName = userRecord.displayName.split(' ')
    userDoc = {
        email : userRecord.email,
        firstName: displayName[0],
        lastName: displayName[1],
        avatarURL: userRecord.photoURL || '',
        createdDate: admin.firestore.Timestamp.fromDate(new Date()),
        isAdmin : false,
        isApprover: false,
        quitDate : ''
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

exports.onTeamLeadChange = functions.firestore.document('teams/{leadUser}')
    .onUpdate( async (change, context) => {
        let newApproverID = change.after.get("leadUser");
        let retiredApproverID = change.before.get("leadUser");
        return admin.firestore().collection('users').doc(newApproverID).set({ isApprover: true }, { merge: true })
            .then(doc => {
                console.log("Team lead changed succesfully")
                admin.firestore().collection('users').doc(retiredApproverID).set({ isApprover: false }, { merge: true })
            })
            .catch(err => console.log(err))
});

<<<<<<< HEAD
exports.getMyRequests = functions.https.onCall( async (req, res) => { // isCancelled + recruitmentDate + authUser 
=======
exports.getMyRequests = functions.https.onCall(async (data, context) => { 
    const userID = context.auth.uid;
>>>>>>> 4f3c29bd684ea328bce7865b983eeff32751064d
    let leaveRequestArray = [];
    await admin.firestore().collection('leaveRequests').where("createdBy", "==", userID).get().
        then(querySnapshot => {
            console.log("izin snapshot", querySnapshot);
            querySnapshot.docs.map(doc => {
                const docObject = doc.data();
                docObject.id = doc.id;
                leaveRequestArray.push(docObject);
            })
        }).catch(err => console.log(err));

    await Promise.all(leaveRequestArray.map(async (item) => {
        await admin.firestore().doc(item.leaveTypeRef.path).get().then(documentSnapshot => {
            item.leaveType = documentSnapshot.data();
        });
    }))
    return leaveRequestArray;
});

exports.getLeaveRequestDetail = functions.https.onCall(async (data, context) => {
    const documentId = data.text; 
    await admin.firestore().doc('/leaveRequests/{documentId}').get()
    .then( async querySnapshot => {
            const leaveRequest = querySnapshot.data();
            await admin.firestore().doc(leaveRequest.leaveTypeRef.path).get()
            .then(documentSnapshot => {
                leaveRequest.leaveType = documentSnapshot.data();
                
            });
            
        })
        .catch(err => { console.log(err);return ("Document not found") }
    )
    return leaveRequest;
});


exports.getTeamLeaves = functions.https.onCall(async (data, context) => {
    let teamMemmbers = [];
    let leaveRequestArray = [];
    await admin.firestore().collection('teams').where('leadUser', "==", context.auth.uid).get()
        .then(snapshot => {
            if (!snapshot.empty) { // If he/she is, get members of the team
                teamMemmbers = snapshot.docs[0].data().members;
            } else {
                return ("No data to display")
            }

        }).catch(err => console.log(err))
    if (teamMemmbers.length > 0) {  // If the team has at least one memeber, retrieve their request data
        await Promise.all(teamMemmbers.map(async (member) => {
            console.log("member " + member)
            await admin.firestore().collection('leaveRequests').where("createdBy", "==", member).get().
                then(querySnapshot => {
                 
                    querySnapshot.docs.map(doc => {
                        const docObject = doc.data();
                        docObject.id = doc.id;
                        leaveRequestArray.push(docObject);                      

                    })
                }).catch(err => console.log(err));
        }))
        if (leaveRequestArray.length > 0) {
            await Promise.all(leaveRequestArray.map(async (item) => { // Retrieve leave types of the leave requests
                await admin.firestore().doc(item.leaveTypeRef.path).get().then(documentSnapshot => {
                    item.leaveType = documentSnapshot.data();
                });
            }))
        }

    } else {
        return ("Your team has no members")
    }

    return leaveRequestArray;
});

exports.Test = functions.https.onCall(async (data,context) => {
    const id = context.auth.uid
    return id;
})