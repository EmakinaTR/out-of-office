export const ROLE = {
    USER: 0,
    APPROVER:5,
    ADMIN: 10,
  }

export const getUserRole = (user) => {
   if(user) {
    if(user.isAdmin) {
        return ROLE.ADMIN;
    } else if(user.isApprover) {
        return ROLE.APPROVER;
    } else {
        return ROLE.USER;
    }
   }
}

