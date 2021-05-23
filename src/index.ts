import { Engine, Loader, DisplayMode, Random } from 'excalibur';
import { LevelOne } from './scenes/level-one/level-one';
import { Player } from './actors/player/player';
import { Resources } from './resources';
import { randomInRange, randomIntInRange } from 'excalibur/build/dist/Util';
import { Planet } from './actors/planet';

/**
 * Managed game class
 */
class Game extends Engine {
  private player: Player;
  private levelOne: LevelOne;

  constructor() {
    super({
      displayMode: DisplayMode.Fill,
      enableCanvasTransparency: true,

    });
  }

  public start() {

    // Create new scene with a player
    this.levelOne = new LevelOne(this);
    this.player = new Player();
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


  private async simulate(player: Player, level: LevelOne) {
    const r = new Random();
    const i = randomIntInRange(0, this.levelOne.planets.length - 1, r);
    let p = this.levelOne.planets[i];
    await player.actions.moveTo(p.pos.x, p.pos.y, 90).asPromise();
    let prevousPlanet: Planet = p;
    while (true) {

      const neighbors = this.levelOne.getNeigbourPlanets(p).filter(x => x != prevousPlanet);
      const i = randomIntInRange(0, neighbors.length - 1, r);
      prevousPlanet = p;
      p = neighbors[i];
      await player.actions.moveTo(p.pos.x, p.pos.y, 90).asPromise();

      const g = this.levelOne.groups[0];
      g.developmentLevel = randomIntInRange(0, g.maximumDevelopmentLevel, r);


    }

  }
}

const game = new Game();
game.start().then(() => {
  game.goToScene('levelOne');
});
