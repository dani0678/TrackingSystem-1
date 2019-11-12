import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import _ from 'underscore';

const useStyles = makeStyles({
  root: {
    width: '75%',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
});

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { selected } = props;
  const { deleteSchedule } = props;

  return (
    <Toolbar>
      {selected.length > 0 ? (
        <Typography className={'delete'} color="inherit" variant="subtitle1">
          {selected.length} selected
        </Typography>
      ) : (
        <Typography className={'title'} variant="h6" id="tableTitle">
          スケジュール一覧
        </Typography>
      )}

      {selected.length > 0 ? (
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={() => {
              deleteSchedule(selected);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Typography></Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  selected: PropTypes.array.isRequired,
  deleteSchedule: PropTypes.func.isRequired,
};

const columns = [
  { id: 'checkbox', label: '', minWidth: 30, align: 'center' },
  { id: 'name', label: 'スケジュール名', minWidth: 170, align: 'center' },
  { id: 'openingTime', label: '開始時刻', minWidth: 170, align: 'center' },
  { id: 'closingTime', label: '終了時刻', minWidth: 170, align: 'center' },
  { id: 'unitName', label: 'ユニット', minWidth: 170, align: 'center' },
  { id: 'roomName', label: '部屋', minWidth: 170, align: 'center' },
];

export default function List(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const deleteSchedule = selected => {
    const scheduleURL = 'http://127.0.0.1:3000/api/schedule';
    selected.map(select => {
      const schedule = props.scheduleList.find(schedule => schedule.name === select);
      const deleteScheduleUrl = scheduleURL + '/' + schedule.scheduleID;
      fetch(deleteScheduleUrl, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify(schedule),
      });
      setSelected([]);
    });
  };

  const makeScheduleList = schedules => {
    schedules = _.sortBy(schedules, schedule => {
      return schedule.openingTime;
    });

    if (schedules) {
      return schedules.map((schedule, index) => {
        let room = props.roomList.find(room => room.mapID === schedule.room);
        const isItemSelected = isSelected(schedule.name);
        const labelId = `enhanced-table-checkbox-${index}`;
        if (room) {
          let unitName = room.mName;
          let roomName = room.name;
          return (
            <TableRow
              hover
              key={schedule.name}
              onClick={event => handleClick(event, schedule.name)}
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              selected={isItemSelected}
            >
              <TableCell padding="checkbox">
                <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
              </TableCell>
              <TableCell align="center">{schedule.name}</TableCell>
              <TableCell align="center">{schedule.openingTime}</TableCell>
              <TableCell align="center">{schedule.closingTime}</TableCell>
              <TableCell align="center">{unitName}</TableCell>
              <TableCell align="center">{roomName}</TableCell>
            </TableRow>
          );
        }
      });
    }
  };

  return (
    <Paper className={classes.root}>
      <EnhancedTableToolbar selected={selected} deleteSchedule={deleteSchedule} />
      <div className={classes.tableWrapper}>
        <Table stickyHeader className="schedule">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{makeScheduleList(props.scheduleList)}</TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={props.scheduleList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'previous page',
        }}
        nextIconButtonProps={{
          'aria-label': 'next page',
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
