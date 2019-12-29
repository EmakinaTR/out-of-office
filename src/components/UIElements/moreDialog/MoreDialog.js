import React, { useState, useRef,useContext } from 'react';
import { Grid, Fab, Grow, Paper, Popper, MenuItem, MenuList, 
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,Slide,Button, IconButton } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { MoreVert, Check, Close, Visibility, Block, Edit } from '@material-ui/icons';
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
            <div>
                <IconButton ref={anchorRef} aria-controls={openMenu ? 'split-button-menu' : undefined}
                        aria-expanded={openMenu ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle} component="span">
            <MoreVert />
          </IconButton>
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
                                        {(props.from == "IncomingRequest" && props.leaveHasntBegin && props.requestStatus === 0 ) ?
                                            (< MenuItem value="1" onClick={handleApproveReject}>
                                                <Check htmlColor="green" style={{ marginRight: '12px' }}></Check>Approve
                                            </MenuItem>)
                                        : undefined}
                                        {(props.from == "IncomingRequest" && props.leaveHasntBegin && props.requestStatus === 0) ? (
                                            <MenuItem value="2" onClick={handleApproveReject}>
                                                <Close htmlColor="red" style={{ marginRight: '12px' }}></Close>Reject
                                            </MenuItem>
                                        )
                                        : undefined}
                                            <MenuItem value="3" onClick={() => props.detailHandler(props.document)}>
                                                <Visibility htmlColor="primary" style={{ marginRight: '12px' }}></Visibility>Details
                                            </MenuItem>
                                        {((props.from == "IncomingRequest" && props.leaveHasntBegin && props.requestStatus === 1)
                                        ||
                                            (props.from == "MyRequest" && !props.leaveHasntBegin && props.requestStatus === 0)) ? (<MenuItem value="4" >
                                            <Block htmlColor="red" style={{ marginRight: '12px' }}></Block>Cancel
                                            </MenuItem>)
                                        :undefined}
                                        {(props.from == "MyRequest" && props.leaveHasntBegin && props.isFormOwner && props.requestStatus === 0) ? 
                                        (<MenuItem value="4" >
                                            <Edit htmlColor="primary" style={{ marginRight: '12px' }}></Edit>Edit
                                        </MenuItem>) 
                                        : undefined}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </div>
        );
    }

