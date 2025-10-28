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
        channelId: { type: String, required: true },
        messageId: { type: String, required: true, unique: true },
        title: { type: String, required: true, unique: true },
        content: { type: String, default: '' },
        mutuallyExclusive: { type: Boolean, default: false },
        mappings: { type: [mappingSchema], default: [] },
        createdBy: { type: String, required: true }
    },
    { timestamps: true }
);