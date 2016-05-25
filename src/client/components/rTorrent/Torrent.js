import FileSize from './FileSize';

const iv = (val) => {
  const v = (val == null) ? 0 : parseInt(`${val}`, 10);
  return (isNaN(v) ? 0 : v);
};

export default class Torrent {
  static Status = {
    STARTED: 'TORREND_STATUS_STARTED',
    PAUSED: 'TORRENT_STATUS_PAUSED',
    HASHING: 'TORRENT_STATUS_HASHING',
    CHECKING: 'TORRENT_STATUS_CHECKING',
    ERROR: 'TORRENT_STATUS_ERROR',
  };

  constructor(hash, values) {
    const isOpen = iv(values[0]);
    const isHashChecking = iv(values[1]);
    const isHashChecked = iv(values[2]);
    const getState = iv(values[3]);
    const getHashing = iv(values[23]);
    const isActive = values[29];
    const getCompletedChunks = iv(values[6]);
    const getHashedChunks = iv(values[24]);
    const getSizeChunks = iv(values[7]);
    const chunksProcessing = (isHashChecking === 0) ? getCompletedChunks : getHashedChunks;
    const getChunkSize = iv(values[13]);

    this.hash = hash;
    this.msg = values[29];

    // State calculation
    if (isOpen !== 0) {
      this.state = Torrent.Status.STARTED;
      if (getState === 0 || isActive === 0) {
        this.state = Torrent.Status.PAUSED;
      }
    }
    if (getHashing !== 0) {
      this.state = Torrent.Status.HASHING;
    }
    if (isHashChecking !== 0) {
      this.state = Torrent.Status.CHECKING;
    }
    if (this.msg.length && this.msg !== 'Tracker: [Tried all trackers.]') {
      this.state = Torrent.Status.ERROR;
    }

    this.name = values[4];
    this.size = new FileSize(parseInt(values[5], 10));

    this.done = Math.floor(chunksProcessing / getSizeChunks * 1000);

    this.transferred = {
      up: new FileSize(iv(values[9])),
      down: new FileSize(iv(values[8])),
      ratio: iv(values[10]),
    };

    this.speed = {
      up: new FileSize(iv(values[11])),
      down: new FileSize(iv(values[12])),
    };

    this.eta = (this.speed.down > 0) ? Math.floor((getSizeChunks - getCompletedChunks) * getChunkSize / this.speed.down) : -1;

    try {
      this.label = decodeURIComponent(values[14]).trim();
    } catch (e) {
      this.label = '';
    }

    const getPeersNotConnected = iv(values[16]);
    const getPeersConnected = iv(values[17]);
    const getPeersAll = getPeersNotConnected + getPeersConnected;

    this.peers = {
      actual: iv(values[15]),
      all: getPeersAll,
    };

    this.seeds = {
      actual: iv(values[18]),
      all: getPeersAll,
    };


    this.remaining = iv(values[19]);
    this.priority = values[20];
    this.state_changed = values[21];
    this.skip_total = iv(values[22]);
    this.base_path = values[25];
    this.created = values[26];
    this.tracker_focus = values[27];


    try {
      this.comment = values[30];
      if (this.comment.search('VRS24mrker') === 0) {
        this.comment = decodeURIComponent(this.comment.substr(10));
      }
    } catch (e) {
      this.comment = '';
    }

    this.free_diskspace = new FileSize(parseInt(values[31], 10));
    this.private = values[32];
    this.multi_file = iv(values[33]);
  }
}
