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
            setErrors(error)
        });
    }
    const styles = {
        position :"absolute",
        top :"50%",
        left : "50%",
        transform: "translate(-50%,-50%)",
    }
    return (
        <div style ={{position :'relative', marginTop : '100px', width: '100%',height:'400px'}}>
            <h1 style={{margin:'auto', textAlign:'center'}}>SignIn</h1>
            <button style={styles} onClick={signInWithGoogle}  type="button">
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
