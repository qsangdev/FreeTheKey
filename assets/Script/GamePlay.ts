import Block from "./Block";
import { GlobalVariables } from "./GlobalVariables";
import NumberNode from "./NumberNode";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePlay extends cc.Component {
  @property(cc.Node) slots: cc.Node = null;
  @property(Array(cc.Prefab)) blockTypes: Array<cc.Prefab> =
    new Array<cc.Prefab>();
  @property(NumberNode) numberNode: NumberNode = null;

  static instance: GamePlay;

  isHolding = false;
  currentHoldingBlock: cc.Node = null;
  currentTouchLoc: cc.Vec2 = null;
  touchStartOffset: cc.Vec2 = null;
  typeMove: number = 1;
  grid = [];
  touchDelta: cc.Vec2;

  protected onLoad(): void {
    GamePlay.instance = this;
    this.grid = GlobalVariables.levelGridData;
    this.spawnGrid(this.grid);
    this.regEvents();
    cc.director.getCollisionManager().enabled = true;
    cc.director.getPhysicsManager().enabled = true;
    this.touchDelta = cc.Vec2.ZERO;

    // let blocks = this.node.getChildByName("Blocks").children;
    // for (let i = 0; i < blocks.length; i++) {
    //   this.fitSlot(blocks[i]);
    // }
  }

  protected update(dt: number): void {}

  regEvents() {
    let childrens = this.node.children;
    childrens.forEach((e) => {
      e.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove.bind(this), this),
        e.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown.bind(this), this),
        e.on(cc.Node.EventType.MOUSE_UP, this.onMouseUp.bind(this), this);
      e.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave.bind(this), this);
    });
  }

  moveBlock() {
    if (this.isHolding) {
      this.currentHoldingBlock.position = this.node.convertToNodeSpaceAR(
        cc.v3(this.currentTouchLoc.add(this.touchStartOffset))
      );
    }
  }

  onMouseDown(event: cc.Event.EventMouse) {
    let strBlock = event.currentTarget.name.slice(0, 5);
    if (strBlock == "block") {
      this.isHolding = true;
      this.currentHoldingBlock = event.currentTarget;
      this.typeMove = this.currentHoldingBlock.getComponent(Block).typeMove;
      this.currentTouchLoc = event.getLocation();
      let objectPosInWorld = this.currentHoldingBlock.convertToWorldSpaceAR(
        cc.Vec2.ZERO_R
      );
      this.touchStartOffset = objectPosInWorld.sub(this.currentTouchLoc);
    }
  }

  onMouseMove(event: cc.Event.EventMouse) {
    let touchLocation = event.getLocation();
    if (this.currentHoldingBlock == null) return;
    let blockComponent = this.currentHoldingBlock.getComponent(Block);
    if (this.isHolding) {
      let touchDelta = touchLocation.sub(this.currentTouchLoc);
      this.touchDelta = touchDelta;
      if (blockComponent.typeMove == 1) {
        this.currentTouchLoc.y = touchLocation.y;
        if (touchDelta.y > 0 && !blockComponent.lockUp) {
          this.moveBlock();
        }
        if (touchDelta.y < 0 && !blockComponent.lockDown) {
          this.moveBlock();
        }
      } else if (blockComponent.typeMove == 2) {
        this.currentTouchLoc.x = touchLocation.x;
        if (touchDelta.x > 0 && !blockComponent.lockRight) {
          this.moveBlock();
        }
        if (touchDelta.x < 0 && !blockComponent.lockLeft) {
          this.moveBlock();
        }
      }
    }
  }

  onMouseUp() {
    this.isHolding = false;
    this.fitSlot();
    this.numberNode.moveCount();
  }

  onMouseLeave() {
    this.isHolding = false;
    this.fitSlot();
  }

  spawnGrid(grid: Array<Array<number>>) {
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
              newBlock.parent = this.node;
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
              newBlock.parent = this.node;
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
              newBlock.parent = this.node;
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
              newBlock.parent = this.node;
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
              newBlock.parent = this.node;
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

  fitSlot() {
    let slots = this.slots.children;
    let closestSlot = null;
    let closestDis = 0;

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

      cc.tween(this.currentHoldingBlock)
        .to(0.05, {
          position: pos,
        })
        .start();
    }
  }
}
