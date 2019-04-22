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
        var key
        switch (option[0]) {
            case "add":
                key = option[1];
                var guilds = message.client.guilds.array();
                var list = []
                guilds.forEach(m => {
                    list.push({
                        id: m.id,
                        list: []
                    })
                });
                message.client.db.set(key,JSON.stringify(list)).then(message.channel.send("Added "+key+" to database"))
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
                break
            case "info":
                break
            case "f5":
                key = option[1]
                if(message.client.db.data[key]==undefined){
                    return console.log(key+ " not found")
                }
                let status = 0
                message.client.db.get(key).then(data=>{
                    message.client.guilds.forEach(g=>{
                        if(data.findIndex(m=>m.id==g.id)<0){
                            data.push({
                                id: g.id,
                                list: []
                            })
                            status = 1
                        }
                    })
                    if(status==1){
                        message.client.db.set(key,JSON.stringify(data)).then(m=>{
                            console.log(key+" updated!")
                        })
                    }else{
                        console.log(key+" not changed!")
                    }
                }).catch(err=>console.log(err))
                break
            default:
                
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