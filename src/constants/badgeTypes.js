import { withStyles } from "@material-ui/core/styles";
 
export const statusBadges = {
    waiting : {
        id:0,
        badgeContent : "Onay Bekliyor",
        color: "#ffde7d",        
    },
    approved : {
        id:1,
        badgeContent: "Onaylandı",
        color: "#8cc63f",
    },
    rejected : {
        id:2,
        badgeContent: "Red edildi",
        color: "#ff7f41"
    },
    cancelled : {
        id:3,
        badgeContent: "Cancelled",
        color: "#969696"
    }
}
 
export const leaveBadges = {
    AnnualLeave: {
        badgeContent: "Yıllık İzin",
        color: "#f2d6eb"
    },
    CompansateLeave: {
        badgeContent: "Sonradan Çalışma",
        color: "#5c94bd"
    },
    ExcuseLeave: {
        badgeContent: "Mazeret İzni",
        color: "#1a3e59"
    },
    OtherLeave:{
        badgeContent: "Diğer",
        color: "#470938"
    },
    RemoteWork: {
        badgeContent: "Uzaktan Çalışma",
        color: "#737373"
    }
}