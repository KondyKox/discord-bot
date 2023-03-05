// Import pliku .env
require('dotenv').config();

// Import innych rzeczy
const { Client, GatewayIntentBits, ActivityType, Collection } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai-nodejs');

// Client & Bot
const client = new Client({
    shards: "auto",

    allowedMentions: {
        parse: [ ],
        repliedUser: false,
    },

    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],

    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

const bot = new OpenAI(process.env.OPENAI_KEY);

// Kolekcje
client.commands = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./commands');

// Szuka komend
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command)
        client.commands.set(command.data.name, command);
}

// Bot włączony
client.once('ready', () => {
    console.log("Siema mordy! Wstałem!");

    client.user.setPresence({ activities: [{ name: 'Miki to frajer', type: ActivityType.Playing }] });
})

// ****************************************************** eventy ***************************************************** \\
// -- wysyła zdjęcie 'king.png'
let kingWords = ['king', 'krol', 'król', 'kondi', 'konrad', 'kondrad', 'kondy'];

client.on('messageCreate', message => {
    for (let i = 0; i < kingWords.length; i++) {
        if (message.content.toLowerCase().includes(kingWords[i]) && !message.author.bot) {
            message.channel.send({ files: [{ attachment: './src/king.png' }] });
            break; 
        }
    }
})

// odpala komendy
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command)
        return console.error('Nie ma takiej komendy debilu!');

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "Wystąpił błąd podczas wykonywania tej komendy.", ephemeral: true });
    }
})

// Loguje bota
client.login(process.env.DISCORD_TOKEN);