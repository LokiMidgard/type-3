import { Engine, Loader, DisplayMode, Random, Color } from 'excalibur';
import { LevelDescription, LevelOne } from './scenes/level-one/level-one';
import { Fleet } from './actors/Fleet';
import { Resources } from './resources';
import { delay, randomInRange, randomIntInRange } from 'excalibur/build/dist/Util';
import { Planet } from './actors/planet';
import { Player } from './model/player';

/**
 * Managed game class
 */
class Game extends Engine {
  private player: Fleet;
  private levelOne: LevelOne;

  constructor() {
    super({
      displayMode: DisplayMode.Fill,
      enableCanvasTransparency: true,
      backgroundColor: Color.Black,
    });
  }

  public start() {

    const player1 = new Player(0, Color.Blue, true)
    const player2 = new Player(1, Color.Green);



    const levelDescription: LevelDescription = {
      planets: [
        {
          id: '1',
          isPointing: true,
          maximumDevelopment: 4,
          position: { x: 0, y: 150 },
        },
        {
          id: '2',
          isPointing: true,
          maximumDevelopment: 4,
          position: { x: 150, y: 0 },
          startingPlanet: {
            player: 0,
            startDevelopment: 3
          }
        },
        {
          id: '3',
          isPointing: true,
          maximumDevelopment: 4,
          position: { x: -150, y: 0 },
          startingPlanet: {
            player: 1,
            startDevelopment: 3
          }
        },
        {
          id: '4',
          isPointing: true,
          maximumDevelopment: 4,
          position: { x: 70, y: -110 },
          groupId: 'g1',
          startingPlanet: {
            player: 0,
            startDevelopment: 1
          }
        },
        {
          id: '5',
          isPointing: true,
          maximumDevelopment: 4,
          position: { x: -70, y: -110 },
          groupId: 'g1'
        },
        {
          id: '6',
          isPointing: true,
          maximumDevelopment: 4,
          position: { x: 0, y: -240 },
          groupId: 'g1'
        },
      ],
      lanes: [
        ['1', '2'],
        ['1', '3'],
        ['5', '3'],
        ['4', '2'],

        ['4', '5'],
        ['6', '5'],
        ['4', '6'],
      ],
      groups: [{ id: 'g1', maximumDevelopment: 3 }],
      fleets: [{
        player: 0,
        startPlanet: '2'
      }, {
        player: 0,
        startPlanet: '1'
      },
      {
        player: 1,
        startPlanet: '3'
      },
      {
        player: 1,
        startPlanet: '4'
      }],
    };

    // Create new scene with a player
    this.levelOne = new LevelOne(this, levelDescription, player1, player2);



    this.add('levelOne', this.levelOne);

    // Automatically load all default resources
    const loader = new Loader(Object.values(Resources));
    // this.simulate(this.player, this.levelOne);
    return super.start(loader);
  }


  // private async simulate(player: Fleet, level: LevelOne) {
  //   const r = new Random();
  //   // const i = randomIntInRange(0, this.levelOne.planets.length - 1, r);
  //   // let p = this.levelOne.planets[i];
  //   // await player.actions.moveTo(p.pos.x, p.pos.y, 90).asPromise();
  //   while (true) {

  //     const neighbors = this.levelOne.getNeigbourPlanets(player.currentPlanet).filter(x => x != player.targetPlanet);
  //     const i = randomIntInRange(0, neighbors.length - 1, r);

  //     const p = neighbors[i];
  //     player.targetPlanet = p;
  //     await delay(4000);
  //     if (r.bool()) {
  //       player.currentPlanet = p;
  //       await delay(4000);
  //     }

  //     const g = this.levelOne.groups[0];
  //     g.developmentLevel = (g.developmentLevel + 1) % (g.maximumDevelopmentLevel + 1);


  //   }

  // }
}

const game = new Game();
game.start().then(() => {
  game.goToScene('levelOne');
});
