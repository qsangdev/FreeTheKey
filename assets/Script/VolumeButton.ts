const { ccclass, property } = cc._decorator;

@ccclass
export default class VolumeButton extends cc.Component {
  @property(cc.SpriteFrame)
  volumeOnSprite: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  volumeOffSprite: cc.SpriteFrame = null;

  sprite: cc.Sprite = null;
  currentSprite: cc.SpriteFrame;

  onLoad() {
    this.currentSprite = this.volumeOnSprite;
  }

  onClickButton() {
    if (this.currentSprite === this.volumeOnSprite) {
      this.currentSprite = this.volumeOffSprite;
    } else {
      this.currentSprite = this.volumeOnSprite;
    }
    this.updateButtonSprite();
  }

  updateButtonSprite() {
    const button = this.getComponent(cc.Button);
    const sprite = button.node.getComponent(cc.Sprite);
    sprite.spriteFrame = this.currentSprite;
  }
}
