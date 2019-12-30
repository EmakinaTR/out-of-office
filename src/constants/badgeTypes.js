export const statusBadges = {
  0: {
    badgeContent: "Pending",
    color: "#F5E299"
  },
  1: {
    badgeContent: "Approved",
    color: "#d4ffb1"
  },
  2: {
    badgeContent: "Rejected",
    color: "#ffcbcd"
  },
  3: {
    badgeContent: "Cancelled",
    color: "#eeeeee"
  }
};

export const leaveBadges = {
  0: {
    badgeContent: "Annual Leave",
    color: "#008CCC"
  },
  1: {
    badgeContent: "Compansate Leave",
    color: "#02C802"
  },
  2: {
    badgeContent: "Excuse Leave",
    color: "#FF9C00"
  },
  3: {
    badgeContent: "Marriage",
    color: "#FE1492"
  },
  4: {
    badgeContent: "Other Leave",
    color: "#9C6137"
  },
   5: {
    badgeContent: "Parental",
    color: "#7529E1"
  },
  6: {
    badgeContent: "Remote Working",
    color: "#02C802"
  },
  7: {
    badgeContent: "Unpaid Vacation",
    color: "#00CFD2"
  }
};
export const getBadgeColor = (theme, type) => {
  const color = leaveBadges[type].color;
  // console.log("Theme Color: ", theme.palette.primary[color]);
};
