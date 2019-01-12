const Discord = require('discord.js');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

module.exports={
    info:{
        name:"profile",
        category:"image",
        nsfw:false,
        description:"show your profile",
        usage:"`...profile` or `...profile <@user>`"
    },
    async run(message,args){
        var uid;
        if(args==""){
            uid = message.author.id;
        }else{
            if(args.startsWith("<@!")) uid = args.substring(3,args.length-1);
            else if(args.startsWith("<@")) uid = args.substring(2,args.length-1);
            else return message.channel.send("no user provided.");
        }
        var user = message.guild.members.get(uid);


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