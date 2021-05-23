import { Actor, BoundingBox, Color, Engine, Scene, vec } from 'excalibur';
import { Circle, Polygon } from 'excalibur/build/dist/Graphics';
import { Group } from '../../actors/group';
import { Planet } from '../../actors/planet';
import { welzl } from '../../utils/welz';

/**
 * Managed scene
 */
export class LevelOne extends Scene {

  public readonly lanes: [Planet, Planet][];
  public readonly planets: Planet[];
  public readonly groups: Group[];

  /**
   *
   */
  constructor(engine: Engine) {
    super(engine);
    const c = vec(0, 150);
    console.log(`${c}`)
    this.planets = [
      new Planet({
        pos: c,
        pointing: true
      }),
      new Planet({
        pos: vec(150, 0),
        starting: true
      }),
      new Planet({
        pos: vec(-150, 0),
        starting: true
      }),
      new Planet({
        pos: vec(70, -110),
      }),
      new Planet({
        pos: vec(-70, -110),
      }),
      new Planet({
        pos: vec(0, -240),
      }),
    ];
    for (const p of this.planets) {
      console.log(`x: ${p.pos.x}\ty: ${p.pos.y}`)
    }
    console.log("Created")
    this.lanes =
      [
        [this.planets[0], this.planets[1]],
        [this.planets[0], this.planets[2]],
        [this.planets[4], this.planets[2]],
        [this.planets[3], this.planets[1]],
        [this.planets[3], this.planets[4]],
        [this.planets[5], this.planets[4]],
        [this.planets[5], this.planets[3]],
      ];

    this.groups = [new Group({}, this.planets[5], this.planets[3], this.planets[4])];
  }

  public onInitialize(engine: Engine) {

    this.camera.pos = vec(0, 0);

    for (const p of this.planets) {
      console.log(`x: ${p.pos.x}\ty: ${p.pos.y}`)
    }

    let counter = 0;
    for (const [p1, p2] of this.lanes) {
      counter++;
      const actor = new Actor();
      this.add(actor);
      const linePos = p1.pos.sub(p2.pos);
      // if (counter>5) {
      //   continue;
      // }
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

      // const actor = new Actor();
      // this.add(actor);
      // const positions = group.map(x => x.pos);

      // const enclosingCircle = welzl(positions);
      // if (!enclosingCircle) {
      //   continue;
      // }
      // const color = Color.fromRGB(Color.LightGray.r, Color.LightGray.g, Color.LightGray.b, 0.5);
      // const circle = new Circle({
      //   color: color,

      //   radius: enclosingCircle.Radius + 60,
      // });
      // actor.pos = enclosingCircle.Position;
      // actor.graphics.add(circle);
    }



    for (const planet of this.planets) {
      this.add(planet);
    }

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
