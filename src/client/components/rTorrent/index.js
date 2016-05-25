import RTRequest from './RTRequest';

export default class RTorrent {
  constructor(connectionInfo) {
    this.connectionInfo = connectionInfo;
  }

  getAll() {
    const req = new RTRequest(this.connectionInfo);
    req.setMode('list');
    return req.send();
  }

  addMagnetLink(URL) {
    const req = new RTRequest(Object.assign({}, this.connectionInfo, { path: '/php/addtorrent.php' }));
    req.addParam('url', URL);
    return req.send();
  }
}
