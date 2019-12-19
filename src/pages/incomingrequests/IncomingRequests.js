import React from 'react'
import { Container, Box, Typography, Grid, Button } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import { statusBadges, leaveBadges } from '../../constants/badgeTypes';
import IncomingRequestCard from '../../components/UIElements/incomingRequestCard';
import { incomingRequestData } from '../../constants/dummyData';
import SearchFilter from '../../components/UIElements/searchFilter/SearchFilter';
import OrderByFilter from '../../components/UIElements/orderByFilter';
import FilterListIcon from '@material-ui/icons/FilterList';
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
                <Grid container className={classes.headerContainer}>
                    <Grid item xs={4}>
                        <Typography variant="h4" >Gelen Talepler</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <SearchFilter></SearchFilter>
                    </Grid>
                    <Grid item xs={3}>
                        <OrderByFilter></OrderByFilter>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" component="span">
                            <FilterListIcon></FilterListIcon>
                        </Button>
                    </Grid>
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