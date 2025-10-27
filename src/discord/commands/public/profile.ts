import { createCommand } from "#base";
import { menus } from "#menus";
import { ApplicationCommandOptionType, ApplicationCommandType, ApplicationIntegrationType, InteractionContextType, MessageFlags } from "discord.js";

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
                },
            ]
        }
    ],
    global: false,
    async run(interaction) {
        const { options } = interaction;

        switch(options.getSubcommand()) {
            case "profile": {
                await interaction.deferReply();

                const user = options.getUser("user") || interaction.user;
                const guild = interaction.guild;

                if(!guild) {
                    interaction.reply({
                        content: "Este comando só pode ser usado dentro de um servidor!",
                        flags: [MessageFlags.Ephemeral]
                    });
                    return;
                }

                await interaction.editReply(menus.profile.main(user, guild));

                return;
            }
        }
    }
});