import moment from 'moment';
import React, {useRef, useState, useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Container, FormControl, InputLabel, Select, Grid, TextField, Divider, Box, Checkbox, 
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
        margin: theme.spacing(1, 0),
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
        leaveType: ''
    });
    const [labelWidth, setLabelWidth] = useState(0);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [checked, setChecked] = useState(true);
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

    const handleDateChange = date => {
        setSelectedDate(date);
        console.log(date._d);
    }

    const handleCheck = event => {
        setChecked(event.target.checked);
        console.log(event.target.value)
    }

    const handleDialogOpen = () => {
        setOpen(true);
        console.log('Working')
    }

    const handleDialogClose = () => {
        setOpen(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submit')
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
    useEffect(async () => {
        setLabelWidth(inputLabel.current.offsetWidth);
        await getAllLeaveTypes();
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
            <Paper className={classes.root}>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <h2 style={{textAlign: 'center'}}>Leave Request</h2>
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
                    <Box my={2}>
                        <Divider />
                    </Box>
                    <Box display={{xs: 'block', md: 'none'}}>
                        <TextField
                        id="datetime-local"
                        margin="normal"
                        label="Start Date and Time"
                        type="datetime-local"
                        defaultValue={moment()}
                        className={classes.inputWidth}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        />
                        <TextField
                        id="datetime-local"
                        margin="normal"
                        label="End Date and Time"
                        type="datetime-local"
                        defaultValue="2017-05-24T10:30"
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
                                    variant="inline"
                                    format='MM/DD/YYYY'
                                    minDate={new Date()}
                                    margin="normal"
                                    value={selectedDate}
                                    onChange={date => handleDateChange(date)}
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
                                    value={selectedDate}
                                    onChange={handleDateChange}
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
                                    minDate={new Date()}
                                    margin="normal"
                                    value={selectedDate}
                                    onChange={date => handleDateChange(date)}
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
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                    />
                                </Grid>
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </Box>
                    <TextField className={classes.inputWidth} label="Leave Duration" variant="filled" margin="normal" InputProps={{readOnly: true,}} />
                    <Box my={2}>
                        <Divider />
                    </Box>
                    <TextField className={classes.inputWidth} label="Description" multiline rows="4" variant="outlined" margin="normal" />
                    <TextField className={classes.inputWidth} label="Rapor Protokol No (Mazeret)" margin="normal" />
                    <Box my={3}>
                    <Grid container>
                            <Grid item xs={12} md={2}>
                                <Typography>Approver</Typography>
                            </Grid>
                           <Grid item xs={12} md={5}>
                           {approvers.map((item) => {
                                return  <Box component="span" marginRight={1}>
                                            <Chip avatar={<Avatar>{item.name.charAt(0)}</Avatar>} label={item.name} />
                                        </Box>; 
                            })}
                           </Grid>
                           {/* Offset */}
                           <Grid item md={7} implementation="css" smDown component="hidden" />
                        </Grid>
                    </Box>
                    <Box my={2}>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <Checkbox
                                uncontrolled
                                onChange={handleCheck}
                                value="KVKK_valid"
                                color="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                                <Box component="span" marginRight={1}>Agree with Terms and Conditions</Box>
                                <Link style={{cursor: 'pointer'}} onClick={handleDialogOpen}>KVKK Contract</Link>
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
                            <Grid item xs={12} md={6}>
                                <Button className={classes.inputWidth} variant="contained" size="large" type="submit" color="primary">SEND</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </Paper>
        </Container>
    )
}
