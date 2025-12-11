import { Verb, ConjugationForm } from '../types';

/**
 * A robust engine to conjugate Japanese verbs from Romaji dictionary form.
 * Handles Godan (v1), Ichidan (v2), and Irregular verbs.
 * Returns both Romaji and Hiragana forms.
 */

interface ConjugationResult {
  romaji: string;
  kana: string;
}

// Helper to identify the stem and ending of Godan verbs (Romaji)
const getGodanStem = (romaji: string) => {
  if (romaji.endsWith('tsu')) return { stem: romaji.slice(0, -3), ending: 'tsu' };
  if (romaji.endsWith('su')) return { stem: romaji.slice(0, -2), ending: 'su' };
  if (romaji.endsWith('ku')) return { stem: romaji.slice(0, -2), ending: 'ku' };
  if (romaji.endsWith('gu')) return { stem: romaji.slice(0, -2), ending: 'gu' };
  if (romaji.endsWith('mu')) return { stem: romaji.slice(0, -2), ending: 'mu' };
  if (romaji.endsWith('bu')) return { stem: romaji.slice(0, -2), ending: 'bu' };
  if (romaji.endsWith('nu')) return { stem: romaji.slice(0, -2), ending: 'nu' };
  if (romaji.endsWith('ru')) return { stem: romaji.slice(0, -2), ending: 'ru' };
  if (romaji.endsWith('u')) return { stem: romaji.slice(0, -1), ending: 'u' };
  return { stem: romaji, ending: '' };
};

// Helper for Godan Hiragana Mappings
const getGodanKanaSuffix = (endingChar: string) => {
  const map: Record<string, { a: string, i: string, e: string, o: string, te: string, ta: string }> = {
    'う': { a: 'わ', i: 'い', e: 'え', o: 'お', te: 'って', ta: 'った' },
    'つ': { a: 'た', i: 'ち', e: 'て', o: 'と', te: 'って', ta: 'った' },
    'る': { a: 'ら', i: 'り', e: 'れ', o: 'ろ', te: 'って', ta: 'った' },
    'む': { a: 'ま', i: 'み', e: 'め', o: 'も', te: 'んで', ta: 'んだ' },
    'ぶ': { a: 'ば', i: 'び', e: 'べ', o: 'ぼ', te: 'んで', ta: 'んだ' },
    'ぬ': { a: 'な', i: 'に', e: 'ね', o: 'の', te: 'んで', ta: 'んだ' },
    'く': { a: 'か', i: 'き', e: 'け', o: 'こ', te: 'いて', ta: 'いた' },
    'ぐ': { a: 'が', i: 'ぎ', e: 'げ', o: 'ご', te: 'いで', ta: 'いだ' },
    'す': { a: 'さ', i: 'し', e: 'せ', o: 'そ', te: 'して', ta: 'した' },
  };
  return map[endingChar] || { a: '', i: '', e: '', o: '', te: '', ta: '' };
};

export const conjugate = (verb: Verb, form: ConjugationForm): ConjugationResult => {
  const { romaji, kana, group } = verb;

  // 1. Dictionary Form (Identity)
  if (form === 'dictionary') return { romaji, kana };

  // 2. Irregular Verbs (includes compounds like benkyousuru, mottekuru)
  if (group === 'irr') {
    if (romaji.endsWith('suru')) {
      const rPrefix = romaji.slice(0, -4);
      const kPrefix = kana.slice(0, -2); // Remove する
      
      let rSuffix = '', kSuffix = '';
      switch (form) {
        case 'te': rSuffix = 'shite'; kSuffix = 'して'; break;
        case 'ta': rSuffix = 'shita'; kSuffix = 'した'; break;
        case 'nai': rSuffix = 'shinai'; kSuffix = 'しない'; break;
        case 'masu': rSuffix = 'shimasu'; kSuffix = 'します'; break;
        case 'potential': rSuffix = 'dekiru'; kSuffix = 'できる'; break;
        case 'passive': rSuffix = 'sareru'; kSuffix = 'される'; break;
        case 'causative': rSuffix = 'saseru'; kSuffix = 'させる'; break;
        case 'imperative': rSuffix = 'shiro'; kSuffix = 'しろ'; break;
        case 'volitional': rSuffix = 'shiyou'; kSuffix = 'しよう'; break;
        default: return { romaji, kana };
      }
      return { romaji: rPrefix + rSuffix, kana: kPrefix + kSuffix };
    }

    if (romaji.endsWith('kuru')) {
      const rPrefix = romaji.slice(0, -4);
      const kPrefix = kana.slice(0, -2); // Remove くる

      let rSuffix = '', kSuffix = '';
      switch (form) {
        case 'te': rSuffix = 'kite'; kSuffix = 'きて'; break;
        case 'ta': rSuffix = 'kita'; kSuffix = 'きた'; break;
        case 'nai': rSuffix = 'konai'; kSuffix = 'こない'; break;
        case 'masu': rSuffix = 'kimasu'; kSuffix = 'きます'; break;
        case 'potential': rSuffix = 'korareru'; kSuffix = 'こられる'; break;
        case 'passive': rSuffix = 'korareru'; kSuffix = 'こられる'; break;
        case 'causative': rSuffix = 'kosaseru'; kSuffix = 'こさせる'; break;
        case 'imperative': rSuffix = 'koi'; kSuffix = 'こい'; break;
        case 'volitional': rSuffix = 'koyou'; kSuffix = 'こよう'; break;
        default: return { romaji, kana };
      }
      return { romaji: rPrefix + rSuffix, kana: kPrefix + kSuffix };
    }
    return { romaji, kana }; 
  }

  // 3. Ichidan (Group 2)
  if (group === 'v2') {
    const rStem = romaji.slice(0, -2); // drop 'ru'
    const kStem = kana.slice(0, -1);   // drop 'る'
    
    switch (form) {
      case 'te': return { romaji: rStem + 'te', kana: kStem + 'て' };
      case 'ta': return { romaji: rStem + 'ta', kana: kStem + 'た' };
      case 'nai': return { romaji: rStem + 'nai', kana: kStem + 'ない' };
      case 'masu': return { romaji: rStem + 'masu', kana: kStem + 'ます' };
      case 'potential': return { romaji: rStem + 'rareru', kana: kStem + 'られる' };
      case 'passive': return { romaji: rStem + 'rareru', kana: kStem + 'られる' };
      case 'causative': return { romaji: rStem + 'saseru', kana: kStem + 'させる' };
      case 'imperative': return { romaji: rStem + 'ro', kana: kStem + 'ろ' };
      case 'volitional': return { romaji: rStem + 'you', kana: kStem + 'よう' };
    }
  }

  // 4. Godan (Group 1)
  if (group === 'v1') {
    const { stem: rStem, ending: rEnd } = getGodanStem(romaji);
    const kStem = kana.slice(0, -1);
    const kEndChar = kana.slice(-1);
    const kMap = getGodanKanaSuffix(kEndChar);

    switch (form) {
      case 'te': {
        const rSuffix = 
           (['u', 'tsu', 'ru'].includes(rEnd) ? 'tte' :
            ['mu', 'bu', 'nu'].includes(rEnd) ? 'nde' :
            rEnd === 'ku' ? (romaji === 'iku' ? 'itte' : 'ite') :
            rEnd === 'gu' ? 'ide' :
            rEnd === 'su' ? 'shite' : '');
        
        const kSuffix = (romaji === 'iku' ? 'いって' : kMap.te);
        return { romaji: rStem + rSuffix, kana: kStem + kSuffix };
      }
      
      case 'ta': {
        const rSuffix = 
           (['u', 'tsu', 'ru'].includes(rEnd) ? 'tta' :
            ['mu', 'bu', 'nu'].includes(rEnd) ? 'nda' :
            rEnd === 'ku' ? (romaji === 'iku' ? 'itta' : 'ita') :
            rEnd === 'gu' ? 'ida' :
            rEnd === 'su' ? 'shita' : '');
        
        const kSuffix = (romaji === 'iku' ? 'いった' : kMap.ta);
        return { romaji: rStem + rSuffix, kana: kStem + kSuffix };
      }

      case 'nai': {
        const rSuffix = 
           (rEnd === 'u' ? 'wanai' :
            rEnd === 'tsu' ? 'tanai' :
            rEnd === 'ru' ? 'ranai' :
            rEnd === 'mu' ? 'manai' :
            rEnd === 'bu' ? 'banai' :
            rEnd === 'nu' ? 'nanai' :
            rEnd === 'ku' ? 'kanai' :
            rEnd === 'gu' ? 'ganai' :
            rEnd === 'su' ? 'sanai' : '');
        
        return { romaji: rStem + rSuffix, kana: kStem + kMap.a + 'ない' };
      }

      case 'masu': {
        const rSuffix = 
          (rEnd === 'u' ? 'imasu' :
           rEnd === 'tsu' ? 'chimasu' :
           rEnd === 'ru' ? 'rimasu' :
           rEnd === 'mu' ? 'mimasu' :
           rEnd === 'bu' ? 'bimasu' :
           rEnd === 'nu' ? 'nimasu' :
           rEnd === 'ku' ? 'kimasu' :
           rEnd === 'gu' ? 'gimasu' :
           rEnd === 'su' ? 'shimasu' : '');
           
        return { romaji: rStem + rSuffix, kana: kStem + kMap.i + 'ます' };
      }

      case 'potential': {
        const rSuffix = 
          (rEnd === 'u' ? 'eru' :
           rEnd === 'tsu' ? 'teru' :
           rEnd === 'ru' ? 'reru' :
           rEnd === 'mu' ? 'meru' :
           rEnd === 'bu' ? 'beru' :
           rEnd === 'nu' ? 'neru' :
           rEnd === 'ku' ? 'keru' :
           rEnd === 'gu' ? 'geru' :
           rEnd === 'su' ? 'seru' : '');

        return { romaji: rStem + rSuffix, kana: kStem + kMap.e + 'る' };
      }

      case 'volitional': {
        const rSuffix = 
          (rEnd === 'u' ? 'ou' :
           rEnd === 'tsu' ? 'tou' :
           rEnd === 'ru' ? 'rou' :
           rEnd === 'mu' ? 'mou' :
           rEnd === 'bu' ? 'bou' :
           rEnd === 'nu' ? 'nou' :
           rEnd === 'ku' ? 'kou' :
           rEnd === 'gu' ? 'gou' :
           rEnd === 'su' ? 'sou' : '');

        return { romaji: rStem + rSuffix, kana: kStem + kMap.o + 'う' };
      }

      case 'imperative': {
         const rSuffix = 
           (rEnd === 'u' ? 'e' :
            rEnd === 'tsu' ? 'te' :
            rEnd === 'ru' ? 're' :
            rEnd === 'mu' ? 'me' :
            rEnd === 'bu' ? 'be' :
            rEnd === 'nu' ? 'ne' :
            rEnd === 'ku' ? 'ke' :
            rEnd === 'gu' ? 'ge' :
            rEnd === 'su' ? 'se' : '');
         
         return { romaji: rStem + rSuffix, kana: kStem + kMap.e };
      }
    }
  }

  return { romaji, kana };
};