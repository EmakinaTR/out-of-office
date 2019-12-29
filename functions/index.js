const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onCreateUser = functions.auth.user().onCreate(async (userRecord, context) => {
    displayName = userRecord.displayName.split(' ')
    userDoc = {
        email: userRecord.email,
        firstName: displayName[0],
        lastName: displayName[1],
        avatarURL: userRecord.photoURL || '',
        createdDate: admin.firestore.Timestamp.fromDate(new Date()),
        isAdmin: false,
        isApprover: false,
        quitDate: ''
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
    .onUpdate(async (change, context) => {
        let newApproverID = change.after.get("leadUser");
        let retiredApproverID = change.before.get("leadUser");
        return admin.firestore().collection('users').doc(newApproverID).set({ isApprover: true }, { merge: true })
            .then(doc => {
                console.log("Team lead changed succesfully")
                admin.firestore().collection('users').doc(retiredApproverID).set({ isApprover: false }, { merge: true })
            })
            .catch(err => console.log(err))
    });

exports.getMyRequests = functions.https.onCall(async (data, context) => {
    const userID = context.auth.uid;
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
    const documentId = data; 
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


exports.getTeamLeavesC = functions.https.onCall(async (data, context) => {
        const userId = context.auth.uid;
        const user = await _getUser(userId);        
        const leaveRequestArray = await _getLeaves(userId,_isAdmin(user));
        console.log("LEAVE ARRAY BEFORE:", leaveRequestArray);
        if (leaveRequestArray.length > 0) {
            await Promise.all(leaveRequestArray.map(async (item) => { // Retrieve leave types of the leave requests
                await admin.firestore().doc(item.leaveTypeRef.path).get().then(documentSnapshot => {
                    item.leaveType = documentSnapshot.data();
                });
            }))
        }    
        console.log("LEAVE ARRAY AFTER:", leaveRequestArray);
    return leaveRequestArray;
});

const _getLeaves = async (userid, isAdmin = false) => {
    let leaves = []
    if (isAdmin) {
        leaves = _getAdminLeaves();
    } else {
        leaves = _getTeamLeaves(userid);
    }    
    return leaves;
}

const _getTeamLeaves = async (userid) => {
    const leaveRequestArray = [];
    let teamMemmbers = [];
    await admin.firestore().collection('teams').where('leadUser', "==", userid).get()
        .then(snapshot => {
            if (!snapshot.empty) { // If he/she is, get members of the team
                teamMemmbers = snapshot.docs[0].data().members;
            } else {
                return null;
            }

        }).catch(err => console.log(err))
    if (teamMemmbers.length > 0) {  // If the team has at least one memeber, retrieve their request data
        await Promise.all(teamMemmbers.map(async (member) => {
            await admin.firestore().collection('leaveRequests').where("createdBy", "==", member).get().
                then(querySnapshot => {
                    querySnapshot.docs.map(doc => {
                        const docObject = doc.data();
                        docObject.id = doc.id;
                        leaveRequestArray.push(docObject);

                    })
                }).catch(err => { return null; });
        }))
    }
    return leaveRequestArray;
}
const _getAdminLeaves = async(userid) => {
    const leaveRequestArray = [];
    await admin.firestore().collection('leaveRequests').get().then(querySnapshot => {
        querySnapshot.docs.map(doc => {
            const docObject = doc.data();
            docObject.id = doc.id;
            leaveRequestArray.push(docObject);
        })
    }).catch(err => { return null; });
    return leaveRequestArray;
}
const _getUser = (userid) => {
    return new Promise((resolve, reject) => {
        admin.firestore().doc(`users/${userid}`).get().then(response => {
            resolve(response.data());
        }).catch(error => {
            reject(error);
        });
    });
}
const _getLeaveTypeByRef = (ref) => {
    return new Promise((resolve, reject) => {
        admin.firestore().doc(ref).get().then(response => {
            resolve(response.data());
        }).catch(error => {
            reject(error);
        });
    });     
}
const _isAdmin = (user) => {
    return user.isAdmin === true;
}

const _isApprover = (user) => {
    return user.isApprover === true;
}

exports.Test = functions.https.onCall(async (data, context) => {
    let user;
    const id = context.auth.uid;
    await _getUser(id).then(async response => {
        console.log("User:: ", response);
        user = response;
    }).catch(error => {
        console.log("Error: ", error);
    })
    return user;
})

const _getLeaveRequestFromID = (documentId) => {
    return new Promise((resolve, reject) => {
        admin.firestore().doc(`leaveRequests/${documentId}`).get().then(response => {
            resolve(response.data());
        }).catch(error => {
            reject(error);
        });
    });     
}
const status = {
    WAITING: 0,
    APPROVED: 1,
    REJECTED: 2,
    CANCELLED: 3
}

const sendMailtoUser =() => {
    console.log("User mail sent")
}
const sendMailtoApprover = () => {
    console.log("Approver mail sent")
}

const _setDocumentField =(collection,doc,field,fieldValue) => {
    console.log({[field]:fieldValue})
    return new Promise((resolve, reject) => {
        admin.firestore().collection(collection).doc(doc).set({[field]:fieldValue}, { merge: true }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error);
        });
    });     
}


const _insertUpdateLog = (documentId, processedBy, processedDate, processStatus) => {
    console.log({ [field]: fieldValue })
    return new Promise((resolve, reject) => {
        admin.firestore().collection('logs').doc(documentId)
            .set({ actions: [{ processedBy: processedBy, processedDate: new Date(), processStatus: processStatus }] },
                { merge: true }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error);
        });
    });
}
exports.changeLeaveStatus = functions.https.onCall(async (data, context) => {
    let documentId = data.documentID;
    let newStatus = data.newStatus;
    let documentOwner;
    let oldStatus;
    let leaveRequest;
    let leaveType;
    console.log(data);
    console.log("doc id ", documentId)
    console.log("status  ", newStatus)
   
    await _getLeaveRequestFromID(documentId).then(async response => {
        // console.log("LeaveRequest:: ", response);
        leaveRequest = response;
        oldStatus = response.status;

    }).catch(error => {
        console.log("Error: ", error);
    })
    await _getUser(leaveRequest.createdBy).then(async response => {
        // console.log("documentOwner:: ", response);
        documentOwner = response;
        console.log(documentOwner)
        
    }).catch(error => {
        console.log("Error: ", error);
    })
    

    await _getLeaveTypeByRef(leaveRequest.leaveTypeRef.path).then(async response => {
        // console.log("leaveType:: ", response);
        leaveType = response;
    }).catch(error => {
        console.log("Error: ", error);
    })
    console.log("WAİTİNG: ",status.WAITING)
   
    await _setDocumentField("leaveRequests", documentId, "status", newStatus).then(async response => {
        // console.log("Form status has changed from" + oldStatus + " to " + newStatus);
    }).catch(error => {
        console.log("Error while form status changing: ", error);
    })

    if(oldStatus === status.WAITING && newStatus === status.APPROVED){

        if(leaveType.effectsTo =="Annual"){
            await _setDocumentField("users", leaveRequest.createdBy, "annualCredit", documentOwner.annualCredit - leaveRequest.duration).then(async response => {
                // console.log("Annual credit of user decreased : " + documentOwner.annualCredit - leaveRequest.duration);
                
            }).catch(error => {
                console.log("Error: ", error);
            })
        }
        else if (leaveType.effectsTo == "Excuse"){
            await _setDocumentField("users", leaveRequest.createdBy, "excuseCredit",documentOwner.excuseCredit - leaveRequest.duration).then(async response => {
                // console.log("Excuse credit of user decreased : " + documentOwner.annualCredit - leaveRequest.duration);

                leaveRequest = response;
            }).catch(error => {
                console.log("Error: ", error);
            })
        }


        else if (oldStatus === status.WAITING && newStatus === status.REJECTED) {
            console.log("Leave rejected")
            }

    }

    else if (oldStatus === status.APPROVED && newStatus === status.CANCELLED) {
        if (leaveType.effectsTo == "Annual") {
            await _setDocumentField("users", documentOwner.id, "annualCredit", documentOwner.annualCredit + leaveRequest.duration).then(async response => {
                // console.log("Annual credit of user increased : " + documentOwner.annualCredit + leaveRequest.duration);
            }).catch(error => {
                console.log("Error: ", error);
            })
        }
        else if (leaveType.effectsTo == "Excuse") {
            await _setDocumentField("users", documentOwner.id, "excuseCredit", documentOwner.excuseCredit + leaveRequest.duration).then(async response => {
                // console.log("Excuse credit of user increased : " + documentOwner.annualCredit + leaveRequest.duration);
            }).catch(error => {
                console.log("Error: ", error);
            })
        }
    }
    if(oldStatus === status.WAITING && newStatus ===status.CANCELLED){
        
    }

    sendMailtoUser();
    sendMailtoApprover();

    return true
})