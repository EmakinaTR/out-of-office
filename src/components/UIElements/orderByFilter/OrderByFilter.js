import React,{useState,useRef} from 'react';
import { Grid, Button, ButtonGroup, Grow, Paper, Popper, MenuItem, MenuList} from '@material-ui/core';
import { ArrowDownward,ArrowUpward} from '@material-ui/icons';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {makeStyles} from '@material-ui/core/styles';



export function OrderByFilter(props) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
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
        <Grid container direction="column" alignItems="right">
            <Grid item xs={12}>
                <ButtonGroup variant="outlined" size="small" ref={anchorRef} aria-label="split button">
                    <Button onClick={props.onFilterDirectionChanged}>
                        {props.currentDirection ?
                            <ArrowDownward fontSize="small" style={{ marginRight: '12px' }}></ArrowDownward> :
                            <ArrowUpward fontSize="small" style={{ marginRight: '12px' }}></ArrowUpward>
                        }
                        {props.options[props.selectedFilterType].name}
                    </Button>
                    <Button
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        <ArrowDropDownIcon fontSize="small" />
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