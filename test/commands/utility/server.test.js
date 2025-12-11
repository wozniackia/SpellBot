const command = require('../../../src/commands/utility/server')
const {createInteraction} = require("../../utility");

test('should return info about the server', () => {
    const memberCount = Math.floor(Math.random() * 10);
    const guildName = "Dupa"

    const interaction = createInteraction({
        guild: {
            name: guildName,
            memberCount: memberCount,
        }
    })

    return command.execute(interaction).then(() => {
        expect(interaction.replyContent).toBe(`This server is ${guildName} and has ${memberCount} members.`)
    })
})