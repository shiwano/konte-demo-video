import { defineDirection } from "konte";

export default defineDirection({
  brief: {
    logline:
      "At closing time on a rainy night, the old café owner lends his last customer the yellow umbrella from the stand by the door.",
    hook: "Rain running down a café window at closing time, and one girl at the window table with nowhere dry to go.",
    audience:
      "People who watch short films on a quiet evening. They leave with the small warmth of a stranger's kindness.",
    tone: "Quiet, tender and unhurried. Nobody explains anything; the kindness is in a gesture and two short lines.",
    look: "2D anime with painterly backgrounds and soft cel shading. A warm amber café interior against the cold blue of a rainy night outside; the yellow umbrella is the only saturated colour in the piece. Slow cuts, eye-level camera, long holds.",
    outOfScope: [
      "Romance between the girl and the owner",
      "The rain letting up or a sunny ending",
      "Tears, a music swell or a speech about kindness",
    ],
    tolerances: ["Lettering on the menu board and shop signs may render as unreadable glyphs."],
  },
  policy: {
    format: {
      fps: 24,
      size: {
        megapixels: 0.9,
        delivery: { width: 1280, height: 720 },
      },
    },
    lang: "en",
    fonts: ["Cormorant Garamond", "Inter"],
  },
  characters: {
    girl: {
      name: "the girl in the navy coat",
      promptDepiction: "young woman in a navy duffle coat",
      description:
        "Early twenties, shoulder-length black hair still damp at the ends, a navy duffle coat over a cream knit sweater. No umbrella.",
      voice: {
        id: "girlVoice",
        description: "Female, early twenties, soft and slightly husky, unhurried.",
      },
    },
    owner: {
      name: "the old café owner",
      promptDepiction: "elderly man in a gray cardigan and brown apron",
      description:
        "Seventies, short white hair, round wire glasses, a gray cardigan under a brown canvas apron. Moves slowly and never hurries a customer.",
      voice: {
        id: "ownerVoice",
        description: "Male, seventies, low and warm with a little gravel, slow.",
      },
    },
  },
  props: {
    umbrella: {
      name: "the yellow umbrella",
      promptDepiction: "mustard-yellow long umbrella",
      description:
        "A worn, mustard-yellow long umbrella with a curved bamboo handle; the one thing in the café that is not amber or brown.",
    },
  },
  locations: {
    cafe: {
      name: "the corner café",
      description:
        "A small old café at night, dark wood and warm amber pendant lights, almost empty at closing time. Rain on a dark street outside.",
      landmarks: {
        window: {
          name: "the rain-streaked window",
          promptDepiction: "large rain-streaked café window",
          description:
            "A tall window beside the window table, rain running down the glass over the blue night street.",
        },
        counter: {
          name: "the counter",
          promptDepiction: "dark wooden café counter",
          description: "A long dark wooden counter with a coffee siphon and a row of clean cups.",
        },
        windowTable: {
          name: "the window table",
          promptDepiction: "small round wooden window table",
          description: "A small round wooden table for two, pressed against the window.",
        },
        umbrellaStand: {
          name: "the umbrella stand",
          promptDepiction: "brass umbrella stand",
          description: "A dented brass umbrella stand by the door at the end of the counter.",
        },
      },
    },
  },
  setups: {
    cafeWide: {
      name: "the café, wide",
      description:
        "From the far end of the counter at seated eye level, the whole room: the counter along the left, the window table against the rain-streaked window on the right.",
      location: "cafe",
      framing: "wide",
      within: null,
      view: "front",
      holds: ["counter", "windowTable", "window"],
    },
    tableMedium: {
      name: "the window table, medium",
      description:
        "Side-on to the window table at standing eye level, the window filling the back of the frame.",
      location: "cafe",
      framing: "medium",
      within: "cafeWide",
      holds: ["windowTable", "window"],
    },
    girlClose: {
      name: "the girl, close",
      description:
        "Tight on the girl's face and hands at the window table, at seated eye level, the rain-streaked glass soft behind her.",
      location: "cafe",
      framing: "close",
      within: "tableMedium",
      holds: ["windowTable", "window"],
    },
    counterMedium: {
      name: "the counter, medium",
      description:
        "From the window table looking back at the counter at standing eye level, the door and the umbrella stand at the right end of the counter.",
      location: "cafe",
      framing: "medium",
      within: null,
      view: "front",
      holds: ["counter", "umbrellaStand"],
    },
    standInsert: {
      name: "the umbrella stand, insert",
      description:
        "Low at the umbrella stand by the door, its mouth and the umbrella handles filling the frame.",
      location: "cafe",
      framing: "insert",
      view: "front",
      holds: [],
    },
    windowOut: {
      name: "through the window, wide",
      description:
        "From inside at the window table, looking out through the rain-streaked glass at the night street.",
      location: "cafe",
      framing: "wide",
      within: null,
      view: "front",
      holds: ["window"],
    },
  },
  sequence: {
    lens: "kishotenketsu",
    pleasure: "emotional",
    shots: [
      {
        id: "01",
        role: "ki",
        action:
          "Rain streams down the rain-streaked window beside the girl in the navy coat, the last customer left at the window table with the other chairs already upturned on their tables, while the old café owner dries cups behind the counter.",
        setup: "cafeWide",
        duration: 4,
        lineup: ["owner", "girl"],
      },
      {
        id: "02",
        role: "sho",
        action:
          "The girl in the navy coat wraps both hands around her empty cup and watches the rain.",
        setup: "girlClose",
        duration: 3.5,
        lineup: ["girl"],
        script: [
          {
            character: "girl",
            text: "It's not going to stop, is it?",
            acting: "Barely above a whisper, half to herself, resigned but not unhappy.",
          },
        ],
      },
      {
        id: "03",
        role: "sho",
        action:
          "Behind the counter, the old café owner stops drying a cup and looks over at the girl in the navy coat.",
        setup: "counterMedium",
        duration: 3,
        lineup: ["owner"],
      },
      {
        id: "04",
        role: "ten",
        action: "The old café owner's hand lifts the yellow umbrella out of the umbrella stand.",
        setup: "standInsert",
        duration: 2.5,
        lineup: ["owner"],
      },
      {
        id: "05",
        role: "ketsu",
        action:
          "At the window table, the old café owner holds the yellow umbrella out to the girl in the navy coat.",
        setup: "tableMedium",
        duration: 4,
        lineup: ["owner", "girl"],
        script: [
          {
            character: "owner",
            text: "Take it. Bring it back whenever.",
            acting: "Low and unhurried, a small smile in it, as if it were nothing at all.",
          },
        ],
      },
      {
        id: "06",
        role: "ketsu",
        action:
          "Beyond the rain-streaked window, the girl in the navy coat walks away down the street under the open yellow umbrella.",
        setup: "windowOut",
        duration: 4,
        lineup: ["girl"],
        telop: ["Borrowed Umbrella"],
      },
    ],
  },
  waivers: {
    "opening-key_02":
      "旧konteで生成したテイクを維持する。motionはキーフレームから開始する旧方式のまま。",
    "opening-key_05":
      "旧konteで生成したテイクを維持する。motionはキーフレームから開始する旧方式のまま。",
  },
});
