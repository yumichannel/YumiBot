module.exports = {
    info:{
        name:"flip",
        description:"flip a coin",
        category:"general",
        usage:"`prefix`flip",
        nsfw:false,
        cooldown:5
    },
    run(message,args){
        let text = Math.floor(Math.random()*1)==1?'`Heads`':'`Tails`';
        message.channel.send(text)
    }
}