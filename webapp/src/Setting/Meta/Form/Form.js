import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import _ from 'underscore';
import './Form.scss';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.metaURL = new URL(`${process.env.REACT_APP_API_URL}/api/meta`);
    this.state = {
      metaList: [],
      activeMeta: {},
      formDisabled: false,
      isRetrySetName: false
    };
    this.deleteMeta = this.deleteMeta.bind(this);
    this.updateMeta = this.updateMeta.bind(this);
    this.updateMetaName = this.updateMetaName.bind(this);

    this.textInput = React.createRef();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      metaList: JSON.stringify(nextProps.metas),
      activeMeta: nextProps.activeMeta,
      formDisabled: nextProps.activeMeta.name !== 'new' && this.state.isRetrySetName
    });

    if (!_.isEmpty(nextProps.activeMeta)) {
      this.textInput.current.focus();
    }
  }

  deleteMeta() {
    const metaName = this.state.activeMeta.name;
    const metaNameURL = this.metaURL + '/' + metaName;
    if (!this.state.activeMeta.mapIDList.length) {
      fetch(metaNameURL, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ metaName })
      });
      window.location.reload();
    } else {
      alert('ユニット上に部屋が登録されているためユニットの削除ができません');
    }
  }

  updateMeta() {
    const meta = JSON.parse(this.state.metaList).find(meta => {
      return meta.name === this.state.activeMeta.name;
    });
    if (!meta) {
      fetch(this.metaURL, {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify(this.state.activeMeta)
      });
      window.location.reload();
    } else {
      alert('すでに追加されている名称です');
      this.setState({
        formDisabled: false,
        isRetrySetName: true
      });
    }
  }

  updateMetaName(name) {
    const activeMetaCopy = this.state.activeMeta;
    activeMetaCopy.name = name;
    this.setState({ activeMeta: activeMetaCopy });
  }

  render() {
    return (
      <form className="metaSetting">
        <TextField
          className="meta-name"
          label="UnitName"
          margin="normal"
          disabled={this.state.formDisabled}
          value={!_.isEmpty(this.state.activeMeta) ? this.state.activeMeta.name : ''}
          inputRef={this.textInput}
          onChange={event => {
            this.updateMetaName(event.target.value);
          }}
        />
        <Button
          variant="contained"
          color="primary"
          size="medium"
          className="submit"
          onClick={this.updateMeta}
        >
          登録
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          className="delete"
          onClick={this.deleteMeta}
        >
          削除
        </Button>
      </form>
    );
  }
}
