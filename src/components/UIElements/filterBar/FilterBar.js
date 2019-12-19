import React,{useState} from 'react';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Toolbar,Input,InputLabel,MenuItem,FormControl,Select } from '@material-ui/core';
import SearchFilter from '../searchFilter/SearchFilter';
import OrderByFilter from '../orderByFilter';




export function FilterBar() {
   
    return (
        <div >
                <Toolbar>
                <SearchFilter></SearchFilter>
                <OrderByFilter></OrderByFilter>
                </Toolbar>
        </div>
    );
}
