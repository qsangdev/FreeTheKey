import { GlobalVariables } from "./GlobalVariables";
import LocalStorage from "./LocalStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Levels extends cc.Component {
  static instance: Levels = null;

  @property(cc.Node) main: cc.Node = null;
  @property(cc.Button) right: cc.Button = null;
  @property(cc.Button) left: cc.Button = null;
  @property(cc.Node) dot1: cc.Node = null;
  @property(cc.Node) dot2: cc.Node = null;

  @property(cc.SpriteFrame) dotOnSprite: cc.SpriteFrame = null;
  @property(cc.SpriteFrame) dotOffSprite: cc.SpriteFrame = null;

  @property(cc.AudioClip) soundBoardMove: cc.AudioClip = null;

  currentLevel: number = 0;
  currentPage: number = 1;
  allowTransition = true;

  onLoad() {
    Levels.instance = this;
    this.currentLevel = LocalStorage.getCurrentLevel();
  }

  LoadScene(event: Event, customEventData: string) {
    if (parseInt(customEventData) > LocalStorage.getHighestLevel() - 1) return;
    LocalStorage.setCurrentLevel(parseInt(customEventData));
    this.currentLevel = parseInt(customEventData);
    GlobalVariables.levelGridData = this.levels[this.currentLevel];
    cc.director.loadScene("gamePlay");
  }

  nextBoard() {
    if (this.currentPage == 1 && this.allowTransition) {
      this.allowTransition = false;
      cc.audioEngine.playEffect(this.soundBoardMove, false);
      cc.tween(this.main)
        .by(0.5, { position: cc.v3(-644, 0) })
        .call(() => {
          this.allowTransition = true;
          this.dot1.getComponent(cc.Sprite).spriteFrame = this.dotOffSprite;
          this.dot2.getComponent(cc.Sprite).spriteFrame = this.dotOnSprite;
          this.currentPage = 2;
        })
        .start();
    }
  }

  prevBoard() {
    if (this.currentPage == 2 && this.allowTransition) {
      this.allowTransition = false;
      cc.audioEngine.playEffect(this.soundBoardMove, false);
      cc.tween(this.main)
        .by(0.5, { position: cc.v3(644, 0) })
        .call(() => {
          this.allowTransition = true;
          this.dot1.getComponent(cc.Sprite).spriteFrame = this.dotOnSprite;
          this.dot2.getComponent(cc.Sprite).spriteFrame = this.dotOffSprite;
          this.currentPage = 1;
        })
        .start();
    }
  }

  levels = [
    // level 1
    [
      [0, 3, 0, 0, 2, 1],
      [0, 0, 0, 5, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [4, 0, 0, 0, 2, 0],
      [0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 2],
    ],
    // level 2
    [
      [1, 0, 0, 5, 0, 3],
      [0, 0, 4, 0, 0, 0],
      [0, 3, 0, 0, 0, 0],
      [1, 0, 0, 0, 3, 0],
      [0, 1, 0, 3, 0, 4],
      [0, 0, 0, 0, 2, 0],
    ],
    // level 3
    [
      [0, 0, 0, 0, 0, 0],
      [0, 3, 1, 5, 0, 0],
      [1, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0],
    ],
    // level 4
    [
      [0, 0, 0, 0, 0, 2],
      [0, 0, 0, 5, 0, 0],
      [0, 0, 3, 0, 0, 0],
      [4, 0, 0, 0, 0, 2],
      [0, 0, 4, 0, 0, 0],
      [0, 3, 0, 0, 0, 0],
    ],
    // level 5
    [
      [0, 3, 0, 0, 2, 1],
      [0, 0, 0, 5, 0, 0],
      [0, 0, 4, 0, 0, 0],
      [0, 0, 0, 0, 0, 2],
      [1, 1, 0, 0, 2, 0],
      [0, 0, 0, 3, 0, 3],
    ],
    // level 6
    [
      [0, 3, 1, 0, 1, 1],
      [0, 0, 0, 5, 0, 0],
      [0, 0, 3, 0, 0, 0],
      [0, 0, 0, 2, 0, 3],
      [4, 0, 0, 0, 2, 0],
      [0, 0, 0, 0, 2, 0],
    ],
    // level 7
    [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 5, 0, 3],
      [0, 0, 1, 0, 0, 1],
      [0, 3, 0, 0, 3, 0],
      [0, 0, 0, 0, 0, 3],
      [0, 0, 0, 3, 0, 3],
    ],
    // level 8
    [
      [1, 1, 1, 5, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 3, 0, 3, 1, 0],
      [4, 4, 0, 3, 0, 1],
      [0, 0, 1, 0, 3, 0],
      [0, 0, 0, 0, 0, 2],
    ],
    // level 9
    [
      [0, 0, 2, 5, 0, 0],
      [0, 0, 0, 0, 0, 3],
      [0, 3, 4, 0, 0, 1],
      [0, 0, 0, 0, 3, 0],
      [0, 0, 0, 2, 1, 1],
      [0, 3, 0, 3, 0, 0],
    ],
    // level 10
    [
      [1, 0, 0, 2, 1, 1],
      [0, 4, 0, 5, 0, 0],
      [0, 0, 0, 0, 0, 3],
      [0, 3, 0, 0, 0, 0],
      [1, 0, 0, 0, 1, 1],
      [0, 0, 0, 2, 0, 0],
    ],
    // level 11
    [
      [0, 0, 0, 0, 0, 2],
      [0, 0, 0, 5, 0, 1],
      [0, 0, 3, 0, 0, 0],
      [4, 0, 0, 0, 0, 2],
      [0, 0, 4, 0, 0, 0],
      [0, 3, 0, 0, 0, 0],
    ],
    // level 12
    [
      [0, 0, 0, 5, 0, 3],
      [4, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 2, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 3, 4, 0, 0, 0],
      [0, 0, 0, 0, 0, 2],
    ],
    // level 13
    [
      [0, 0, 2, 0, 0, 1],
      [1, 0, 0, 3, 0, 0],
      [0, 0, 0, 0, 3, 1],
      [0, 3, 1, 5, 0, 0],
      [1, 1, 0, 0, 0, 3],
      [0, 0, 0, 0, 2, 0],
    ],
    //level 14
    [
      [1, 0, 0, 3, 0, 1],
      [0, 0, 0, 3, 0, 0],
      [0, 3, 1, 5, 0, 3],
      [0, 0, 0, 0, 0, 0],
      [0, 1, 0, 3, 1, 0],
      [0, 0, 0, 3, 0, 0],
    ],
    // level 15
    [
      [0, 0, 0, 2, 1, 0],
      [1, 0, 0, 2, 0, 1],
      [0, 0, 3, 5, 1, 0],
      [1, 0, 3, 0, 0, 1],
      [0, 1, 0, 0, 2, 0],
      [0, 0, 0, 0, 2, 0],
    ],
    // level 16
    [
      [1, 0, 0, 0, 3, 1],
      [0, 0, 0, 3, 0, 0],
      [0, 0, 0, 2, 1, 1],
      [0, 0, 0, 5, 0, 0],
      [0, 0, 4, 0, 0, 3],
      [0, 0, 0, 0, 0, 2],
    ],
    // level 17
    [
      [0, 0, 1, 5, 0, 3],
      [4, 4, 0, 0, 0, 0],
      [0, 0, 0, 3, 1, 4],
      [0, 0, 2, 0, 0, 0],
      [0, 3, 0, 0, 1, 0],
      [0, 3, 0, 0, 0, 0],
    ],
    // level 18
    [
      [0, 0, 0, 2, 1, 1],
      [4, 1, 0, 5, 0, 0],
      [0, 0, 4, 0, 0, 3],
      [0, 0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ],
    // level 19
    [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 3, 0, 0],
      [0, 4, 1, 5, 0, 3],
      [0, 0, 0, 0, 0, 1],
      [0, 0, 3, 0, 3, 0],
      [0, 0, 0, 0, 0, 0],
    ],
    // level 20
    [
      [0, 0, 0, 5, 0, 3],
      [0, 0, 0, 0, 1, 0],
      [0, 3, 0, 3, 0, 0],
      [0, 1, 0, 0, 3, 0],
      [4, 0, 0, 0, 0, 4],
      [0, 0, 0, 2, 0, 0],
    ],
    // level 21
    [
      [0, 0, 0, 0, 2, 1],
      [0, 0, 0, 5, 0, 0],
      [0, 0, 4, 0, 0, 3],
      [0, 0, 0, 0, 0, 2],
      [4, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ],
    // level 22
    [
      [0, 3, 0, 0, 3, 0],
      [0, 0, 3, 5, 0, 0],
      [4, 1, 0, 0, 0, 3],
      [0, 0, 0, 0, 2, 0],
      [0, 0, 1, 0, 1, 4],
      [0, 3, 0, 0, 0, 0],
    ],
    // level 23
    [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 3, 0, 3, 0],
      [4, 0, 3, 5, 1, 4],
      [0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 2],
    ],
    // level 24
    [
      [1, 0, 0, 3, 0, 0],
      [0, 4, 1, 0, 3, 0],
      [0, 0, 0, 5, 0, 3],
      [0, 0, 0, 0, 0, 1],
      [0, 3, 0, 3, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ],
    // level 25
    [
      [0, 0, 0, 2, 1, 1],
      [0, 3, 0, 5, 0, 0],
      [0, 0, 4, 0, 0, 3],
      [0, 3, 0, 0, 0, 0],
      [1, 1, 0, 3, 0, 1],
      [0, 0, 0, 0, 2, 0],
    ],
    // level 26
    [
      [0, 0, 3, 0, 3, 0],
      [0, 0, 0, 5, 0, 3],
      [0, 3, 4, 0, 0, 0],
      [1, 0, 0, 0, 3, 0],
      [0, 0, 0, 0, 2, 4],
      [0, 3, 0, 3, 0, 0],
    ],
    // level 27
    [
      [0, 0, 0, 5, 0, 3],
      [0, 0, 0, 0, 1, 1],
      [0, 3, 0, 3, 0, 0],
      [0, 0, 1, 0, 0, 2],
      [4, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0],
    ],
    // level 28
    [
      [1, 0, 3, 5, 0, 0],
      [0, 0, 3, 0, 0, 4],
      [1, 0, 0, 0, 2, 0],
      [0, 4, 1, 0, 0, 3],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 2, 0, 0, 0],
    ],
    // level 29
    [
      [0, 0, 3, 5, 0, 0],
      [4, 1, 1, 0, 0, 4],
      [0, 0, 0, 0, 3, 0],
      [0, 3, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 2],
      [0, 3, 0, 3, 0, 0],
    ],
    // level 30
    [
      [1, 0, 1, 0, 0, 2],
      [0, 0, 0, 5, 0, 0],
      [1, 0, 1, 0, 0, 3],
      [0, 0, 0, 0, 3, 0],
      [0, 0, 0, 0, 0, 4],
      [0, 0, 2, 0, 0, 0],
    ],
    // level 31
    [
      [0, 1, 0, 3, 0, 1],
      [0, 0, 0, 5, 0, 0],
      [0, 0, 2, 0, 0, 0],
      [0, 0, 1, 0, 3, 0],
      [4, 0, 0, 0, 1, 4],
      [0, 0, 0, 2, 0, 0],
    ],
    // level 32
    [
      [1, 0, 3, 5, 0, 1],
      [0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 2],
      [0, 3, 1, 0, 0, 3],
      [0, 0, 0, 0, 0, 1],
      [0, 0, 2, 0, 0, 0],
    ],
    // level 33
    [
      [0, 0, 3, 5, 0, 0],
      [4, 1, 1, 0, 0, 3],
      [0, 0, 0, 0, 0, 2],
      [0, 3, 1, 0, 0, 0],
      [0, 3, 0, 0, 0, 1],
      [0, 0, 2, 0, 0, 0],
    ],
    // level 34
    [
      [1, 0, 0, 5, 0, 3],
      [0, 0, 4, 0, 0, 0],
      [0, 3, 0, 0, 0, 0],
      [1, 0, 3, 0, 3, 0],
      [0, 1, 0, 3, 0, 4],
      [0, 0, 0, 0, 2, 0],
    ],
    // level 35
    [
      [1, 0, 3, 5, 0, 0],
      [0, 1, 0, 0, 0, 0],
      [0, 0, 4, 0, 0, 2],
      [0, 3, 0, 0, 3, 1],
      [0, 3, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 2],
    ],
    // level 36
    [
      [1, 0, 0, 0, 0, 2],
      [0, 0, 4, 0, 3, 0],
      [0, 3, 0, 5, 1, 4],
      [0, 0, 3, 0, 0, 0],
      [0, 1, 0, 0, 0, 1],
      [0, 0, 0, 0, 2, 0],
    ],
    // level 37
    [
      [1, 0, 0, 2, 1, 1],
      [0, 0, 0, 5, 0, 0],
      [0, 0, 4, 0, 0, 3],
      [0, 3, 0, 0, 0, 0],
      [1, 1, 0, 0, 2, 1],
      [0, 0, 0, 0, 2, 0],
    ],
    // level 38
    [
      [0, 0, 0, 5, 0, 3],
      [0, 0, 0, 0, 1, 0],
      [0, 3, 0, 3, 0, 0],
      [0, 1, 1, 0, 3, 0],
      [4, 0, 0, 0, 0, 4],
      [0, 0, 0, 2, 0, 0],
    ],
    // level 39
    [
      [0, 3, 1, 5, 0, 0],
      [0, 3, 0, 0, 0, 0],
      [1, 1, 0, 3, 0, 3],
      [0, 0, 1, 0, 3, 0],
      [0, 0, 0, 0, 0, 4],
      [0, 0, 0, 2, 0, 0],
    ],
    // level 40
    [
      [1, 0, 0, 0, 0, 2],
      [0, 0, 4, 0, 3, 1],
      [0, 3, 0, 0, 3, 0],
      [1, 0, 3, 5, 0, 0],
      [0, 1, 0, 0, 0, 3],
      [0, 0, 0, 0, 2, 0],
    ],
  ];
}
