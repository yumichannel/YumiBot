const Canvas = require('canvas')
const snekfetch = require('snekfetch')
const Gif = require('gifencoder')
const Discord = require('discord.js')
module.exports = {
    info: {
        name: "spin",
        category: "image",
        description: "Spin you 360 degree",
        nsfw: false,
        usage: "`prefix`spin <orTagSomeone>",
        fusage:"`orTagSomeone`: just mention a person and they will spin :keke:"
    },
    async run(message,args){
        // Main code
        if(args==""){
            const {body:buffer} = await snekfetch.get(message.author.displayAvatarURL.replace('=2048','=256'));
            var avatar = await Canvas.loadImage(buffer)
        }else{
            const {body:buffer2} = await snekfetch.get(message.mentions.members.first().user.displayAvatarURL.replace("=2048","=256"));
            var avatar = await Canvas.loadImage(buffer2)
        }
        
        var canvas = Canvas.createCanvas(200,200);
        var context = canvas.getContext('2d')
        var encoder = new Gif(200,200)
        var radius = 0;
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(50);
        encoder.setQuality(5);
        context.translate(100, 100);
        while(radius<10){
            context.rotate(radius);
            context.drawImage(avatar, -150, -150, 300, 300);
            encoder.addFrame(context)
            radius+=0.2
        }
        encoder.finish();
        var buf = encoder.out.getData();
        message.channel.send(new Discord.Attachment(buf,"image.gif"));
    }
}