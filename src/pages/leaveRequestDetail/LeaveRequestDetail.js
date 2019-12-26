import React, {useContext} from 'react';
import LeaveRequestDetailForm from '../../components/UIElements/leaveRequestDetailForm';
import { FirebaseContext } from '../../components/firebase';
import AuthContext from "../../components/session";

export default function RequestDetail() {
    const { readSession } = useContext(AuthContext);
    return (
        <FirebaseContext.Consumer>
            {firebase => <LeaveRequestDetailForm firebase = { firebase } auth = { readSession } /> }
        </FirebaseContext.Consumer>
    )
}