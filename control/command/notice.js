const Discord = require('discord.js')
module.exports={
    info:{
        name:"notice",
        category:"owner"
    },
    run(message,args){
        var guilds = message.client.guilds
        guilds.forEach(guild=>{
            var channel = guild.channels.find(c=>c.name=="bot-logs"||c.name=="bot-spam")
            var em = new Discord.RichEmbed();
            em.setTitle("Notice from the creator!")
            em.setDescription(args)
            if(!channel){
                channel= guild.channels.find(c=>c.type=="text"&&c.permissionsFor(guild.me).has("SEND_MESSAGES"))
                em.addBlankField();
                em.addField("For Guild Master","If you're Admin,you should create a `bot-logs` or `bot-spam` channel for Yumi's notice :3 Thanks!")
            }
            channel.send(em);
        })

    }
}