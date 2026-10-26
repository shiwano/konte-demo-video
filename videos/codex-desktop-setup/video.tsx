import { defineVideo, soundtrack, Audio, Composition, Subtitle } from "konte";
import animatic from "./animatic";
import direction from "./direction";
import reference from "./reference";
import * as S from "./screens";

const sounds = (id: S.ShotId) => {
  const { clicks, typing } = S.cues(id);
  return [
    ...clicks.map((t) => <Audio src={reference.sfxClick} start={t} volume={0.5} />),
    ...typing.map(([t, d]) => <Audio src={reference.sfxTyping} start={t} duration={d} fadeOut={0.1} volume={0.6} />),
  ];
};

/** Shots whose camera rests on the composer at the bottom carry the caption at the top. */
const CAPTION_TOP: S.ShotId[] = ["01"];
/** Shots framed on the home heading and the composer carry the caption in the empty band between them. */
const CAPTION_MID: S.ShotId[] = ["11", "12", "16"];

const narration = (id: S.ShotId, text: string, duration: number) => [
  <Audio src={animatic.shot(id).narrationStem} />,
  <Subtitle
    entries={[{ start: 0.1, end: duration, text }]}
    className={`${CAPTION_TOP.includes(id) ? "top-[15%] bottom-auto" : CAPTION_MID.includes(id) ? "top-[33%] bottom-auto" : "bottom-[5%]"} text-[2.3vmax] font-semibold`}
    lineClassName="rounded-xl bg-black/80 px-[0.7em] py-[0.25em] leading-snug"
  />,
];

type Build = { script: { narration: readonly [string, ...string[]] }; duration: number };

const voiced = (id: S.ShotId) => ({ script, duration }: Build) => (
  <Composition>
    <S.Shot id={id} />
    {sounds(id)}
    {narration(id, script.narration[0], duration)}
  </Composition>
);

const silent = (id: S.ShotId) => () => (
  <Composition>
    <S.Shot id={id} />
    {sounds(id)}
  </Composition>
);

export default defineVideo(direction, {
  timeline: ({ graphicShot }) => ({
    soundtracks: [soundtrack("bgm", reference.bgm, { duck: true, from: { shot: "01", at: 0.8 }, fadeOut: 1.2 })],
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
      .nextGraphicShot("16", voiced("16"))
      .nextGraphicShot("17", voiced("17")),
  }),
});
