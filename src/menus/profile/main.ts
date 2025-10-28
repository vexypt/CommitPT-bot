import { brBuilder } from "@magicyan/discord";
import { ComponentType, ContainerBuilder, Guild, inlineCode,
    InteractionReplyOptions, MessageFlags, time, User } from "discord.js";

export function profileMainMenu<R>(user: User, guild: Guild): R {

    // Eu já verifico no código antes de enviar o menu
    const member = guild.members.cache.get(user.id)!;

    const bannerURL = user.bannerURL({ size: 4096, extension: "png" });
    
    const components: any[] = [];

    // Adiciona o banner como MediaGallery se existir
    if (bannerURL) {
        components.push({
            type: ComponentType.MediaGallery,
            media: [{
                url: bannerURL,
                alt: `${user.username}'s banner`
            }]
        });
    }

    components.push({
        type: ComponentType.Section,
        components: [
            {
                type: ComponentType.TextDisplay,
                content: brBuilder(
                    `# Perfil de ${member} (@${member.user.username})`,
                    `**ID:** ${inlineCode(member!.id)}`,
                    `**Entrou no servidor:** ${member.joinedAt ? time(Math.floor(member.joinedAt.getTime() / 1000), "R") : `${inlineCode("Não está no servidor")}`}`,
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
    });

    const container = new ContainerBuilder({ components });

    return ({
        components: [container],
        flags: [MessageFlags.IsComponentsV2]
    } satisfies InteractionReplyOptions) as R;
}