import React, { useState } from 'react';
import { InputBase,Input }from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {  makeStyles } from '@material-ui/core/styles';
const SearchFilter = ({onChange})=> {
    const useStyles = makeStyles(theme => ({
        root: {
            flexGrow: 1,
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: "white",
            '&:hover': {
                backgroundColor: (theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: 'auto',
            },
        },
        searchIcon: {
            width: theme.spacing(7),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
            
        },
        inputInput: {
            overflow: 'hidden',
            padding: theme.spacing(1, 1, 1, 7),
            transition: theme.transitions.create('width'),
            width: '100%',
            // [theme.breakpoints.up('sm')]: {
            //     width: 120,
            //     '&:focus': {
            //         width: 200,
            //     },
            // },
        },
    }));
    const [searchQuery,setSearchQuery]=useState('');
    const classes = useStyles();
   
    const onChangeHandler =(e)=>{
        setSearchQuery(e.target.value);
        onChange(e.target.value);
    }
    return (
        <div className={classes.search}>
            <div className={classes.searchIcon}>
                <SearchIcon />
            </div>
            <Input
                placeholder="Search…"
                
                type="text"
                value={searchQuery}
                onChange={onChangeHandler}
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
            />
        </div>
    );
}
export default SearchFilter;
