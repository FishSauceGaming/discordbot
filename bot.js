
var Discord = require('discord.js');
var logger = require('winston');
var auth = require('/home/colin/Desktop/discordbotjson/auth.json');
var twilio = require('/home/colin/Desktop/discordbotjson/twilio.json');
var savedNums = require('/home/colin/Desktop/discordbotjson/numbers.json');

const twilioAccountSid = twilio.sid;
const twilioAuthToken = twilio.token;
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
const disClient = new Discord.Client();

disClient.on('ready', () => {
 console.log(`Logged in as ${disClient.user.tag}!`);
 });

disClient.on('message', msg => {
    if (msg.content.substring(0, 1) === '!') {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                msg.reply('Pongo!');
            break;
            // !text
            case 'text':
                var num = getInput(args[0].toLowerCase);

                var msg1 = (num) ? 'Success.' : 'Failed to send message.';

                var textMessage = '';
                for(var i = 1; i<args.length;i++){
                    textMessage += args[i];
                    if(i!==args.length-1){
                        textMessage+=' ';
                    }
                }
                
                if(            
                twilioClient.messages
                .create({body: msg.author.username + ' in \'' + msg.guild.name + '\' says: ' + textMessage + '. Please do not reply to this message.', from: '+12019077471', to: '+1' + num})
                .then(message => console.log(message.sid))){
                    msg.reply(msg1 + ' Message sent by ' + msg.author.username + ' in \'' + msg.guild.name + '\'. ');   
                }else{
                    msg.reply('Failed to send message.');
            }
                break;
            // !call
            case 'call':
                var num = getInput(args[0].toLowerCase);

                var msg1 = (num) ? 'Success.' : 'Failed to send message.';

                
                var voiceMsg = '';
                for (var i = 1; i < args.length; i++) {
                    voiceMsg += args[i];
                    if (i !== args.length - 1) {
                        voiceMsg += ' ';
                    }
                }
                
                if(            
                    twilioClient.calls
                        .create({
                            url: 'http://fishsauce.serveminecraft.net/call.xml',
                            to: '+1' + num,
                            from: '+12019077471'
                        })
                        .then(call => console.log(call.sid))){
                    msg.reply(msg1 + ' Message sent by ' + msg.author.username + ' in \'' + msg.guild.name + '\'. ' + num);   
                }else{
                    msg.reply('Failed to send message.');
            }
                break;
            //!help
            case 'help':
                msg.reply("\n\t\t\t\tCommand List\n!text {name/number} {message}");

            break;
         }
     }
});
function getInput(data) {

    switch (data) {
        case 'josh':
            return savedNums.josh;
            break;
        case 'matthew':
            return savedNums.matthew;
            break;
        case 'caden':
            return savedNums.caden;
            break;
        case 'parker':
            return savedNums.parker;
            break;
        case 'colin':
            return savedNums.colin;
            break;
        case 'isaiah':
            return savedNums.isaiah;
            break;
        case 'will':
            return savedNums.will;
            break;
        default:
            if (data.length !== 10) {
                return data;
            } else if (data.length === 10 && !isNaN(data)) {
                return data;
            }
    }
    
}
disClient.login(auth.token);
