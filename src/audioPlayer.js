const {
    createAudioPlayer,
    NoSubscriberBehavior,
    AudioPlayerStatus,
    createAudioResource,
    StreamType,
    VoiceConnectionStatus
} = require("@discordjs/voice");
const {spawn} = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);

const YTDLP_PATH = "C:\\SpellBot2\\yt-dlp.exe"

async function startPlaying(connection) {
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play,
        },
    });

    player.on("stateChange", (oldState, newState) => {
        console.log(`Player state: ${oldState.status} -> ${newState.status}`);

        if (newState.status === AudioPlayerStatus.Idle) {
            console.log("Playback finished.");
        }
    });

    player.on("error", (error) => {
        console.error("Audio player error:", error);
    });

    // const url = "https://www.youtube.com/playlist?list=PLGV-bdy06e8NZOy5dFvfREkINS9uobx_a";
    const url = "https://youtu.be/wPSaPXRYFd4?si=2WWyIXPNvPcpcG9K";
    console.log(url)
    const ytdlp = spawn(
        YTDLP_PATH,
        [
            "--cookies",
            process.env.COOKIES_PATH,
            "-f",
            "bestaudio/best", // best available audio
            "--extractor-args",
            "youtube:player_client=android", // should not require cookies
            "-o",
            "-",              // output to stdout
            url,
        ],
        {
            stdio: ["ignore", "pipe", "ignore"],
        }
    );

    ytdlp.on("error", (err) => {
        console.error("yt-dlp process error:", err);
    });

    ytdlp.on("close", (code, signal) => {
        console.log(`yt-dlp exited with code ${code} signal ${signal}`);
    });

    const ffmpegStream = ffmpeg(ytdlp.stdout)
        .inputOptions(["-analyzeduration 0", "-loglevel 0"])
        .audioFrequency(48000) // Discord requirement
        .audioChannels(2)
        .format("s16le")       // raw PCM
        .on("start", (cmd) => {
            console.log("ffmpeg started:", cmd);
        })
        .on("error", (err) => {
            console.error("ffmpeg error:", err.message || err);
            ytdlp.kill("SIGINT");
        })
        .on("end", () => {
            console.log("ffmpeg processing finished");
            ytdlp.kill("SIGINT");
        })
        .pipe();

    const resource = createAudioResource(ffmpegStream, {
        inputType: StreamType.Raw,
    });

    player.play(resource);

    const subscription = connection.subscribe(player);

    connection.on(VoiceConnectionStatus.Disconnected, () => {
        console.log("Voice connection disconnected, unsubscribing player");
        subscription.unsubscribe();
    });
}

module.exports = { startPlaying }