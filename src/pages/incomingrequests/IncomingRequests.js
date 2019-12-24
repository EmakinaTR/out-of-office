import React,{useState,useEffect}from 'react'
import { Container, Box, Typography, Grid, Button } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import { statusBadges, leaveBadges } from '../../constants/badgeTypes';
import IncomingRequestCard from '../../components/UIElements/incomingRequestCard';
import { incomingRequestData } from '../../constants/dummyData';
import SearchFilter from '../../components/UIElements/searchFilter/SearchFilter';
import OrderByFilter from '../../components/UIElements/orderByFilter';
import FilterListIcon from '@material-ui/icons/FilterList';
import { render } from '@testing-library/react';
import { FilterBox } from '../../components/UIElements/filterBox/FilterBox';

const useStyles = makeStyles(theme => ({
    contentContainer: {
        // padding:0
    },
    headerContainer: {
        //margin: theme.spacing(2)
    },
    listControls: {
        '& :first-child': {
            flexGrow: 1,
            [theme.breakpoints.up('lg')]: {
                flexGrow: 0
            },
         },
        justifyContent: "flex-start",
        [theme.breakpoints.up('lg')]: {
            justifyContent: "flex-end",
        },
        
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
    const [filterBoxState, setFilterBoxState] =useState();
    const onSearchQueryChange = (value) => {
        let filteredDataList = incomingRequestData;
        filteredDataList = filteredDataList.filter((data) => {
            return data.userName.toLowerCase().search(value.toLowerCase()) != -1 || data.description.toLowerCase().search(value.toLowerCase()) != -1;
        })
        setDataList(filteredDataList);
    }
    const onFilterDirectionChanged = (e) => {
        setIsDescending(isDescending => !isDescending)
    }
    
    const onFilterBoxClick =(filterBoxState)=>{
        setFilterBoxState({ ...filterBoxState });
    }
    const onSelectedFilterTypeChanged = (e) => {
        setSelectedFilterType(e.target.value);
    }

    const filterData = (data, filterBoxState) => {
        if (filterBoxState != undefined && filterBoxState.length != 0) {
            if (filterBoxState.leaveType != undefined && filterBoxState.leaveType != '') {
                data = data.filter((item) => {
                    console.log("leavetype")
                    return filterBoxState.leaveType == item.leaveType;
                })
                console.log(data)
            }
            if (filterBoxState.startDate != undefined ) {
                data = data.filter((item) => {
                    console.log("start")
                    return item.startDate >= filterBoxState.startDate;
                });
                console.log(data)

            }
            if (filterBoxState.endDate != undefined) {
                data = data.filter((item) => {
                    console.log("end")
                    return item.endDate <= filterBoxState.endDate;
                });
                console.log(data)

            }
        }
        setDataList([...data]);
    }
    const sortDataByTypeAscDesc = (isDescending,data,filterType) =>{
        
        data.sort(function (a, b) {
            if (isDescending) {
                return (b[filterType] > a[filterType]) ? 1 : ((b[filterType] < a[filterType]) ? -1 : 0);
            } else {
                return (a[filterType] > b[filterType]) ? 1 : ((a[filterType] < b[filterType]) ? -1 : 0);
            }
        });
        setDataList([...data]);
    }
    useEffect(() => {
        filterData(incomingRequestData,filterBoxState)
        sortDataByTypeAscDesc(isDescending, incomingRequestData, orderByFilterOptions[selectedFilterType].key);
    }, [selectedFilterType, isDescending, filterBoxState])
    
    return (
        <Container maxWidth="xl">
            <Box marginY={3}>
            <Box marginBottom={2}>
                <Grid container className={classes.headerContainer} alignItems="center">
                    <Grid item xs={12} lg={4}>
                    <Typography variant="h5" component="h2">Incoming Requests</Typography>
                    </Grid>
                    <Grid item xs={12} lg={8}>
                    
                    <Grid container alignItems="center" spacing={2} className={classes.listControls} wrap="nowrap">
                        <Grid item>
                        <SearchFilter 
                            onChange={onSearchQueryChange}
                          />
                        </Grid>
                        <Grid item>
                            <OrderByFilter
                                options={orderByFilterOptions}
                                onFilterDirectionChanged={onFilterDirectionChanged}
                                currentDirection={isDescending}
                                selectedFilterType={selectedFilterType}
                                onSelectedFilterTypeChanged={onSelectedFilterTypeChanged}
                                >
                                
                            </OrderByFilter>
                        </Grid>
                        <Grid item>
                                <FilterBox
                                onFilterBoxClick={onFilterBoxClick}
                                filterBoxState={filterBoxState}
                                >
                                </FilterBox>
                        </Grid>
                    </Grid>
                </Grid>
                </Grid>
                </Box>
                {dataList.map((data, index) => {
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