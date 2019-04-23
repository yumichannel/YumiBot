module.exports = {
    info: {
        name: "hello",
        category: "general",
        description: "bot send hello to sender",
        nsfw: false,
        usage: "`prefix`hello",
        fusage: "",
        cooldown: 5
    },
    run(message,args){
        // Main code
        message.channel.send("hello "+message.member);
    }
}