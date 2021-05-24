import { Actor, Color, RotationType, vec } from 'excalibur';
import { Sprite } from 'excalibur/build/dist/Graphics';
import { Player } from '../model/player';
import { Resources } from '../resources';
import { LevelOne } from '../scenes/level-one/level-one';
import { Planet } from './planet';

export class Fleet extends Actor {

  private readonly level: LevelOne;
  public readonly owner:Player;

  private _currentPlanet?: Planet;
  public get currentPlanet(): Planet | undefined {
    return this._currentPlanet;
  }
  public set currentPlanet(v: Planet | undefined) {
    const oldPlanet = this.currentPlanet;
    this._currentPlanet = v;
    this._targetPlanet = undefined;

    if (this._currentPlanet && oldPlanet) {
      const headingVector1 = this.pos.sub(this._currentPlanet.pos).normalize();

      const headingAngle1 = Math.atan2(headingVector1.y, headingVector1.x) - Math.PI / 2;

      const rotationSpeed = 10;
      this.actions
        .rotateTo(headingAngle1, rotationSpeed, RotationType.ShortestPath)
        .moveTo(this._currentPlanet.pos.x, this._currentPlanet.pos.y, 120)
        .rotateTo(0, rotationSpeed, RotationType.ShortestPath)
    } else if (this._currentPlanet) {
      this.pos = this._currentPlanet.pos;
      this.rotation = 0;
      this.actions
        .callMethod(() => {
          this.graphics.visible = true
        })
        .fade(1, 10);

    } else {
      this.actions.fade(0, 10).callMethod(() => { this.graphics.visible = false });
    }

  }


  private _targetPlanet: Planet | undefined;
  public get targetPlanet(): Planet | undefined {
    return this._targetPlanet;
  }
  public set targetPlanet(v: Planet | undefined) {
    const rotationSpeed = 10;
    if (this._currentPlanet) {

      if (v != undefined && !this.level.getNeigbourPlanets(this._currentPlanet).includes(v)) {
        return;
      }
      const oldTarget = this._targetPlanet;
      this._targetPlanet = v;
      if (this._targetPlanet) {

        const targetPosition = this._targetPlanet.pos.sub(this._currentPlanet.pos).scale(0.5).add(this._currentPlanet.pos);
        if (!targetPosition) {
          return;
        }

        let action = this.actions;
        let pos = this.pos;
        if (oldTarget) {
          const headingVector = pos.sub(this._currentPlanet.pos).normalize();
          const headingAngle = Math.atan2(headingVector.y, headingVector.x) - Math.PI / 2;

          action = action
            .rotateTo(headingAngle, rotationSpeed, RotationType.ShortestPath)
            .moveTo(this._currentPlanet.pos.x, this._currentPlanet.pos.y, 120)
          pos = this._currentPlanet.pos;
        }

        const headingVector1 = pos.sub(targetPosition).normalize();
        const headingVector2 = targetPosition.sub(this._targetPlanet.pos).normalize();

        const headingAngle1 = Math.atan2(headingVector1.y, headingVector1.x) - Math.PI / 2;
        const headingAngle2 = Math.atan2(headingVector2.y, headingVector2.x) - Math.PI / 2;

        action
          .rotateTo(headingAngle1, rotationSpeed, RotationType.ShortestPath)
          .moveTo(targetPosition.x, targetPosition.y, 120)
          .rotateTo(headingAngle2, rotationSpeed, RotationType.ShortestPath)
      } else {
        const headingVector = this.pos.sub(this._currentPlanet.pos).normalize();
        const headingAngle = Math.atan2(headingVector.y, headingVector.x) - Math.PI / 2;

        this.actions
          .rotateTo(headingAngle, rotationSpeed, RotationType.ShortestPath)
          .moveTo(this._currentPlanet.pos.x, this._currentPlanet.pos.y, 120)
          .rotateTo(0, rotationSpeed, RotationType.ShortestPath)

      }
    } else if (this._targetPlanet) {
      this.pos = this._targetPlanet.pos;
      this.rotation = 0;
      this.actions
        .callMethod(() => {
          this.graphics.visible = true
        })
        .fade(0.1, 10);

    }

  }



  constructor(level: LevelOne, owner: Player, startPlanet?: Planet) {
    super({
      pos: vec(0, 0),
      width: 25,
      height: 25,
      color: new Color(255, 255, 255)
    });
    this.owner = owner;
    this.level = level;
    this._currentPlanet = startPlanet;
    if (startPlanet) {
      this.pos = startPlanet?.pos;
    } else {
      this.opacity = 0;
      this.graphics.visible = false;
    }

  }

  onInitialize() {
    this.graphics.add(Sprite.from(Resources.Sword));

  }
}
