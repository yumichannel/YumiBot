const Discord = require('discord.js')
module.exports = {
    info: {
        name: "avatar",
        category: "image",
        description: "show your face (not real face actually)",
        nsfw: false,
        usage: "`prefix`avatar",
        fusage:"",
        cooldown:5
    },
    run(message,args){
        // Main code
        try{
            message.delete()
        }catch(err){
            console.log(err)
        }
        const mentions = message.mentions.members
        if(mentions.size==0){
            var avatar =  message.author.displayAvatarURL.replace("=2048","=256");
            message.channel.send(new Discord.RichEmbed().setImage(avatar).setDescription(`${message.member}'s avatar.`))
        }else{
            var avatar = mentions.first().user.displayAvatarURL.replace("=2048","=256");
            message.channel.send(new Discord.RichEmbed().setImage(avatar).setDescription(`${mentions.first()}'s avatar.`))
        }
        
    }
}