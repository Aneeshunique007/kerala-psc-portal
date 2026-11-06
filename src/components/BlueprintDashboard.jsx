import React, { useState } from 'react';
import { ArrowRightIcon } from './Icons';

export default function BlueprintDashboard({
  currentUser,
  onStartPractice,
  onStartMock,
  questionCounts = {}
}) {
  const [filterSection, setFilterSection] = useState('all');

  const sections = [
    {
      id: 'part1',
      title: 'Part I: പൊതുവിജ്ഞാനം (General Knowledge)',
      marks: '50 Marks',
      accentColor: '#3b82f6',
      badgeClass: 'badge-gk',
      desc: 'ചരിത്രം (5M), ഭൂമിശാസ്ത്രം (5M), ധനതത്വശാസ്ത്രം (5M), ഭരണഘടന (5M), കേരള ഭരണം (5M), ജീവശാസ്ത്രം (6M), ഭൗതികശാസ്ത്രം (3M), രസതന്ത്രം (3M), കല-കായികം-സാഹിത്യം (5M), കമ്പ്യൂട്ടർ (3M), സുപ്രധാന നിയമങ്ങൾ (5M)',
      topics: [
        {
          num: '1',
          name: 'കേരള ചരിത്രം (Kerala History)',
          marks: '5 Marks (i–iii)',
          subject: 'pyq',
          topicId: 'pq_kerala_history',
          icon: '🏛️',
          details: 'കേരളത്തിലേക്കുള്ള യൂറോപ്യന്മാരുടെ വരവ്, യൂറോപ്യന്മാരുടെ സംഭാവനകൾ, മാർത്താണ്ഡവർമ്മ മുതൽ ശ്രീ ചിത്തിരതിരുനാൾ വരെ തിരുവിതാംകൂർ ചരിത്രം, കൊച്ചി-മലബാർ ചരിത്രം, സാമൂഹിക-മത പരിഷ്കരണ പ്രസ്ഥാനങ്ങൾ, ദേശീയ പ്രസ്ഥാനം കേരളത്തിൽ, ഐക്യകേരള പ്രസ്ഥാനം, 1956-ന് ശേഷമുള്ള സാമൂഹ്യരാഷ്ട്രീയ ചരിത്രം.'
        },
        {
          num: '2',
          name: 'ഇന്ത്യാ ചരിത്രം (Indian History)',
          marks: '5 Marks (i–iii)',
          subject: 'pyq',
          topicId: 'pq_indian_history',
          icon: '🇮🇳',
          details: 'മധ്യകാല ഇന്ത്യ, രാഷ്ട്രീയ ചരിത്രം, ഭരണപരിഷ്കാരങ്ങൾ, സംഭാവനകൾ, ഒന്നാം സ്വാതന്ത്ര്യ സമരം (1857), ഇന്ത്യൻ നാഷണൽ കോൺഗ്രസിന്റെ രൂപീകരണം, സ്വദേശി പ്രസ്ഥാനം, സാമൂഹ്യപരിഷ്കരണ പ്രസ്ഥാനങ്ങൾ, പത്രങ്ങൾ, സാഹിത്യവും കലയും, ഗാന്ധിജിയും ദേശീയ പ്രസ്ഥാനവും, സ്വാതന്ത്ര്യാനന്തര ഇന്ത്യ, സംസ്ഥാന പുനഃസംഘടന, വിദേശനയം.'
        },
        {
          num: '3',
          name: 'ലോക ചരിത്രം (World History)',
          marks: '5 Marks (i–iii)',
          subject: 'pyq',
          topicId: 'pq_world_history',
          icon: '🌐',
          details: 'ഇംഗ്ലീഷ് വിപ്ലവം (Glorious Revolution), അമേരിക്കൻ സ്വാതന്ത്ര്യ സമരം, ഫ്രഞ്ച് വിപ്ലവം, റഷ്യൻ വിപ്ലവം, ചൈനീസ് വിപ്ലവം, രണ്ടാം ലോക മഹായുദ്ധാനന്തര രാഷ്ട്രീയ ചരിത്രം, ഐക്യരാഷ്ട്ര സംഘടന (UNO) & മറ്റ് അന്താരാഷ്ട്ര സംഘടനകൾ.'
        },
        {
          num: '4',
          name: 'ഭൂമിശാസ്ത്ര അടിസ്ഥാന തത്വങ്ങൾ (Basic Geography)',
          marks: '5 Marks (iv–vi)',
          subject: 'pyq',
          topicId: 'pq_basic_geography',
          icon: '🪐',
          details: 'ഭൂമിയുടെ ഘടന, അന്തരീക്ഷം, പാറകൾ, ഭൗമോപരിതല രൂപങ്ങൾ, അന്തരീക്ഷമർദ്ദവും കാറ്റുകളും, താപനിലയും ഋതുഭേദങ്ങളും, ആഗോളപ്രശ്നങ്ങളും ആഗോളതാപനവും, ഭൂപടങ്ങൾ, ടോപ്പോഗ്രാഫിക് മാപ്പുകളും അടയാളങ്ങളും, വിദൂര സംവേദനം (Remote Sensing), ഭൂമിശാസ്ത്ര വിവര വ്യവസ്ഥ (GIS), മഹാസമുദ്രങ്ങളും സമുദ്രചലനങ്ങളും, ഭൂഖണ്ഡങ്ങൾ, സമയവും അക്ഷാംശ-രേഖാംശ രേഖകളും.'
        },
        {
          num: '5',
          name: 'ഇന്ത്യ — ഭൂമിശാസ്ത്ര സവിശേഷതകൾ (Indian Geography)',
          marks: '5 Marks (iv–vi)',
          subject: 'pyq',
          topicId: 'pq_indian_geography',
          icon: '🗺️',
          details: 'ഇന്ത്യയുടെ ഭൂപ്രകൃതി, സംസ്ഥാനങ്ങളും സവിശേഷതകളും, ഉത്തരേന്ത്യൻ സമതലം, ഉപദ്വീപീയ പീഠഭൂമി, തീരപ്രദേശം, ഇന്ത്യൻ നദികൾ, കാലാവസ്ഥ, സ്വാഭാവിക സസ്യജാലം, കൃഷി, മണ്ണിനങ്ങൾ, ധാതുക്കളും വ്യവസായവും, ഊർജ്ജസ്രോതസ്സുകൾ, റോഡ്-ജല-റെയിൽ-വ്യോമ ഗതാഗത സംവിധാനങ്ങൾ.'
        },
        {
          num: '6',
          name: 'കേരളം — ഭൂമിശാസ്ത്ര സവിശേഷതകൾ (Kerala Geography)',
          marks: '5 Marks (iv–vi)',
          subject: 'pyq',
          topicId: 'pq_kerala_geography',
          icon: '🌴',
          details: 'കേരളത്തിന്റെ ഭൂപ്രകൃതി, 14 ജില്ലകളും സവിശേഷതകളും, നദികൾ, കായലുകൾ, കാലാവസ്ഥ, മണ്ണിനങ്ങൾ, സ്വാഭാവിക സസ്യജാലം, വന്യജീവി സങ്കേതങ്ങളും ദേശീയോദ്യാനങ്ങളും, മത്സ്യബന്ധനം, ധാതുക്കൾ, വ്യവസായം, അടിസ്ഥാന സൗകര്യങ്ങൾ, കൃഷി, ഗതാഗത സംവിധാനങ്ങൾ.'
        },
        {
          num: '7',
          name: 'ധനതത്വശാസ്ത്രം — ഇന്ത്യ : സാമ്പത്തിക രംഗം (Economics)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_economics',
          icon: '📈',
          details: 'ഇന്ത്യയുടെ സാമ്പത്തിക രംഗം, പഞ്ചവത്സര പദ്ധതികൾ, ആസൂത്രണ കമ്മീഷൻ, നീതി ആയോഗ് (NITI Aayog), നവ സാമ്പത്തിക പരിഷ്കാരങ്ങൾ, റിസർവ് ബാങ്ക് (RBI) & ധനകാര്യ സ്ഥാപനങ്ങൾ, കാർഷിക വിളകൾ, ധാതുക്കൾ, ഹരിത വിപ്ലവം.'
        },
        {
          num: '8',
          name: 'ഇന്ത്യൻ ഭരണഘടന (Indian Constitution)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_constitution',
          icon: '⚖️',
          details: 'ഭരണഘടനാ നിർമ്മാണ സഭ, ആമുഖം, മൗലികാവകാശങ്ങൾ, നിർദ്ദേശക തത്വങ്ങൾ, മൗലിക കർത്തവ്യങ്ങൾ, പൗരത്വം, ഭരണഘടനാ ഭേദഗതികൾ (42, 44, 52, 73, 74, 86, 91), പഞ്ചായത്തീരാജ്, ഭരണഘടനാ സ്ഥാപനങ്ങളും ചുമതലകളും, യൂണിയൻ ലിസ്റ്റ്-സ്റ്റേറ്റ് ലിസ്റ്റ്-കൺകറന്റ് ലിസ്റ്റ്.'
        },
        {
          num: '9',
          name: 'കേരളം — ഭരണവും ഭരണസംവിധാനങ്ങളും (Kerala Governance)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_kerala_governance',
          icon: '🏢',
          details: 'കേരളം — സംസ്ഥാന സിവിൽ സർവീസ്, ഭരണഘടനാ സ്ഥാപനങ്ങൾ, വിവിധ കമ്മീഷനുകൾ, സാമൂഹിക ക്ഷേമ പദ്ധതികൾ, ഭൂപരിഷ്കരണം, സാമൂഹ്യ സുരക്ഷാ പെൻഷനുകൾ, കുടുംബശ്രീ, ദേശീയ ഗ്രാമീണ തൊഴിൽ പദ്ധതികൾ, ദുരന്ത നിവാരണ അതോറിറ്റി, സ്ത്രീ-ശിശു സംരക്ഷണം.'
        },
        {
          num: '10',
          name: 'ജീവശാസ്ത്രവും പൊതുജനാരോഗ്യവും (Biology & Public Health)',
          marks: '6 Marks',
          subject: 'pyq',
          topicId: 'pq_biology',
          icon: '🧬',
          details: 'മനുഷ്യശരീരത്തെക്കുറിച്ചുള്ള പൊതുഅറിവ്, അവയവങ്ങളും അവയവ വ്യവസ്ഥകളും, പോഷകഘടകങ്ങളും അപര്യാപ്തതാരോഗങ്ങളും, സാംക്രമിക രോഗങ്ങളും രോഗകാരികളും, കേരളത്തിലെ ആരോഗ്യക്ഷേമ പ്രവർത്തനങ്ങൾ, ജീവിതശൈലി രോഗങ്ങൾ, സസ്യങ്ങളും വനങ്ങളും, പരിസ്ഥിതിയും ആവാസവ്യവസ്ഥയും.'
        },
        {
          num: '11',
          name: 'ഭൗതികശാസ്ത്രം (Physics)',
          marks: '3 Marks',
          subject: 'pyq',
          topicId: 'pq_physics',
          icon: '⚛️',
          details: 'ഭൗതികശാസ്ത്ര ശാഖകൾ, ദ്രവ്യം, യൂണിറ്റുകളും അളവുകളും, പ്രകാശം, ശബ്ദം, താപം, ചലനം, ചലനനിയമങ്ങൾ, തരംഗങ്ങൾ, ബലം, കാന്തികത, വൈദ്യുതി, മർദ്ദം, പ്ലവക്ഷമത, ബഹിരാകാശ ശാസ്ത്രവും ISRO ദൗത്യങ്ങളും, സൗരയൂഥം, ഊർജ്ജവും ഊർജ്ജസ്രോതസ്സുകളും.'
        },
        {
          num: '12',
          name: 'രസതന്ത്രം (Chemistry)',
          marks: '3 Marks',
          subject: 'pyq',
          topicId: 'pq_chemistry',
          icon: '🧪',
          details: 'ആറ്റവും തന്മാത്രയും, ദ്രവ്യത്തിന്റെ അവസ്ഥകൾ, മൂലകങ്ങളും ആവർത്തനപ്പട്ടികയും, സംയുക്തങ്ങളും രാസപ്രവർത്തനങ്ങളും, ലോഹങ്ങളും അലോഹങ്ങളും സങ്കരലോഹങ്ങളും, ആസിഡും ആൽക്കലിയും (pH മൂല്യം), വാതക നിയമങ്ങൾ.'
        },
        {
          num: '13',
          name: 'കലയും സംസ്കാരവും (Arts & Culture)',
          marks: '5 Marks (xiii–xv)',
          subject: 'pyq',
          topicId: 'pq_arts_culture',
          icon: '🎭',
          details: 'കേരളത്തിലെ പ്രധാന ദൃശ്യ-ശ്രാവ്യ കലാരൂപങ്ങൾ (ഉത്ഭവം, വ്യാപനം, പരിശീലനം), പ്രശസ്തമായ സ്ഥലങ്ങൾ, പ്രശസ്തമായ സ്ഥാപനങ്ങൾ, പ്രശസ്തരായ കലാകാരന്മാർ, ഉത്സവങ്ങളും ക്ഷേത്രങ്ങളും.'
        },
        {
          num: '14',
          name: 'കായികം (Sports)',
          marks: '5 Marks (xiii–xv)',
          subject: 'pyq',
          topicId: 'pq_sports',
          icon: '🏆',
          details: 'കായികരംഗത്ത് വ്യക്തിമുദ്ര പതിപ്പിച്ച കേരളത്തിലെയും ഇന്ത്യയിലെയും ലോകത്തിലെയും പ്രധാന കായികതാരങ്ങൾ, പ്രധാന അവാർഡുകൾ, ട്രോഫികൾ, ഒളിമ്പിക്സ്, ഏഷ്യൻ ഗെയിംസ്, കോമൺവെൽത്ത് ഗെയിംസ്, ദേശീയ ഗെയിംസ്, കായിക പദങ്ങളും ഗ്രൗണ്ടുകളും.'
        },
        {
          num: '15',
          name: 'സാഹിത്യവും സിനിമയും (Literature & Cinema)',
          marks: '5 Marks (xiii–xv)',
          subject: 'pyq',
          topicId: 'pq_literature_cinema',
          icon: '🎬',
          details: 'മലയാളത്തിലെ പ്രധാന സാഹിത്യ പ്രസ്ഥാനങ്ങൾ, ആദ്യകൃതികൾ, ഗ്രന്ഥകർത്താക്കൾ, തൂലികാനാമങ്ങൾ, കഥാപാത്രങ്ങൾ, ജ്ഞാനപീഠം-എഴുത്തച്ഛൻ പുരസ്കാരങ്ങൾ, മലയാള സിനിമയുടെ ഉത്ഭവം, വളർച്ച, നാഴികക്കല്ലുകൾ, ദേശീയ ചലച്ചിത്ര പുരസ്കാരങ്ങൾ.'
        },
        {
          num: '16',
          name: 'കമ്പ്യൂട്ടർ അടിസ്ഥാന വിവരങ്ങൾ (Computer Basics)',
          marks: '3 Marks',
          subject: 'pyq',
          topicId: 'pq_computer',
          icon: '💻',
          details: 'Hardware (Input Devices, Output Devices, Memory — Primary & Secondary), Software (System, Application, Operating Systems), Computer Networks (LAN, WAN, MAN), Internet (WWW, E-Mail, Search Engines, Social Media, HTML Basics), Cyber Crimes & IT Act 2000.'
        },
        {
          num: '17',
          name: 'സുപ്രധാന നിയമങ്ങൾ (Important Acts & Laws)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_acts_laws',
          icon: '📜',
          details: 'വിവരാവകാശ നിയമം (RTI Act 2005 — കേന്ദ്ര-സംസ്ഥാന വിവരാവകാശ കമ്മീഷൻ), ഉപഭോക്തൃ സംരക്ഷണ നിയമം, മനുഷ്യാവകാശ സംരക്ഷണ നിയമം (NHRC & SHRC), പട്ടികജാതി-പട്ടികവർഗ്ഗ അതിക്രമങ്ങൾ തടയൽ നിയമം (1989), ഗാർഹിക പീഡന നിരോധന നിയമം (2005), വനിതാ കമ്മീഷൻ, പോക്സോ (POCSO Act 2012) & ബാലാവകാശ സംരക്ഷണം.'
        }
      ]
    },
    {
      id: 'part2',
      title: 'Part II: ആനുകാലിക വിഷയങ്ങൾ (Current Affairs)',
      marks: '20 Marks',
      accentColor: '#06b6d4',
      badgeClass: 'badge-ca',
      desc: 'ദേശീയ, അന്തർദേശീയ, സംസ്ഥാന തലത്തിലുള്ള സമകാലിക സംഭവങ്ങൾ, പുരസ്കാരങ്ങൾ, കായിക നേട്ടങ്ങൾ',
      topics: [
        {
          num: '18',
          name: 'ആനുകാലിക വിഷയങ്ങൾ — PYQ (Current Affairs PYQs)',
          marks: '20 Marks',
          subject: 'pyq',
          topicId: 'pq_current_affairs',
          icon: '📰',
          details: 'കേരളം — ആനുകാലികം, ഇന്ത്യ — ദേശീയ ആനുകാലികം, ലോകം — അന്താരാഷ്ട്ര ആനുകാലികം, പുരസ്കാരങ്ങളും ബഹുമതികളും, കായിക ആനുകാലികം, ശാസ്ത്ര-സാങ്കേതിക-ബഹിരാകാശ ആനുകാലികം.'
        }
      ]
    },
    {
      id: 'part3',
      title: 'Part III: ലഘുഗണിതവും മാനസിക ശേഷിയും (Simple Arithmetic & Mental Ability)',
      marks: '10 Marks',
      accentColor: '#6366f1',
      badgeClass: 'badge-maths',
      desc: 'ലഘുഗണിതം (5 Marks) + മാനസിക ശേഷിയും നിരീക്ഷണപാടവ പരിശോധനയും (5 Marks)',
      topics: [
        {
          num: '19',
          name: 'ലഘുഗണിതം (Simple Arithmetic)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_arithmetic',
          icon: '🔢',
          details: 'സംഖ്യകളും അടിസ്ഥാന ക്രിയകളും, ഭിന്നസംഖ്യകളും ദശാംശ സംഖ്യകളും, ശതമാനം (Percentage), ലാഭവും നഷ്ടവും, സാധാരണ പലിശയും കൂട്ടുപലിശയും, അംശബന്ധവും അനുപാതവും, സമയവും ദൂരവും, സമയവും പ്രവൃത്തിയും, ശരാശരി, കൃത്യങ്കങ്ങൾ, ജ്യാമിതീയ രൂപങ്ങളുടെ ചുറ്റളവ്, വിസ്തീർണ്ണം, വ്യാപ്തം, പ്രോഗ്രഷനുകൾ.'
        },
        {
          num: '20',
          name: 'മാനസിക ശേഷിയും നിരീക്ഷണപാടവവും (Mental Ability)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_mental_ability',
          icon: '🧠',
          details: 'സംഖ്യാ ശ്രേണികളും അക്ഷര ശ്രേണികളും (Series), ഗണിത ചിഹ്നങ്ങൾ ഉപയോഗിച്ചുള്ള ക്രിയകൾ, സ്ഥാന നിർണ്ണയ പരിശോധന, സമാന ബന്ധങ്ങൾ (Analogy), ഒറ്റയാനെ കണ്ടെത്തുക (Odd Man Out), കോഡിംഗും ഡീകോഡിംഗും, കുടുംബ ബന്ധങ്ങൾ (Blood Relations), ദിശാവബോധം, ഘടികാരത്തിലെ സമയവും കോണളവും, കലണ്ടറും തീയതിയും, ക്ലറിക്കൽ ശേഷി പരിശോധന.'
        }
      ]
    },
    {
      id: 'part4',
      title: 'Part IV: ജനറൽ ഇംഗ്ലീഷ് (General English)',
      marks: '10 Marks',
      accentColor: '#3b82f6',
      badgeClass: 'badge-english',
      desc: 'English Grammar (5 Marks) + English Vocabulary (5 Marks)',
      topics: [
        {
          num: '21',
          name: 'English Grammar (PYQs)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_english_grammar',
          icon: '📝',
          details: 'Types of Sentences and Interchange, Parts of Speech, Agreement of Verb and Subject, Confusion of Adjectives and Adverbs, Comparison of Adjectives, Adverbs & Position, Articles, Uses of Primary and Modal Auxiliary Verbs, Tag Questions, Infinitive and Gerunds, Tenses & Conditional Sentences, Prepositions, Correlatives, Direct and Indirect Speech, Active and Passive Voice, Correction of Sentences.'
        },
        {
          num: '22',
          name: 'English Vocabulary (PYQs)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_english_vocabulary',
          icon: '📖',
          details: 'Singular & Plural, Change of Gender, Collective Nouns, Word Formation & Prefix/Suffix, Compound Words, Synonyms & Antonyms, Phrasal Verbs, Foreign Words and Phrases, One Word Substitutes, Words Often Confused, Spelling Test, Idioms and their Meanings, Expansion and Abbreviations.'
        }
      ]
    },
    {
      id: 'part5',
      title: 'Part V: പ്രാദേശിക ഭാഷകൾ (മലയാളം)',
      marks: '10 Marks',
      accentColor: '#0ea5e9',
      badgeClass: 'badge-malayalam',
      desc: 'മലയാള വ്യാകരണവും പദസമ്പത്തും സാഹിത്യവും (10 Marks)',
      topics: [
        {
          num: '23',
          name: 'മലയാളം — PYQ (Malayalam PYQs)',
          marks: '10 Marks',
          subject: 'pyq',
          topicId: 'pq_malayalam',
          icon: '📚',
          details: 'പദശുദ്ധി, വാക്യശുദ്ധി, പരിഭാഷ (Translation), ഒറ്റപ്പദം, പര്യായം, വിപരീത പദം, ശൈലികൾ & പഴഞ്ചൊല്ലുകൾ, സമാനപദം, ചേർത്തെഴുതുക / സന്ധി / സമാസം, സ്ത്രീലിംഗം / പുല്ലിംഗം, വചനം, പിരിച്ചെഴുതുക, ഘടകപദം (വാക്യം ചേർത്തെഴുതുക), മലയാള സാഹിത്യവും കൃതികളും.'
        }
      ]
    }
  ];

  const filteredSections = filterSection === 'all'
    ? sections
    : sections.filter(s => s.id === filterSection);

  const totalQuestions = (questionCounts.malayalam || 0) + (questionCounts.english || 0) + (questionCounts.pyq || 0);

  return (
    <div className="blueprint-dashboard-page">
      {/* Hero Banner */}
      <div className="blueprint-hero">
        <div className="blueprint-hero-content">
          <div className="blueprint-hero-badge">
            <span className="badge-dot" />
            <span>Official Syllabus Blueprint • Category No: 503/2023, 504/2023</span>
          </div>
          <h1 className="blueprint-hero-title">
            Kerala PSC LD Clerk (LDC) 100-Mark Master Blueprint
          </h1>
          <p className="blueprint-hero-subtitle">
            Complete exam-pattern syllabus breakdown with direct access to official PYQs and subject question banks. 75 minutes, 100 OMR marks.
          </p>

          <div className="blueprint-hero-stats">
            <div className="hero-stat-card">
              <span className="hero-stat-label">Total Questions</span>
              <strong className="hero-stat-value">{totalQuestions.toLocaleString()} Qs</strong>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-label">Exam Duration</span>
              <strong className="hero-stat-value">75 Mins</strong>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-label">Total Marks</span>
              <strong className="hero-stat-value">100 Marks</strong>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-label">Mark Weightage</span>
              <strong className="hero-stat-value">+1 / -0.33</strong>
            </div>
          </div>

          <div className="blueprint-hero-actions">
            <button
              type="button"
              className="btn btn-primary blueprint-cta-btn"
              onClick={() => onStartMock('pyq', 'all')}
            >
              <span>Start Full 100-Mark Mock Exam</span>
              <ArrowRightIcon size={16} />
            </button>
            <button
              type="button"
              className="btn btn-secondary blueprint-secondary-btn"
              onClick={() => onStartPractice('malayalam', 'all')}
            >
              <span>Practice Malayalam (10 Marks)</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary blueprint-secondary-btn"
              onClick={() => onStartPractice('english', 'all')}
            >
              <span>Practice General English (10 Marks)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 100 Marks Distribution Bar */}
      <div className="blueprint-mark-overview">
        <div className="mark-overview-title">Official 100-Mark Distribution Breakdown</div>
        <div className="blueprint-strip-grid">
          <div
            className={`blueprint-strip-item strip-gk ${filterSection === 'part1' ? 'active' : ''}`}
            onClick={() => setFilterSection(filterSection === 'part1' ? 'all' : 'part1')}
            role="button"
            tabIndex={0}
          >
            <div className="strip-part">Part I: GK</div>
            <div className="strip-marks">50 Marks</div>
            <div className="strip-sub">History, Geo, Const, Sci, Laws</div>
          </div>

          <div
            className={`blueprint-strip-item strip-ca ${filterSection === 'part2' ? 'active' : ''}`}
            onClick={() => setFilterSection(filterSection === 'part2' ? 'all' : 'part2')}
            role="button"
            tabIndex={0}
          >
            <div className="strip-part">Part II: CA</div>
            <div className="strip-marks">20 Marks</div>
            <div className="strip-sub">Current Affairs & Events</div>
          </div>

          <div
            className={`blueprint-strip-item strip-maths ${filterSection === 'part3' ? 'active' : ''}`}
            onClick={() => setFilterSection(filterSection === 'part3' ? 'all' : 'part3')}
            role="button"
            tabIndex={0}
          >
            <div className="strip-part">Part III: Maths</div>
            <div className="strip-marks">10 Marks</div>
            <div className="strip-sub">Arithmetic & Reasoning</div>
          </div>

          <div
            className={`blueprint-strip-item strip-eng ${filterSection === 'part4' ? 'active' : ''}`}
            onClick={() => setFilterSection(filterSection === 'part4' ? 'all' : 'part4')}
            role="button"
            tabIndex={0}
          >
            <div className="strip-part">Part IV: English</div>
            <div className="strip-marks">10 Marks</div>
            <div className="strip-sub">Grammar & Vocabulary</div>
          </div>

          <div
            className={`blueprint-strip-item strip-mal ${filterSection === 'part5' ? 'active' : ''}`}
            onClick={() => setFilterSection(filterSection === 'part5' ? 'all' : 'part5')}
            role="button"
            tabIndex={0}
          >
            <div className="strip-part">Part V: Malayalam</div>
            <div className="strip-marks">10 Marks</div>
            <div className="strip-sub">Grammar & Literature</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="blueprint-filter-tabs">
        <button
          type="button"
          className={`bp-tab-btn ${filterSection === 'all' ? 'active' : ''}`}
          onClick={() => setFilterSection('all')}
        >
          All 100 Marks (All Sections)
        </button>
        <button
          type="button"
          className={`bp-tab-btn ${filterSection === 'part1' ? 'active' : ''}`}
          onClick={() => setFilterSection('part1')}
        >
          Part I: GK (50M)
        </button>
        <button
          type="button"
          className={`bp-tab-btn ${filterSection === 'part2' ? 'active' : ''}`}
          onClick={() => setFilterSection('part2')}
        >
          Part II: Current Affairs (20M)
        </button>
        <button
          type="button"
          className={`bp-tab-btn ${filterSection === 'part3' ? 'active' : ''}`}
          onClick={() => setFilterSection('part3')}
        >
          Part III: Maths (10M)
        </button>
        <button
          type="button"
          className={`bp-tab-btn ${filterSection === 'part4' ? 'active' : ''}`}
          onClick={() => setFilterSection('part4')}
        >
          Part IV: General English (10M)
        </button>
        <button
          type="button"
          className={`bp-tab-btn ${filterSection === 'part5' ? 'active' : ''}`}
          onClick={() => setFilterSection('part5')}
        >
          Part V: Malayalam (10M)
        </button>
      </div>

      {/* Syllabus Sections Grid */}
      <div className="blueprint-sections-container">
        {filteredSections.map(section => (
          <div key={section.id} className="bp-section-card">
            <div className="bp-section-header">
              <div className="bp-section-title-wrap">
                <h2 className="bp-section-title">{section.title}</h2>
                <p className="bp-section-desc">{section.desc}</p>
              </div>
            </div>

            <div className="bp-topics-grid">
              {section.topics.map((t, idx) => {
                const topicCount = questionCounts[t.topicId] || (t.topicId === 'all' ? questionCounts[t.subject] : null);

                return (
                  <div key={idx} className="bp-topic-card">
                    <div className="bp-topic-top">
                      <div className="bp-topic-identity">
                        <span className="bp-topic-num-badge">{t.num}</span>
                        <div>
                          <div className="bp-topic-subtag">Topic {t.num}</div>
                          <h3 className="bp-topic-title">{t.name}</h3>
                        </div>
                      </div>
                      <span className="bp-topic-marks-pill">{t.marks}</span>
                    </div>

                    <p className="bp-topic-details">{t.details}</p>

                    <div className="bp-topic-footer">
                      <span className="bp-topic-count">
                        {topicCount ? `${topicCount.toLocaleString()} Qs available` : 'Active Bank'}
                      </span>
                      <button
                        type="button"
                        className="bp-practice-action-btn"
                        onClick={() => onStartPractice(t.subject, t.topicId)}
                        title={`Start practicing ${t.name}`}
                      >
                        <span>Practice</span>
                        <ArrowRightIcon size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
