import { Actor } from "excalibur";
import { Sprite } from "excalibur/build/dist/Graphics";
import { Resources } from "../../resources";

export class Background extends Actor {

    constructor() {
        super();
    }

    onInitialize() {

        const layer1Background = new Actor();
        layer1Background.graphics.add(Sprite.from(Resources.StarsForground));
        this.addChild(layer1Background);

        this.graphics.add(Sprite.from(Resources.StarsBackground));

        layer1Background.actions.repeatForever(x=>x.moveBy(10,0,5))
        this.actions.repeatForever(x=>x.moveBy(10,0,10))
        
    }
}
