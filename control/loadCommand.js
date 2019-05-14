const fs = require('fs');
const type = require('../model/config.js').cmdType;
module.exports = function(commands){
    type.forEach(t=>{
        var dir = `control/command/${t}`;
        const commandFiles = fs.readdirSync(dir).filter(file=>file.endsWith('.js'));
        for(const file of commandFiles){
            var command = require(`../${dir}/${file}`);
            command.info.category = t
            commands.set(command.info.name,command);
            console.log("loaded "+command.info.name);
        }
    })
    // console.log("load commands successful");
}