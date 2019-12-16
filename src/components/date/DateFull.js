import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography, Box } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    center: {
        alignSelf: 'center'
    }
});

// Stringleri objeye çevir

export default function DateFull(props) {
    const classes = useStyles();

    return (
        <Grid container direction="row">
            <Box ml={4} mr={2} textAlign="center">
                <Typography style={{width: props.width}}>15 Aralık 2019 09:00</Typography>
            </Box>
            <ArrowForwardIosIcon className={classes.center} />
            <Box ml={2} textAlign="center">
                <Typography style={{width: props.width}}>16 Aralık 2019 09:00</Typography>
            </Box>
        </Grid>
    )
}