const command = require('../../../src/commands/utility/ping')
const {createInteraction} = require("../../utility");

test('should reply with Pong!', () => {
    const interaction = createInteraction()
    return command.execute(interaction).then(() => {
        expect(interaction.replyContent).toBe('Pong!')
    })
})