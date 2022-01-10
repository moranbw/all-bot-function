const axios = require('axios');

const GROUP_ID = process.env.GROUP_ID;
const BOT_ID = process.env.BOT_ID;
const TOKEN = process.env.TOKEN;

exports.handler = async (event) => {
  const message = JSON.parse(event.body);

  if (message.group_id === GROUP_ID) {
    let tmpString = message.text.toLowerCase();
    if (tmpString.startsWith('@all ')) {
      console.log('Message was directed at All Bot...');
      try {
        const members = await getAllMembers();
        const loci = getLoci(members.length);
  
        const messageText = message.text.substring(4);
        console.log(messageText);

        await axios.post(
          'https://api.groupme.com/v3/bots/post',
          {
            bot_id: BOT_ID,
            text: messageText,
            attachments: [
              {
                type: "mentions",
                user_ids: members,
                loci: loci
              },
            ],
          },
          {
            Headers: { 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.log('Error', error);
      }
    }
  }
};

const getAllMembers = async () => {
  const response = await axios(
    `https://api.groupme.com/v3/groups/${GROUP_ID}?token=${TOKEN}`
  );
  const members = response.data.response.members;
  const memberArr = [];
  for (const member of members) {
    memberArr.push(member.user_id);
  }
  return memberArr;
};

const getLoci = (length) => {
  let loci = [];
  for (let i = 0; i < length; i++) {
    loci.push([i, i + 1]);
  }

  return loci;
};
