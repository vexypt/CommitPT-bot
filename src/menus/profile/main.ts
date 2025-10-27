import { brBuilder } from "@magicyan/discord";
import { ComponentType, ContainerBuilder, Guild, inlineCode, InteractionReplyOptions, MessageFlags, time, User } from "discord.js";

export function profileMainMenu<R>(user: User, guild: Guild): R {

    const member = guild.members.cache.get(user.id);
    if(!member) {
        throw new Error("User not found in this guild");
    }
    
    const container = new ContainerBuilder({
        components: [
            {
                type: ComponentType.Section,
                components: [
                    {
                        type: ComponentType.TextDisplay,
                        content: brBuilder(
                            `# Perfil de ${member} (@${member.user.username})`,
                        )
                    }
                ],
                accessory: {
                    type: ComponentType.Thumbnail,
                    media: {
                        url: user.displayAvatarURL({
                            size: 256,
                            extension: "png"
                        })
                    }
                },
            },
            {
                type: ComponentType.TextDisplay,
                content: brBuilder(
                    `**ID:** ${inlineCode(member.id)}`,
                    `**Entrou no servidor em:** ${member.joinedTimestamp ? time(member.joinedTimestamp, "R") : "Desconhecido"}`,
                    `**Cargos:** ${inlineCode(member.roles.cache.map(role => role).join(", "))}`,
                )
            }
        ]
    });

    return ({
        components: [container],
        flags: [MessageFlags.IsComponentsV2]
    } satisfies InteractionReplyOptions) as R;
}