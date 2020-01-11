import React,{useState,useEffect,useContext} from 'react'
import { Container, Box, Typography, Grid } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import { statusBadges } from '../../constants/badgeTypes';
import MyRequestsCard from '../../components/UIElements/myRequestCard';
import { FilterBox } from '../../components/UIElements/filterBox/FilterBox';
import LaunchScreen from '../../components/UIElements/launchScreen'
import { FirebaseContext } from "../../components/firebase"; 
import AuthContext from "../../components/session";
import moment from 'moment';
import SnackBar from '../../components/UIElements/snackBar/SnackBar';
import { snackbars } from '../../constants/snackbarContents'
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
    const [prevQueryData, setprevQueryData] = useState()
    const [snackbarState, setSnackbarState] = useState(false);
    const [changess, setchangess] = useState()
    const [snackbarType, setSnackbarType] = useState({});
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
        // console.log(selectedFilterField)

    }
    const onFilterDirectionChanged = (e) => {
        setA_to_Z(A_to_Z => !A_to_Z)
        // console.log(A_to_Z)

    }

    const onFilteredLeaveTypeChange = (e)  => {
        setFilteredLeaveType(e.target.value);
        // console.log(e.target.value)
    }
    const onSearchQueryChange = (value) => {
        setsearchQuery(value);
        // console.log(searchQuery)

    }
    const onStartDateChange = date => {
        setFilteredDates({
            ...filteredDates, from: date._d
        });
        // console.log(filteredDates)

    }
    const onEndDateChange = date => {
        setFilteredDates({
            ...filteredDates, to: date._d
        });
        // console.log(filteredDates)
    }
    const onFilterBoxClick = () => {
        var reference = firebaseContext.db.collection("leaveType");
        let filterArray = [{ fieldPath: "createdBy", condition: "==", value: currentUser.uid }];
        if(filteredLeaveType !== -1){
            filterArray.push({ fieldPath: "leaveTypeRef", condition: "==", value: reference.doc(filteredLeaveType.toString()) })
        }
        if (filteredDates.from !== undefined){
            filterArray.push({ fieldPath: orderByFilterOptions[selectedFilterField].key, condition: ">=", value: firebaseContext.convertMomentObjectToFirebaseTimestamp(new Date(filteredDates.from)) })
        }

        if (filteredDates.to !== undefined) {
            filterArray.push({ fieldPath: orderByFilterOptions[selectedFilterField].key, condition: ">=", value: firebaseContext.convertMomentObjectToFirebaseTimestamp(new Date(filteredDates.from)) })
        }
        setQueryData(
            {
                ...queryData,
                filterArray:filterArray,
                orderBy: { fieldPath: orderByFilterOptions[selectedFilterField].key, type: A_to_Z ? "desc" : "asc" },
                lastDocument: undefined
            }
        )
        setLoadMore(true)
        // console.log(queryData)
    }
    let getMyRequests = async (loadMore, queryData) => {
        // console.log("getMyReq")
        
        // console.log("queryData: ", queryData);
        // console.log("prevQueryData: ", prevQueryData);
        
        if(loadMore){
            setIsLoading(true);
            await firebaseContext.getMyRequests(queryData, currentUser.uid)
                .then(result => {
                    
                    if ((queryData === intitialQueryData || queryData !==prevQueryData) && queryData.lastDocument === undefined){
                        // console.log("query data");
                            setDataList([...result.data]);
                            setQueryData({ ...queryData, lastDocument: result.lastDocument });
                        
                    }
                    else {
                        // console.log("Same query data");
                        if (result.data.length > 0) {
                            // console.log(queryData);
                            setDataList([...dataList, ...result.data]);
                           
                            setQueryData({ ...queryData, lastDocument: result.lastDocument });
                            
                        }
                        else {
                            setQueryData({ ...queryData, lastDocument: "end" });
                        }
                    }
                    setprevQueryData(queryData);
                    
                    
                }).finally(setIsLoading(false))
        }
      
    }
    const changeFormStatusHandler = async (documentID, type, description) => {
        
        await firebaseContext.setLeaveStatus(documentID, type, description)
            .then(() => {

                setSnackbarState(true);
                setSnackbarType(snackbars.success);
                setDataList(dataList.filter(function (obj) {
                    return obj.id !== documentID;
                }))
            }
            )
            .catch(err => console.log(err)).finally(() => {
                setIsLoading(false);
            });
    }
    useEffect(() => {
        getMyRequests(loadMore, queryData);
        setLoadMore(false);
    }, [loadMore]);
    
    useEffect(() => {
       firebaseContext.listenForRequests(queryData)
        
    }, [queryData]);
   
    
    useEffect(() => {
        const list = document.getElementById('list')
            // list has auto height  
            window.addEventListener('scroll', () => {
                if (window.scrollY + window.innerHeight >= list.clientHeight + list.offsetTop) {
                    setLoadMore(loadMore=> !loadMore);
                }
            });
    }, []);

    return (
        <Container maxWidth="xl">
        <Box marginY={3}>
            <Box marginBottom={2}>
                    <Grid container className={classes.headerContainer} alignItems="center" >
                    <SnackBar snackbarType={snackbarType} snackBarState={snackbarState} onClose={() => { setSnackbarState(false) }}></SnackBar>

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
                        </FilterBox>
                        </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </Box>
                    <div id= "list">
                    {dataList ? dataList.map((data, index) => {
                        // var statusType = statusBadges.find(type => type.id === data.status)
                        // var leaveType = leaveBadges.find(type => type.id === data.leaveType)
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
                                changeFormStatusHandler={changeFormStatusHandler}

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