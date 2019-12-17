import moment from 'moment';
import React, {useRef, useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { FormControl, InputLabel, Select, Grid, TextField, Divider, Box, Checkbox, Link, Button } from '@material-ui/core';
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
    }
  }));

export default function LeaveRequestForm() {
    // Styles
    const classes = useStyles();
    // Refs
    const inputLabel = useRef(null);
    // States
    const [state, setState] = useState({
        leaveType: ''
    });
    const [labelWidth, setLabelWidth] = useState(0);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [checked, setChecked] = React.useState(true);
    // Lifecycle Methods
    useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
      }, []);
      
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

    return (
        <Container maxWidth="md">
            <Paper className={classes.root}>
                <form className={classes.form}>
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
                            <option value={'annual_leave'}>Annual Leave</option>
                            <option value={'excuse_leave'}>Excuse Leave</option>
                            <option value={'0-2_hours'}>0-2 Hours</option>
                            <option value={'remote_working'}>Remote Working</option>
                            <option value={'unpaid_vacation'}>Unpaid Vacation</option>
                            <option value={'marriage'}>Marriage</option>
                            <option value={'paternity'}>Paternity Leave</option>
                            <option value={'other'}>Other</option>
                        </Select>
                    </FormControl>
                    <Box my={2}>
                        <Divider />
                    </Box>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                    <TextField className={classes.inputWidth} label="Leave Duration" variant="filled" margin="normal" disabled />
                    <Box my={2}>
                        <Divider />
                    </Box>
                    <TextField className={classes.inputWidth} label="Description" multiline rows="4" variant="outlined" margin="normal" />
                    <TextField className={classes.inputWidth} label="Rapor Protokol No (Mazeret)" margin="normal" />
                    <Grid item margin="normal" style={{textAlign: 'right'}}>
                        <Link href="#">KVKK Contract</Link>
                        <Checkbox
                        uncontrolled
                        onChange={handleCheck}
                        value="KVKK_valid"
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </Grid>
                    <Box style={{display: 'flex', justifyContent: 'center'}}>
                        <Button variant="contained" size="large" type="submit" color="primary">SEND</Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    )
}
