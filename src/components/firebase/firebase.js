import app from "firebase";
import "firebase/auth";
import "firebase/database";
import { firebaseConfig } from "./config";

export default class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    /* Helper */
    this.fieldValue = app.firestore.FieldValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;
    /* Firebase APIs */
    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
    /* Google Provider */
    app.googleProvider = new app.auth.GoogleAuthProvider();
  }

 /* Auth API */
  doSignInWithGoogle = () => {
    return new Promise((resolve, reject) => {
      app
        .auth()
        .setPersistence(app.auth.Auth.Persistence.LOCAL)
        .then(() => {
          app
            .auth()
            .signInWithRedirect(app.googleProvider)
            .then(results => {
              window.currentUser = app.auth().currentUser;
              resolve(results);
            })
            .catch(error => {
              reject(error);
            });
        });
    });
  };

  //     doSignInWithGoogle = () => {return new Promise((resolve, reject) => {
  //         app.auth().signInWithRedirect(app.googleProvider)
  //             .then(results => {
  //               resolve(results);
  //         })
  //         }
  //     )
  // }

  doSignOut = () => app.auth.signOut();
  // *** User API ***

  // user = uid => this.db.doc(`users/${uid}`);
  users = () => this.db.collection("users");

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then(snapshot => {
            const dbUser = snapshot.data();

            // // default empty roles
            // if (!dbUser.roles) {
            //     dbUser.roles = {};
            // }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser
            };
            next(authUser);
          });
      } else {
        fallback();
      }
    });

  getAllLeaveTypes = () => {
    return this.db.collection("leaveType").get();
  };
  getSpecificLeaveType = (docReference) => {
    return this.db.doc(docReference).get();
  };

  getReferenceDocument (docRef){
    return this.db.doc(docRef);
  }
  getAllLeaveRequests = () => {
    return this.db.collection("leaveRequests").get();
  };

  getIncomingRequests = (user) => {
    return new Promise((resolve,reject) => {
      const getTeamLeaves = app.functions().httpsCallable('getTeamLeaves');
      getTeamLeaves({user:user}).then(result => {
        resolve(result.data);
        console.log(result)
      }).catch(error => {
        reject(error);
      })
    });   
  }
  getLeaveRequestDetail = (documentID) => {
    return new Promise((resolve,reject) => {
      const requestDetail = app.functions().httpsCallable('getLeaveRequestDetail');
      requestDetail({documentID :documentID}).then(result => {
        resolve(result.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  getLeaveRequestsWaitingToApprove = () => {
    return this.db.collection("leaveRequests").where("status", "==" ,"0").get();
  };

  setLeaveStatus = (documentID, newStatus) => {
    return this.db.collection("leaveRequests").doc(documentID).update({'status': newStatus});
  }
  sendNewLeaveRequest = leaveRequestObj => {
    this.db.collection("leaveRequests").add(leaveRequestObj);
  };

  getSpecificLeaveRequestWithId = (documentId) => {
    return this.db.collection("leaveRequests").doc(documentId).get();
  }

  convertMomentObjectToFirebaseTimestamp = (momentObj) => {
     return app.firestore.Timestamp.fromDate(momentObj);
  }

  convertUidToFirebaseRef = (uid) => {
      return this.db.collection('users').doc(uid);
  }

  convertLeaveTypeToFirebaseRef = (leaveType) => {
      return this.db.collection('leaveType').doc(leaveType);
  }
}
