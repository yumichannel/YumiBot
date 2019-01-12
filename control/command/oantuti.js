module.exports = {
    info:{
        name: "oantuti",
        category: "game",
        description: "you give a cut, bot will return cut,stone or paper",
        nsfw: false
    },
    run(message,args){
        var uwin =()=>{
            message.channel.send("You are lucky today. But I will beat you next time.")
        }
        var ulose =()=>{
            message.channel.send("Hah! You loser. Go home kidz.");
        }
        const list = ["kéo","búa","bao"]
        const filter = m=>m.author.id==message.author.id;
        const collector = message.channel.createMessageCollector(filter);
        message.channel.send("Senpai. Let's play oantuti.");
        collector.on('collect',m=>{
            if(m.content!="kéo" && m.content!="búa" && m.content!="bao"){
                message.channel.send("invalid answer! try again");
            }else{
                collector.stop();
            }
        })
        collector.on('end',m=>{
            var last = m.last();
            var choice = Math.floor(Math.random()*3);
            message.channel.send("I chose "+list[choice]+".")
            
            if(last == list[choice]){
                message.channel.send("No win no lose no pain.")
            }else{
                if(last=="kéo"){
                    if(list[choice]=="bao") uwin();
                    if(list[choice]=="búa") ulose();
                }
                if(last=="búa"){
                    if(list[choice]=="kéo") uwin();
                    if(list[choice]=="bao") ulose();
                }
                if(last=="bao"){
                    if(list[choice]=="búa") uwin();
                    if(list[choice]=="kéo") ulose();
                }
            }
        })
    }
}

