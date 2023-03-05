// import do /komend
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Fukcja chatGPT')
        .addStringOption(option => {
            option.setName('message')
            .setDescription('No robi cos')
            .setRequired(true)
        }),
    async execute(interaction) {
        var prompt = interaction.options.get('message');
        bot.complete(prompt, {stop: ['\n', '"'], temperature: 0})
            .then(completion => {
                console.log(`Result: ${prompt}${completion.choices[0].text}`);
            }).catch(console.error);
            
        //interaction.reply('Test');
    }
}