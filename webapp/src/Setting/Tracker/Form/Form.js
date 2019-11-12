import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

export default function Form(props) {
  const classes = useStyles();
  const newTracker = { newTracker: { trackerName: '', beaconID: '', userStatus: '' } };

  const submitTracker = () => {
    const trackerURL = `${process.env.REACT_APP_API_URL}/api/tracker`;
    fetch(trackerURL, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(props.newTracker)
    });
    props.setNewTracker({ newTracker: '' });
  };

  const handleInputChange = e => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    props.setNewTracker(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <form className="TrackerSetting">
      <TextField
        className="tracker-name"
        name="trackerName"
        label="TrackerName"
        margin="normal"
        onChange={handleInputChange}
      />
      <TextField
        className="beaconID"
        name="beaconID"
        label="beaconID"
        margin="normal"
        onChange={handleInputChange}
      />
      <FormControl className={classes.formControl}>
        <InputLabel id="userStatus">userStatus</InputLabel>
        <Select
          labelid="userStatus"
          id="userStatus"
          name="userStatus"
          value={props.newTracker.userStatus ? props.newTracker.userStatus : ''}
          onChange={handleInputChange}
        >
          <MenuItem value={'入居者'}>入居者</MenuItem>
          <MenuItem value={'職員'}>職員</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        size="medium"
        className="submit"
        onClick={submitTracker}
      >
        登録
      </Button>
    </form>
  );
}
