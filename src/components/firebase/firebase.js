import app from 'firebase'
import 'firebase/auth'
import 'firebase/database'
import { firebaseConfig } from './config';

export default class Firebase {

    constructor() {
        app.initializeApp(firebaseConfig);
        /* Helper */
        this.fieldValue = app.firestore.FieldValue;
        this.emailAuthProvider = app.auth.EmailAuthProvider;
        /* Firebase APIs */
        this.auth = app.auth();
        this.db = app.firestore();
        /* Google Provider */
        app.googleProvider = new app.auth.GoogleAuthProvider();
    }
    
        /* Auth API */
    doSignInWithGoogle =() =>{ return new Promise((resolve,reject) => {
        app.auth().setPersistence(app.auth.Auth.Persistence.SESSION).then (() => {
            app.auth().signInWithPopup(app.googleProvider).then( results => {
             resolve(results);
            })
            .catch(error => {
                reject(error);
            });
        })
    })
    } 

    // doSignInWithGoogle = () => {return new Promise((resolve, reject) => {
    //     app.auth().signInWithRedirect(app.googleProvider)
    //         .then(results => {
    //           resolve(results);
    //     })
    //     }
    // )
// }
    

    doSignOut = () =>  app.auth.signOut();
    // *** User API ***

    user = uid => this.db.doc(`users/${uid}`);
    users = () => this.db.collection('users');

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
                            ...dbUser,
                        };

                        next(authUser);
                    });
            } else {
                fallback();
            }
    });

    
    getAllLeaveTypes = () => {
        return this.db.collection('leaveType').get();
    }

    sendNewLeaveRequest = (leaveRequestObj) => {
        this.db.collection('leaveRequests').add(leaveRequestObj);
    }
}