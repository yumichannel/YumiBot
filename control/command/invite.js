module.exports = {
    info: {
        name: "invite",
        category: "bot",
        description: "get invite link to the guild",
        nsfw: false,
        usage: "`prefix`invite"
    },
    async run(message,args){
        // Main code
        if(message.guild.members.get(message.client.user.id).hasPermission("CREATE_INSTANT_INVITE")){
            var link=await message.channel.createInvite()
            return message.channel.send(link.url)
        }else{
            return message.channel.send("```Can't get invite```")
        }
    }
}