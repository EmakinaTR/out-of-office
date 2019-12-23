export const statusBadges = {
  0: {
    badgeContent: "Waiting Approve",
    color: "#ffde7d"
  },
  1: {
    badgeContent: "Approved",
    color: "#8cc63f"
  },
  2: {
    badgeContent: "Rejected",
    color: "#ff7f41"
  },
  3: {
    badgeContent: "Cancelled",
    color: "#969696"
  }
};

export const leaveBadges = {
  0: {
    badgeContent: "Annual Leave",
    color: "#f2d6eb"
  },
  1: {
    badgeContent: "Compansate Leave",
    color: "#5c94bd"
  },
  2: {
    badgeContent: "Excuse Leave",
    color: "#1a3e59"
  },
  3: {
    badgeContent: "Other Leave",
    color: "#470938"
  },
  4: {
    badgeContent: "Remote Work",
    color: "#737373"
  }
};
export const getBadgeColor = (theme, type) => {
  const color = leaveBadges[type].color;
  console.log("Theme Color: ", theme.palette.primary[color]);
};
