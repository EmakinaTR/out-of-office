import moment from 'moment';
import React, {useRef, useState, useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Container, FormControl, InputLabel, Select, Grid, TextField, Box, Checkbox, 
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
    // Refs
    const inputLabel = useRef(null);
    // Theme
    const theme = useTheme();
    // MediaQuery
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    // States
    const [state, setState] = useState({
        // Select component's default value is coming from here, we will give
        // this dynamically to fill leave type
        leaveType: 'excuse_leave'
    });
    const [labelWidth, setLabelWidth] = useState(0);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [checked, setChecked] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    
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
                            {/* {leaveTypes.map((index, name, value) => {
                                // return <option value={leaveTypes[index].value}>{leaveTypes[index].name}</option>
                                console.log('index -> ' + leaveTypes[1].name);
                                
                            })} */}
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
                            <Grid container spacing={2}>
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
                            <Grid container spacing={2}>
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
                    
                    <TextField className={classes.inputWidth} label="Description" multiline rows="4" variant="outlined" margin="normal" />
                    <TextField className={classes.inputWidth} label="Rapor Protokol No (Mazeret)" margin="normal" />
                    <Box my={3}>
                    <Typography variant="caption" component="div">Approver</Typography>
                    {approvers.map((item) => {
                                return  <Box component="span">
                                            <Chip avatar={<Avatar>{item.name.charAt(0)}</Avatar>} label={item.name} style={{margin:".25rem .5rem .25rem 0"}} />
                                        </Box>; 
                                        
                                        
                            })}                          
                    </Box>
                    <Box my={2}>
                         <Grid container direction="row" alignItems="center">
                                <Grid item>
                            <Checkbox
                            id="kvkk"
                            uncontrolled
                            onChange={handleCheck}
                            value="KVKK_valid"
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
                        </Box>
                    <Grid container spacing={2}>
                        <Box clone order={{xs: 2, md: 1}}>
                            <Grid item xs={12} md={6}>
                                <Button className={classes.inputWidth} variant="contained" size="large">CANCEL</Button>
                            </Grid>
                        </Box>
                        <Box clone order={{xs: 1, md: 2}}>
                            <Grid item xs={12} md={6}>
                                <Button className={classes.inputWidth} variant="contained" size="large" type="submit" color="primary">SEND</Button>
                            </Grid>
                        </Box>
                    </Grid>

                </form>
            </Paper>
            </Box>
        </Container>
    )
}
