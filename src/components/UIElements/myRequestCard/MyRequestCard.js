import React from 'react';
import { Paper, Avatar, Grid, Typography, Fab, Hidden } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import CustomBadge from '../customBadge/CustomBadge';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DateFull from '../date/DateFull';
const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(1),
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(2),
        display: "flex",
        alignItems: "center",

        [theme.breakpoints.up("sm")]: {
            padding: theme.spacing(2),
        },
        [theme.breakpoints.up("lg")]: {
            padding: theme.spacing(3),
        },
    },
    leftContent: {
        display: 'flex',
        alignItems: 'center',

    },
    middleContent: {
        display: "flex",
        alignItems: "center",

    },
    rightContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        [theme.breakpoints.up("lg")]: {
            justifyContent: 'center',
        },
    },
    userInfoInner: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        textAlign: 'left',
        [theme.breakpoints.up("md")]: {
            alignItems: "center",
        }

    },
    avatarImage: {
        display: "none",
        margin: "auto",
        marginBottom: '8px',
        [theme.breakpoints.up("md")]: {
            display: "flex",
        }

    },
    userName: {
        fontWeight: 'bold',
        [theme.breakpoints.up("md")]: {
            justifyContent: 'center',
            marginLeft: theme.spacing(0),
            fontWeight: 'bold',
        }
    },

    moreButton: {
        backgroundColor: 'transparent',


    },
    badgeContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: theme.spacing(1),
        [theme.breakpoints.up("xl")]: {
            marginBottom: theme.spacing(0),
            justifyContent: 'center',
        }
    },
    leavePeriod: {
        textAlign: 'left',
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        [theme.breakpoints.up("md")]: {
            textAlign: 'center',
        }
    },
    description: {
        overflow: "hidden",

    },

}));
export const MyRequestCard = (props) => {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Grid container>
                <Grid item xs={10} md={11} className={classes.middleContent} >
                    <Grid container>
                        <Grid item xs={12} md={6} >
                            <Grid container className={classes.leavePeriod}  >
                                <DateFull className={classes.dateFull}
                                    startDate={props.startDate}
                                    endDate={props.endDate}
                                >
                                </DateFull>
                            </Grid>
                        </Grid>
                        <Grid item className={classes.badgeContainer} xs={5} sm={4} md={2} md={2}>
                            <CustomBadge backgroundColor={props.statusTypeColor}> {props.statusTypeContent}</CustomBadge>
                        </Grid>
                        <Grid item className={classes.badgeContainer} xs={3} sm={4} md={2} md={2}>
                            <CustomBadge backgroundColor="blue" >{props.dayCount + " gün"}</CustomBadge>
                        </Grid>
                        <Grid item align className={classes.badgeContainer} xs={4} sm={4} md={2}>
                            <CustomBadge backgroundColor={props.leaveTypeColor}>{props.leaveTypeContent}</CustomBadge>
                        </Grid>
                        <Grid xs={12}>
                            <Typography noWrap className={classes.description}>{props.description}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item item xs={2} md={1} justifyContent="center" className={classes.rightContent} >
                    <Fab className={classes.moreButton} size="small" >
                        <MoreVertIcon></MoreVertIcon>
                    </Fab>
                </Grid>
            </Grid>

        </Paper>
    );
}


