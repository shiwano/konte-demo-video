import { defineDirection } from "konte";

export default defineDirection({
  brief: {
    logline:
      "konte の README の Quick start に載せる、Claude Code デスクトップ版での導入手順。空の Claude Code でワークスペースのフォルダを開くところから、konte の Plugin を入れ、`/konte:setup` を経て `/konte-checkin` が動き出すまでを、実際の画面どおりに追う。",
    hook: "空の Claude Code の New session 画面で、カーソルがフォルダ選択の「Choose…」へ素早く動いてクリックする。",
    audience:
      "GitHub で konte の README を開いた、AI で動画を作るエンジニア。音なしで観ることも多い。見終わって言わせたい一言は「これなら数分で入れられる」。",
    tone: "きびきびと、でも追える速さで。クリックやタイピングの箇所には毎回素早いズームで寄り、操作が見えるだけ止めてから次へ進む。画面の移り変わりは操作の結果として切る。README の手順の順に進み、各手順の頭に小さな見出しを出す。",
    look: "画面収録風のモーショングラフィックス。Claude Code デスクトップ版（Windows、ライトテーマ）の画面を、claude_code/ のスクリーンショットに倣って JSX で組み直し、カーソル・クリック・文字入力・ダイアログ・ドロップダウン・トーストを実際に動かす。ウィンドウは落ち着いた無地の背景の上に浮かべる。サイドバーの過去のセッション名、メールアドレス、ユーザー名、フォルダのパスは当たり障りのない文言に差し替え、Windows のフォルダ選択ダイアログは英語表示にする。最後は `/konte-checkin` が動き出したセッション画面で切る。1920×1080。",
    outOfScope: [
      "Claude Code の機能紹介。Settings のほかの項目などを説明しない",
      "ゆっくり漂うカメラやスローモーション",
      "Claude Code や konte に実在しない画面や操作",
      "Codex や CLI での導入手順",
      "konte で動画を作っていく場面",
    ],
    tolerances: [],
  },
  narrator: {
    id: "konteVoice",
    description: "少女、十代前半の明るく軽い声、歯切れがよい。英語。hero 動画の konteちゃんの声。",
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
    fonts: ["Inter", "JetBrains Mono"],
  },
  waivers: {},
  sequence: {
    lens: "satisfying-process",
    pleasure: "satisfying",
    shots: [
      {
        id: "01",
        kind: "graphic",
        role: "before",
        action: "空の New session 画面で、カーソルが入力欄の下の「Choose…」へ動いてクリックする。",
        duration: 2,
        telop: ["1 Open a workspace"],
        script: [{ narration: "Open a folder for your workspace." }],
      },
      {
        id: "02",
        kind: "graphic",
        role: "method",
        action:
          "開いたフォルダ選択ダイアログで、konte-workspace フォルダが選ばれ「Select Folder」が押される。",
        duration: 2.5,
      },
      {
        id: "03",
        kind: "graphic",
        role: "method",
        action:
          "「Trust this workspace?」のダイアログで Trust workspace が押され、入力欄の下のフォルダ欄が konte-workspace に変わる。",
        duration: 2,
        script: [{ narration: "Trust it." }],
      },
      {
        id: "04",
        kind: "graphic",
        role: "method",
        action: "左下のアカウント名がクリックされてメニューが開き、Settings が押される。",
        duration: 2.5,
        telop: ["2 Add the marketplace"],
        script: [{ narration: "Open Settings." }],
      },
      {
        id: "05",
        kind: "graphic",
        role: "method",
        action: "Settings の左の一覧が下へスクロールし、Plugins が押される。",
        duration: 2.5,
        script: [{ narration: "Go to Plugins." }],
      },
      {
        id: "06",
        kind: "graphic",
        role: "method",
        action: "Plugins 画面右上の Add が押されてメニューが開き、Add marketplace が押される。",
        duration: 2,
        script: [{ narration: "Add a marketplace" }],
      },
      {
        id: "07",
        kind: "graphic",
        role: "method",
        action: "「Add marketplace」のダイアログで、Add from a repository が押される。",
        duration: 2,
        script: [{ narration: "from a repository." }],
      },
      {
        id: "08",
        kind: "graphic",
        role: "rhythm",
        action: "URL 欄に `shiwano/konte@plugin` が一文字ずつ打ち込まれる。",
        duration: 3.5,
        script: [{ narration: "Enter the konte repository" }],
      },
      {
        id: "09",
        kind: "graphic",
        role: "rhythm",
        action: '候補の Use "shiwano/konte@plugin" が選ばれ、明るくなった Sync が押される。',
        duration: 2,
        script: [{ narration: "and sync." }],
      },
      {
        id: "10",
        kind: "graphic",
        role: "rhythm",
        action:
          "Plugins の一覧に現れた Konte の行で Add が押され、Added に変わると同時に右下へ「Konte is installed and ready to use.」のトーストが滑り込む。",
        duration: 3,
        telop: ["3 Install konte"],
        script: [{ narration: "Add konte." }],
      },
      {
        id: "11",
        kind: "graphic",
        role: "rhythm",
        action:
          "Settings の右上の × で Settings が閉じ、サイドバーの New がクリックされて、フォルダ欄に konte-workspace が出たままの New session 画面が開く。",
        duration: 2.5,
        telop: ["4 Run setup"],
        script: [{ narration: "In a new session," }],
      },
      {
        id: "12",
        kind: "graphic",
        role: "rhythm",
        action: "入力欄に `/konte` が打ち込まれ、候補の konte:setup が選ばれて送信される。",
        duration: 3.5,
        script: [{ narration: "run konte setup." }],
      },
      {
        id: "13",
        kind: "graphic",
        role: "rhythm",
        action:
          "Konte setup のセッションで、チェックリストの三項目が上から順にチェックされていく。",
        duration: 2.5,
        script: [{ narration: "It sets up the workspace for you." }],
      },
      {
        id: "14",
        kind: "graphic",
        role: "rhythm",
        action:
          "エージェントの返答に、Claude Code を完全に終了して起動し直すよう求める一文が現れ、その文に寄る。",
        duration: 2,
        script: [{ narration: "Then quit and reopen the app." }],
      },
      {
        id: "15",
        kind: "graphic",
        role: "rhythm",
        action:
          "左上のメニューから File → Exit で Claude Code が終了して画面が一瞬暗くなり、起動し直した Claude Code の、フォルダ欄に konte-workspace が出た New session 画面が開く。",
        duration: 2.5,
      },
      {
        id: "16",
        kind: "graphic",
        role: "rhythm",
        action:
          "サイドバーの konte-workspace の横の + で新しいセッションが開き、入力欄に `/konte-checkin` が打ち込まれて送信される。",
        duration: 4,
        telop: ["5 Check in"],
        script: [{ narration: "Now run konte checkin." }],
      },
      {
        id: "17",
        kind: "graphic",
        role: "completion",
        action:
          "Konte checkin のセッションで、チェックリストの最初の項目が動き出し、エージェントが作業を始める。",
        duration: 3.5,
        script: [{ narration: "And you're ready to make videos." }],
      },
    ],
  },
});
