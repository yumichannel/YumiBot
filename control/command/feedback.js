const Discord = require('discord.js')
module.exports = {
    info: {
        name: "feedback",
        category: "support",
        description: "",
        nsfw: false,
        usage: "`prefix`feedback <yourfeedback>",
        fusage:"`yourfeedback`: your feedback :v or anything else but text",
        ishide: false,
        cooldown:5
    },
    run(message,args){
        // Main code
        message.client.channels.get('538695946733748225').send(new Discord.RichEmbed().setAuthor(message.author.username).setDescription(args))
    }
}