const Discord = require('discord.js');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

module.exports={
    info:{
        name:"profile",
        category:"image",
        nsfw:false,
        description:"show your profile",
        usage:"`prefix`watashi",
        ishide: true,
        cooldown: 2
    },
    async run(message,args){
        return message.channel.send("This feature is coming soon",{code:true})
        var uid = message.author.id


        const {body: buffer} = await snekfetch.get(user.user.displayAvatarURL.replace("=2048","=256"));
        const avatar = await Canvas.loadImage(buffer)
        const background = await Canvas.loadImage('./image/abc.jpg')
        const canvas = Canvas.createCanvas(500,250);
        const context = canvas.getContext('2d');

        // Draw background
        context.drawImage(background,0,0,500,250)
        context.globalAlpha=0.75;
        context.fillStyle=user.displayHexColor;
        context.fillRect(0,0,500,250);
        context.globalAlpha=1;

        // Draw circle avatar
        context.save();
        context.beginPath();
        context.arc(130, 130, 100,0, Math.PI,true);
        context.arc(130, 130, 100,0, Math.PI,false);
        context.closePath();
        context.clip();
        context.drawImage(avatar,30,30,200,200);
        context.restore();
        
        // Draw 
        context.font='20px sans-serif';
        context.fillStyle='#ffffff';
        context.fillText(user.displayName, 250, 125);
        
        

        const attachment = new Discord.Attachment(canvas.toBuffer(),"image.png");
        message.channel.send(attachment).then(m=>m.delete(10000))
    
    }
}