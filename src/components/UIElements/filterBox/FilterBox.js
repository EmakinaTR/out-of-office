import React, { useState,useRef,useEffect} from 'react';
import { Grid, Button, Grow, Paper, Popper, Select, FormControl, InputLabel, MenuItem, Badge, IconButton, Box} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { statusBadges, leaveBadges } from '../../../constants/badgeTypes';
import { KeyboardDatePicker, MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import FilterListIcon from '@material-ui/icons/FilterList';
import moment from 'moment';
import MomentUtils from '@date-io/moment';

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
    },
    paper:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        padding:theme.spacing(2)
    },
    // removeButton:{
    //     display: props => props.filterBoxState != undefined && props.filterBoxState.length != 0 ? 'block':'none',
    //     position:'absolute',
    //     top:'-20px',
    //     right:'-20px',
    //     height:'32px',
    //     width:'32px'
    // }
}));
export function FilterBox(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [state,setState] = useState({
        startDate : moment(),
        endDate : moment(),
        leaveType : ''
    })
    const handleChange = (e)  => {
        setState({ ...state,[e.target.name]: e.target.value });
    }
    const handleStartDateChange = date => {
        setState({
            ...state, startDate: date.toJSON()
        });
      
    }
    const handleEndDateChange = date => {
        setState({
            ...state, endDate: date.toJSON()
        });
    }
    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };
    const handleClose = event => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    const onFilterClick = (e)=>{
        props.onFilterBoxClick(state);
        setOpen(false);
    }
    // useEffect(() => {
    // }, [state]);
    return (
        <Box>
            <IconButton aria-label="show-hide filters" ref={anchorRef} onClick={handleToggle}>
            <Badge color="secondary" variant="dot" invisible={props.filterBoxState !== undefined && props.filterBoxState.length !== 0  ? false : true} ><FilterListIcon /></Badge>
            </IconButton>
                {/* <Button style={{position: 'relative'}} ref={anchorRef} color= variant="outlined" component="span" onClick={handleToggle}>
                <Badge color="primary" variant="dot" invisible={props.filterBoxState != undefined && props.filterBoxState.length != 0  ? "primary" : ""} ><FilterListIcon fontSize="small" /></Badge>
                </Button> */}
                <Popper open={open} style={{zIndex:2 }} placement="bottom" anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                            }}
                        >
                            <Paper className={classes.paper} >
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                                <KeyboardDatePicker
                                                    name="startDate"
                                                    disableToolbar
                                                    label="Start Date"
                                                    format='MM/DD/YYYY'
                                                    margin="normal"
                                                    value={state.startDate}
                                                    onChange={handleStartDateChange}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                />
                                            
                                                <KeyboardDatePicker
                                                    name="endDate"
                                                    disableToolbar
                                                    label="End Date"
                                                    format='MM/DD/YYYY'
                                                    margin="normal"
                                                    value={state.endDate}
                                                    onChange={handleEndDateChange}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                />
                                                <FormControl  className={classes.formControl}>
                                                    <InputLabel >Leave Type</InputLabel>
                                                    <Select
                                                        // native
                                                        // value={state.leaveType}
                                                        // onChange={handleChange('leaveType')}
                                                        // labelWidth={labelWidth}
                                                        name="leaveType"
                                                        onChange={handleChange}

                                                    >
                                                        <MenuItem value="">
                                                            <em>None</em>
                                                        </MenuItem>
                                                        {Object.keys(leaveBadges).map((option) => (
                                                            <MenuItem
                                                                key={option}
                                                                value={option}
                                                                
                                                            >
                                                                {leaveBadges[option].badgeContent}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <Button variant="outlined" onClick={onFilterClick}>Filter</Button>
                                    </MuiPickersUtilsProvider>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </Box>
    );
}