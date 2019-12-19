import React,{useState} from 'react';
import { Grid, Button, ButtonGroup, Grow, Paper, Popper, MenuItem, MenuList, Select, InputLabel, FormControl } from '@material-ui/core';
import { ArrowDownward,ArrowUpward} from '@material-ui/icons';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {makeStyles} from '@material-ui/core/styles';

const options = ['Date', 'Leave Type', 'Name'];

export function OrderByFilter() {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [downDirecrtion, setDirection] = React.useState(true); // 0 is down direction - 1 is up direction

    const handleClick = () => {
        console.info(`You clicked ${options[selectedIndex]}`);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpen(false);
    };
    const changeDirection = () =>{
        setDirection(!downDirecrtion) ;
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

    return (
        <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
                <ButtonGroup variant="contained" color="secondary" ref={anchorRef} aria-label="split button">
                    <Button onClick={changeDirection}>
                        {downDirecrtion ?
                            <ArrowDownward style={{ marginRight: '12px' }}></ArrowDownward> :
                            <ArrowUpward style={{ marginRight: '12px' }}></ArrowUpward>
                        }
                        {options[selectedIndex]}</Button>
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
                <Popper open={open}  anchorEl={anchorRef.current} role={undefined}  transition disablePortal>
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
                                        {options.map((option, index) => (
                                            <MenuItem
                                                key={option}
                                                selected={index === selectedIndex}
                                                onClick={event => handleMenuItemClick(event, index)}
                                            >
                                                {option}
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