import { CommandInteraction, CommandInteractionOptionResolver, PermissionFlagsBits, Role, SlashCommandBuilder, TextChannel} from "discord.js";
import { TarynClientInterface } from "../Interfaces";

class SetChannelPermission {
    name: string = 'set-channel-permission';
    data: SlashCommandBuilder;

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Set the permission settings for a channel.')
            .addStringOption(option => option.setDescription("The permission").setRequired(true).setName("permission"))
            .addRoleOption(option => option.setDescription('The role to set the permission for.').setName('role').setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels) as SlashCommandBuilder;
    }

    execute(interaction: CommandInteraction, client: TarynClientInterface) {

        interaction = interaction as CommandInteraction;
        interaction.options = interaction.options as CommandInteractionOptionResolver;

        let role = interaction.options.get('role');
        let permission = interaction.options.get('permission') as any;

        let finalPermissionsOverride = {};
        finalPermissionsOverride[permission.value] = true;

        client.eggstend.getChannelById(interaction.channelId).then(c => {
            let m_c = c as TextChannel;

            m_c.permissionOverwrites.create(role.value as string, finalPermissionsOverride);
            interaction.reply(`Permission ${permission.value} set to ${role.value} for channel <#${m_c.id}>`);

            console.log(`Permission ${permission.value} set to ${role.value} for channel <#${m_c.name}>`);
        });
        
    }
}

module.exports = SetChannelPermission;