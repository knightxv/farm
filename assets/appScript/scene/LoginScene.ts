import BaseScene from './BaseScene';
const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScene extends BaseScene {
    needModules(ModuleDef): string[] {
        const { AudioModule, NetModule, LocalStroageModule, HttpModule } = ModuleDef;
        return [AudioModule, NetModule, LocalStroageModule, HttpModule];
    }
    userNameInput: cc.EditBox;
    pwdNameInput: cc.EditBox;
    registerPanel: cc.Node;
    registerPhoneInput: cc.EditBox;
    registerUserNameInput: cc.EditBox;
    registerPwdInput: cc.EditBox;
    webHttp;
    OnLoad() {
        const loginForm = cc.find('loginPanel/form', this.node);
        this.userNameInput = cc.find('userName/input', loginForm).getComponent(cc.EditBox);
        this.pwdNameInput = cc.find('passWord/input', loginForm).getComponent(cc.EditBox);
        // debug
        this.userNameInput.string = 'knight';
        this.pwdNameInput.string = '123456';
        this.registerPanel = this.node.getChildByName('registerPanel');
        const registerForm = cc.find('form', this.registerPanel);
        this.registerPhoneInput = cc.find('phone/input', registerForm).getComponent(cc.EditBox);;
        this.registerPwdInput = cc.find('passWord/input', registerForm).getComponent(cc.EditBox);;
        this.registerUserNameInput = cc.find('userName/input', registerForm).getComponent(cc.EditBox);

        this._listeners();
        this.webHttp = this.moduleManage.HttpModule.webHttp;
    }
    // 等用户按下登陆按钮时
    OnLoginBtnClick() {
        const userName = this.userNameInput.string;
        const password = this.pwdNameInput.string;
        const userLoginData = {
            userName,
            password,
            loginIp: null,
        };
        this.webHttp.get('/user/login', userLoginData).then(res => {
            if (!res.isSuccess) {
                return;
            }
            const { gameHost, gamePort, userToken } = res.data;
            const NetModule = this.moduleManage.NetModule;
            NetModule.connect(`ws://${gameHost}:${gamePort}`);
            NetModule.once(NetModule.Event.onConnect, () => {
                this.moduleManage.NetModule.gameLogin(userToken);
            });
        });
    }
    // 监听后端请求
    _listeners() {
        const NetModule = this.moduleManage.NetModule;
        NetModule.once(NetModule.Event.onLoginSuccess, () => {
            this.moduleManage.SceneModule.EnterMain();
        });  
    }
    // 切换注册面板
    toggleRegisterPanel() {
        this.registerPanel.active = !this.registerPanel.active;
    }
    OnRegisterBtnClick() {
        const phone = this.registerPhoneInput.string;
        const password = this.registerPwdInput.string;
        const userName = this.registerUserNameInput.string;
        const registerData = {
            userName: userName,
            phoneNumber: phone,
            password,
            loginIp: '',
        };
        this.webHttp.get('/user/create', registerData).then(res => {
            console.log(res);
        });
    }
}