const Canvas = require('canvas')
const snekfetch = require('snekfetch')
const Gif = require('gifencoder')
const Discord = require('discord.js')
module.exports = {
    info: {
        name: "spinme",
        category: "image",
        description: "Spin you 360 degree",
        nsfw: false,
        usage: "",
        fusage:""
    },
    async run(message,args){
        // Main code
        var {buffer} = await snekfetch.get(message.author.displayAvatarURL.replace('=2048','=256'));
        var avatar = await Canvas.loadImage(buffer)
        var canvas = Canvas.createCanvas('200','200');
        var context = canvas.getContext('2d')
        var encoder = new Gif(200,200)
        var radius = 0;
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(50);
        encoder.setQuality(5);

        context.translate(100, 100);
        while(radius<1){
            context.rotate(radius);
            context.drawImage(avatar, -100, -100, 200, 200);
            encoder.addFrame(context)
        }
        encoder.finish();
        var buf = encoder.out.getData();
        message.channel.send(new Discord.Attachment(buf,"image.gif"));
    }
}