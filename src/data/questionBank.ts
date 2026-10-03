import { GradeInfo, DifficultyInfo, Badge, Paper, Question } from '../types/game';

export const GRADE_LIST: GradeInfo[] = [
  { code: 'Y1', nameZh: '小学一年级', nameEn: 'Year 1', stage: 'primary_lower', curriculum: 'KSSR Semakan', cefrTarget: 'Pre-A1' },
  { code: 'Y2', nameZh: '小学二年级', nameEn: 'Year 2', stage: 'primary_lower', curriculum: 'KSSR Semakan', cefrTarget: 'A1 Starter' },
  { code: 'Y3', nameZh: '小学三年级', nameEn: 'Year 3', stage: 'primary_lower', curriculum: 'KSSR Semakan', cefrTarget: 'A1 Mid' },
  { code: 'Y4', nameZh: '小学四年级', nameEn: 'Year 4', stage: 'primary_upper', curriculum: 'UASA Stage 2', cefrTarget: 'A1 High' },
  { code: 'Y5', nameZh: '小学五年级', nameEn: 'Year 5', stage: 'primary_upper', curriculum: 'UASA Stage 2', cefrTarget: 'A2 Basic' },
  { code: 'Y6', nameZh: '小学六年级', nameEn: 'Year 6', stage: 'primary_upper', curriculum: 'UASA Stage 2', cefrTarget: 'A2 Mid' },
  { code: 'F1', nameZh: '初中一年级', nameEn: 'Form 1', stage: 'secondary_lower', curriculum: 'UASA Menengah', cefrTarget: 'A2 High' },
  { code: 'F2', nameZh: '初中二年级', nameEn: 'Form 2', stage: 'secondary_lower', curriculum: 'UASA Menengah', cefrTarget: 'B1 Low' },
  { code: 'F3', nameZh: '初中三年级', nameEn: 'Form 3', stage: 'secondary_lower', curriculum: 'UASA Menengah', cefrTarget: 'B1 Mid' },
  { code: 'F4', nameZh: '高中一年级', nameEn: 'Form 4', stage: 'secondary_upper', curriculum: 'SPM Readiness', cefrTarget: 'B1 High' },
  { code: 'F5', nameZh: '高中二年级', nameEn: 'Form 5', stage: 'secondary_upper', curriculum: 'SPM Target', cefrTarget: 'B2 / CEFR' },
];

export const DIFFICULTY_LIST: DifficultyInfo[] = [
  { code: 'easy', nameZh: '轻松 (Easy)', desc: '核心基础复习 · 语境直观 · 步步为营', accentColor: 'emerald' },
  { code: 'medium', nameZh: '中等 (Medium)', desc: '课纲主要标准 · 常见UASA/SPM题型 · 稳健提升', accentColor: 'amber' },
  { code: 'hard', nameZh: '挑战 (Challenge)', desc: '跨文本推断 · 复杂句型 · 冲刺满分星级', accentColor: 'rose' },
];

export const BADGE_LIST: Badge[] = [
  { id: 'b_explorer', name: '大马探索家', description: '完成前 10 关日常小卷挑战', iconName: 'Compass', requiredLevel: 10 },
  { id: 'b_grammar_star', name: '语法小达人', description: '攻破阶段检测 1 并获得 2 星以上', iconName: 'Sparkles', requiredLevel: 19 },
  { id: 'b_boss_slayer_1', name: '丛林霸主征服者', description: '通关 Level 20 Boss 模拟卷', iconName: 'Trophy', requiredLevel: 20 },
  { id: 'b_vocab_master', name: '词汇百宝箱', description: '累计完成 30 个关卡练习', iconName: 'BookOpen', requiredLevel: 30 },
  { id: 'b_listening_ace', name: '金耳朵听力官', description: '通关 Level 40 Boss 高级听力检测', iconName: 'Headphones', requiredLevel: 40 },
  { id: 'b_master_diploma', name: '全能通关学霸', description: '通关该年级全部 50 道关卡', iconName: 'Award', requiredLevel: 50 },
];

// Authentic rich question sample repository for Year 4 vertical slice and demo levels
export const SAMPLE_QUESTIONS_Y4: Record<string, Question[]> = {
  // Level 1: 日常小卷 01 - Subject-Verb Agreement & School Life
  L1: [
    {
      id: 'y4_l1_q1',
      type: 'single_choice',
      stem: 'Puan Siti and her pupils _______ tree saplings in the school garden every Friday afternoon.',
      options: [
        { id: 'A', text: 'plant' },
        { id: 'B', text: 'plants' },
        { id: 'C', text: 'planted' },
        { id: 'D', text: 'is planting' }
      ],
      correctAnswer: 'A',
      skillCode: 'subject_verb_agreement',
      skillNameZh: '主谓一致 (复数动词原形)',
      points: 20,
      explanation: {
        correctReason: '句子的主语是 "Puan Siti and her pupils"（两人及以上，属于复数主语），且有时间状语 "every Friday afternoon" 表示日常习惯性动作，一般现在时中复数主语使用动词原形 "plant"。',
        distractorReasons: {
          B: '"plants" 是第三人称单数动词形式，主语必须是单个第三人称（如 He, She, Puan Siti）时才使用。',
          C: '"planted" 是过去式，而句中有 "every Friday afternoon"，属于一般现在时。',
          D: '"is planting" 是单数现在进行时，与复数主语和日常习惯频率词不符。'
        },
        ruleNote: '一般现在时规则：当主语是复数（We, They, Tom and Jerry）时，动词保持原形（Verb Base）；当主语是第三人称单数（He, She, It）时，动词词尾加 -s 或 -es。',
        malaysianExample: 'In Malaysia: "Wei Han and his friends play badminton at the community hall every weekend."',
        reinforcementQuestion: {
          stem: 'My brother and I _______ nasi lemak for breakfast every morning.',
          options: ['eats', 'eat', 'eating', 'ate'],
          correctAnswer: 'eat',
          explanation: '"My brother and I" 是复数主语（相当于 we），结合 "every morning" 用动词原形 "eat"。'
        }
      }
    },
    {
      id: 'y4_l1_q2',
      type: 'sentence_builder',
      stem: 'Arrange the word tiles to build a grammatically correct sentence about gotong-royong.',
      tokens: ['The', 'students', 'cleaned', 'canteen', 'during', 'the', 'gotong-royong', '.'],
      targetTokens: ['The', 'students', 'cleaned', 'the', 'canteen', 'during', 'gotong-royong', '.'],
      correctAnswer: ['The', 'students', 'cleaned', 'the', 'canteen', 'during', 'gotong-royong', '.'],
      skillCode: 'sentence_construction',
      skillNameZh: '大马校园生活句型组织',
      points: 20,
      explanation: {
        correctReason: '句子遵循标准英语语序：主语 (The students) + 谓语动词 (cleaned) + 宾语 (the canteen) + 介词短语状语 (during gotong-royong)。',
        ruleNote: '记叙校园活动的简单句标准结构通常为：Subject + Action Verb + Object + Time/Context Adverbial。',
        malaysianExample: 'At school: "All parents gathered at the school hall before gotong-royong started."',
        reinforcementQuestion: {
          stem: 'Arrange: "Aiman / durian / bought / at / the night market"',
          options: [
            'Aiman bought durian at the night market.',
            'Aiman at the night market bought durian.',
            'Bought Aiman durian at the night market.'
          ],
          correctAnswer: 'Aiman bought durian at the night market.',
          explanation: '标准的主谓宾地状语结构：Aiman (主) + bought (谓) + durian (宾) + at the night market (地状)。'
        }
      }
    },
    {
      id: 'y4_l1_q3',
      type: 'cloze_choice',
      stem: 'Read the short paragraph and choose the best words to complete the blanks.',
      clozeParagraph: 'Afiq lives in Melaka. He [blank_1] to school by bicycle every morning. Yesterday, it rained heavily so his father [blank_2] him to school in his car.',
      clozeOptions: {
        blank_1: [
          { id: 'goes', text: 'goes' },
          { id: 'go', text: 'go' },
          { id: 'went', text: 'went' }
        ],
        blank_2: [
          { id: 'drives', text: 'drives' },
          { id: 'drove', text: 'drove' },
          { id: 'is driving', text: 'is driving' }
        ]
      },
      correctAnswer: { blank_1: 'goes', blank_2: 'drove' },
      skillCode: 'tense_consistency',
      skillNameZh: '时态辨析 (现在习惯与过去事件)',
      points: 20,
      explanation: {
        correctReason: '第一空：主语是单数第三人称 "He"，且有常态词 "every morning"，需用单数现在式 "goes"；第二空：时间状语是 "Yesterday"（昨天），属于过去发生的动作，需用动词过去式 "drove"。',
        ruleNote: '注意时间信号词：every day/morning 提示一般现在时，yesterday/last night 提示一般过去时。',
        malaysianExample: 'Every day Mei Ling walks to the bakery, but yesterday she took an e-hailing ride because of the downpour.',
        reinforcementQuestion: {
          stem: 'Last Sunday, Uncle Lim _______ our family to Cameron Highlands.',
          options: ['drives', 'drove', 'driving', 'drive'],
          correctAnswer: 'drove',
          explanation: '"Last Sunday" 提示一般过去时，drive 的过去式是不规则动词 drove。'
        }
      }
    },
    {
      id: 'y4_l1_q4',
      type: 'matching',
      stem: 'Match each Malaysian vocabulary word with its correct meaning.',
      pairs: [
        { id: 'p1', left: 'Pasar malam', right: 'Open-air night market selling food and goods' },
        { id: 'p2', left: 'Gotong-royong', right: 'Community activity where people clean together' },
        { id: 'p3', left: 'Hibiscus', right: 'The national flower of Malaysia (Bunga Raya)' },
        { id: 'p4', left: 'Hornbill', right: 'A majestic bird found in Sarawak forests' }
      ],
      correctAnswer: {
        'Pasar malam': 'Open-air night market selling food and goods',
        'Gotong-royong': 'Community activity where people clean together',
        'Hibiscus': 'The national flower of Malaysia (Bunga Raya)',
        'Hornbill': 'A majestic bird found in Sarawak forests'
      },
      skillCode: 'vocabulary_malaysian_context',
      skillNameZh: '大马文化常识词汇匹配',
      points: 20,
      explanation: {
        correctReason: 'Pasar malam 代表马来西亚特有的夜市，Gotong-royong 是大马互助大扫除，Hibiscus 是大红花国花，Hornbill 是砂拉越著名的犀鸟标志。',
        ruleNote: '在小学英语 UASA 考卷中，熟悉本土文化用词能够帮助迅速理解阅读文本情境。',
        malaysianExample: 'Many tourists visit the pasar malam in Jonker Street to try delicious local snacks.',
      }
    },
    {
      id: 'y4_l1_q5',
      type: 'listening_choice',
      stem: 'Listen to the audio announcement and answer: What time does the English Storytelling Competition begin?',
      audioScript: 'Attention all Year 4 pupils! Please take note that the English Storytelling Competition will be held this Wednesday in the school audio-visual room. The event starts promptly at 9:30 a.m. Please be seated by 9:15 a.m. with your student nametags.',
      audioPlayCountLimit: 2,
      options: [
        { id: 'A', text: '8:30 a.m.' },
        { id: 'B', text: '9:15 a.m.' },
        { id: 'C', text: '9:30 a.m.' },
        { id: 'D', text: '10:00 a.m.' }
      ],
      correctAnswer: 'C',
      skillCode: 'listening_comprehension',
      skillNameZh: '听力信息定位 (学校通知细节)',
      points: 20,
      explanation: {
        correctReason: '录音中明确提到："The event starts promptly at 9:30 a.m."（活动准时于上午9点30分开始）。',
        distractorReasons: {
          B: '录音中 9:15 a.m. 是要求入座就绪的时间 ("Please be seated by 9:15 a.m.")，并不是比赛开始时间。'
        },
        ruleNote: '听力题常设“入场时间”与“开始时间”作为干扰项，作答时需听清动词 "starts" 后的精准时刻。',
        malaysianExample: 'The school assembly starts at 7:30 a.m., so students arrive at 7:15 a.m.',
      }
    }
  ],

  // Level 2: 日常小卷 02 - Prepositions & Malaysian Wildlife
  L2: [
    {
      id: 'y4_l2_q1',
      type: 'single_choice',
      stem: 'The Malayan tapir loves to rest _______ the tall shady trees during hot afternoons.',
      options: [
        { id: 'A', text: 'under' },
        { id: 'B', text: 'between' },
        { id: 'C', text: 'above' },
        { id: 'D', text: 'through' }
      ],
      correctAnswer: 'A',
      skillCode: 'prepositions_of_place',
      skillNameZh: '方位介词辨析',
      points: 25,
      explanation: {
        correctReason: '大树能提供树荫，动物在树荫下方休息，使用方位介词 "under"（在……下面）。',
        distractorReasons: {
          B: '"between" 表示在两者之间，后方通常连接两个对象（如 between the tree and the rock）。',
          C: '"above" 表示在上方且不接触，貘不会悬挂在树木上方。'
        },
        ruleNote: '方位介词用法：under + tree/table（在树下/桌下），in front of（在前面），behind（在后面）。',
        malaysianExample: 'The stray cat is sleeping under the wooden bench outside the kopitiam.',
        reinforcementQuestion: {
          stem: 'Siti kept her school bag _______ the study desk.',
          options: ['under', 'over', 'between', 'during'],
          correctAnswer: 'under',
          explanation: '书包放在书桌下方，用介词 "under"。'
        }
      }
    },
    {
      id: 'y4_l2_q2',
      type: 'error_correction',
      stem: 'Identify the incorrect word in the sentence and choose the correct replacement.',
      sentenceWithTokens: ['Orangutans', 'lives', 'in', 'the', 'rainforests', 'of', 'Sabah', '.'],
      errorIndex: 1, // 'lives'
      replacementOptions: ['live', 'lived', 'living', 'are living'],
      correctAnswer: 'live',
      skillCode: 'subject_verb_agreement',
      skillNameZh: '主谓一致纠错 (复数动词)',
      points: 25,
      explanation: {
        correctReason: '主语 "Orangutans" 是复数名词（红毛猩猩们），表达科普客观事实需用一般现在时复数动词 "live"，原句中的 "lives" 是单数形式，属于错误。',
        ruleNote: '常考考点：复数名词主语 + 动词原形。如 Birds fly, Orangutans live.',
        malaysianExample: 'Proboscis monkeys live in the mangrove forests along the Kinabatangan River.',
      }
    },
    {
      id: 'y4_l2_q3',
      type: 'single_choice',
      stem: 'Which of the following animals is famous for having black and white fur and living in Taman Negara?',
      options: [
        { id: 'A', text: 'Malayan Tapir' },
        { id: 'B', text: 'Sun Bear' },
        { id: 'C', text: 'Pangolin' },
        { id: 'D', text: 'Mouse Deer' }
      ],
      correctAnswer: 'A',
      skillCode: 'reading_comprehension',
      skillNameZh: '阅读事实提取 (大马本土特有物种)',
      points: 25,
      explanation: {
        correctReason: '马来貘 (Malayan Tapir) 具有标志性的黑白双色皮毛（前半身与四肢黑色，后半段背部白色），生活在国家公园热带雨林中。',
        ruleNote: 'UASA 阶段阅读常以大马特有保护动物（如马来亚虎、马来貘、长鼻猴）作为科普素材。',
        malaysianExample: 'The Malayan tapir is an endangered animal protected by the Malaysian Wildlife Department.',
      }
    },
    {
      id: 'y4_l2_q4',
      type: 'dialogue_matching',
      stem: 'Choose the most polite and natural response to complete the dialogue at the canteen.',
      contextPassage: 'Ken: "Excuse me, Auntie Tan. May I have a plate of chicken rice, please?"\nAuntie Tan: "_______"',
      options: [
        { id: 'A', text: 'Sure, here you go, dear. That will be three ringgit.' },
        { id: 'B', text: 'No, you must do your homework now.' },
        { id: 'C', text: 'I am playing badminton in the hall.' },
        { id: 'D', text: 'Thank you for coming to my house.' }
      ],
      correctAnswer: 'A',
      skillCode: 'social_interaction',
      skillNameZh: '日常情境对话恰当应答',
      points: 25,
      explanation: {
        correctReason: '学生向食堂阿姨有礼貌地点餐 "May I have... please?"，阿姨最符合现实情境的回应是递上食物并告知价格 "Sure, here you go, dear. That will be three ringgit."',
        ruleNote: '社交英语考查语境逻辑与语气对等，需注意购买食物与日常交际用语的标准回应方式。',
        malaysianExample: 'At school: "May I borrow your ruler, please?" - "Certainly, here it is."',
      }
    }
  ],

  // Level 9: 阶段检测 01 (Checkpoint 1)
  L9: [
    {
      id: 'y4_l9_q1',
      type: 'single_choice',
      stem: 'Neither Muthu nor his cousins _______ going to the Penang Bridge marathon next Sunday.',
      options: [
        { id: 'A', text: 'are' },
        { id: 'B', text: 'is' },
        { id: 'C', text: 'was' },
        { id: 'D', text: 'were' }
      ],
      correctAnswer: 'A',
      skillCode: 'subject_verb_agreement',
      skillNameZh: '就近原则复合主谓一致',
      points: 25,
      explanation: {
        correctReason: '短语 "neither... nor..." 连接并列主语时，谓语动词遵循【就近原则】。靠近动词的主语是复数名词 "his cousins"，且时间词是 "next Sunday"，因此使用现在时复数 "are"。',
        distractorReasons: {
          B: '"is" 是单数形式，忽视了与动词最近的复数主语 cousins。',
          C: '"was" 是过去时单数，不符合将来时间状语 next Sunday。'
        },
        ruleNote: '考点突破：either... or... / neither... nor... 连接主语时，动词的人称和数取决于离它最近的那一个主语。',
        malaysianExample: 'Neither the teacher nor the pupils are in the classroom right now.',
      }
    },
    {
      id: 'y4_l9_q2',
      type: 'information_transfer',
      stem: 'Read the school tour brochure about Cameron Highlands and complete the note sheet.',
      sourceText: `CAMERON HIGHLANDS DAY TRIP
Organiser: English Language Club, SJK(C) Chung Hua
Date: 24th October (Saturday)
Fee: RM 45 per pupil (Includes bus ride & strawberry farm ticket)
Departure Time: 7:00 a.m. from the school main gate
Things to Bring: A sweater, raincoat, water bottle and notebook.`,
      transferFields: [
        { key: 'club', label: 'Organising Club', placeholder: 'e.g. Science Club', acceptedAnswers: ['English Language Club', 'English Club'] },
        { key: 'fee', label: 'Fee per Pupil', placeholder: 'e.g. RM 50', acceptedAnswers: ['RM 45', 'RM45', '45 ringgit'] },
        { key: 'depTime', label: 'Departure Time', placeholder: 'e.g. 8:00 a.m.', acceptedAnswers: ['7:00 a.m.', '7.00 a.m.', '7:00 am', '7am'] },
        { key: 'date', label: 'Trip Date', placeholder: 'e.g. 1st January', acceptedAnswers: ['24th October', '24 October', '24th Oct'] }
      ],
      correctAnswer: {
        club: 'English Language Club',
        fee: 'RM 45',
        depTime: '7:00 a.m.',
        date: '24th October'
      },
      skillCode: 'information_transfer',
      skillNameZh: '信息转换 (表格与海报提取)',
      points: 50,
      explanation: {
        correctReason: '从海报明确对应各字段：主办方为 English Language Club，费用为 RM 45，出发时间为 7:00 a.m.，日期为 24th October。',
        ruleNote: 'UASA 英语 Section C 核心必考题型：快速定位海报核心信息（Date, Venue, Fee, Organiser）并准确填入表格。',
        malaysianExample: 'Always look for key words like "Organiser", "Fee", and "Departure" on the event flyer.',
      }
    },
    {
      id: 'y4_l9_q3',
      type: 'listening_choice',
      stem: 'Listen to Uncle Rashid talking about his tea plantation and answer: What must visitors wear in the plantation?',
      audioScript: 'Welcome to Boh Tea Estate, young explorers! Because the morning slopes in Cameron Highlands can be slippery and misty, all visitors must wear sturdy walking shoes. Sandals or slippers are not permitted on the hill trails.',
      audioPlayCountLimit: 2,
      options: [
        { id: 'A', text: 'Comfortable sandals' },
        { id: 'B', text: 'Sturdy walking shoes' },
        { id: 'C', text: 'Rubber boots with gloves' },
        { id: 'D', text: 'High heels' }
      ],
      correctAnswer: 'B',
      skillCode: 'listening_comprehension',
      skillNameZh: '听力细节抓取 (安全规则)',
      points: 25,
      explanation: {
        correctReason: '导游 Rashid 明确说明："all visitors must wear sturdy walking shoes"（所有访客必须穿结实的步行鞋）。',
        ruleNote: '抓取关键指令：关注 "must wear" 后接的名词短语。',
        malaysianExample: 'Visitors must wear safety helmets when entering the cave in Ipoh.',
      }
    }
  ],

  // Level 10: Boss 模拟卷 01 (Stage Boss 1 - The Rainforest Adventure)
  L10: [
    {
      id: 'y4_l10_q1',
      type: 'single_choice',
      stem: 'While we _______ along the canopy walkway in Taman Negara, a colorful hornbill suddenly flew past us.',
      options: [
        { id: 'A', text: 'were walking' },
        { id: 'B', text: 'was walking' },
        { id: 'C', text: 'walked' },
        { id: 'D', text: 'are walking' }
      ],
      correctAnswer: 'A',
      skillCode: 'past_continuous_tense',
      skillNameZh: '过去进行时 (While 引导长动作背景)',
      points: 20,
      explanation: {
        correctReason: '句子描述过去某事件发生时的背景动作："While"（当……时）引导正在进行的延续动作，主语是 "we"（复数），需用过去进行时 "were walking"；后半句用一般过去式 "flew" 表示突然插入的短动作。',
        distractorReasons: {
          B: '"was walking" 只能搭配单数主语（I, He, She），此处主语是 we。',
          C: '"walked" 是一般过去时，无法生动体现正在行走过程中的延续性。',
          D: '"are walking" 是现在进行时，与过去事件 "flew" 冲突。'
        },
        ruleNote: '高频考点语法公式：While + Past Continuous (was/were + v-ing), Simple Past (突发瞬间动词).',
        malaysianExample: 'While Ravi was studying in the library, his phone rang.',
        reinforcementQuestion: {
          stem: 'While Linda _______ the dishes, she accidentally dropped a glass.',
          options: ['was washing', 'were washing', 'washed', 'is washing'],
          correctAnswer: 'was washing',
          explanation: '主语 Linda 是单数第三人称，While 后用单数过去进行时 "was washing"。'
        }
      }
    },
    {
      id: 'y4_l10_q2',
      type: 'sentence_builder',
      stem: 'Build the correct sentence describing Mount Kinabalu climbing.',
      tokens: ['Many', 'climbers', 'wake', 'early', 'to', 'see', 'the', 'sunrise', '.'],
      targetTokens: ['Many', 'climbers', 'wake', 'up', 'early', 'to', 'see', 'the', 'sunrise', '.'],
      correctAnswer: ['Many', 'climbers', 'wake', 'early', 'to', 'see', 'the', 'sunrise', '.'],
      skillCode: 'sentence_construction',
      skillNameZh: '动词不定式目的状语句式',
      points: 20,
      explanation: {
        correctReason: '句子结构：主语 (Many climbers) + 动词与副词 (wake early) + 动词不定式表达目的 (to see the sunrise)。',
        ruleNote: '"to + verb" 表目的，是 UASA 考查高频表达方式。',
        malaysianExample: 'Tourists travel to Penang to taste delicious char kway teow.',
      }
    },
    {
      id: 'y4_l10_q3',
      type: 'error_correction',
      stem: 'Spot the incorrect grammar token and choose the correct form.',
      sentenceWithTokens: ['The', 'fireflies', 'at', 'Kuala', 'Selangor', 'shines', 'brightly', 'at', 'night', '.'],
      errorIndex: 5, // 'shines'
      replacementOptions: ['shine', 'shining', 'shined', 'are shine'],
      correctAnswer: 'shine',
      skillCode: 'subject_verb_agreement',
      skillNameZh: '介词短语修饰下的主谓一致',
      points: 20,
      explanation: {
        correctReason: '句子真正的主语是前面的复数名词 "The fireflies"（萤火虫们），"at Kuala Selangor" 只是地点状语修饰。复数主语应搭配动词原形 "shine"，不能被单数地点干扰而使用 "shines"。',
        ruleNote: '常设干扰陷阱：主语和谓语之间插入地点或介词短语（如 of / at / with），考生需找出真正主语的名词单复数。',
        malaysianExample: 'The books on the teacher\'s table belong to the pupils.',
      }
    },
    {
      id: 'y4_l10_q4',
      type: 'cloze_choice',
      stem: 'Complete the story about a village festival (Hari Raya Open House).',
      clozeParagraph: 'Every year during festive seasons, Encik Faris hosts an open house. Neighbours from all races [blank_1] to celebrate together. Delicious food like rendang, ketupat, and satay [blank_2] served to every guest.',
      clozeOptions: {
        blank_1: [
          { id: 'gather', text: 'gather' },
          { id: 'gathers', text: 'gathers' },
          { id: 'gathering', text: 'gathering' }
        ],
        blank_2: [
          { id: 'is', text: 'is' },
          { id: 'are', text: 'are' },
          { id: 'were', text: 'were' }
        ]
      },
      correctAnswer: { blank_1: 'gather', blank_2: 'is' },
      skillCode: 'cloze_grammar',
      skillNameZh: '篇章完形填空 (多元文化主题)',
      points: 20,
      explanation: {
        correctReason: '第一空：主语 "Neighbours" 是复数，用动词原形 "gather"；第二空："Delicious food"（美食）在英语中作为不可数名词，动词使用单数 "is"。',
        ruleNote: '不可数名词（food, water, rice, furniture）作主语时，谓语动词一律用单数形式。',
        malaysianExample: 'Fresh fruit and cool water is available at the refreshment stand.',
      }
    },
    {
      id: 'y4_l10_q5',
      type: 'listening_choice',
      stem: 'Listen to the park ranger\'s warning and answer: What should children do if they see a monkey on the trail?',
      audioScript: 'Attention hikers! Long-tailed macaques live around this rest station. If a monkey approaches you, remain calm. Do not feed them, and never look directly into their eyes as they may consider it a challenge. Keep your snacks inside your zipped backpack.',
      audioPlayCountLimit: 2,
      options: [
        { id: 'A', text: 'Feed it a banana immediately' },
        { id: 'B', text: 'Remain calm and do not feed it' },
        { id: 'C', text: 'Run and shout loudly' },
        { id: 'D', text: 'Stare directly into its eyes' }
      ],
      correctAnswer: 'B',
      skillCode: 'listening_comprehension',
      skillNameZh: '听力主旨与行为建议理解',
      points: 20,
      explanation: {
        correctReason: '管理员说："remain calm. Do not feed them"（保持冷静，切勿喂食它们）。',
        ruleNote: '听力中听到 "Do not..." 或 "never..." 往往表示反向禁止行为，需仔细甄别正确与错误建议。',
        malaysianExample: 'Remain calm and walk slowly if an insect buzzes near you.',
      }
    }
  ]
};

// Generate papers for the selected grade and track
export function getPaperForLevel(grade: string, difficulty: string, levelNo: number): Paper {
  // Determine paper type: Level 10, 20, 30, 40, 50 are Boss; 9, 19, 29, 39, 49 are Checkpoints; others Daily
  let type: 'daily' | 'checkpoint' | 'boss' = 'daily';
  if (levelNo % 10 === 0) {
    type = 'boss';
  } else if (levelNo % 10 === 9) {
    type = 'checkpoint';
  }

  const paperId = `${grade}_${difficulty}_L${levelNo}`;

  // If we have exact hand-crafted questions for Year 4 Level 1, 2, 9, 10, use them
  if (levelNo === 1 && SAMPLE_QUESTIONS_Y4.L1) {
    return {
      id: paperId,
      grade: grade as any,
      difficulty: difficulty as any,
      levelNo,
      type,
      title: `关卡 ${levelNo}：学校生活与主谓一致`,
      subtitle: 'Daily Practice · School Life & Agreement',
      description: '掌握一般现在时复数主语、句子拼装以及基础学校听力通知。',
      estimatedMinutes: 8,
      questions: SAMPLE_QUESTIONS_Y4.L1,
      skillsTested: ['subject_verb_agreement', 'sentence_construction', 'tense_consistency', 'listening_comprehension']
    };
  }

  if (levelNo === 2 && SAMPLE_QUESTIONS_Y4.L2) {
    return {
      id: paperId,
      grade: grade as any,
      difficulty: difficulty as any,
      levelNo,
      type,
      title: `关卡 ${levelNo}：大马雨林动物与方位介词`,
      subtitle: 'Daily Practice · Wildlife & Prepositions',
      description: '探索马来貘、红毛猩猩等本土生物，训练方位介词与语法纠错。',
      estimatedMinutes: 10,
      questions: SAMPLE_QUESTIONS_Y4.L2,
      skillsTested: ['prepositions_of_place', 'subject_verb_agreement', 'reading_comprehension', 'social_interaction']
    };
  }

  if (levelNo === 9 && SAMPLE_QUESTIONS_Y4.L9) {
    return {
      id: paperId,
      grade: grade as any,
      difficulty: difficulty as any,
      levelNo,
      type: 'checkpoint',
      title: `关卡 ${levelNo}：阶段能力检测 01 (金马仑之旅)`,
      subtitle: 'Stage Checkpoint 01 · Cameron Highlands Journey',
      description: '综合考查信息转换表格提取、就近原则主谓一致与听力理解。',
      estimatedMinutes: 15,
      questions: SAMPLE_QUESTIONS_Y4.L9,
      skillsTested: ['subject_verb_agreement', 'information_transfer', 'listening_comprehension']
    };
  }

  if (levelNo === 10 && SAMPLE_QUESTIONS_Y4.L10) {
    return {
      id: paperId,
      grade: grade as any,
      difficulty: difficulty as any,
      levelNo,
      type: 'boss',
      title: `关卡 ${levelNo}：Boss 模拟战 01 (国家公园大冒险)`,
      subtitle: 'Boss Battle 01 · Taman Negara Expedition',
      description: '挑战过去进行时长难句、目的状语拼句、萤火虫语法纠错与夜间丛林听力！',
      estimatedMinutes: 20,
      questions: SAMPLE_QUESTIONS_Y4.L10,
      skillsTested: ['past_continuous_tense', 'sentence_construction', 'subject_verb_agreement', 'cloze_grammar', 'listening_comprehension']
    };
  }

  // Generative high-quality fallback questions matching the grade and level theme
  return generateProceduralPaper(grade, difficulty, levelNo, type, paperId);
}

function generateProceduralPaper(
  grade: string,
  difficulty: string,
  levelNo: number,
  type: 'daily' | 'checkpoint' | 'boss',
  paperId: string
): Paper {
  const topics = [
    { title: 'Healthy Eating & Malaysian Fruits', theme: '健康饮食与本地热带水果', word: 'rambutan' },
    { title: 'Traditional Games & Congkak', theme: '传统民俗游戏与大马童年', word: 'congkak' },
    { title: 'Pulau Redang Marine Conservation', theme: '热浪岛海洋生态与海龟保护', word: 'turtle' },
    { title: 'Penang Heritage Street Art', theme: '槟城乔治市文化遗产与壁画', word: 'mural' },
    { title: 'Science Fair & Inventions', theme: '学校科学展览与创意发明', word: 'robot' },
    { title: 'Kuala Lumpur City Rail Journey', theme: '吉隆坡轻轨与城市漫步', word: 'train' },
    { title: 'Sarawak Cultural Rainforest Festival', theme: '砂拉越雨林音乐节与民族舞蹈', word: 'dance' },
  ];

  const currentTopic = topics[(levelNo - 1) % topics.length];

  const questions: Question[] = [
    {
      id: `${paperId}_q1`,
      type: 'single_choice',
      stem: `Amin and his classmates _______ very excited to visit the ${currentTopic.title} exhibition this morning.`,
      options: [
        { id: 'A', text: 'were' },
        { id: 'B', text: 'was' },
        { id: 'C', text: 'is' },
        { id: 'D', text: 'are' }
      ],
      correctAnswer: 'A',
      skillCode: 'subject_verb_agreement',
      skillNameZh: '主谓一致与时态判断',
      points: 25,
      explanation: {
        correctReason: `主语 "Amin and his classmates" 包含多人为复数主语，结合过去时间状语 "this morning"，过去式使用复数形式 "were"。`,
        distractorReasons: {
          B: '"was" 仅用于单数主语（如 Amin was）。',
          C: '"is" 为现在时单数，时态与数均不匹配。',
          D: '"are" 为现在时复数，不符合已发生的过去事件。'
        },
        ruleNote: '注意主语连接词 "and" 表示两者结合构成的复数主语，谓语动词需保持一致。',
        malaysianExample: `Amin and his brother were at the night market buying ${currentTopic.word}.`,
      }
    },
    {
      id: `${paperId}_q2`,
      type: 'sentence_builder',
      stem: `Arrange the word tokens to construct a proper sentence about ${currentTopic.theme}.`,
      tokens: ['They', 'enjoyed', 'learning', 'about', 'Malaysian', 'heritage', '.'],
      targetTokens: ['They', 'enjoyed', 'learning', 'about', 'Malaysian', 'heritage', '.'],
      correctAnswer: ['They', 'enjoyed', 'learning', 'about', 'Malaysian', 'heritage', '.'],
      skillCode: 'sentence_construction',
      skillNameZh: '动名词固定搭配与语序',
      points: 25,
      explanation: {
        correctReason: '"enjoy" 后接动名词 "enjoyed learning about..."，遵循标准的 Subject + Verb + Gerund Object 结构。',
        ruleNote: '部分动词后习惯接动名词形式（v-ing），如 enjoy doing, finish doing, keep doing.',
        malaysianExample: 'We enjoyed eating fresh durian at the fruit stall.',
      }
    },
    {
      id: `${paperId}_q3`,
      type: 'single_choice',
      stem: `Which conjunction best completes the sentence? "The children were tired after playing sports, _______ they were smiling happily."`,
      options: [
        { id: 'A', text: 'but' },
        { id: 'B', text: 'so' },
        { id: 'C', text: 'because' },
        { id: 'D', text: 'or' }
      ],
      correctAnswer: 'A',
      skillCode: 'conjunctions',
      skillNameZh: '转折连词运用 (but)',
      points: 25,
      explanation: {
        correctReason: '前半句描述“身体疲劳”（tired），后半句描述“开心微笑”（smiling happily），两句之间为明显的语义转折关系，使用转折连词 "but"。',
        distractorReasons: {
          B: '"so" 表示因果关系（因此），微笑并非疲劳的直接结果。',
          C: '"because" 表示原因（因为）。'
        },
        ruleNote: '常见并列连词辨析：and 表递进，but 表转折，so 表结果，or 表选择。',
        malaysianExample: 'It was raining in Ipoh, but the students still went to the badminton court.',
      }
    },
    {
      id: `${paperId}_q4`,
      type: 'listening_choice',
      stem: `Listen to the teacher's instructions: Where will the class meet after the activity?`,
      audioScript: `Attention everyone! When you finish inspecting the posters, please do not run into the parking lot. Gather quietly under the big rain tree beside the canteen so we can take attendance.`,
      audioPlayCountLimit: 2,
      options: [
        { id: 'A', text: 'Under the big rain tree beside the canteen' },
        { id: 'B', text: 'Inside the school parking lot' },
        { id: 'C', text: 'At the bus stop outside the school gate' },
        { id: 'D', text: 'In the principal\'s office' }
      ],
      correctAnswer: 'A',
      skillCode: 'listening_comprehension',
      skillNameZh: '听力地点与安全集结定位',
      points: 25,
      explanation: {
        correctReason: '教师明确指示："Gather quietly under the big rain tree beside the canteen"（在食堂旁的大雨树下安静集合）。',
        ruleNote: '排除禁止地点：听到 "do not run into the parking lot" 可以直接排除停车场选项。',
        malaysianExample: 'The pupils queued up under the canopy before going home.',
      }
    }
  ];

  return {
    id: paperId,
    grade: grade as any,
    difficulty: difficulty as any,
    levelNo,
    type,
    title: `关卡 ${levelNo}：${currentTopic.theme}`,
    subtitle: `${type === 'boss' ? 'Boss Simulation' : type === 'checkpoint' ? 'Stage Checkpoint' : 'Daily Practice'} · ${currentTopic.title}`,
    description: `聚焦马来西亚中小学英语核心考点，包含句型组织、主谓搭配与听力定位训练。`,
    estimatedMinutes: type === 'boss' ? 25 : type === 'checkpoint' ? 15 : 10,
    questions,
    skillsTested: ['subject_verb_agreement', 'sentence_construction', 'conjunctions', 'listening_comprehension']
  };
}
