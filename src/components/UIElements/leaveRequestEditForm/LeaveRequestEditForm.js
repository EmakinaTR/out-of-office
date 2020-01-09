import moment from 'moment-business-days';
import React, {useRef, useState, useEffect} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Container, FormControl, InputLabel, Select, Grid, TextField, Box, Checkbox, 
Link, Button, Typography, Chip, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, 
DialogTitle, OutlinedInput, useMediaQuery } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import SnackBar from "../snackBar/SnackBar";
import { snackbars } from "../../../constants/snackbarContents";
import { useForm } from "react-hook-form";
import AuthContext from "../../session";
import * as durationCalculationUtil from '../../../utils/durationCalculationUtils';
const queryString = require('query-string');

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(3, 3),
    },
    title: {
        textAlign: 'center'
    },
    formControl: {
        // margin: theme.spacing(1, 0),
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

export default function LeaveRequestEditForm(props) {
    // Styles
    const classes = useStyles();
    // History
    let history = useHistory();
    // Location
    const location = useLocation();
    // Refs
    const inputLabel = useRef(null);
    // Theme
    const theme = useTheme();
    // MediaQuery
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    // Default Date
    const defaultDate = moment().format('YYYY-MM-DDTHH:mm:ss');
    // Form Validation
    const {register, handleSubmit, errors, watch, setValue} = useForm();
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
    const [docUid, setDocUid] = useState('');
    const [approvers, setApprovers] = useState([]);
    const [snackbarState, setSnackbarState] = useState(false);
    const [snackbarType, setSnackbarType] = useState({});
    
     // Handle Methods
     const handleChange = name => event => {
        const {value} = event.target;
        setState({
        ...state,
        [name]: value,
        });
        console.log(value);
    };

    // Desktop DateTimePickers
    const handleStartDateChange = date => {
        setSelectedStartDate(date);
    }

    const handleEndDateChange = date => {
        setSelectedEndDate(date);
    }

    const handleDuration = async (selectedEndDate, selectedStartDate) => {
              
        const _selectedStartDate = moment.isMoment(selectedStartDate) ? selectedStartDate.format() : selectedStartDate;
        const _selectedEndDate = moment.isMoment(selectedEndDate) ? selectedEndDate.format() : selectedEndDate;         

        const [startDate,startTime] = _selectedStartDate.toString().split('T');
        const [endDate,endTime] = _selectedEndDate.toString().split('T');         

        const dayDiff = await moment(endDate).businessDiff(moment(startDate));      
        const [timeDiff,isStartTimeAfter] = durationCalculationUtil.getTimeDifference(startTime,endTime, dayDiff);        
        const duration = durationCalculationUtil.calculateLeaveDuration(dayDiff,timeDiff,isStartTimeAfter);      
       
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
        e.preventDefault();
        if (!isSelectedStartDateGraterThanSelectedEndDate(selectedStartDate, selectedEndDate)) {
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
            
            await props.firebase.updateLeaveRequest(docUid, requestFormObj).then(response => {
                setSnackbarState(true);
                setSnackbarType(snackbars.success);
            });
            console.log(requestFormObj);
        }
        
    }

    // Check if user has negative leave credit
    const isLeaveCreditNegative = (duration) => props.user.annualCredit + props.user.excuseCredit - duration < 0;
    
    // Check if start date is greater than end date
    const isSelectedStartDateGraterThanSelectedEndDate = (start, end) => moment(start).isAfter(moment(end));

    const cancel = () => {
        history.push({
            pathname: '/request-detail',
            search: '?formId='+ docUid,
        })
    }

    //Firebase

    // Firebase functions
    let getAllLeaveTypes = async () => {
        let firebasePromise = props.firebase.getAllLeaveTypes();
        let leaveTypesArr = [];
        if (firebasePromise !== null) {
            await firebasePromise.then(snapshot => {
                for (let doc of snapshot.docs) {
                    leaveTypesArr.push(doc.data())
                }
                setLeaveTypes(leaveTypesArr);
            });
        }
    }

    const getLeaveTypeId = (ref) => {
        return new Promise( (resolve,reject) => {
            let firebasePromise = props.firebase.getLeaveTypeOfGivenReference(ref);
            let id = '';
            if (firebasePromise !== null) {
                 firebasePromise.then(snapshot => {
                   id = snapshot.id;
                   resolve(id);   
                }).catch((error) => {
                    reject(error);
                }) 
            }            
        });
    }
       
    const getFormFields = async () => {
        const uid = queryString.parse(location.search).formId;
        setDocUid(uid);
        let firebasePromise = props.firebase.getSpecificLeaveRequestWithId(uid);
        let formFields = {};
        if (firebasePromise !== null) {
            await firebasePromise.then(snapshot => {
                formFields = snapshot.data();
                getLeaveTypeId(formFields.leaveTypeRef?.path).then(id => {                   
                    setValue("description", formFields.description)
                    setValue("leaveType", id)
                    setState({
                        protocolNumber: formFields.protocolNumber,
                    })
                })
                setSelectedStartDate(moment(formFields.startDate?.seconds*1000).format('YYYY-MM-DDTHH:mm:ss'));
                setSelectedEndDate(moment(formFields.endDate?.seconds*1000).format('YYYY-MM-DDTHH:mm:ss'));
                setDateTimeLocalStart(moment(formFields.startDate?.seconds*1000).format('YYYY-MM-DDTHH:mm:ss'));
                setDateTimeLocalEnd(moment(formFields.endDate?.seconds*1000).format('YYYY-MM-DDTHH:mm:ss'));
            })
        }
        console.log(formFields);
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
        getFormFields();
        getApproversWithId();
        addResizeEvent();
    }, []);

    return (
        <Container maxWidth="lg">
            <Box marginY={4}>
                {console.log(watchFields)}
                <Paper className={classes.root}>
                    <form className={classes.form}>
                        <Typography variant="h5" component="h2" align="center" gutterBottom>Leave Request Edit</Typography>
                        <Box marginTop={2}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel ref={inputLabel} shrink>Leave Type</InputLabel>
                                <Select
                                    native
                                    labelWidth={labelWidth}
                                    input = {
                                        <OutlinedInput
                                            notched
                                            labelWidth={labelWidth}
                                            name="leaveType"
                                            inputRef={register({ required: true, minLength: 1 })}
                                            error={errors.leaveType}
                                        />
                                    }
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
                            label="Return Date and Time"
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
                                        label="Return Date"
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
                                        label="Return Time"
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
                        name="description" inputRef={register({ required: checkIfRequired(watchFields.leaveType), minLength: 5 })} error={errors.description} InputLabelProps={{shrink: true}} />
                        
                        {(watchFields.leaveType === '2') ? 
                            <TextField className={classes.inputWidth} label="Rapor Protokol No (Mazeret)" variant="outlined" margin="normal" 
                            onChange={handleChange('protocolNumber')}  defaultValue={state.protocolNumber} value={state.protocolNumber} InputLabelProps={{shrink: true}}  /> : 
                        ''
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
                                <Grid container spacing={2}>
                                    <Box clone order={{xs: 2, md: 1}}>
                                        <Grid item xs={12} md={6}>
                                            <Button className={classes.inputWidth} onClick={cancel} variant="contained" size="large">CANCEL</Button>
                                        </Grid>
                                    </Box>
                                    <Box clone order={{xs: 1, md: 2}}>
                                        <Grid item xs={12} md={6}>
                                            <Button className={classes.inputWidth} variant="contained" size="large" type="button" onClick={handleSubmit(onSubmit)} color="primary">SEND</Button>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                </Paper>
            </Box>
            <SnackBar
            snackbarType={snackbarType}
            snackBarState={snackbarState}
            onClose={() => {
                setSnackbarState(false);
                history.push({
                    pathname: '/request-detail',
                    search: '?formId='+ docUid,
                })
            }}
            ></SnackBar>
        </Container>
    )
}
