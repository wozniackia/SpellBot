const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    StreamType,
    VoiceConnectionStatus,
    AudioPlayerStatus,
} = require("@discordjs/voice");

const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const { spawn } = require("child_process");

const { config } = require("dotenv");
config();

// Tell fluent-ffmpeg which ffmpeg binary to use
ffmpeg.setFfmpegPath(ffmpegPath);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.once("clientReady", async () => {
    console.log("Bot online!");

    client.user.setActivity("https://youtube.com/@s3notron", {
        type: ActivityType.Watching,
    });

    // spelluna
    // const channelId = "674939205901615125";
    // const guildId = "224188375114973185";

    // suzyw
    const channelId = "833682061386186817";
    const guildId = "833682061172408331";

    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
        console.error("Server not found, could not connect to voice channel.");
        return;
    }

    const connection = joinVoiceChannel({
        channelId,
        guildId,
        adapterCreator: guild.voiceAdapterCreator,
    });

    connection.on("stateChange", (oldState, newState) => {
        console.log(
            `Connection state: ${oldState.status} -> ${newState.status}`
        );

        if (
            oldState.status === VoiceConnectionStatus.Ready &&
            newState.status === VoiceConnectionStatus.Connecting
        ) {
            // Workaround for some networking issues
            connection.configureNetworking();
        }
    });

    startPlaying(connection).catch((err) => {
        console.error("Error in startPlaying:", err);
    });
});

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

    const url = "https://www.youtube.com/playlist?list=PLGV-bdy06e8NZOy5dFvfREkINS9uobx_a";

    const ytdlp = spawn(
        "C:\\SpellBot2\\yt-dlp.exe",
        [
            "-f",
            "bestaudio/best", // best available audio
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

client.login(process.env.token);