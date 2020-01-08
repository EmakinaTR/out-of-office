import React,{useState,useEffect,useContext,useRef} from 'react'
import { Container, Box, Typography, Grid,Button } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import { statusBadges, leaveBadges } from '../../constants/badgeTypes';
import MyRequestsCard from '../../components/UIElements/myRequestCard';
import { FilterBox } from '../../components/UIElements/filterBox/FilterBox';
import LaunchScreen from '../../components/UIElements/launchScreen'
import { FirebaseContext } from "../../components/firebase"; 
import AuthContext from "../../components/session";
import moment from 'moment';

const orderByFilterOptions = {
    0: {
        key: 'requestedDate',
        name: 'Created Date'
    },
    1: {
        key: 'startDate',
        name: 'Start Date'
    },
    2: {
        key: 'endDate',
        name: 'End Date'
    },
   
};
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
export default function MyRequests(props) {
    const firebaseContext = useContext(FirebaseContext);
    const [dataList, setDataList] = useState([]);
    const classes = useStyles();
    const { currentUser, setIsLoading } = useContext(AuthContext);
    const [loadMore, setLoadMore] = useState(true);
    const [searchQuery, setsearchQuery] = useState('');
    const [A_to_Z, setA_to_Z] = useState(true); // 0 is down direction - 1 is up direction
    const [selectedFilterField, setSelectedFilterField] = useState(0);
    const [filteredLeaveType, setFilteredLeaveType] = useState(-1);
    const [filteredDates, setFilteredDates] = useState({
        from: moment().subtract(30, 'd'),
        to : moment()
    })
    const intitialQueryData = {
        filterArray: [
            { fieldPath: "createdBy", condition: "==", value: currentUser.uid },
        ],
        orderBy: { fieldPath: "requestedDate", type: "desc" },
        pageSize: 10,
        // lastDocument : lastDocument
    }
    const [queryData, setQueryData] = useState(intitialQueryData)
    const onSelectedFilterFieldChanged = (e) => {
        setSelectedFilterField(e.target.value);
        console.log(selectedFilterField)

    }
    const onFilterDirectionChanged = (e) => {
        setA_to_Z(A_to_Z => !A_to_Z)
        console.log(A_to_Z)

    }

    const onFilteredLeaveTypeChange = (e)  => {
        setFilteredLeaveType(e.target.value);
        console.log(e.target.value)
    }
    const onSearchQueryChange = (value) => {
        setsearchQuery(value);
        console.log(searchQuery)

    }
    const onStartDateChange = date => {
        setFilteredDates({
            ...filteredDates, from: date._d
        });
        console.log(filteredDates)

    }
    const onEndDateChange = date => {
        setFilteredDates({
            ...filteredDates, to: date._d
        });
        console.log(filteredDates)
    }
    const onFilterBoxClick = () => {
        var reference = firebaseContext.db.collection("leaveType");
        console.log(filteredLeaveType)
        setQueryData(
            {
                ...queryData,
                filterArray: [
                    { fieldPath: "createdBy", condition: "==", value: currentUser.uid },
                    filteredLeaveType ? ({ fieldPath: "leaveTypeRef", condition: "==", value: reference.doc(filteredLeaveType.toString())}) : undefined,
                    filteredDates.from ? { fieldPath: orderByFilterOptions[selectedFilterField].key, condition: ">=", value: firebaseContext.convertMomentObjectToFirebaseTimestamp(new Date(filteredDates.from))} : undefined,
                    filteredDates.to ? { fieldPath: orderByFilterOptions[selectedFilterField].key, condition: "<=", value: firebaseContext.convertMomentObjectToFirebaseTimestamp(new Date(filteredDates.to)) } : undefined,
                    // filterBoxState.endDate ? { fieldPath: "startDate", condition: "<=", value: firebaseContext.convertMomentObjectToFirebaseTimestamp(new Date(filterBoxState.endDate))} : undefined
                ],
                orderBy: { fieldPath: orderByFilterOptions[selectedFilterField].key, type: A_to_Z ? "desc" : "asc" },
                lastDocument: undefined
            }
        )
        setLoadMore(true)
        console.log(queryData)
    }

    // const onSearchQueryChange = (value) => {
    //     let filteredDataList = dataList;
    //     filteredDataList = filteredDataList.filter((data) => {
    //         return data.userName.toLowerCase().search(value.toLowerCase()) != -1 || data.description.toLowerCase().search(value.toLowerCase()) != -1;
    //     })
    //     setDataList(filteredDataList);
    // }
    

    

    let getMyRequests = async (loadMore, queryData) => {
        console.log("getMyReq")
        if(loadMore){
            setIsLoading(true);
            await firebaseContext.getMyRequests(queryData, currentUser.uid)
                .then(result => {
                    if(result.data.length>0){
                        console.log(queryData)
                        setDataList([...result.data, ...dataList]);
                        setQueryData({ ...queryData, lastDocument: result.lastDocument })
                    }
                    else{
                        setQueryData({ ...queryData,lastDocument: "end"})
                    }
                    setIsLoading(false);
            });
        }
    }

    useEffect(() => {
        console.log("from useEffect - 1")
        console.log(queryData);
        getMyRequests(loadMore, queryData);
        setLoadMore(false);
    }, [loadMore]);
   
    
    useEffect(() => {
        const list = document.getElementById('list')
            // list has auto height  
            window.addEventListener('scroll', () => {
                if (window.scrollY + window.innerHeight >= list.clientHeight + list.offsetTop) {
                    setLoadMore(loadMore=> !loadMore);
                    console.log(loadMore)
                }
            });
    }, []);

    return (
        <Container maxWidth="xl">
        <Box marginY={3}>
            <Box marginBottom={2}>
                    <Grid container className={classes.headerContainer} alignItems="center" >
                    <Grid item xs={12} lg={4}>
                    <Typography variant="h5" component="h2">My Requests</Typography>
                      
                    </Grid>
                    <Grid item xs={12} lg={8} >
                        <Grid container alignItems="center" spacing={2} className={classes.listControls} wrap="nowrap">
                        <Grid item>
                        
                        </Grid>
                       
                        <Grid item>
                        <FilterBox
                            onFilterBoxClick={onFilterBoxClick}
                            onSearchQueryChange={onSearchQueryChange}
                            onFilterDirectionChanged={onFilterDirectionChanged}
                            onSelectedFilterFieldChanged={onSelectedFilterFieldChanged}
                            onStartDateChange={onStartDateChange}
                            onEndDateChange={onEndDateChange}
                            onFilteredLeaveTypeChange={onFilteredLeaveTypeChange}
                            orderByFilterOptions={orderByFilterOptions}
                            selectedFilterField={selectedFilterField}
                            A_to_Z={A_to_Z}
                            filteredDates={filteredDates}
                            filteredLeaveType={filteredLeaveType}
                        >
                        </FilterBox></Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </Box>
                    <div id= "list">
                    {dataList ? dataList.map((data, index) => {
                        // var statusType = statusBadges.find(type => type.id == data.status)
                        // var leaveType = leaveBadges.find(type => type.id == data.leaveType)
                        // {console.log(data.startDate)}
                        return (
                            <MyRequestsCard
                                id={index}
                                key={index}
                                userName={data?.requesterName}
                                leaveTypeContent={data.leaveType?.name}
                                leaveTypeColor={data.leaveType?.color}
                                statusTypeContent={statusBadges[parseInt(data.status)].badgeContent}
                                statusTypeColor={statusBadges[parseInt(data.status)].color}
                                startDate={data?.startDate.seconds * 1000}
                                endDate={data?.endDate.seconds * 1000}
                                duration={data?.duration}
                                description={data?.description}
                                documentID={data.id}
                                requestStatus={data.status}
                                createdBy={data.createdBy}
                            ></MyRequestsCard>
                        )
                    })
                        :
                        <LaunchScreen></LaunchScreen>}
                    </div>

                
            </Box>
        </Container>
    )
}