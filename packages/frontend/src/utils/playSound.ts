import sfxMp3 from "@/assets/sounds/sfx-notify.mp3";
import sfxOgg from "@/assets/sounds/sfx-notify.ogg";
import sfxWav from "@/assets/sounds/sfx-notify.wav";

type AudioFormat = "mp3" | "ogg" | "wav";

export const playSound = (format: AudioFormat) => {
  let audio;
  switch (format) {
    case "ogg":
      audio = new Audio(sfxOgg);
      break;
    case "wav":
      audio = new Audio(sfxWav);
      break;
    default:
      audio = new Audio(sfxMp3);
      break;
  }
  audio.play();
};
