import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
import ListIcon from '@material-ui/icons/List';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import _ from 'underscore';

const useStyles = makeStyles({
  root: {
    width: '70%',
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

function SelectDialog(props) {
  const { onClose, open, residentsList, trackerIDList, updateTrackerList, scheduleID } = props;

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = value => {
    const IDListCopy = trackerIDList;
    if (IDListCopy) {
      if (IDListCopy.find(id => id === value.trackerID)) {
        const newIDList = IDListCopy.filter(id => id != value.trackerID);
        updateTrackerList(scheduleID, newIDList);
      } else {
        IDListCopy.push(value.trackerID);
        updateTrackerList(scheduleID, IDListCopy);
      }
    }
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="tracker-dialog" open={open}>
      <DialogTitle id="tracker-dialog">入居者を選んでください</DialogTitle>
      <List>
        {residentsList.map(tracker => (
          <ListItem key={tracker.trackerName}>
            <Checkbox
              onClick={() => handleListItemClick(tracker)}
              checked={trackerIDList.includes(tracker.trackerID)}
            />
            <ListItemText primary={tracker.trackerName} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" size="medium" onClick={handleClose}>
        閉じる
      </Button>
    </Dialog>
  );
}

SelectDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const columns = [
  { id: 'checkbox', label: '', minWidth: 30, align: 'center' },
  { id: 'name', label: 'スケジュール名', minWidth: 50, align: 'center' },
  { id: 'openingTime', label: '開始時刻', minWidth: 50, align: 'center' },
  { id: 'closingTime', label: '終了時刻', minWidth: 50, align: 'center' },
  { id: 'unitName', label: 'ユニット', minWidth: 50, align: 'center' },
  { id: 'roomName', label: '部屋', minWidth: 50, align: 'center' },
  { id: 'selectTracker', label: '選択', minWidth: 30, align: 'center' },
];

export default function ScheduleList(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const residentsList = props.trackerList.filter(function(tracker) {
    if (tracker.userStatus === '入居者') return true;
  });
  //Rows per page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  //handleCheckbox
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
  //handleDialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    setOpen(false);
  };
  //API
  const updateTrackerList = (shceduleID, trackerList) => {
    const scheduleURL = `${process.env.REACT_APP_API_URL}/api/schedule`;
    const updateScheduleUrl = scheduleURL + '/' + shceduleID;
    fetch(updateScheduleUrl, {
      method: 'PUT',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(trackerList),
    });
  };

  const deleteSchedule = selected => {
    const scheduleURL = `${process.env.REACT_APP_API_URL}/api/schedule`;
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
            <TableRow hover key={schedule.name} tabIndex={-1} selected={isItemSelected}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isItemSelected}
                  inputProps={{ 'aria-labelledby': labelId }}
                  onClick={event => handleClick(event, schedule.name)}
                />
              </TableCell>
              <TableCell align="center">{schedule.name}</TableCell>
              <TableCell align="center">{schedule.openingTime}</TableCell>
              <TableCell align="center">{schedule.closingTime}</TableCell>
              <TableCell align="center">{unitName}</TableCell>
              <TableCell align="center">{roomName}</TableCell>
              <TableCell>
                <IconButton onClick={handleClickOpen}>
                  <ListIcon />
                </IconButton>
              </TableCell>
              <SelectDialog
                open={open}
                onClose={handleClose}
                residentsList={residentsList}
                trackerIDList={schedule.trackerList}
                updateTrackerList={updateTrackerList}
                scheduleID={schedule.scheduleID}
              />
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
