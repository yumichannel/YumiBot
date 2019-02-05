module.exports=function(message,args){
    const config = require('../model/config')
    var mode = args.split(" ")[0]
    let option = args.substring(mode.length+1);
    if(mode=="eval"){
        _eval(option);
    }
    if(mode=="redis"){
        _redis(option);
    }

    function _redis(option) {
        option = option.split(" ");
        switch (option[0]) {
            case "add":
                let key = option[1];
                var guilds = message.client.guilds.array();
                var list = []
                guilds.forEach(m => {
                    list.push({
                        id: m.id,
                        list: []
                    })
                });
                message.client.db.set(key,JSON.stringify(list),()=>message.channel.send("Added "+key+" to redis"))
                break;
            case "list":
                if(!option[1]){
                    let temp = []
                    for(let key in message.client.db.data){
                        temp.push(key)
                    }
                    message.channel.send(temp.join(", "),{code:true})
                }else{
                    message.client.db.get(option[1]).then(data=>{
                        message.channel.send(data,{code:true})
                    }).catch(err=>{
                        console.log(err)
                    })
                }
                
                break;
            case "delete":
                message.client.db.client;
                break
            case "info":
                break
            case "f5":
                // let key = option[1]
                // message.client.db.get(key).then(data=>{
                //     var guilds = 
                // })
            default:
                redis.get(args,(err,rep)=>{
                    console.log(JSON.parse(rep))
                })
                break;
        }
    }

    function _eval(text) {
        try {
            let ev = eval(text)
            if(typeof ev !== 'string'){
                ev = require('util').inspect(ev)
            }
            let inp = '```javascript\n'+text+'```'
            let outp =  '```'+ev+'```'
            message.channel.send(`input\n${inp}\noutput\n${outp}`)
        } catch (error) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(error)}\n\`\`\``);
        }
    }

    function clean(text) {
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
    
}