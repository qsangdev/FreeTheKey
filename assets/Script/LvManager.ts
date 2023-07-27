import LocalStorage from "./LocalStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LvManager extends cc.Component {
  @property(cc.Node) gridStage1: cc.Node = null;
  @property(cc.Node) gridStage2: cc.Node = null;
  @property(cc.SpriteFrame) lockSprite: cc.SpriteFrame = null;
  @property(cc.AudioClip) soundIntro: cc.AudioClip = null;

  static instance: LvManager = null;
  highestUnlockedLevel: number;

  onLoad() {
    this.highestUnlockedLevel = LocalStorage.getHighestLevel();
    this.updateLevelStatus();
    cc.audioEngine.playEffect(this.soundIntro, false);
  }

  updateLevelStatus() {
    //gridStage1
    LvManager.instance = this;

    let levelButtons1 = this.gridStage1.children;

    for (let i = 0; i < levelButtons1.length; i++) {
      const e = levelButtons1[i];
      if (i >= LocalStorage.getHighestLevel() - 1) {
        e.getChildByName("maxMove").active = false;
      }

      e.getComponentInChildren(cc.Label).string =
        LocalStorage.getMinMoveAtLevel(i).toString();
      if (i >= this.highestUnlockedLevel) {
        e.getComponentInChildren(cc.Sprite).spriteFrame = this.lockSprite;
        e.getComponentInChildren(cc.Label).node.active = false;
        e.children[1].active = false;
        e.children[2].active = false;
      }
    }

    //gridStage2
    let levelButtons2 = this.gridStage2.children;

    for (let i = 0; i < levelButtons2.length; i++) {
      const e = levelButtons2[i];
      const level = i + 20;
      if (i >= LocalStorage.getHighestLevel() - 1) {
        e.getChildByName("maxMove").active = false;
      }
      e.getComponentInChildren(cc.Label).string =
        LocalStorage.getMinMoveAtLevel(level).toString();
      if (level > this.highestUnlockedLevel) {
        e.getComponentInChildren(cc.Sprite).spriteFrame = this.lockSprite;
        e.getComponentInChildren(cc.Label).node.active = false;
        e.children[1].active = false;
        e.children[2].active = false;
      }
    }
  }

}
