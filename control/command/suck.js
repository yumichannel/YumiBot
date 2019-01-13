const Canvas = require('canvas');
const Discord = require('discord.js');
module.exports={
    info:{
        name: "suck",
        description:"SUCK!",
        nsfw:false,
        usage: "`prefix`suck <@somebody>",
        category:"image"
    },
    async run(message,args){
        let mt = message.mentions.members.first().displayName;
        if(mt === null){
            message.channel.send(">_< you must tag someone, senpai!")
            console.log(mt);
            return;
        }
        let text = `${mt} succ`
        const img = await Canvas.loadImage("./image/hamlon.png")

        let canvas = Canvas.createCanvas(img.width,img.height)
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)

        ctx.font = '30px arial';
        ctx.fillStyle = 'rgba(255,255,255,1)'
        let len = ctx.measureText(text).width;
        ctx.fillText(text, (img.width-len)/2 , 225);
        
        var buf = canvas.toBuffer();

        message.channel.send(new Discord.Attachment(buf,"image.png"))
    }
}