const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalStorage extends cc.Component {
  public static setCurrentLevel(value: number) {
    cc.sys.localStorage.setItem("FreeTheKey" + " - " + "CurrentLevel", value);
  }

  public static getCurrentLevel(): number {
    if (
      cc.sys.localStorage.getItem("FreeTheKey" + " - " + "CurrentLevel") == null
    ) {
      cc.sys.localStorage.setItem("FreeTheKey" + " - " + "CurrentLevel", 0);
      return 0;
    } else
      return JSON.parse(
        cc.sys.localStorage.getItem("FreeTheKey" + " - " + "CurrentLevel")
      );
  }

  public static setHighestLevel(value: number) {
    cc.sys.localStorage.setItem("FreeTheKey" + " - " + "HighestLevel", value);
  }

  public static getHighestLevel(): number {
    if (
      cc.sys.localStorage.getItem("FreeTheKey" + " - " + "HighestLevel") == null
    ) {
      cc.sys.localStorage.setItem("FreeTheKey" + " - " + "HighestLevel", 1);
      return 1;
    } else
      return JSON.parse(
        cc.sys.localStorage.getItem("FreeTheKey" + " - " + "HighestLevel")
      );
  }

  public static getMinMoveAtLevel(level: number): number {
    if (
      cc.sys.localStorage.getItem(
        "FreeTheKey" + " - " + "Level " + level.toString()
      ) == null
    ) {
      cc.sys.localStorage.setItem(
        "FreeTheKey" + " - " + "Level " + level.toString(),
        0
      );
      return 0;
    } else
      return JSON.parse(
        cc.sys.localStorage.getItem(
          "FreeTheKey" + " - " + "Level " + level.toString()
        )
      );
  }

  public static setMinMoveAtLevel(level: number, moveValue: number) {
    cc.sys.localStorage.setItem(
      "FreeTheKey" + " - " + "Level " + level.toString(),
      moveValue
    );
  }
}
