import React from "react";
import Reports from "../pages/reports";
import LeaveRequest from "../pages/leaverequest";
import Dashboard from "../pages/dashboard";
import MyRequests from "../pages/myrequests";
import IncomingRequests from "../pages/incomingrequests";
import LeaveRequestDetail from "../pages/leaveRequestDetail";

const protectedRoutes = [
  {
    name: "Dashboard",
    path: "/dashboard",
    exact: true,
    main: () => <Dashboard />,
    public: false,
    icon: "dashboard"
  },
  {
    name: "Leave Request",
    path: "/leaverequest",
    exact: true,
    main: props => <LeaveRequest {...props} />,
    public: false,
    icon: "post_add"
  },
  {
    name: "My Requests",
    path: "/myrequests",
    exact: true,
    main: props => <MyRequests {...props} />,
    public: false,
    icon: "date_range"
  },
  {
    name: "Incoming Requests",
    path: "/incoming-requests",
    exact: true,
    main: props => <IncomingRequests {...props} />,
    public: false,
    icon: "event_available"
  },
  {
    name: "Reports",
    path: "/reports",
    exact: true,
    main: props => <Reports {...props} />,
    public: false,
    icon: "insert_chart_outlined"
  },
  {
    // Name property will be removed, it is needed for test
    name: "Request Detail",
    path: "/request-detail",
    exact: true,
    main: props => <LeaveRequestDetail {...props} />,
    
  },
  // Default Route; Sets unless none of the pathes are given
  {
    path: "**",
    exact: true,
    main: () => <Dashboard />,
    public: false,
    icon: "dashboard"
  }
];

export default protectedRoutes;
