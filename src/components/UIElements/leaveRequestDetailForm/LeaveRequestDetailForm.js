import moment from 'moment';
import React, {useRef, useState, useEffect} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Container, Grid, TextField, Box, Button, Typography, Chip, Avatar } from '@material-ui/core';
import { ROLE } from "../../../constants/roles";
const queryString = require('query-string');

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

export default function  LeaveRequestForm(props)  {
    // Admin Check
    const isAdmin = props.user.role >= ROLE.APPROVER;
    // History
    let history = useHistory();
    // Location
    const location = useLocation();
    // Styles
    const classes = useStyles();
    // States
    const [fields, setFields] = useState({});
    const [leaveType, setLeaveType] = useState('');
    const [docUid, setDocUid] = useState('');
    const [approvers, setApprovers] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const editLeaveRequest = () => {
        history.push({
            pathname: '/request-edit',
            search: '?formId='+ docUid,
        })
    }

    const printLeaveRequest = () => {
        window.print();
    }

    const approveLeaveRequest = () => {
        props.firebase.setLeaveStatus(docUid, 1);
    }

    const rejectLeaveRequest = () => {
        props.firebase.setLeaveStatus(docUid, 2);
    }

    const cancelLeaveRequest = () => {
        props.firebase.setLeaveStatus(docUid, 3);
    }

    // Firebase Functions
    const getFormFields = async () => {
        const uid = queryString.parse(location.search).formId;
        setDocUid(uid);
        let firebasePromise = props.firebase.getSpecificLeaveRequestWithId(uid);
        let formFields = {};
        if (firebasePromise !== null) {
            await firebasePromise.then(snapshot => {
                formFields = snapshot.data();
                setFields(formFields);
                getLeaveTypeName(formFields.leaveTypeRef?.path);
            })
        }
        console.log(formFields);
    }

    const getLeaveTypeName = async (ref) => {
        let firebasePromise = props.firebase.getLeaveTypeOfGivenReference(ref);
        if (firebasePromise !== null) {
            await firebasePromise.then(snapshot => {
                setLeaveType(snapshot.data().name);        
            }).catch((error) => {
                console.log(error);
            }) 
        }
    }

    let getApproversWithId = async () => {
        let firebasePromise = props.firebase.getApproversWithId(props.auth().uid);
        let leadUsers = [];
        if (firebasePromise[0] !== null) {
            await firebasePromise[0].then(snapshot => {
                for (let doc of snapshot.docs) {
                    leadUsers.push(doc.data().leadUser);
                }
            })
        }   
        if (firebasePromise[1] !== null) {
            await firebasePromise[1].then(snapshot => {
                leadUsers.push(snapshot.data().leadUser);
            });
        }

        searchApprovers(leadUsers);
    }

    let searchApprovers = async (leadUserId) => {
        let approversArr = []
        let adminPromise = props.firebase.searchApprovers(leadUserId[0]);
        if (adminPromise !== null) {
            await adminPromise.then(snapshot => {
               approversArr.push({'name': snapshot.data().firstName + ' ' + snapshot.data().lastName});
            })
        }
        if (leadUserId[1] !== undefined) {
            let teamLeadPromise = props.firebase.searchApprovers(leadUserId[1]);
            if (teamLeadPromise !== null) {
                await teamLeadPromise.then(snapshot => {
                    approversArr.push({'name': snapshot.data().firstName + ' ' + snapshot.data().lastName});
                 })
            }
        }
        
        setApprovers(approversArr);
    }

    // Lifecycle Methods
    useEffect(() => {
        getFormFields();
        getApproversWithId();
    }, []);

    return (
        <Container maxWidth="lg">
            <Box marginY={4}>
                <Paper className={classes.root}>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Typography variant="h5" component="h2" align="center" gutterBottom>Leave Request Detail</Typography>
                        <Box marginTop={2}>
                            <TextField className={classes.inputWidth} label="Leave Type" variant="outlined" margin="normal" value={leaveType || ''} InputProps={{readOnly: true,}} />
                        </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={4}>
                                    <TextField className={classes.inputWidth} label="Leave Start" variant="outlined" margin="normal" value={moment(fields.startDate?.seconds*1000).format('MM.DD.YYYY - hh:mm') || ''} InputProps={{readOnly: true,}} />
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <TextField className={classes.inputWidth} label="Leave End" variant="outlined" margin="normal" value={moment(fields.endDate?.seconds*1000).format('MM.DD.YYYY - hh:mm') || ''} InputProps={{readOnly: true,}} />
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <TextField className={classes.inputWidth} label="Leave Duration" variant="outlined" margin="normal" value={fields.duration || ''} InputProps={{readOnly: true,}} />
                                </Grid>
                            </Grid>
                            <TextField className={classes.inputWidth} multiline rows="4" label="Description" variant="outlined" margin="normal" value={fields.description || ''}
                            InputProps={{readOnly: true}}
                            />
                            <TextField className={classes.inputWidth} label="Rapor Protokol No (Mazeret)" margin="normal" variant="outlined" value={fields.protocolNumber || ''} InputProps={{readOnly: true,}} />
                            <Box marginY={1}>
                                <Typography variant="caption" component="div">Approver</Typography>
                                    {approvers.map((item, index) => {
                                        return  <Box key={index} component="span">
                                                    <Chip avatar={<Avatar>{item.name.charAt(0)}</Avatar>} label={item.name} style={{margin:".25rem .5rem .25rem 0"}} />
                                                </Box>; 
                
                                    })}
                            </Box>
                            <TextField className={classes.inputWidth} label="Date of Record" variant="outlined" margin="normal" value={moment(fields.requestedDate?.seconds*1000).format('MM.DD.YYYY - hh:mm') || ''} InputProps={{readOnly: true,}} />
                            {(isAdmin === false || props.user.id == fields.createdBy) ? 
                            <Box my={3}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Button className={classes.inputWidth} onClick={editLeaveRequest} variant="contained" size="large" type="submit" color="primary">EDIT</Button>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Button className={classes.inputWidth} onClick={printLeaveRequest} variant="outlined" size="large" color="primary">PRINT</Button>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Button className={classes.inputWidth} onClick={cancelLeaveRequest} variant="outlined" size="large">Cancel Request</Button>
                                    </Grid>
                                </Grid>
                            </Box>:
                            <Box my={3}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Button className={classes.inputWidth} onClick={approveLeaveRequest}  variant="contained" size="large" type="submit" color="primary">Approve</Button>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Button className={classes.inputWidth} onClick={printLeaveRequest} variant="outlined" size="large" color="primary" >PRINT</Button>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Button className={classes.inputWidth} onClick={rejectLeaveRequest} variant="outlined" size="large">Reject</Button>
                                    </Grid>
                                </Grid>
                            </Box>}
                    </form>
                </Paper>
            </Box>
        </Container>
    )
}
