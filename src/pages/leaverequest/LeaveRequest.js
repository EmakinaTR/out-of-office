import React, { useContext, useEffect } from "react";
import LeaveRequestForm from '../../components/UIElements/leaveRequestForm';
import { FirebaseContext } from '../../components/firebase';
import AuthContext from "../../components/session";
export default function LeaveRequest() {
    const { readSession } = useContext(AuthContext);
    return (
        <FirebaseContext.Consumer>
            {firebase => <LeaveRequestForm firebase = { firebase } auth = { readSession } /> }
        </FirebaseContext.Consumer>
    )
}
