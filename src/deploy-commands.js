// deploy-commands.js
const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [
    new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song from a URL")
        .addStringOption(option =>
            option
                .setName("url")
                .setDescription("Song URL (YouTube, etc.)")
                .setRequired(true)
        )
        .toJSON(),
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log("🚀 Refreshing application (/) commands...");

        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID),
            { body: commands },
        );

        console.log("✅ Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error("❌ Error reloading commands:", error);
    }
})();
