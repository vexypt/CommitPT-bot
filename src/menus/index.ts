import { profileMainMenu } from './profile/main.js';
import { reactionPanelConfig_CreateMenu } from './reactionPanelConfig/create.js';

export const menus = {
    profile: {
        main: profileMainMenu,
    },
    reactionPanel: {
        config: {
            create: reactionPanelConfig_CreateMenu
        }
    }
}