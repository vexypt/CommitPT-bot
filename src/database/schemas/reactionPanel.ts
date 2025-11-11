import { Schema } from 'mongoose';

const mappingSchema = new Schema({
  emojiKey: { type: String, required: true }, // normalized unique key for emoji (unicode or custom)
  emojiRaw: { type: String, required: true }, // original user input to show in UIs
  roleId: { type: String, required: true },
  description: { type: String, default: '' },
});

export const reactionRolePanelSchema = new Schema(
  {
    guildId: { type: String, index: true, required: true },
    channelId: { type: String },
    messageId: { type: String },
    title: { type: String, required: true, unique: true },
    content: { type: String, default: '' },
    mutuallyExclusive: { type: Boolean, default: false },
    mappings: { type: [mappingSchema], default: [] },
    createdBy: { type: String, required: true },
  },
  {
    statics: {
      async createPanel(guildId: string, title: string, createdBy: string) {
        // Verifica se já existe um painel com o mesmo título no mesmo servidor
        const existing = await this.findOne({ guildId, title }).exec();
        if (existing) {
          const err: any = new Error('PanelTitleExists');
          err.code = 'PANEL_TITLE_EXISTS';
          throw err;
        }

        const query = { guildId, title, createdBy };
        return await this.create(query);
      },
      async findByTitle(title: string) {
        return await this.findOne({ title }).exec();
      },
    },
  }
);
