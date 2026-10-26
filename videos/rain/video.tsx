import { defineVideo, asset, soundtrack, Animate, Composition, Video } from "konte";
import { videoMinimaxH3R2v } from "konte/workspace/adapters/comfy/video_minimax_h3_r2v.js";
import direction from "./direction";
import animatic from "./animatic";
import reference from "./reference";

const STYLE =
  "2D-animated, painterly anime background art with soft cel-shaded figures and clean thin dark-brown line art.";

const GIRL =
  "the young woman in a navy duffle coat with cream toggle buttons over a cream cable-knit sweater, shoulder-length straight black hair with the ends damp and separated into strands";
const OWNER =
  "the elderly man in a gray cardigan and brown apron, short white hair, round thin gold wire glasses, a white collared shirt under the gray wool cardigan, a long brown canvas apron";

const ROOM =
  "Steady rain against the café's large window, soft drips from the eaves outside, the low hum of a quiet café after closing.";

export default defineVideo(direction, {
  timeline: ({ shot }) => ({
    soundtracks: [
      soundtrack("rain", reference.rain, { duck: false, volume: 0.35, fadeIn: 1, fadeOut: 1.5 }),
      soundtrack("piano", reference.bgm, {
        duck: true,
        volume: 0.22,
        from: { shot: "03" },
        fadeIn: 2,
        fadeOut: 2,
      }),
    ],
    shots: shot("01", () => {
      const motion = asset("motion", videoMinimaxH3R2v, {
        image1: animatic.shot("01").image("first"),
        image2: reference.owner,
        image3: reference.girl,
        startImage: animatic.shot("01").image("first"),
        prompt: {
          subjectDefinitions: [
            "<Picture 1> is the first frame of [Shot 1].",
            `<Subject 1> is ${OWNER}, as in <Picture 2>.`,
            `<Subject 2> is ${GIRL}, as in <Picture 3>.`,
          ],
          summary: {
            tasks: ["keyframe completion", "reference generation"],
            text: "A held wide of the empty café at closing time, the owner drying a cup behind the counter and the last customer at the window.",
          },
          retentionAnalysis: [
            "<Picture 1> ([Shot 1] first frame): fully_preserved - the take opens on this exact frame.",
            "<Subject 1> (appears in [Shot 1]): fully_preserved - face, glasses, cardigan and apron hold.",
            "<Subject 2> (appears in [Shot 1]): fully_preserved - face, hair and the navy duffle coat hold.",
          ],
          detailedDescription: {
            style: STYLE,
            shots: [
              "The shot begins from <Picture 1>. The camera holds a static shot of the whole café. Behind the counter on the left, <Subject 1> slowly turns the white cup inside the folded cloth in his hands, his head bowed over it, his shoulders easing with each turn. At the window table on the right, <Subject 2> sits still, both hands around her cup, her face turned to the glass; only her breathing lifts her shoulders slightly. Rain runs down the large window in thin bright lines and the blurred blue streetlights beyond it shimmer through the water. The pendant lamps hang still, glowing amber; the upturned chairs on the empty tables, the counter, the stools and the door all hold the position, angle and place they have in the first frame, and nothing slides, turns, tilts, enters or leaves.",
            ],
          },
          overallSoundscape: `${ROOM} A soft squeak of cloth on porcelain from the counter.`,
          nonDiegeticMusic: "N/A",
        },
      });
      return (
        <Composition>
          <Video id="clip" src={motion} hasAudio volume={0.8} />
          <div id="fade" className="absolute inset-0 bg-black" />
          <Animate
            script={({ timeline }) => timeline.to("#fade", { opacity: 0, duration: 0.6 }, 0)}
          />
        </Composition>
      );
    })
      .nextShot("02", ({ script }) => {
        const motion = asset("motion", videoMinimaxH3R2v, {
          image1: animatic.shot("02").image("first"),
          image2: reference.girl,
          startImage: animatic.shot("02").image("first"),
          audioStem: animatic.shot("02").stem,
          prompt: {
            subjectDefinitions: [
              "<Picture 1> is the first frame of [Shot 1].",
              `<Subject 1> is ${GIRL}, as in <Picture 2>.`,
            ],
            summary: {
              tasks: ["keyframe completion", "reference generation"],
              text: "A close shot of the girl at the window table murmuring to herself as she watches the rain.",
            },
            retentionAnalysis: [
              "<Picture 1> ([Shot 1] first frame): fully_preserved - the take opens on this exact frame.",
              "<Subject 1> (appears in [Shot 1]): fully_preserved - face, damp black hair, the navy duffle coat and the cream sweater hold.",
            ],
            detailedDescription: {
              style: STYLE,
              shots: [
                `The shot begins from <Picture 1>. The camera pushes in with small amplitude at slow speed toward her face, ending with her face and the cup still in frame. <Subject 1> (S1), a woman in her early twenties with a soft, slightly husky voice, lets out a slow breath, her shoulders settling; her eyes follow a single raindrop sliding down the glass toward screen right. Barely above a whisper, half to herself, she says, <d>[English] ${script.girl[0]}</d> Her lips meet and the speaking motion stops; she keeps watching the rain, her fingers tightening a little around the empty white cup. Her head stays turned three-quarters toward the glass the whole time, her face still angled enough toward the camera that both eyes and the curve of her cheek stay visible to the end. Rain runs down the window behind her in thin bright lines; the warm amber light on her cheek and the cold blue light from the window hold steady.`,
              ],
            },
            overallSoundscape: `${ROOM} A soft exhale before she speaks.`,
            nonDiegeticMusic: "N/A",
          },
        });
        return (
          <Composition>
            <Video src={motion} hasAudio />
          </Composition>
        );
      })
      .nextShot("03", () => {
        const motion = asset("motion", videoMinimaxH3R2v, {
          image1: animatic.shot("03").image("first"),
          image2: reference.owner,
          startImage: animatic.shot("03").image("first"),
          prompt: {
            subjectDefinitions: [
              "<Picture 1> is the first frame of [Shot 1].",
              `<Subject 1> is ${OWNER}, as in <Picture 2>.`,
            ],
            summary: {
              tasks: ["keyframe completion", "reference generation"],
              text: "Behind the counter the owner stops drying a cup and looks across the room toward the window table.",
            },
            retentionAnalysis: [
              "<Picture 1> ([Shot 1] first frame): fully_preserved - the take opens on this exact frame.",
              "<Subject 1> (appears in [Shot 1]): fully_preserved - face, round gold glasses, cardigan and apron hold.",
            ],
            detailedDescription: {
              style: STYLE,
              shots: [
                "The shot begins from <Picture 1>. The camera holds a static shot. <Subject 1> turns the cup inside the cloth once more, then his hands slow and stop at chest height. He lifts his head and holds a quiet look off screen right toward the window table, his eyes behind the round gold glasses settling, his brows rising slightly and his mouth staying closed. The coffee siphon, the row of cups on the counter, the brass umbrella stand by the door with the yellow umbrella in it, and the rainy blue street in the door's glass all hold the position they have in the first frame.",
              ],
            },
            overallSoundscape: `${ROOM} The cloth stops; a cup is set lightly against its saucer.`,
            nonDiegeticMusic: "N/A",
          },
        });
        return (
          <Composition>
            <Video src={motion} hasAudio volume={0.8} />
          </Composition>
        );
      })
      .nextShot("04", () => {
        const motion = asset("motion", videoMinimaxH3R2v, {
          image1: animatic.shot("04").image("first"),
          image2: reference.umbrella,
          startImage: animatic.shot("04").image("first"),
          prompt: {
            subjectDefinitions: [
              "<Picture 1> is the first frame of [Shot 1].",
              "<Subject 1> is the yellow umbrella in <Picture 2>, a worn mustard-yellow long umbrella with a curved bamboo crook handle.",
            ],
            summary: {
              tasks: ["keyframe completion", "reference generation"],
              text: "An old hand lifts the yellow umbrella out of the brass umbrella stand.",
            },
            retentionAnalysis: [
              "<Picture 1> ([Shot 1] first frame): fully_preserved - the take opens on this exact frame.",
              "<Subject 1> (appears in [Shot 1]): fully_preserved - its mustard-yellow canopy and bamboo handle hold.",
            ],
            detailedDescription: {
              style: STYLE,
              shots: [
                "The shot begins from <Picture 1>. The camera holds a static shot. The old man's thin hand tightens around the bamboo crook handle of <Subject 1> and lifts it steadily straight up; the furled mustard-yellow canopy slides up out of the brass stand, brushing the rim, and rises through the frame until the whole umbrella has left the frame at the top edge. The two black umbrella handles stay in the stand, rocking slightly where the yellow one brushed them, then settle. The brass stand, the floor and the blurred blue door glass behind hold the position they have in the first frame.",
              ],
            },
            overallSoundscape: `${ROOM} The soft scrape of fabric against a brass rim as the umbrella is drawn out.`,
            nonDiegeticMusic: "N/A",
          },
        });
        return (
          <Composition>
            <Video src={motion} hasAudio volume={0.8} />
          </Composition>
        );
      })
      .nextShot("05", ({ script }) => {
        const motion = asset("motion", videoMinimaxH3R2v, {
          image1: animatic.shot("05").image("first"),
          image2: reference.owner,
          image3: reference.girl,
          startImage: animatic.shot("05").image("first"),
          audioStem: animatic.shot("05").stem,
          prompt: {
            subjectDefinitions: [
              "<Picture 1> is the first frame of [Shot 1].",
              `<Subject 1> is ${OWNER}, as in <Picture 2>.`,
              `<Subject 2> is ${GIRL}, as in <Picture 3>.`,
            ],
            summary: {
              tasks: ["keyframe completion", "reference generation"],
              text: "At the window table the owner holds the yellow umbrella out to the girl and tells her to take it.",
            },
            retentionAnalysis: [
              "<Picture 1> ([Shot 1] first frame): fully_preserved - the take opens on this exact frame.",
              "<Subject 1> (appears in [Shot 1]): fully_preserved - face, glasses, cardigan and apron hold.",
              "<Subject 2> (appears in [Shot 1]): fully_preserved - face, hair and the navy duffle coat hold.",
            ],
            detailedDescription: {
              style: STYLE,
              shots: [
                `The shot begins from <Picture 1>. The camera holds a static shot. <Subject 1> (S1), a man in his seventies with a low, warm voice with a little gravel in it, eases the yellow umbrella a little further toward <Subject 2>, the bamboo handle turned to her. Low and unhurried, a small smile in it, he says, <d>[English] ${script.owner[0]}</d> His lips meet and the speaking motion stops; he keeps holding the umbrella out, smiling. <Subject 2> looks up at his face, her eyes widening slightly, her lips staying closed; her hands leave the white cup and rise, and by the end of the shot both of her hands have closed around the bamboo handle beside his, the umbrella held between them. The rain-streaked window behind them, the table and the cup hold their place.`,
              ],
            },
            overallSoundscape: `${ROOM} A floorboard creaks softly under his weight.`,
            nonDiegeticMusic: "N/A",
          },
        });
        return (
          <Composition>
            <Video src={motion} hasAudio />
          </Composition>
        );
      })
      .nextShot("06", () => {
        const motion = asset("motion", videoMinimaxH3R2v, {
          image1: animatic.shot("06").image("first"),
          image2: reference.girl,
          startImage: animatic.shot("06").image("first"),
          prompt: {
            subjectDefinitions: [
              "<Picture 1> is the first frame of [Shot 1].",
              `<Subject 1> is ${GIRL}, as in <Picture 2>, seen small from behind.`,
            ],
            summary: {
              tasks: ["keyframe completion", "reference generation"],
              text: "Through the rainy café window, the girl walks away down the night street under the open yellow umbrella.",
            },
            retentionAnalysis: [
              "<Picture 1> ([Shot 1] first frame): fully_preserved - the take opens on this exact frame.",
              "<Subject 1> (appears in [Shot 1]): partially_preserved - the navy duffle coat and black hair hold; she is small and seen from behind.",
            ],
            detailedDescription: {
              style: STYLE,
              shots: [
                "The shot begins from <Picture 1>. The camera pushes in with small amplitude at slow speed toward the glass, the raindrops on the window growing a little in the foreground. Beyond the glass, <Subject 1> walks away along the far pavement toward the upper right at an easy pace, the open mustard-yellow umbrella held over her head bobbing gently with each step, its glow reflected in the wet asphalt; she grows smaller as she goes. Rain keeps running down the window in thin bright lines, and the streetlights shimmer through the water. The window frame, the shopfronts and the street hold their place.",
              ],
            },
            overallSoundscape:
              "Rain against the café window heard from inside, the muffled patter of rain on the street beyond, faint distant footsteps on wet pavement.",
            nonDiegeticMusic: "N/A",
          },
        });
        return (
          <Composition>
            <Video src={motion} hasAudio volume={0.8} />
            <div
              id="title"
              className="absolute inset-x-0 top-[38%] text-center text-white text-[5.6vmax] tracking-[0.06em] drop-shadow-lg"
              style={{ fontFamily: "Cormorant Garamond", fontStyle: "italic", fontWeight: 500 }}
            >
              Borrowed Umbrella
            </div>
            <div id="fadeout" className="absolute inset-0 bg-black opacity-0" />
            <Animate
              script={({ timeline }) => {
                timeline.from("#title", { opacity: 0, y: 12, duration: 1.4, ease: "power2.out" }, 0.9);
                timeline.to("#fadeout", { opacity: 1, duration: 0.6, ease: "none" }, 3.4);
              }}
            />
          </Composition>
        );
      }),
  }),
});
