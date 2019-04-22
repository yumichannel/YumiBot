module.exports={
    info:{
        name: "prefix",
        description: "Set custom prefix for your server",
        usage: "`prefix`prefix <newprefix>",
        category:"admin",
        fusage:"`newprefix` is your custom prefix.\n"+
        "*!!!Don't use the prefix that used by other bots*",
        cooldown:1
    },
    async run(message,args){
        if(message.author.id!=process.env.owner){
            if(!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Admin only!")
        }
        if(args=="") return message.channel.send("```Not a valid prefix.```")
        var data = await message.client.db.get('prefix')
        var gindex =  data.findIndex(m=>m.id==message.guild.id);
        if(gindex==-1){
            console.log("Guild not found!")
        }else{
            if(data[gindex].list.length==0){
                data[gindex].list.push(args)
            }else{
                data[gindex].list[0] = args
            }
        }
        message.client.prefixlist = data
        message.client.db.set('prefix',JSON.stringify(data)).then(status=>{
            if(status==1){
                message.channel.send(`Server prefix changed to \`${args}\``)
            }else{
                message.channel.send('```Can not change prefix.```')
            }
            
        })
    }
}