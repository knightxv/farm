import BaseScene from './BaseScene';
const {ccclass, property} = cc._decorator;

@ccclass
export default class LaunchScene extends BaseScene {
    private updateProgressController = null;
    private progress: number = 0;
    private scheduleTimer;
    OnLoad() {
        this.initLoadingView();
        // 设置假加载
        this.scheduleTimer = this.schedule(() => {
            if (this.progress >= 100) {
                this.unschedule(this.scheduleTimer);
                this.loadSuccess();
                return;
            }
            this.progress += 5;
            this.setProgress(this.progress);
        }, 0.1);
    }
    // 加载成功
    private loadSuccess() {
        this.moduleManage.SceneModule.EnterLogin();
    }
    private bridNode: cc.Node = null;
    private _birdInitX: number = 0;
    // 设置进度条
    setProgress(per: number) {
        const _per = per / 100;
        this.loadingProgress.progress = _per;
        const birdX = this.loadingProgress.totalLength * _per + this._birdInitX;
        this.bridNode.x = birdX;
    }
    // 初始化loading组件
    private loadingNode: cc.Node = null;
    private loadingProgress: cc.ProgressBar;
    initLoadingView() {
        this.loadingNode = this.node.getChildByName('loading');
        this.bridNode = this.loadingNode.getChildByName('bird');
        this._birdInitX = this.bridNode.x;
        const loadingProgressNode = this.loadingNode.getChildByName('loadProgress');
        this.loadingProgress = loadingProgressNode.getComponent(cc.ProgressBar);
    }
}
