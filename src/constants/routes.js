import React from "react";
import Reports from "../pages/reports";
import LeaveRequest from "../pages/leaverequest";
import Dashboard from "../pages/dashboard";
import MyRequests from "../pages/myrequests";
import IncomingRequests from "../pages/incomingrequests";


const protectedRoutes = [
    { 
        name: "Dashboard",
        path: "/dashboard",
        exact: true, 
        main: () => <Dashboard />,
        public: false,
    },
    { 
        name:
        "Reports",
        path: "/reports",
        exact: true,
        main: props => <Reports {...props}/>,
        public: false,

        },
    { 
        name: "LeaveRequest",
        path: "/leaverequest",
        exact: true, 
        main: props => <LeaveRequest {...props}/>,
        public: false,
    },
    { 
        name: "Myrequests",
        path: "/myrequests",
        exact: true,
        main: props=> <MyRequests {...props}/> ,
        public: false,

    },
    {
        name: "IncomingRequests",
        path: "/incoming-requests",
        exact: true,
        main: props => <IncomingRequests {...props}/>,
        public: false,

    }
];

export default protectedRoutes;
