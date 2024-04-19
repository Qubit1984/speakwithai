import AWS from "aws-sdk";

const polly: AWS.Polly = new AWS.Polly({
  region: "ap-northeast-1", // 替换为你的AWS区域
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_POLLY_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_POLLY_SECRET_KEY!,
  },
});
let audioQueue: Blob[] = [];
let currentAudioElement: HTMLAudioElement | null = null;
function playNextAudio() {
  if (audioQueue.length > 0 && !currentAudioElement) {
    const audioBlob = audioQueue.shift();
    if (audioBlob) {
      const blobUrl = URL.createObjectURL(audioBlob);
      currentAudioElement = new Audio(blobUrl);

      currentAudioElement.onended = () => {
        currentAudioElement = null;
        URL.revokeObjectURL(blobUrl);
        playNextAudio();
      };

      currentAudioElement.play();
      currentAudioElement = null;
    }
  }
}
export default async function speakMessage(
  message: string,
  speakLanguage: string,
) {
  try {
    const response = await polly
      .synthesizeSpeech({
        Engine: "neural",
        Text: message,
        OutputFormat: "mp3",
        VoiceId: speakLanguage, // 替换为你喜欢的语音ID
      })
      .promise();

    let arrayBuffer;
    if (response.AudioStream instanceof Buffer) {
      arrayBuffer = response.AudioStream.buffer;
    } else if (
      typeof response.AudioStream === "string" ||
      response.AudioStream instanceof Uint8Array
    ) {
      arrayBuffer = Buffer.from(response.AudioStream).buffer;
    } else {
      console.error("Unsupported AudioStream type");
    }
    if (arrayBuffer) {
      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      audioQueue.push(blob);
      playNextAudio();
    }
    // 播放音频
  } catch (error) {
    console.error("Error synthesizing speech:", error);
  }
}
