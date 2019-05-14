const Discord = require('discord.js')
module.exports = {
    info: {
        name: "errhandle",
        category: "owner",
        description: "",
        nsfw: false,
        usage: "",
        fusage:"",
        ishide: false,
        cooldown: 1
    },
    run(message=new Discord.Message,args=new String){
        // Main code
        // Since it's for only dev can use so...
        var opt = args.split(' ')[0]
        var msg = args.substring(opt.length+1,args.length);
        switch (opt) {
            case "add":{
                var gindex = message.client.welchannel.findIndex(g=>g.id==message.guild.id)
                if(gindex==-1) return message.channel.send("```This guild is not in database```")
                message.client.errmsg[gindex].list.push(msg)
                message.client.db.save().then(message.channel.send("Add error message: "+msg,{code:true}))
                break;
            }
            case "del":{
                var gindex = message.client.welchannel.findIndex(g=>g.id==message.guild.id)
                if(gindex==-1) return message.channel.send("```This guild is not in database```")
                try {
                    console.log(opt);
                    var deleted = message.client.errmsg[gindex].list.splice(parseInt(msg),1)
                    message.client.db.save().then(message.channel.send("Delete error message: "+deleted,{code:true}))
                } catch (error) {
                    console.log(error);
                }
                break
            }
            case "list":{
                var gindex = message.client.welchannel.findIndex(g=>g.id==message.guild.id)
                if(gindex==-1) return message.channel.send("```This guild is not in database```")
                message.channel.send(message.client.errmsg[gindex].list,{code:true})
                break
            }
            default:
                break;
        }
    }
}