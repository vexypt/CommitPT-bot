import { brBuilder } from '@magicyan/discord';
import { ComponentType, ContainerBuilder, Guild, inlineCode,
    InteractionReplyOptions, MessageFlags, time, User } from 'discord.js';

export function profileMainMenu<R>(user: User, guild: Guild): R {

    // Coloco o '!' porque já verifico no proprio comando (src/discord/commands/public/profile.ts) antes de enviar este menú
    const member = guild.members.cache.get(user.id)!;
    await member.fetch(); // Para garantir que o membro está carregado, geralmente sem isto o bot não consegue ver o banner do usuário

    const bannerURL = member.displayBannerURL({ size: 4096, extension: 'png' });

    const profileContainer = new ContainerBuilder({
        components: [
            {
                type: ComponentType.Section,
                components: [
                    {
                        type: ComponentType.TextDisplay,
                        content: brBuilder(
                            `# Perfil de ${member} (@${member.user.username})`,
                            `**ID:** ${inlineCode(member!.id)}`,
                            `**Entrou no servidor em:** ${time(member.joinedTimestamp!, 'R')}`,
                            '**Cargos:**',
                            `${member!.roles.cache.map(role => role).join(', ')}`
                        )
                    }
                ],
                accessory: {
                    type: ComponentType.Thumbnail,
                    media: {
                        url: user.displayAvatarURL({ size: 256, extension: 'png' })
                    }
                },
            },
            ...bannerURL ? {
                type: ComponentType.MediaGallery,
                media: [{
                    url: bannerURL,
                    alt: `${user.username}'s banner`
                }]
            }
        ]
    });

    return ({
        components: [profileContainer],
        flags: [MessageFlags.IsComponentsV2]
    } satisfies InteractionReplyOptions) as R;
}