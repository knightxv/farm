import BaseModuleManage from '../../../baseScript/module/BaseModuleManage';
import SceneModule from '../module/service/SceneModule';
import ToolModule from './service/ToolModule';
import AudioModule from '../module/service/AudioModule';
import NetModule from './service/NetModule';
import HttpModule from './service/HttpModule';
import LocalStroageModule from './service/LocalStroageModule';

enum ModuleDef {
    LoginModule = 'LoginModule',
    SceneModule = 'SceneModule',
    ToolModule = 'ToolModule',
    AudioModule = 'AudioModule',
    EnumModule = 'EnumModule',
    GameModule = 'GameModule',
    NetModule = 'NetModule',
    CmdModule = 'CmdModule',
    HttpModule = 'HttpModule',
    LocalStroageModule = 'LocalStroageModule',
};

class ModuleManage extends BaseModuleManage {
    public ModuleDef = ModuleDef;
    SceneModule: SceneModule;
    ToolModule: ToolModule;
    AudioModule: AudioModule;
    NetModule: NetModule;
    LocalStroageModule: LocalStroageModule;
    HttpModule: HttpModule;
    EnumModule: any = {};
    // 共有的模块(默认会初始化)
    public commonModules: ModuleDef[] = [
        ModuleDef.SceneModule,
        ModuleDef.ToolModule,
    ];
    // 初始化模块
    constructor() {
        super();
        this.createModules(this.commonModules);
    }
}

export default new ModuleManage();

// export default (() => {
//     let manageInstance: ModuleManage | null = null;
//     return () : ModuleManage => {
//         if (!manageInstance) {
//             manageInstance = new ModuleManage();
//         }
//         return manageInstance;
//     };
// })();
