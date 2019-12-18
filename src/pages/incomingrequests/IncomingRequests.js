import React from 'react'
import { Container, Box, Typography, Grid } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import { statusBadges, leaveBadges } from '../../constants/badgeTypes';
import IncomingRequestCard from '../../components/UIElements/incomingRequestCard';
import { incomingRequestData } from '../../constants/dummyData';
 
const useStyles = makeStyles(theme => ({
 
    contentContainer: {
        padding: "0",
    },
    headerContainer: {
        margin: theme.spacing(2)
    }
}));
 
export default function IncomingRequests(props) {
    const classes = useStyles();
    return (
        <Container className={classes.contentContainer}  >
 
            <Box >
                <Grid className={classes.headerContainer}>
                    <Typography spa align="center" variant="h4" >Gelen Talepler</Typography>
                </Grid>
                {incomingRequestData.map((data, index) => {
                    // var statusType = statusBadges.find(type => type.id == data.status)
                    // var leaveType = leaveBadges.find(type => type.id == data.leaveType)
                    return (
                        <IncomingRequestCard
                            key={data.id}
                            userName={data.userName}
                            leaveTypeContent={leaveBadges.AnnualLeave.badgeContent}
                            leaveTypeColor={leaveBadges.AnnualLeave.color}
                            statusTypeContent={statusBadges.waiting.badgeContent}
                            statusTypeColor={statusBadges.waiting.color}
                            startDate={data.startDate}
                            endDate={data.endDate}
                            dayCount={data.dayCount}
                            description={data.description}
                        ></IncomingRequestCard>
                    )
                })}
            </Box>
        </Container>
    )
}