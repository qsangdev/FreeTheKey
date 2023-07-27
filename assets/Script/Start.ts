const { ccclass, property } = cc._decorator;

@ccclass
export default class Start extends cc.Component {
  @property(cc.AudioClip) introSound: cc.AudioClip = null;

  protected onLoad(): void {
    cc.audioEngine.playEffect(this.introSound, false);
  }

  protected onDestroy(): void {}
}
