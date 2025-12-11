const command = require('../../../src/commands/utility/user')
const {createInteraction} = require("../../utility");

test('should return info about the user', () => {
    const username = "Dupa"
    const joinedAt = new Date("06 December 2001 16:12 UTC").toISOString()

    const interaction = createInteraction({
        user: {username: username},
        member: {joinedAt: joinedAt}
    })

    return command.execute(interaction).then(() => {
        expect(interaction.replyContent).toBe(`This command was run by ${username}, who joined on ${joinedAt}.`)
    })
})