import moment from 'moment';
import React, {useRef, useState, useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Container, FormControl, InputLabel, Select, Grid, TextField, Divider, Box, Checkbox, 
Link, Button, Typography, Chip, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, 
DialogTitle, useMediaQuery } from '@material-ui/core';

import NativeSelect from '@material-ui/core/NativeSelect';
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
        leaveType: '',
        // This part will come dynamicly
        staticLeaveType: 'Mazeret İzni'
    });
    const [labelWidth, setLabelWidth] = useState(0);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [checked, setChecked] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    
    // // Lifecycle Methods
    // useEffect(() => {
    //     setLabelWidth(inputLabel.current.offsetWidth);
    //   }, []);
      
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
                    <h2 style={{textAlign: 'center'}}>Leave Request Detail</h2>
                    <TextField className={classes.inputWidth} label="Leave Type" variant="outlined" margin="normal" value="Excuse Leave" InputProps={{readOnly: true,}} />
                    <Box my={2}>
                        <Divider />
                    </Box>
                    <Box my={2}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <TextField className={classes.inputWidth} label="Leave Start" margin="normal" value="11.11.2019 - 9:00" InputProps={{readOnly: true,}} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField className={classes.inputWidth} label="Leave End" margin="normal" value="12.11.2019 - 9:00" InputProps={{readOnly: true,}} />
                            </Grid>
                        </Grid>
                    </Box>
                    <TextField className={classes.inputWidth} label="Leave Duration" variant="outlined" margin="normal" value="2" InputProps={{readOnly: true,}} />
                    <Box my={2}>
                        <Divider />
                    </Box>
                    <TextField className={classes.inputWidth}  multiline rows="4" label="Description" variant="outlined" margin="normal" value="İşim vardı" 
                    InputProps={{readOnly: true,}}
                    />
                    <TextField className={classes.inputWidth} label="Rapor Protokol No (Mazeret)" margin="normal" value="UA234XCWQ" InputProps={{readOnly: true,}} />
                    <Box my={3}>
                        <Grid container>
                            <Grid item xs={12} md={2}>
                                <Typography>Approver</Typography>
                            </Grid>
                           <Grid item xs={12} md={5}>
                                <Box component="span" marginRight={1}>
                                    <Chip avatar={<Avatar>{approvers[0].name.charAt(0)}</Avatar>} label={approvers[0].name} />
                                </Box>
                                <Box component="span" marginRight={1}>
                                    <Chip avatar={<Avatar>{approvers[1].name.charAt(0)}</Avatar>} label={approvers[1].name} />
                                </Box>
                           </Grid>
                           {/* Offset */}
                           <Grid item md={7} implementation="css" smDown component="hidden" />
                        </Grid>
                    </Box>
                    <TextField className={classes.inputWidth} label="Date of Record" margin="normal" value="10.11.2019 - 9:00" InputProps={{readOnly: true,}} />
                    <Box my={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Button className={classes.inputWidth} variant="contained" size="large" type="submit" color="primary">EDIT</Button>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button className={classes.inputWidth} variant="contained" size="large" color="secondary" onClick={printLeaveRequest}>PRINT</Button>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button className={classes.inputWidth} variant="contained" size="large" color="secondary">CANCEL</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </Paper>
        </Container>
    )
}
