const redisurl = require('../../model/config.js').redis
const Discord = require('discord.js');
const rdc = require('redis').createClient(redisurl);
module.exports = {
    info: {
        name: "custom",
        category: "admin",
        description: "Add custom chat command for your server. 10 is max.",
        nsfw: false,
        usage: "`prefix`custom `command` `text`",
        fusage: "`prefix`: your server prefix. Check `...prefix`\n"
        +"`command`: your command or `list` to show custom command list\n"
        +"`text`: your custom text, or leave it blank to delete command",
        cooldown: 0
    },
    run(message,cmd){
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
                rdc.get("custom",function(err,reply){
                    list = JSON.parse(reply.toString());
                    pos = list.findIndex(m=>m.id==guild.id);
                    let listname ="";
                    list[pos].list.forEach(m => {listname=listname + ", "+m.name});
                    listname=listname.substring(2);
                    if(listname.length<1){
                        channel.send("No custom command.");
                    }else{
                        channel.send("`"+listname+"`");
                    }
                }); 
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
                    return
                }
            }
            rdc.get("custom",function(err,reply){
                list = JSON.parse(reply.toString());
                let newc = {
                    name: arg1, 
                    content: arg2
                }
                pos = list.findIndex(m=>m.id==guild.id);
                let found = list[pos].list.findIndex(m=>m.name==newc.name)
                if(found==-1){
                    if(list[pos].list.length==10){
                        return channel.send("```Can't add more command!```")
                    }else{
                        list[pos].list.push(newc);
                        channel.send("`"+arg1+"` is added.");
                    }
                }else{
                    list[pos].list.splice(found,1,newc);
                    channel.send("`"+arg1+"` is modified.");
                }
                rdc.set("custom",JSON.stringify(list),()=>{});
            });
        }

        function del(){
            if(sender.id!=process.env.BOSS_ID){
                if(!message.member.permissions.has("ADMINISTRATOR")){
                    return
                }
            }
            rdc.get("custom",function(err,reply){
                list = JSON.parse(reply.toString());
                pos = list.findIndex(m=>m.id==guild.id)
                let found = list[pos].list.findIndex(m=>m.name==arg1);
                if(found==-1) return;
                list[pos].list.splice(found,1);
                rdc.set("custom",JSON.stringify(list),()=>{!
                    channel.send("`"+arg1+"` is deleted.");
                });
            });
        }
    }
}