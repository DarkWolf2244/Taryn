import { Client, SlashCommandBuilder, CommandInteraction } from "discord.js";

export interface TarynClientInterface {
    discordClient: Client,
    eggstend: Eggstender,
}

export interface Eggstender {
    client: TarynClientInterface;
    placeholderFooters: string[];

    getChannelById(channelId: string): any;
    sendSuccessEmbed(channel: any, title: string, message: string, footer?: string): void;
    registerSlashCommands(commandFolder: string, guildId: string, clientId: string, token: string): void;

}

export class TarynCommand {
    name: string;
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction, client: TarynClientInterface) => void;
}