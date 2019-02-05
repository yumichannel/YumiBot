const load = require('../loadCommand.js');
const Discord = require('discord.js')
module.exports = {
    info:{
        name:"reload",
        category:"uncategory",
        description:"Reload commands",
        category:"owner"
    },
    run(message,args){
        message.client.commands.array().forEach(element => {
            delete require.cache[require.resolve(`../command/${element.info.name}.js`)]
            message.client.commands.delete(element.info.name);
        });
        load(message.client.commands)
        message.channel.send("loaded commands")
    }
}