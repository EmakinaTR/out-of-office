import React,{useState,useEffect,useContext}from 'react'
import { Container, Box, Typography, Grid, Button } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import { statusBadges, leaveBadges } from '../../constants/badgeTypes';
import IncomingRequestCard from '../../components/UIElements/incomingRequestCard';
import { incomingRequestData } from '../../constants/dummyData';
import SearchFilter from '../../components/UIElements/searchFilter/SearchFilter';
import OrderByFilter from '../../components/UIElements/orderByFilter';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FilterBox } from '../../components/UIElements/filterBox/FilterBox';
import { FirebaseContext } from "../../components/firebase";



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
        key: 'duration',
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
    const firebaseContext = useContext(FirebaseContext);

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
    
    let getAllLeaveRequests = async () => {
        let leaveRequestPromise = firebaseContext.getAllLeaveRequests();
        let leaveRequestArray = [];
        if (leaveRequestPromise !== null) {
            await leaveRequestPromise.then(snapshot => {
                for (let doc of snapshot.docs) {
                    leaveRequestArray.push(doc.data())
                }
            });
        }
        await Promise.all(leaveRequestArray.map(async(item)=>{
            const leaveTypeReference = item.leaveTypeRef;
            await firebaseContext.getReferenceDocument(leaveTypeReference.path).get().then(documentSnapshot =>  {
                item.leaveType = documentSnapshot.data();
            });

        }))
         setDataList([...leaveRequestArray])
    }

    const filterData = (data, filterBoxState) => {
        if (filterBoxState != undefined && filterBoxState.length != 0) {
            if (filterBoxState.leaveType != undefined && filterBoxState.leaveType != '') {
                data = data.filter((item) => {
                    console.log("leavetype")
                    return filterBoxState.leaveType == item.leaveType;
                })
            }
            if (filterBoxState.startDate != undefined ) {
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
        getAllLeaveRequests()
        // sortDataByTypeAscDesc(isDescending, dataList, orderByFilterOptions[selectedFilterType].key);
        // filterData(dataList, filterBoxState)
    }, [selectedFilterType, isDescending, filterBoxState])
    
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
                            <FilterBox
                            onFilterBoxClick={onFilterBoxClick}
                            filterBoxState={filterBoxState}
                            >
                            </FilterBox>
                    </Grid>
                </Grid>
                {dataList.map((data, index) => {
                    if(data.status == 0)
                        console.log(data)
                    return (
                        // <p>{data}</p>
                        <IncomingRequestCard
                            key={index}
                            userName={data.requesterName}
                            leaveTypeContent={data.leaveType?.name}
                            leaveTypeColor={data.leaveType?.color}
                            statusTypeContent={statusBadges[parseInt(data.status)].badgeContent}
                            statusTypeColor={statusBadges[parseInt(data.status)].color}
                            startDate={data.startDate}
                            endDate={data.endDate}
                            duration={data.duration}
                            description={data.description}
                        ></IncomingRequestCard>
                    )
                })}
            </Box>
        </Container>
    )
}