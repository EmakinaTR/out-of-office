import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
    card: {
        maxWidth: '80px',
        border: '1px solid black',
        textAlign: 'center',
        borderRadius: 0
    },
    time: {
        backgroundColor: '#b3b3b3',
        borderTop: '1px solid black',
    },
    lineHeightControl: {
        lineHeight: '1.6rem'
    }
});

export default function DateCalendar() {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h6" className={classes.lineHeightControl}>15</Typography>
                <Typography variant="h6" className={classes.lineHeightControl}>Ara</Typography>
                <Typography variant="h6" className={classes.lineHeightControl}>2019</Typography>
            </CardContent>
            <Box className={classes.time}>
                09:00
        </Box>
        </Card>
    );
}