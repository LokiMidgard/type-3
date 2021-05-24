import { Actor, Color, vec } from 'excalibur';
import { Sprite } from 'excalibur/build/dist/Graphics';
import { Resources } from '../resources';

export class Player {
    public readonly color: Color;
    public readonly id: number;
    public isControling: boolean;
    constructor(id: number, color: Color, isControling: boolean = false) {
        this.color = color;
        this.id = id;
        this.isControling = isControling;
    }


}
