
module.exports = {
    info: {
        name: "ban",
        category: "admin",
        description: "Ban someone",
        nsfw: false,
        usage: "`prefix`ban <@users>",
        fusage:"`@users`: mentioned users\n`reason`: reason why they're banned",
        ishide: false
    },
    run(message,args){
        // Main code
        if(!message.member.permissions.has("ADMINISTRATOR")) return;
        if(args=="list"){
            message.guild.fetchBans().then(bans=>{
                if(bans.size==0){
                    message.channel.send("Banned: 0",{code:true});
                    return;
                }
            })
        }
        if(message.mentions.members.size!=0){
            var list = message.mentions.members;
            const filter = m=>m.author.id==message.author.id&&m.content.startsWith("R:");
            const collector = message.channel.createMessageCollector(filter,{time:20000});
            message.channel.send("```What's reason? Close in 20s```").delete(20000);
            collector.on('collect',m=>{
                var reason = m.content.replace("R:","Banned reason:");
                list.forEach(mm=>mm.send("```You're banned. "+reason+"```"))
                collector.stop();
            })
            collector.on('end',()=>{
                message.channel.send('Banned successful!`')
            })
        }
    }
}