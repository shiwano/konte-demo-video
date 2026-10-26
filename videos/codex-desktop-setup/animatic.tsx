import { defineAnimatic, asset, adapters, Audio, Composition } from "konte";
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

/** `fit` retimes a take that overruns its shot to that many seconds; `at` is when the line starts. */
const voiced = (id: S.ShotId, fit?: number, at = 0.1) => ({ script }: { script: { narration: readonly [string, ...string[]] } }) => {
  const raw = vo(script.narration[0]);
  return (
    <Composition>
      <S.Shot id={id} />
      <Audio src={fit ? asset("voFit", adapters.audioRetime, { source: raw, duration: fit }) : raw} start={at} />
    </Composition>
  );
};

const silent = (id: S.ShotId) => () => (
  <Composition>
    <S.Shot id={id} />
  </Composition>
);

export default defineAnimatic(direction, {
  timeline: ({ graphicShot }) => ({
    shots: graphicShot("01", voiced("01"))
      .nextGraphicShot("02", voiced("02"))
      .nextGraphicShot("03", silent("03"))
      .nextGraphicShot("04", voiced("04"))
      .nextGraphicShot("05", voiced("05"))
      .nextGraphicShot("06", voiced("06"))
      .nextGraphicShot("07", voiced("07"))
      .nextGraphicShot("08", voiced("08"))
      .nextGraphicShot("09", voiced("09"))
      .nextGraphicShot("10", voiced("10"))
      .nextGraphicShot("11", voiced("11"))
      .nextGraphicShot("12", voiced("12"))
      .nextGraphicShot("13", voiced("13"))
      .nextGraphicShot("14", voiced("14"))
      .nextGraphicShot("15", silent("15"))
      .nextGraphicShot("16", voiced("16", undefined, 0.6))
      .nextGraphicShot("17", voiced("17")),
  }),
});
