import React, { useState, useRef } from 'react';
import { Grid, Fab, Grow, Paper, Popper, MenuItem, MenuList, 
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,Slide,Button } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { MoreVert, Check, Close, Visibility } from '@material-ui/icons';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles(theme => ({
    moreButton: {
        // backgroundColor: 'transparent',
    },
}));
export const MoreDialog = (props)=>{
    const classes = useStyles();
    const [openMenu, setOpenMenu] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [statusType, setStatusType] = useState([]);
    const anchorRef = useRef(null);
    const handleToggle = () => {
        setOpenMenu(prevOpen => !prevOpen);
    };
    const handleCloseMenu = event => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpenMenu(false);
    };
    const showDialog = () => {
        setOpenDialog(true);
        setStatusType([]);
    };

    const closeDialog = () => {
        setOpenDialog(false);
    };
    const handleApproveReject =(e) => {
        setOpenMenu(false);
        showDialog();
        setStatusType(e.target.value)
    }
    const handleYesClick = ()=> {
        props.changeFormStatusHandler(props.document,statusType);
        closeDialog();
    }
        return (
            <Grid container direction="column" alignItems="center">
                <Grid item xs={12}>
                            <Fab ref={anchorRef}
                            className={classes.moreButton}
                            color="primary"
                            size="small"
                            aria-controls={openMenu ? 'split-button-menu' : undefined}
                        aria-expanded={openMenu ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                        <MoreVert></MoreVert>
                    </Fab>
                    <Dialog
                        open={openDialog}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={closeDialog}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">{"İyice düşündünüz mü?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                Form üzerinde yapmış olduğunuz değişiklikler kalıcı olacaktır. Devam etmek istiyor musunuz ? 
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={handleYesClick} color="secondary">
                                Evet
                            </Button>
                            <Button variant="contained" onClick={closeDialog} color="primary">
                                Vazgeçtim
                            </Button>
                        </DialogActions>
                        </Dialog>
                    <Popper open={openMenu} style={{ zIndex: 2 }} placement="bottom" anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleCloseMenu}>
                                        <MenuList id="split-button-menu">
                                            <MenuItem key="1" value="1" onClick={handleApproveReject}>
                                                <Check htmlColor="green" style={{marginRight:'12px'}}></Check>Approve
                                            </MenuItem>
                                            <MenuItem key="2" value="2" onClick={handleApproveReject}>
                                                <Close htmlColor="red" style={{ marginRight: '12px' }}></Close>Reject
                                            </MenuItem>
                                            <MenuItem key="3" value="3" onClick={props.detailHandler}>
                                                <Visibility htmlColor="primary" style={{ marginRight: '12px' }}></Visibility>Details
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

