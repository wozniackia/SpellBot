const command = require('../../../src/commands/audio/play')
const {createInteraction, createClient} = require("../../utility");
const {startPlaying} = require("../../../src/audioPlayer");

jest.mock("../../../src/audioPlayer")

test('should', () => {
    const guildId = Math.floor(Math.random() * 9) + 1;
    const guildName = "Dupa";
    const memberCount = Math.floor(Math.random() * 9) + 1;

    const interaction = createInteraction({
        guild: {
            id: guildId,
            name: guildName,
            memberCount: memberCount,
        }
    })

    const client = createClient({guildId: 123})

    return command.execute(interaction, client).then(() => {
        expect(interaction.replyContent).toBe(`This server is ${guildName} and has ${memberCount} members.`)
    })
})