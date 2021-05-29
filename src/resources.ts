import { Texture } from 'excalibur';
import sword from './images/sword.png';
import planet1 from './images/planet1.png';
import planet2 from './images/planet2.png';
import planet3 from './images/planet3.png';
import buttonHexIdle from './images/wenrexaassetsui_scifi/PNG/HexButton_Idle.png';
import buttonHexHover from './images/wenrexaassetsui_scifi/PNG/HexButton_Hover.png';
import buttonHexPressed from './images/wenrexaassetsui_scifi/PNG/HexButton_Pressed.png';
import buildIcon from './images/wenrexaassetsui_scifi/PNG/BuildIcon.png';
import battleIcon from './images/wenrexaassetsui_scifi/PNG/Battle.png';
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
    , ButtonHexIdle: new ImageSource(buttonHexIdle)
    , ButtonHexHover: new ImageSource(buttonHexHover)
    , ButtonHexPressed: new ImageSource(buttonHexPressed)
    , BuildIcon: new ImageSource(buildIcon)
    , BattleIcon: new ImageSource(battleIcon)



}

export { Resources }
