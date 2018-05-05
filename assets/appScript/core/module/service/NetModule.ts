import BaseNetModule from '../../../../baseScript/module/service/BaseNetModule';
import NetMedium from '../../lib/NetMedium';


enum eventType {
    onConnect = 'onConnect',
    onLoginSuccess = 'onLoginSuccess',
};

export default class NetModule extends BaseNetModule {
    isDebug: boolean = true;
    isConnect: boolean = false;
    Event = eventType;
    public socket: NetMedium;
    constructor() {
        super();
    }
    connect(url) {
        this.socket = new NetMedium(url);
        this.socket.onConnect = () => {
            this.emit(eventType.onConnect);
        };
    }
    // 监听事件
    listener() {
        this.socket
        // // pomelo.on('onInterRoom', (msg) => {
        // //     console.log(msg);
        // // })
        // pomelo.on('onReceiveCmd', (msg) => {
        //     this.emit(eventType.onReceiveCmd, msg);
        // })
    }
    request(route, body) {
        this.socket.request(route, body);
    }
    disconnect() {
    }
    // 游戏登陆
    gameLogin(userToken) {
        if (this.isDebug) {
            this.emit(eventType.onLoginSuccess);
            return;
        }
        this.request('/main/login', { loginToken: userToken });
    }

}
