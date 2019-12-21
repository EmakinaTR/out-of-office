import React,{useState} from 'react';
import { Grid, Button, ButtonGroup, Grow, Paper, Popper, MenuItem, MenuList, Select, InputLabel, FormControl } from '@material-ui/core';
import { ArrowDownward,ArrowUpward} from '@material-ui/icons';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {makeStyles} from '@material-ui/core/styles';



export function OrderByFilter(props) {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const handleMenuItemClick = (event) => {
        props.onSelectedFilterTypeChanged(event);
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };
    const handleClose = event => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    return (
        <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
                <ButtonGroup variant="contained" color="secondary" ref={anchorRef} aria-label="split button">
                    <Button onClick={props.onFilterDirectionChanged}>
                        {props.currentDirection ?
                            <ArrowDownward style={{ marginRight: '12px' }}></ArrowDownward> :
                            <ArrowUpward style={{ marginRight: '12px' }}></ArrowUpward>
                        }
                        {props.options[props.selectedFilterType].name}
                    </Button>
                    <Button
                        color="secondary"
                        size="small"
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        <ArrowDropDownIcon  />
                    </Button>
                </ButtonGroup>
                <Popper open={open} style={{ zIndex: 2}} placement="bottom" anchorEl={anchorRef.current} role={undefined}  transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                
                            }}
                        >
                            <Paper>
                                <ClickAwayListener  onClickAway={handleClose}>
                                    <MenuList id="split-button-menu">
                                        {Object.keys(props.options).map((option) => (
                                            <MenuItem
                                                key={option}
                                                value={option}
                                                selected={option === props.selectedFilterType}
                                                onClick={handleMenuItemClick}
                                            >
                                                {props.options[option].name}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </Grid>
        </Grid>
    );
}