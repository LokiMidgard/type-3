import { Actor, Color, RotationType, vec, Vector } from 'excalibur';
import { Circle, Sprite } from 'excalibur/build/dist/Graphics';
import { Resources } from '../../resources';
import { LevelOne } from '../../scenes/level-one/level-one';
import { Planet } from '../planet';

export class Screen extends Actor {

  private readonly level: LevelOne;


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

  onInitialize() {

    const sprite = Sprite.from(Resources.Screen);
    this.graphics.add(sprite);

  }
}
