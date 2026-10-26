import { defineReference, asset } from "konte";
import { audioMinimaxH3R2a } from "konte/workspace/adapters/comfy/audio_minimax_h3_r2a.js";
import { audioStableAudio3Medium } from "konte/workspace/adapters/comfy/audio_stable_audio_3_medium.js";
import { imageKrea2TurboT2i } from "konte/workspace/adapters/comfy/image_krea2_turbo_t2i.js";
import direction from "./direction";

const LOOK =
  "2D anime illustration with soft cel shading, clean thin dark-brown line art, gentle painterly gradients";

export default defineReference(direction, {
  references: () => {
  const girl = asset("girl", imageKrea2TurboT2i, {
    prompt: `${LOOK}. Full-body character reference of a young woman in her early twenties standing straight and facing the viewer, arms relaxed at her sides. Shoulder-length straight black hair, the ends slightly damp and separated into strands, a few strands across her forehead. Calm dark-brown eyes, a small closed mouth, pale skin. She wears a navy duffle coat reaching mid-thigh with cream toggle buttons and an upturned hood, over a cream cable-knit sweater whose collar shows at the neck, a charcoal pleated skirt, black tights and brown leather loafers. Plain off-white background, even soft studio light, the figure centred and filling the height of the frame.`,
  });

  const owner = asset("owner", imageKrea2TurboT2i, {
    prompt: `${LOOK}. Full-body character reference of an elderly man in his seventies standing straight and facing the viewer, hands loosely clasped in front of his apron. Short neat white hair, a lined kind face, round thin gold wire glasses, a faint closed-mouth smile. He wears a gray wool cardigan buttoned over a white collared shirt, a long brown canvas apron tied at the waist reaching below his knees, dark brown trousers and black leather shoes. Slightly stooped, slender build. Plain off-white background, even soft studio light, the figure centred and filling the height of the frame.`,
  });

  const umbrella = asset("umbrella", imageKrea2TurboT2i, {
    prompt: `${LOOK}. Object reference of a closed long umbrella standing upright, centred: a worn mustard-yellow canopy furled and tied with a yellow strap, a slim silver ferrule at the bottom tip, and a curved bamboo crook handle at the top, its bamboo nodes visible and the varnish rubbed pale where a hand holds it. Plain off-white background, even soft studio light, the umbrella filling the height of the frame.`,
  });

  const cafe = asset("cafe", imageKrea2TurboT2i, {
    prompt: `${LOOK}, painterly anime background art. The interior of a small old corner café at night after closing, its chairs and stools all vacant, seen from the far end of the counter at seated eye level. Along the left side runs a long dark wooden café counter with a glass coffee siphon, a row of clean white cups upside down on a cloth, and three wooden stools. At the right end of the counter by the glass-panelled door stands a dented brass umbrella stand. On the right wall a large rain-streaked café window looks onto a dark blue night street, rain running down the glass in thin bright lines, blurred streetlights beyond. In front of the window stands a small round wooden window table with two chairs. Warm amber light from three glass pendant lamps fills the room; the street outside is cold blue. Dark wood floor, a chalk menu board on the back wall.`,
  });

  const girlVoice = asset("girlVoice", audioMinimaxH3R2a, {
    prompt: {
      integratedMultimodalDescription: {
        style: "2D-animated.",
        shots: [
          "Medium shot of a young woman in her early twenties sitting at a kitchen table in the afternoon, turning a page of a paperback. She is a woman (S1) with a soft, slightly husky voice, unhurried, speaking at a natural conversational level. She looks up from the book and says, <d>[English] I think I left the kettle on, but it can wait a minute.</d> Her lips meet and she goes back to reading. The camera holds a static shot.",
        ],
      },
      overallSoundscape: "A quiet room, the soft rustle of a page turning, low room tone.",
      nonDiegeticMusic: "N/A",
    },
  });

  const ownerVoice = asset("ownerVoice", audioMinimaxH3R2a, {
    prompt: {
      integratedMultimodalDescription: {
        style: "2D-animated.",
        shots: [
          "Medium shot of an elderly man in his seventies standing at a shop counter in the morning, wiping it with a cloth. He is a man (S1) with a low, warm voice with a little gravel in it, slow. He glances up toward a customer and says, <d>[English] The bread comes in at nine, so there's a little while yet.</d> His lips meet and he goes back to wiping the counter. The camera holds a static shot.",
        ],
      },
      overallSoundscape: "A quiet shop, a cloth wiping a wooden counter, low room tone.",
      nonDiegeticMusic: "N/A",
    },
  });

  const bgm = asset("bgm", audioStableAudio3Medium, {
    category: "Music",
    duration: 30,
    prompt:
      "quiet solo felt piano, sparse slow chords, soft sustain pedal, warm close-miked intimate recording, gentle and tender, 66 bpm, light room reverb",
  });

  const rain = asset("rain", audioStableAudio3Medium, {
    category: "SFX",
    duration: 30,
    prompt:
      "steady night rain against a large café window heard from inside, soft drips, faint distant city traffic, warm quiet room tone",
  });

  return { girl, owner, umbrella, cafe, girlVoice, ownerVoice, bgm, rain };
  },
});
