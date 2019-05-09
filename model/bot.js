const Discord = require('discord.js');
const fs = require('fs');
const loadCommand = require('../control/loadCommand.js');
const help = require('../control/help.js');
const access = require('../control/access.js');
const showCommands = require('../control/commandList.js');
const database = require('./Database.js');
module.exports = class Bot{
    constructor(config){
        this.client = new Discord.Client();
        this.client.commands = new Discord.Collection();
        this.cooldowns = new Discord.Collection();
        this.client.music = new Discord.Collection();
        this.client.lewd = (msg=new Discord.Message)=>{
            console.log(1);
            msg.channel.send(new Discord.RichEmbed().setTitle("NSFW").setImage('https://media1.tenor.com/images/b1b3e852ed8be4622f9812550beb8d88/tenor.gif'))
        }
        this.client.on('ready',async ()=>{
            loadCommand(this.client.commands)
            this.client.user.setActivity(`w/ ${config.prefix}help`,{
                url: "https://www.twitch.tv/yumi_channel",
                type: "STREAMING"
            })
            this.client.db = new database("model/Database.json");
            this.client.db.load().then(async status=>{
                this.client.prefix = await this.client.db.get('prefix')
                this.client.blacklist = await this.client.db.get('blacklist')
                this.client.errmsg = await this.client.db.get('errmsg')
                this.client.welchannel = await this.client.db.get('welchannel')
            }) 
            this.client.uptimes = new Date().toUTCString()
        })
        this.client.on('guildCreate',async guild=>{
            var channel = guild.channels.find(m => m.name=="bottest")
            if(channel){
                console.log(2);
                channel.send("Yumi is appeared! >.<").catch(err=>console.log(err))
            }
            var data = this.client.db.data
            for(let key in data){
                var guildIndex = data[key].findIndex(m=>m.id==guild.id)                
                if(guildIndex==-1){
                    data[key].push({
                        id: guild.id,
                        list: []
                    })
                    this.client.db.set(key,JSON.stringify(data[key])).then(m=>{
                        console.log(data[key]);
                    }).catch(err=>console.log(err))
                }
            }
            this.client.db.data = data
        })
        this.client.on('error',error=>{
            console.log(error)
        })
        this.client.on('disconnect',event=>{
            this.offline= new Date();
            console.log(this.offline)
        })
        this.client.on('guildMemberAdd',async member=>{
            var gindex = this.client.welchannel.findIndex(g=>g.id==member.guild.id)
            if(gindex==-1) return console.log("err1")
            var channel = member.guild.channels.find(c=>c.name==this.client.welchannel[gindex].list[0])
            if(channel==undefined) return console.log("No channel");   
            let grlist = await this.client.db.get('welcome')
            if(grlist.length>0){
                let index = grlist.findIndex(m=>m.id==member.guild.id)
                if(index!=-1){
                    if(grlist[index].list.length>0){
                        let index2 = Math.floor(Math.random()*grlist[index].list.length)
                        return channel.send(grlist[index].list[index2].replace("@user",`<@${member.id}>`))
                    }
                }
            }
            console.log(3);
            return channel.send(`Hello there, ${member}!`)
        })
        this.client.on('message', message=>{
            let channel = message.channel;
            let sender = message.member;
            let dprefix = config.prefix
            // check the sender
            if(message.author.bot) return;
            if(message.channel.type=="dm") return this.client.channels.get('533306452002209802').send(new Discord.RichEmbed()
            .setAuthor(message.author.username)
            .setDescription(message.content))

            // Display list of command
            if(message.content===dprefix+"help"){
                showCommands(new Discord.RichEmbed(),this.client.commands,channel);
                return;
            }
            // check prefix
            let index = this.client.prefix.findIndex(m=>m.id==message.guild.id)
            try {
                var prefix = this.client.prefix[index].list[0]
                if(prefix==undefined) prefix=dprefix
            } catch (error) {
                var prefix = dprefix
            }
            if(message.content==dprefix+"prefix") return message.channel.send("Your server prefix is `"+prefix+"`")
            if(!message.content.startsWith(prefix)){
                if(message.content!=config.prefix+"help"){
                    return;
                }
            }
            let content =  message.content.substr(prefix.length,message.content.length);
            let commandName = content.split(" ")[0];
            let args = content.substr(commandName.length+1,content.length);

            if(commandName=="access"){
                console.log(4);
                if(message.author.id!=config.ownerid) return message.channel.send("```Owner only command!```")
                access(message,args);
                return;
            }
            // Command not found
            if(!this.client.commands.has(commandName)){
                message.client.db.get('custom').then(data=>{
                    var index = data.findIndex(g=>g.id==message.guild.id)
                    if(index<0) return console.log("Guild id not found");

                    var tindex = data[index].list.findIndex(t=>t.name==commandName)
                    if(tindex<0){
                        let eindex = message.client.errmsg.findIndex(obj=>obj.id==message.guild.id)
                        let errmsg = message.client.errmsg[eindex].list
                        let ran = Math.floor(Math.random()*errmsg.length)
                        let msg = message.client.errmsg[eindex].list[ran].replace("@user",`**${message.member.nickname}**`)
                        return message.channel.send(msg)
                    }
                    console.log(5);
                    return message.channel.send(data[index].list[tindex].content)
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
                    if(command.info.category=="owner" && message.author.id!=process.env.owner){
                        console.log(6);
                        return message.channel.send("```You can't use this command!```");
                    }
                    if(command.info.nsfw && !message.channel.nsfw) return message.client.lewd(message);
                    if(command.info.ishide == false || command.info.ishide==undefined) command.run(message,args);
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