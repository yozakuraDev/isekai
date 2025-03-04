import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scroll, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const RulesPage: React.FC = () => {
  const { language } = useLanguage();
  const [isAgreed, setIsAgreed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [burnEffect, setBurnEffect] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById('rules-container');
      if (container) {
        const position = container.scrollTop;
        const maxScrollPosition = container.scrollHeight - container.clientHeight;
        setScrollPosition(position);
        setMaxScroll(maxScrollPosition);
        
        // Trigger burn effect when scrolling
        if (position > 100) {
          setBurnEffect(true);
        } else {
          setBurnEffect(false);
        }
      }
    };
    
    const container = document.getElementById('rules-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleAgree = () => {
    if (scrollPosition >= maxScroll * 0.8) {
      setShowConfirmation(true);
      
      // Play magic circle effect
      const magicCircle = document.createElement('div');
      magicCircle.className = 'magic-circle-effect';
      document.body.appendChild(magicCircle);
      
      setTimeout(() => {
        magicCircle.remove();
        setIsAgreed(true);
      }, 2000);
    } else {
      alert('契約の書をすべて読んでください。 / Please read the entire contract. / 계약서를 모두 읽어주세요. / يرجى قراءة العقد بالكامل.');
    }
  };

  const translations = {
    rules: {
      ja: '百鬼異世界の契約の書',
      en: 'Contract of Hyakki Isekai',
      ko: '백귀이세계의 계약서',
      ar: 'عقد هياكي إيسيكاي'
    },
    introduction: {
      ja: 'この契約は、あなたと百鬼異世界の間で結ばれるものである。以下の条項をよく読み、同意する場合のみ契約に署名せよ。',
      en: 'This contract is established between you and Hyakki Isekai. Read the following terms carefully and sign only if you agree.',
      ko: '이 계약은 당신과 백귀이세계 사이에 체결됩니다. 다음 조항을 주의 깊게 읽고 동의하는 경우에만 계약에 서명하십시오.',
      ar: 'تم إنشاء هذا العقد بينك وبين هياكي إيسيكاي. اقرأ الشروط التالية بعناية ووقع فقط إذا كنت توافق.'
    },
    agree: {
      ja: '契約に同意する',
      en: 'Agree to Contract',
      ko: '계약에 동의합니다',
      ar: 'أوافق على العقد'
    },
    confirmation: {
      ja: '契約が結ばれました。あなたの魂は百鬼異世界に繋がれました。',
      en: 'The contract has been established. Your soul is now bound to Hyakki Isekai.',
      ko: '계약이 체결되었습니다. 당신의 영혼은 이제 백귀이세계에 묶여 있습니다.',
      ar: 'تم إنشاء العقد. روحك الآن مرتبطة بـ هياكي إيسيكاي.'
    },
    scrollToRead: {
      ja: 'スクロールして全文を読む',
      en: 'Scroll to read the entire document',
      ko: '스크롤하여 전체 문서 읽기',
      ar: 'قم بالتمرير لقراءة المستند بالكامل'
    }
  };

  const rules = {
    ja: [
      "第1条: 全ての冒険者は、百鬼異世界に入る前に本契約に同意しなければならない。",
      "第2条: 他の冒険者への意図的な妨害行為は禁止する。違反者は異世界から追放される。",
      "第3条: 初心者エリアでのPvPは禁止。違反者には厳しい罰則が課される。",
      "第4条: チートやハックの使用は厳禁。発見次第、永久追放の対象となる。",
      "第5条: 全ての冒険者は、世界の調和を乱す行為を慎まなければならない。",
      "第6条: 血月の夜には特別なルールが適用される。詳細は公式アナウンスを確認せよ。",
      "第7条: 百鬼との契約は、一度結んだら破棄できない。慎重に選択せよ。",
      "第8条: 異世界の資源は共有財産である。過剰な収集は禁止する。",
      "第9条: 他の冒険者への暴言や嫌がらせは禁止。尊重の精神を持て。",
      "第10条: サーバー管理者の指示には必ず従うこと。",
      "第11条: 異世界の秘密を現実世界に漏らすことを禁ずる。",
      "第12条: 百鬼討伐の報酬は、貢献度に応じて公平に分配される。",
      "第13条: 異世界の魔法は、正しい目的のためにのみ使用すること。",
      "第14条: 冒険者同士の取引は、双方の合意の下で行われなければならない。",
      "第15条: 異世界の生態系を破壊する行為は厳禁。",
      "第16条: 特定のイベント期間中は、追加のルールが適用される場合がある。",
      "第17条: 冒険者は自身の行動に責任を持ち、結果を受け入れること。",
      "第18条: 異世界の住人（NPC）に対する攻撃は、正当な理由がない限り禁止。",
      "第19条: バグや不具合を発見した場合は、悪用せず速やかに報告すること。",
      "第20条: 百鬼異世界での体験は、各冒険者の責任において行われる。",
      "第21条: 契約違反者には、状況に応じた罰則が課される。",
      "第22条: 本契約は予告なく変更される場合がある。最新版を常に確認すること。",
      "第23条: 冒険者は定期的に異世界の掲示板をチェックし、重要な情報を見逃さないようにすること。",
      "第24条: 異世界での死は、一時的な現象である。しかし、死に伴うペナルティは避けられない。",
      "第25条: この契約に署名することで、あなたの魂は百鬼異世界と永遠に結びつく。"
    ],
    en: [
      "Article 1: All adventurers must agree to this contract before entering Hyakki Isekai.",
      "Article 2: Intentional interference with other adventurers is prohibited. Violators will be banished from the other world.",
      "Article 3: PvP is prohibited in beginner areas. Violators will face severe penalties.",
      "Article 4: The use of cheats or hacks is strictly prohibited. Upon discovery, permanent banishment will be enforced.",
      "Article 5: All adventurers must refrain from actions that disturb the harmony of the world.",
      "Article 6: Special rules apply on the night of the blood moon. Check official announcements for details.",
      "Article 7: Contracts with Hyakki cannot be discarded once formed. Choose wisely.",
      "Article 8: Resources of the other world are shared property. Excessive collection is prohibited.",
      "Article 9: Abusive language or harassment towards other adventurers is prohibited. Maintain a spirit of respect.",
      "Article 10: Always follow the instructions of server administrators.",
      "Article 11: It is forbidden to leak secrets of the other world to the real world.",
      "Article 12: Rewards for defeating Hyakki are distributed fairly according to contribution.",
      "Article 13: Magic of the other world should only be used for righteous purposes.",
      "Article 14: Transactions between adventurers must be conducted under mutual agreement.",
      "Article 15: Actions that destroy the ecosystem of the other world are strictly prohibited.",
      "Article 16: Additional rules may apply during specific event periods.",
      "Article 17: Adventurers must take responsibility for their actions and accept the consequences.",
      "Article 18: Attacks on residents of the other world (NPCs) are prohibited without just cause.",
      "Article 19: If bugs or defects are discovered, report them promptly without exploitation.",
      "Article 20: Experiences in Hyakki Isekai are conducted at the responsibility of each adventurer.",
      "Article 21: Contract violators will be subject to penalties according to the situation.",
      "Article 22: This contract may be changed without notice. Always check for the latest version.",
      "Article 23: Adventurers should regularly check the bulletin board of the other world to avoid missing important information.",
      "Article 24: Death in the other world is a temporary phenomenon. However, penalties associated with death cannot be avoided.",
      "Article 25: By signing this contract, your soul is eternally bound to Hyakki Isekai."
    ],
    ko: [
      "제1조: 모든 모험가는 백귀이세계에 들어가기 전에 본 계약에 동의해야 합니다.",
      "제2조: 다른 모험가에 대한 의도적인 방해 행위는 금지됩니다. 위반자는 이세계에서 추방됩니다.",
      "제3조: 초보자 구역에서의 PvP는 금지됩니다. 위반자에게는 엄격한 처벌이 부과됩니다.",
      "제4조: 치트나 핵의 사용은 엄격히 금지됩니다. 발견 즉시 영구 추방 대상이 됩니다.",
      "제5조: 모든 모험가는 세계의 조화를 방해하는 행위를 삼가야 합니다.",
      "제6조: 핏빛 달의 밤에는 특별한 규칙이 적용됩니다. 자세한 내용은 공식 발표를 확인하세요.",
      "제7조: 백귀와의 계약은 한 번 맺으면 파기할 수 없습니다. 신중하게 선택하세요.",
      "제8조: 이세계의 자원은 공유 재산입니다. 과도한 수집은 금지됩니다.",
      "제9조: 다른 모험가에 대한 욕설이나 괴롭힘은 금지됩니다. 존중의 정신을 가지세요.",
      "제10조: 서버 관리자의 지시에 반드시 따라야 합니다.",
      "제11조: 이세계의 비밀을 현실 세계에 누설하는 것을 금지합니다.",
      "제12조: 백귀 토벌의 보상은 기여도에 따라 공정하게 분배됩니다.",
      "제13조: 이세계의 마법은 올바른 목적을 위해서만 사용해야 합니다.",
      "제14조: 모험가 간의 거래는 양측의 합의 하에 이루어져야 합니다.",
      "제15조: 이세계의 생태계를 파괴하는 행위는 엄격히 금지됩니다.",
      "제16조: 특정 이벤트 기간 중에는 추가 규칙이 적용될 수 있습니다.",
      "제17조: 모험가는 자신의 행동에 책임을 지고 결과를 받아들여야 합니다.",
      "제18조: 이세계 주민(NPC)에 대한 공격은 정당한 이유 없이 금지됩니다.",
      "제19조: 버그나 결함을 발견한 경우 악용하지 말고 신속히 보고해야 합니다.",
      "제20조: 백귀이세계에서의 경험은 각 모험가의 책임 하에 이루어집니다.",
      "제21조: 계약 위반자에게는 상황에 따른 처벌이 부과됩니다.",
      "제22조: 본 계약은 예고 없이 변경될 수 있습니다. 항상 최신 버전을 확인하세요.",
      "제23조: 모험가는 정기적으로 이세계의 게시판을 확인하여 중요한 정보를 놓치지 않도록 해야 합니다.",
      "제24조: 이세계에서의 죽음은 일시적인 현상입니다. 그러나 죽음에 따른 페널티는 피할 수 없습니다.",
      "제25조: 이 계약에 서명함으로써 당신의 영혼은 백귀이세계와 영원히 연결됩니다."
    ],
    ar: [
      "المادة 1: يجب على جميع المغامرين الموافقة على هذا العقد قبل دخول هياكي إيسيكاي.",
      "المادة 2: يُحظر التدخل المتعمد مع المغامرين الآخرين. سيتم نفي المخالفين من العالم الآخر.",
      "المادة 3: يُحظر القتال بين اللاعبين في مناطق المبتدئين. سيواجه المخالفون عقوبات شديدة.",
      "المادة 4: استخدام الغش أو الاختراق محظور بشدة. عند اكتشافه، سيتم فرض النفي الدائم.",
      "المادة 5: يجب على جميع المغامرين الامتناع عن الأفعال التي تخل بانسجام العالم.",
      "المادة 6: تنطبق قواعد خاصة في ليلة القمر الدموي. تحقق من الإعلانات الرسمية للحصول على التفاصيل.",
      "المادة 7: لا يمكن التخلص من العقود مع هياكي بمجرد تشكيلها. اختر بحكمة.",
      "المادة 8: موارد العالم الآخر هي ملكية مشتركة. يُحظر الجمع المفرط.",
      "المادة 9: يُحظر استخدام لغة مسيئة أو مضايقة المغامرين الآخرين. حافظ على روح الاحترام.",
      "المادة 10: اتبع دائمًا تعليمات مسؤولي الخادم.",
      "المادة 11: يُمنع تسريب أسرار العالم الآخر إلى العالم الحقيقي.",
      "المادة 12: يتم توزيع مكافآت هزيمة هياكي بشكل عادل وفقًا للمساهمة.",
      "المادة 13: يجب استخدام سحر العالم الآخر للأغراض الصالحة فقط.",
      "المادة 14: يجب إجراء المعاملات بين المغامرين بموجب اتفاق متبادل.",
      "المادة 15: الأفعال التي تدمر النظام البيئي للعالم الآخر محظورة بشدة.",
      "المادة 16: قد تنطبق قواعد إضافية خلال فترات الأحداث المحددة.",
      "المادة 17: يجب على المغامرين تحمل مسؤولية أفعالهم وقبول العواقب.",
      "المادة 18: يُحظر الهجوم على سكان العالم الآخر (الشخصيات غير اللاعبة) بدون سبب عادل.",
      "المادة 19: إذا تم اكتشاف أخطاء أو عيوب، قم بالإبلاغ عنها فورًا دون استغلالها.",
      "المادة 20: تتم تجارب في هياكي إيسيكاي على مسؤولية كل مغامر.",
      "المادة 21: سيخضع مخالفو العقد لعقوبات وفقًا للموقف.",
      "المادة 22: قد يتم تغيير هذا العقد دون إشعار. تحقق دائمًا من أحدث إصدار.",
      "المادة 23: يجب على المغامرين التحقق بانتظام من لوحة الإعلانات في العالم الآخر لتجنب فقدان المعلومات المهمة.",
      "المادة 24: الموت في العالم الآخر هو ظاهرة مؤقتة. ومع ذلك، لا يمكن تجنب العقوبات المرتبطة بالموت.",
      "المادة 25: بالتوقيع على هذا العقد، ترتبط روحك أبديًا بـ هياكي إيسيكاي."
    ]
  };

  return (
    <motion.div 
      className="content-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">
        {translations.rules[language as keyof typeof translations.rules]}
      </h1>
      
      {!isAgreed ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 shadow-lg mb-8">
            <p className="text-xl mb-6">
              {translations.introduction[language as keyof typeof translations.introduction]}
            </p>
            
            <div className="text-center text-gray-400 mb-4">
              <Scroll className="inline-block mr-2 mb-1" />
              {translations.scrollToRead[language as keyof typeof translations.scrollToRead]}
            </div>
            
            <div 
              id="rules-container"
              className="max-h-96 overflow-y-auto pr-4 mb-8 rules-scroll"
              style={{
                backgroundImage: burnEffect ? 'linear-gradient(to bottom, rgba(255, 100, 0, 0.1), transparent)' : 'none'
              }}
            >
              <ul className="space-y-4">
                {rules[language as keyof typeof rules]?.map((rule, index) => (
                  <li key={index} className="flex">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-center">
              <motion.button
                className="magic-btn bg-purple-900 text-white px-8 py-4 rounded-md text-xl font-bold border-2 border-purple-500 hover:bg-purple-800 transition-all duration-300 shadow-lg shadow-purple-900/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAgree}
              >
                {translations.agree[language as keyof typeof translations.agree]}
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          className="max-w-2xl mx-auto bg-gray-900 bg-opacity-80 rounded-lg p-8 shadow-lg text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {translations.confirmation[language as keyof typeof translations.confirmation]}
          </h2>
        </motion.div>
      )}
      
      {showConfirmation && (
        <div className="magic-circle-effect"></div>
      )}
      
      <style jsx>{`
        .rules-scroll::-webkit-scrollbar {
          width: 8px;
        }
        
        .rules-scroll::-webkit-scrollbar-track {
          background: rgba(30, 30, 30, 0.5);
          border-radius: 4px;
        }
        
        .rules-scroll::-webkit-scrollbar-thumb {
          background: rgba(138, 43, 226, 0.7);
          border-radius: 4px;
        }
        
        .rules-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(138, 43, 226, 1);
        }
        
        .magic-circle-effect {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-image: url('https://i.imgur.com/JlOBUKj.gif');
          background-size: cover;
          background-position: center;
          pointer-events: none;
          z-index: 50;
          opacity: 0.3;
          animation: fadeInOut 2s ease-in-out;
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0; }
          50% { opacity: 0.3; }
          100% { opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
};

export default RulesPage;