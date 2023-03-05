// import do /komend
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Teścik'),
    async execute(interaction) {
        interaction.reply('Test');
    }
}