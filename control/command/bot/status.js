const Discord = require('discord.js')
const child = require('child_process')
module.exports={
    info:{
        name:"status",
        description:"Show bot status",
        category:"bot",
        cooldown: 5
    },
    run(message,args){
        var em = new Discord.RichEmbed()
        em.setThumbnail(message.client.user.displayAvatarURL)
        em.setTitle("Status of Bot")
        em.setDescription("--------------------------------------")
        em.addField("Developer",process.env.devname||`<@${process.env.owner}>`||"unknown",true)
        em.addField("Uptime",message.client.uptimes,false)
        em.addField("Server handle",message.client.guilds.size,true)
        em.addField("Channel handle",message.client.channels.size,true)
        em.addField("Command handle",message.client.commands.size,true)
        em.addField("Memory usage",(process.memoryUsage().heapUsed/1024/1024).toFixed(2)+" MB",true)
        em.addField("Heart beat",message.client.ping)
        message.channel.send(em)
    }
}