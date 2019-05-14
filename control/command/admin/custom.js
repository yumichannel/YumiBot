const redisurl = require('../../../model/config.js').redis
const Discord = require('discord.js');
module.exports = {
    info: {
        name: "custom",
        category: "admin",
        description: "Add custom chat command for your server. 10 is max.",
        nsfw: false,
        usage: "`prefix`custom `command` `text`",
        fusage: "`command`: your command or `list` to show custom command list\n"
        +"`text`: your custom text, or leave it blank to delete command",
        cooldown:5
    },
    async run(message,cmd){
        // Main code
        var list =[];
        var arg1 = cmd.split(" ")[0];
        var arg2 = cmd.substring(arg1.length+1);
        var sender = message.author;
        var guild = message.guild;
        var channel = message.channel;
        var global = message.client.commands
        if(global.array().find(m=>m.info.name===arg1)) return channel.send("```This custom command name is not allow```")
        switch(arg1){
            case "list":
                message.client.db.get('custom').then(list=>{
                    pos = list.findIndex(m=>m.id==guild.id);
                    if(pos<0) return console.log("Guild id not found")
                    let listname =[];
                    if(list[pos].list.length<1){
                        channel.send("No custom command.");
                    }else{
                        list[pos].list.forEach(m=>listname.push(m.name))
                        channel.send("`"+listname.join(", ")+"`");
                    }
                })
                return;
            default:
                if(arg2.length <1){
                    del();
                }else{
                    set();
                }
        }

        function set(){
            if(sender.id!=process.env.BOSS_ID){
                if(!message.member.permissions.has("ADMINISTRATOR")){
                    return console.log("Required Admin permission")
                }
            }
            message.client.db.get('custom').then(list=>{
                let newc = {
                    name: arg1, 
                    content: arg2
                }
                pos = list.findIndex(m=>m.id==guild.id);
                if(pos<0) return console.log("Guild id not found")
                let found = list[pos].list.findIndex(m=>m.name==newc.name)
                if(found==-1){
                    if(list[pos].list.length>9){
                        return channel.send("```Can't add more command!```")
                    }else{
                        list[pos].list.push(newc);
                        channel.send("`"+arg1+"` is added.")
                    }
                }else{
                    list[pos].list.splice(found,1,newc);
                    channel.send("`"+arg1+"` is modified.")
                }
                message.client.db.set('custom',JSON.stringify(list)).then(m=>{
                    message.client.db.data['custom'] = list
                    console.log("Updated custom command data")
                })
            })
        }

        function del(){
            if(sender.id!=process.env.BOSS_ID){
                if(!message.member.permissions.has("ADMINISTRATOR")){
                    return console.log("Required Admin permission")
                }
            }
            message.client.db.get('custom').then(list=>{
                pos = list.findIndex(m=>m.id==guild.id)
                if(pos<0) return console.log("Guild id not found")
                let found = list[pos].list.findIndex(m=>m.name==arg1);
                if(found<0) return console.log("custom command not found");
                list[pos].list.splice(found,1);
                channel.send("`"+arg1+"` is deleted.");
                message.client.db.set('custom',JSON.stringify(list)).then(m=>{
                    message.client.db.data['custom'] = list
                    console.log("Updated custom command data")
                })
            })
        }
    }
}