import { defineDirection } from "konte";

export default defineDirection({
  brief: {
    logline:
      "konte の README の Quick start に載せる、Codex デスクトップ版での導入手順。空の Codex でワークスペースのフォルダをプロジェクトにするところから、Plugin marketplace を足して konte を入れ、`$konte:setup` を経て `$konte-checkin` が動き出すまでを、実際の画面どおりに追う。",
    hook: "空の Codex のホーム画面で、カーソルが入力欄の上の「Choose project」へ素早く動いてクリックする。",
    audience:
      "GitHub で konte の README を開いた、AI で動画を作るエンジニア。音なしで観ることも多い。見終わって言わせたい一言は「これなら数分で入れられる」。",
    tone: "きびきびと、でも追える速さで。クリックやタイピングの箇所には毎回素早いズームで寄り、操作が見えるだけ止めてから次へ進む。画面の移り変わりは操作の結果として切る。README の手順の順に進み、各手順の頭に小さな見出しを出す。",
    look: "画面収録風のモーショングラフィックス。Codex デスクトップ版（Windows、ライトテーマ）の画面を、codex/ のスクリーンショットに倣って JSX で組み直し、カーソル・クリック・文字入力・ダイアログ・ドロップダウン・スピナーを実際に動かす。ウィンドウは落ち着いた無地の背景の上に浮かべる。サイドバーのペットや過去のチャット名、アカウント名、フォルダのパスは当たり障りのない文言に差し替え、Windows のフォルダ選択ダイアログとエージェントの返答は英語表示にする。最後は `$konte-checkin` が動き出したチャット画面で切る。1920×1080。",
    outOfScope: [
      "Codex の機能紹介。Settings のほかの項目などを説明しない",
      "ゆっくり漂うカメラやスローモーション",
      "Codex や konte に実在しない画面や操作",
      "Claude Code や CLI での導入手順",
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
        action: "空のホーム画面で、カーソルが入力欄の上の「Choose project」へ動いてクリックする。",
        duration: 2,
        telop: ["1 Open a workspace"],
        script: [{ narration: "Create a project." }],
      },
      {
        id: "02",
        kind: "graphic",
        role: "method",
        action: "「Create project」のダイアログが開き、Source folders の Add が押される。",
        duration: 2,
        script: [{ narration: "Add your workspace folder." }],
      },
      {
        id: "03",
        kind: "graphic",
        role: "method",
        action:
          "開いたフォルダ選択ダイアログで、konte-workspace フォルダが選ばれ「Select Folder」が押される。",
        duration: 2.5,
      },
      {
        id: "04",
        kind: "graphic",
        role: "method",
        action:
          "名前と Source folders に konte-workspace が入ったダイアログで Create project が押され、「Trust this folder?」で Trust folder が押され、ダイアログが消えるとズームが引いて、ホーム画面の見出しが「What should we work on in konte-workspace?」に変わるところを見せる。",
        duration: 3.5,
        script: [{ narration: "Create it, and trust the folder." }],
      },
      {
        id: "05",
        kind: "graphic",
        role: "method",
        action: "左下のアカウントのアイコンがクリックされてメニューが開き、Settings が押される。",
        duration: 2.5,
        telop: ["2 Add the marketplace"],
        script: [{ narration: "Open Settings." }],
      },
      {
        id: "06",
        kind: "graphic",
        role: "method",
        action: "Settings の左の一覧が下へスクロールし、Integrations の Plugins が押される。",
        duration: 2.5,
        script: [{ narration: "Go to Plugins." }],
      },
      {
        id: "07",
        kind: "graphic",
        role: "method",
        action: "Plugins 画面右上の Add が押されてメニューが開き、Add a marketplace が押される。",
        duration: 2,
        script: [{ narration: "Add a marketplace." }],
      },
      {
        id: "08",
        kind: "graphic",
        role: "rhythm",
        action:
          "「Add plugin marketplace」のダイアログで、Source 欄に `shiwano/konte` が一文字ずつ打ち込まれる。",
        duration: 3,
        script: [{ narration: "Enter the konte repository," }],
      },
      {
        id: "09",
        kind: "graphic",
        role: "rhythm",
        action:
          "Git ref 欄に `origin/plugin` が一文字ずつ打ち込まれ、Sparse paths は空のまま、明るくなった Add marketplace が押される。",
        duration: 3.5,
        script: [{ narration: "set the ref to origin plugin, and add it." }],
      },
      {
        id: "10",
        kind: "graphic",
        role: "rhythm",
        action:
          "画面が Customize の Plugins に切り替わり、Personal タブが押されて konte の行が現れ、その + が押されて Installing の表示に変わり、ズームが引いたところで行が … に変わり、左の Installed に konte が加わる。",
        duration: 3.5,
        telop: ["3 Install konte"],
        script: [{ narration: "Install konte from Personal." }],
      },
      {
        id: "11",
        kind: "graphic",
        role: "rhythm",
        action:
          "左端のホームアイコンがクリックされ、プロジェクト欄に konte-workspace が出たホーム画面が開き、入力欄にカーソルが置かれる。",
        duration: 2,
        telop: ["4 Run setup"],
        script: [{ narration: "In a new chat," }],
      },
      {
        id: "12",
        kind: "graphic",
        role: "rhythm",
        action:
          "入力欄に `$konte` が打ち込まれ、Konte: Setup と Konte: Upgrade の二つだけの候補から Konte: Setup が選ばれて送信される。",
        duration: 3.5,
        script: [{ narration: "and run konte setup." }],
      },
      {
        id: "13",
        kind: "graphic",
        role: "rhythm",
        action:
          "Set up Konte のチャットで「Working for」の秒数が進み、エージェントがコマンドを走らせていく。",
        duration: 2.5,
        script: [{ narration: "It sets up the workspace for you." }],
      },
      {
        id: "14",
        kind: "graphic",
        role: "rhythm",
        action:
          "エージェントの返答に、Codex を完全に終了して起動し直すよう求める一文が現れ、その文に寄る。",
        duration: 2.5,
        script: [{ narration: "Then quit and reopen the app." }],
      },
      {
        id: "15",
        kind: "graphic",
        role: "rhythm",
        action:
          "上のメニューバーの File → Quit ChatGPT で Codex が終了して画面が一瞬暗くなり、起動し直した Codex の、konte-workspace のホーム画面が開く。",
        duration: 2.5,
      },
      {
        id: "16",
        kind: "graphic",
        role: "rhythm",
        action:
          "入力欄に `$konte` が打ち込まれ、再起動で五つに増えた候補の中から Konte Checkin が選ばれて送信される。",
        duration: 4,
        telop: ["5 Check in"],
        script: [{ narration: "Now run konte checkin." }],
      },
      {
        id: "17",
        kind: "graphic",
        role: "completion",
        action:
          "konte のチェックインのチャットで、エージェントが作業を始め、最初の作品について尋ねる質問カードが現れる。",
        duration: 3.5,
        script: [{ narration: "And you're ready to make videos." }],
      },
    ],
  },
});
