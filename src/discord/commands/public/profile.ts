import { createCommand } from "#base";
import { ApplicationCommandOptionType, ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from "discord.js";

createCommand({
    name: "user",
    description: "user module",
    type: ApplicationCommandType.ChatInput,
    contexts: [
        InteractionContextType.Guild,
    ],
    integrationTypes: [
        ApplicationIntegrationType.GuildInstall
    ],
    options: [
        {
            name: "profile",
            description: "See a user profile",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "The user to see the profile",
                    type: ApplicationCommandOptionType.User,
                    required: false
                }
            ]
        }
    ],
    global: false,
    async run(interaction) {
        
    }
});