import { Client, Interaction, Collection, TextChannel } from "discord.js";
import { TarynClientInterface, TarynCommand } from "./Interfaces";
import { Eggstender } from "./Eggstender";
import express from "express";
import * as fs from 'fs';;

let { guildId, clientId } =  require('./config.json');;


require('dotenv').config();

export class TarynClient {
    discordClient: Client;
    eggstend: Eggstender;
    commands: Collection<string, TarynCommand> = new Collection();

    constructor() {
        this.discordClient = new Client({
            intents: [
                'GuildMessages',
            ]
        });
        
        this.discordClient.on('ready', () => {
            console.log('Taryn is ready!');
        });
        
        
        this.eggstend = new Eggstender(this);
        
        let token = process.env.DISCORD_TOKEN as string;

        this.commands = new Collection();
        this.eggstend.registerSlashCommands(__dirname + '/commands', guildId, clientId, token);

        this.loadCommands();

        this.discordClient.on('interactionCreate', this.onInteraction.bind(this));

        this.discordClient.login(process.env.DISCORD_TOKEN);
    }

    loadCommands() {
        const commandFiles = fs.readdirSync(__dirname + "/commands").filter(file => file.endsWith('.ts'));

        for (const commandFile of commandFiles) {
            let command = require(`./commands/${commandFile}`);
            command = new command() as TarynCommand;
            this.commands.set(command.name, command);
            console.log(`Loaded command ${command.name}`);
        }
    }

    onInteraction(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        let command = this.commands.get(interaction.commandName);
        if (command) {
            try {
                command.execute(interaction, this);
            } catch (e) {
                console.log(e);
                interaction.reply(`Hmm, something went wrong while executing that.`);
            }
        } else {
            interaction.reply("I can't find that in my list of commands.");
        }
    }
}

let taryn = new TarynClient();

let app = express();
app.get('/', (req, res) => {
    res.send('Hello World!');
}).listen(process.env.PORT || 3000);