import { createCommand } from '#base';
import { db } from '#database';
import { menus } from '#menus';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  MessageFlags,
} from 'discord.js';

// autocomplete helper
async function panelAutocomplete(interaction: any) {
  const guildId = interaction.guild?.id;
  if (!guildId) return [];
  const q = await db.reactionRolePanel.find({ guildId }).limit(25).exec();
  return q.map((p) => ({
    name: p.title ?? String(p._id),
    value: String(p._id),
  }));
}

createCommand({
  name: 'rr',
  description: 'reactionRole module',
  type: ApplicationCommandType.ChatInput,
  contexts: [InteractionContextType.Guild],
  integrationTypes: [ApplicationIntegrationType.GuildInstall],
  global: false,
  options: [
    {
      name: 'create',
      description: 'Create a reaction role panel',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'name',
          description: 'Name of the reaction role panel',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: 'edit',
      description: 'Edit an existing panel',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'panel',
          description: 'Select panel to edit',
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: panelAutocomplete,
        },
      ],
    },
    {
      name: 'send',
      description: 'Send an existing panel to the current channel',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'panel',
          description: 'Select panel to send',
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: panelAutocomplete,
        },
      ],
    },
  ],
  //defaultMemberPermissions: [PermissionFlagsBits.ManageRoles],
  async run(interaction) {
    const { options, user, guild } = interaction;

    if (interaction.user.id !== '629734543867379732') return;
    if (!guild) return;

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    switch (options.getSubcommand()) {
      case 'create': {
        await interaction.editReply(
          await menus.reactionPanel.config.create(user, guild, options.getString('name', true))
        );

        return;
      }
    }

    /*if (sub === "create") {
            const channel = interaction.options.getChannel("channel", true);
            // send a small embed with buttons to open modal for configuration
            const configureBtn = new ButtonBuilder()
                .setCustomId("rr:create:open")
                .setLabel("Configurar painel")
                .setStyle(ButtonStyle.Primary);

            const sendBtn = new ButtonBuilder()
                .setCustomId("rr:create:send")
                .setLabel("Enviar (mais tarde)")
                .setStyle(ButtonStyle.Success);

            await interaction.reply({
                content: `Painel será criado para o canal ${channel.toString()}. Use "Configurar painel" para preencher título/conteúdo.`,
                components: [new ActionRowBuilder().addComponents(configureBtn, sendBtn)],
                ephemeral: true
            });
            return;
        }

        if (sub === "edit") {
            const panelId = interaction.options.getString("panel", true);
            const panel = await db.reactionRolePanel.findById(panelId).exec();
            if (!panel) {
                await interaction.reply({ content: "Painel não encontrado.", ephemeral: true });
                return;
            }

            const editBtn = new ButtonBuilder()
                .setCustomId(`rr:edit:${panelId}`)
                .setLabel("Editar painel")
                .setStyle(ButtonStyle.Primary);

            await interaction.reply({
                content: `Editar painel ${panel.title}`,
                components: [new ActionRowBuilder().addComponents(editBtn)],
                ephemeral: true
            });
            return;
        }

        if (sub === "send") {
            const panelId = interaction.options.getString("panel", true);
            const panel = await db.reactionRolePanel.findById(panelId).exec();
            if (!panel) {
                await interaction.reply({ content: "Painel não encontrado.", ephemeral: true });
                return;
            }

            // Send the panel to the current channel (interaction.channel)
            const channel = interaction.channel;
            if (!channel || !channel.isTextBased?.()) {
                await interaction.reply({ content: "Canal inválido para envio.", ephemeral: true });
                return;
            }

            const sent = await channel.send({
                content: panel.content || undefined,
                embeds: panel.content ? [] : undefined
            });

            // Save messageId to panel
            panel.messageId = String(sent.id);
            await panel.save();

            await interaction.reply({ content: `Painel enviado em ${channel.toString()}`, ephemeral: true });
            return;
        }*/
  },
});
/*
// Responder: abre modal para criar painel
createResponder({
    customId: "rr:create:open",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        const modal = new ModalBuilder()
            .setCustomId("rr:create:modal")
            .setTitle("Criar Reaction Role Panel");

        const titleInput = new TextInputBuilder()
            .setCustomId("title")
            .setLabel("Título do painel")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const contentInput = new TextInputBuilder()
            .setCustomId("content")
            .setLabel("Conteúdo/Descrição")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(titleInput),
            new ActionRowBuilder().addComponents(contentInput)
        );

        await interaction.showModal(modal);
    }
});

// Responder: recebe modal submit e cria rascunho no DB
createResponder({
    customId: "rr:create:modal",
    types: [ResponderType.Modal],
    cache: "cached",
    async run(interaction) {
        const title = interaction.fields.getTextInputValue("title");
        const content = interaction.fields.getTextInputValue("content");

        const guildId = interaction.guild?.id;
        if (!guildId) {
            await interaction.reply({ content: "Somente dentro de servidores.", ephemeral: true });
            return;
        }

        // messageId placeholder for draft to satisfy schema uniqueness
        const messageId = `draft:${Date.now()}`;

        const panel = await db.reactionRolePanel.create({
            guildId,
            channelId: interaction.channelId ?? "",
            messageId,
            title,
            content,
            mutuallyExclusive: false,
            mappings: [],
            createdBy: interaction.user.id
        });

        await interaction.reply({ content: `Painel criado: ${panel.title}`, ephemeral: true });
    }
});

// Responder: abre modal para edição
createResponder({
    customId: "rr:edit:*",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        // custom id will be rr:edit:<panelId>
        const [, , panelId] = interaction.customId.split(":");
        const panel = await db.reactionRolePanel.findById(panelId).exec();
        if (!panel) {
            await interaction.reply({ content: "Painel não encontrado.", ephemeral: true });
            return;
        }

        const modal = new ModalBuilder()
            .setCustomId(`rr:edit:modal:${panelId}`)
            .setTitle(`Editar ${panel.title}`);

        const titleInput = new TextInputBuilder()
            .setCustomId("title")
            .setLabel("Título do painel")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(panel.title ?? "");

        const contentInput = new TextInputBuilder()
            .setCustomId("content")
            .setLabel("Conteúdo/Descrição")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setValue(panel.content ?? "");

        modal.addComponents(
            new ActionRowBuilder().addComponents(titleInput),
            new ActionRowBuilder().addComponents(contentInput)
        );

        await interaction.showModal(modal);
    }
});

// Responder: recebe modal de edição
createResponder({
    customId: "rr:edit:modal:*",
    types: [ResponderType.Modal],
    cache: "cached",
    async run(interaction) {
        // customId = rr:edit:modal:<panelId>
        const parts = interaction.customId.split(":");
        const panelId = parts[parts.length - 1];

        const panel = await db.reactionRolePanel.findById(panelId).exec();
        if (!panel) {
            await interaction.reply({ content: "Painel não encontrado.", ephemeral: true });
            return;
        }

        const title = interaction.fields.getTextInputValue("title");
        const content = interaction.fields.getTextInputValue("content");

        panel.title = title;
        panel.content = content;
        await panel.save();

        await interaction.reply({ content: `Painel atualizado: ${panel.title}`, ephemeral: true });
    }
});*/
