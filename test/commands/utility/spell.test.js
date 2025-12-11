const command = require('../../../src/commands/utility/spell')
const {createInteraction} = require("../../utility");

test('should call user a spell', () => {
    const userId = Math.floor(Math.random() * 9) + 1;
    const interaction = createInteraction({user: {id: userId}})
    return command.execute(interaction).then(() => {
        expect(interaction.replyContent).toBe(`<@${userId}> jestes spellem!`)
    })
})