import { CommandInteraction, Embed, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import { TarynClientInterface } from "../Interfaces";

import axios from "axios";

class QuoteCommand {
    name: string = 'quote';
    data: SlashCommandBuilder;

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Reply with a random quote.')
    } 

    execute(interaction: CommandInteraction, client: TarynClientInterface) {
        // Take a random quote from a quote API
        axios.get("https://zenquotes.io/api/random")
            .then(response => {
                console.log(response);
                
                let embed = new EmbedBuilder()
                    .setTitle("Quote")
                    .setDescription(`"${response.data[0].q}" --${response.data[0].a}`)
                    .setColor("Green")
                    .setFooter({ text: client.eggstend.placeholderFooters[Math.floor(Math.random() * client.eggstend.placeholderFooters.length)] })

                interaction.reply({ embeds: [embed] });
            });
    }
}

module.exports = QuoteCommand;