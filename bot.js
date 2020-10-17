var Discord = require('discord.js');
var logger = require('winston');
const { RandomReddit } = require('random-reddit');
var redditAuth = require('/home/colin/Desktop/discordbotjson/reddit.json');
var auth = require('/home/colin/Desktop/discordbotjson/auth.json');
var twilio = require('/home/colin/Desktop/discordbotjson/twilio.json');
var savedNums = require('/home/colin/Desktop/discordbotjson/numbers.json');
var discIds = require('/home/colin/Desktop/discordbotjson/discIds.json');
var fs = require('fs');

var numsToEmoji = {'1' : ":one:",'2' : ":two:", '3' : ":three:", '4' : ":four:", '5' : ":five:", '6' : ":six:", '7' : ":seven:", '8' : ":eight:", '9' : ":nine:", '0' : ":zero:"}

const thomas = ['churchofmaisakurajima', 'mikokuro', 'wholesomeyuri', 'goodanimemes']
const twilioAccountSid = twilio.sid;
const twilioAuthToken = twilio.token;
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);
const reddit = new RandomReddit({
    username: redditAuth.username,
    password: redditAuth.password,
    app_id: redditAuth.app_id,
    api_secret: redditAuth.secret
});

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
    if (!msg.author.bot) {
        if (msg.content.substring(0, 1) === '!') {
            var args = msg.content.substring(1).split(' ');
            var cmd = args[0];

            args = args.splice(1);
            switch (cmd) {
                // !ping
                case 'ping':
                    msg.channel.send("Pinging...").then(m => {
                        var ping = m.createdTimestamp - msg.createdTimestamp;

                        msg.channel.send(`**:ping_pong: Pong! Your Ping Is:-**\n  ${ping}ms`);
                    });
                    break;
                // !text
                case 'text':
                    var num = getInput(args[0]);
                    var msg1 = (num) ? 'Success.' : 'Failed to send message.';

                    textMessage = getMsg(args, 1);

                    if (
                        twilioClient.messages
                            .create({ body: msg.author.username + ' in \'' + msg.guild.name + '\' says: ' + textMessage + '. Please do not reply to this message.', from: '+12019077471', to: '+1' + num })
                            .then(message => console.log(message.sid))) {
                        if (msg1) {
                            try {
                                msg.reply(msg1 + ' Message sent by ' + msg.author.username + ' in \'' + msg.guild.name + '\'. ');
                            } catch {
                                msg.reply(msg1 + ' Message sent by ' + msg.author.username);
                            }
                        }
                    } else {
                        msg.reply('Failed to send message.');
                    }
                    break;
                // !call
                case 'call':
                    var num = getInput(args[0]);
                    var msg1 = (num) ? 'Success.' : 'Failed to send message.';


                    createMsgXML(msg.author.username, getMsg(args, 1));
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
                            try {
                                msg.reply(msg1 + ' Message sent by ' + msg.author.username + ' in \'' + msg.guild.name + '\'. ');
                            } catch {
                                msg.reply(msg1 + ' Message sent by ' + msg.author.username);
                            }

                        }
                    } else {
                        msg.reply('Failed to send message.');
                    }
                    break;
                //!mastercall (only works for certain people)
                case 'mastercall':
                    if (msg.author.id == discIds.colin) {
                        var num = getInput(args[0]);
                        var msg1 = (num) ? 'Success.' : 'Failed to send message.';


                        createMasterMsgXML(msg.author.username, getMsg(args, 1));
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
                                try {
                                    msg.reply(msg1 + ' Message sent by ' + msg.author.username + ' in \'' + msg.guild.name + '\'. ');
                                } catch {
                                    msg.reply(msg1 + ' Message sent by ' + msg.author.username);
                                }

                            }
                        } else {
                            msg.reply('Failed to send message.');
                        }
                    }
                    break;
                //!linkcall
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
                            try {
                                msg.reply(msg1 + ' Message sent by ' + msg.author.username + ' in \'' + msg.guild.name + '\'. ');
                            } catch {
                                msg.reply(msg1 + ' Message sent by ' + msg.author.username);
                            }
                        }
                    } else {
                        msg.reply('Failed to send message.');
                    }
                    break;
                //!help
                case 'help':
                    msg.reply("\n\t\t\t\tCommand List\n!text {name/number} {message}\n!call {number/name} {message}\n!meme\n!reddit {subreddit}");
                    break;
                //!meme
                case 'meme':
                    getRedditPost(msg, 'dankmemes');
                    break;
                case 'thomas':
                    var random = Math.floor(Math.random() * thomas.length);
                    getRedditPost(msg, thomas[random]);
                    break;
                //!reddit
                case 'reddit':
                    console.log(args[0]);
                    getRedditPost(msg, args[0]);

                    break;
                //!xml
                case 'xml':
                    createMsgXML(msg.author.username, getMsg(args, 1));
                    break;
                case 'addcontact':
                    contact(msg.author.username + msg.author.id, args[0], args[1], msg)
                    break;
                case 'readcontacts':
                    readContactList(msg.author.username, msg.author.id, msg);
            }
            //Logging command
            log(msg.author.username + msg.author.id, msg.content);
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

function readContactList(user, id, msg) {
    var obj = user +  id + 'contacts';
    var contactList = fs.readFileSync('/home/colin/Desktop/discordbotjson/' + obj + '.json');
    var parsed = JSON.parse(contactList);

    var body = '';
    var i = 1;
    for (property in parsed) {
        stri = toString(i);
        console.log(stri + ' ' + numsToEmoji[stri])
        body = body.concat(numsToEmoji[stri] + ": " + parsed[property] + '\n');
        i++;
    }

    var embed1 = {
        color: 0x0099ff,
        title: user + '\'s contacts',
        description: body
    };
    msg.reply({ embed: embed1 });
}

function contact(user, name, number, msg) {
    var obj = user + 'contacts';
    try {
        var contactList = fs.readFileSync('/home/colin/Desktop/discordbotjson/' + obj + '.json');
        var parsed = JSON.parse(contactList);
        parsed[name] = number;

        parsed = JSON.stringify(parsed);
        fs.writeFileSync('/home/colin/Desktop/discordbotjson/' + obj + '.json', parsed);
        msg.reply("Contact saved.");

    } catch (err) {
        var newObj = {};
        newObj[name] = number ;
        var parsed = JSON.stringify(newObj);
        fs.writeFileSync('/home/colin/Desktop/discordbotjson/' + obj + '.json', parsed);
        msg.reply("Contact saved.");
    }
}

function log(author, msg) {
    var date = new Date();
    var strDate = 'Y-m-d h:ms:s'
        .replace('Y', date.getFullYear())
        .replace('m', date.getMonth() + 1)
        .replace('d', date.getDate())
        .replace('h', date.getHours())
        .replace('ms', date.getMinutes())
        .replace('s', date.getSeconds());
    fs.appendFile('/home/colin/Desktop/log/' + author + 'log.log', strDate + ': ' + msg + '\n', function (err) {
        if (err) throw err;
        console.log('Saved log!');
    });
}

async function getRedditPost(msg, sub) {
    var image = await reddit.getPost(sub, 1);
    console.log(image);
    try {
        var nsfw = image.data.over_18;
        if (nsfw) {
            if (externalRedditContent(image)) {
                var testembed = {
                    color: 0x0099ff,
                    title: image.data.title,
                    url: image.data.url,
                    author: {
                        name: image.data.author
                    },
                    footer: {
                        text: "👍  " + image.data.score + "\t💬 " + image.data.num_comments + ' ' + image.data.selftext,
                    },
                };
                msg.channel.send('Subreddit: r/' + sub);
                msg.reply({ embed: testembed });
                msg.channel.send('||' + image.data.url + '||');
                msg.channel.send({
                    files: [{
                        attachment: image.data.url,
                        name: "SPOILER_FILE.jpg"
                    }]
                });
                return;
            } else {
                var testembed = {
                    color: 0x0099ff,
                    title: image.data.title,
                    url: image.data.url,
                    author: {
                        name: image.data.author
                    },
                    footer: {
                        text: "👍  " + image.data.score + "\t💬 " + image.data.num_comments + ' ' + image.data.selftext,
                    },
                };
                msg.channel.send('Subreddit: r/' + sub);
                msg.reply({ embed: testembed });
                msg.channel.send('||' + image.data.url + '||');
                msg.channel.send({
                    files: [{
                        attachment: image.data.url,
                        name: "SPOILER_FILE.jpg"
                    }]
                });
                return;
            }
        } else {
            if (externalRedditContent(image)) {
                var testembed = {
                    color: 0x0099ff,
                    title: image.data.title,
                    url: image.data.url,
                    author: {
                        name: image.data.author
                    },
                    footer: {
                        text: "👍  " + image.data.score + "\t💬 " + image.data.num_comments + ' ' + image.data.selftext,
                    },

                };
                msg.channel.send('Subreddit: r/' + sub);
                msg.reply({ embed: testembed });
                msg.channel.send(image.data.url);
                return;
            } else {
                var testembed = {
                    color: 0x0099ff,
                    title: image.data.title,
                    url: image.data.url,
                    author: {
                        name: image.data.author
                    },
                    image: {
                        url: image.data.url
                    },
                    footer: {
                        text: "👍  " + image.data.score + "\t💬 " + image.data.num_comments + ' ' + image.data.selftext,
                    },
                };
            }
        }
        msg.channel.send('Subreddit: r/' + sub);
        msg.reply({ embed: testembed });
    } catch (err) {
        console.log(err);
        msg.reply("Couldn't find a post due to an error.", err);
    }
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
            if (data.length === 10 && !isNaN(data)) {
                return data;
            } else {
                return 0;
            }
    }
    
}

function createLinkXML(user, link) {
    link = link.replace("https", "http");
    fs.writeFile('/var/www/html/callmessages/' + user + 'call.xml', '<Response>\n\t<Start>\n\t\t<Stream name="test" url="ws://fishsaucey.com:44444" />\n\t</Start>\n</Response>', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

function createMsgXML(user, message) {
    fs.writeFile('/var/www/html/callmessages/' + user + 'call.xml', '<Response>\n\t<Say loop="2" voice="alice">' + 'This is a call from '+ user + ' using BotSauce. ' + message + '. The message has been concluded.'+'</Say>\n</Response>', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

function createMasterMsgXML(user, message) {
    fs.writeFile('/var/www/html/callmessages/' + user + 'call.xml', '<Response>\n\t<Say loop="2" voice="alice">' + message  + '</Say>\n</Response>', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

function externalRedditContent(image) {
    try {
        if (image.data.url.includes('v.redd.it') || image.data.url_overridden_by_dest.includes('v.redd.it') || image.data.url.includes('twitch.tv') || image.data.url.includes('youtube.com') || image.data.url.includes('youtu.be') || image.data.url_overridden_by_dest.includes('twitch.tv') || image.data.url_overridden_by_dest.includes('youtube.com') || image.data.url_overridden_by_dest.includes('youtu.be') || image.data.url_overridden_by_dest.includes('i.imgur.com') || image.data.url.includes('i.imgur.com') || image.data.url.includes('gfycat.com') || image.data.url_overridden_by_dest.includes('gfycat.com')){
            return true;
        } else {
            return false;
        }
    } catch {
        if (image.data.url.includes('v.redd.it') || image.data.url.includes('twitch.tv') || image.data.url.includes('youtube.com') || image.data.url.includes('youtu.be') || image.data.url.includes('gfycat.com')){
            return true;
        } else {
            return false;
        }
    }
}


disClient.login(auth.token);