const config = require('../../model/config')
const redis = require('redis').createClient(config.redis)
module.exports={
    info:{
        name:"greeting",
        description:"Manage custom greeting message.",
        usage:"`prefix`greeting `add <message>`|`delete <index>`|`list`",
        fusage:"`message`: your custom message, use `@user` for mention new member\n"
        +"`index`: index of message. Check with `list` ",
        category:"admin"
    },
    run(message,args){
        const option = args.split(" ")[0];
        var guilds;
        var index;
        var found;
        redis.get("welcome",(err,res)=>{
            guilds = JSON.parse(res);
            index = guilds.findIndex(m=>m.id==message.guild.id)
            found = guilds[index]
            switch (option) {
                case "list":
                    var text;
                    if(found.list.length==0){
                        text="This server doesn't have custom greeting message."
                    }else{
                        text="";
                        for(let i=0;i<found.list.length;i++){
                            text+=`[${i}]  ${found.list[i]}\n`
                        }
                    }
                    message.channel.send(text,{code: "javascript"})
                    break;
                case "add":
                    const content = args.substring(4)
                    if(content=="") return message.channel.send("Message is empty.")
                    guilds[index].list.push(content);
                    redis.set("welcome",JSON.stringify(guilds),()=>message.channel.send(`\`\`\`Added new greeting message: ${content}\`\`\``))
                    break;
                case "delete":
                    const opt = args.substring(7)
                    if(opt=="") return message.channel.send('\`\`\`Please select index of message or `-1` to delete all.\`\`\`')
                    if(opt==-1){
                        guilds[index].list=[]
                        redis.set("welcome",JSON.stringify(guilds),()=>message.channel.send("\`\`\`Deleted all custom greeting message!\`\`\`"))
                    }else{
                        try {
                            if(isNaN(opt)){
                                return message.channel.send("\`\`\`Please select index of message or `-1` to delete all.\`\`\`")
                            }else{
                                guilds[index].list.splice(parseInt(opt),1)
                                redis.set("welcome",JSON.stringify(guilds),()=>message.channel.send("\`\`\`Deleted!\`\`\`"))
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    break;
                default:
                    break;
            }
        })
        
    }
}