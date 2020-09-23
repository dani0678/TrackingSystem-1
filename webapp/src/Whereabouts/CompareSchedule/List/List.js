import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleOutlineSharpIcon from '@material-ui/icons/CheckCircleOutlineSharp';
import ClearSharpIcon from '@material-ui/icons/ClearSharp';

const useStyles = makeStyles({
  root: {
    width: '75%'
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto'
  }
});

const columns = [
  { id: 'trackerName', label: '名前', minWidth: 170, align: 'center' },
  { id: 'map', label: '現在位置', minWidth: 170, align: 'center' },
  { id: 'schedule', label: 'スケジュール位置', minWidth: 170, align: 'center' },
  { id: 'compare', label: '比較', minWidth: 70, align: 'center' }
];

export default function List(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const residentsList = props.trackers.filter(function(tracker) {
    if (tracker.userStatus === '入所者') return true;
  });

  const makeTrackerList = trackers => {
    if (trackers) {
      return trackers.map(tracker => {
        return (
          <TableRow key={tracker.trackerName} tabIndex={-1}>
            <TableCell align="center">{tracker.trackerName}</TableCell>
            <TableCell align="center">{checkLocation(tracker)}</TableCell>
            <TableCell align="center">{checkSchedule(tracker)}</TableCell>

            <TableCell align="center">
              {(() => {
                if (
                  checkLocation(tracker) === checkSchedule(tracker) ||
                  checkSchedule(tracker) === ''
                ) {
                  return <CheckCircleOutlineSharpIcon fontSize="large" color="primary" />;
                } else {
                  return <ClearSharpIcon fontSize="large" color="secondary" />;
                }
              })()}
            </TableCell>
          </TableRow>
        );
      });
    }
  };

  const checkLocation = tracker => {
    if (tracker.Location) {
      let map = props.rooms.find(map => map.mapID === tracker.Location.map);
      return map.name;
    } else {
      return '';
    }
  };

  const checkSchedule = tracker => {
    const now = new Date();
    if (props.schedules.length) {
      for (let schedule of props.schedules) {
        const openingTime = new Date(schedule.openingTime);
        const closingTime = new Date(schedule.closingTime);
        const openingHour = openingTime.getHours();
        const closingHour = closingTime.getHours();
        const openingMinute = openingTime.getMinutes();
        const closingMinute = closingTime.getMinutes();

        if (schedule.trackerList.includes(tracker.trackerID)) {
          if (openingHour <= now.getHours() && now.getHours() <= closingHour) {
            if (openingHour === closingHour) {
              if (openingMinute <= now.getMinutes() && now.getMinutes() <= closingMinute) {
                let map = props.rooms.find(map => map.mapID === schedule.room);
                return map.name;
              } else {
                return '';
              }
            } else if (openingHour === now.getHours()) {
              if (openingMinute <= now.getMinutes()) {
                let map = props.rooms.find(map => map.mapID === schedule.room);
                return map.name;
              } else {
                return '';
              }
            } else if (closingHour === now.getHours()) {
              if (now.getMinutes() <= closingMinute) {
                let map = props.rooms.find(map => map.mapID === schedule.room);
                return map.name;
              } else {
                return '';
              }
            } else {
              let map = props.rooms.find(map => map.mapID === schedule.room);
              return map.name;
            }
          } else {
            return '';
          }
        } else {
          return '';
        }
      }
    } else {
      return '';
    }
  };

  return (
    <div>
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table stickyHeader className="residentsList">
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
            <TableBody>{makeTrackerList(residentsList)}</TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={residentsList.length}
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
    </div>
  );
}
