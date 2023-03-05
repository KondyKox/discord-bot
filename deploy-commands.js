const {REST, Routes} = require('discord.js');
const fs = require('fs');

const commands = [];

for (const folder of fs.readdirSync('./commands')) {
    const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);

        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// rejestrowanie komend
(async () => {
    try {
        console.log('Rozpoczęto aktualizację komend.');

        const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

        console.log('Zaktualizowano komendy.');
    } catch (error) {
        console.error(error);
    }
})();

//https://github.com/Tomato6966/Discord-Js-Handler-Template/blob/main/index.js