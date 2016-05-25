import size from 'filesize';

export default class FileSize {
  constructor(bytes) {
    this.bytes = bytes;
  }

  toString() {
    return size(this.bytes);
  }
}
