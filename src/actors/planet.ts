import { Actor, Color, vec, Vector } from 'excalibur';
import { Circle, Rectangle, Sprite } from 'excalibur/build/dist/Graphics';
import { randomIntInRange } from 'excalibur/build/dist/Util';
import { point } from 'excalibur/build/dist/Util/DrawUtil';
import { Resources } from '../resources';

export class Planet extends Actor {

    static textures = [
        Resources.Planet1,
        Resources.Planet2,
        Resources.Planet3,
    ];


    public readonly pointing: boolean;
    public readonly starting: boolean;

    constructor(para: { pos: Vector, pointing?: boolean, starting?: boolean }) {
        const radius = 300;
        super({
            pos: para.pos,
            width: radius,
            scale: vec(0.3, 0.3),
            height: radius,
        });
        this.pointing = para.pointing = false;
        this.starting = para.starting = false;
    }

    onInitialize() {
        // this.addDrawing(Resources.Planet1);


        const sphere = new Circle({
            radius: 140,
            color: Color.fromRGB(Color.LightGray.r, Color.LightGray.g, Color.LightGray.b, 0.5)
        });
        this.graphics.add(sphere);

        const controlCircle = new Circle({ radius: 80 });
        this.graphics.add(controlCircle);

        const index = randomIntInRange(0, Planet.textures.length - 1);
        this.graphics.add(Sprite.from(Planet.textures[index]));


        for (let index = 0; index < 5; index++) {
            const pointingMarker = new Circle({
                radius: 15,
                color: Color.Transparent,
                strokeColor: Color.Viridian,
                lineWidth: 10,
                padding: 5,
                smoothing: true,
            })
            // pointingMarker.showDebug = true;
            pointingMarker.width = 240;
            // pointingMarker.height = 80;
            pointingMarker.rotation = Math.PI / 5 * index + Math.PI / 2;
            this.graphics.add(pointingMarker);
        }


    }
}
