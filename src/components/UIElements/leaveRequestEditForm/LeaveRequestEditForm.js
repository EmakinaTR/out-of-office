import moment from 'moment';
import React, {useRef, useState, useEffect} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Container, FormControl, InputLabel, Select, Grid, TextField, Box, Checkbox, 
Link, Button, Typography, Chip, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, 
DialogTitle, useMediaQuery } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
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
    // States
    const [state, setState] = useState({
        leaveType: '',
        description: '',
        protocolNumber: '',
    });
    const [labelWidth, setLabelWidth] = useState(0);
    const [selectedStartDate, setSelectedStartDate] = useState(moment().format('YYYY-MM-DDTHH:mm:ss'));
    const [selectedEndDate, setSelectedEndDate] = useState(moment().format('YYYY-MM-DDTHH:mm:ss'));
    const [duration, setDuration] = useState(0);
    const [checked, setChecked] = useState(false);
    const [open, setOpen] = useState(false);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [dateTimeLocalStart, setDateTimeLocalStart] = useState(moment().format('YYYY-MM-DDTHH:mm:ss'))
    const [dateTimeLocalEnd, setDateTimeLocalEnd] = useState(moment().format('YYYY-MM-DDTHH:mm:ss'))
    // const [fields, setFields] = useState({});
    // const [leaveType, setLeaveType] = useState('');
    const [docUid, setDocUid] = useState('');
    
     // Handle Methods
     const handleChange = name => event => {
        setState({
          ...state,
          [name]: event.target.value,
        });
        console.log(event.target.value);
    };

    // Desktop DateTimePickers
    const handleStartDateChange = date => {
        setSelectedStartDate(date);
    }

    const handleEndDateChange = date => {
        setSelectedEndDate(date);
    }

    const handleDuration = async (selectedEndDate, selectedStartDate) => {
        const duration = await moment(selectedEndDate).diff(selectedStartDate, 'days')
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const uid = props.auth().uid;
        const processedBy = "";
        const createdBy = uid;
        const requesterName = props.auth().displayName;
        const status = 0;
        const requestedDate = props.firebase.convertMomentObjectToFirebaseTimestamp(moment()._d);
        const {leaveType, description, protocolNumber}  = state;
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
        
        await props.firebase.updateLeaveRequest(docUid, requestFormObj);
        console.log(requestFormObj);
    }

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
                    setState({
                        description: formFields.description,
                        protocolNumber: formFields.protocolNumber,
                        leaveType: id,
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

 

    let screenSize = () => {
       return window.innerWidth;
    }

    const addResizeEvent = async () => {
        await window.addEventListener('resize', screenSize);
    }

    // Lifecycle Methods
    useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
        getAllLeaveTypes();
        getFormFields();
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
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Typography variant="h5" component="h2" align="center" gutterBottom>Leave Request Edit</Typography>
                        <Box marginTop={2}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel ref={inputLabel}>Leave Type</InputLabel>
                                <Select
                                native
                                value={state.leaveType}
                                onChange={handleChange('leaveType')}
                                labelWidth={labelWidth}
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
                            value={dateTimeLocalStart}
                            onChange={handleDateTimeLocalStart}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            />
                            <TextField
                            margin="normal"
                            label="End Date and Time"
                            type="datetime-local"
                            defaultValue={dateTimeLocalEnd}
                            value={dateTimeLocalEnd}
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
                        onChange={handleChange('description')} defaultValue={state.description} value={state.description} InputLabelProps={{shrink: true}} />
                        
                        <TextField className={classes.inputWidth} label="Rapor Protokol No (Mazeret)" variant="outlined" margin="normal" 
                        onChange={handleChange('protocolNumber')}  defaultValue={state.protocolNumber} value={state.protocolNumber} InputLabelProps={{shrink: true}}  />
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
                                            <Button className={classes.inputWidth} variant="contained" size="large" type="submit" color="primary">SEND</Button>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    )
}
