const Discord = require('discord.js');
const snekfetch = require('snekfetch');
module.exports={
    info:{
        name:"neko",
        category:"image",
        usage:"non-lewd: `prefix`neko\nlewd: `prefix`neko lewd",
        description:"Send a neko girl picture",
        cooldown:10
    },
    run(message,args){
        var src = 'https://nekos.life/'
        var lewd = false
        var tag = ""
        if(args==='lewd'){
            lewd=true
            tag='lewd'
        }
        if(lewd && message.channel.nsfw===false){
            message.channel.send('( ͡° ͜ʖ ͡°) Please go to `NSFW` place')
            return
        }else{
            snekfetch.get(src+tag).then(m=>{
                var body = m.body.toString();
                let strindex = body.split('"')
                let ans = strindex.find(n=>{
                    if(lewd){
                        return n.indexOf('https://cdn.nekos.life/lewd')===0
                    }else{
                        return n.indexOf('https://cdn.nekos.life/neko')===0
                    }
                })
                message.channel.send(new Discord.RichEmbed().setImage(ans))
            })
        }
    }
}