import moment from 'moment';
import React, {useRef, useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Container, FormControl, InputLabel, Select, Grid, TextField, Divider, Box, Checkbox, 
Link, Button, Typography, Chip, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, 
DialogTitle, useMediaQuery } from '@material-ui/core';
import NativeSelect from '@material-ui/core/NativeSelect';
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

export default function LeaveRequestForm(props) {
    const location = useLocation();
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
        // This part will come dynamicly
        staticLeaveType: 'Mazeret İzni'
    });
    const [labelWidth, setLabelWidth] = useState(0);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [checked, setChecked] = useState(true);
    const [open, setOpen] = useState(false);
    const [fields, setFields] = useState({});
    
   
      
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

    const printLeaveRequest = () => {
        console.log("print");
    }

    // Firebase Functions
    let getFormFields = async () => {
        let uid = queryString.parse(location.search).formId;
        let firebasePromise = props.firebase.getSpecificLeaveRequestWithId(uid);
        let formFields = {};
        if (firebasePromise !== null) {
            await firebasePromise.then(snapshot => {
                formFields = snapshot.data();
                setFields(formFields);
            })
        }
    }

    // Lifecycle Methods
    useEffect(() => {
        // console.log(queryString.parse(location.search))
        // console.log(props.firebase.getSpecificLeaveRequestWithId(queryString.parse(location.search).formId))
        getFormFields();
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
                <Typography variant="h5" component="h2" align="center" gutterBottom>Leave Request Detail</Typography>
                <Box marginTop={2}>
                    <TextField className={classes.inputWidth} label="Leave Type" variant="outlined" margin="normal" value="Excuse Leave" InputProps={{readOnly: true,}} />
                </Box>
                   
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={4}>
                                <TextField className={classes.inputWidth} label="Leave Start" variant="outlined" margin="normal" value="11.11.2019 - 9:00" InputProps={{readOnly: true,}} />
                            </Grid>
                            <Grid item xs={12} lg={4}>
                                <TextField className={classes.inputWidth} label="Leave End" variant="outlined" margin="normal" value="12.11.2019 - 9:00" InputProps={{readOnly: true,}} />
                            </Grid>
                            <Grid item xs={12} lg={4}>
                            <TextField className={classes.inputWidth} label="Leave Duration" variant="outlined" margin="normal" value="2" InputProps={{readOnly: true,}} />
                            </Grid>
                        </Grid>
                    
                    
                    
                    <TextField className={classes.inputWidth} disableAnimation multiline rows="4" label="Description" variant="outlined" margin="normal" value={fields.description || ''}
                    InputProps={{readOnly: true}}
                    />
                    <TextField className={classes.inputWidth} label="Rapor Protokol No (Mazeret)" margin="normal" variant="outlined" value="UA234XCWQ" InputProps={{readOnly: true,}} />
                    <Box marginY={1}>
                    
                        <Typography variant="caption" component="div">Approver</Typography>
                        {approvers.map((item, index) => {
                                return  <Box key={index} component="span">
                                            <Chip avatar={<Avatar>{item.name.charAt(0)}</Avatar>} label={item.name} style={{margin:".25rem .5rem .25rem 0"}} />
                                        </Box>; 
         
                            })}
                    </Box>
                    <TextField className={classes.inputWidth} label="Date of Record" variant="outlined" margin="normal" value="10.11.2019 - 9:00" InputProps={{readOnly: true,}} />
                    <Box my={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Button className={classes.inputWidth} variant="contained" size="large" type="submit" color="primary">EDIT</Button>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button className={classes.inputWidth} variant="outlined" size="large" color="primary" onClick={printLeaveRequest}>PRINT</Button>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button className={classes.inputWidth} variant="outlined" size="large">Cancel Request</Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box my={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Button className={classes.inputWidth} variant="contained" size="large" type="submit" color="primary">Approve</Button>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button className={classes.inputWidth} variant="outlined" size="large" color="primary" onClick={printLeaveRequest}>PRINT</Button>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button className={classes.inputWidth} variant="outlined" size="large">Reject</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </Paper>
            </Box>
        </Container>
    )
}
