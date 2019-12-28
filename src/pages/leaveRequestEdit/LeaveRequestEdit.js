import React, {useContext} from 'react';
import LeaveRequestEditForm from '../../components/UIElements/leaveRequestEditForm';
import { FirebaseContext } from '../../components/firebase';
import AuthContext from "../../components/session";

export default function RequestDetail() {
    const { readSession } = useContext(AuthContext);
    return (
        <FirebaseContext.Consumer>
            {firebase => <LeaveRequestEditForm firebase = { firebase } auth = { readSession } /> }
        </FirebaseContext.Consumer>
    )
}
