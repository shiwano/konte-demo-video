import { defineDirection } from "konte";

export default defineDirection({
  brief: {
    logline:
      "konte の README「How you use it」に載せるデモ。短編 Borrowed Umbrella が `/konte-checkin` から書き出された MP4 になるまでを、Claude Code のターミナルと konte のレビュー画面が交互に受け渡していく。",
    hook: "暗い Claude Code のターミナルに `/konte-checkin` が打ち込まれ、Enter と同時にエージェントが動き出す。",
    audience:
      "GitHub で konte の README を開いた、AI で動画を作るエンジニア。音なしで観ることも多い。見終わって言わせたい一言は「konte がどう動くのか、イメージがわいた」。",
    tone: "速く、キレよく。手際よく制作が回っていく道具の格好良さ。場面は操作の瞬間で切る。ターミナルからレビュー画面へは、エージェントがプレビューを開いたところで移る。レビュー画面同士の移り変わりは、各画面の頭にあるエージェントのハンドオフの一文が担う。注目させたい箇所には素早いズームで寄る。README の5つの手順の順に進み、各手順の頭に小さな見出しを出す。",
    look: "画面収録風のモーショングラフィックス。konte のレビュー画面（ダークテーマ）と Claude Code のターミナルを JSX で組み直し、文字入力・カーソル・クリック・スクロール・ピンの配置を実際に動かす。画面の中の作品は 2D アニメ調の Borrowed Umbrella。最後は書き出し完了のターミナルで切る。1920×1080。",
    outOfScope: [
      "機能の羅列。タイムライン、ピン、テイクなどに名前を付けて順に紹介しない",
      "ゆっくり漂うカメラやスローモーション",
      "物語や登場人物。konteちゃんは声だけで、姿は出さない",
      "konte に実在しない画面や操作",
      "完成した Borrowed Umbrella の本編を流すこと",
    ],
    tolerances: [],
  },
  narrator: {
    id: "konteVoice",
    description:
      "少女、十代前半の明るく軽い声、早口で歯切れがよい。英語。hero 動画の konteちゃんの声。",
  },
  characters: {},
  locations: {},
  setups: {},
  policy: {
    format: {
      fps: 24,
      size: {
        megapixels: 2.1,
        delivery: { width: 1920, height: 1080 },
      },
    },
    lang: "en",
    fonts: ["Inter", "JetBrains Mono", "Cormorant Garamond"],
  },
  waivers: {},
  sequence: {
    lens: "satisfying-process",
    pleasure: "cool",
    shots: [
      {
        id: "01",
        kind: "graphic",
        role: "before",
        action:
          "Claude Code のターミナルに `/konte-checkin` が一文字ずつ打ち込まれて送信され、エージェントの返答が流れ始める。",
        duration: 2.5,
        telop: ["1 Plan"],
        script: [{ narration: "Start with one command." }],
      },
      {
        id: "02",
        kind: "graphic",
        role: "method",
        action:
          "ターミナルで、エージェントが出した三つの案の選択肢のうち、Borrowed Umbrella の案が選ばれて確定する。",
        duration: 3,
        script: [{ narration: "Tell the agent what you want to make." }],
      },
      {
        id: "03",
        kind: "graphic",
        role: "method",
        action:
          "エージェントが開いた direction のレビュー画面で、6ショットの脚本が下から上へスクロールしていく。",
        duration: 5.5,
        script: [{ narration: "It writes the direction: the story, the look, and every shot." }],
      },
      {
        id: "04",
        kind: "graphic",
        role: "method",
        action:
          "Accept all に続いて Submit Review が押され、direction の全セクションが Accepted に変わる。",
        duration: 2,
        script: [{ narration: "You accept it." }],
      },
      {
        id: "05",
        kind: "graphic",
        role: "rhythm",
        action:
          "次に開いた reference のレビュー画面で、紺のコートの女の子の候補のひとつが Accepted になる。",
        duration: 3.5,
        telop: ["2 Review shared assets"],
        script: [{ narration: "Next, accept the shared characters and places." }],
      },
      {
        id: "06",
        kind: "graphic",
        role: "rhythm",
        action:
          "画面が reference の下へ流れ、店主、黄色い傘、喫茶店の候補が次々に Accepted になる。",
        duration: 2,
      },
      {
        id: "07",
        kind: "graphic",
        role: "rhythm",
        action:
          "ターミナルで、reference のレビューを受け取ったエージェントが animatic の生成を走らせ、完了の通知が届く。",
        duration: 3,
        telop: ["3 Review the cut"],
        script: [{ narration: "The agent draws a timed storyboard." }],
      },
      {
        id: "08",
        kind: "graphic",
        role: "rhythm",
        action:
          "エージェントが開いた animatic のレビュー画面で、再生位置がタイムラインを走り、絵コンテのパネルが順に切り替わる。",
        duration: 3,
        script: [{ narration: "You review it in your browser." }],
      },
      {
        id: "09",
        kind: "graphic",
        role: "rhythm",
        action:
          "生成を終えて開いた video のレビュー画面で、再生位置がショット03から04へ走り、絵コンテのパネルだった画が動く映像で流れる。",
        duration: 3,
        script: [{ narration: "Then each shot becomes video." }],
      },
      {
        id: "10",
        kind: "graphic",
        role: "rhythm",
        action:
          "video のレビュー画面で、店主が傘を差し出したまま彼女の手がまだ伸びないショット05のフレーム上、傘の柄にカーソルがピンを置く。",
        duration: 2.5,
        telop: ["4 Revise"],
        script: [{ narration: "Pin what you want changed." }],
      },
      {
        id: "11",
        kind: "graphic",
        role: "rhythm",
        action: "ピンのコメント欄に「She should take the umbrella here.」と打ち込まれる。",
        duration: 2.5,
        script: [{ narration: "Then leave a note." }],
      },
      {
        id: "12",
        kind: "graphic",
        role: "rhythm",
        action: "Submit Review が押される。",
        duration: 1.5,
      },
      {
        id: "13",
        kind: "graphic",
        role: "rhythm",
        action:
          "ターミナルで、エージェントがショット05の新しいテイクの生成を走らせ、完了の通知が届く。",
        duration: 2.5,
        script: [{ narration: "The agent makes a new take." }],
      },
      {
        id: "14",
        kind: "graphic",
        role: "rhythm",
        action:
          "エージェントが開き直した video のレビュー画面で、ピンの位置の傘の柄を彼女の両手が握っているショット05の新しいテイクが、Accepted になる。",
        duration: 2.5,
        script: [{ narration: "Keep the one you like." }],
      },
      {
        id: "15",
        kind: "graphic",
        role: "completion",
        action:
          "ターミナルで、全ショットの承認を受けたエージェントが書き出しを走らせ、完了の通知が届いて MP4 のパスと仕様を報告する。",
        duration: 4,
        telop: ["5 Export"],
        script: [{ narration: "Accept the cut, and the agent renders the MP4." }],
      },
    ],
  },
});
