import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles({
  root: {
    width: '75%'
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto'
  }
});

const StaffTableToolbar = props => {
  const { selected } = props;
  const { deleteTracker } = props;

  return (
    <Toolbar>
      <Typography className={'title'} variant="h6" id="tableTitle">
        職員一覧
      </Typography>

      {selected.length > 0 ? (
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={() => {
              deleteTracker(selected);
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

StaffTableToolbar.propTypes = {
  selected: PropTypes.array.isRequired,
  deleteTracker: PropTypes.func.isRequired
};

const ResitentsTableToolbar = props => {
  const { selected } = props;
  const { deleteTracker } = props;

  return (
    <Toolbar>
      <Typography className={'title'} variant="h6" id="tableTitle">
        入居者一覧
      </Typography>

      {selected.length > 0 ? (
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={() => {
              deleteTracker(selected);
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

ResitentsTableToolbar.propTypes = {
  selected: PropTypes.array.isRequired,
  deleteTracker: PropTypes.func.isRequired
};

const columns = [
  { id: 'checkbox', label: '', minWidth: 30, align: 'center' },
  { id: 'trackerName', label: '名前', minWidth: 170, align: 'center' },
  { id: 'beaconID', label: 'ビーコンID', minWidth: 170, align: 'center' },
  { id: 'userStatus', label: 'ユーザー', minWidth: 170, align: 'center' }
];

export default function List(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  /* const [staffSelected, setStaffSelected] = React.useState([]);
  const [residentsSelected, setResidentsSelected] = React.useState([]); */

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

  const deleteTracker = selected => {
    const trackerURL = `${process.env.REACT_APP_API_URL}/api/tracker`;
    selected.map(select => {
      const tracker = props.trackers.find(tracker => tracker.trackerName === select);
      const deleteTrackerUrl = trackerURL + '/' + tracker.trackerID;
      fetch(deleteTrackerUrl, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify(tracker)
      });
      setSelected([]);
    });
  };

  const staffList = props.trackers.filter(function(tracker) {
    if (tracker.userStatus === '職員') return true;
  });
  const residentsList = props.trackers.filter(function(tracker) {
    if (tracker.userStatus === '入居者') return true;
  });

  const makeTrackerList = trackers => {
    if (trackers) {
      return trackers.map((tracker, index) => {
        const isItemSelected = isSelected(tracker.trackerName);
        const labelId = `enhanced-table-checkbox-${index}`;
        return (
          <TableRow
            hover
            key={tracker.trackerName}
            onClick={event => handleClick(event, tracker.trackerName)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}
          >
            <TableCell padding="checkbox">
              <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
            </TableCell>
            <TableCell align="center">{tracker.trackerName}</TableCell>
            <TableCell align="center">{tracker.beaconID}</TableCell>
            <TableCell align="center">{tracker.userStatus}</TableCell>
          </TableRow>
        );
      });
    }
  };

  return (
    <div>
      <Paper className={classes.root}>
        <StaffTableToolbar selected={selected} deleteTracker={deleteTracker} />
        <div className={classes.tableWrapper}>
          <Table stickyHeader className="staffList">
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
            <TableBody>{makeTrackerList(staffList)}</TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={staffList.length}
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

      <Paper className={classes.root}>
        <ResitentsTableToolbar selected={selected} deleteTracker={deleteTracker} />
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
