const {spawn} = require("child_process");

const YTDLP_PATH = "C:\\SpellBot2\\yt-dlp.exe"
// const url = "https://www.youtube.com/playlist?list=PLGV-bdy06e8NZOy5dFvfREkINS9uobx_a";
const url = "https://youtu.be/wPSaPXRYFd4?si=2WWyIXPNvPcpcG9K";

const ytdlp = spawn(
    YTDLP_PATH,
    [
        "-f", "bestaudio/best",
        "--audio-format", "opus",
        // "-o", "src/cache/%(id)s-%(title)s.opus",
        "-o", "src/cache/%(tags)s.opus",
        url,
    ],
    {
        stdio: ["ignore", "pipe", "ignore"],
    }
);

