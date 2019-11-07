import React from 'react';
import Map from './Map/Map';
import Form from './Form/Form';
import './Room.scss';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      metas: [],
      rooms: [],
      activeRoom: {},
      mouseDoubleClicked: false
    };
    this.setRooms = this.setRooms.bind(this);
    this.setActiveRoom = this.setActiveRoom.bind(this);
    this.fetchRooms = this.fetchRooms.bind(this);
  }

  componentDidMount() {
    this.fetchRooms();

    const metaURL = new URL('http://127.0.0.1:3000/api/meta');
    fetch(metaURL)
      .then(res => res.json())
      .then(json => {
        this.setState({ metas: json });
      });
  }

  fetchRooms() {
    const roomURL = new URL('http://127.0.0.1:3000/api/map');
    fetch(roomURL)
      .then(res => res.json())
      .then(json => {
        this.setState({ rooms: json });
      });
  }

  setRooms(room) {
    this.setState({ rooms: room });
  }

  setActiveRoom(room) {
    this.setState({ activeRoom: room });
  }

  render() {
    return (
      <div>
        <div className="Map">
          <Map
            metas={this.state.metas}
            rooms={this.state.rooms}
            doubleClickMouse={this.setActiveRoom}
          />
        </div>
        <div className="Form">
          <Form
            metas={this.state.metas}
            rooms={this.state.rooms}
            activeRoom={this.state.activeRoom}
            onChange={this.fetchRooms}
          />
        </div>
      </div>
    );
  }
}
