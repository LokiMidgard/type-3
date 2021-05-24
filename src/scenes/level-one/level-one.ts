import { Actor, BoundingBox, Color, Engine, Random, Scene, vec } from 'excalibur';
import { Circle, Polygon } from 'excalibur/build/dist/Graphics';
import { Group } from '../../actors/group';
import { Planet } from '../../actors/planet';
import { Fleet } from '../../actors/Fleet';
import { Marker } from '../../actors/marker/Marker';
import { Player } from '../../model/player';
import { welzl } from '../../utils/welz';
import { Background } from '../../actors/background/Stars';
import { Screen } from '../../actors/marker/screen';


export interface LevelDescription {
  planets: {
    id: string
    isPointing: boolean,
    startingPlanet?: {
      player: number,
      startDevelopment: number
    },
    maximumDevelopment: number
    groupId?: string
    position: {
      x: number,
      y: number
    }
  }[],
  groups: {
    id: string,
    maximumDevelopment: number
  }[],
  lanes: [string, string][],
  fleets: {
    player: number,
    startPlanet: string | undefined
  }[]
}

/**
 * Managed scene
 */
export class LevelOne extends Scene {

  public readonly lanes: [Planet, Planet][];
  public readonly planets: Planet[];
  public readonly groups: Group[];
  public readonly player: Player;
  public readonly oponents: Player[];
  public readonly allPlayers: Player[];
  public readonly fleets: Fleet[];


  /**
   *
   */
  constructor(engine: Engine, levelDescription: LevelDescription, ...players: Player[]) {
    super(engine);
    this.allPlayers = players;
    this.player = players.filter(x => x.isControling)[0];
    this.oponents = players.filter(x => !x.isControling);

    this.planets = levelDescription.planets.map(x =>
      new Planet({
        pos: vec(x.position.x, x.position.y),
        pointing: x.isPointing,
        maximumDevelopmentLevel: x.maximumDevelopment,
        id: x.id,
        owner: x.startingPlanet ? this.allPlayers.filter(y => y.id == x.startingPlanet?.player)[0] : undefined,
      })
    );
    this.lanes = levelDescription.lanes.map(x => [this.planets.filter(y => x[0] == y.name)[0], this.planets.filter(y => x[1] == y.name)[0]])
    this.groups = levelDescription.groups.map(x => new Group({}, ...this.planets.filter(y => levelDescription.planets.filter(z => z.id == y.name)[0].groupId == x.id)));
    this.fleets = levelDescription.fleets.map(x => new Fleet(this, this.allPlayers.filter(y => y.id == x.player)[0], x.startPlanet ? this.planets.filter(y => y.name == x.startPlanet)[0] : undefined));
  }


  private _selectedObject: Planet | Fleet | undefined;
  public get selectedObject(): Planet | Fleet | undefined {
    return this._selectedObject;
  }
  public set selectedObject(v: Planet | Fleet | undefined) {
    this._selectedObject = v;
    this.marker.target = v;
  }

  private marker: Marker;


  public onInitialize(engine: Engine) {

    const background = new Background();
    this.add(background)

    const screen = new Screen(this);
    this.add(screen);

    this.camera.pos = vec(0, 0);

    this.marker = new Marker(this);

    let clickWasDownOn: Actor | undefined;

    // const fleets = [new Fleet(this,this.allPlayers.filter(x=>) , this.planets.filter(x => x.controlingPlayer == this.player)[0])]


    let counter = 0;
    for (const [p1, p2] of this.lanes) {
      counter++;
      const actor = new Actor();
      this.add(actor);
      const linePos = p1.pos.sub(p2.pos);
      const line = new Polygon({
        points: [vec(0, 0), linePos],
        lineWidth: 1,
        strokeColor: Color.Green,
        padding: 1
      })
      actor.graphics.anchor = vec(p1.pos.x < p2.pos.x ? 0 : 1, p1.pos.y < p2.pos.y ? 0 : 1);
      actor.pos = p1.pos;
      actor.graphics.add(line);
    }

    for (const group of this.groups) {
      this.add(group);
    }



    for (const planet of this.planets) {
      this.add(planet);
    }

    for (const p of this.fleets) {
      // p.pos = p.currentPlanet.pos;
      this.add(p);
      p.on('pointerdown', () => {
        clickWasDownOn = p;
      });
      p.on('pointerup', (c) => {

        if (p != clickWasDownOn) {
          clickWasDownOn = undefined;
          return;
        }
        clickWasDownOn = undefined;

        c.bubbles = false
        if (this.selectedObject instanceof Fleet && this.selectedObject.targetPlanet == undefined) {
          p.targetPlanet = this.selectedObject.currentPlanet;
          this.selectedObject = undefined;
        } else if (this.selectedObject == p) {
          this.selectedObject = undefined;
        } else {
          this.selectedObject = p
        }
      });
    }

    for (const p of this.planets) {
      p.on('pointerdown', () => {
        clickWasDownOn = p;
      });
      p.on('pointerup', (c) => {


        // HACK so we don't hadle planet event if we actually clicked on a fleet
        if (this.fleets.find(x => x.contains(c.pos.x, c.pos.y))) {
          return;
        }
        if (p != clickWasDownOn) {
          clickWasDownOn = undefined;
          return;
        }
        clickWasDownOn = undefined;

        c.bubbles = false
        if (this.selectedObject instanceof Fleet
          && this.selectedObject.owner.isControling
          && this.selectedObject.currentPlanet
          && (this.getNeigbourPlanets(this.selectedObject.currentPlanet).find(x => x == p)
            || this.selectedObject.currentPlanet == p)) {
          if (this.selectedObject.currentPlanet == p) {
            this.selectedObject.targetPlanet = undefined;
          } else {
            this.selectedObject.targetPlanet = p;
          }
          this.selectedObject = p;
        } else if (this.selectedObject == p) {
          this.selectedObject = undefined;
        } else {
          this.selectedObject = p
        }
      });
    }
    this.add(this.marker);
  }


  public onActivate() { }
  public onDeactivate() { }

  public getNeigbourPlanets(planet: Planet): Planet[] {
    return this.lanes.filter(x => x[0] == planet).map(x => x[1]).concat(
      this.lanes.filter(x => x[1] == planet).map(x => x[0])
    );
  }

  // public draw(ctx: CanvasRenderingContext2D, delta: number) {
  //   // custom drawing

  //   // for (const [p1,p2] of this.lanes) {


  //   //     // circle()
  //   //     line(ctx, Color.LightGray, p1.pos.x,p1.pos.y,p2.pos.x,p2.pos.y,2);


  //   // }

  //   super.draw(ctx, delta);

  //   // Invoke the core logic
  //   // Or leave it out to completely override

  // }


}
