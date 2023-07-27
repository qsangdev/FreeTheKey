import GamePlay from "./GamePlay";
import LocalStorage from "./LocalStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NumberNode extends cc.Component {
  @property([cc.SpriteFrame])
  numberSprites: cc.SpriteFrame[] = [];

  @property([cc.Sprite])
  count9: cc.Sprite = null;

  @property([cc.Sprite])
  count99: cc.Sprite = null;

  @property([cc.Sprite])
  count999: cc.Sprite = null;

  currentNumber: number = 0;
  sprite: cc.Sprite = null;

  onLoad() {
    this.sprite = this.node.getComponent(cc.Sprite);
    this.updateSprite();
  }

  moveCount() {
    this.currentNumber = this.currentNumber + 1;
    this.updateSprite();
  }

  updateSprite() {
    if (this.currentNumber < 10) {
      this.count9.spriteFrame = this.numberSprites[this.currentNumber];
    }
    if (this.currentNumber > 9) {
      this.count99.node.active = true;
      this.count9.spriteFrame =
        this.numberSprites[Math.floor(this.currentNumber / 10)];
      this.count99.spriteFrame = this.numberSprites[this.currentNumber % 10];
    } else this.count99.node.active = false;

    if (this.currentNumber > 99) {
      this.count999.node.active = true;
      this.count9.spriteFrame =
        this.numberSprites[Math.floor(this.currentNumber / 100)];
      this.count99.spriteFrame =
        this.numberSprites[Math.floor((this.currentNumber % 100) / 10)];
      this.count999.spriteFrame = this.numberSprites[this.currentNumber % 10];
    } else this.count999.node.active = false;
  }
}
