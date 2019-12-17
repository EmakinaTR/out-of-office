import React from 'react'
import { Paper,Container, Avatar, Grid, Typography, Badge,Fab } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import CustomBadge from '../../components/UIElements/customBadge/CustomBadge';
import {statusBadges,leaveBadges} from '../../constants/badgeTypes';
import DateCalendar from '../../components/UIElements/date/DateCalendar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DateFull from '../../components/UIElements/date/DateFull';

const useStyles = makeStyles(theme => ({

    contentContainer:{
        // backgroundColor:'red'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginBottom:'24px'
    },
    userInfo :{
        display : 'flex',
        flexDirection:'column',
        justifyContent : 'center',
        alignItems:'center'
    },
    userName:{
        marginTop : '10px'
    },
    leavePeriod :{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    moreButton:{
        backgroundColor:'transparent'
    }
}));
export default function IncomingRequests(props) {
    const classes = useStyles();
    return (
        <Container className={classes.contentContainer} container >
            <Paper>
                <Grid >
                    <Grid item lg={12}>
                        <Paper className={classes.paper}>
                            <Grid container>
                                <Grid className={classes.userInfo} item lg={1}>
                                    <Avatar>İ</Avatar>
                                    <Typography className ={classes.userName}>İlker Ünal</Typography>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={4}>
                                    <DateFull ></DateFull>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor="blue" >1.5 Gün</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor={leaveBadges.AnnualLeave.color} > {leaveBadges.AnnualLeave.badgeContent}</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor={statusBadges.approved.color}> {statusBadges.approved.badgeContent}</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={1}>
                                    <Fab className={classes.moreButton} size="small" >
                                        <MoreVertIcon></MoreVertIcon>
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Grid container>
                                <Grid className={classes.userInfo} item lg={1}>
                                    <Avatar>İ</Avatar>
                                    <Typography className ={classes.userName}>İlker Ünal</Typography>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={4}>
                                    <DateFull ></DateFull>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor="red" >1.5 Gün</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor={leaveBadges.AnnualLeave.color} > {leaveBadges.AnnualLeave.badgeContent}</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor={statusBadges.approved.color}> {statusBadges.approved.badgeContent}</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={1}>
                                    <Fab className={classes.moreButton} size="small" >
                                        <MoreVertIcon></MoreVertIcon>
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Grid container>
                                <Grid className={classes.userInfo} item lg={1}>
                                    <Avatar>İ</Avatar>
                                    <Typography className ={classes.userName}>İlker Ünal</Typography>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={4}>
                                    <DateFull ></DateFull>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor="red" >1.5 Gün</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor={leaveBadges.AnnualLeave.color} > {leaveBadges.AnnualLeave.badgeContent}</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor={statusBadges.approved.color}> {statusBadges.approved.badgeContent}</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={1}>
                                    <Fab className={classes.moreButton} size="small" >
                                        <MoreVertIcon></MoreVertIcon>
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Grid container>
                                <Grid className={classes.userInfo} item lg={1}>
                                    <Avatar>İ</Avatar>
                                    <Typography className ={classes.userName}>İlker Ünal</Typography>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={4}>
                                    <DateFull ></DateFull>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor="red" >1.5 Gün</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor={leaveBadges.AnnualLeave.color} > {leaveBadges.AnnualLeave.badgeContent}</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor={statusBadges.approved.color}> {statusBadges.approved.badgeContent}</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={1}>
                                    <Fab className={classes.moreButton} size="small" >
                                        <MoreVertIcon></MoreVertIcon>
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Grid container>
                                <Grid className={classes.userInfo} item lg={1}>
                                    <Avatar>İ</Avatar>
                                    <Typography className ={classes.userName}>İlker Ünal</Typography>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={4}>
                                    <DateFull ></DateFull>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor="red" >1.5 Gün</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor={leaveBadges.AnnualLeave.color} > {leaveBadges.AnnualLeave.badgeContent}</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={2}>
                                    <CustomBadge backgroundColor={statusBadges.approved.color}> {statusBadges.approved.badgeContent}</CustomBadge>
                                </Grid>
                                <Grid className={classes.leavePeriod} item lg={1}>
                                    <Fab className={classes.moreButton} size="small" >
                                        <MoreVertIcon></MoreVertIcon>
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}