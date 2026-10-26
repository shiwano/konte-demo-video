import { defineReference, asset, adapters } from "konte";
import { audioStableAudio3Medium } from "konte/workspace/adapters/comfy/audio_stable_audio_3_medium.js";
import direction from "./direction";

const image = (name: string, file: string) => asset(name, adapters.imageFile, { path: `assets/files/${file}.png` });
const video = (name: string, file: string) => asset(name, adapters.videoFile, { path: `assets/files/${file}.mp4` });

export default defineReference(direction, {
  references: () => {
    const konteVoice = asset("konteVoice", adapters.audioFile, { path: "assets/files/konte-voice.mp3" });
    const bgm = asset("bgm", audioStableAudio3Medium, {
      category: "Music",
      duration: 48,
      prompt:
        "minimal electronic, crisp plucked synth arpeggio, tight punchy drums, deep round sub bass, light hi-hat shuffle, confident and focused, driving 120 bpm, clean modern production",
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
    return {
      konteVoice,
      bgm,
      sfxClick,
      sfxTyping,
      icon: image("icon", "konte-icon"),
      refGirl: image("refGirl", "ref-girl"),
      refOwner: image("refOwner", "ref-owner"),
      refUmbrella: image("refUmbrella", "ref-umbrella"),
      refCafe: image("refCafe", "ref-cafe"),
      panel01: image("panel01", "panel-01"),
      panel02: image("panel02", "panel-02"),
      panel03: image("panel03", "panel-03"),
      panel04: image("panel04", "panel-04"),
      panel05: image("panel05", "panel-05"),
      panel06: image("panel06", "panel-06"),
      frame03: image("frame03", "frame-03"),
      frame04: image("frame04", "frame-04"),
      frame05: image("frame05", "frame-05"),
      frame05Before: image("frame05Before", "frame-05-before"),
      clip01: video("clip01", "clip-01"),
      clip02: video("clip02", "clip-02"),
      clip03: video("clip03", "clip-03"),
      clip04: video("clip04", "clip-04"),
      clip05Before: video("clip05Before", "clip-05-before"),
      clip05: video("clip05", "clip-05"),
      clip06: video("clip06", "clip-06"),
    };
  },
});
