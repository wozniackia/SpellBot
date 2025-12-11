const {createPlayerListeners, createYtdlpListeners} = require("../src/audioPlayer");
const EventEmitter = require('events');
const {
    createAudioPlayer, AudioPlayerStatus,
} = require("@discordjs/voice");

jest.mock("@discordjs/voice", () => {
    const actual = jest.requireActual("@discordjs/voice")
    return {
        ...actual,
        createAudioPlayer: jest.fn(),
    }
})

describe('player listeners', () => {
    beforeEach(() => {
        console.log = jest.fn();
        console.error = jest.fn();
    })

    test('should call console.log when player changes state', () => {
        const fakePlayer = new EventEmitter()
        createAudioPlayer.mockReturnValue(fakePlayer)
        createPlayerListeners(fakePlayer)

        fakePlayer.emit(
            "stateChange",
            { status: AudioPlayerStatus.Playing },
            { status: AudioPlayerStatus.Idle }
        );

        expect(console.log).toHaveBeenCalled()
    })

    test('should call console.error when player raises an error', () => {
        const fakePlayer = new EventEmitter()
        createAudioPlayer.mockReturnValue(fakePlayer)
        createPlayerListeners(fakePlayer)

        fakePlayer.emit("error")

        expect(console.error).toHaveBeenCalled()
    })
})

describe('ytdlp listeners', () => {
    beforeEach(() => {
        console.log = jest.fn();
        console.error = jest.fn();
    })

    test('should call console.log when ytdlp closes', () => {
        const fakeYtdlp = new EventEmitter()
        createYtdlpListeners(fakeYtdlp)

        fakeYtdlp.emit("close");

        expect(console.log).toHaveBeenCalled()
    })

    test('should call console.error when ytdlp emits an error', () => {
        const fakeYtdlp = new EventEmitter()
        createYtdlpListeners(fakeYtdlp)

        fakeYtdlp.emit("error")

        expect(console.error).toHaveBeenCalled()
    })
})