import { Actor, Color, vec } from 'excalibur';
import { Sprite } from 'excalibur/build/dist/Graphics';
import { Resources } from '../../resources';

export class Marker extends Actor {
  constructor() {
    super({
      pos: vec(0, 0),
      width: 25,
      height: 25,
      color: new Color(255, 255, 255)
    });
  }

  onInitialize() {
        this.graphics.add(Sprite.from(Resources.Sword));
        
  }
}
