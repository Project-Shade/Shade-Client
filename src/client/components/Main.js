import React from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

import filterFns from './constants/filterFns';
import DataFetcher from './DataFetcher';
import MainAppMenu from './MainAppMenu';
import PaginatedArray from './PaginatedArray';
import TorrentList from './TorrentList';
import ConnectionSetup from './ConnectionSetup';

class Main extends React.Component {
  static propTypes = {
    appState: React.PropTypes.object.isRequired,
    connectionSettings: React.PropTypes.object.isRequired,
    torrentStore: React.PropTypes.array.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      navOpen: false,
    };
  }

  handleNavCloseRequest(isOpen) {
    if (isOpen) return;
    this.setState({ navOpen: false });
  }

  openNav() {
    this.setState({
      navOpen: true,
    });
  }

  render() {
    const filter = this.props.appState.filter;
    const torrents = this.props.torrentStore
      .filter(filterFns[filter.status])
      .filter((torrent) => filter.text === null || torrent.name.indexOf(filter.text) >= 0);

    if (!(this.props.connectionSettings.host && this.props.connectionSettings.username && this.props.connectionSettings.password)) {
      return (
        <div>
          <AppBar title="Shade" onTitleTouchTap={this.openNav.bind(this)} onLeftIconButtonTouchTap={this.openNav.bind(this)} titleStyle={{ WebkitAppRegion: 'drag' }} />
          <div style={{ padding: '16px 32px' }}>
            <h1 style={{ textAlign: 'center' }}>Welcome to Shade<br /><small style={{ fontSize: '40%' }}>There is a quick setup process we have to go through</small></h1>
            <ConnectionSetup />
          </div>
        </div>
      );
    }
    return (
      <div>
        <DataFetcher />
        <AppBar title="Shade" onTitleTouchTap={this.openNav.bind(this)} onLeftIconButtonTouchTap={this.openNav.bind(this)} titleStyle={{ WebkitAppRegion: 'drag' }} />
        <Drawer docked={false} open={this.state.navOpen} onRequestChange={this.handleNavCloseRequest.bind(this)}>
          <MainAppMenu closeNav={this.handleNavCloseRequest.bind(this, false)} />
        </Drawer>
        <PaginatedArray list={torrents} component={TorrentList} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  appState: state.appState,
  connectionSettings: state.connectionSettings,
  torrentStore: state.torrentStore,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
