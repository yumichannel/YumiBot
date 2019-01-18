const Discord = require('discord.js');
const fs = require('fs');
const loadCommand = require('../control/loadCommand.js');
const help = require('../control/help.js');
const access = require('../control/access.js');
const showCommands = require('../control/commandList.js');
module.exports = class Bot{
    constructor(config){
        this.client = new Discord.Client();
        this.client.commands = new Discord.Collection();
        this.cooldowns = new Discord.Collection();
        this.client.music = new Discord.Collection();
        this.client.redis = require('redis').createClient(config.redis)
        this.client.on('ready',()=>{
            loadCommand(this.client.commands)
            this.client.redis.get("prefix",(err,rep)=>{
                this.client.prefixlist = JSON.parse(rep)
            })
            var date = new Date()
            this.client.uptimes = `${date.getUTCHours()<10?"0"+date.getUTCHours():date.getUTCHours()}:${date.getUTCMinutes()<10?"0"+date.getUTCMinutes():date.getUTCMinutes()}:${date.getUTCSeconds()<10?"0"+date.getUTCSeconds():date.getUTCSeconds()} UTC`
        })
        this.client.on('guildCreate',guild=>{
            try {
                var channel = guild.channels.find(m => m.name=="bottest");
                channel.send("");
            } catch (error) {
                
            }
        })
        this.client.on('error',error=>{
            console.log(error)
        })
        this.client.on('disconnect',event=>{
            this.offline= new Date();
            console.log(this.offline)
        })
        this.client.on('guildMemberAdd',member=>{
            var channel = member.guild.channels.find(c=>c.type=="text"&&c.permissionsFor(member.guild.me).has("SEND_MESSAGES"))
            if(channel==undefined) return
            this.client.redis.get("welcome",(err,reply)=>{
                let list = JSON.parse(reply.toString());
                let pos = list.findIndex(m=>m.id==guild.id)
                if(pos==-1) return
                let num = list[pos].list.length
                if(num<1){
                    return channel.send(`Have a great day, ${member} senpai`);
                }else{
                    num = Math.floor(Math.random()*num);
                    let x = list[pos].list[num].replace("@user",`<@${member.id}>`);
                    channel.send(x);
                }
            });

        })
        this.client.on('message', message=>{
            let channel = message.channel;
            let sender = message.member;
            let dprefix = "..."
            // check the sender
            if(message.author.bot) return;
            if(message.channel.type=="dm") return this.client.channels.get('533306452002209802').send(new Discord.RichEmbed()
            .setAuthor(message.author.username)
            .setDescription(message.content))
            // check prefix
            let index = this.client.prefixlist.findIndex(m=>m.id==message.guild.id)
            try {
                var prefix = this.client.prefixlist[index].list[0]
            } catch (error) {
                var prefix = dprefix
            }
            if(message.content==dprefix+"prefix") return message.channel.send("Your server prefix is `"+prefix+"`")
            if(!message.content.startsWith(prefix)) return;
            let content =  message.content.substr(prefix.length,message.content.length);
            let commandName = content.split(" ")[0];
            let args = content.substr(commandName.length+1,content.length);
            // Display list of command
            if(commandName=="help"){
                showCommands(new Discord.RichEmbed(),this.client.commands,channel);
                return;
            }

            if(commandName=="access"){
                if(message.author.id!=config.ownerid) return message.channel.send("```Owner only command!```")
                access(message,args);
                return;
            }
            // Command not found
            if(!this.client.commands.has(commandName)){
                this.client.redis.get("custom",(err,rep)=>{
                    var guilds = JSON.parse(rep);
                    try {
                        var text = guilds.find(m=>m.id==message.guild.id).list.find(m=>m.name==commandName).content
                        message.channel.send(text)
                    } catch (error) {
                        channel.send("command not found",{code:"javascript"})
                    }
                })
                return
            }
            const command = this.client.commands.get(commandName);
            if(args=="help"){
                // Need help?
                help(new Discord.RichEmbed(),channel,command.info);
            }else{
                // Or do it?
                if(!this.cooldowns.has(commandName)){
                    this.cooldowns.set(commandName,new Discord.Collection())
                }
                const now = Date.now();
                const timestamp = this.cooldowns.get(commandName);
                const cdTime = (command.info.cooldown || 5)*1000;
                if(timestamp.has(message.author.id)){
                    const expTime = timestamp.get(message.author.id) + cdTime;
                    if(now < expTime){
                        channel.send(`${message.member} you must wait ${parseInt((expTime-now)/1000)}s`)
                        return
                    }
                }
                timestamp.set(message.author.id,now);
                setTimeout(() => {
                    timestamp.delete(message.author.id)
                }, cdTime);  

                try {
                    command.run(message,args);
                } catch (error) {
                    console.log(error);
                }
            } 
        })
        // Must login
        this.client.login(config.token);
        process.on('unhandledRejection',error=>console.log(error))
    }
}