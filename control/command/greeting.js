const config = require('../../model/config')
module.exports={
    info:{
        name:"greeting",
        description:"Manage custom greeting message.",
        usage:"`prefix`greeting `add <message>`|`delete <index>`|`list`",
        fusage:"`message`: your custom message, use `@user` for mention new member\n"
        +"`index`: index of message. Check with `list` ",
        category:"admin",
        cooldown:5
    },
    async run(message,args){
        const option = args.split(" ")[0];
        var guilds;
        var index;

        guilds = await message.client.db.get('welcome');
        index = guilds.findIndex(m=>m.id==message.guild.id)
        if(index<0) return console.log("Guild id not found")
        switch (option) {
            case "list":
                var text;
                if(guilds[index].list.length==0){
                    text="This server doesn't have custom greeting message."
                }else{
                    text="";
                    for(let i=0;i<guilds[index].list.length;i++){
                        text+=`[${i}]  ${guilds[index].list[i]}\n`
                    }
                }
                message.channel.send(text,{code: "javascript"})
                break;
            case "add":
                const content = args.substring(4)
                if(content=="") return message.channel.send("Message is empty.")
                guilds[index].list.push(content);
                message.client.db.set('welcome',JSON.stringify(guilds)).then(m=>{
                    message.channel.send(`\`\`\`Added new greeting message: ${content}\`\`\``)
                })
                break;
            case "delete":
                const opt = args.substring(7)
                if(opt=="") return message.channel.send('\`\`\`Please select index of message or `-1` to delete all.\`\`\`')
                if(opt==-1){
                    guilds[index].list=[]
                    message.client.db.set("welcome",JSON.stringify(guilds)).then(m=>{
                        message.channel.send("\`\`\`Deleted all custom greeting message!\`\`\`")
                    })
                }else{
                    try {
                        if(isNaN(opt)){
                            return message.channel.send("\`\`\`Please select index of message or `-1` to delete all.\`\`\`")
                        }else{
                            guilds[index].list.splice(parseInt(opt),1)
                            message.client.db.set('welcome',JSON.stringify(guilds)).then(m=>{
                                message.channel.send("\`\`\`Deleted!\`\`\`")
                            })
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                break;
            default:
                break;
        }
    }
}