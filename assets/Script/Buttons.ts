import GamePlay from "./GamePlay";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Button extends cc.Component {
  @property(cc.SpriteFrame)
  volumeOnSprite: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  volumeOffSprite: cc.SpriteFrame = null;

  sprite: cc.Sprite = null;
  currentSprite: cc.SpriteFrame;
  pressed: boolean = false;

  onLoad() {
    this.currentSprite = this.volumeOnSprite;
  }

  onClickButton() {
    if (this.currentSprite === this.volumeOnSprite) {
      this.currentSprite = this.volumeOffSprite;
      cc.audioEngine.setMusicVolume(0);
      cc.audioEngine.setEffectsVolume(0);
    } else {
      this.currentSprite = this.volumeOnSprite;
      cc.audioEngine.setMusicVolume(1);
      cc.audioEngine.setEffectsVolume(1);
    }
    this.updateButtonSprite();
  }

  updateButtonSprite() {
    const button = this.getComponent(cc.Button);
    const sprite = button.node.getComponent(cc.Sprite);
    sprite.spriteFrame = this.currentSprite;
  }

  LoadCurrentScene() {
    if (!this.pressed) {
      this.pressed = true;
      GamePlay.instance.restartLevel();
    }
  }

  LoadScene0() {
    cc.director.loadScene("levels");
  }
}
