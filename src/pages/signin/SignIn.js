import React, { useState, useContext } from "react";
import AuthContext from '../../components/session';
import {FirebaseContext} from '../../components/firebase'

const SignIn = (props) => {
    const [error, setErrors] = useState("");
    const Auth = useContext(AuthContext);
    const firebase = useContext(FirebaseContext);

    const signInWithGoogle = () =>{
        firebase.doSignInWithGoogle().then((result)=>{
            Auth.setLoggedIn(true);
        });
    }
          
    // const signInWithGoogle = () => {
    //     const provider = new firebase.auth.GoogleAuthProvider();
    //     firebase
    //         .auth()
    //         .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    //         .then(() => {
    //             firebase
    //                 .auth()
    //                 .signInWithPopup(provider)
    //                 .then(result => {
    //                     console.log(result)
    //                     history.push('/reports')
    //                     Auth.setLoggedIn(true)
    //                 })
    //                 .catch(e => setErrors(e.message))
    //         })

    // }
   
    return (
        <div>
            <h1>SignIn</h1>
            <button onClick={signInWithGoogle}  type="button">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        alt="logo"
                    />
                    SignIn With Google
            </button>
            
            <span>{error}</span>
        </div>
    );
};

export default SignIn;
