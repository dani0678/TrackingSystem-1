import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
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
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import _ from 'underscore';
import dayjs from 'dayjs';

const useStyles = makeStyles({
  root: {
    width: '70%'
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto'
  }
});
//タイトル（ツールバー）作成
const EnhancedTableToolbar = props => {
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
  deleteSchedule: PropTypes.func.isRequired
};
//dialog作成
function SimpleDialog(props) {
  const { onClose, open, residentsList, trackerIDList, updateTrackerList, scheduleID } = props;
  const [selected, setSelected] = React.useState(trackerIDList);

  const handleClose = () => {
    onClose();
    setSelected(trackerIDList);
  };

  const submitList = () => {
    updateTrackerList(scheduleID, selected);
    onClose();
  };

  const handleClick = trackerID => {
    const selectedIndex = selected.indexOf(trackerID);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, trackerID);
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

  return (
    <Dialog onClose={handleClose} aria-labelledby="tracker-dialog" open={open}>
      <DialogTitle id="tracker-dialog">入居者を選んでください</DialogTitle>
      <DialogContent>
        <List>
          {residentsList.map(tracker => (
            <ListItem key={tracker.trackerName}>
              <Checkbox
                onClick={() => handleClick(tracker.trackerID)}
                checked={selected.includes(tracker.trackerID)}
              />
              <ListItemText primary={tracker.trackerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" size="small" onClick={submitList}>
          登録
        </Button>
        <Button variant="contained" color="primary" size="small" onClick={handleClose}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

const columns = [
  { id: 'checkbox', label: '', minWidth: 30, align: 'center' },
  { id: 'name', label: 'スケジュール名', minWidth: 50, align: 'center' },
  { id: 'openingTime', label: '開始時刻', minWidth: 50, align: 'center' },
  { id: 'closingTime', label: '終了時刻', minWidth: 50, align: 'center' },
  { id: 'unitName', label: 'ユニット', minWidth: 50, align: 'center' },
  { id: 'roomName', label: '部屋', minWidth: 50, align: 'center' },
  { id: 'selectTracker', label: '選択', minWidth: 30, align: 'center' }
];

export default function ScheduleList(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [openId, setOpenId] = React.useState(null);

  const residentsList = props.trackerList.filter(function(tracker) {
    if (tracker.userStatus === '入居者') return true;
  });

  //tableのページとcheckbox
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
  //dialog
  const handleClickOpen = id => {
    setOpenId(id);
  };

  const handleClose = () => {
    setOpenId(null);
  };
  //API
  const updateTrackerList = (shceduleID, trackerList) => {
    const scheduleURL = `${process.env.REACT_APP_API_URL}/api/schedule`;
    const updateScheduleUrl = scheduleURL + '/' + shceduleID;
    fetch(updateScheduleUrl, {
      method: 'PUT',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(trackerList)
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
        body: JSON.stringify(schedule)
      });
      setSelected([]);
    });
  };
  //Table作成
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
          const openingTime = dayjs(schedule.openingTime).format('HH:mm');
          const closingTime = dayjs(schedule.closingTime).format('HH:mm');
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
              <TableCell align="center">{openingTime}</TableCell>
              <TableCell align="center">{closingTime}</TableCell>
              <TableCell align="center">{unitName}</TableCell>
              <TableCell align="center">{roomName}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    handleClickOpen(schedule.scheduleID);
                  }}
                >
                  <ListIcon />
                </IconButton>

                <SimpleDialog
                  open={openId === schedule.scheduleID}
                  onClose={handleClose}
                  residentsList={residentsList}
                  trackerIDList={schedule.trackerList}
                  updateTrackerList={updateTrackerList}
                  scheduleID={schedule.scheduleID}
                />
              </TableCell>
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
          'aria-label': 'previous page'
        }}
        nextIconButtonProps={{
          'aria-label': 'next page'
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
