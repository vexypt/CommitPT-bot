import { Schema } from "mongoose";
import { t } from "../../utils.js";

const reactionsSchema = new Schema({
    emoji: { type: String, required: true },
    emojiId: { type: String, required: false },
    isCustom: { type: Boolean, required: true, default: false },
    roleId: t.string,
}, { _id: false });

export const panelSchema = new Schema({
    id: t.string,
    guildId: t.string,
    name: { type: String, required: true }, 
    channelId: { type: String, required: false },
    messageId: { type: String, required: false }, 
    description: { type: String, required: false },
    reactions: { type: [reactionsSchema], default: [] },
}, {
    timestamps: true,
    statics: {
        async get(this: any, query: { id?: string, guildId?: string }) {
            if (query.id) return await this.findOne({ id: query.id });
            if (query.guildId) return await this.find({ guildId: query.guildId });
            return null;
        },
        async findByMessage(this: any, channelId: string, messageId: string) {
            return await this.findOne({ channelId, messageId });
        },
        async upsertById(this: any, id: string, doc: any) {
            return await this.findOneAndUpdate({ id }, { $set: doc }, { upsert: true, new: true });
        }
    }
});