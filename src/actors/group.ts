import { Actor, Color, vec, Vector } from 'excalibur';
import { Circle, Sprite } from 'excalibur/build/dist/Graphics';
import { randomIntInRange } from 'excalibur/build/dist/Util';
import { point } from 'excalibur/build/dist/Util/DrawUtil';
import { Resources } from '../resources';
import { welzl } from '../utils/welz';
import { Planet } from './planet';

interface GroupOptions {
    /**
     * The development level increases every round by one up to the maximum (default 3).
     * The higher the development level the more resources a group generates.
     * You need to control all planets of the group.
     */
    maximumDevelopmentLevel?: number
}

export class Group extends Actor {

    private static readonly markerColor = Color.Red;

    public readonly maximumDevelopmentLevel: number;

    private _developmentLevel: number;
    public get developmentLevel(): number {
        return this._developmentLevel;
    }
    public set developmentLevel(v: number) {
        this._developmentLevel = Math.max(0, Math.min(v, this.maximumDevelopmentLevel));

        if (!this.developmentMarker) {
            return;
        }

        for (let index = 0; index < this.developmentMarker.length; index++) {
            const marker = this.developmentMarker[index];
            if (index < this._developmentLevel) {
                marker.color = Group.markerColor;
            } else {
                marker.color = Color.Transparent;
            }
        }
    }

    private developmentMarker: Circle[];

    constructor(options: GroupOptions, ...planets: Planet[]) {
        const positions = planets.map(x => x.pos);
        const enclosingCircle = welzl(positions);
        if (!enclosingCircle) {
            super();
            return;
        }

        const d = (enclosingCircle.Radius + planets[0].width / 2 + 43) * 2;
        super({
            pos: enclosingCircle.Position,
            width: d,
            height: d,
        });
        this.maximumDevelopmentLevel = options.maximumDevelopmentLevel ?? 3;
    }

    onInitialize() {

        const color = Color.fromRGB(Color.LightGray.r, Color.LightGray.g, Color.LightGray.b, 0.5);
        const circle = new Circle({
            color: color,
            radius: this.width / 2,
        });
        this.graphics.add(circle);

        this.developmentMarker = [];

        for (let index = 0; index < this.maximumDevelopmentLevel; index++) {
            const pointingMarker = new Circle({
                radius: 8,
                color: index < this._developmentLevel ? Group.markerColor : Color.Transparent,
                strokeColor: Color.Viridian,
                lineWidth: 4,
                padding: 2,
                smoothing: true,
            })

            this.developmentMarker[index] = pointingMarker;
            // pointingMarker.showDebug = true;
            pointingMarker.width = 320;
            // pointingMarker.height = 80;
            pointingMarker.rotation = Math.PI / 5 * index + Math.PI / 2;
            this.graphics.add(pointingMarker);
        }


    }
}
