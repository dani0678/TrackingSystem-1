import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Form.scss';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.basementDetectorAPIURL = new URL(`${process.env.REACT_APP_API_URL}/api/detector`);
    this.updateDetectorAPIURL = new URL(`${process.env.REACT_APP_API_URL}/api/detector/axis`);
    this.state = { detectors: [], prevDetectors: '', activeDetector: '', formDisabled: false };
    this.deleteDetector = this.deleteDetector.bind(this);
    this.updateDetector = this.updateDetector.bind(this);
    this.updateDetectorNumber = this.updateDetectorNumber.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const activeDetector = nextProps.detectors.find(detector => {
      return detector.active === true;
    });
    if (activeDetector && activeDetector.detectorNumber !== 'new') {
      this.setState({ formDisabled: true });
    }
    this.setState({
      detectors: nextProps.detectors,
      prevDetectors: JSON.stringify(nextProps.detectors),
      activeDetector: activeDetector
    });
  }

  deleteDetector() {
    const detectorNumber = this.state.activeDetector.detectorNumber;
    fetch(this.basementDetectorAPIURL, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ detectorNumber })
    });
    window.location.reload();
  }

  updateDetector() {
    const prevDetectors = JSON.parse(this.state.prevDetectors);
    const detector = prevDetectors.find(detector => {
      return detector.detectorNumber === this.state.activeDetector.detectorNumber;
    });

    if (detector) {
      fetch(this.updateDetectorAPIURL, {
        method: 'PUT',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify(this.state.activeDetector)
      });
      window.location.reload();
    } else {
      fetch(this.basementDetectorAPIURL, {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify(this.state.activeDetector)
      });
      window.location.reload();
    }
  }

  updateDetectorNumber(number) {
    const activeDetectorCopy = this.state.activeDetector;
    activeDetectorCopy.detectorNumber = number;
    this.setState({ activeDetector: activeDetectorCopy });
  }

  render() {
    return (
      <form className="detectorSetting">
        <TextField
          className="detector-number"
          label="DetectorNumber"
          margin="normal"
          disabled={this.state.formDisabled}
          value={this.state.activeDetector ? this.state.activeDetector.detectorNumber : ''}
          onChange={event => {
            this.updateDetectorNumber(event.target.value);
          }}
        />
        <Button
          variant="contained"
          color="primary"
          size="medium"
          className="submit"
          onClick={this.updateDetector}
        >
          登録
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          className="delete"
          onClick={this.deleteDetector}
        >
          削除
        </Button>
      </form>
    );
  }
}
