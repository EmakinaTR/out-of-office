import React, { useState,useRef} from 'react';
import { Button, Select, FormControl, Typography, InputLabel, MenuItem, Badge, IconButton, Box, Drawer, SwipeableDrawer} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { leaveBadges } from '../../../constants/badgeTypes';
import { KeyboardDatePicker, MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import FilterListIcon from '@material-ui/icons/FilterList';
import OrderByFilter from '../orderByFilter';
import SearchFilter from '../searchFilter/SearchFilter';
import MomentUtils from '@date-io/moment';


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 3),
    },
    title: {
        textAlign: 'center'
    },
    formElements: {
       margin :theme.spacing(1,0),
       minWidth: 120,
    },
   drawer : {
       width : '300px',
       zIndex:'1000'
   },
    drawerContent:{
        marginTop:'50px',
        height : '100%',
        display:'flex',
        flexDirection:'column',
        justifyContent :'flex-start',
        padding : theme.spacing(2,5)
    },
    closeButton :{
        height : '64px',
        width : '64px',
        padding:theme.spacing(2,2)
    },
    filtersHeader:{
        margin:theme.spacing(0,2),
        marginTop:theme.spacing(2),
    },
    commandButtons :{
        marginTop: theme.spacing(2),
        display:'flex',
        flexDirection:'column'
    }
    
}));
export function FilterBox(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
  
    // const onChange = (e)  => {
    //     setState({ ...state,[e.target.name]: e.target.value });
    // }
    // const onStartDateChange = date => {
    //     setState({
    //         ...state, from: date._d
    //     });
    // }
    // const onEndDateChange = date => {
    //     setState({
    //         ...state, to: date._d
    //     });
    // }
    const onToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };
    const onClose = event => {
        setOpen(false);
    };
    const onFilterClick = (e)=>{
        props.onFilterBoxClick();
        setOpen(false);
    }

    const toggleDrawer = (side, open) => event => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen( open => !open );
    };
  
    return (
        <Box>
            <IconButton aria-label="show-hide filters" ref={anchorRef} onClick={onToggle}>
                <Badge color="secondary" variant="dot" invisible={props.filterBoxState !== undefined && props.filterBoxState.length !== 0  ? false : true} ><FilterListIcon /></Badge>
            </IconButton>
            <SwipeableDrawer
                className={classes.drawer}
                anchor="right"
                variant="temporary"
                // ModalProps={{ keepMounted: true }}
                open={open}
                onClose={toggleDrawer('right', false)}
                onOpen={toggleDrawer('right', true)}
            >
                    {/* <ClickAwayListener onClickAway={onClose}> */}
                    
                    <div className={classes.drawerContent}>
                    <Typography className={classes.filtersHeader} variant="h5">Filters</Typography>
                    <FormControl className={classes.formElements}>
                        <InputLabel >Leave Type</InputLabel>
                        <Select
                            name="leaveType"
                            onChange={props.onFilteredLeaveTypeChange}
                            defaultValue="-1"

                        >
                            <MenuItem value="-1">
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
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            name="startDate"
                            disableToolbar
                            label="From"
                            format='MM/DD/YYYY'
                            margin="normal"
                            className={classes.formElements}
                            value={props.filteredDates.from}
                            onChange={props.onStartDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />

                        <KeyboardDatePicker
                            name="endDate"
                            disableToolbar
                            label="To"
                            format='MM/DD/YYYY'
                            margin="normal"
                            className={classes.formElements}
                            value={props.filteredDates.to}
                            onChange={props.onEndDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        
                    </MuiPickersUtilsProvider>
                    <SearchFilter

                        className={classes.formElements}
                        onChange={props.onSearchQueryChange}
                    >
                    </SearchFilter>
                    <OrderByFilter
                        className={classes.formElements}
                        options={props.orderByFilterOptions}
                        onFilterDirectionChanged={props.onFilterDirectionChanged}
                        A_to_Z={props.A_to_Z}
                        selectedFilterField={props.selectedFilterField}
                        onSelectedFilterFieldChanged={props.onSelectedFilterFieldChanged}
                    >

                    </OrderByFilter>
                    <div className={classes.commandButtons} >
                        <Button className={classes.formElements} variant="outlined" onClick={onFilterClick}>Filter</Button>
                        <Button className={classes.formElements} variant="outlined" onClick={onClose}>Cancel</Button>
                    </div>
                    
                        
               </div>
                    {/* </ClickAwayListener> */}

            </SwipeableDrawer>
            </Box>
    );
}