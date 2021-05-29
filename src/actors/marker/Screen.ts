import { Actor, Color, RotationType, vec, Vector } from 'excalibur';
import { Circle, Sprite } from 'excalibur/build/dist/Graphics';
import { Resources } from '../../resources';
import { LevelOne } from '../../scenes/level-one/level-one';
import { Fleet } from '../Fleet';
import { Planet } from '../planet';
import { HexButton } from './HexButton';

export class Screen extends Actor {


  private buildButton: HexButton;

  private _selectedObject: any | undefined;
  public get selectedObject(): any | undefined {
    return this._selectedObject;
  }
  public set selectedObject(v: any | undefined) {
    this._selectedObject = v;
    this.UpdateScreen();
  }


  constructor() {
    super({
      pos: vec(-300, 0),
      width: 50,
      height: 50,
      z: 999,
      opacity: 0.5
    });
  }

  private UpdateScreen() {
    const v = this.selectedObject;
    if (v instanceof Fleet) {
      this.graphics.visible = true;
      this.buildButton.graphics.visible =
        v.targetPlanet == undefined
        // && v.currentPlanet?.controlingPlayer == undefined
        && !v.isBuilding;

    } else if (v instanceof Planet) {
      this.buildButton.graphics.visible = false;

    } else {
      this.graphics.visible = false;
      this.buildButton.graphics.visible = false;
    }
  }

  onInitialize() {

    const sprite = Sprite.from(Resources.Screen);
    this.graphics.add(sprite);

    this.buildButton = new HexButton(Resources.BuildIcon);
    this.buildButton.onClicked(() => {
      if (this.selectedObject instanceof Fleet) {
        this.selectedObject.isBuilding = true;
        this.UpdateScreen();
      }
    });
    this.addChild(this.buildButton);

  }
}
