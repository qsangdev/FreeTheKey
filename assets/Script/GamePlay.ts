import Block from "./Block";
import Button from "./Buttons";
import { GlobalVariables } from "./GlobalVariables";
import Levels from "./Levels";
import LocalStorage from "./LocalStorage";
import NumberNode from "./NumberNode";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePlay extends cc.Component {
  @property(cc.Node) blockContainer: cc.Node = null;
  @property(cc.Node) touchSpace: cc.Node = null;
  @property(cc.Node) slots: cc.Node = null;
  @property(cc.Prefab) completeEffect: cc.Prefab = null;
  @property(Array(cc.Prefab)) blockTypes: Array<cc.Prefab> =
    new Array<cc.Prefab>();
  @property(NumberNode) numberNode: NumberNode = null;

  @property(cc.AudioClip) soundBlockFall: cc.AudioClip = null;
  @property(cc.AudioClip) soundBlockMove: cc.AudioClip = null;
  @property(cc.AudioClip) soundKeyOnHole: cc.AudioClip = null;
  @property(cc.AudioClip) soundFire: cc.AudioClip = null;
  @property(cc.AudioClip) soundFitSlot: cc.AudioClip = null;

  static instance: GamePlay;

  isOnBlockCollision = false;
  isHolding = false;
  startLocation: cc.Vec3 = null;
  endLocation: cc.Vec3 = null;
  currentHoldingBlock: cc.Node = null;
  currentTouchLoc: cc.Vec2 = null;
  touchLocOnBlockCollision: cc.Vec2 = null;
  touchStartOffset: cc.Vec2 = null;
  typeMove: number = 1;
  grid = [];
  touchDelta: cc.Vec2;
  currentLevel: number;
  highestLevel: number;
  isDown: boolean = false;

  protected onLoad(): void {
    cc.audioEngine.playEffect(this.soundBlockFall, false);
    GamePlay.instance = this;
    this.currentLevel = LocalStorage.getCurrentLevel();
    this.highestLevel = LocalStorage.getHighestLevel();
    this.grid = GlobalVariables.levelGridData;
    this.spawnGrid(this.grid);
    this.regEvents();
    cc.director.getCollisionManager().enabled = true;
    // cc.director.getCollisionManager().enabledDebugDraw = true;
    cc.director.getPhysicsManager().enabled = true;
    this.touchDelta = cc.Vec2.ZERO;
  }

  regEvents() {
    let childrens = this.blockContainer.children;
    childrens.forEach((child) => {
      child.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
      child.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
      child.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
      child.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    });
  }

  moveBlock() {
    let pos = this.node.convertToNodeSpaceAR(
      cc.v3(this.currentTouchLoc.add(this.touchStartOffset))
    );
    let block = this.currentHoldingBlock.getComponent(Block);

    if (this.typeMove == 2) {
      if (block.lockLeft && pos.x < block.node.x) {
        if (this.currentTouchLoc.x > block.lockLeftX) {
          block.node.position = cc.v3(pos.x, block.node.position.y);
        }
      } else if (!block.lockLeft && pos.x < block.node.x)
        block.node.position = cc.v3(pos.x, block.node.position.y);

      if (block.lockRight && pos.x > block.node.x) {
        if (this.currentTouchLoc.x < block.lockRightX) {
          block.node.position = cc.v3(pos.x, block.node.position.y);
        }
      } else if (!block.lockRight && pos.x > block.node.x)
        block.node.position = cc.v3(pos.x, block.node.position.y);
    } else {
      if (block.lockDown && pos.y < block.node.y) {
        if (this.currentTouchLoc.y > block.lockDownY) {
          block.node.position = cc.v3(block.node.position.x, pos.y);
        }
      } else if (!block.lockDown && pos.y < block.node.y)
        block.node.position = cc.v3(block.node.position.x, pos.y);

      if (block.lockUp && pos.y > block.node.y) {
        if (this.currentTouchLoc.y < block.lockUpY) {
          block.node.position = cc.v3(block.node.position.x, pos.y);
        }
      } else if (!block.lockDown && pos.y > block.node.y)
        block.node.position = cc.v3(block.node.position.x, pos.y);
    }
  }

  onTouchStart(event: cc.Event.EventTouch) {
    let strBlock = event.currentTarget.name.slice(0, 5);
    if (strBlock == "block") {
      this.isDown = true;
      this.isHolding = true;
      this.currentHoldingBlock = event.currentTarget;
      this.startLocation = this.currentHoldingBlock.position;
      this.typeMove = this.currentHoldingBlock.getComponent(Block).typeMove;
      this.currentTouchLoc = event.getLocation();
      let objectPosInWorld = this.currentHoldingBlock.convertToWorldSpaceAR(
        cc.Vec2.ZERO_R
      );
      this.touchStartOffset = objectPosInWorld.sub(this.currentTouchLoc);
    }
  }

  onTouchMove(event: cc.Event.EventTouch) {
    if (this.currentHoldingBlock == null) {
      this.isHolding = false;
      return;
    }
    this.currentTouchLoc = event.getLocation();
    if (this.isHolding) {
      this.moveBlock();
    }
  }

  onTouchEnd() {
    if (this.currentHoldingBlock != null) {
      let block = this.currentHoldingBlock.getComponent(Block);
      block.lockDown = false;
      block.lockUp = false;
      block.lockLeft = false;
      block.lockRight = false;

      block.lockDownY = null;
      block.lockUpY = null;
      block.lockLeftX = null;
      block.lockRightX = null;
    }

    this.currentTouchLoc == null;
    this.isHolding = false;
    this.fitSlot();
    this.moveCount();
  }

  moveCount() {
    if (!this.startLocation || !this.endLocation) return;
    if (
      this.startLocation.toString() != this.endLocation.toString() &&
      this.isDown
    ) {
      cc.audioEngine.playEffect(this.soundBlockMove, false);
      this.numberNode.moveCount();
      this.isDown = false;
    }
  }

  spawnGrid(grid: Array<Array<number>>) {
    this.scheduleOnce(() => {
      this.fitSlotAll();
    }, 0.7);

    for (let i = 0; i < grid.length; i++) {
      let rowArray = grid[i];
      for (let j = 0; j < rowArray.length; j++) {
        let blockValue = grid[i][j];
        if (blockValue > 0) {
          let row = i;
          let col = j;
          let cell = 81;
          let newBlock = null;
          switch (blockValue) {
            case 1:
              newBlock = cc.instantiate(this.blockTypes[0]);
              newBlock.parent = this.blockContainer;
              newBlock.position = cc.v3(
                cell + row * cell,
                1400
                // cell / 2 + cell * col
              );
              cc.tween(newBlock)
                .to(0.7, {
                  position: cc.v3(cell + row * cell, cell / 2 + cell * col),
                })
                .start();
              break;
            case 2:
              newBlock = cc.instantiate(this.blockTypes[1]);
              newBlock.parent = this.blockContainer;
              newBlock.position = cc.v3(
                cell / 2 + row * cell,
                1400
                // cell * col - cell / 2 - 3
              );
              cc.tween(newBlock)
                .to(0.7, {
                  position: cc.v3(cell / 2 + row * cell, cell * col - cell / 2),
                })
                .start();
              break;
            case 3:
              newBlock = cc.instantiate(this.blockTypes[2]);
              newBlock.parent = this.blockContainer;
              newBlock.position = cc.v3(
                cell / 2 + row * cell,
                1400
                // cell * col
              );
              cc.tween(newBlock)
                .to(0.7, {
                  position: cc.v3(cell / 2 + row * cell, cell * col),
                })
                .start();
              break;
            case 4:
              newBlock = cc.instantiate(this.blockTypes[3]);
              newBlock.parent = this.blockContainer;
              newBlock.position = cc.v3(
                cell * row + cell / 2,
                1400
                // cell / 2 + col * cell
              );
              cc.tween(newBlock)
                .to(0.7, {
                  position: cc.v3(cell * row + cell / 2, cell / 2 + col * cell),
                })
                .start();
              break;
            case 5:
              newBlock = cc.instantiate(this.blockTypes[4]);
              newBlock.parent = this.blockContainer;
              newBlock.position = cc.v3(
                cell + row * cell,
                1400
                // cell / 2 + cell * col
              );
              cc.tween(newBlock)
                .to(0.7, {
                  position: cc.v3(cell + row * cell, cell / 2 + cell * col),
                })
                .start();
              break;
          }
        }
      }
    }
  }

  onCompleteLevel() {
    cc.audioEngine.playEffect(this.soundKeyOnHole, false);
    this.onTouchEnd();

    let effect = cc.instantiate(this.completeEffect);
    effect.parent = this.node;
    effect.position = this.node.convertToNodeSpaceAR(
      this.node.parent.convertToWorldSpaceAR(cc.Vec3.ZERO)
    );
    cc.tween(this.blockContainer).to(1, { opacity: 0 }).start();
    if (
      LocalStorage.getMinMoveAtLevel(this.currentLevel) <
      this.numberNode.currentNumber
    ) {
      LocalStorage.setMinMoveAtLevel(
        this.currentLevel,
        this.numberNode.currentNumber
      );
    }

    cc.tween(this)
      .delay(1)
      .call(() => {
        this.blockContainer.destroy();
        cc.audioEngine.playEffect(this.soundFire, false);
      })
      .delay(1.5)
      .call(() => {
        LocalStorage.setCurrentLevel((this.currentLevel += 1));
        LocalStorage.setHighestLevel((this.highestLevel += 1));
        this.currentLevel = LocalStorage.getCurrentLevel();
        if (this.currentLevel > 39) {
          cc.director.loadScene("start");
        }
        Levels.instance.LoadScene(null, this.currentLevel.toString());
      })
      .start();
  }

  restartLevel() {
    cc.audioEngine.playEffect(this.soundKeyOnHole, false);
    let effect = cc.instantiate(this.completeEffect);
    effect.parent = this.node;
    effect.position = this.node.convertToNodeSpaceAR(
      this.node.parent.convertToWorldSpaceAR(cc.Vec3.ZERO)
    );
    cc.tween(this.blockContainer).to(1, { opacity: 0 }).start();
    cc.tween(this)
      .delay(1)
      .call(() => {
        this.blockContainer.destroy();
        cc.audioEngine.playEffect(this.soundFire, false);
      })
      .delay(1.5)
      .call(() => {
        cc.director.loadScene("gamePlay");
      })
      .start();
  }

  fitSlot() {
    let slots = this.slots.children;
    let closestSlot = null;
    let closestDis = 0;
    cc.audioEngine.playEffect(this.soundFitSlot, false);

    if (this.currentHoldingBlock == null) return;
    if (
      this.currentHoldingBlock.name == "block_2" ||
      this.currentHoldingBlock.name == "block_7"
    ) {
      for (let i = 0; i < slots.length; i++) {
        let pos = cc.v2(
          this.currentHoldingBlock.position.x,
          this.currentHoldingBlock.position.y
        );
        let distance = cc.Vec2.distance(pos, cc.v2(slots[i].position));

        if (i == 0 || distance < closestDis) {
          closestSlot = slots[i];
          closestDis = distance;
        }
      }

      let pos = cc.v3(closestSlot.position.x, closestSlot.position.y);
      this.endLocation = pos;
      cc.tween(this.currentHoldingBlock)
        .to(0.05, {
          position: pos,
        })
        .start();
    }

    if (
      this.currentHoldingBlock.name == "block_1" ||
      this.currentHoldingBlock.name == "block_5"
    ) {
      for (let i = 0; i < slots.length; i++) {
        let pos = cc.v2(
          this.currentHoldingBlock.position.x - 40,
          this.currentHoldingBlock.position.y
        );
        let distance = cc.Vec2.distance(pos, cc.v2(slots[i].position));

        if (i == 0 || distance < closestDis) {
          closestSlot = slots[i];
          closestDis = distance;
        }
      }

      let pos = cc.v3(closestSlot.position.x + 40, closestSlot.position.y);
      this.endLocation = pos;
      cc.tween(this.currentHoldingBlock)
        .to(0.05, {
          position: pos,
        })
        .start();
    }

    if (this.currentHoldingBlock.name == "block_6") {
      for (let i = 0; i < slots.length; i++) {
        let pos = cc.v2(
          this.currentHoldingBlock.position.x,
          this.currentHoldingBlock.position.y - 40
        );
        let distance = cc.Vec2.distance(pos, cc.v2(slots[i].position));

        if (i == 0 || distance < closestDis) {
          closestSlot = slots[i];
          closestDis = distance;
        }
      }

      let pos = cc.v3(closestSlot.position.x, closestSlot.position.y + 40);
      this.endLocation = pos;
      cc.tween(this.currentHoldingBlock)
        .to(0.05, {
          position: pos,
        })
        .start();
    }
  }

  fitSlotAll() {
    let slots = this.slots.children;
    let blocks = this.blockContainer.children;
    let closestSlot = null;
    let closestDis = 0;

    blocks.forEach((block) => {
      if (block.name == "block_2" || block.name == "block_7") {
        for (let i = 0; i < slots.length; i++) {
          let pos = cc.v2(block.position.x, block.position.y);
          let distance = cc.Vec2.distance(pos, cc.v2(slots[i].position));

          if (i == 0 || distance < closestDis) {
            closestSlot = slots[i];
            closestDis = distance;
          }
        }

        let pos = cc.v3(closestSlot.position.x, closestSlot.position.y);

        cc.tween(block)
          .to(0.05, {
            position: pos,
          })
          .start();
      }

      if (block.name == "block_1" || block.name == "block_5") {
        for (let i = 0; i < slots.length; i++) {
          let pos = cc.v2(block.position.x - 40, block.position.y);
          let distance = cc.Vec2.distance(pos, cc.v2(slots[i].position));

          if (i == 0 || distance < closestDis) {
            closestSlot = slots[i];
            closestDis = distance;
          }
        }

        let pos = cc.v3(closestSlot.position.x + 40, closestSlot.position.y);

        cc.tween(block)
          .to(0.05, {
            position: pos,
          })
          .start();
      }

      if (block.name == "block_6") {
        for (let i = 0; i < slots.length; i++) {
          let pos = cc.v2(block.position.x, block.position.y - 40);
          let distance = cc.Vec2.distance(pos, cc.v2(slots[i].position));

          if (i == 0 || distance < closestDis) {
            closestSlot = slots[i];
            closestDis = distance;
          }
        }

        let pos = cc.v3(closestSlot.position.x, closestSlot.position.y + 40);

        cc.tween(block)
          .to(0.05, {
            position: pos,
          })
          .start();
      }
    });
  }
}
