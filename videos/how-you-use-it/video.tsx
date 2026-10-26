import { defineVideo, soundtrack, Audio, Composition, Subtitle, Video } from "konte";
import animatic from "./animatic";
import direction from "./direction";
import reference from "./reference";
import * as S from "./screens";

const CLIPS = {
  "03": reference.clip03,
  "04": reference.clip04,
  "05before": reference.clip05Before,
  "05": reference.clip05,
};

const clips: S.Clips = (key, o) => (
  <Video src={CLIPS[key]} start={o?.start} duration={o?.duration} mediaStart={o?.mediaStart} className="absolute inset-0 h-full w-full object-cover" />
);

const clicks = (...times: number[]) => times.map((t) => <Audio src={reference.sfxClick} start={t} volume={0.5} />);
const typing = (start: number, duration: number) => (
  <Audio src={reference.sfxTyping} start={start} duration={duration} fadeOut={0.1} volume={0.6} />
);

type Voiced = "01" | "02" | "03" | "04" | "05" | "07" | "08" | "09" | "10" | "11" | "13" | "14" | "15";
const narration = (id: Voiced, text: string, duration: number) => [
  <Audio src={animatic.shot(id).narrationStem} />,
  <Subtitle
    entries={[{ start: 0.1, end: duration, text }]}
    className="bottom-[5%] text-[2.3vmax] font-semibold"
    lineClassName="rounded-xl bg-black/80 px-[0.7em] py-[0.25em] leading-snug"
  />,
];

export default defineVideo(direction, {
  timeline: ({ graphicShot }) => ({
    soundtracks: [soundtrack("bgm", reference.bgm, { duck: true, from: { shot: "01", at: 1 }, until: { shot: "15" }, fadeOut: 1.2 })],
    shots: graphicShot("01", ({ script, duration }) => (
      <Composition>
        <S.Shot01 />
        {typing(0.2, 0.75)}
        {clicks(1.05)}
        {narration("01", script.narration[0], duration)}
      </Composition>
    ))
      .nextGraphicShot("02", ({ script, duration }) => (
        <Composition>
          <S.Shot02 />
          {narration("02", script.narration[0], duration)}
          {clicks(0.55, 1.0, 1.6)}
        </Composition>
      ))
      .nextGraphicShot("03", ({ script, duration }) => (
        <Composition>
          <S.Shot03 />
          {narration("03", script.narration[0], duration)}
        </Composition>
      ))
      .nextGraphicShot("04", ({ script, duration }) => (
        <Composition>
          <S.Shot04 />
          {narration("04", script.narration[0], duration)}
          {clicks(0.48, 1.15)}
        </Composition>
      ))
      .nextGraphicShot("05", ({ script, duration }) => (
        <Composition>
          <S.Shot05 />
          {clicks(1.55)}
          {narration("05", script.narration[0], duration)}
        </Composition>
      ))
      .nextGraphicShot("06", () => (
        <Composition>
          <S.Shot06 />
          {clicks(0.43, 1.03, 1.63)}
        </Composition>
      ))
      .nextGraphicShot("07", ({ script, duration }) => (
        <Composition>
          <S.Shot07 />
          {narration("07", script.narration[0], duration)}
        </Composition>
      ))
      .nextGraphicShot("08", ({ script, duration }) => (
        <Composition>
          <S.Shot08 />
          {narration("08", script.narration[0], duration)}
          {clicks(0.5)}
        </Composition>
      ))
      .nextGraphicShot("09", ({ script, duration }) => (
        <Composition>
          <S.Shot09 clips={clips} />
          {narration("09", script.narration[0], duration)}
        </Composition>
      ))
      .nextGraphicShot("10", ({ script, duration }) => (
        <Composition>
          <S.Shot10 clips={S.stills} />
          {clicks(1.05)}
          {narration("10", script.narration[0], duration)}
        </Composition>
      ))
      .nextGraphicShot("11", ({ script, duration }) => (
        <Composition>
          <S.Shot11 clips={S.stills} />
          {narration("11", script.narration[0], duration)}
          {typing(0.25, 1.5)}
          {clicks(2.15)}
        </Composition>
      ))
      .nextGraphicShot("12", () => (
        <Composition>
          <S.Shot12 clips={S.stills} />
          {clicks(0.8)}
        </Composition>
      ))
      .nextGraphicShot("13", ({ script, duration }) => (
        <Composition>
          <S.Shot13 />
          {narration("13", script.narration[0], duration)}
        </Composition>
      ))
      .nextGraphicShot("14", ({ script, duration }) => (
        <Composition>
          <S.Shot14 clips={clips} />
          {narration("14", script.narration[0], duration)}
          {clicks(1.4)}
        </Composition>
      ))
      .nextGraphicShot("15", ({ script, duration }) => (
        <Composition>
          <S.Shot15 />
          {narration("15", script.narration[0], duration)}
        </Composition>
      )),
  }),
});
