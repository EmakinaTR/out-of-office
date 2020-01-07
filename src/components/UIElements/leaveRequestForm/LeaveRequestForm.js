import moment from 'moment-business-days';
import React, {useRef, useState, useEffect, useContext} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Container, FormControl, FormControlLabel, InputLabel, Select, Grid, TextField, Box, Checkbox, 
Link, Button, Typography, Chip, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, 
DialogTitle, useMediaQuery } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
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
    kvkkCheckBox: {
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
    const [open, setOpen] = useState(false);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [dateTimeLocalStart, setDateTimeLocalStart] = useState(defaultDate);
    const [dateTimeLocalEnd, setDateTimeLocalEnd] = useState(defaultDate);
    const { setIsLoading } = useContext(AuthContext);      

    // Handle Methods
    // Wee need this handleChnage metho  because watchFields doesn't recognize
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
        const multipySign = (timeDiff >= 0) ? 1 : -1;
        const absoluteDiff = timeDiff * multipySign;        
        if(absoluteDiff <= 2 * HOUR) {
            return NO_ADDITION;
        } else if (absoluteDiff <= 4 * HOUR) {
            return HALF_DAY * multipySign;
        } else {    
            return FULL_DAY * multipySign;
        }         
    }

    const _calculateLeaveDuration = (dayDiff,timeDiff) => {  
        const additionDate = _calculateTimeAddition(timeDiff);
        return dayDiff + additionDate;
    }    

    const _getTimeDifference = (startTime,endTime,dayDiff) => {
        // Does not affect to calculation directly. Just used to craft a date object
        const SPARE_DATE = "01/01/2020";
        const BREAK_TIME = "12:00:00";
        const WORK_START_TIME = "09:00:00";
        const WORK_END_TIME = "18:30:00";

        const MIDNIGHT = "23:59:59";
        
        const startDate = moment(`${SPARE_DATE} ${startTime}`,"DD/MM/YYYY HH:mm:ss");
        const endDate = moment(`${SPARE_DATE} ${endTime}`,"DD/MM/YYYY HH:mm:ss");
        const breakDate = moment(`${SPARE_DATE} ${BREAK_TIME}`,"DD/MM/YYYY HH:mm:ss");    
        const MIDNIGHT_DATE = moment(`${SPARE_DATE} ${MIDNIGHT}`,"DD/MM/YYYY HH:mm:ss");    
        const workStart = moment(`${SPARE_DATE} ${WORK_START_TIME}`,"DD/MM/YYYY HH:mm:ss");
        const workEnd = moment(`${SPARE_DATE} ${WORK_END_TIME}`,"DD/MM/YYYY HH:mm:ss");
        let startDiff;
        let endDiff;
        let timeDiff;
        startDiff = workEnd.diff(startDate,"minutes"); // 2 saat
        if(dayDiff === 0 || endDate.isBefore(startDate)) {
            timeDiff = endDate.diff(startDate,"minutes");
        } else  {           
            // endDiff = endDate.diff(workStart,"minutes"); //  0
            // timeDiff = startDiff + endDiff;
            timeDiff = endDate.diff(startDate,"minutes");
        }        
        console.log("Start DIFF: ", startDiff);
        console.log("End DIFF: ", endDiff);     
       
       
        // If the times contains break time, exclude from calculation
        if(breakDate.isBetween(startDate,endDate)) {
            timeDiff = timeDiff - 60;
        }      
        
        return timeDiff;
    }

    const handleDuration = async (selectedEndDate, selectedStartDate) => {
              
        const _selectedStartDate = moment.isMoment(selectedStartDate) ? selectedStartDate.format() : selectedStartDate;
        const _selectedEndDate = moment.isMoment(selectedEndDate) ? selectedEndDate.format() : selectedEndDate;         

        const [startDate,startTime] = _selectedStartDate.toString().split('T');
        const [endDate,endTime] = _selectedEndDate.toString().split('T');         

        const dayDiff = await moment(endDate).businessDiff(moment(startDate));      
        const timeDiff = _getTimeDifference(startTime,endTime, dayDiff);
        const duration = _calculateLeaveDuration(dayDiff,timeDiff);      
       
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
            description, protocolNumber, isPrivacyPolicyApproved, status }
        await props.firebase.sendNewLeaveRequest(requestFormObj).then(response => {
            setIsLoading(false);
        })
        console.log(requestFormObj);       
    }

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
    }, []);
    
    
    // Approver obj, it can be changed into props
    const approvers = [
        {
            name: "Onur Tepeli"
        },
        {
            name: "Bekir Semih Turgut"
        }
    ]

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
                                            className={(errors.kvkkCheck) ? classes.kvkkCheckBox: ''}
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
