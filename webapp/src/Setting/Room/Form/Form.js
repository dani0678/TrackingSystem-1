import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import _ from 'underscore';
import './Form.scss';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.roomURL = new URL(`${process.env.REACT_APP_API_URL}/api/map` || 'http://127.0.0.1:3000/api/map');
    this.metaURL = new URL(`${process.env.REACT_APP_API_URL}/api/meta` || 'http://127.0.0.1:3000/api/meta');
    this.state = {
      roomList: [],
      metaList: [],
      activeRoom: {},
      formDisabled: false,
      isRetrySetName: false
    };
    this.deleteRoom = this.deleteRoom.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
    this.updateRoomName = this.updateRoomName.bind(this);

    this.textInput = React.createRef();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      roomList: JSON.stringify(nextProps.rooms),
      metaList: JSON.stringify(nextProps.metas),
      activeRoom: nextProps.activeRoom,
      formDisabled: nextProps.activeRoom.name !== 'new' && this.state.isRetrySetName
    });

    if (!_.isEmpty(nextProps.activeRoom)) {
      this.textInput.current.focus();
    }
  }

  deleteRoom() {
    const roomName = this.state.activeRoom.name;
    const roomNameURL = this.roomURL + '/' + roomName;
    let res = [];
    if (roomName) {
      const room = JSON.parse(this.state.roomList).find(room => room.name === roomName);
      const meta = JSON.parse(this.state.metaList).find(meta => meta.name === room.mName);
      const IDList = meta.mapIDList.concat();
      const newIDList = IDList.filter(id => id !== room.mapID);

      res.push(meta.name);
      res.push(newIDList);

      fetch(roomNameURL, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ roomName })
      }).then(
        () => {
          fetch(this.metaURL, {
            method: 'PUT',
            headers: { 'content-type': 'application/json; charset=utf-8' },
            body: JSON.stringify(res)
          });
          window.location.reload();
        },
        () => {
          alert('マップが削除されませんでした。');
        }
      );
    } else {
      alert('マップを選択してください。');
    }
  }

  updateRoom() {
    let res = [];

    let room = JSON.parse(this.state.roomList).find(
      room => room.name === this.state.activeRoom.name
    );
    let meta = JSON.parse(this.state.metaList).find(
      meta => meta.name === this.state.activeRoom.mName
    );
    if (!room) {
      fetch(this.roomURL, {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify(this.state.activeRoom)
      })
        .then(response => response.text())
        .then(
          room => {
            const objectRoom = JSON.parse(room);
            if (meta) {
              let meta1 = JSON.parse(this.state.metaList).find(
                meta => meta.name === this.state.activeRoom.mName
              );

              let IDList = meta1.mapIDList.concat();
              IDList.push(objectRoom.mapID);
              res.push(meta.name);
              res.push(IDList);

              fetch(this.metaURL, {
                method: 'PUT',
                headers: { 'content-type': 'application/json; charset=utf-8' },
                body: JSON.stringify(res)
              });
              window.location.reload();
            } else {
              window.location.reload();
            }
          },
          () => {
            alert('マップが登録されませんでした。');
          }
        );
    }
  }

  updateRoomName(name) {
    const activeRoomCopy = this.state.activeRoom;
    activeRoomCopy.name = name;
    this.setState({ activeRoom: activeRoomCopy });
  }

  render() {
    return (
      <form className="metaSetting">
        <TextField
          className="meta-name"
          label="RoomName"
          margin="normal"
          disabled={this.state.formDisabled}
          value={!_.isEmpty(this.state.activeRoom) ? this.state.activeRoom.name : ''}
          inputRef={this.textInput}
          onChange={event => {
            this.updateRoomName(event.target.value);
          }}
        />
        <Button
          variant="contained"
          color="primary"
          size="medium"
          className="submit"
          onClick={this.updateRoom}
        >
          登録
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          className="delete"
          onClick={this.deleteRoom}
        >
          削除
        </Button>
      </form>
    );
  }
}
