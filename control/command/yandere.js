const snek = require('snekfetch')
const Discord = require('discord.js')
module.exports = {
    info: {
        name: "yandere",
        category: "image",
        description: "Find image on yande.re",
        nsfw: false,
        usage: "",
        fusage:"",
        ishide: false,
        cooldown: 1
    },
    run(message,args){
        // Main code
        const src = "https://yande.re/";
        switch(args){
            case "daily":{
                snek.get(src+"post/popular_recent.json").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].file_url;
                    snek.get(imgurl).then(res=>{
                        message.channel.send(new Discord.Attachment(res.body))
                    })
                })
                break
            }
            case "weekly":{
                snek.get(src+"post/popular_recent.json?period=1w").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].file_url;
                    snek.get(imgurl).then(res=>{
                        message.channel.send(new Discord.Attachment(res.body))
                    })
                })
                break
            }
            case "monthly":{
                snek.get(src+"post/popular_recent.json?period=1m").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].file_url;
                    snek.get(imgurl).then(res=>{
                        message.channel.send(new Discord.Attachment(res.body))
                    })
                })
                break
            }
            case "yearly":{
                snek.get(src+"post/popular_recent.json?period=1y").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].file_url;
                    snek.get(imgurl).then(res=>{
                        message.channel.send(new Discord.Attachment(res.body))
                    })
                })
                break
            }
            case "":{
                snek.get(src+"post.json?tags=order%3Arandom").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].file_url;
                    snek.get(imgurl).then(res=>{
                        message.channel.send(new Discord.Attachment(res.body))
                    })
                })
                break
            }
            default:{
                let tag = args
                snek.get(src+"post.json?tags="+encodeURI(tag)).then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].file_url;
                    snek.get(imgurl).then(res=>{
                        message.channel.send(new Discord.Attachment(res.body))
                    })
                })
            }
        }
    }
}