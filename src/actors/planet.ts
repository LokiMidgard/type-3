import { Actor, Color, vec, Vector } from 'excalibur';
import { Circle, Sprite } from 'excalibur/build/dist/Graphics';
import { randomIntInRange } from 'excalibur/build/dist/Util';
import { Resources } from '../resources';
import { Player } from '../model/player';

interface PlanetOptions {
    /**
     * The development level increases every round by one up to the maximum (default 3).
     * The higher the development level the more resources a group generates.
     * You need to control all planets of the group.
     */
    maximumDevelopmentLevel?: number;
    developmentLevel?: number;
    pos: Vector;
    pointing?: boolean;
    id: string,
    owner?: Player
}

export class Planet extends Actor {

    static textures = [
        Resources.Planet1,
        Resources.Planet2,
        Resources.Planet3,
    ];


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
                marker.color = Planet.markerColor;
            } else {
                marker.color = Color.Transparent;
            }
            marker.padding = 5;
            marker.width = 80;
            marker.height = 12;
        }
    }



    private _controlingPlayer?: Player;
    public get controlingPlayer(): Player | undefined {
        return this._controlingPlayer;
    }

    public set controlingPlayer(v: Player | undefined) {
        this._controlingPlayer = v;
        if (!this.controlCircle)
            return;
        this.controlCircle.color = v?.color ?? Color.Transparent;
    }
    private controlCircle: Circle;



    private developmentMarker: Circle[];



    public readonly pointing: boolean;
    public readonly name: string;

    constructor(options: PlanetOptions) {
        const radius = 100;
        super({
            pos: options.pos,
            width: radius,
            height: radius,
        });

        this.maximumDevelopmentLevel = options.maximumDevelopmentLevel ?? 3;
        this.developmentLevel = 0;

        this.pointing = options.pointing ?? false;
        this.name = options.id;
        this.controlingPlayer = options.owner;
        this.developmentLevel = options.developmentLevel ?? 0
    }

    onInitialize() {
        // this.addDrawing(Resources.Planet1);


        const sphere = new Circle({
            radius: 45,
            color: Color.fromRGB(Color.LightGray.r, Color.LightGray.g, Color.LightGray.b, 0.5)
        });
        this.graphics.add(sphere);

        this.controlCircle = new Circle({
            radius: 25,
            padding: 3,
            color: this.controlingPlayer?.color ?? Color.Transparent
        });
        this.graphics.add(this.controlCircle);

        const index = randomIntInRange(0, Planet.textures.length - 1);
        const sprite = Sprite.from(Planet.textures[index]);
        sprite.scale = vec(0.3, 0.3);
        this.graphics.add(sprite);


        for (let index = 0; index < this.maximumDevelopmentLevel; index++) {
            const pointingMarker = new Circle({
                radius: 6,
                color: index < this._developmentLevel ? Planet.markerColor : Color.Transparent,
                strokeColor: Color.Viridian,
                lineWidth: 3,
                padding: 5,
                smoothing: true,
            })
            // pointingMarker.showDebug = true;
            pointingMarker.width = 80;
            pointingMarker.height = 12;
            pointingMarker.rotation = Math.PI / 5 * index + Math.PI / 2;
            this.graphics.add(pointingMarker);
        }


    }
}
