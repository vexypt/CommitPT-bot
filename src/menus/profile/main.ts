import { brBuilder } from "@magicyan/discord";
import { ComponentType, ContainerBuilder, Guild, inlineCode,
    InteractionReplyOptions, MessageFlags, time, User } from "discord.js";

export function profileMainMenu<R>(user: User, guild: Guild): R {

    // Eu já verifico no código antes de enviar o menu
    const member = guild.members.cache.get(user.id)!;
    
    //TODO: Adicionar banner do usuário com MediaGallery (necessário fazer verificação se ele possui banner)
    const container = new ContainerBuilder({
        components: [
            {
                type: ComponentType.Section,
                components: [
                    {
                        type: ComponentType.TextDisplay,
                        content: brBuilder(
                            `# Perfil de ${member} (@${member.user.username})`,
                            `**ID:** ${inlineCode(member!.id)}`,
                            `**Entrou no servidor em:** ${time(member.joinedTimestamp! / 100, "R")}`,
                            "**Cargos:**",
                            `${member!.roles.cache.map(role => role).join(", ")}`
                        )
                    }
                ],
                accessory: {
                    type: ComponentType.Thumbnail,
                    media: {
                        url: user.displayAvatarURL({ size: 256, extension: "png" })
                    }
                },
            },
        ]
    });

    return ({
        components: [container],
        flags: [MessageFlags.IsComponentsV2]
    } satisfies InteractionReplyOptions) as R;
}