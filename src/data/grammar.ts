export type GrammarPoint = {
    id: string;
    title: string;
    level: "N5" | "N4";
    category: "Conjugation" | "Particle" | "Expression" | "Keigo";
    formula: string;
    meaning: string;
    exampleJP: string;
    exampleEN: string;
    tips?: string;
};

export const grammarLibrary: GrammarPoint[] = [
    // --- PARTICLES (N5) ---
    {
        id: "particle-wa",
        title: "Particle 'Wa' (は)",
        level: "N5",
        category: "Particle",
        formula: "Noun + wa",
        meaning: "Topic Marker (As for...)",
        exampleJP: "私は田中です。",
        exampleEN: "I am Tanaka. (As for me, [I am] Tanaka)",
        tips: "Sets the stage for the sentence. Distinct from 'Ga' (Subject)."
    },
    {
        id: "particle-wo",
        title: "Particle 'Wo' (を)",
        level: "N5",
        category: "Particle",
        formula: "Noun + wo + Verb",
        meaning: "Object Marker",
        exampleJP: "寿司を食べます。",
        exampleEN: "I eat sushi.",
        tips: "Marks the direct object that receives the action."
    },
    {
        id: "particle-ni",
        title: "Particle 'Ni' (に)",
        level: "N5",
        category: "Particle",
        formula: "Place/Time + ni",
        meaning: "Target / Time / Location of Existence",
        exampleJP: "日本に行きます。3時に寝ます。",
        exampleEN: "I go TO Japan. I sleep AT 3 o'clock.",
        tips: "Use 'Ni' for specific time points and targets of movement."
    },
    {
        id: "particle-de",
        title: "Particle 'De' (で)",
        level: "N5",
        category: "Particle",
        formula: "Place + de + Verb",
        meaning: "Context / Location of Action / Means",
        exampleJP: "バスで行きます。カフェで食べます。",
        exampleEN: "I go BY bus. I eat AT the cafe.",
        tips: "Marks WHERE an action happens, not where you exist."
    },
    {
        id: "particle-ga",
        title: "Particle 'Ga' (が)",
        level: "N5",
        category: "Particle",
        formula: "Noun + ga",
        meaning: "Subject Marker / Identifier",
        exampleJP: "猫がいます。",
        exampleEN: "There is a cat.",
        tips: "Used with Arimasu/Imasu, and when identifying a specific subject."
    },

    // --- CONJUGATIONS (N5) ---
    {
        id: "form-masu",
        title: "Polite Form (Masu-kei)",
        level: "N5",
        category: "Conjugation",
        formula: "G1: i-column + masu | G2: Drop ru + masu",
        meaning: "Standard polite non-past verb form",
        exampleJP: "明日、学校に行きます。",
        exampleEN: "I will go to school tomorrow.",
        tips: "The foundation of polite Japanese speech."
    },
    {
        id: "form-te",
        title: "Te-Form (Connective)",
        level: "N5",
        category: "Conjugation",
        formula: "G1: complex (see rules) | G2: Drop ru + te",
        meaning: "And / Request / Progressive",
        exampleJP: "ご飯を食べて、寝ました。",
        exampleEN: "I ate rice, and then slept.",
        tips: "Essential for linking sentences and forming 'Please do' (Te kudasai)."
    },
    {
        id: "form-nai",
        title: "Negative Form (Nai-kei)",
        level: "N5",
        category: "Conjugation",
        formula: "G1: a-column + nai | G2: Drop ru + nai",
        meaning: "Casual negative (Don't / Won't)",
        exampleJP: "その肉は食べない。",
        exampleEN: "I won't eat that meat.",
        tips: "Exception: U becomes Wa (e.g. Kau -> Kawanai)."
    },
    {
        id: "form-ta",
        title: "Ta-Form (Past Casual)",
        level: "N5",
        category: "Conjugation",
        formula: "Same rules as Te-form, replace 'te' with 'ta'",
        meaning: "Simple Past (Did)",
        exampleJP: "昨日、映画を見た。",
        exampleEN: "I watched a movie yesterday.",
        tips: "Used for casual past tense and listing actions (Tari)."
    },

    // --- CONJUGATIONS (N4) ---
    {
        id: "form-potential",
        title: "Potential Form (Kanou-kei)",
        level: "N4",
        category: "Conjugation",
        formula: "G1: u -> e + ru | G2: Drop ru + rareru",
        meaning: "Can do / Able to do",
        exampleJP: "漢字が読めます。",
        exampleEN: "I can read Kanji.",
        tips: "Commonly G2 verbs shorten 'rareru' to 'reru' in speech (Ra-nuki)."
    },
    {
        id: "form-passive",
        title: "Passive Form (Ukemi)",
        level: "N4",
        category: "Conjugation",
        formula: "G1: u -> a + reru | G2: Drop ru + rareru",
        meaning: "To be done by someone (Passive)",
        exampleJP: "私は母に叱られました。",
        exampleEN: "I was scolded by my mother.",
        tips: "The doer is marked with 'ni'. The victim is the topic 'wa'."
    },
    {
        id: "form-causative",
        title: "Causative Form (Shieki)",
        level: "N4",
        category: "Conjugation",
        formula: "G1: u -> a + seru | G2: Drop ru + saseru",
        meaning: "Make someone do / Let someone do",
        exampleJP: "先生は学生に宿題をさせました。",
        exampleEN: "The teacher made the students do homework.",
        tips: "Can imply force (make) or permission (let) depending on context."
    },
    {
        id: "form-volitional",
        title: "Volitional Form (Ishikei)",
        level: "N4",
        category: "Conjugation",
        formula: "G1: u -> o + u | G2: Drop ru + you",
        meaning: "Let's... / I shall...",
        exampleJP: "一緒に行こう。",
        exampleEN: "Let's go together.",
        tips: "Casual version of 'Mashou'."
    },
    {
        id: "form-imperative",
        title: "Imperative Form (Meireikei)",
        level: "N4",
        category: "Conjugation",
        formula: "G1: u -> e | G2: Drop ru + ro",
        meaning: "Command (Do!)",
        exampleJP: "勉強しろ！",
        exampleEN: "Study!! (Command)",
        tips: "Very strong and rude. Mostly used by men, in anime, or cheering."
    },

    // --- EXPRESSIONS / GRAMMAR (N5/N4) ---
    {
        id: "exp-relative",
        title: "Relative Clauses",
        level: "N5",
        category: "Expression",
        formula: "Verb (Plain) + Noun",
        meaning: "Describing a noun with a verb phrase",
        exampleJP: "これは私が作ったケーキです。",
        exampleEN: "This is the cake that I made.",
        tips: "The 'that' or 'which' is invisible. Just put the verb before the noun."
    },
    {
        id: "exp-comparison",
        title: "Comparisons (Yori/Hou)",
        level: "N5",
        category: "Expression",
        formula: "A wa B yori (Adj) desu",
        meaning: "A is more (Adj) than B",
        exampleJP: "日本はイギリスより大きいです。",
        exampleEN: "Japan is bigger than the UK. (False strictly speaking, but grammar example)",
        tips: "'Yori' means 'compared to'."
    },
    {
        id: "exp-conditional-tara",
        title: "Conditional 'Tara'",
        level: "N4",
        category: "Expression",
        formula: "Ta-form + ra",
        meaning: "If / When",
        exampleJP: "雨が降ったら、行きません。",
        exampleEN: "If it rains, I won't go.",
        tips: "The most versatile conditional. Focuses on the result."
    },
    {
        id: "exp-conditional-ba",
        title: "Conditional 'Ba'",
        level: "N4",
        category: "Expression",
        formula: "G1: u -> e + ba | G2: Drop ru + reba",
        meaning: "If (Hypothetical)",
        exampleJP: "安ければ、買います。",
        exampleEN: "If it is cheap, I will buy it.",
        tips: "Focuses on the condition required for the result."
    },

    // --- KEIGO (N4/N3 Intro) ---
    {
        id: "keigo-sonkeigo",
        title: "Honorific (Sonkeigo)",
        level: "N4",
        category: "Keigo",
        formula: "O + V(stem) + ni naru / Special verbs",
        meaning: "Respecting the other person's actions",
        exampleJP: "先生は召し上がりましたか？",
        exampleEN: "Did you (Teacher) eat? (Meshiagaru = Eat)",
        tips: "Raises the listener. Never use for yourself."
    },
    {
        id: "keigo-kenjougo",
        title: "Humble (Kenjougo)",
        level: "N4",
        category: "Keigo",
        formula: "O + V(stem) + suru / Special verbs",
        meaning: "Lowering one's own actions",
        exampleJP: "私が荷物をお持ちします。",
        exampleEN: "I will hold your luggage (humbly).",
        tips: "Lowers the speaker to show respect. Use only for your own actions."
    },

    // --- NEW ADDITIONS ---
    {
        id: "exp-advice",
        title: "Advice (Hou ga ii)",
        level: "N4",
        category: "Expression",
        formula: "Ta-form + hou ga ii desu",
        meaning: "You should... / It is better to...",
        exampleJP: "薬を飲んだほうがいいです。",
        exampleEN: "You should take medicine. (It is better if you take...)",
        tips: "Uses Ta-form (Past) for affirmative advice. 'Te-form' is incorrect here!"
    },
    {
        id: "exp-tsumori",
        title: "Intention (Tsumori)",
        level: "N4",
        category: "Expression",
        formula: "Dict-form / Nai-form + tsumori desu",
        meaning: "I plan to... / I intend to...",
        exampleJP: "来年、日本へ行くつもりです。",
        exampleEN: "I plan to go to Japan next year.",
        tips: "A cemented plan. Stronger than 'to omou' (I think I will)."
    }
];
