export type BunkeiGroup = "Fact" | "Change" | "Opinion" | "Probability" | "Explanation";

export type BunkeiPoint = {
    id: string;
    formula: string; // e.g., "Verb (Ta) + koto ga arimasu"
    meaning: string; // e.g., "I have done X (Experience)"
    exampleJP: string;
    exampleEN: string;
    group: BunkeiGroup;
    tag: string; // e.g., "Experience" or "Ability"
};

export const bunkeiData: BunkeiPoint[] = [
    // --- GROUP 1: KOTO (FACTS) ---
    { id: "koto-dekiru", group: "Fact", tag: "Ability", formula: "Dict-Form + koto ga dekimasu", meaning: "Can do (Formal)", exampleJP: "運転することができます。", exampleEN: "I can drive." },
    { id: "koto-aru", group: "Fact", tag: "Experience", formula: "Ta-Form + koto ga arimasu", meaning: "Have done X before", exampleJP: "刺身を食べたことがあります。", exampleEN: "I have eaten Sashimi." },
    { id: "koto-ni-suru", group: "Fact", tag: "Decision", formula: "Dict/Nai + koto ni shimasu", meaning: "Decide to do", exampleJP: "明日行くことにしました。", exampleEN: "I decided to go tomorrow." },

    // --- GROUP 2: YOU (CHANGE) ---
    { id: "you-ni-naru", group: "Change", tag: "Potential", formula: "Potential + you ni naru", meaning: "Become able to do", exampleJP: "日本語が話せるようになりました。", exampleEN: "I became able to speak Japanese." },
    { id: "you-ni-suru", group: "Change", tag: "Effort", formula: "Dict/Nai + you ni suru", meaning: "Make an effort to/Ensure", exampleJP: "野菜を食べるようにしています。", exampleEN: "I try to eat vegetables." },
    { id: "you-ni-iu", group: "Change", tag: "Instruction", formula: "Dict/Nai + you ni iu", meaning: "Tell someone to do", exampleJP: "静かにするように言ってください。", exampleEN: "Please tell them to be quiet." },

    // --- GROUP 3: OPINION ---
    { id: "hou-ga-ii", group: "Opinion", tag: "Advice", formula: "Ta/Nai + hou ga ii desu", meaning: "You should / It is better to", exampleJP: "寝たほうがいいですよ。", exampleEN: "You should sleep." },
    { id: "tsumori", group: "Opinion", tag: "Intention", formula: "Dict/Nai + tsumori desu", meaning: "Intend to / Plan to", exampleJP: "車を買うつもりです。", exampleEN: "I intend to buy a car." },
    { id: "to-omou", group: "Opinion", tag: "Thinking", formula: "Volitional + to omotte imasu", meaning: "Thinking of doing", exampleJP: "行こうと思っています。", exampleEN: "I am thinking of going." },

    // --- GROUP 4: PROBABILITY ---
    { id: "kamo", group: "Probability", tag: "Guess", formula: "Plain Form + kamo shirenai", meaning: "Might / Maybe (50%)", exampleJP: "明日雨かもしれません。", exampleEN: "It might rain tomorrow." },
    { id: "hazu", group: "Probability", tag: "Expectation", formula: "Plain Form + hazu desu", meaning: "Should be / Supposed to be (90%)", exampleJP: "田中さんは来るはずです。", exampleEN: "Mr. Tanaka should be coming." },
    { id: "deshou", group: "Probability", tag: "Confirmation", formula: "Plain Form + deshou", meaning: "Probably / Right?", exampleJP: "高いでしょう。", exampleEN: "It is probably expensive." },

    // --- GROUP 5: EXPLANATION ---
    { id: "ndesu", group: "Explanation", tag: "Emphasis", formula: "Plain Form + n/no desu", meaning: "It's that... (Explanation)", exampleJP: "行きたくないんです。", exampleEN: "It's that I don't want to go." },
    { id: "sugiru", group: "Explanation", tag: "Excess", formula: "Stem + sugimasu", meaning: "Do too much", exampleJP: "食べすぎました。", exampleEN: "I ate too much." },
    { id: "yasui-nikui", group: "Explanation", tag: "Ease", formula: "Stem + yasui / nikui", meaning: "Easy to / Hard to", exampleJP: "このペンは書きやすい。", exampleEN: "This pen is easy to write with." },
];
