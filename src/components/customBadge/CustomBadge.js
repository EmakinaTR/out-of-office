import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import defaultProps from 'prop-types';
const useStyles = makeStyles({
    root: {
        background: props =>
            props.backgroundColor ,
        color: props =>
            props.color,
        padding: '6px 15px',
        borderRadius:'10px'
    },
});

export default function CustomBadge(props) {
    const { color, ...other } = props;
    const classes = useStyles(props);
    return <Badge backgroundColor={props.backgroundColor} color={props.color} badgeContent={props.badgeContent} className={classes.root} {...other} />;
}

CustomBadge.defaultProps = {
    backgroundColor: "primary",
    color :"white"
};