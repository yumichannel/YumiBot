const fs = require('fs');
module.exports = function(commands){
    const commandFiles = fs.readdirSync('control/command').filter(file=>file.endsWith('.js'));
    for(const file of commandFiles){
        const command = require(`../control/command/${file}`);
        commands.set(command.info.name,command);
        console.log("loaded "+command.info.name);
    }
    console.log("load commands successful");
}