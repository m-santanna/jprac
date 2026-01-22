import { Alphabet } from "@/types/multiplayer"

export type CharacterData = {
  romaji: string
  romajiVariant?: string
  meaning?: string
  meaningVariant?: string
}

export const hiraganaMap: Record<string, CharacterData> = {
  あ: { romaji: "a" },
  い: { romaji: "i" },
  う: { romaji: "u" },
  え: { romaji: "e" },
  お: { romaji: "o" },

  か: { romaji: "ka" },
  き: { romaji: "ki" },
  く: { romaji: "ku" },
  け: { romaji: "ke" },
  こ: { romaji: "ko" },

  さ: { romaji: "sa" },
  し: { romaji: "shi" },
  す: { romaji: "su" },
  せ: { romaji: "se" },
  そ: { romaji: "so" },

  た: { romaji: "ta" },
  ち: { romaji: "chi" },
  つ: { romaji: "tsu" },
  て: { romaji: "te" },
  と: { romaji: "to" },

  な: { romaji: "na" },
  に: { romaji: "ni" },
  ぬ: { romaji: "nu" },
  ね: { romaji: "ne" },
  の: { romaji: "no" },

  は: { romaji: "ha" },
  ひ: { romaji: "hi" },
  ふ: { romaji: "hu", romajiVariant: "fu" },
  へ: { romaji: "he" },
  ほ: { romaji: "ho" },

  ま: { romaji: "ma" },
  み: { romaji: "mi" },
  む: { romaji: "mu" },
  め: { romaji: "me" },
  も: { romaji: "mo" },

  ら: { romaji: "ra" },
  り: { romaji: "ri" },
  る: { romaji: "ru" },
  れ: { romaji: "re" },
  ろ: { romaji: "ro" },

  や: { romaji: "ya" },
  ゆ: { romaji: "yu" },
  よ: { romaji: "yo" },

  わ: { romaji: "wa" },
  を: { romaji: "wo" },

  が: { romaji: "ga" },
  ぎ: { romaji: "gi" },
  ぐ: { romaji: "gu" },
  げ: { romaji: "ge" },
  ご: { romaji: "go" },

  ざ: { romaji: "za" },
  じ: { romaji: "ji" },
  ず: { romaji: "zu" },
  ぜ: { romaji: "ze" },
  ぞ: { romaji: "zo" },

  ば: { romaji: "ba" },
  び: { romaji: "bi" },
  ぶ: { romaji: "bu" },
  べ: { romaji: "be" },
  ぼ: { romaji: "bo" },

  ぱ: { romaji: "pa" },
  ぴ: { romaji: "pi" },
  ぷ: { romaji: "pu" },
  ぺ: { romaji: "pe" },
  ぽ: { romaji: "po" },

  だ: { romaji: "da" },
  づ: { romaji: "zu" },
  で: { romaji: "de" },
  ど: { romaji: "do" },

  ん: { romaji: "n" },
}

export const katakanaMap: Record<string, CharacterData> = {
  ア: { romaji: "a" },
  イ: { romaji: "i" },
  ウ: { romaji: "u" },
  エ: { romaji: "e" },
  オ: { romaji: "o" },

  カ: { romaji: "ka" },
  キ: { romaji: "ki" },
  ク: { romaji: "ku" },
  ケ: { romaji: "ke" },
  コ: { romaji: "ko" },

  サ: { romaji: "sa" },
  シ: { romaji: "shi" },
  ス: { romaji: "su" },
  セ: { romaji: "se" },
  ソ: { romaji: "so" },

  タ: { romaji: "ta" },
  チ: { romaji: "chi" },
  ツ: { romaji: "tsu" },
  テ: { romaji: "te" },
  ト: { romaji: "to" },

  ナ: { romaji: "na" },
  ニ: { romaji: "ni" },
  ヌ: { romaji: "nu" },
  ネ: { romaji: "ne" },
  ノ: { romaji: "no" },

  ハ: { romaji: "ha" },
  ヒ: { romaji: "hi" },
  フ: { romaji: "hu", romajiVariant: "fu" },
  ヘ: { romaji: "he" },
  ホ: { romaji: "ho" },

  マ: { romaji: "ma" },
  ミ: { romaji: "mi" },
  ム: { romaji: "mu" },
  メ: { romaji: "me" },
  モ: { romaji: "mo" },

  ラ: { romaji: "ra" },
  リ: { romaji: "ri" },
  ル: { romaji: "ru" },
  レ: { romaji: "re" },
  ロ: { romaji: "ro" },

  ヤ: { romaji: "ya" },
  ユ: { romaji: "yu" },
  ヨ: { romaji: "yo" },

  ワ: { romaji: "wa" },
  ヲ: { romaji: "wo" },

  ガ: { romaji: "ga" },
  ギ: { romaji: "gi" },
  グ: { romaji: "gu" },
  ゲ: { romaji: "ge" },
  ゴ: { romaji: "go" },

  ザ: { romaji: "za" },
  ジ: { romaji: "ji" },
  ズ: { romaji: "zu" },
  ゼ: { romaji: "ze" },
  ゾ: { romaji: "zo" },

  バ: { romaji: "ba" },
  ビ: { romaji: "bi" },
  ブ: { romaji: "bu" },
  ベ: { romaji: "be" },
  ボ: { romaji: "bo" },

  パ: { romaji: "pa" },
  ピ: { romaji: "pi" },
  プ: { romaji: "pu" },
  ペ: { romaji: "pe" },
  ポ: { romaji: "po" },

  ダ: { romaji: "da" },
  ヅ: { romaji: "zu" },
  デ: { romaji: "de" },
  ド: { romaji: "do" },

  ン: { romaji: "n" },
}

// JLPT N5 and N4 Kanji - Full word forms with okurigana
export const kanjiMap: Record<string, CharacterData> = {
  // Numbers (standalone is common)
  一: { romaji: "ichi", meaning: "one" },
  二: { romaji: "ni", meaning: "two" },
  三: { romaji: "san", meaning: "three" },
  四: { romaji: "yon", romajiVariant: "shi", meaning: "four" },
  五: { romaji: "go", meaning: "five" },
  六: { romaji: "roku", meaning: "six" },
  七: { romaji: "nana", romajiVariant: "shichi", meaning: "seven" },
  八: { romaji: "hachi", meaning: "eight" },
  九: { romaji: "kyuu", romajiVariant: "ku", meaning: "nine" },
  十: { romaji: "juu", meaning: "ten" },
  百: { romaji: "hyaku", meaning: "hundred" },
  千: { romaji: "sen", meaning: "thousand" },
  万: { romaji: "man", meaning: "ten thousand" },
  円: { romaji: "en", meaning: "yen" },

  // Time (standalone nouns are common)
  日: { romaji: "hi", romajiVariant: "nichi", meaning: "day", meaningVariant: "sun" },
  月: { romaji: "tsuki", romajiVariant: "getsu", meaning: "moon", meaningVariant: "month" },
  火: { romaji: "hi", romajiVariant: "ka", meaning: "fire" },
  水: { romaji: "mizu", meaning: "water" },
  木: { romaji: "ki", meaning: "tree", meaningVariant: "wood" },
  金: { romaji: "kane", romajiVariant: "kin", meaning: "money", meaningVariant: "gold" },
  土: { romaji: "tsuchi", meaning: "earth", meaningVariant: "soil" },
  年: { romaji: "toshi", romajiVariant: "nen", meaning: "year" },
  時: { romaji: "toki", romajiVariant: "ji", meaning: "time" },
  分: { romaji: "fun", romajiVariant: "bun", meaning: "minute" },
  半: { romaji: "han", meaning: "half" },
  毎日: { romaji: "mainichi", meaning: "every day" },
  今: { romaji: "ima", meaning: "now" },
  今日: { romaji: "kyou", meaning: "today" },
  週: { romaji: "shuu", meaning: "week" },
  朝: { romaji: "asa", meaning: "morning" },
  昼: { romaji: "hiru", meaning: "noon", meaningVariant: "daytime" },
  夜: { romaji: "yoru", meaning: "night" },
  夕方: { romaji: "yuugata", meaning: "evening" },
  午前: { romaji: "gozen", meaning: "morning", meaningVariant: "am" },
  午後: { romaji: "gogo", meaning: "afternoon", meaningVariant: "pm" },
  前: { romaji: "mae", meaning: "before", meaningVariant: "front" },
  後ろ: { romaji: "ushiro", meaning: "behind", meaningVariant: "back" },
  間: { romaji: "aida", meaning: "between", meaningVariant: "interval" },

  // People (standalone nouns are common)
  人: { romaji: "hito", meaning: "person" },
  男: { romaji: "otoko", meaning: "man" },
  女: { romaji: "onna", meaning: "woman" },
  子: { romaji: "ko", meaning: "child" },
  子供: { romaji: "kodomo", meaning: "child", meaningVariant: "children" },
  父: { romaji: "chichi", meaning: "father" },
  母: { romaji: "haha", meaning: "mother" },
  友達: { romaji: "tomodachi", meaning: "friend" },
  先生: { romaji: "sensei", meaning: "teacher" },
  学生: { romaji: "gakusei", meaning: "student" },
  学校: { romaji: "gakkou", meaning: "school" },
  私: { romaji: "watashi", meaning: "i" },
  彼: { romaji: "kare", meaning: "he", meaningVariant: "boyfriend" },
  彼女: { romaji: "kanojo", meaning: "she", meaningVariant: "girlfriend" },
  誰: { romaji: "dare", meaning: "who" },
  自分: { romaji: "jibun", meaning: "oneself" },
  会社: { romaji: "kaisha", meaning: "company" },
  会社員: { romaji: "kaishain", meaning: "office worker" },

  // Body (standalone nouns are common)
  目: { romaji: "me", meaning: "eye" },
  耳: { romaji: "mimi", meaning: "ear" },
  口: { romaji: "kuchi", meaning: "mouth" },
  手: { romaji: "te", meaning: "hand" },
  足: { romaji: "ashi", meaning: "foot", meaningVariant: "leg" },
  体: { romaji: "karada", meaning: "body" },
  頭: { romaji: "atama", meaning: "head" },
  顔: { romaji: "kao", meaning: "face" },
  声: { romaji: "koe", meaning: "voice" },
  心: { romaji: "kokoro", meaning: "heart", meaningVariant: "mind" },

  // Nature (standalone nouns are common)
  山: { romaji: "yama", meaning: "mountain" },
  川: { romaji: "kawa", meaning: "river" },
  海: { romaji: "umi", meaning: "sea", meaningVariant: "ocean" },
  空: { romaji: "sora", meaning: "sky" },
  天気: { romaji: "tenki", meaning: "weather" },
  雨: { romaji: "ame", meaning: "rain" },
  雪: { romaji: "yuki", meaning: "snow" },
  風: { romaji: "kaze", meaning: "wind" },
  花: { romaji: "hana", meaning: "flower" },
  森: { romaji: "mori", meaning: "forest" },
  石: { romaji: "ishi", meaning: "stone" },
  池: { romaji: "ike", meaning: "pond" },
  光: { romaji: "hikari", meaning: "light" },
  色: { romaji: "iro", meaning: "color" },

  // Direction/Location (standalone nouns are common)
  上: { romaji: "ue", meaning: "up", meaningVariant: "above" },
  下: { romaji: "shita", meaning: "down", meaningVariant: "below" },
  中: { romaji: "naka", meaning: "inside", meaningVariant: "middle" },
  外: { romaji: "soto", meaning: "outside" },
  左: { romaji: "hidari", meaning: "left" },
  右: { romaji: "migi", meaning: "right" },
  北: { romaji: "kita", meaning: "north" },
  南: { romaji: "minami", meaning: "south" },
  東: { romaji: "higashi", meaning: "east" },
  西: { romaji: "nishi", meaning: "west" },
  国: { romaji: "kuni", meaning: "country" },
  町: { romaji: "machi", meaning: "town" },
  村: { romaji: "mura", meaning: "village" },
  駅: { romaji: "eki", meaning: "station" },
  道: { romaji: "michi", meaning: "road", meaningVariant: "way" },
  門: { romaji: "mon", meaning: "gate" },
  店: { romaji: "mise", meaning: "shop", meaningVariant: "store" },
  部屋: { romaji: "heya", meaning: "room" },
  家: { romaji: "ie", romajiVariant: "uchi", meaning: "house", meaningVariant: "home" },
  場所: { romaji: "basho", meaning: "place" },

  // i-Adjectives (full form with い)
  大きい: { romaji: "ookii", meaning: "big", meaningVariant: "large" },
  小さい: { romaji: "chiisai", meaning: "small", meaningVariant: "little" },
  長い: { romaji: "nagai", meaning: "long" },
  短い: { romaji: "mijikai", meaning: "short" },
  高い: { romaji: "takai", meaning: "high", meaningVariant: "expensive" },
  低い: { romaji: "hikui", meaning: "low" },
  広い: { romaji: "hiroi", meaning: "wide", meaningVariant: "spacious" },
  多い: { romaji: "ooi", meaning: "many", meaningVariant: "much" },
  少ない: { romaji: "sukunai", meaning: "few", meaningVariant: "little" },
  古い: { romaji: "furui", meaning: "old" },
  新しい: { romaji: "atarashii", meaning: "new" },
  重い: { romaji: "omoi", meaning: "heavy" },
  軽い: { romaji: "karui", meaning: "light (weight)" },
  強い: { romaji: "tsuyoi", meaning: "strong" },
  弱い: { romaji: "yowai", meaning: "weak" },
  早い: { romaji: "hayai", meaning: "early", meaningVariant: "fast" },
  遅い: { romaji: "osoi", meaning: "late", meaningVariant: "slow" },
  近い: { romaji: "chikai", meaning: "near", meaningVariant: "close" },
  遠い: { romaji: "tooi", meaning: "far" },
  良い: { romaji: "yoi", romajiVariant: "ii", meaning: "good" },
  悪い: { romaji: "warui", meaning: "bad" },
  明るい: { romaji: "akarui", meaning: "bright" },
  暗い: { romaji: "kurai", meaning: "dark" },
  暖かい: { romaji: "atatakai", meaning: "warm" },
  寒い: { romaji: "samui", meaning: "cold (weather)" },
  暑い: { romaji: "atsui", meaning: "hot (weather)" },
  熱い: { romaji: "atsui", meaning: "hot (touch)" },
  冷たい: { romaji: "tsumetai", meaning: "cold (touch)" },
  安い: { romaji: "yasui", meaning: "cheap" },
  危ない: { romaji: "abunai", meaning: "dangerous" },
  難しい: { romaji: "muzukashii", meaning: "difficult" },
  易しい: { romaji: "yasashii", meaning: "easy" },
  忙しい: { romaji: "isogashii", meaning: "busy" },
  楽しい: { romaji: "tanoshii", meaning: "fun", meaningVariant: "enjoyable" },
  嬉しい: { romaji: "ureshii", meaning: "happy", meaningVariant: "glad" },
  美味しい: { romaji: "oishii", meaning: "delicious" },
  面白い: { romaji: "omoshiroi", meaning: "interesting", meaningVariant: "funny" },
  白い: { romaji: "shiroi", meaning: "white" },
  黒い: { romaji: "kuroi", meaning: "black" },
  赤い: { romaji: "akai", meaning: "red" },
  青い: { romaji: "aoi", meaning: "blue" },
  若い: { romaji: "wakai", meaning: "young" },

  // Verbs (dictionary form with okurigana)
  行く: { romaji: "iku", meaning: "to go" },
  来る: { romaji: "kuru", meaning: "to come" },
  帰る: { romaji: "kaeru", meaning: "to return" },
  入る: { romaji: "hairu", meaning: "to enter" },
  出る: { romaji: "deru", meaning: "to exit", meaningVariant: "to leave" },
  立つ: { romaji: "tatsu", meaning: "to stand" },
  座る: { romaji: "suwaru", meaning: "to sit" },
  走る: { romaji: "hashiru", meaning: "to run" },
  歩く: { romaji: "aruku", meaning: "to walk" },
  止まる: { romaji: "tomaru", meaning: "to stop" },
  動く: { romaji: "ugoku", meaning: "to move" },
  働く: { romaji: "hataraku", meaning: "to work" },
  休む: { romaji: "yasumu", meaning: "to rest" },
  寝る: { romaji: "neru", meaning: "to sleep" },
  起きる: { romaji: "okiru", meaning: "to wake up" },
  開ける: { romaji: "akeru", meaning: "to open" },
  閉める: { romaji: "shimeru", meaning: "to close" },
  始まる: { romaji: "hajimaru", meaning: "to begin" },
  終わる: { romaji: "owaru", meaning: "to end" },
  持つ: { romaji: "motsu", meaning: "to hold", meaningVariant: "to have" },
  待つ: { romaji: "matsu", meaning: "to wait" },
  送る: { romaji: "okuru", meaning: "to send" },
  届く: { romaji: "todoku", meaning: "to arrive", meaningVariant: "to reach" },
  払う: { romaji: "harau", meaning: "to pay" },
  買う: { romaji: "kau", meaning: "to buy" },
  売る: { romaji: "uru", meaning: "to sell" },
  貸す: { romaji: "kasu", meaning: "to lend" },
  借りる: { romaji: "kariru", meaning: "to borrow" },
  返す: { romaji: "kaesu", meaning: "to return (something)" },
  使う: { romaji: "tsukau", meaning: "to use" },
  作る: { romaji: "tsukuru", meaning: "to make", meaningVariant: "to create" },
  切る: { romaji: "kiru", meaning: "to cut" },
  洗う: { romaji: "arau", meaning: "to wash" },
  着る: { romaji: "kiru", meaning: "to wear" },
  脱ぐ: { romaji: "nugu", meaning: "to take off" },
  乗る: { romaji: "noru", meaning: "to ride" },
  降りる: { romaji: "oriru", meaning: "to get off" },
  渡る: { romaji: "wataru", meaning: "to cross" },
  見る: { romaji: "miru", meaning: "to see", meaningVariant: "to look" },
  聞く: { romaji: "kiku", meaning: "to hear", meaningVariant: "to ask" },
  言う: { romaji: "iu", meaning: "to say" },
  話す: { romaji: "hanasu", meaning: "to speak", meaningVariant: "to talk" },
  読む: { romaji: "yomu", meaning: "to read" },
  書く: { romaji: "kaku", meaning: "to write" },
  習う: { romaji: "narau", meaning: "to learn" },
  教える: { romaji: "oshieru", meaning: "to teach" },
  知る: { romaji: "shiru", meaning: "to know" },
  思う: { romaji: "omou", meaning: "to think" },
  考える: { romaji: "kangaeru", meaning: "to consider" },
  答える: { romaji: "kotaeru", meaning: "to answer" },
  歌う: { romaji: "utau", meaning: "to sing" },
  食べる: { romaji: "taberu", meaning: "to eat" },
  飲む: { romaji: "nomu", meaning: "to drink" },
  会う: { romaji: "au", meaning: "to meet" },
  分かる: { romaji: "wakaru", meaning: "to understand" },
  できる: { romaji: "dekiru", meaning: "can do", meaningVariant: "to be able" },
  ある: { romaji: "aru", meaning: "to exist (things)" },
  いる: { romaji: "iru", meaning: "to exist (living)" },
  なる: { romaji: "naru", meaning: "to become" },
  する: { romaji: "suru", meaning: "to do" },
  住む: { romaji: "sumu", meaning: "to live (reside)" },
  遊ぶ: { romaji: "asobu", meaning: "to play" },
  泳ぐ: { romaji: "oyogu", meaning: "to swim" },
  飛ぶ: { romaji: "tobu", meaning: "to fly" },
  死ぬ: { romaji: "shinu", meaning: "to die" },
  生きる: { romaji: "ikiru", meaning: "to live" },
  勝つ: { romaji: "katsu", meaning: "to win" },
  負ける: { romaji: "makeru", meaning: "to lose" },
  変わる: { romaji: "kawaru", meaning: "to change" },
  忘れる: { romaji: "wasureru", meaning: "to forget" },
  覚える: { romaji: "oboeru", meaning: "to remember", meaningVariant: "to memorize" },
  消す: { romaji: "kesu", meaning: "to erase", meaningVariant: "to turn off" },
  付ける: { romaji: "tsukeru", meaning: "to attach", meaningVariant: "to turn on" },
  置く: { romaji: "oku", meaning: "to put", meaningVariant: "to place" },
  取る: { romaji: "toru", meaning: "to take" },
  呼ぶ: { romaji: "yobu", meaning: "to call" },
  急ぐ: { romaji: "isogu", meaning: "to hurry" },

  // Common nouns/compounds
  電話: { romaji: "denwa", meaning: "telephone" },
  電車: { romaji: "densha", meaning: "train" },
  自動車: { romaji: "jidousha", meaning: "car", meaningVariant: "automobile" },
  食べ物: { romaji: "tabemono", meaning: "food" },
  飲み物: { romaji: "nomimono", meaning: "drink", meaningVariant: "beverage" },
  買い物: { romaji: "kaimono", meaning: "shopping" },
  お茶: { romaji: "ocha", meaning: "tea" },
  お金: { romaji: "okane", meaning: "money" },
  お酒: { romaji: "osake", meaning: "alcohol", meaningVariant: "sake" },
  肉: { romaji: "niku", meaning: "meat" },
  魚: { romaji: "sakana", meaning: "fish" },
  米: { romaji: "kome", meaning: "rice (uncooked)" },
  ご飯: { romaji: "gohan", meaning: "rice", meaningVariant: "meal" },
  料理: { romaji: "ryouri", meaning: "cooking", meaningVariant: "cuisine" },
  物: { romaji: "mono", meaning: "thing" },
  事: { romaji: "koto", meaning: "matter", meaningVariant: "thing" },
  紙: { romaji: "kami", meaning: "paper" },
  本: { romaji: "hon", meaning: "book" },
  服: { romaji: "fuku", meaning: "clothes" },
  薬: { romaji: "kusuri", meaning: "medicine" },
  病気: { romaji: "byouki", meaning: "illness", meaningVariant: "sickness" },
  病院: { romaji: "byouin", meaning: "hospital" },
  医者: { romaji: "isha", meaning: "doctor" },
  名前: { romaji: "namae", meaning: "name" },
  映画: { romaji: "eiga", meaning: "movie" },
  写真: { romaji: "shashin", meaning: "photograph" },
  音楽: { romaji: "ongaku", meaning: "music" },
  歌: { romaji: "uta", meaning: "song" },
  質問: { romaji: "shitsumon", meaning: "question" },
  問題: { romaji: "mondai", meaning: "problem" },
  答え: { romaji: "kotae", meaning: "answer" },
  意味: { romaji: "imi", meaning: "meaning" },
  言葉: { romaji: "kotoba", meaning: "word", meaningVariant: "language" },
  文: { romaji: "bun", meaning: "sentence" },
  漢字: { romaji: "kanji", meaning: "kanji" },
  英語: { romaji: "eigo", meaning: "english" },
  日本語: { romaji: "nihongo", meaning: "japanese" },
  外国: { romaji: "gaikoku", meaning: "foreign country" },
  世界: { romaji: "sekai", meaning: "world" },
  全部: { romaji: "zenbu", meaning: "all", meaningVariant: "everything" },

  // na-Adjectives and other common words
  好き: { romaji: "suki", meaning: "like", meaningVariant: "favorite" },
  嫌い: { romaji: "kirai", meaning: "dislike", meaningVariant: "hate" },
  元気: { romaji: "genki", meaning: "healthy", meaningVariant: "energetic" },
  静か: { romaji: "shizuka", meaning: "quiet" },
  有名: { romaji: "yuumei", meaning: "famous" },
  大切: { romaji: "taisetsu", meaning: "important" },
  大丈夫: { romaji: "daijoubu", meaning: "okay", meaningVariant: "alright" },
  同じ: { romaji: "onaji", meaning: "same" },
  別: { romaji: "betsu", meaning: "different", meaningVariant: "separate" },
  特別: { romaji: "tokubetsu", meaning: "special" },
  普通: { romaji: "futsuu", meaning: "normal", meaningVariant: "ordinary" },
  正しい: { romaji: "tadashii", meaning: "correct" },
}

function getAlphabetMap(alphabet: Alphabet) {
  if (alphabet === "kanji") return kanjiMap
  else if (alphabet === "katakana") return katakanaMap
  else if (alphabet === "hiragana") return hiraganaMap
}

export function checkCharacter({
  character,
  alphabet,
  input,
}: {
  character: string
  input: string
  alphabet: Alphabet
}) {
  const alphabetMap = getAlphabetMap(alphabet)
  const meta = alphabetMap![character]
  const proccessed = input.trim().toLowerCase()
  if (
    proccessed === meta.romaji ||
    proccessed === meta.romajiVariant ||
    proccessed === meta.meaning ||
    proccessed === meta.meaningVariant
  )
    return true
  return false
}

export function selectRandomCharacter(alphabet: Alphabet, character: string) {
  const alphabetMap = getAlphabetMap(alphabet)
  const keys = Object.keys(alphabetMap!)
  const index = Math.floor(Math.random() * keys.length)
  const picked = keys[index]!

  // this checks makes sure we never return the same character the user just played
  if (character === picked) {
    return selectRandomCharacter(alphabet, character)
  }
  return picked
}
