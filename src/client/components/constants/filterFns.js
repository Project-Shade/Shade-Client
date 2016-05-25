export default {
  all: () => true,
  downloading: (torrent) => torrent.seeds.actual,
  seeding: (torrent) => torrent.peers.actual,
  active: (torrent) => torrent.peers.actual || torrent.seeds.actual,
  inactive: (torrent) => !(torrent.peers.actual || torrent.seeds.actual),
  completed: (torrent) => torrent.done === 1000,
};
