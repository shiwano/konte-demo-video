import { defineAnimatic, asset, Audio, Composition, Panel } from "konte";
import { audioMinimaxH3R2a } from "konte/workspace/adapters/comfy/audio_minimax_h3_r2a.js";
import { imageMinimaxH3R2i } from "konte/workspace/adapters/comfy/image_minimax_h3_r2i.js";
import direction from "./direction";
import reference from "./reference";

const STYLE =
  "2D-animated, painterly anime background art with soft cel-shaded figures and clean thin dark-brown line art.";

const GIRL =
  "the young woman in a navy duffle coat with cream toggle buttons over a cream cable-knit sweater, shoulder-length straight black hair with the ends damp and separated into strands";
const OWNER =
  "the elderly man in a gray cardigan and brown apron, short white hair, round thin gold wire glasses, a white collared shirt under the gray wool cardigan, a long brown canvas apron";
const UMBRELLA =
  "the yellow umbrella, a worn mustard-yellow long umbrella with a curved bamboo crook handle";
const LIGHT =
  "Warm amber light from glass pendant lamps fills the café; the street beyond the window is cold night blue, rain running down the glass in thin bright lines.";

export default defineAnimatic(direction, {
  timeline: ({ shot }) => ({
    shots: shot("01", () => {
      const first = asset("first", imageMinimaxH3R2i, {
        image1: reference.cafe,
        image2: reference.owner,
        image3: reference.girl,
        prompt: {
          subjectDefinitions: [
            "<Subject 1> is the corner café in <Picture 1>: a long dark wooden café counter along the left with a coffee siphon and clean cups, a small round wooden window table against a large rain-streaked café window on the right.",
            `<Subject 2> is ${OWNER}, as in <Picture 2>.`,
            `<Subject 3> is ${GIRL}, as in <Picture 3>.`,
          ],
          summary: {
            tasks: ["reference generation"],
            text: "A wide still of the empty café at closing time, the owner behind the counter and one customer left at the window table.",
          },
          retentionAnalysis: [
            "<Subject 1> (appears in [Shot 1]): fully_preserved - the room, its counter, window table, window and lamps are kept with the same layout and light.",
            "<Subject 2> (appears in [Shot 1]): fully_preserved - face, glasses, hair, cardigan and apron are kept.",
            "<Subject 3> (appears in [Shot 1]): fully_preserved - face, hair and the navy duffle coat are kept; she is seated instead of standing.",
          ],
          detailedDescription: {
            style: STYLE,
            shots: [
              `A wide shot from the far end of the counter at seated eye level, looking down the length of the room. The dark wooden café counter runs along the left third of the frame toward the back; behind it, about a third of the way in from the left edge, <Subject 2> stands facing screen right with his torso turned three-quarters toward the camera, head bowed slightly, both hands at waist height holding a white cup and a folded cloth, the cup inside the cloth. On the right, against the large rain-streaked café window, <Subject 3> sits alone at the small round wooden window table, seen side-on, facing screen left toward the room's back wall with her face turned to the window, both hands resting around a white cup on the table, her shoulders slightly drawn up in the navy duffle coat. The other small tables in the middle of the room each have two wooden chairs turned upside down on top of them, legs pointing at the ceiling. The two figures stand on the dark wood floor, the owner's feet hidden behind the counter, the girl's chair legs on the floor near the window wall. ${LIGHT} The girl at the window is the brightest, cleanest figure in the frame, the owner smaller and further back.`,
            ],
          },
        },
      });
      return (
        <Composition>
          <Panel
              src={first}
              blocking="The owner turns the cup slowly inside the cloth behind the counter; the girl stays still at the window table, watching the rain."
              camera="fixed"
            />
        </Composition>
      );
    })
      .nextShot("02", ({ shot, script }) => {
        const first = asset("first", imageMinimaxH3R2i, {
          image1: shot("01").image("first"),
          image2: reference.cafe,
          image3: reference.girl,
          prompt: {
            subjectDefinitions: [
              "<Picture 1> is the frame the cut comes from, the wide of the café.",
              "<Subject 1> is the corner café in <Picture 2>: the large rain-streaked café window and the small round wooden window table.",
              `<Subject 2> is ${GIRL}, as in <Picture 3>; her expression is remade as the description writes it.`,
            ],
            summary: {
              tasks: ["keyframe completion", "reference generation"],
              text: "A cut in from the wide of the café to a close shot of the girl at the window table.",
            },
            retentionAnalysis: [
              "<Picture 1> ([Shot 1] frame): partially_preserved - the shot the cut comes from; its light and the girl's place at the window carry into the close shot.",
              "<Subject 1> (appears in [Shot 2]): attribute_transfer - the window, the rain and the amber light are carried to a closer camera position.",
              "<Subject 2> (appears in [Shot 1], [Shot 2]): fully_preserved - face, damp black hair, the navy duffle coat and the cream sweater are kept.",
            ],
            detailedDescription: {
              style: STYLE,
              shots: [
                "The shot holds <Picture 1>.",
                `The camera cuts in from the whole room to the girl alone at the window table, at seated eye level, her head and shoulders filling the left half of the frame and her hands at the bottom edge. <Subject 2> sits facing screen right, her torso turned three-quarters toward the camera, her head turned further toward the large rain-streaked window that fills the right half of the frame. Her chin is lowered slightly, her eyes half lowered and looking out at the rain toward screen right, her mouth closed and soft, her brows relaxed. Both hands are wrapped around a white cup on the small round wooden window table in the lower left of the frame, fingers interlaced around it, the cup empty. Damp strands of black hair rest against her cheek. Beyond the glass, rain runs down in thin bright lines over blurred blue streetlights. Warm amber light from a pendant lamp off the upper left edge falls on her cheek and the cup; the window side of her face is lit cold blue.`,
              ],
            },
          },
        });
        const line = asset("line", audioMinimaxH3R2a, {
          image1: reference.girl,
          audio1: reference.girlVoice,
          prompt: {
            subjectDefinitions: [
              `<Subject 1> is ${GIRL}, as in <Picture 1>; she is the speaker (S1).`,
              "<Audio 1> is the voice-timbre reference for <Subject 1> (S1).",
            ],
            summary: {
              tasks: ["reference generation", "audio reference"],
              text: "A young woman alone at a café window table murmurs one line to herself while watching the rain.",
            },
            retentionAnalysis: [
              "<Subject 1> (appears in [Shot 1]): weak_reference - only the speaker's age and presence are taken.",
              "<Audio 1>: weak_reference - the speaker follows its soft, slightly husky timbre.",
            ],
            detailedDescription: {
              style: STYLE,
              shots: [
                `Close shot of <Subject 1> (S1), a woman in her early twenties with a soft, slightly husky voice, sitting alone at a small window table in an empty café at closing time, both hands around an empty cup, watching the rain run down the glass. She lets out a slow breath and, barely above a whisper, half to herself, resigned and quietly content, says, <d>[English] ${script.girl[0]}</d> Her lips meet and she goes on watching the rain, still.`,
              ],
            },
            overallSoundscape:
              "Steady rain against a large window close by, soft drips, the faint hum of a quiet café after closing.",
            nonDiegeticMusic: "N/A",
          },
        });
        return (
          <Composition>
            <Panel
              src={first}
              blocking="She lets out a slow breath; her eyes follow a drop down the glass while her hands stay wrapped around the cup."
              camera="A slow push in toward her face, landing with her eyes and the cup in frame."
            />
            <Audio id="girl-line" src={line} start={0.6} />
          </Composition>
        );
      })
      .nextShot("03", () => {
        const first = asset("first", imageMinimaxH3R2i, {
          image1: reference.cafe,
          image2: reference.owner,
          image3: reference.umbrella,
          prompt: {
            subjectDefinitions: [
              "<Subject 1> is the corner café in <Picture 1>: the dark wooden café counter, the coffee siphon, the clean cups, the glass-panelled door and the brass umbrella stand.",
              `<Subject 2> is ${OWNER}, as in <Picture 2>.`,
              `<Subject 3> is ${UMBRELLA}, as in <Picture 3>.`,
            ],
            summary: {
              tasks: ["reference generation"],
              text: "A medium still behind the counter: the owner pauses mid-task and looks across the room.",
            },
            retentionAnalysis: [
              "<Subject 1> (appears in [Shot 1]): attribute_transfer - the counter, the door, the umbrella stand and the amber light are carried to a reverse camera position looking back at the counter.",
              "<Subject 2> (appears in [Shot 1]): fully_preserved - face, glasses, hair, cardigan and apron are kept.",
              "<Subject 3> (appears in [Shot 1]): fully_preserved - its colour, furled canopy and bamboo handle are kept.",
            ],
            detailedDescription: {
              style: STYLE,
              shots: [
                `A medium shot from the window table looking back at the counter, at standing eye level. The dark wooden café counter crosses the lower third of the frame from the left edge to the right, a glass coffee siphon on it at the left and a row of clean white cups beside it. Behind the counter, just left of centre, <Subject 2> is seen from the waist up, torso facing the camera, a white cup in his left hand at chest height and a folded cloth pressed inside it by his right hand, both hands paused. His head is turned slightly toward screen right and lifted, his eyes behind the round gold glasses looking past the camera's right side toward the window table off-frame, his mouth closed, brows a little raised. At the right end of the counter, beside the glass-panelled door, stands a dented brass umbrella stand; in it, among two dark umbrellas, <Subject 3> leans with its bamboo crook handle above the rim, the one yellow thing in the frame. The pendant lamps above the counter light him warm amber; the door's glass shows the blue rainy street.`,
              ],
            },
          },
        });
        return (
          <Composition>
            <Panel
              src={first}
              blocking="He stops turning the cup, lifts his head and holds his look off screen right toward the window table."
              camera="fixed"
            />
          </Composition>
        );
      })
      .nextShot("04", () => {
        const first = asset("first", imageMinimaxH3R2i, {
          image1: reference.umbrella,
          image2: reference.owner,
          image3: reference.cafe,
          prompt: {
            subjectDefinitions: [
              `<Subject 1> is ${UMBRELLA}, as in <Picture 1>.`,
              `<Subject 2> is the elderly man in a gray cardigan and brown apron in <Picture 2>; only his old, thin right hand with age spots and his loose gray wool cardigan cuff are in frame.`,
              "<Subject 3> is the corner café in <Picture 3>: the dark wood floor by the door and the brass umbrella stand.",
            ],
            summary: {
              tasks: ["reference generation"],
              text: "An insert of the umbrella stand by the door, an old hand closing on the yellow umbrella's handle.",
            },
            retentionAnalysis: [
              "<Subject 1> (appears in [Shot 1]): fully_preserved - its mustard-yellow furled canopy, strap and bamboo crook handle are kept.",
              "<Subject 2> (appears in [Shot 1]): partially_preserved - only the hand and the gray cardigan cuff are taken.",
              "<Subject 3> (appears in [Shot 1]): attribute_transfer - the floor, the brass stand and the amber light are carried into a low close camera.",
            ],
            detailedDescription: {
              style: STYLE,
              shots: [
                `An insert at the height of the umbrella stand's rim, the camera low and close. A dented brass umbrella stand fills the lower half of the frame, its round mouth just below centre. Out of it rise three umbrella handles: two black plastic handles at the left and, in the centre, the curved bamboo crook handle of <Subject 1>, its furled mustard-yellow canopy disappearing into the stand. Entering from the upper right edge of the frame, the right hand of <Subject 2>, a man in his seventies, reaches down: a thin, bony old hand with prominent knuckles, loose creased skin over the back and a few pale brown age spots, the loose gray wool cardigan cuff hanging over the wrist and halfway down the back of the hand, with the palm turned toward the camera, the fingers already curled around the bamboo crook, the thumb on its top. The bamboo handle is the brightest, warmest point in the frame, lit amber from above; the background beyond the stand falls into soft dark wood and a blur of blue from the door's glass.`,
              ],
            },
          },
        });
        return (
          <Composition>
            <Panel
              src={first}
              blocking="His hand closes on the bamboo handle and lifts the umbrella straight up out of the stand, leaving the frame at the top edge."
              camera="fixed"
            />
          </Composition>
        );
      })
      .nextShot("05", ({ script }) => {
        const first = asset("first", imageMinimaxH3R2i, {
          image1: reference.cafe,
          image2: reference.owner,
          image3: reference.girl,
          image4: reference.umbrella,
          prompt: {
            subjectDefinitions: [
              "<Subject 1> is the corner café in <Picture 1>: the small round wooden window table and the large rain-streaked café window behind it.",
              `<Subject 2> is ${OWNER}, as in <Picture 2>.`,
              `<Subject 3> is ${GIRL}, as in <Picture 3>; her expression is remade as the description writes it.`,
              `<Subject 4> is ${UMBRELLA}, as in <Picture 4>.`,
            ],
            summary: {
              tasks: ["reference generation"],
              text: "A medium two-shot at the window table: the owner holds the furled yellow umbrella out to the seated girl.",
            },
            retentionAnalysis: [
              "<Subject 1> (appears in [Shot 1]): attribute_transfer - the window table, the rainy window and the amber light are carried to a side-on medium camera.",
              "<Subject 2> (appears in [Shot 1]): fully_preserved - face, glasses, hair, cardigan and apron are kept.",
              "<Subject 3> (appears in [Shot 1]): fully_preserved - face, damp black hair and the navy duffle coat are kept; she is seated.",
              "<Subject 4> (appears in [Shot 1]): fully_preserved - the mustard-yellow furled canopy and the bamboo crook handle are kept.",
            ],
            detailedDescription: {
              style: STYLE,
              shots: [
                `A medium two-shot side-on to the window table at standing eye level, the large rain-streaked café window filling the back of the frame. On the left, <Subject 2> stands beside the table, seen from the knees up, torso turned three-quarters toward screen right, leaning slightly forward from the waist; his right arm extends forward and a little down toward screen right, elbow nearly straight, and his right hand holds <Subject 4> horizontally by its middle, the bamboo crook handle pointing toward the girl, the furled mustard-yellow canopy lying along his forearm. His head tilts toward her, his eyes behind the round gold glasses looking down at her, a small closed-mouth smile. On the right, <Subject 3> sits at the small round wooden window table, seen from the waist up, torso facing screen left toward him, her hands still around the white cup on the table; her head is tilted up toward his face, her eyes lifted to him and slightly widened, her lips just parted in surprise. The umbrella's bamboo handle hangs in the gap between them, about a hand's width from her shoulder. Both figures meet the dark wood floor, his shoes beside the table leg. ${LIGHT} The yellow umbrella is the most saturated thing in the frame.`,
              ],
            },
          },
        });
        const line = asset("line", audioMinimaxH3R2a, {
          image1: reference.owner,
          audio1: reference.ownerVoice,
          prompt: {
            subjectDefinitions: [
              `<Subject 1> is ${OWNER}, as in <Picture 1>; he is the speaker (S1).`,
              "<Audio 1> is the voice-timbre reference for <Subject 1> (S1).",
            ],
            summary: {
              tasks: ["reference generation", "audio reference"],
              text: "An old café owner offers his umbrella to the last customer at closing time, lightly and kindly.",
            },
            retentionAnalysis: [
              "<Subject 1> (appears in [Shot 1]): weak_reference - only the speaker's age and presence are taken.",
              "<Audio 1>: weak_reference - the speaker follows its low, warm, slightly gravelly timbre.",
            ],
            detailedDescription: {
              style: STYLE,
              shots: [
                `Medium shot of <Subject 1> (S1), a man in his seventies with a low, warm voice with a little gravel in it, standing beside a small window table in an empty café at closing time, holding a furled umbrella out to a young woman seated there. Low and unhurried, a small smile in his voice, light and offhand as though handing over a spare napkin, he says, <d>[English] ${script.owner[0]}</d> His lips meet and he waits, the umbrella still held out.`,
              ],
            },
            overallSoundscape:
              "Steady rain against a large window close by, the faint creak of a wooden floor under a step, a quiet café after closing.",
            nonDiegeticMusic: "N/A",
          },
        });
        return (
          <Composition>
            <Panel
              src={first}
              blocking="He holds the umbrella a little further toward her; she looks up at him and her hands leave the cup."
              camera="fixed"
            />
            <Audio id="owner-line" src={line} start={0.8} />
          </Composition>
        );
      })
      .nextShot("06", () => {
        const first = asset("first", imageMinimaxH3R2i, {
          image1: reference.cafe,
          image2: reference.girl,
          image3: reference.umbrella,
          prompt: {
            subjectDefinitions: [
              "<Subject 1> is the corner café in <Picture 1>: the large rain-streaked café window and its wooden frame, and the blue night street seen through it.",
              `<Subject 2> is ${GIRL}, as in <Picture 2>.`,
              `<Subject 3> is ${UMBRELLA}, as in <Picture 3>, here opened.`,
            ],
            summary: {
              tasks: ["reference generation"],
              text: "A wide still through the café window: the girl walking away down the rainy street under the open yellow umbrella.",
            },
            retentionAnalysis: [
              "<Subject 1> (appears in [Shot 1]): attribute_transfer - the window frame, the rain on the glass and the blue street are carried to a camera at the window looking out.",
              "<Subject 2> (appears in [Shot 1]): partially_preserved - the navy duffle coat and black hair are kept; she is small and seen from behind.",
              "<Subject 3> (appears in [Shot 1]): partially_preserved - the mustard-yellow colour and bamboo handle are kept; the canopy is opened.",
            ],
            detailedDescription: {
              style: STYLE,
              shots: [
                `A wide shot from inside the café at the window table, at seated eye level, looking out through the large rain-streaked café window. The dark wooden window frame borders the left and bottom edges of the frame; the glass fills the rest, rain running down it in thin bright lines and beaded drops catching the café's amber light in the lower corners. Beyond the glass, the night street runs away from the camera toward the upper right, wet asphalt reflecting blurred blue and white streetlights, dark shopfronts on the far side. In the middle distance, a little right of centre and about a fifth of the frame's height, <Subject 2> walks away from the camera along the far pavement, seen from behind, her navy duffle coat dark against the wet street, her right arm raised holding <Subject 3> open over her head, the round mustard-yellow canopy glowing as the one warm colour outside, her feet on the shining pavement. The upper third of the frame is soft dark blue sky and rain. Cold blue night outside, a faint amber reflection of the café's pendant lamp on the glass at the upper left.`,
              ],
            },
          },
        });
        return (
          <Composition>
            <Panel
              src={first}
              blocking="She walks away down the far pavement toward the upper right, growing smaller under the yellow umbrella."
              camera="A very slow push in toward the glass, the rain drops growing in the foreground."
            />
          </Composition>
        );
      }),
  }),
});
