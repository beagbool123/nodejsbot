const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.argv.length == 2 ? process.env.token : "";
const welcomeChannelName = "👋-새로운-유저";
const byeChannelName = "안녕히가세요";
const welcomeChannelComment = "👋-나가는-유저";
const byeChannelComment = "안녕히가세요.";

client.on('ready', () => {
  console.log('켰다.');
  client.user.setPresence({ game: { name: '?help를 쳐보세요.' }, status: 'online' })
});

client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  const newUser = member.user;
  const welcomeChannel = guild.channels.find(channel => channel.name == welcomeChannelName);

  welcomeChannel.send(`<@${newUser.id}> ${welcomeChannelComment}\n`);

  member.addRole(guild.roles.find(role => role.name == "everyone"));
});

client.on("guildMemberRemove", (member) => {
  const guild = member.guild;
  const deleteUser = member.user;
  const byeChannel = guild.channels.find(channel => channel.name == byeChannelName);

  byeChannel.send(`<@${deleteUser.id}> ${byeChannelComment}\n`);
});

client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content == 'embed') {
    let img = 'https://cdn.discordapp.com/attachments/615494991774613506/759294495933464627/a244289a4df7601f.jpg';
    let embed = new Discord.RichEmbed()
      .setTitle('상추백불')
      .setURL('https://www.youtube.com/channel/UC3lQAwvx_sW8DBqcsMUwXow?view_as=subscriber%27%27')
      .setAuthor('상추백불', img, 'https://www.youtube.com/channel/UC3lQAwvx_sW8DBqcsMUwXow?view_as=subscriber%27%27')
      .setThumbnail(img)
      .addBlankField()
      .addField('이 봇 만드는데 걸린 시간', '9시간')
      .addBlankField()
      .addField('이 봇 만드는데 사용한 프로그래밍 언어', 'JavaScript(Node.js)', true)
      .addBlankField()
      .addField('이 봇 만드는데 사용한 코드의 길이', '160줄', true)
      .addBlankField()
      .setTimestamp()
      .setFooter('상추백불이 만듬', img)

    message.channel.send(embed)
  } else if(message.content == '?help') {
    let helpImg = 'https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png';
    let commandList = [
      {name: 'ping', desc: '기능 준비중'},
      {name: 'embed', desc: '상추백불 프로필'},
      {name: 'embed2', desc: '봇 설명서'},
      {name: '!전체공지', desc: 'dm으로 전체 공지 보내기(관리자 전용)'},
      {name: '!청소', desc: '텍스트를 삭제함(관리자 전용)'},
    ];
    let commandStr = '';
    let embed = new Discord.RichEmbed()
      .setAuthor('상추백불의 테스트용 봇 설명서', helpImg)
      .setColor('#186de6')
      .setFooter(`상추백불의 테스트용 봇 설명서`)
      .setTimestamp()
    
    commandList.forEach(x => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`;
    });

    embed.addField('Commands: ', commandStr);

    message.channel.send(embed)
  }

  if(message.content.startsWith('?전체공지')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
      let contents = message.content.slice('?전체공지'.length);
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(`<@${message.author.id}> ${contents}`);
      });
  
      return message.reply('공지를 전송했습니다.');
    } else {
      return message.reply('채널에서 실행해주세요.');
    }
  }

  if(message.content.startsWith('?청소')) {
    if(checkPermission(message)) return

    var clearLine = message.content.slice('?청소 '.length);
    var isNum = !isNaN(clearLine)

    if(isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return;
    } else if(!isNum) { // c @상추백불 3
      if(message.content.split('<@').length == 2) {
        if(isNaN(message.content.split(' ')[2])) return;

        var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
        var count = parseInt(message.content.split(' ')[2])+1;
        const _limit = 10;
        let _cnt = 0;

        message.channel.fetchMessages({limit: _limit}).then(collected => {
          collected.every(msg => {
            if(msg.author.id == user) {
              msg.delete();
              ++_cnt;
            }
            return !(_cnt == count);
          });
        });
      }
    } else {
      message.channel.bulkDelete(parseInt(clearLine)+1)
        .then(() => {
          AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개의 메시지를 삭제했습니다. (이 메세지는 잠시 후에 사라집니다.)");
        })
        .catch(console.error)
    }
  }
});

function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
    return true;
  } else {
    return false;
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str;
  limitLen -= tmp.length;

  for(let i=0;i<limitLen;i++) {
      tmp += ' ';
  }

  return tmp;
}

async function AutoMsgDelete(message, str, delay = 3000) {
  let msg = await message.channel.send(str);

  setTimeout(() => {
    msg.delete();
  }, delay);
}


client.login(token);