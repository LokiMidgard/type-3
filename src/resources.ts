import { Texture } from 'excalibur';
import sword from './images/sword.png';
import planet1 from './images/planet1.png';
import planet2 from './images/planet2.png';
import planet3 from './images/planet3.png';
import stars1 from './images/Stars-background/spr_stars01.png';
import stars2 from './images/Stars-background/spr_stars02.png';
import screen from './images/wenrexaassetsui_scifi/PNG/SelectPanel01.png';
import { ImageSource } from 'excalibur/build/dist/Graphics';

/**
 * Default global resource dictionary. This gets loaded immediately
 * and holds available assets for the game.
 */
const Resources = {
    Sword: new ImageSource(sword)
    , Planet1: new ImageSource(planet1)
    , Planet2: new ImageSource(planet2)
    , Planet3: new ImageSource(planet3)
    , StarsBackground: new ImageSource(stars1)
    , StarsForground: new ImageSource(stars2)
    , Screen: new ImageSource(screen)
}

export { Resources }
