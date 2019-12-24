import React, { useState, useRef } from 'react';
import { Grid,Fab, Grow, Paper, Popper, MenuItem, MenuList } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(theme => ({
    moreButton: {
        // backgroundColor: 'transparent',
    },


}));
export const MoreDialog = (props)=>{
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    // const handleMenuItemClick = (event) => {
    //     props.onSelectedFilterTypeChanged(event);
    //     setOpen(false);
    // };
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
                            <Fab ref={anchorRef}
                            className={classes.moreButton}
                            color="primary"
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                        <MoreVertIcon></MoreVertIcon>
                    </Fab>
                    <Popper open={open} style={{ zIndex: 2 }} placement="bottom" anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',

                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu">
                                            <MenuItem key="1" 
                                            value="1"
                                            >
                                                Approve
                                            </MenuItem>
                                            <MenuItem key="2" value="2">
                                                Reject
                                            </MenuItem>
                                            <MenuItem key="3" value="3">
                                                Details
                                            </MenuItem>
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

