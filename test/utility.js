const objectOrParam = (obj, param) => {
    return obj ? obj : param
}

const objectOrEmpty = (obj) => {
    return objectOrParam(obj, {})
}

const createUser = (user) => {
    user = objectOrEmpty(user)
    return {
        id: objectOrParam(user.id, 0),
        username: objectOrParam(user.username, "Username")
    }
}

const createChannel = (channel) => {
    channel = objectOrEmpty(channel)
    return {
        id: objectOrParam(channel.id, 0)
    }
}

const createVoice = (voice) => {
    voice = objectOrEmpty(voice)
    return {
        channel: createChannel(objectOrEmpty(voice.channel))
    }
}

const createMember = (member) => {
    member = objectOrEmpty(member)
    return {
        voice: createVoice(objectOrEmpty(member.voice)),
        joinedAt: objectOrParam(member.joinedAt, new Date().toISOString()),
    }
}

const createGuild = (guild) => {
    guild = objectOrEmpty(guild)
    return {
        id: objectOrParam(guild.id, 0),
        name: objectOrParam(guild.name, "GuildName"),
        memberCount: objectOrParam(guild.memberCount, 0),
    }
}

const createInteraction = (interaction) => {
    interaction = objectOrEmpty(interaction)
    return {
        user: createUser(objectOrEmpty(interaction.user)),
        member: createMember(objectOrEmpty(interaction.member)),
        guild: createGuild(objectOrEmpty(interaction.guild)),
        replyContent: "",
        reply: async function (content) {
            this.replyContent = content;
        }
    }
}

const createClient = (client) => {
    client = objectOrEmpty(client)
    return {
        guilds: {
            cache: {
                get: function (guildId) {
                    return createGuild(client.guildId)
                }
            }
        }
    }
}

module.exports = {
    createUser,
    createChannel,
    createVoice,
    createMember,
    createGuild,
    createInteraction,
    createClient
};

