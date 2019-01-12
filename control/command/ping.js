const cmd =  require('child_process')
module.exports={
    info:{
        name:"ping",
        category:"general",
        cooldown:0,
        description:"ping pong",
        nsfw:false
    },
    run(message,args){
        // cmd.exec("ping steamcommunity.com",(error,stdout,stderr)=>{
        //     message.channel.send(stdout)
        // })
        message.channel.send("pong!")
    }
}  