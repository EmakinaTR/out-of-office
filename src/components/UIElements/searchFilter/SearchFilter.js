import React, { useState } from 'react';
import { InputBase,Input,InputAdornment,Box }from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {  makeStyles } from '@material-ui/core/styles';
const SearchFilter = ({onChange})=> {

    const [searchQuery,setSearchQuery]=useState('');

   
    const onChangeHandler =(e)=>{
        setSearchQuery(e.target.value);
        onChange(e.target.value);
    }
    return (
        <div>
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
