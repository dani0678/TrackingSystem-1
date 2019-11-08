import React from 'react';
import Map from './Map/Map';
import Form from './Form/Form';
import './Meta.scss';

export default class Meta extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      metas: [],
      maps: [],
      activeMeta: {},
      mouseDoubleClicked: false
    };
    this.setMetas = this.setMetas.bind(this);
    this.setActiveMeta = this.setActiveMeta.bind(this);
    this.fetchMetas = this.fetchMetas.bind(this);
  }

  componentDidMount() {
    this.fetchMetas();

    const mapURL = new URL(`${process.env.REACT_APP_API_URL}/api/map`);
    fetch(mapURL)
      .then(res => res.json())
      .then(json => {
        this.setState({ maps: json });
      });
  }

  fetchMetas() {
    const metaURL = new URL(`${process.env.REACT_APP_API_URL}/api/meta`);
    fetch(metaURL)
      .then(res => res.json())
      .then(json => {
        this.setState({ metas: json });
      });
  }

  setMetas(meta) {
    this.setState({ metas: meta });
  }

  setActiveMeta(meta) {
    this.setState({ activeMeta: meta });
  }

  render() {
    return (
      <div>
        <div className="Map">
          <Map
            metas={this.state.metas}
            maps={this.state.maps}
            doubleClickMouse={this.setActiveMeta}
          />
        </div>
        <div className="Form">
          <Form
            metas={this.state.metas}
            activeMeta={this.state.activeMeta}
            onChange={this.fetchMetas}
          />
        </div>
      </div>
    );
  }
}
