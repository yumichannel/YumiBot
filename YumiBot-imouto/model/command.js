module.exports = class Command{
    constructor(main,info){
        this.main= main;
        this.name = info.name;
        this.usage = info.usage || "";
        this.description = info.description || "";
        this.category = info.category || "uncategorized";
        this.nsfw = info.nsfw || false;
        this.help = ()=>{
            const Discord = require('discord.js');
            
        }
    }
}