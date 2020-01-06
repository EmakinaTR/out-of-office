import React,{useState} from 'react';
import MaterialTable,
{ MTableToolbar, MTableFilterRow,MTableHeader} from 'material-table';
import { incomingRequestData } from '../../constants/dummyData';
import { Typography,Chip,Button, Paper,Drawer,List,ListItem,ListItemIcon,ListItemText, Container, Box } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FirebaseContext } from "../../components/firebase";
import LaunchScreen from "../../components/UIElements/launchScreen";
import app from 'firebase';


export class Reports extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            showFilter: false,
            term:'',
            data:[]
         };
         this.firebaseContext = FirebaseContext;      
         this.toggleFilter = this.toggleFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
    
    }
   
    componentWillMount(){    
        console.log("hi will");
        const Test = app.functions().httpsCallable('getTeamLeaves');
            Test({queryData:{}}).then(res => {
                this.setState((state) => {
                    console.log(res)
                    return res
                    });
                }
            );
    }


    toggleFilter() {
        this.setState((state) => {
            return { showFilter : !this.state.showFilter}
        });
    }
    handleChange(e) {
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
            <div>
                {this.state.data.length > 0 ? (
                    <Container maxWidth="xl">
                        <Box marginY={4}>
                            <Paper style={this.paperStyle}>
                                <MaterialTable style={this.tableStyle}
                                    //https://material-table.com/#/docs/features/remote-data
                                    data={this.state.data}
                                    title="Reports"
                                    icons={{
                                        Filter: () => <div>
                                            {/* {this.filtersArray.map((filter,index)=>{
                                                return filter
                                                })} */
                                            }
                                        </div>
                                    }}
                                    columns={[

                                        { title: 'User', field: 'requesterName' },
                                        // { title: 'Start Date', field: 'startDate', 
                                        // filterCellStyle: {
                                        //     backgroundColor:'red',

                                        //  }},
                                        // { title: 'End Date', field: 'endDate' },
                                        { title: 'Day Count', field: 'duration', filtering: false },
                                        // { title: 'Team', field: 'team', },
                                        {
                                            title: 'Leave Type',
                                            field: 'leaveType.name',
                                           
                                        },
                                        {
                                            title: 'Status',
                                            field: 'status',
                                            lookup: {
                                                0: 'Waiting Approve',
                                                1: 'Approved',
                                                2: 'Red edildi',
                                                3: 'Cancelled'
                                            },
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
                                        filterCellStyle: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        },
                                        grouping: true,
                                        exportAllData: true
                                    }}
                                    actions={[
                                        {
                                            icon: 'filter_list',
                                            tooltip: 'Filters',
                                            isFreeAction: true,
                                            onClick: (event) => {
                                                this.setState((state) => {
                                                    return { showFilter: !this.state.showFilter }
                                                });
                                            }
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
                                        FilterRow: props => (
                                            <Drawer anchor="right" open={this.state.showFilter} onClose={this.toggleFilter}>
                                                <MTableFilterRow style={{ heigth: '100%' }} {...props} />
                                            </Drawer>
                                        )
                                    }}
                                />
                            </Paper>
                        </Box>
                    </Container>
                ): (<LaunchScreen></LaunchScreen>)}
            </div>
        )
    }
}