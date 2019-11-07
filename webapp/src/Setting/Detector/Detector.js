import React from 'react';
import Map from './Map/Map';
import List from './List/List';
import Form from './Form/Form';
import './Detector.scss';

export default class Detector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detectors: [],
      maps: []
    };
    this.setDetectors = this.setDetectors.bind(this);
    this.fetchDetectors = this.fetchDetectors.bind(this);
  }

  componentDidMount() {
    this.fetchDetectors();

    const mapURL = new URL('http://127.0.0.1:3000/api/map');
    fetch(mapURL)
      .then(res => res.json())
      .then(json => {
        this.setState({ maps: json });
      });
  }

  fetchDetectors() {
    const detectorURL = new URL('http://127.0.0.1:3000/api/detector');
    fetch(detectorURL)
      .then(res => res.json())
      .then(json => {
        this.setState({ detectors: json });
      });
  }

  setDetectors(detector) {
    this.setState({ detectors: detector });
  }

  render() {
    return (
      <div className="Detector">
        <div className="Map">
          <Map
            detectors={this.state.detectors}
            maps={this.state.maps}
            onChange={this.setDetectors}
          />
          <div className="List">
            <List detectors={this.state.detectors} />
          </div>
        </div>
        <div className="Form">
          <Form detectors={this.state.detectors} onChange={this.fetchDetectors} />
        </div>
      </div>
    );
  }
}
