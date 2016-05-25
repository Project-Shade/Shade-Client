import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import RTorrent from './rTorrent';
import { ipcRenderer } from 'electron';

import CircularProgress from 'material-ui/CircularProgress';

import { updateTorrentList } from '../actions/torrentStore';
import { updateLoadingState } from '../actions/appState';

class DataFetcher extends React.Component {
  static propTypes = {
    appState: React.PropTypes.object.isRequired,
    connectionDetails: React.PropTypes.object.isRequired,
    onInitialLoadComplete: React.PropTypes.func,
    updateLoadingState: React.PropTypes.func.isRequired,
    updateTorrentList: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    onInitialLoadComplete: () => {},
  }

  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentDidMount() {
    this.reinitializeConnection();

    ipcRenderer.on('single_instance', (event, data) => {
      const argv = data.argv;
      const magnetURL = argv[argv.length - 1];
      if (/^magnet:.+/g.test(magnetURL)) {
        this.rtorrent.addMagnetLink(magnetURL);
      }
    });
  }

  componentDidUpdate(prevProps) {
    // Only reconnect if the connection details changed
    if (!_.isEqual(prevProps.connectionDetails, this.props.connectionDetails)) {
      this.reinitializeConnection();
    }
  }

  reinitializeConnection() {
    this.rtorrent = new RTorrent(this.props.connectionDetails);

    if (this.fetcher) clearInterval(this.fetcher);
    this.fetcher = setInterval(this.fetch.bind(this), 1000);
    this.fetch(this.props.onInitialLoadComplete);
  }

  fetch(cb) {
    this.rtorrent.getAll()
      .catch((err) => console.error('err', err))
      .then((data) => {
        if (this.props.appState.loading) {
          this.props.updateLoadingState(false);
        }
        this.props.updateTorrentList(data);
        if (cb) cb();
      });
  }

  render() {
    if (!this.props.appState.loading) return null;
    return (
      <div className="full-loader">
        <div>
          <CircularProgress size={2} />
          <span>Loading Torrent Statuses</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  connectionDetails: state.connectionSettings,
  appState: state.appState,
});

const mapDispatchToProps = (dispatch) => ({
  updateTorrentList: (newList) => dispatch(updateTorrentList(newList)),
  updateLoadingState: (loading) => dispatch(updateLoadingState(loading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataFetcher);
