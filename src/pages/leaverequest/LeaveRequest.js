import React from 'react'
import LeaveRequestForm from '../../components/UIElements/leaveRequestForm'
import { FirebaseContext } from '../../components/firebase';
export default function LeaveRequest() {
    return (
        <FirebaseContext.Consumer>
            {firebase => <LeaveRequestForm firebase  = {firebase} /> }
        </FirebaseContext.Consumer>
    )
}
