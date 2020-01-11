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
              const currentUser = app.auth().currentUser;
              window.currentUser = currentUser;
              resolve(currentUser);
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

  getCurrentUser = uid => this.db.doc(`users/${uid}`).get();

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
  getSpecificLeaveType = docReference => {
    return this.db.doc(docReference).get();
  };

  getReferenceDocument(docRef) {
    return this.db.doc(docRef);
  }
  getAllLeaveRequests = () => {
    return this.db.collection("leaveRequests").get();
  };

  getIncomingRequests = (queryData) => {
    // console.log(queryData)
    return new Promise((resolve, reject) => {
      const getTeamLeaves = app.functions().httpsCallable("getTeamLeaves");
      getTeamLeaves({queryData: queryData})
        .then(result => {               
          resolve(result.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  getLeaveRequestDetail = documentID => {
    return new Promise((resolve, reject) => {
      const requestDetail = app
        .functions()
        .httpsCallable("getLeaveRequestDetail");
      requestDetail({ documentID: documentID })
        .then(result => {
          resolve(result.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  // getMyRequests = (count = 20) => {
  //   return new Promise((resolve, reject) => {
  //     const getMyRequests = app.functions().httpsCallable("getMyRequests");
  //     getMyRequests({ count: count })
  //       .then(result => {
  //         resolve(result.data);
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // };

  setLeaveStatus = (documentID, newStatus, description) => {
    return new Promise((resolve, reject) => {
      const changeLeaveStatus = app
        .functions()
        .httpsCallable("changeLeaveStatus");
      changeLeaveStatus({ documentID: documentID, newStatus: newStatus, processerDescription : description })
        .then(result => {
          resolve(result.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  sendNewLeaveRequest = leaveRequestObj => {
    return new Promise((resolve,reject) => {
      this.db.collection("leaveRequests").add(leaveRequestObj).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      })
    });  
  };

  updateLeaveRequest = (uid, leaveRequestObj) => {
    return new Promise((resolve, reject) => {
      this.db.collection("leaveRequests").doc(uid).update(leaveRequestObj).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      })
    });
  }
 
  getSpecificLeaveRequestWithId = (documentId) => {
    return this.db.collection("leaveRequests").doc(documentId).get();
  }

  getLeaveTypeOfGivenReference = ref => {
    return this.db.doc(ref).get();
  };

  convertMomentObjectToFirebaseTimestamp = momentObj => {
    return app.firestore.Timestamp.fromDate(momentObj);
  };

  // convertFirebaseTimestampToMomentObject = timeStamp => {
  //   return timeStamp.toDate(timeStamp);
  // };

  convertUidToFirebaseRef = uid => {
    return this.db.collection("users").doc(uid);
  };

  convertLeaveTypeToFirebaseRef = leaveType => {
    return this.db.collection("leaveType").doc(leaveType);
  };

  // Approvers
  getApproversWithId = (uid) => {
    const teamsRef = this.db.collection('teams');
    const userSearch = teamsRef.where('members', 'array-contains', uid).get();
    const management = teamsRef.doc('MANAGEMENT').get();
    return [userSearch, management];
  }

  searchApprovers = (uid) => {
    const usersRef = this.db.collection('users');
    return usersRef.doc(uid).get();
  }



  getMyRequests = (queryData) => {  
  
    const collectionRef = this.db.collection("leaveRequests");
    return this._createQuery(collectionRef, queryData);
  };
  
  listenForRequests = (queryData) => {
    // return new Promise((resolve, reject) => {
    var collectionRef = this.db.collection("leaveRequests");
    let query;
      let changedDocs = [];
    if (queryData.lastDocument != "end") {
      if (queryData.filterArray && queryData.filterArray.length > 0) {
        for (const filter of queryData.filterArray) {
          collectionRef = collectionRef.where(
            filter.fieldPath,
            filter.condition,
            filter.value
          );
        }
      }
      query = collectionRef;
      if (queryData.orderBy && queryData.orderBy.type && queryData.orderBy.fieldPath) {
        query = query.orderBy(
          queryData.orderBy.fieldPath,
          queryData.orderBy.type
        );
      }
      if (queryData.lastDocument) {
        query = query.startAfter(queryData.lastDocument)
      }
      if (queryData.pageSize) {
        query = query.limit(queryData.pageSize);
      }

      query.onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
      
        changes.forEach(change => {
          if(change.type == "modified"){
            console.log(change.doc.data())
            changedDocs.push(change.doc.data());
          }
        })
        
      });

    }
      return changedDocs;
  // })

  }
  _createQuery = (collectionRef, queryData) => {
    {     
      return new Promise((resolve, reject) => {
        if(queryData.lastDocument != "end"){
          let query;
          if(queryData.filterArray && queryData.filterArray.length > 0) {
            for (const filter of queryData.filterArray) {
              collectionRef = collectionRef.where(
                filter.fieldPath,
                filter.condition,
                filter.value
              );
            }
          }       
          query = collectionRef;
          if (
            (queryData.orderBy && queryData.orderBy.type &&
            queryData.orderBy.fieldPath)
          ) {
            query = query.orderBy(
              queryData.orderBy.fieldPath,
              queryData.orderBy.type
            );
          }
          if (queryData.lastDocument) {
            query = query.startAfter(queryData.lastDocument)
          }
          if (queryData.pageSize) {
            query = query.limit(queryData.pageSize);
          }
          query.get().then( async querySnapshot => {
            const dataArray = [];
            // console.log(querySnapshot)     
            for(const doc of querySnapshot.docs) {
              const leaveDoc = doc.data();
              leaveDoc.id = doc.id;
              await this.getSpecificLeaveType(doc.data().leaveTypeRef.path).then(documentSnapShot => {
                leaveDoc.leaveType = documentSnapShot.data();
              })
              dataArray.push(leaveDoc);
            }
            resolve({data: dataArray, size: querySnapshot.size,lastDocument: querySnapshot.docs[querySnapshot.size - 1]});
          });
      }
    });
    }
  };
}

