const Discord = require('discord.js')
module.exports = {
    info: {
        name: "wcchannel",
        category: "admin",
        description: "Chose a greeting channel",
        nsfw: false,
        usage: "`prefix`wcchannel `text_channel_name`",
        fusage:"",
        ishide: false,
        cooldown: 1
    },
    run(message=new Discord.Message,args){
        // Main code
        var channel = message.guild.channels.find(c=>c.name==args && c.type=="text")
        if(!channel) return message.channel.send("```Please chose an exist text channel```")
        var gindex = message.client.welchannel.findIndex(g=>g.id==message.guild.id)
        if(gindex==-1) return message.channel.send("```Your guild is not in our database. Contact Developer for this problem!```")
        if(message.client.welchannel[gindex].list.length==0){
            message.client.welchannel[gindex].list.push(args)
        }else{
            message.client.welchannel[gindex].list[0]=args
        }
        message.client.db.save().then(message.channel.send("Greeting channel set to "+args,{code:true}))
        return
    }
}