import { ApplicationCommandType } from 'discord.js'
import { createCommand } from './index.js'

const commitCommand = createCommand({
    name: 'commit',
    description: 'CommitPT bot commands',
    type: ApplicationCommandType.ChatInput,
})

commitCommand.subcommand({
    name: 'ping',
    description: 'Ping command to test bot responsiveness',
    async run(interaction) {
        const sent = await interaction.reply({
            content: 'Pinging...',
            fetchReply: true,
        })

        const roundtripLatency =
            sent.createdTimestamp - interaction.createdTimestamp
        const websocketLatency = Math.round(interaction.client.ws.ping)

        await interaction.editReply(
            `🏓 Pong!\n` +
                `📡 Roundtrip latency: ${roundtripLatency}ms\n` +
                `💓 Websocket heartbeat: ${websocketLatency}ms`
        )
    },
})
