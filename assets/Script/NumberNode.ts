const { ccclass, property } = cc._decorator;

@ccclass
export default class NumberNode extends cc.Component {
  @property([cc.SpriteFrame])
  numberSprites: cc.SpriteFrame[] = [];
  currentNumber: number = 0;
  sprite: cc.Sprite = null;

  onLoad() {
    this.sprite = this.node.getComponent(cc.Sprite);
    this.updateSprite();
  }

  moveCount() {
    this.currentNumber = (this.currentNumber + 1) % 10;
    this.updateSprite();
  }

  updateSprite() {
    this.sprite.spriteFrame = this.numberSprites[this.currentNumber];
  }
}
