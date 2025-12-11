const { SlashCommandBuilder } = require('discord.js');
const {
    joinVoiceChannel,
    VoiceConnectionStatus,
} = require("@discordjs/voice");
const {startPlaying} = require("../../audioPlayer");

// const url = "https://www.youtube.com/playlist?list=PLGV-bdy06e8NZOy5dFvfREkINS9uobx_a";
const url = "https://youtu.be/wPSaPXRYFd4?si=2WWyIXPNvPcpcG9K";

module.exports = {
    data: new SlashCommandBuilder().setName('play').setDescription('Plays music'),
    async execute(interaction, client) {
        const channelId = interaction.member.voice.channel.id
        const guildId = interaction.guild.id

        const guild = client.guilds.cache.get(guildId);

        if (!guild) {
            console.error("Server not found, could not connect to voice channel.");
            return;
        }

        const connection = joinVoiceChannel({
            channelId,
            guildId,
            adapterCreator: guild.voiceAdapterCreator,
        });

        connection.on("stateChange", (oldState, newState) => {
            console.log(
                `Connection state: ${oldState.status} -> ${newState.status}`
            );

            if (
                oldState.status === VoiceConnectionStatus.Ready &&
                newState.status === VoiceConnectionStatus.Connecting
            ) {
                // Workaround for some networking issues
                connection.configureNetworking();
            }
        });

        startPlaying(connection, url).catch((err) => {
            console.error("Error in startPlaying:", err);
        });
    },
};