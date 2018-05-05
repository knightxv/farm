import BaseHttpModule from '../../../../baseScript/module/service/BaseHttpModule';

enum HttpStatu {
    SUCCESS = 200,
    FAil = 501,
    NOT_LOGIN = 502,
};

class WebHttp extends BaseHttpModule {
    async getHttpPrefix() {
        return 'http://192.168.31.132:8000'; // http://192.168.1.100:3000
    }
    async resolveRes(res) {
        if (res.data.status == HttpStatu.SUCCESS) {
            return {
                isSuccess: true,
                message: res.data.message,
                data: res.data.data,
            };
        }
        if (res.data.status == HttpStatu.FAil) {
            return {
                isSuccess: false,
                message: res.data.message,
                data: null,
            };
        }
        // 未登陆
        if (res.data.status == HttpStatu.NOT_LOGIN) {
            return null;
        }
    }
//  * setGetOption : 设置get option
//  * setPostOption : 设置post option

}

export default class HttpModule {
    private _webHttp = null;
    get webHttp() {
        return this._webHttp || (this._webHttp = new WebHttp());
    }
}
