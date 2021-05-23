import { Engine, Loader, DisplayMode, Random, Color } from 'excalibur';
import { LevelOne } from './scenes/level-one/level-one';
import { Marker } from './actors/player/Marker';
import { Resources } from './resources';
import { delay, randomInRange, randomIntInRange } from 'excalibur/build/dist/Util';
import { Planet } from './actors/planet';
import { Player } from './actors/player/player';

/**
 * Managed game class
 */
class Game extends Engine {
  private player: Marker;
  private levelOne: LevelOne;

  constructor() {
    super({
      displayMode: DisplayMode.Fill,
      enableCanvasTransparency: true,

    });
  }

  public start() {

    const player1 = new Player(Color.Blue)
    const player2 = new Player(Color.Green);

    // Create new scene with a player
    this.levelOne = new LevelOne(this, player1, player2);
    this.player = new Marker(this.levelOne, this.levelOne.planets[0]);
    this.levelOne.add(this.player);

    this.player.on('pointerdragmove', ev => {
      this.player.pos = ev.pos;
    });



    this.add('levelOne', this.levelOne);

    // Automatically load all default resources
    const loader = new Loader(Object.values(Resources));
    this.simulate(this.player, this.levelOne);
    return super.start(loader);
  }


  private async simulate(player: Marker, level: LevelOne) {
    const r = new Random();
    // const i = randomIntInRange(0, this.levelOne.planets.length - 1, r);
    // let p = this.levelOne.planets[i];
    // await player.actions.moveTo(p.pos.x, p.pos.y, 90).asPromise();
    while (true) {

      const neighbors = this.levelOne.getNeigbourPlanets(player.currentPlanet).filter(x => x != player.targetPlanet);
      const i = randomIntInRange(0, neighbors.length - 1, r);

      const p = neighbors[i];
      player.targetPlanet = p;
      await delay(4000);
      if (r.bool()) {
        player.currentPlanet = p;
        await delay(4000);
      }

      const g = this.levelOne.groups[0];
      g.developmentLevel = (g.developmentLevel + 1) % (g.maximumDevelopmentLevel + 1);


    }

  }
}

const game = new Game();
game.start().then(() => {
  game.goToScene('levelOne');
});
