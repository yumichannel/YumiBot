module.exports=function(message,args){
    const config = require('../model/config')
    const redis = require('redis').createClient(config.redis)
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
                redis.set(key,JSON.stringify(list),()=>message.channel.send("Added "+key+" to redis"))
                break;
            case "list":
                redis.keys("*",(e,r)=>console.log(r));
                break;
            case "delete":
                break
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