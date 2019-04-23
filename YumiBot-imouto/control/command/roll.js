module.exports={
    info:{
        name:"roll",
        description:"random a selection",
        usage:"`prefix`roll <opt1>-<opt2>-...-<optN>",
        nfsw:false,
        category:"general"
    },
    run(message,args){
        if(args=="") return message.channel.send("No option provided");
        var option = args.split("-");
        var num = Math.floor(Math.random()*option.length);
        message.channel.send("```"+option[num]+"```")
    }
}