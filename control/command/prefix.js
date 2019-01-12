const config = require('../../model/config')
const redis = require('redis').createClient(config.redis)
module.exports={
    info:{
        name: "prefix",
        description: "Set custom prefix for your server",
        usage: "`prefix`prefix <newprefix>",
        category:"admin",
        fusage:"`newprefix` is your custom prefix. Be sure that no bot is using that prefix."
    },
    run(message,args){
        if(!message.member.permissions.has("ADMINISTRATOR")) return
        if(args=="") return message.channel.send("```Not a valid prefix.```")
        redis.get("prefix",(err,rep)=>{
            var guilds = JSON.parse(rep);
            var index =  guilds.findIndex(m=>m.id==message.guild.id);
            if(guilds[index].list.length==0){
                guilds[index].list.push(args);
            }else{
                guilds[index].list[0]= args
            }
            message.client.prefixlist = guilds
            redis.set("prefix",JSON.stringify(guilds),()=>message.channel.send("Your custom prefix is: `"+args+"`"));
        })
    }
}