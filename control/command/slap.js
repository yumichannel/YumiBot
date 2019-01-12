const Canvas = require('canvas')
const fs= require('fs')
const snekfetch = require('snekfetch')
const Discord = require('discord.js')

module.exports={
    info:{
        name:"slap",
        description:"slap someone",
        usage:"",
        category:"image"
    },
    async run(message,args){
        const {body:buffer1} = await snekfetch.get(message.author.displayAvatarURL.replace("=2048","=256"));
        const slapper = await Canvas.loadImage(buffer1)
        const {body:buffer2} = await snekfetch.get(message.mentions.members.first().user.displayAvatarURL.replace("=2048","=256"));
        const slapped = await Canvas.loadImage(buffer2)
        const bg = await Canvas.loadImage('./image/slap.jpg')
        var canvas = Canvas.createCanvas(400,400)
        var context = canvas.getContext('2d')
        context.drawImage(bg, 0, 0, 400, 400);
        context.drawImage(slapped, 235, 165, 125, 125);
        
        var buff = canvas.toBuffer()
        message.channel.send(new Discord.Attachment(buff,"slap.jpg"))
    }
}