import { Alphabet } from "@/types/multiplayer"

type CharacterData = {
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

export const kanjiMap: Record<string, CharacterData> = {
  本: { romaji: "hon", meaning: "book" },
  車: { romaji: "kuruma", meaning: "car" },
  椅子: { romaji: "isu", meaning: "chair" },
  机: { romaji: "tsukue", meaning: "desk" },
  靴: { romaji: "kutsu", meaning: "shoes" },
  服: { romaji: "fuku", meaning: "clothes" },
  鞄: { romaji: "kaban", meaning: "bag" },
  財布: { romaji: "saifu", meaning: "wallet" },
  時計: { romaji: "tokei", meaning: "clock", meaningVariant: "watch" },
  鍵: { romaji: "kagi", meaning: "key" },

  行く: { romaji: "iku", meaning: "go" },
  来る: { romaji: "kuru", meaning: "come" },
  食べる: { romaji: "taberu", meaning: "eat" },
  飲む: { romaji: "nomu", meaning: "drink" },
  見る: { romaji: "miru", meaning: "see", meaningVariant: "watch" },
  聞く: { romaji: "kiku", meaning: "hear", meaningVariant: "ask" },

  新しい: { romaji: "atarashii", meaning: "new" },
  古い: { romaji: "furui", meaning: "old" },
  大きい: { romaji: "ookii", meaning: "big" },
  小さい: { romaji: "chiisai", meaning: "small" },

  一: { romaji: "ichi", meaning: "one" },
  二: { romaji: "ni", meaning: "two" },
  三: { romaji: "san", meaning: "three" },
  四: { romaji: "shi", romajiVariant: "yon", meaning: "four" },
  五: { romaji: "go", meaning: "five" },

  母: { romaji: "haha", meaning: "mother" },
  父: { romaji: "chichi", meaning: "father" },

  月曜日: { romaji: "getsuyoubi", meaning: "monday" },
  火曜日: { romaji: "kayoubi", meaning: "tuesday" },

  嬉しい: { romaji: "ureshii", meaning: "happy" },
  悲しい: { romaji: "kanashii", meaning: "sad" },

  ご飯: { romaji: "gohan", meaning: "rice", meaningVariant: "meal" },
  水: { romaji: "mizu", meaning: "water" },
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
  if (
    input === meta!.romaji ||
    input === meta!.romajiVariant ||
    input === meta!.meaning ||
    input === meta!.meaningVariant
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
