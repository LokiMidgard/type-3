import { Actor, Color, RotationType, vec, Vector } from 'excalibur';
import { Circle, Sprite } from 'excalibur/build/dist/Graphics';
import { Resources } from '../../resources';
import { LevelOne } from '../../scenes/level-one/level-one';
import { Planet } from '../planet';

type targetable = { pos: Vector, width: number, height: number, rotation: number }
export class Marker extends Actor {

  private readonly level: LevelOne;

  private curser: Circle;

  private _target: targetable | undefined
    ;
  public get target(): targetable | undefined {
    return this._target;
  }
  public set target(v: targetable | undefined) {
    const oldTarget = this._target;
    const newTarget = v;
    this._target = newTarget;
    this.actions.clearActions();
    let action = this.actions;
    if (oldTarget) {

      action = action.scaleTo(0.01, 0.01, 3, 3).callMethod(() => {
        this.graphics.visible = false;

      });
    }
    if (newTarget) {
      action = action.callMethod(() => {
        this.rotation = newTarget.rotation;
        this.pos = newTarget.pos;
        this.curser.radius = Math.max(newTarget.width, newTarget.height) / 2
        this.graphics.visible = true;
      })
        .scaleTo(1, 1, 3, 3);
    }
  }

  constructor(level: LevelOne) {
    super({
      pos: vec(0, 0),
      width: 25,
      height: 25,
      z: 999,
    });
    this.level = level;
    this.scale = vec(0.1, 0.1)
  }

  onInitialize() {
    this.curser = new Circle({
      radius: 50,
      color: Color.Transparent, strokeColor: Color.Green, lineWidth: 4,
      padding: 4
    });

    this.graphics.add(this.curser);
  }
}
