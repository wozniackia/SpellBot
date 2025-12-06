const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spell')
        .setDescription('Jestes spellem'),
    async execute(interaction) {
        await interaction.reply(`<@${interaction.user.id}> jestes spellem!`);
    },
};