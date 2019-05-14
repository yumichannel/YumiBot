module.exports = {
    info: {
        name: "activity",
        category: "owner"
    },
    run(message,args){
        // Main code
        if(message.author.id!="201912139240308736") return;
        const filter = m=>m.author.id==message.author.id;
        const collector = message.channel.createMessageCollector(filter,{max:2});
        collector.on('collect',m=>{
            console.log("Collected: "+m.content);
        })
        collector.on("end",m=>{
            var res = [];
            m.forEach(element => {
                res.push(element.content);
            });
            if(res[0]=="streaming"){
                message.client.user.setStatus("streaming")
                .catch(console.error)
            }
            message.client.user.setActivity(res[1],{    
                url: "https://www.twitch.tv/yumi_channel",
                type: res[0]
            }).then(message.channel.send("Change activity completed!"));
        })
    }
}