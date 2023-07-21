import { GlobalVariables } from "./GlobalVariables";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Levels extends cc.Component {
  static instance: Levels = null;

  @property(cc.Node) main: cc.Node = null;
  @property(cc.Button) right: cc.Button = null;
  @property(cc.Button) left: cc.Button = null;
  @property(cc.Button) dotNext: cc.Button = null;
  @property(cc.Button) dotPrev: cc.Button = null;

  currentLevel: number = 0;

  LoadCurrentScene() {
    cc.director.loadScene("gamePlay");
  }

  LoadScene0() {
    cc.director.loadScene("levels");
  }

  LoadScene(event: Event, customEventData: string) {
    this.currentLevel = parseInt(customEventData);
    GlobalVariables.levelGridData = this.levels[this.currentLevel];
    cc.director.loadScene("gamePlay");
  }

  onLoad() {
    Levels.instance = this;
  }

  nextBoard() {
    this.right.node.active = false;
    this.dotNext.node.active = false;
    cc.tween(this.main)
      .by(0.5, { position: cc.v3(-644, 0) })
      .call(() => {
        this.left.node.active = true;
        this.dotPrev.node.active = true;
      })
      .start();
  }

  prevBoard() {
    this.left.node.active = false;
    this.dotPrev.node.active = false;
    cc.tween(this.main)
      .by(0.5, { position: cc.v3(644, 0) })
      .call(() => {
        this.right.node.active = true;
        this.dotNext.node.active = true;
      })
      .start();
  }

  levels = [
    [
      [0, 3, 0, 0, 2, 1],
      [0, 0, 0, 5, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [4, 0, 0, 0, 2, 0],
      [0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 2],
    ], // 0
    [
      [1, 0, 0, 5, 0, 3],
      [0, 0, 4, 0, 0, 0],
      [0, 3, 0, 0, 0, 0],
      [1, 0, 0, 0, 3, 0],
      [0, 1, 0, 3, 0, 4],
      [0, 0, 0, 0, 2, 0],
    ], // 1
    [
      [0, 0, 0, 0, 0, 0],
      [0, 3, 1, 5, 0, 0],
      [1, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0],
    ], // 2
    [
      [0, 0, 0, 0, 0, 2],
      [0, 0, 0, 5, 0, 0],
      [0, 0, 3, 0, 0, 0],
      [4, 0, 0, 0, 0, 2],
      [0, 0, 4, 0, 0, 0],
      [0, 3, 0, 0, 0, 0],
    ], // 3
    [
      [0, 3, 0, 0, 2, 1],
      [0, 0, 0, 5, 0, 0],
      [0, 0, 4, 0, 0, 0],
      [0, 0, 0, 0, 0, 2],
      [1, 1, 0, 0, 2, 0],
      [0, 0, 0, 3, 0, 3],
    ], // 4
    [
      [0, 3, 1, 0, 1, 1],
      [0, 0, 0, 5, 0, 0],
      [0, 0, 3, 0, 0, 0],
      [0, 0, 0, 2, 0, 3],
      [4, 0, 0, 0, 2, 0],
      [0, 0, 0, 0, 2, 0],
    ], // 5
    [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 5, 0, 3],
      [0, 0, 1, 0, 0, 1],
      [0, 3, 0, 0, 3, 0],
      [0, 0, 0, 0, 0, 3],
      [0, 0, 0, 3, 0, 3],
    ], // 6
    [
      [1, 1, 1, 5, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 3, 0, 3, 1, 0],
      [4, 4, 0, 3, 0, 1],
      [0, 0, 1, 0, 3, 0],
      [0, 0, 0, 0, 0, 2],
    ], // 7
    [
      [0, 0, 2, 5, 0, 0],
      [0, 0, 0, 0, 0, 3],
      [0, 3, 4, 0, 0, 1],
      [0, 0, 0, 0, 3, 0],
      [0, 0, 0, 2, 1, 1],
      [0, 3, 0, 3, 0, 0],
    ], // 8
  ];
}
