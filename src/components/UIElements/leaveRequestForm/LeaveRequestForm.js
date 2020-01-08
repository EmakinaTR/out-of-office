import moment from 'moment-business-days';
import React, {useRef, useState, useEffect, useContext} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Container, FormControl, FormControlLabel, InputLabel, Select, Grid, TextField, Box, Checkbox, 
Link, Button, Typography, Chip, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, 
DialogTitle, useMediaQuery } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import SnackBar from "../snackBar/SnackBar";
import { snackbars } from "../../../constants/snackbarContents";
import { useForm } from "react-hook-form";
import AuthContext from "../../session";
const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(3, 3),
    },
    title: {
        textAlign: 'center'
    },
    formControl: {
        // margin: theme.spacing(0, 0),
        minWidth: 120,
        width: '100%'
    },
    inputWidth: {
        width: '100%'
    },
    checkBoxError: {
        '& .MuiIconButton-label': {
            border: '2px solid red',
            height: '17px',
            width: '17px'
        },
    }
}));

export default function LeaveRequestForm(props) {
    // Styles
    const classes = useStyles();
    // Refs
    const inputLabel = useRef(null);
    // Theme
    const theme = useTheme();
    // MediaQuery
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    // Default Date
    const defaultDate = moment().set({hour:9,minute:0,second:0}).format('YYYY-MM-DDTHH:mm:ss');
    // Form Validation
    const {register, handleSubmit, errors, watch} = useForm();
    const watchFields = watch(["leaveType", "description"]);
    // States
    const [state, setState] = useState({
        protocolNumber: '',
    });
    const [labelWidth, setLabelWidth] = useState(0);
    const [selectedStartDate, setSelectedStartDate] = useState(defaultDate);
    const [selectedEndDate, setSelectedEndDate] = useState(defaultDate);
    const [duration, setDuration] = useState(0);
    const [checked, setChecked] = useState(false);
    const [negativeLeaveCheck, setNegativeLeaveCheck] = useState(false);
    const [open, setOpen] = useState(false);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [dateTimeLocalStart, setDateTimeLocalStart] = useState(defaultDate);
    const [dateTimeLocalEnd, setDateTimeLocalEnd] = useState(defaultDate);
    const [approvers, setApprovers] = useState([]);
    const [snackbarState, setSnackbarState] = useState(false);
    const [snackbarType, setSnackbarType] = useState({});
    const { setIsLoading } = useContext(AuthContext);
    // Handle Methods
    
    // Wee need this handleChnage method  because watchFields doesn't recognize
    // conditional rendiring
    const handleChange = name => event => {
        const {value} = event.target;
        setState({
        ...state,
        [name]: value,
        });
        console.log(value);
    }
    // Desktop DateTimePickers
    const handleStartDateChange = date => {
        setSelectedStartDate(date);
    }

    const handleEndDateChange = date => {
        setSelectedEndDate(date);
    }

    const _calculateTimeAddition = (timeDiff) => {
        const HOUR = 60;
        const NO_ADDITION = 0;
        const HALF_DAY = 0.5;
        const FULL_DAY = 1;       
        if(timeDiff <= 2.5 * HOUR) {
            return NO_ADDITION;
        } else if (timeDiff <= 4 * HOUR) {
            return HALF_DAY;
        } else {    
            return FULL_DAY;
        }         
    } 
    
    const _calculateLeaveDuration = (dayDiff,timeDiff,isStartTimeAfter) => {  
        let additionDate = _calculateTimeAddition(timeDiff);
        if(isStartTimeAfter) {
            additionDate = additionDate - 1;
        }
        return dayDiff + additionDate;
    }    

    const _getTimeDifference = (startTime,endTime,dayDiff) => {
        // Does not affect to calculation directly. Just used to craft a date object
        const SPARE_DATE = "01/01/2020";
        const BREAK_TIME = "12:00:00";
        const MIDDAY_BOUNDARY = "11:59:59";
        const LEAVE_BOUNDARY = "15:59:59";
        const WORK_START_TIME = "09:00:00";
        const WORK_END_TIME = "18:29:59";
        
        const startDate = moment(`${SPARE_DATE} ${startTime}`,"DD/MM/YYYY HH:mm:ss");
        const endDate = moment(`${SPARE_DATE} ${endTime}`,"DD/MM/YYYY HH:mm:ss");
        const breakDate = moment(`${SPARE_DATE} ${BREAK_TIME}`,"DD/MM/YYYY HH:mm:ss");    
        const leaveBoundaryDate = moment(`${SPARE_DATE} ${LEAVE_BOUNDARY}`,"DD/MM/YYYY HH:mm:ss"); 
        const middayBoundaryDate = moment(`${SPARE_DATE} ${MIDDAY_BOUNDARY}`,"DD/MM/YYYY HH:mm:ss");     
        const workStart = moment(`${SPARE_DATE} ${WORK_START_TIME}`,"DD/MM/YYYY HH:mm:ss");
        const workEnd = moment(`${SPARE_DATE} ${WORK_END_TIME}`,"DD/MM/YYYY HH:mm:ss");

        let timeDiff;    
        let isStartTimeAfter = false;   
        if(dayDiff === 0 || startDate.isBefore(endDate)) {
            timeDiff = endDate.diff(startDate,"minutes");
            // if(startDate.isBetween(breakDate,leaveBoundaryDate)) {
            //     timeDiff = timeDiff - 180;               
            // } else if(startDate.isBetween(workStart,breakDate)) {
            //     timeDiff = timeDiff + 180;
            // }
        } else {
            let firstDayLeave = workEnd.diff(startDate,"minutes");    
            if(startDate.isBetween(middayBoundaryDate,leaveBoundaryDate)) {
                firstDayLeave = 180;
                console.log("SU Elsin içindeki bu IFE girdi");
            }
            const lastDayLeave = endDate.diff(workStart,"minutes");
            timeDiff = firstDayLeave + lastDayLeave;                 
            isStartTimeAfter = true;           
        }               
        // If the times contains break time, exclude from calculation
        if(breakDate.isBetween(startDate,endDate)) {
            timeDiff = timeDiff - 60;
        }           
        return [timeDiff,isStartTimeAfter];
    }

    const handleDuration = async (selectedEndDate, selectedStartDate) => {
              
        const _selectedStartDate = moment.isMoment(selectedStartDate) ? selectedStartDate.format() : selectedStartDate;
        const _selectedEndDate = moment.isMoment(selectedEndDate) ? selectedEndDate.format() : selectedEndDate;         

        const [startDate,startTime] = _selectedStartDate.toString().split('T');
        const [endDate,endTime] = _selectedEndDate.toString().split('T');         

        const dayDiff = await moment(endDate).businessDiff(moment(startDate));      
        const [timeDiff,isStartTimeAfter] = _getTimeDifference(startTime,endTime, dayDiff);        
        const duration = _calculateLeaveDuration(dayDiff,timeDiff,isStartTimeAfter);      
       
        setDuration(duration);
    }

    // Mobile DateTimePickers
    const handleDateTimeLocalStart = date => {
        setDateTimeLocalStart(date.target.value);
        console.log('LOCALTIMESTART', dateTimeLocalStart)
    }

    const handleDateTimeLocalEnd = date => {
        setDateTimeLocalEnd(date.target.value);
        console.log("LOCALTIMEEND", dateTimeLocalEnd);
    }
    
    const handleCheck = event => {
        setChecked(event.target.checked);
        // console.log(event.target.checked)
    }

    const handleNegativeLeaveCheck = event => {
        setNegativeLeaveCheck(event.target.checked);
        console.log(event.target.checked)
    }

    const handleDialogOpen = () => {
        setOpen(true);
        console.log('Working')
    }

    const handleDialogClose = () => {
        setOpen(false);
    }

    const onSubmit = async (data, e) => {    
        setIsLoading(true);
        e.preventDefault();
        const uid = props.auth().uid;
        const processedBy = "";
        const createdBy = uid;
        const requesterName = props.auth().displayName;
        const status = 0;
        const requestedDate = props.firebase.convertMomentObjectToFirebaseTimestamp(moment()._d);
        const leaveType = watchFields.leaveType;
        const description = watchFields.description;
        const protocolNumber = state.protocolNumber;
        const leaveTypeRef = props.firebase.convertLeaveTypeToFirebaseRef(leaveType);
        const isPrivacyPolicyApproved = checked;
        const isNegativeCreditUsageApproved = negativeLeaveCheck;
        let startDate = moment()._d;
        let endDate = moment()._d;
        if ((screenSize() > 768)) {
            startDate = props.firebase.convertMomentObjectToFirebaseTimestamp(new Date(selectedStartDate));
            endDate = props.firebase.convertMomentObjectToFirebaseTimestamp(new Date(selectedEndDate));   
        }
        else {
            startDate = props.firebase.convertMomentObjectToFirebaseTimestamp(new Date(dateTimeLocalStart));
            endDate = props.firebase.convertMomentObjectToFirebaseTimestamp(new Date(dateTimeLocalEnd));
        }
        
        const requestFormObj = { requestedDate, processedBy, createdBy, requesterName, leaveTypeRef, startDate, endDate, duration,
            description, protocolNumber, isPrivacyPolicyApproved, isNegativeCreditUsageApproved, status }
        await props.firebase.sendNewLeaveRequest(requestFormObj).then(response => {
            
            setSnackbarState(true);
            setSnackbarType(snackbars.success);
        })
        console.log(requestFormObj);       
    }

    const isLeaveCreditNegative = (duration) => props.user.annualCredit + props.user.excuseCredit - duration < 0;
    
    //Firebase

    // Firebase functions
    let getAllLeaveTypes = async () => {
        setIsLoading(true);
        let firebasePromise = props.firebase.getAllLeaveTypes();
        let leaveTypesArr = [];
        if (firebasePromise !== null) {
            await firebasePromise.then(snapshot => {
                for (let doc of snapshot.docs) {
                    leaveTypesArr.push(doc.data())
                }
                setLeaveTypes(leaveTypesArr);
                setIsLoading(false);
            });
        }
    }

    let getApproversWithId = async () => {
        let firebasePromise = props.firebase.getApproversWithId(props.auth().uid);
        let leadUsers = [];
        if (firebasePromise[0] !== null) {
            await firebasePromise[0].then(snapshot => {
                for (let doc of snapshot.docs) {
                    leadUsers.push(doc.data().leadUser);
                }
            })
        }   
        if (firebasePromise[1] !== null) {
            await firebasePromise[1].then(snapshot => {
                leadUsers.push(snapshot.data().leadUser);
            });
        }

        searchApprovers(leadUsers);
    }

    let searchApprovers = async (leadUserId) => {
        let approversArr = []
        let adminPromise = props.firebase.searchApprovers(leadUserId[0]);
        if (adminPromise !== null) {
            await adminPromise.then(snapshot => {
               approversArr.push({'name': snapshot.data().firstName + ' ' + snapshot.data().lastName});
            })
        }
        if (leadUserId[1] !== undefined) {
            let teamLeadPromise = props.firebase.searchApprovers(leadUserId[1]);
            if (teamLeadPromise !== null) {
                await teamLeadPromise.then(snapshot => {
                    approversArr.push({'name': snapshot.data().firstName + ' ' + snapshot.data().lastName});
                 })
            }
        }
        
        setApprovers(approversArr);
    }
    
    let screenSize = () => {
       return window.innerWidth;
    }

    const addResizeEvent = async () => {
        await window.addEventListener('resize', screenSize);
    }

    const checkIfRequired = (leaveTypeIndex) => {
        const leaveType = leaveTypes[leaveTypeIndex];
        return leaveType?.isDescriptionMandatory;
    }

    // Lifecycle Methods
    useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
        getAllLeaveTypes();
        addResizeEvent();
        getApproversWithId();
    }, []);

    return (           
        <Container maxWidth="lg">
            <Box marginY={4}>
                <Paper className={classes.root}>
                    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                        <Typography variant="h5" component="h2" align="center" gutterBottom>New Leave Request</Typography>
                        <Box marginTop={2}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel ref={inputLabel}>Leave Type</InputLabel>
                                <Select
                                native
                                labelWidth={labelWidth}
                                name="leaveType"
                                inputRef={register({ required: true, minLength: 1 })}
                                error={errors.leaveType}
                                >
                                <option value="" />
                                {leaveTypes.map((item, index) => {
                                    return <option key={index} value={index}>{item.name}</option>
                                })}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box display={{xs: 'block', md: 'none'}}>
                            <TextField
                            margin="normal"
                            label="Start Date and Time"
                            type="datetime-local"
                            className={classes.inputWidth}
                            defaultValue={dateTimeLocalStart}
                            onChange={handleDateTimeLocalStart}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            />
                            <TextField
                            margin="normal"
                            label="End Date and Time"
                            type="datetime-local"
                            inputProps={{ min: dateTimeLocalStart }}
                            defaultValue={dateTimeLocalEnd}
                            onChange={handleDateTimeLocalEnd}
                            className={classes.inputWidth}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            />
                        </Box>
                        <Box display={{xs: 'none', md: 'block'}}>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <KeyboardDatePicker
                                        clearable
                                        className={classes.inputWidth}
                                        label="Start Date"
                                        format='MM/DD/YYYY'
                                        margin="normal"
                                        value={selectedStartDate}
                                        onChange={handleStartDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <KeyboardTimePicker
                                        className={classes.inputWidth}
                                        margin="normal"
                                        label="Start Time"
                                        value={selectedStartDate}
                                        onChange={handleStartDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <KeyboardDatePicker
                                        className={classes.inputWidth}
                                        label="End Date"
                                        format='MM/DD/YYYY'
                                        minDate={selectedStartDate}
                                        margin="normal"
                                        value={selectedEndDate}
                                        onChange={handleEndDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <KeyboardTimePicker
                                        className={classes.inputWidth}
                                        margin="normal"
                                        label="End Time"
                                        value={selectedEndDate}
                                        onChange={handleEndDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                        />
                                    </Grid>
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </Box>
                        
                        <TextField className={classes.inputWidth} label="Leave Duration" variant="filled" margin="normal" InputProps={{readOnly: true,}} 
                        onChange={(screenSize() > 768) ? handleDuration(selectedEndDate, selectedStartDate) : handleDuration(dateTimeLocalEnd, dateTimeLocalStart)} value={duration}/>
                       
                        <TextField className={classes.inputWidth} label="Description" multiline rows="4" variant="outlined" margin="normal"
                        name="description" inputRef={register({ required: checkIfRequired(watchFields.leaveType), minLength: 5 })} error={errors.description}/>

                        {(watchFields.leaveType == 2) ? 
                            <TextField className={classes.inputWidth} label="Rapor Protokol No (Mazeret)" variant="outlined" margin="normal"
                            value={state.protocolNumber} onChange={handleChange('protocolNumber')}/> : ''
                        }
                        
                        <Box my={3}>
                            <Typography variant="caption" component="div">Approver</Typography>
                            {approvers.map((item, index) => {
                                return  <Box key={index} component="span">
                                            <Chip avatar={<Avatar>{item.name.charAt(0)}</Avatar>} label={item.name} style={{margin:".25rem .5rem .25rem 0"}} />
                                        </Box>; 
                            })}                      
                        </Box>
                        <Box my={2}>
                            <Grid container spacing={2}>
                                {(isLeaveCreditNegative(duration)) ?  
                                <Grid item xs={12}>
                                    <Grid container direction="row" alignItems="center">
                                        <Grid item>
                                                <Checkbox
                                                id="negativeCredit" 
                                                color="primary"
                                                name="negativeCreditCheck"
                                                checked={negativeLeaveCheck}
                                                onChange={handleNegativeLeaveCheck}
                                                value={negativeLeaveCheck}
                                                className={(errors.negativeCreditCheck) ? classes.checkBoxError: ''}
                                                inputRef={register({required: !negativeLeaveCheck})}
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                                />
                                        </Grid>
                                        <Grid item xs>
                                            <label htmlFor="negativeCredit" style={{paddingRight:".5rem"}}>Agree with Negative Leave Credit Usage</label>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                : ''
                                }
                                <Grid item xs={12} lg={6}>
                                    <Grid container direction="row" alignItems="center">
                                        <Grid item>
                                            <Checkbox
                                            id="kvkk"
                                            checked={checked}
                                            onChange={handleCheck}
                                            value={checked}
                                            color="primary"
                                            name="kvkkCheck"
                                            className={(errors.kvkkCheck) ? classes.checkBoxError: ''}
                                            inputRef={register({required: !checked})}
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                        </Grid> 
                                        <Grid item xs>
                                            <label htmlFor="kvkk" style={{paddingRight:".5rem"}}>Agree with Terms and Conditions</label>
                                            <Link style={{cursor: 'pointer'}} onClick={handleDialogOpen}>KVKK Contract</Link>
                                        </Grid>
                                    </Grid>           
                                    <Dialog
                                    fullScreen={fullScreen}
                                    open={open}
                                    onClose={handleDialogClose}
                                    aria-labelledby="responsive-dialog-title"
                                    >
                                        <DialogTitle id="responsive-dialog-title">{"Use Google's location service?"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Let Google help apps determine location. This means sending anonymous location data to
                                                Google, even when no apps are running.
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button autoFocus onClick={handleDialogClose} color="primary">
                                                Disagree
                                            </Button>
                                            <Button onClick={handleDialogClose} color="primary" autoFocus>
                                                Agree
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Button className={classes.inputWidth} variant="contained" size="large" type="submit" color="primary">SEND</Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    )
}
