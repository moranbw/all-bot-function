export default {
	async fetch(request, env, ctx) {
		const GROUP_ID = env.GROUP_ID;
		const BOT_ID = env.BOT_ID;
		const TOKEN = env.TOKEN;
		if (GROUP_ID && BOT_ID && TOKEN) {
			if (request.method === 'POST') {
				const message = await request.json();
				if (message.group_id === GROUP_ID) {
					let tmpString = message.text.toLowerCase();
					if (tmpString.startsWith('@all ')) {
						console.log('Message was directed at All Bot...');
						try {
							const members = await getAllMembers(GROUP_ID, TOKEN);
							const loci = getLoci(members.length);

							const messageText = message.text.substring(4);
							console.log(messageText);

							console.log('Posting to GroupMe...');
							const data = {
								bot_id: BOT_ID,
								text: messageText,
								attachments: [
									{
										type: 'mentions',
										user_ids: members,
										loci: loci
									}
								]
							};
							const response = await fetch('https://api.groupme.com/v3/bots/post', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify(data)
							});

							console.log(`Response code from GroupMe: ${response.status}`);
							if (response.status === 200 || response.status === 201 || response.status === 202) {
								return new Response('Success!', { status: 200 });
							} else {
								return new Response('Error while contacting GroupMe...', { status: 500 });
							}
						} catch (error) {
							console.error(error);
							return new Response('Error while contacting GroupMe...', { status: 500 });
						}
					} else {
						return new Response('Message not to @all...ignore.', { status: 202 });
					}
				} else {
					return new Response('Not a valid GroupMe request!', { status: 401 });
				}
			} else {
				return new Response('Not a POST request!', { status: 404 });
			}
		} else {
			return new Response('Environment not confiugred!', { status: 500 });
		}

	},
};

const getAllMembers = async (groupId, token) => {
	console.log('Getting members...');
	const response = await fetch(
		`https://api.groupme.com/v3/groups/${groupId}?token=${token}`
	);
	const json = await response.json();
	const members = json.response.members;
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
