import { env } from '#env'
import chalk from 'chalk'
import mongoose, { InferSchemaType, model } from 'mongoose'
import { guildSchema } from './schemas/guild.js'
import { userSchema } from './schemas/user.js'

try {
    console.log(chalk.blue('Connecting to MongoDB...'))
    await mongoose.connect(env.MONGO_URI, {
        dbName: env.DATABASE_NAME || 'database',
    })
    console.log(chalk.green('MongoDB connected'))
} catch (err) {
    console.error(err)
    process.exit(1)
}

export const db = {
    guilds: model('guild', guildSchema, 'guilds'),
    users: model('user', userSchema, 'users'),
}

export type GuildSchema = InferSchemaType<typeof guildSchema>
export type UserSchema = InferSchemaType<typeof userSchema>
