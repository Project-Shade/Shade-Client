import React from 'react';
import { connect } from 'react-redux';

import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import SettingsIcon from 'material-ui/svg-icons/action/settings';

import AllTorrentsIcon from 'material-ui/svg-icons/file/cloud-queue';
import DownloadingIcon from 'material-ui/svg-icons/file/cloud-download';
import SeedingIcon from 'material-ui/svg-icons/file/cloud-upload';
import ActiveIcon from 'material-ui/svg-icons/file/cloud';
import InactiveIcon from 'material-ui/svg-icons/file/cloud-off';
import CompleteIcon from 'material-ui/svg-icons/file/cloud-done';

import filterFns from './constants/filterFns';
import { updateFilterStatus, updateFilterText } from '../actions/appState';


class MainAppMenu extends React.Component {
  static propTypes = {
    appState: React.PropTypes.object.isRequired,
    closeNav: React.PropTypes.func.isRequired,
    torrentStore: React.PropTypes.array.isRequired,
    updateFilterStatus: React.PropTypes.func.isRequired,
    updateFilterText: React.PropTypes.func.isRequired,
  };

  render() {
    const avatarProps = {
      size: 20,
      style: {
        marginTop: 8,
      },
    };

    const nums = {
      all: this.props.torrentStore.filter(filterFns.all).length,
      downloading: this.props.torrentStore.filter(filterFns.downloading).length,
      seeding: this.props.torrentStore.filter(filterFns.seeding).length,
      active: this.props.torrentStore.filter(filterFns.active).length,
      inactive: this.props.torrentStore.filter(filterFns.inactive).length,
      completed: this.props.torrentStore.filter(filterFns.completed).length,
    };

    const selectedStyle = {
      backgroundColor: 'rgba(255, 255, 255, 0.0980392)',
    };

    const torrentStates = [
      ['all', <AllTorrentsIcon />],
      ['downloading', <DownloadingIcon />],
      ['completed', <CompleteIcon />],
      ['active', <ActiveIcon />],
      ['inactive', <InactiveIcon />],
      ['seeding', <SeedingIcon />],
    ];

    return (
      <div>
        <List>
          <Subheader>Torrent States</Subheader>
          {
            torrentStates.map((state) => (
              <ListItem
                primaryText={`${state[0].charAt(0).toUpperCase()}${state[0].slice(1)}`} leftIcon={state[1]}
                rightAvatar={<Avatar {...avatarProps}>{nums[state[0]]}</Avatar>} key={state[0]}
                onClick={this.props.updateFilterStatus.bind(this, state[0])} style={this.props.appState.filter.status === state[0] ? selectedStyle : {}}
              />
            ))
          }
        </List>
        <Divider />
        <List>
          <ListItem primaryText="Settings" rightIcon={<SettingsIcon />} />
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  appState: state.appState,
  torrentStore: state.torrentStore,
});

const mapDispatchToProps = (dispatch) => ({
  updateFilterStatus: (status) => dispatch(updateFilterStatus(status)),
  updateFilterText: (text) => dispatch(updateFilterText(text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainAppMenu);
