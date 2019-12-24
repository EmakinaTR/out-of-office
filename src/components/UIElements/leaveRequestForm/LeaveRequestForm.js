import moment from 'moment';
import React, {useRef, useState, useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Container, FormControl, FormControlLabel, InputLabel, Select, Grid, TextField, Divider, Box, Checkbox, 
Link, Button, Typography, Chip, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, 
DialogTitle, useMediaQuery } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(3, 3),
    },
    title: {
        textAlign: 'center'
    },
    formControl: {
        margin: theme.spacing(0, 0),
        minWidth: 120,
        width: '100%'
    },
    inputWidth: {
        width: '100%'
    },
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
    // States
    const [state, setState] = useState({
        leaveType: '',
        description: '',
        protocolNumber: '',
    });
    const [labelWidth, setLabelWidth] = useState(0);
    const [selectedStartDate, setSelectedStartDate] = useState(moment());
    const [selectedEndDate, setSelectedEndDate] = useState(moment());
    const [duration, setDuration] = useState('');
    const [checked, setChecked] = useState(false);
    const [open, setOpen] = useState(false);
    const [leaveTypes, setLeaveTypes] = useState([]);
    
    // Handle Methods
    const handleChange = name => event => {
        setState({
          ...state,
          [name]: event.target.value,
        });
        console.log(event.target.value);
    };

    const handleStartDateChange = date => {
        console.log(date.format("MMMM Do, YYYY [at] h:mm:ss a [UTC+3]"));
        setSelectedStartDate(date);
        console.log('START DATE: -> ', date);
    }

    const handleEndDateChange = date => {
        setSelectedEndDate(date);
        console.log('END DATE: -> ', date);
    }

    const handleDuration = async (selectedEndDate, selectedStartDate) => {
        // I used parseInt to prevent duration to be stringified in firebase
        let duration = await parseInt(Math.ceil((selectedEndDate - selectedStartDate) / (1000*60*60*24)));
        setDuration(duration);
        console.log('Duration -> ', duration);
       
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
        console.log('submit')
        const uid = props.auth().uid;
        const processedBy = props.firebase.convertUidToFirebaseRef(uid);
        const isCancelled = false;
        const status = 0;
        const requestedDate = props.firebase.convertMomentObjectToFirebaseTimestamp(moment()._d);
        const {leaveType, description, protocolNumber}  = state;
        const leaveTypeRef = props.firebase.convertLeaveTypeToFirebaseRef(leaveType);
        const isPrivacyPolicyApproved = checked;
        const startDate = props.firebase.convertMomentObjectToFirebaseTimestamp(selectedStartDate._d);
        const endDate = props.firebase.convertMomentObjectToFirebaseTimestamp(selectedEndDate._d);
        
        const requestFormObj = { requestedDate, processedBy, leaveTypeRef, startDate, endDate, duration,
            description, protocolNumber, isPrivacyPolicyApproved, isCancelled, status }
        await props.firebase.sendNewLeaveRequest(requestFormObj)
        console.log(requestFormObj);
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

    // Lifecycle Methods
    useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
        getAllLeaveTypes();
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
                    <Typography variant="h5" component="h2" align="center" gutterBottom>New Leave Request</Typography>
                    <Box>
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
                    </FormControl></Box>
                    <Box display={{xs: 'block', md: 'none'}}>
                        <TextField
                        margin="normal"
                        label="Start Date and Time"
                        type="datetime-local"
                        defaultValue={new Date()}
                        className={classes.inputWidth}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        />
                        <TextField
                        margin="normal"
                        label="End Date and Time"
                        type="datetime-local"
                        defaultValue={new Date()}
                        className={classes.inputWidth}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        />
                    </Box>
                    <Box display={{xs: 'none', md: 'block'}}>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <KeyboardDatePicker
                                    disableToolbar
                                    className={classes.inputWidth}
                                    label="Start Date"
                                    name="selectedStartDate"
                                    variant="inline"
                                    format='MM/DD/YYYY'
                                    minDate={moment()}
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
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <KeyboardDatePicker
                                    disableToolbar
                                    className={classes.inputWidth}
                                    label="End Date"
                                    variant="inline"
                                    format='MM/DD/YYYY'
                                    minDate={moment()}
                                    margin="normal"
                                    name="selectedEndDate"
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
                    onChange={handleDuration(selectedEndDate, selectedStartDate)} value={duration}/>
                    <TextField className={classes.inputWidth} label="Description" multiline rows="4" variant="outlined" margin="normal" 
                    onChange={handleChange('description')} value={state.description} />
                    <TextField className={classes.inputWidth} label="Rapor Protokol No (Mazeret)" margin="normal" 
                    onChange={handleChange('protocolNumber')} value={state.protocolNumber} />
                    <Box my={3}>
                    
                        <Typography variant="caption" component="div">Approver</Typography>

                           {approvers.map((item) => {
                                return  <Box component="span">
                                            <Chip avatar={<Avatar>{item.name.charAt(0)}</Avatar>} label={item.name} style={{margin:".25rem .5rem .25rem 0"}} />
                                        </Box>; 
                            })}
                           
                           {/* Offset */}
                        
                    </Box>
                    <Box my={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={6}>
                                <Grid container direction="row" alignItems="center">
                                <Grid item><Checkbox
                            id="kvkk"
                                checked={checked}
                                onChange={handleCheck}
                                value={checked}
                                color="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                /></Grid> 
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
