import React,{useState,useEffect,useContext,useRef} from 'react'
import { Container, Box, Typography, Grid,Button } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import { statusBadges, leaveBadges } from '../../constants/badgeTypes';
import MyRequestsCard from '../../components/UIElements/myRequestCard';
import SearchFilter from '../../components/UIElements/searchFilter/SearchFilter';
import OrderByFilter from '../../components/UIElements/orderByFilter';
import { FilterBox } from '../../components/UIElements/filterBox/FilterBox';
import LaunchScreen from '../../components/UIElements/launchScreen'
import { FirebaseContext } from "../../components/firebase"; 
import AuthContext from "../../components/session";


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
    const [dataList, setDataList] = useState([]);
    const [searchQuery, setsearchQuery] = useState('');
    const [A_to_Z, setA_to_Z] = useState(true); // 0 is down direction - 1 is up direction
    const [selectedFilterType, setSelectedFilterType] = useState(0);
    const { currentUser } = useContext(AuthContext);
    const classes = useStyles();
    const [filterBoxState, setFilterBoxState] =useState();
    const [loadMore, setLoadMore] = useState(true);
    const intitialQueryData = {
        filterArray: [
            { fieldPath: "createdBy", condition: "==", value: currentUser.uid },
            // // { fieldPath: "status", condition: "==", value: 0 }
        ],
        orderBy: { fieldPath: "startDate", type: A_to_Z ? "desc": "asc" },
        pageSize: 10,
        // lastDocument : lastDocument
    }
    const [queryData, setQueryData] = useState(intitialQueryData)

    const onFilterBoxClick = (filterBoxState) => {
        // setFilterBoxState({ ...filterBoxState });
        // console.log(filterBoxState)
        var reference = firebaseContext.db.collection("leaveType");
        // filterBoxState.leaveType ? (leaveTypeRef.0 ):undefined
        setQueryData(
            {
                ...queryData,
                filterArray: [
                    { fieldPath: "createdBy", condition: "==", value: currentUser.uid },
                    filterBoxState.leaveType ? ({ fieldPath: "leaveTypeRef", condition: "==", value: reference.doc(filterBoxState.leaveType)}) : undefined,
                    filterBoxState.startDate ? { fieldPath: "startDate", condition: ">=", value: firebaseContext.convertMomentObjectToFirebaseTimestamp(new Date(filterBoxState.startDate))} : undefined,
                    // filterBoxState.endDate ? { fieldPath: "startDate", condition: "<=", value: firebaseContext.convertMomentObjectToFirebaseTimestamp(new Date(filterBoxState.endDate))} : undefined
                ],
                lastDocument: undefined
            }
        )
        setLoadMore(true)
    }

    const onSearchQueryChange = (value) => {
        let filteredDataList = dataList;
        filteredDataList = filteredDataList.filter((data) => {
            return data.userName.toLowerCase().search(value.toLowerCase()) != -1 || data.description.toLowerCase().search(value.toLowerCase()) != -1;
        })
        setDataList(filteredDataList);
    }
    const onFilterDirectionChanged = (e) => {
        setA_to_Z(A_to_Z => !A_to_Z)
        setQueryData(
            {
                ...queryData,
                orderBy: { fieldPath: orderByFilterOptions[selectedFilterType].key, type: A_to_Z? "desc": "asc"},
                lastDocument: undefined,

            }
        )
        setDataList([]);
        setLoadMore(loadMore => !loadMore)
        // console.log("from direction: ",queryData)
    }

    const onSelectedFilterTypeChanged = (e) => {
        setSelectedFilterType(e.target.value);
        setQueryData(
            {
                ...queryData,
                orderBy: { fieldPath: orderByFilterOptions[selectedFilterType].key, type: A_to_Z ? "desc" : "asc" },
                lastDocument: undefined,
                
            }
        )
        setDataList([]);
        setLoadMore(loadMore => !loadMore)
        // console.log("from filter type : ", queryData)
    }

    let getMyRequests = async (loadMore, queryData) => {
        console.log("getMyReq")
        if(loadMore){
            console.log("inside")
            await firebaseContext.getMyRequestsC(queryData, currentUser.uid)
                .then(result => {
                    if(result.data.length>0){
                        console.log(result.data)
                        setDataList([...result.data, ...dataList]);
                        setQueryData({ ...queryData, lastDocument: result.lastDocument })
                    }
                    else{
                        setQueryData({ ...queryData,lastDocument: "end"})
                    }
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
                        <SearchFilter
                            onChange={onSearchQueryChange}
                        >
                        </SearchFilter>
                        </Grid>
                        <Grid item>
                        <OrderByFilter
                            options={orderByFilterOptions}
                            onFilterDirectionChanged={onFilterDirectionChanged}
                            A_to_Z={A_to_Z}
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