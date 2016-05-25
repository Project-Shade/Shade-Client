import request from 'request';
import Torrent from './Torrent';

export default class RTRequest {
  constructor({
    host,
    path,
    username,
    password,
  }) {
    this.host = host;
    this.path = path;
    this.user = username;
    this.pass = password;

    this.params = {};
  }

  addParam(key, value) {
    this.params[key] = value;
    return this;
  }

  setMode(mode) {
    this.addParam('mode', mode);
    return this;
  }

  send() {
    const auth = `Basic ${new Buffer(`${this.user}:${this.pass}`).toString('base64')}`;
    return new Promise((resolve, reject) => {
      request
        .post(`${this.host}${this.path}`, {
          form: this.params,
          headers: {
            Authorization: auth,
          },
        }, (error, response, body) => {
          if (error) return reject(error);
          let data;
          try {
            data = JSON.parse(body).t;
          } catch (e) {
            return reject(e);
          }
          resolve(Object.keys(data).map((key) => new Torrent(key, data[key])));
        });
    });
  }
}
