const Discord = require('discord.js')
module.exports = {
    info: {
        name: "laugh",
        category: "image",
        description: "send a picture",
        nsfw: false,
        usage: "`prefix`laugh",
        cooldown:2
    },
    run(message,args){
        // Main code
        let em = new Discord.RichEmbed();
        em.setImage('https://i.imgur.com/ojjWsjK.jpg');
        message.channel.send(em);
    }
}