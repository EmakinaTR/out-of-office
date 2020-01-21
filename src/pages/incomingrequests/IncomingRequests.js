import React, { useState, useEffect, useContext } from "react";
import { Container, Box, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { statusBadges } from "../../constants/badgeTypes";
import IncomingRequestCard from "../../components/UIElements/incomingRequestCard";

import { FilterBox } from "../../components/UIElements/filterBox/FilterBox";
import { FirebaseContext } from "../../components/firebase";
import AuthContext from "../../components/session";
import LaunchScreen from "../../components/UIElements/launchScreen";
import SnackBar from "../../components/UIElements/snackBar/SnackBar";
import { snackbars } from "../../constants/snackbarContents";
import moment from "moment";

const PAGE_ITEM_SIZE = 10;
let lastDocument = null;
const _createIncomingQueryData = () => {
  return {
    pageSize: PAGE_ITEM_SIZE,
    lastDocument: lastDocument
  };
};
const useStyles = makeStyles(theme => ({
  contentContainer: {
    // padding:0
  },
  headerContainer: {
    //margin: theme.spacing(2)
  },
  listControls: {
    "& :first-child": {
      flexGrow: 1,
      [theme.breakpoints.up("lg")]: {
        flexGrow: 0
      }
    },
    justifyContent: "flex-start",
    [theme.breakpoints.up("lg")]: {
      justifyContent: "flex-end"
    }
  }
}));

const orderByFilterOptions = {
  0: {
    key: "requestedDate",
    name: "Created Date"
  },
  1: {
    key: "startDate",
    name: "Start Date"
  },
  2: {
    key: "endDate",
    name: "End Date"
  }
};

export default function IncomingRequests(props) {
  const classes = useStyles();
  const [dataList, setDataList] = useState();
  const [snackbarState, setSnackbarState] = useState(false);
  const [snackbarType, setSnackbarType] = useState({});
  const firebaseContext = useContext(FirebaseContext);
  const { currentUser, setIsLoading, isLoading } = useContext(AuthContext);
  const [loadMore, setLoadMore] = useState(true);
  const [searchQuery, setsearchQuery] = useState("");
  const [A_to_Z, setA_to_Z] = useState(true); // 0 is down direction - 1 is up direction
  const [selectedFilterField, setSelectedFilterField] = useState(0);
  const [filteredLeaveType, setFilteredLeaveType] = useState(-1);
  const [prevQueryData, setprevQueryData] = useState();
  const [filteredDates, setFilteredDates] = useState({
    from: moment().subtract(30, "d"),
    to: moment()
  });
  const intitialQueryData = {
    filterArray: [],
    orderBy: { fieldPath: "requestedDate", type: "desc" },
    pageSize: 10
    // lastDocument : lastDocument
  };
  const [queryData, setQueryData] = useState(intitialQueryData);
  const onSelectedFilterFieldChanged = e => {
    setSelectedFilterField(e.target.value);
    // console.log(selectedFilterField)
  };
  const onFilterDirectionChanged = e => {
    setA_to_Z(A_to_Z => !A_to_Z);
    // console.log(A_to_Z)
  };

  const onFilteredLeaveTypeChange = e => {
    setFilteredLeaveType(e.target.value);
    // console.log(e.target.value)
  };
  const onSearchQueryChange = value => {
    setsearchQuery(value);
    // console.log(searchQuery)
  };
  const onStartDateChange = date => {
    setFilteredDates({
      ...filteredDates,
      from: date._d
    });
    // console.log(filteredDates)
  };
  const onEndDateChange = date => {
    setFilteredDates({
      ...filteredDates,
      to: date._d
    });
    // console.log(filteredDates)
  };
  const changeFormStatusHandler = async (documentID, type, description) => {
    setIsLoading(true);
    await firebaseContext
      .setLeaveStatus(documentID, type, description)
      .then(() => {
        setSnackbarState(true);
        setSnackbarType(snackbars.success);
        setIsLoading(true);
      })
      // .then(()=> {
      //     var foundIndex = dataList.findIndex(x => x.id == documentID);
      //     console.log(dataList[foundIndex])
      //     dataListCopy = dataList;

      //     dataListCopy = [...dataListCopy,dataListCopy[foundIndex].status = type ]
      //     console.log(dataListCopy)
      //     setDataList(prevDataList => ({
      //         ...prevDataList,
      //         [dataList[foundIndex].status]: type,
      //     }));
      //     console.log(dataList)
      // })
      .catch(err => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  };
  let getAllLeaveRequests = async (loadMore, queryData) => {
    if (loadMore) {
      setIsLoading(true);
      await firebaseContext
        .getIncomingRequests(queryData)
        .then(result => {
          console.log(result.data);
          if (
            (queryData === intitialQueryData || queryData !== prevQueryData) &&
            queryData.lastDocument === undefined
          ) {
            setDataList([...result.data]);
            console.log("LAST DOCUMENT ", result.lastDocument);
            setQueryData({ ...queryData, lastDocument: result.lastDocument });
          } else {
            // console.log("Same query data");
            if (result.data.length > 0) {
              console.log(result.data);
              setDataList([...dataList, ...result.data]);
              setQueryData({ ...queryData, lastDocument: result.lastDocument });
            } else {
              setQueryData({ ...queryData, lastDocument: "end" });
            }
          }
          // setprevQueryData(queryData);
        })
        .finally(setIsLoading(false));
    }
    setIsLoading(false);
  };
  const onFilterBoxClick = () => {
    var reference = firebaseContext.db.collection("leaveType");
    let filterArray = [
      { fieldPath: "createdBy", condition: "==", value: currentUser.uid }
    ];
    if (filteredLeaveType !== -1) {
      filterArray.push({
        fieldPath: "leaveTypeRef",
        condition: "==",
        value: reference.doc(filteredLeaveType.toString())
      });
    }
    if (filteredDates.from !== undefined) {
      filterArray.push({
        fieldPath: orderByFilterOptions[selectedFilterField].key,
        condition: ">=",
        value: firebaseContext.convertMomentObjectToFirebaseTimestamp(
          new Date(filteredDates.from)
        )
      });
    }

    if (filteredDates.to !== undefined) {
      filterArray.push({
        fieldPath: orderByFilterOptions[selectedFilterField].key,
        condition: ">=",
        value: firebaseContext.convertMomentObjectToFirebaseTimestamp(
          new Date(filteredDates.from)
        )
      });
    }

    setQueryData({
      ...queryData,
      filterArray: filterArray,
      orderBy: {
        fieldPath: orderByFilterOptions[selectedFilterField].key,
        type: A_to_Z ? "desc" : "asc"
      },
      lastDocument: undefined
    });
    setLoadMore(true);
    // console.log(queryData)
  };

  useEffect(() => {
    const list = document.getElementById("mainContent");

    window.addEventListener("scroll", () => {
      console.log(list.scrollY);
      if (
        window.scrollY + window.innerHeight >=
        list.clientHeight + list.offsetTop
      ) {
        setLoadMore(loadMore => !loadMore);
      }
    });
  }, []);

  useEffect(() => {
    getAllLeaveRequests(loadMore, queryData);
    setLoadMore(false);
    setIsLoading(true);
  }, [loadMore]);

  return (
    <Container maxWidth="xl">
      <Box marginY={3}>
        <Box marginBottom={2}>
          <Grid
            container
            className={classes.headerContainer}
            alignItems="center"
          >
            <Grid item xs={12} lg={4}>
              <Typography variant="h5" component="h2">
                Incoming Requests
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <Grid
                container
                alignItems="center"
                spacing={2}
                className={classes.listControls}
                wrap="nowrap"
              >
                <Grid item>
                  <SnackBar
                    snackbarType={snackbarType}
                    snackBarState={snackbarState}
                    onClose={() => {
                      setSnackbarState(false);
                    }}
                  ></SnackBar>
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
                  ></FilterBox>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <div id="mainContent">
          {dataList ? (
            dataList.map((data, index) => {
              return (
                <IncomingRequestCard
                  key={index}
                  userName={data?.requesterName}
                  leaveTypeContent={data?.leaveType.name}
                  leaveTypeColor={data?.leaveType.color}
                  statusTypeContent={
                    statusBadges[parseInt(data.status)]?.badgeContent
                  }
                  statusTypeColor={statusBadges[parseInt(data.status)]?.color}
                  startDate={data?.startDate._seconds * 1000}
                  endDate={data?.endDate._seconds * 1000}
                  duration={data?.duration}
                  description={data?.description}
                  documentID={data.id}
                  requestStatus={data.status}
                  createdBy={data.createdBy}
                  changeFormStatusHandler={changeFormStatusHandler}
                ></IncomingRequestCard>
              );
            })
          ) : (
            <div></div>
          )}
        </div>
      </Box>
    </Container>
  );
}
