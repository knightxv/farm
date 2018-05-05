export default class NetMedium {
  private wsUrl: string = '';
  public ws: WebSocket = null;
    constructor(wsUrl) {
      this.wsUrl = wsUrl; // 连接地址
      this.connect();
    }
    connect() {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => {
        this._listener();
        this.onConnect();
      };
    }
    onConnect() {
    }
    request(route, body) {
      const postBuf = this.packObj2Buf(route, body);
      this.ws.send(postBuf);
      // return new Promise(resolve => {
      // });
    }
    private _listener() {
      this.ws.binaryType = "arraybuffer";
      this.ws.onmessage = (evt) => {
        console.log("Received Message: " + evt.data);
      };
      this.ws.onclose = (closeEvent) => {
        console.log('closeEvent', closeEvent);
      };
      this.ws.onerror = (err) => {
        console.log('err', err);
      };
    }
    // close() {
    //   this.ws.close();
    // }
    concatenate(...bufArrays) {
      let totalLength = 0;
      for (let arr of bufArrays) {
        totalLength += arr.byteLength;
      }
      let result = new Uint8Array(totalLength);
      let offset = 0;
      for (let arr of bufArrays) {
        result.set(new Uint8Array(arr), offset);
        offset += arr.byteLength;
      }
      return result;
    }
    // Convert a UTF-8 String to an ArrayBuffer
    str2ab(str) {
      var buf = new ArrayBuffer(str.length); // 1 byte for each char
      var bufView = new Uint8Array(buf);
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    }
    ab2str(buffer){ // Convert an ArrayBuffer to an UTF-8 String
      var bufView = new Uint8Array(buffer);
      var length = bufView.length;
      var result = '';
      var addition = Math.pow(2,8)-1;
      for(var i = 0;i<length;i+=addition){
          if(i + addition > length){
              addition = length - i;
          }
          result += String.fromCharCode.apply(null, bufView.subarray(i,i+addition));
      }
      return result;
  }
    num2ab(num) {
      const buffer = new ArrayBuffer(2);
      const v2 = new Uint8Array(buffer);
      v2[0] = num & 0xff;
      v2[1] = (num >> 8) & 0xff
      return buffer;
    }
    ab2num(buf) {
      const low = buf[0];
      const high = buf[1];
      const s0 = low & 0xff;
      let s1 = high & 0xff;
      s1 <<= 8;
      return s0 | s1;
    }
    packObj2Buf(route, body) {
      const postBody = body;
      const header = route;
      const bodyStr = JSON.stringify(postBody);
      const headerLength = header.length;
      const bodyLength = bodyStr.length;
  
      const headLenBuf = this.num2ab(headerLength);
      const bodyLenBuf = this.num2ab(bodyLength);
      const elseLenBuf = this.num2ab(0);
      const headBuf = this.str2ab(header);
      const bodyBuf = this.str2ab(bodyStr);
      const postBuf = this.concatenate(headLenBuf, bodyLenBuf, elseLenBuf, headBuf, bodyBuf);
      return postBuf;
    }
    buf2PackObj(buf) {
      const packBody = {};
      var bufView = new Uint8Array(buf);
      const headerLengthBuf = bufView.slice(0, 2);
      const bodyLengthBuf = bufView.slice(2, 4);
      const headerLength = this.ab2num(headerLengthBuf);
      const bodyLength = this.ab2num(bodyLengthBuf);
      const headBuf = buf.slice(6, headerLength + 6);
      const route = this.ab2str(headBuf);
      const bodyBuf = buf.slice(headerLength + 6, headerLength + 6 + bodyLength);
      const bodyStr = this.ab2str(bodyBuf);
      return {
        route,
        body: JSON.parse(bodyStr)
      };
    }
  }