import React from "react";
import Reports from "../pages/reports";
import LeaveRequest from "../pages/leaverequest";
import Dashboard from "../pages/dashboard";
import MyRequests from "../pages/myrequests";
import IncomingRequests from "../pages/incomingrequests";
import LeaveRequestDetail from "../pages/leaveRequestDetail";
import LeaveRequestEdit from "../pages/leaveRequestEdit";
import { ROLE } from "./roles";



const protectedRoutes = [
  {
    name: "Dashboard",
    path: "/dashboard",
    exact: true,
    main: () => <Dashboard />,
    public: false,
    icon: "dashboard",
    level: ROLE.USER       
  },
  {
    name: "New Leave Request",
    path: "/leaverequest",
    exact: true,
    main: props => <LeaveRequest {...props} />,
    public: false,
    icon: "post_add",
    level: ROLE.USER       
  },
  {
    name: "My Requests",
    path: "/myrequests",
    exact: false,
    main: props => <MyRequests {...props} />,
    public: false,
    icon: "date_range",
    level: ROLE.USER       
  },
  {
    name: "Incoming Requests",
    path: "/incoming-requests",
    exact: true,
    main: props => <IncomingRequests {...props} />,
    public: false,
    icon: "event_available",
    level: ROLE.APPROVER       
  },
  {
    name: "Reports",
    path: "/reports",
    exact: true,
    main: props => <Reports {...props} />,
    public: false,
    icon: "insert_chart_outlined",
    level: ROLE.ADMIN
  },
  {
    path: "/request-detail",
    exact: true,
    main: props => <LeaveRequestDetail {...props} />,
    level: ROLE.APPROVER
  },
  {
    path: "/request-edit",
    exact: true,
    main: props => <LeaveRequestEdit {...props} />,
    level: ROLE.APPROVER
  },
  // Default Route; Sets unless none of the pathes are given
  {
    path: "**",
    exact: true,
    main: () => <Dashboard />,
    icon: "dashboard",
    level: ROLE.USER
    
  }
];

export default protectedRoutes;
