import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { menus } from '#menus';
import { brBuilder, hexToRgb } from '@magicyan/discord';
import { ChannelType, ComponentType, ContainerBuilder, inlineCode, MessageFlags } from 'discord.js';

createResponder({
  customId: 'rr/:option/:params/:title',
  types: [ResponderType.Button, ResponderType.ChannelSelect],
  cache: 'cached',
  async run(interaction, { option, params, title }) {
    switch (option) {
      case 'create': {
        switch (params) {
          case 'select_channel': {
            const selectChannelContainer = new ContainerBuilder({
              components: [
                {
                  type: ComponentType.TextDisplay,
                  content: '# Seleciona um canal',
                },
                {
                  type: ComponentType.ActionRow,
                  components: [
                    {
                      type: ComponentType.ChannelSelect,
                      custom_id: `rr/create/selectChannelComponent/${title}`,
                      min_values: 1,
                      max_values: 1,
                      channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
                    },
                  ],
                },
              ],
            });

            interaction.update({
              components: [selectChannelContainer],
              flags: [MessageFlags.IsComponentsV2],
            });

            return;
          }

          case 'selectChannelComponent': {
            if (!interaction.isChannelSelectMenu()) return;

            const channelId = interaction.values[0];
            const reactionPanel = await db.reactionRolePanel.findByTitle(title);

            const errorContainer = new ContainerBuilder({
              accent_color: hexToRgb(constants.colors.danger),
            });

            if (!reactionPanel) {
              errorContainer.addTextDisplayComponents({
                type: ComponentType.TextDisplay,
                content: brBuilder(
                  `# Erro ao selecionar canal`,
                  '',
                  '',
                  `Painel de reação com o título ${inlineCode(title)} não encontrado.`
                ),
              });
              return;
            }

            reactionPanel.channelId = channelId;
            await reactionPanel.save();

            interaction.update(
              await menus.reactionPanel.config.create(interaction.user, interaction.guild!, title)
            );
            return;
          }
        }

        return;
      }
    }
  },
});
