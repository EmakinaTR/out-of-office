import React,{useState,useEffect} from 'react'
import { Container, Box, Typography, Grid,Button } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import { statusBadges, leaveBadges } from '../../constants/badgeTypes';
import MyRequestsCard from '../../components/UIElements/myRequestCard';
import { incomingRequestData } from '../../constants/dummyData';
import SearchFilter from '../../components/UIElements/searchFilter/SearchFilter';
import OrderByFilter from '../../components/UIElements/orderByFilter';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FilterBox } from '../../components/UIElements/filterBox/FilterBox';

const useStyles = makeStyles(theme => ({
    contentContainer: {
        padding:0
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
        key: 'startDate',
        name: 'Start Date'
    },
    1: {
        key: 'endDate',
        name: 'End Date'
    },
    2: {
        key: 'dayCount',
        name: 'Day Count'
    },
};
function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}
export default function MyRequests(props) {
    const [dataList, setDataList] = useState(incomingRequestData);
    const [searchQuery, setsearchQuery] = useState('');
    const [isDescending, setIsDescending] = useState(true); // 0 is down direction - 1 is up direction
    const [selectedFilterType, setSelectedFilterType] = useState(0);
    const classes = useStyles();
    const [filterBoxState, setFilterBoxState] =useState();
    const onFilterBoxClick = (filterBoxState) => {
        setFilterBoxState({ ...filterBoxState });
    }
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

    const onSelectedFilterTypeChanged = (e) => {
        setSelectedFilterType(e.target.value);
    }
    const sortDataByTypeAscDesc = (filterBoxState, isDescending, data, filterType) => {
        if (filterBoxState != undefined && filterBoxState.length != 0) {
            data = data.filter((item) => {
                return item.startDate >= filterBoxState.startDate &&
                    item.endDate <= filterBoxState.endDate;
            });
        }
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
        sortDataByTypeAscDesc(filterBoxState, isDescending, incomingRequestData, orderByFilterOptions[selectedFilterType].key);
    }, [selectedFilterType, isDescending, filterBoxState])
    return (
        <Container className={classes.contentContainer}  >

            <Box marginBottom={2}>
                <Grid container className={classes.headerContainer}  alignItems="center">
                    <Grid item xs={12} lg={4}>
                    <Typography variant="h5" component="h2">My Requests</Typography>
                      
                    </Grid>
                    <Grid item xs={12} lg={8} >
                        <Grid container alignItems="center" spacing={2} className={classes.listControls} wrap="nowrap">
                        <Grid item>
                        <SearchFilter
                            onChange={onSearchQueryChange}
                        >
                        </SearchFilter>
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
                        </FilterBox></Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </Box>
                {dataList.map((data, index) => {
                    // var statusType = statusBadges.find(type => type.id == data.status)
                    // var leaveType = leaveBadges.find(type => type.id == data.leaveType)
                    return (
                        <MyRequestsCard
                            key={data.id}
                            userName={data.userName}
                            leaveTypeContent={leaveBadges[data.leaveType].badgeContent}
                            leaveTypeColor={leaveBadges[data.leaveType].color}
                            statusTypeContent={statusBadges[data.status].badgeContent}
                            statusTypeColor={statusBadges[data.status].color}
                            startDate={data.startDate}
                            endDate={data.endDate}
                            dayCount={data.dayCount}
                            description={data.description}
                        ></MyRequestsCard>
                    )
                })}
            
        </Container>
    )
}