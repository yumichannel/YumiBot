const snek = require('snekfetch')
const Discord = require('discord.js')
module.exports = {
    info: {
        name: "yan",
        category: "image",
        description: "Find image on yande.re",
        nsfw: true,
        usage: "`prefix`yandere `option`",
        fusage:"`option`: `daily`,`weekly`,`monthly`,`yearly` or nothing for random or some keywords",
        ishide: false,
        cooldown: 1
    },
    run(message,args){
        // Main code
        const src = "https://yande.re/";
        var em = new Discord.RichEmbed();
        switch(args){
            case "daily":{
                snek.get(src+"post/popular_recent.json").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].sample_url;
                    em.setImage(imgurl)
                    em.setDescription(`[Full resolution](${result[ran].file_url})`)
                    message.channel.send(em)
                })
                break
            }
            case "weekly":{
                snek.get(src+"post/popular_recent.json?period=1w").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].sample_url;
                    em.setImage(imgurl)
                    em.setDescription(`[Full resolution](${result[ran].file_url})`)
                    message.channel.send(em)
                })
                break
            }
            case "monthly":{
                snek.get(src+"post/popular_recent.json?period=1m").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].sample_url;
                    em.setImage(imgurl)
                    em.setDescription(`[Full resolution](${result[ran].file_url})`)
                    message.channel.send(em)
                })
                break
            }
            case "yearly":{
                snek.get(src+"post/popular_recent.json?period=1y").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].sample_url;
                    em.setImage(imgurl)
                    em.setDescription(`[Full resolution](${result[ran].file_url})`)
                    message.channel.send(em)
                })
                break
            }
            case "":{
                snek.get(src+"post.json?tags=order%3Arandom").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].sample_url;
                    em.setImage(imgurl)
                    em.setDescription(`[Full resolution](${result[ran].file_url})`)
                    message.channel.send(em)
                })
                break
            }
            default:{
                let tag = args
                snek.get(src+"post.json?tags="+encodeURI(tag)).then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].sample_url;
                    em.setImage(imgurl)
                    em.setDescription(`[Full resolution](${result[ran].file_url})`)
                    message.channel.send(em)
                })
            }
        }
    }
}