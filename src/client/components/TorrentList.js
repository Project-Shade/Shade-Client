import React from 'react';

import Torrent from './Torrent';

export default class TorrentList extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
  };

  render() {
    return (
      <div>
        {
          this.props.data.map((torrent) => (
            <Torrent torrent={torrent} key={torrent.hash} />
          ))
        }
      </div>
    );
  }
}
