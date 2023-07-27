import GamePlay from "./GamePlay";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Block extends cc.Component {
  @property typeMove: number = 1;

  isColliding: boolean = false;
  lockLeft = false;
  lockRight = false;
  lockUp = false;
  lockDown = false;

  lockLeftX = null;
  lockRightX = null;
  lockUpY = null;
  lockDownY = null;

  onCollisionEnter(other, self) {
    if (GamePlay.instance.currentHoldingBlock != this.node) return;
    if (other.tag == 1) {
      GamePlay.instance.onCompleteLevel();
    } else {
      GamePlay.instance.isOnBlockCollision = true;
      GamePlay.instance.touchLocOnBlockCollision =
        GamePlay.instance.currentTouchLoc;

      this.isColliding = true;

      let nodeA = this.node;
      let nodeB: cc.Node = other.node;

      if (this.typeMove == 2) {
        if (nodeA.position.x - nodeB.position.x < 0) {
          let pos = nodeA.position;
          pos.x =
            nodeB.x -
            nodeB.getContentSize().width / 2 -
            nodeA.getContentSize().width / 2;
          nodeA.position = pos;
          this.lockRight = true;
          this.lockRightX = GamePlay.instance.currentTouchLoc.x;
        } else {
          let pos = nodeA.position;
          pos.x =
            nodeB.x +
            nodeB.getContentSize().width / 2 +
            nodeA.getContentSize().width / 2;
          nodeA.position = pos;
          this.lockLeft = true;
          this.lockLeftX = GamePlay.instance.currentTouchLoc.x;
        }
      } else {
        if (nodeA.position.y - nodeB.position.y < 0) {
          let pos = nodeA.position;
          pos.y =
            nodeB.y -
            nodeB.getContentSize().height / 2 -
            nodeA.getContentSize().height / 2;
          nodeA.position = pos;
          this.lockUp = true;
          this.lockUpY = GamePlay.instance.currentTouchLoc.y;
        } else {
          let pos = nodeA.position;
          pos.y =
            nodeB.y +
            nodeB.getContentSize().height / 2 +
            nodeA.getContentSize().height / 2;
          nodeA.position = pos;
          this.lockDown = true;
          this.lockDownY = GamePlay.instance.currentTouchLoc.y;
        }
      }
    }
  }
}
