import React,{useState}from 'react'
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
 

const countries=["Turkey","England","Germany","Netherland"];
export default function IncomingRequests(props) {
    const classes = useStyles();
    const [dataList, setDataList] = useState(incomingRequestData);
    const [searchQuery, setsearchQuery] = useState('');

    const onSearchQueryChange= (value) => {
        console.log(value);

        let filteredDataList = incomingRequestData;
        filteredDataList = filteredDataList.filter((data) => {
            return data.userName.toLowerCase().search(value.toLowerCase()) != -1 || data.description.toLowerCase().search(value.toLowerCase()) != -1;
        })
        setDataList(filteredDataList);
        console.log(filteredDataList);
        console.log(dataList);
    }

    
    return (
        
        <Container className={classes.contentContainer}  >
            <Box >
                <Grid container className={classes.headerContainer}>
                    <Grid item xs={12} lg={4}>
                        <Typography variant="h4" >Gelen Talepler</Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} >
                        <SearchFilter 
                            onChange={onSearchQueryChange}
                          >
                        </SearchFilter>
                    </Grid>
                    <Grid item xs={9} md={4} lg={3}>
                        <OrderByFilter></OrderByFilter>
                    </Grid>
                    <Grid item xs={3} md={2} lg={2}>
                        <Button variant="outlined" component="span">
                            <FilterListIcon></FilterListIcon>
                        </Button>
                    </Grid>
                </Grid>
                {dataList.map((data, index) => {
                    // var statusType = statusBadges.find(type => type.id == data.status)
                    // var leaveType = leaveBadges.find(type => type.id == data.leaveType)
                    return (
                        // <p>{data}</p>
                        <IncomingRequestCard
                            key={index}
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