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
 
const orderByFilterOptions = {
    0: {
        key:'startDate',
        name:'Start Date'
    },
    1: {
        key: 'endDate',
        name: 'End Date'
    },
    2: {
        key: 'userName',
        name: 'Name'
    },
    3: {
        key: 'dayCount',
        name: 'Day Count'
    },
};

export default function IncomingRequests(props) {
    const classes = useStyles();
    const [dataList, setDataList] = useState(incomingRequestData);
    const [searchQuery, setsearchQuery] = useState('');
    const [isDescending, setIsDescending] = useState(true); // 0 is down direction - 1 is up direction
    const [selectedFilterType, setSelectedFilterType] = useState(0);
    const onSearchQueryChange= (value) => {
        let filteredDataList = incomingRequestData;
        filteredDataList = filteredDataList.filter((data) => {
            return data.userName.toLowerCase().search(value.toLowerCase()) != -1 || data.description.toLowerCase().search(value.toLowerCase()) != -1;
        })
        setDataList(filteredDataList);
    }
    const onFilterDirectionChanged = (e) => {
        setIsDescending(!isDescending);
        sortDataByTypeAscDesc(isDescending, dataList, orderByFilterOptions[selectedFilterType].key)
      
    }

    const onSelectedFilterTypeChanged=(e)=> {
        setSelectedFilterType(e.target.value);
        sortDataByTypeAscDesc(isDescending, dataList, orderByFilterOptions[selectedFilterType].key)
    }
    const sortDataByTypeAscDesc = (isDescending,data,filterType) =>{
        data.sort(function (a, b) {
            if (isDescending) {
                return (a[filterType] > b[filterType]) ? 1 : ((a[filterType] < b[filterType]) ? -1 : 0);
                
            } else {
                return (b[filterType] > a[filterType]) ? 1 : ((b[filterType] < a[filterType]) ? -1 : 0);
            }
        });
        // setDataList(data);
    }
    
    
    return (
   
        <Container className={classes.contentContainer}  >
            <Box >
                <Grid container className={classes.headerContainer}>
                    <Grid item xs={12} lg={4}>
                        <Typography variant="h4" >Incoming Requests</Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} >
                        <SearchFilter 
                            onChange={onSearchQueryChange}
                          >
                        </SearchFilter>
                    </Grid>
                    <Grid item xs={9} md={4} lg={3}>
                        <OrderByFilter
                            options={orderByFilterOptions}
                            onFilterDirectionChanged={onFilterDirectionChanged}
                            currentDirection={isDescending}
                            selectedFilterType={selectedFilterType}
                            onSelectedFilterTypeChanged={onSelectedFilterTypeChanged}
                            >
                            
                        </OrderByFilter>
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
                    console.log(leaveBadges.id);
                    if(data.status == 0)
                    return (
                        // <p>{data}</p>
                        <IncomingRequestCard
                            key={index}
                            userName={data.userName}
                            leaveTypeContent={leaveBadges[data.leaveType].badgeContent}
                            leaveTypeColor={leaveBadges[data.leaveType].color}
                            statusTypeContent={statusBadges[data.status].badgeContent}
                            statusTypeColor={statusBadges[data.status].color}
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