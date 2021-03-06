import React, { useState } from 'react';
import {Input,InputAdornment}from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {  makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles(theme => ({
  
    SearchFilter: {
        
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        margin : theme.spacing(1,0)
    },

}));
const SearchFilter = ({onChange})=> {

    const [searchQuery,setSearchQuery]=useState('');
    const classes = useStyles();
    const onChangeHandler =(e)=>{
        setSearchQuery(e.target.value);
        onChange(e.target.value);
    }
    return (
        <div className={classes.SearchFilter}>
            <Input
                placeholder="Search…"
                type="text"
                value={searchQuery}
                onChange={onChangeHandler}
                startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  }
                inputProps={{ 'aria-label': 'search' }}
                style={{width:"100%", maxWidth:"16rem"}}
            />
        </div>
    );
}
export default SearchFilter;
