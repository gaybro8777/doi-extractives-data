import React from 'react'
import PropTypes from 'prop-types'

import CONSTANTS from '../../../js/constants'
import utils from '../../../js/utils'

import styles from './RowspanTable.module.scss'

import Table_MU from '@material-ui/core/Table';
import TableBody_MU from '@material-ui/core/TableBody';
import TableCell_MU from '@material-ui/core/TableCell';
import TableHead_MU from '@material-ui/core/TableHead';
import TableRow_MU from '@material-ui/core/TableRow';
import Paper_MU from '@material-ui/core/Paper';
import TableSortLabel_MU from '@material-ui/core/TableSortLabel';
import Tooltip_MU from '@material-ui/core/Tooltip';

import groupArray from 'group-array';

const RowspanTable = props => {


  const handleChange = event => {
    //this.setState({ name: event.target.value });
  };

  const handleRequestSort = (event, property) => {
  	console.log("Sort", event, property);
  }

  const getTableRows = () => {

    
    if(props.grouping) {
      let groupColumnKey = props.grouping[0].columnName;
      let test = groupArray(props.rows, groupColumnKey, 'commodity')
      console.log(test)
      let result = props.rows.reduce((h, obj) => { console.log(groupColumnKey); return Object.assign(h, { [obj[groupColumnKey]]:( h[obj[groupColumnKey]] || [] ).concat(obj) }) }, {}) 
      let groups = Object.keys(result);
      let groupAdded = []
      //console.log(result);
      return Object.keys(result).map((group) => (
        result[group].map((row, groupRowIndex) => (
          <TableRow_MU key={groupRowIndex}>
            {
              Object.keys(row).map((cellKey, i) => {
                if(groups.includes(row[cellKey]) && !groupAdded.includes(row[cellKey])) {
                  groupAdded.push(row[cellKey]);
                  return (<TableCell_MU key={i} rowSpan={result[group].length} className={styles.rowspanCell}>{row[cellKey]}</TableCell_MU>)
                }
                else if(!groups.includes(row[cellKey])) {
                  return <TableCell_MU key={i}>{row[cellKey]}</TableCell_MU>
                }
              })
            }
          </TableRow_MU>
        ))
      ))
    }


    return (props.rows.map((row,index) => {
        return (
          <TableRow_MU key={index}>
            { 
              Object.keys(row).map((cellKey, index) => {
                return (<TableCell_MU key={index}>{row[cellKey]}</TableCell_MU>)
              })
            }
          </TableRow_MU>
        )
      })
    )
  }


  console.log(props);
  return (
		<div className={styles.root}>
      <Table_MU className={styles.table}>
        <TableBody_MU className={styles.tableBody}>
          {props.rows && getTableRows()}
        </TableBody_MU>
      </Table_MU>
		</div>
  )
}

export default RowspanTable



class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { columns } = this.props;

    return (
      <TableHead_MU className={styles.tableHeader}>
        <TableRow_MU>
          {columns.map(
            (column, index) => (
              <TableCell_MU
                key={column.id+"_"+index}
                align={column.numeric ? 'right' : 'left'}
                padding={column.disablePadding ? 'none' : 'default'}
              >
                <Tooltip_MU
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel_MU
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel_MU>
                </Tooltip_MU>
              </TableCell_MU>
            ),
            this,
          )}
        </TableRow_MU>
      </TableHead_MU>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
};

/*

        <Table_MU className={styles.table}>
          <EnhancedTableHead
            onRequestSort={this.handleRequestSort}
            columns={this.state.columns}
          />
          <TableBody_MU className={styles.tableBody}>
            {this.props.data &&

              this.props.data.map((cells,index) => {
                return (
                  <TableRow_MU key={index}>
                    { 
                      cells.map((cell, index) => {
                        if(this.state.columns[index] && typeof this.state.columns[index].cellRender === 'function') {
                          return (<TableCell_MU key={index} align={this.state.columns[index].numeric ? 'right' : 'left'}>{this.state.columns[index].cellRender(cell)}</TableCell_MU>)
                        }
                        return (<TableCell_MU key={index} align={this.state.columns[index].numeric ? 'right' : 'left'}>{cell}</TableCell_MU>)
                      })
                    }
                  </TableRow_MU>
                )
              })
            }
          </TableBody_MU>
        </Table_MU>

        */



