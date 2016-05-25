import React from 'react';

import LinearProgress from 'material-ui/LinearProgress';
import Paper from 'material-ui/Paper';
import DownloadingIcon from 'material-ui/svg-icons/file/file-download';
import SeedingIcon from 'material-ui/svg-icons/file/file-upload';
import { green900 } from 'material-ui/styles/colors';

export default class Torrent extends React.Component {
  static propTypes = {
    torrent: React.PropTypes.object.isRequired,
  };

  render() {
    const style = {
      margin: '8px 12px',
      padding: 8,
    };

    let progress;
    if (this.props.torrent.size.bytes === 0) {
      progress = 0;
    } else {
      progress = Math.round(10000 * (this.props.torrent.transferred.down.bytes / this.props.torrent.size.bytes)) / 100;
    }

    return (
      <Paper style={style} zDepth={2} rounded={false}>
        <div><b>{this.props.torrent.name}</b><span style={{ float: 'right' }}>
          <DownloadingIcon /> {this.props.torrent.speed.down.toString()}/s
          <SeedingIcon /> {this.props.torrent.speed.up.toString()}/s
        </span></div>
        <span>Progress: {progress}%</span>
        {
          (() => {
            if (progress === 100) {
              return (<LinearProgress mode="determinate" value={progress} color={green900} />);
            }
            return (<LinearProgress mode="determinate" value={progress} />);
          })()
        }
      </Paper>
    );
  }
}
