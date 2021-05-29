import { Actor, Color, RotationType, vec, Vector } from 'excalibur';
import { Circle, ImageSource, Sprite } from 'excalibur/build/dist/Graphics';
import { PointerButton } from 'excalibur/build/dist/Input';
import { Resources } from '../../resources';
import { LevelOne } from '../../scenes/level-one/level-one';
import { Fleet } from '../Fleet';
import { Planet } from '../planet';

export class HexButton extends Actor {


  private readonly icon: ImageSource;

  private callbacs: Array<() => void> = []


  constructor(icon: ImageSource) {
    super({ width: 135, height: 135 });
    this.icon = icon;
  }

  public onClicked(callback: () => void) {
    this.callbacs.push(callback);
  }

  onInitialize() {


    const hover = Sprite.from(Resources.ButtonHexHover);
    const idle = Sprite.from(Resources.ButtonHexIdle);
    const pressed = Sprite.from(Resources.ButtonHexPressed);
    this.graphics.add('hover', hover);
    this.graphics.add('idle', idle);
    this.graphics.add('pressed', pressed);
    // this.graphics.hide();
    this.graphics.show('idle')


    this.on('pointerenter', (e) => {
      // this.graphics.hide();
      if (e.pointer.isDragging || e.button != PointerButton.NoButton) {
        this.graphics.show('pressed');
      } else {
        this.graphics.show('hover');
      }
    });
    this.on('pointerdown', () => {
      // this.graphics.hide();
      this.graphics.show('pressed');
    })
    this.on('pointerleave', () => {

      // this.graphics.hide();
      this.graphics.show('idle')
    });
    this.on('pointerup', () => {
      this.graphics.show('idle');
      this.callbacs.forEach(x => x());
    })

    const iconLayer = this.graphics.layers.create({ name: 'icon', order: 1 });
    const icon = Sprite.from(this.icon);
    this.graphics.add('icon', icon);
    iconLayer.show('icon');
    // this.graphics.add(icon);
    // this.graphics.show('icon');


  }
}
