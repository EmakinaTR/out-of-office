import React,{useState,useEffect,useContext} from 'react'
import { Container, Box, Typography, Grid,Button } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import { statusBadges, leaveBadges } from '../../constants/badgeTypes';
import MyRequestsCard from '../../components/UIElements/myRequestCard';
import SearchFilter from '../../components/UIElements/searchFilter/SearchFilter';
import OrderByFilter from '../../components/UIElements/orderByFilter';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FilterBox } from '../../components/UIElements/filterBox/FilterBox';
import LaunchScreen from '../../components/UIElements/launchScreen'
import { FirebaseContext } from "../../components/firebase";
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
        key: 'startDate',
        name: 'Start Date'
    },
    1: {
        key: 'endDate',
        name: 'End Date'
    },
    2: {
        key: 'duration',
        name: 'Day Count'
    },
};
function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}
export default function MyRequests(props) {
    const firebaseContext = useContext(FirebaseContext);
    const [dataList, setDataList] = useState();
    const [searchQuery, setsearchQuery] = useState('');
    const [isDescending, setIsDescending] = useState(true); // 0 is down direction - 1 is up direction
    const [selectedFilterType, setSelectedFilterType] = useState(0);
    const classes = useStyles();
    const [filterBoxState, setFilterBoxState] =useState();
    const onFilterBoxClick = (filterBoxState) => {
        setFilterBoxState({ ...filterBoxState });
    }
    const onSearchQueryChange = (value) => {
        let filteredDataList = dataList;
        filteredDataList = filteredDataList.filter((data) => {
            return data.userName.toLowerCase().search(value.toLowerCase()) != -1 || data.description.toLowerCase().search(value.toLowerCase()) != -1;
        })
        setDataList(filteredDataList);
    }
    const onFilterDirectionChanged = (e) => {
        setIsDescending(isDescending => !isDescending)
    }

    let getMyRequests = async () => {
        let leaveRequestArray = [];
        await firebaseContext.getMyRequests()
            .then(result => {
                console.log(result);
                setDataList([...result]);
                console.log(result)

            });
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

    const filterData = (data, filterBoxState) => {
        if (filterBoxState != undefined && filterBoxState.length != 0) {
            if (filterBoxState.leaveType != undefined && filterBoxState.leaveType != '') {
                data = data.filter((item) => {
                    console.log("leavetype")
                    return filterBoxState.leaveType == item.leaveType;
                })
            }
            if (filterBoxState.startDate != undefined) {
                data = data.filter((item) => {
                    console.log("start")
                    return item.startDate >= filterBoxState.startDate;
                });

            }
            if (filterBoxState.endDate != undefined) {
                data = data.filter((item) => {
                    console.log("end")
                    return item.endDate <= filterBoxState.endDate;
                });
            }
        }
        setDataList([...data]);
    }

    useEffect(() => {
        getMyRequests()
        // sortDataByTypeAscDesc(isDescending, dataList, orderByFilterOptions[selectedFilterType].key);
        // filterData(dataList, filterBoxState)
    }, [selectedFilterType, isDescending, filterBoxState])
    return (
        <Container maxWidth="xl">
        <Box marginY={3}>
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
                {dataList ? dataList.map((data, index) => {
                    // var statusType = statusBadges.find(type => type.id == data.status)
                    // var leaveType = leaveBadges.find(type => type.id == data.leaveType)
                    return (
                        <MyRequestsCard
                            key={index}
                            userName={data.userName}
                            leaveTypeContent={data.leaveType?.name}
                            leaveTypeColor={data.leaveType?.color}
                            statusTypeContent={statusBadges[parseInt(data.status)].badgeContent}
                            statusTypeColor={statusBadges[parseInt(data.status)].color}
                            startDate={data.startDate}
                            endDate={data.endDate}
                            duration={data.duration}
                            description={data.description}
                        ></MyRequestsCard>
                    )
                })
            :
                    <LaunchScreen></LaunchScreen>}
            </Box>
        </Container>
    )
}