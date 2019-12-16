import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography, Box } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({

});

export default function DateFull() {
    const classes = useStyles();

    return (
        <Grid container direction="row" className={classes.container}>
            <Box ml={4} mr={2} textAlign="center">
                <Typography>15 Aralık 2019</Typography>
                <Typography>09:00</Typography>
            </Box>
            <ArrowForwardIosIcon />
            <Box ml={2} textAlign="center">
                <Typography>16 Aralık 2019</Typography>
                <Typography>09:00</Typography>
            </Box>
        </Grid>
    )
}