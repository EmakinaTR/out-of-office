import React, { useContext } from "react";
import protectedRoutes from "../../constants/routes";
import { Link } from "react-router-dom";
import AuthContext  from "../session";
import SignIn from "../../pages/signin";
import {FirebaseContext} from '../../components/firebase'

const Navigation = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const firebase = useContext(FirebaseContext);
  const signOut = () => {
    firebase.auth.signOut();
  }
  return (
    <ul>
      <li><button onClick={() => signOut()}>sign out</button></li>
      {isLoggedIn ? 
        (
        protectedRoutes.map((route, i) => (
          <li key={i}>
            <Link to={route.path}>{route.name}</Link>
          </li>
        )))
      : 
        <li><Link to="/" ><SignIn></SignIn></Link></li>
      }
    </ul>
  )
}


export default Navigation;
