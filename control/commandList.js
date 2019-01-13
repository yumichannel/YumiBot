module.exports = function(embed,collection,channel){
    embed.setTitle("List of command")
    embed.setURL("http://youtube.com/c/YumiNightcoreFC")
    embed.setDescription("use `<prefix><commandname> help` for info.\nDefault prefix: `...`\nCheck your current prefix:`...prefix`")
    embed.setColor([color,color,color])
    const list = collection.array();
    var color = Math.floor(Math.random()*255);
    var categories = {}
    list.forEach(command => {
        if(command.info.category!="owner"){
            if(!categories[command.info.category]) categories[command.info.category]=[]
            categories[command.info.category].push(command.info.name)
        }
    });
    var index = 0;
    for(let category in categories){
        var namelist = categories[category].join(", ")
        embed.addField(category,namelist)
    }
    channel.send(embed);
}