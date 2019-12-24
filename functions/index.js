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

exports.getTeamLeavesByUserID = functions.https.onRequest( async (req, res) => { // isCancelled + recruitmentDate + authUser 
    const userID = req.query.user;
    let teamMemmbers = [];
    let leaveRequestArray = [];
    
    await admin.firestore().collection('teams').where('leadUser', "==", userID).get() // Check if user is team lead
        .then(snapshot => {
           if(!snapshot.empty){ // If he/she is, get members of the team
               teamMemmbers = snapshot.docs[0].data().members;
           }
           else{
                res("No data to display")
           }
        }).catch(err => console.log(err))
    if (teamMemmbers.length > 0) {  // If the team has at least one memeber, retrieve their request data
        await Promise.all(teamMemmbers.map(async (member) => {
            console.log("member " +member)
            await admin.firestore().collection('leaveRequests').where("createdBy", "==", member).get().
                then(querySnapshot  => {
                    console.log("izin snapshot", querySnapshot );
                    querySnapshot.docs.map(doc => {
                        leaveRequestArray.push(doc.data());
                    })
                }).catch(err=>console.log(err));
        }))
        await Promise.all(leaveRequestArray.map(async (item) => { // Retrieve leave types of the leave requests
            await admin.firestore().doc(item.leaveTypeRef.path).get().then(documentSnapshot => {
                item.leaveType = documentSnapshot.data();
            });
        }))
    }
    res.status(200).send(leaveRequestArray)
});