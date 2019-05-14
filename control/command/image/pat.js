const Discord = require('discord.js')
module.exports = {
    info: {
        name: "pat",
        category: "image",
        description: "pat pat pat",
        nsfw: false,
        usage: "`prefix`pat <",
        fusage:"",
        cooldown:3
    },
    run(message=new Discord.Message,args=new String){
        // Main code
        const list = [
            "https://i.imgur.com/JHdnsWA.gif",
            "https://i.imgur.com/nI532vE.gif",
            "https://i.imgur.com/H39vHeH.gif"
        ]
        const index = Math.floor(Math.random()*3)
        const pater = message.member
        const patted = message.mentions.members.first()
        var text;
        if(args==""){
            text = `${pater.displayName} try patting yourself huh???`
        } else{
            text = (pater.id==patted.id)?`${message.guild.members.get(message.client.user.id).displayName} pat pat pat ${pater.displayName}`:`${pater.displayName} pat pat ${patted.displayName}`
        }
        var embed = new Discord.RichEmbed()
        .setDescription(text)
        .setImage(list[index])
        message.channel.send(embed)
    }
}