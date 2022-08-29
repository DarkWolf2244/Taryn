// An extension library to use in Discord.js
// It's used for a lot of things, but mostly to make pretty outputs with embeds.

import { ColorResolvable, EmbedBuilder, TextChannel, Routes, Channel } from 'discord.js';
import { TarynClientInterface, TarynCommand } from './Interfaces';
import * as fs from 'fs';
import { REST } from '@discordjs/rest';

export class Eggstender {
    client: TarynClientInterface;

    public placeholderFooters = [
        "Dare to explore.",
        "A word to the wise.",
        "Seek the truth."
    ];

    constructor(client: TarynClientInterface) {
        this.client = client;
    }

    createEmbed(title: string, message: string, color: ColorResolvable, footer?: string) {
        let embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(color)
            .setDescription(message);
        
        if (footer) {
            embed.setFooter({ text: footer });
        } else {
            embed.setFooter({ text: this.placeholderFooters[Math.floor(Math.random() * this.placeholderFooters.length)] });
        }

        return embed;
    }

    getChannelById(channelId: string): Promise<TextChannel> {
        return this.client.discordClient.channels.fetch(channelId) as Promise<TextChannel>;
    }

    sendSuccessEmbed(channel: TextChannel, title: string, message: string, footer?: string): void;
    sendSuccessEmbed(channelId: string, title: string, message: string, footer?: string): void;

    sendSuccessEmbed(channel: TextChannel | string, title: string, message: string, footer?: string): void {
        if (typeof channel === 'string') {
            this.getChannelById(channel).then(c => {
                c.send({ embeds: [this.createEmbed(title, message, '#00ff00', footer)] });
            });
        }
        
    }

    registerSlashCommands(commandFolder: string, guildId: string, clientId: string, token: string) {
        const commands: TarynCommand[] = [];
        const commandFiles = fs.readdirSync(commandFolder).filter(file => file.endsWith('.ts'));


        for (const file of commandFiles) {
            let command = require(`./commands/${file}`);
            command = new command() as TarynCommand;
            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '10' }).setToken(token);

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');

                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: commands },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    }

}