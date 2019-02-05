const Discord = require('discord.js')
module.exports = {
    info: {
        name: "inviteme",
        category: "bot",
        description: "get invite link",
        nsfw: false,
        usage: "`prefix`inviteme",
        cooldown:5
    },
    async run(message,args){
        // Main code
        var link = await message.client.generateInvite(['SEND_MESSAGES','MANAGE_MESSAGES']);
        message.channel.send(
            new Discord.RichEmbed()
            .setColor(message.member.displayHexColor)
            .setTitle("Click to invite me")
            .setURL(link)
        )
    }
}