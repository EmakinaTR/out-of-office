import React,{useState} from 'react';
import MaterialTable,
{ MTableToolbar, MTableFilterRow,MTableHeader} from 'material-table';
import { incomingRequestData } from '../../constants/dummyData';
import { Typography,Chip,Button, Paper,Drawer,List,ListItem,ListItemIcon,ListItemText } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
export class Reports extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            showFilter: false,
            term:''
         };
        this.toggleFilter = this.toggleFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
    
    }
   
    toggleFilter() {
        this.setState((state) => {
            return { showFilter : !this.state.showFilter}
        });
    }
    handleChange(e) {
        console.log(e.target.value);
        this.setState({ term: e.target.value });
    }
    paperStyle ={
        boxShadow:'none'
    }
    tableStyle ={
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        marginTop: '20px'
    }
    headerStyle={
        fontSize:'16px',
        color:'white',
        backgroundColor:'#929292',
       
    }
  
    render() {
        return (
            <Paper style={this.paperStyle}>
                <MaterialTable style={this.tableStyle}
                    //https://material-table.com/#/docs/features/remote-data
                    data={incomingRequestData}
                    title="Reports"
                    icons={{
                        Filter: () => <div>
                            {/* {this.filtersArray.map((filter,index)=>{
                            return filter
                    })} */}
                    </div>  }}
                    columns={[

                        { title: 'Kullanıcı', field: 'userName'},
                        { title: 'Başlangıç Tarihi', field: 'startDate', 
                        filterCellStyle: {
                            backgroundColor:'red',
                           
                         } },
                        { title: 'Bitişi Tarihi', field: 'endDate' },
                        { title: 'Gün Sayısı', field: 'dayCount', filtering: false },
                        { title: 'Takım', field: 'team', },
                        {
                            title: 'İzin Tipi',
                            field: 'leaveType',
                            lookup: {
                                0: 'Annual Leave',
                                1: 'Compansate Leave',
                                2: 'Excuse Leave',
                                3: 'Marriage Leave',
                                4: 'Other Leave',
                                5: 'Parental Leave',
                                6: 'Remote Working',
                                7: 'Unpaid Vacations'
                            },
                        },
                        {
                            title: 'Onay Durumu',
                            field: 'status',
                            lookup: { 0: 'Onay Bekliyor',
                            1: 'Onaylandı',
                            2: 'Red edildi',
                            3: 'İptal Edildi' },
                        },
                        
                    ]}

                    detailPanel={rowData => {
                        return (
                            rowData.description ?
                                (
                                    <div>
                                        <Typography style={{ margin: '12px', fontWeight: '700' }}>Açıklama</Typography>
                                        <Typography style={{ margin: '12px' }}>{rowData.description}</Typography>
                                    </div>
                                ) :
                                null
                        )
                    }}
                    onRowClick={(event, rowData, togglePanel) => togglePanel()}
                    exportButton={true}
                    pageSize={10}
                    options={{
                        filtering: this.state.showFilter,
                        pageSize: 10,
                        pageSizeOptions: [10, 20],
                        exportButton: true,
                        responsive: "scroll",
                        columnsButton: true,
                        isFreeAction: true,
                        headerStyle: this.headerStyle,
                        exportFileName: 'EMAKINA.TR-OOO-' + new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
                        filterCellStyle :{
                            display:'flex',
                            flexDirection:'column',
                            justifyContent:'space-between',
                            alignItems:'center',
                        },
                        grouping: true,
                        exportAllData:true
                    }}
                    actions={[
                        {
                            icon: 'filter_list',
                            tooltip: 'Filters',
                            isFreeAction: true,
                            onClick: (event) => {
                                this.setState((state) => {
                                    return { showFilter: !this.state.showFilter }
                                });} 
                        }
                    ]}
                    components={{
                        Toolbar: props => (
                            <div>
                                <MTableToolbar
                                    style={{ backgroundColor: '#e8e8e8', boxShadow: 'none', border: 'none' }}

                                    {...props}>

                                </MTableToolbar>
                               
                            </div>
                                
                        ),
                        FilterRow:props=>(
                            <Drawer  anchor= "right" open={this.state.showFilter} onClose={this.toggleFilter}>
                                <MTableFilterRow style={{heigth:'100%'}} {...props} /> 
                            </Drawer>
                        )
                        
                    }}
                />
            </Paper>
            
        )
    }
}