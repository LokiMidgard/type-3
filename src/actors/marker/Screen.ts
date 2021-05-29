import { Actor, Color, RotationType, vec, Vector } from 'excalibur';
import { Circle, Font, Sprite, Text } from 'excalibur/build/dist/Graphics';
import { Resources } from '../../resources';
import { LevelOne } from '../../scenes/level-one/level-one';
import { Fleet } from '../Fleet';
import { Planet } from '../planet';
import { HexButton } from './HexButton';

export class Screen extends Actor {


  private buildButton: HexButton;

  private planetName: Text;
  private readonly level: LevelOne;

  private _selectedObject: any | undefined;
  public get selectedObject(): any | undefined {
    return this._selectedObject;
  }
  public set selectedObject(v: any | undefined) {
    this._selectedObject = v;
    this.UpdateScreen();
  }


  constructor(level: LevelOne) {
    super({
      pos: vec(-300, 0),
      width: 50,
      height: 50,
      z: 999,
      opacity: 0.5
    });
    this.level = level;
  }

  private UpdateScreen() {
    const v = this.selectedObject;
    if (v instanceof Fleet) {
      this.graphics.visible = true;
      this.buildButton.graphics.visible =
        v.targetPlanet == undefined
        && v.currentPlanet?.controlingPlayer == undefined
        && !v.isBuilding;
      this.graphics.hide('name')


    } else if (v instanceof Planet) {
      this.graphics.visible = true;
      this.planetName.text = v.name;
      this.graphics.show('name', { offset: vec(0, -130) })

      const possibleFleets = this.level.fleets.filter(x =>
        x.owner.isControling
        && x.currentPlanet == v
        && !x.targetPlanet
      );

      this.buildButton.graphics.visible =
        !v.controlingPlayer
        && possibleFleets.length > 0
        && possibleFleets.filter(x => x.isBuilding).length == 0;



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
        this.level.marker.target = undefined;
        this.UpdateScreen();
      }
      else if (this.selectedObject instanceof Planet) {

        const constructingFleet = this.level.fleets.filter(x =>
          x.owner.isControling
          && x.currentPlanet == this.selectedObject
          && !x.targetPlanet
        )[0];
  

        constructingFleet.isBuilding = true;
        this.level.marker.target = undefined;
        this.UpdateScreen();
      }
    });
    this.addChild(this.buildButton);
    this.planetName = new Text({ text: 'NAME', font: new Font({ size: 30, color: Color.White }) })
    this.graphics.add('name', this.planetName)

    this.UpdateScreen();


  }
}
