import React, { useState, useRef, useEffect } from 'react';
import {TextField, Grow, Paper, Popper, MenuItem, MenuList, 
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,Slide,Button, IconButton } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles} from '@material-ui/core/styles';

import { MoreVert, Check, Close, Visibility, Block, Edit } from '@material-ui/icons';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles(theme => ({
    moreButton: {
        // backgroundColor: 'transparent',
    },
}));

const StatusTypes ={
    APPROVE : 1,
    REJECT : 2,
    CANCEL : 3
}
export const MoreDialog = (props)=>{

    const initialState ={
        processerDescription : '',
        statusType : undefined,
    }
    const [openMenu, setOpenMenu] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    // const [statusType, setStatusType] = useState([]);
    const [state, setState] = useState(initialState)
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
        
    };

    const closeDialog = () => {
        setOpenDialog(false);
    };
    const handleStatusChange = (newStatus) => {
        setState( state => ({ ...state, statusType: newStatus }))
        setOpenMenu( prev => false);
    }

    const handleDescriptionChange = (e)=> {
        setState({ ...state, processerDescription: e.target.value });
    }
    useEffect(() => {
        if(state.statusType != undefined)
            showDialog();
    }, [state])

    const handleYesClick = ()=> {
        console.log(state)
        props.changeFormStatusHandler(props.document, state.statusType, state.processerDescription);
        closeDialog();
    }
        return (
            <div>
                <IconButton size="small" ref={anchorRef} aria-controls={openMenu ? 'split-button-menu' : undefined}
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
                        {state.statusType !== StatusTypes.APPROVE ? 
                            <DialogContent>
                                <TextField
                                    onChange={handleDescriptionChange}
                                    fullWidth
                                    id="outlined-multiline-static"
                                    label="Description"
                                    multiline
                                    rows="4"
                                    variant="outlined"
                                />
                            </DialogContent> : (null)}

                            
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={handleYesClick} color="secondary">
                                Done
                            </Button>
                            <Button variant="contained" onClick={closeDialog} color="primary">
                                Cancel
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
                                        {(props.from === "IncomingRequest" && props.requestStatus === 0) ? //&& props.leaveHasntBegin
                                            (< MenuItem value="1" onClick={e => {
                                                handleStatusChange(e.target.value)
                                            }}>
                                                <Check htmlColor="green" style={{ marginRight: '12px' }}></Check>Approve
                                            </MenuItem>)
                                        : undefined}
                                        {(props.from === "IncomingRequest" && props.requestStatus === 0) ? ( //&& props.leaveHasntBegin
                                            <MenuItem value="2" onClick={e => {
                                                handleStatusChange(e.target.value)
                                            }}>
                                                <Close htmlColor="red" style={{ marginRight: '12px' }}></Close>Reject
                                            </MenuItem>
                                        )
                                        : undefined}
                                            <MenuItem value="4" onClick={() => props.detailHandler(props.document)}>
                                                <Visibility htmlColor="primary" style={{ marginRight: '12px' }}></Visibility>Details
                                            </MenuItem>
                                        {((props.from === "IncomingRequest" && props.leaveHasntBegin && props.requestStatus === 1)
                                        ||
                                            (props.from === "MyRequest" && !props.leaveHasntBegin && props.requestStatus === 0)) ? (
                                                <MenuItem value="3" onClick={e => {
                                                    handleStatusChange(e.target.value)
                                                }} >
                                            <Block htmlColor="red" style={{ marginRight: '12px' }}></Block>Cancel
                                            </MenuItem>)
                                        :undefined}
                                        {(props.from === "MyRequest" && props.leaveHasntBegin && props.isFormOwner && props.requestStatus === 0) ? 
                                            (<MenuItem value="5" onClick={() => props.editHandler(props.document)}>
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

