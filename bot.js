
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
                msg.reply('Pong!');
            break;
            // !text
            case 'text':
                var num = getInput(args[0]);
                var msg1 = (num) ? 'Success.' : 'Failed to send message.';

                textMessage = getMsg(args,1);
                
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
                var num = getInput(args[0]);
                var msg1 = (num) ? 'Success.' : 'Failed to send message.';
 

                createMsgXML(msg.author.username, getMsg(args, 1));
                console.log('fishsaucey.com/callmessages/' + msg.author.username + 'call.xml');
                if(            
                    twilioClient.calls
                        .create({
                            url: ('http://fishsaucey.com/callmessages/' + msg.author.username + 'call.xml'),
                            to: '+1' + num,
                            from: '+12019077471'
                        })
                        .then(call => console.log(call.sid))) {
                    if (msg1) {
                        msg.reply(msg1 + ' Message sent by ' + msg.author.username + ' in \'' + msg.guild.name + '\'. ');  
                    }
                }else{
                    msg.reply('Failed to send message.');
                }
                break;
            case 'linkcall':
                var num = getInput(args[0]);
                var msg1 = (num) ? 'Success.' : 'Failed to send message.';


                createLinkXML(msg.author.username, getMsg(args, 1));
                console.log('fishsaucey.com/callmessages/' + msg.author.username + 'call.xml');
                if (
                    twilioClient.calls
                        .create({
                            url: ('http://fishsaucey.com/callmessages/' + msg.author.username + 'call.xml'),
                            to: '+1' + num,
                            from: '+12019077471'
                        })
                        .then(call => console.log(call.sid))) {
                    if (msg1) {
                        msg.reply(msg1 + ' Message sent by ' + msg.author.username + ' in \'' + msg.guild.name + '\'. ');
                    }
                } else {
                    msg.reply('Failed to send message.');
                }
                break;
            //!help
            case 'help':
                msg.reply("\n\t\t\t\tCommand List\n!text {name/number} {message}\n!call {number/name} {message}");
                break;
            //!xml
            case 'xml':
                createMsgXML(msg.author.username, getMsg(args, 1));
                break;
         }
     }
});

function getMsg(args, start) {
    var textMessage = '';
    for (var i = start; i < args.length; i++) {
        textMessage += args[i];
        if (i !== args.length - 1) {
            textMessage += ' ';
        }
    }
    return textMessage;
}

function getInput(data) {
    if (!data) {
        return;
    }
    var nums = data.toLowerCase();

    switch (nums) {
        case 'josh':
            return savedNums.josh;
        case 'matthew':
            return savedNums.matthew;
        case 'caden':
            return savedNums.caden;
        case 'parker':
            return savedNums.parker;
        case 'colin':
            return savedNums.colin;
        case 'isaiah':
            return savedNums.isaiah;
        case 'will':
            return savedNums.will;
        default:
            if (data.length !== 10) {
                return 0;
            } else if (data.length === 10 && !isNaN(data)) {
                return data;
            }
    }
    
}

function createLinkXML(user, link) {
    link = link.replace("https", "http");
    var fs = require('fs');
    fs.writeFile('/var/www/html/callmessages/' + user + 'call.xml', '<Response>\n\t<Start>\n\t\t<Stream url="' + link + '">\n\t</Start>\n</Response>', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

function createMsgXML(user, message) {
    var fs = require('fs');
    fs.writeFile('/var/www/html/callmessages/' + user + 'call.xml', '<Response>\n\t<Say loop="2" voice="alice">' + 'This is a call from '+ user + ' using BotSauce. ' + message + '. The message has been concluded.'+'</Say>\n</Response>', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}
disClient.login(auth.token);
