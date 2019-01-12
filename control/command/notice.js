module.exports={
    info:{
        name:"notice",
        category:"owner"
    },
    run(message,args){
        var guilds = message.client.guilds.array()
        guilds.forEach(guild=>{
            var channel = guild.channels.find(c=>c.name=="bot-logs")
            if(!channel) return
            channel.send('```'+args+'```');
        })

    }
}