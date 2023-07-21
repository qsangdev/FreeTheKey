import GamePlay from "./GamePlay";
import Levels from "./Levels";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Block extends cc.Component {
  @property typeMove: number = 1;

  isColliding: boolean = false;
  lockLeft = false;
  lockRight = false;
  lockUp = false;
  lockDown = false;

  onCollisionEnter(other, self) {
    if (other.tag == 1) {
      console.log("next level!");
      GamePlay.instance.onMouseLeave();
      GamePlay.instance.onMouseUp();
      Levels.instance.currentLevel += 1;
      Levels.instance.LoadScene(null, Levels.instance.currentLevel.toString());
      
    } else {
      this.isColliding = true;
      if (GamePlay.instance.touchDelta.y > 0) {
        this.lockUp = true;
        this.lockDown = false;
      }
      if (GamePlay.instance.touchDelta.y < 0) {
        this.lockDown = true;
        this.lockUp = false;
      }
      if (GamePlay.instance.touchDelta.x > 0) {
        this.lockRight = true;
        this.lockLeft = false;
      }
      if (GamePlay.instance.touchDelta.x < 0) {
        this.lockRight = false;
        this.lockLeft = true;
      }
    }
  }

  onCollisionExit() {
    this.isColliding = false;
    this.lockLeft = false;
    this.lockRight = false;
    this.lockUp = false;
    this.lockDown = false;
  }
}
