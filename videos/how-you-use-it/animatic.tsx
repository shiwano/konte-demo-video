import { defineAnimatic, asset, Audio, Composition } from "konte";
import { audioZonos2VoiceClone } from "konte/workspace/adapters/comfy/audio_zonos2_voice_clone.js";
import direction from "./direction";
import reference from "./reference";
import * as S from "./screens";

const vo = (text: string) =>
  asset("vo", audioZonos2VoiceClone, {
    referenceAudio: reference.konteVoice,
    script: text,
    leadingSilence: "0: 0-0.05",
    trailingSilence: "3: 0.25-0.5",
  });

export default defineAnimatic(direction, {
  timeline: ({ graphicShot }) => ({
    shots: graphicShot("01", ({ script }) => (
        <Composition>
          <S.Shot01 />
          <Audio src={vo(script.narration[0])} start={0.25} />
        </Composition>
      ))
      .nextGraphicShot("02", ({ script }) => (
        <Composition>
          <S.Shot02 />
          <Audio src={vo(script.narration[0])} start={0.2} />
        </Composition>
      ))
      .nextGraphicShot("03", ({ script }) => (
        <Composition>
          <S.Shot03 />
          <Audio src={vo(script.narration[0])} start={0.2} />
        </Composition>
      ))
      .nextGraphicShot("04", ({ script }) => (
        <Composition>
          <S.Shot04 />
          <Audio src={vo(script.narration[0])} start={0.2} />
        </Composition>
      ))
      .nextGraphicShot("05", ({ script }) => (
        <Composition>
          <S.Shot05 />
          <Audio src={vo(script.narration[0])} start={0.2} />
        </Composition>
      ))
      .nextGraphicShot("06", () => (
        <Composition>
          <S.Shot06 />
        </Composition>
      ))
      .nextGraphicShot("07", ({ script }) => (
        <Composition>
          <S.Shot07 />
          <Audio src={vo(script.narration[0])} start={0.2} />
        </Composition>
      ))
      .nextGraphicShot("08", ({ script }) => (
        <Composition>
          <S.Shot08 />
          <Audio src={vo(script.narration[0])} start={0.2} />
        </Composition>
      ))
      .nextGraphicShot("09", ({ script }) => (
        <Composition>
          <S.Shot09 clips={S.stills} />
          <Audio src={vo(script.narration[0])} start={0.2} />
        </Composition>
      ))
      .nextGraphicShot("10", ({ script }) => (
        <Composition>
          <S.Shot10 clips={S.stills} />
          <Audio src={vo(script.narration[0])} start={0.15} />
        </Composition>
      ))
      .nextGraphicShot("11", ({ script }) => (
        <Composition>
          <S.Shot11 clips={S.stills} />
          <Audio src={vo(script.narration[0])} start={0.2} />
        </Composition>
      ))
      .nextGraphicShot("12", () => (
        <Composition>
          <S.Shot12 clips={S.stills} />
        </Composition>
      ))
      .nextGraphicShot("13", ({ script }) => (
        <Composition>
          <S.Shot13 />
          <Audio src={vo(script.narration[0])} start={0.2} />
        </Composition>
      ))
      .nextGraphicShot("14", ({ script }) => (
        <Composition>
          <S.Shot14 clips={S.stills} />
          <Audio src={vo(script.narration[0])} start={0.2} />
        </Composition>
      ))
      .nextGraphicShot("15", ({ script }) => (
        <Composition>
          <S.Shot15 />
          <Audio src={vo(script.narration[0])} start={0.2} />
        </Composition>
      )),
  }),
});
