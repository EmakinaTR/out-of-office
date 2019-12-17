import React from "react";
import Reports from "../pages/reports";
import LeaveRequest from "../pages/leaverequest";
import Dashboard from "../pages/dashboard";
import MyRequests from "../pages/myrequests";
import IncomingRequests from "../pages/incomingrequests";
import InboxIcon from '@material-ui/icons/MoveToInbox';

const protectedRoutes = [
    { 
        name: "Dashboard",
        path: "/dashboard",
        exact: true, 
        main: () => <Dashboard />,
        public: false,
        icon: <InboxIcon />
    },
    { 
        name:
        "Reports",
        path: "/reports",
        exact: true,
        main: props => <Reports {...props}/>,
        public: false,
        icon: <InboxIcon />
        },
    { 
        name: "LeaveRequest",
        path: "/leaverequest",
        exact: true, 
        main: props => <LeaveRequest {...props}/>,
        public: false,
        icon: <InboxIcon />
    },
    { 
        name: "Myrequests",
        path: "/myrequests",
        exact: true,
        main: props=> <MyRequests {...props}/> ,
        public: false,
        icon: <InboxIcon />

    },
    {
        name: "IncomingRequests",
        path: "/incoming-requests",
        exact: true,
        main: props => <IncomingRequests {...props}/>,
        public: false,
        icon: <InboxIcon />

    }
];

export default protectedRoutes;
