import { db } from "#database";
import { brBuilder, createRow } from "@magicyan/discord";
import {
    ButtonBuilder,
    ButtonStyle,
    channelMention,
    ComponentType,
    ContainerBuilder,
    Guild,
    MessageFlags,
    User,
    type InteractionReplyOptions
} from "discord.js";

export async function reactionPanelConfig_CreateMenu<R>(user: User, guild: Guild, name: string): Promise<R> {

    const panel = await db.reactionRolePanel.createPanel(guild.id, name, user.id);

    const createMenuContainer = new ContainerBuilder({
        components: [
            {
                type: ComponentType.TextDisplay,
                content: brBuilder(
                    "# Configuração do Painel de Reação",
                    "",
                    `**Canal:** ${panel?.channelId ? `${channelMention(panel.channelId)}` : '`Não configurado`' }`,
                    "",
                    "Use os botões abaixo para selecionar o canal, configurar o painel (título/conteúdo) ou enviar o painel ao canal selecionado."
                )
            }
        ]
    });

    const buttonsRow = createRow(
        new ButtonBuilder({
            customId: "rr/create/select_channel",
            label: "Selecionar Canal",
            style: ButtonStyle.Primary
        }),
        new ButtonBuilder({
            customId: "rr/create/open",
            label: "Configurar Painel",
            style: ButtonStyle.Secondary
        }),
        new ButtonBuilder({
            customId: "rr/create/send",
            label: "Enviar",
            style: ButtonStyle.Success
        })
    );

    // Em um row separado apenas para para estética visual (ele fica na linha de baixo)
    const deleteRow = createRow(
        new ButtonBuilder({
            customId: "rr/create/delete",
            label: "Deletar Painel",
            style: ButtonStyle.Danger
        })
    );



    return ({
        components: [createMenuContainer, buttonsRow, deleteRow],
        flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        allowedMentions: { repliedUser: false, roles: [], users: [], parse: [] }
    } satisfies InteractionReplyOptions) as R;
}
