import { defineReference, asset, adapters } from "konte";
import direction from "./direction";

export default defineReference(direction, {
  references: () => {
    const konteVoice = asset("konteVoice", adapters.audioFile, { path: "assets/files/konte-voice.mp3" });
    const bgm = asset("bgm", adapters.audioFile, { path: "assets/files/bgm.mp3" });
    const sfxClick = asset("sfxClick", adapters.audioFile, { path: "assets/files/sfx-click.mp3" });
    const sfxTyping = asset("sfxTyping", adapters.audioFile, { path: "assets/files/sfx-typing.mp3" });
    return { konteVoice, bgm, sfxClick, sfxTyping };
  },
});
