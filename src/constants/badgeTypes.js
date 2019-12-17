import { withStyles } from "@material-ui/core/styles";

export const statusBadges = {
    waiting : {
        badgeContent : "Onay Bekliyor",
        color: "#ffec45",        
    },
    approved : {
        badgeContent: "Onaylandı",
        color: "#0be300",
    },
    rejected: {
        badgeContent: "Red edildi",
        color: "#e34000"
    },
    cancelled:{
        badgeContent: "Cancelled",
        color: "#737373"
    }
}

export const leaveBadges = {
    AnnualLeave: {
        badgeContent: "Yıllık İzin",
        color: "#ffec45"
    },
    CompansateLeave: {
        badgeContent: "Onaylandı",
        color: "#0be300"
    },
    ExcuseLeave: {
        badgeContent: "Red edildi",
        color: "#e34000"
    },
    OtherLeave:{
        badgeContent: "Cancelled",
        color: "#737373"
    },
    RemoteWork: {
        badgeContent: "Cancelled",
        color: "#737373"
    }
} 