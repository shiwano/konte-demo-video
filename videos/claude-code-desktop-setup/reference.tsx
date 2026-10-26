import { defineReference, asset, adapters } from "konte";
import { audioStableAudio3Medium } from "konte/workspace/adapters/comfy/audio_stable_audio_3_medium.js";
import direction from "./direction";

export default defineReference(direction, {
  references: () => {
    const konteVoice = asset("konteVoice", adapters.audioFile, { path: "assets/files/konte-voice.mp3" });
    const bgm = asset("bgm", audioStableAudio3Medium, {
      category: "Music",
      duration: 60,
      prompt:
        "minimal electronic pop, bright plucked synth arpeggio, soft punchy drums, warm round bass, light shaker, friendly and focused, steady 110 bpm, clean modern production",
    });
    const sfxClick = asset("sfxClick", audioStableAudio3Medium, {
      category: "One-shot",
      duration: 1,
      prompt: "single computer mouse button click, close-miked, dry, short plastic tick",
    });
    const sfxTyping = asset("sfxTyping", audioStableAudio3Medium, {
      category: "SFX",
      duration: 3,
      prompt: "fast typing on a low-profile laptop keyboard, soft keys, close-miked, dry quiet room",
    });
    return { konteVoice, bgm, sfxClick, sfxTyping };
  },
});
