import { createResponder, ResponderType } from '#base';
import { ComponentType, ContainerBuilder, MessageFlags } from 'discord.js';

createResponder({
  customId: 'rr/:option/:params',
  types: [ResponderType.Button],
  cache: 'cached',
  async run(interaction, { option, params }) {
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
                      custom_id: `rr/create/selectChannelComponent`,
                    },
                  ],
                },
              ],
            });

            interaction.reply({
              components: [selectChannelContainer],
              flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            });

            return;
          }

          case 'selectChannelComponent': {
            return;
          }
        }

        return;
      }
    }
  },
});
