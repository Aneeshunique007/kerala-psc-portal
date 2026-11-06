import React, { useState } from 'react';
import {
  BookOpenIcon,
  XIcon,
  ArrowRightIcon,
  InfoIcon
} from './Icons';

export default function SyllabusModal({ isOpen, onClose, onSelectSubjectTopic }) {
  const [activeTab, setActiveTab] = useState('all');

  if (!isOpen) return null;

  const sections = [
    {
      id: 'part1',
      title: 'Part I: പൊതുവിജ്ഞാനം (General Knowledge)',
      marks: '50 Marks',
      badgeColor: '#3b82f6',
      desc: 'ചരിത്രം (5M), ഭൂമിശാസ്ത്രം (5M), ധനതത്വശാസ്ത്രം (5M), ഭരണഘടന (5M), കേരള ഭരണം (5M), ജീവശാസ്ത്രം (6M), ഭൗതികശാസ്ത്രം (3M), രസതന്ത്രം (3M), കല-കായികം-സാഹിത്യം (5M), കമ്പ്യൂട്ടർ (3M), സുപ്രധാന നിയമങ്ങൾ (5M)',
      topics: [
        {
          num: '1',
          name: 'കേരള ചരിത്രം (Kerala History)',
          marks: '5 Marks (1–3)',
          subject: 'pyq',
          topicId: 'pq_kerala_history',
          details: 'കേരളത്തിലേക്കുള്ള യൂറോപ്യന്മാരുടെ വരവ്, യൂറോപ്യന്മാരുടെ സംഭാവനകൾ, മാർത്താണ്ഡവർമ്മ മുതൽ ശ്രീ ചിത്തിരതിരുനാൾ വരെ തിരുവിതാംകൂർ ചരിത്രം, കൊച്ചി-മലബാർ ചരിത്രം, സാമൂഹിക-മത പരിഷ്കരണ പ്രസ്ഥാനങ്ങൾ, ദേശീയ പ്രസ്ഥാനം കേരളത്തിൽ, ഐക്യകേരള പ്രസ്ഥാനം, 1956-ന് ശേഷമുള്ള കേരള ചരിത്രം.'
        },
        {
          num: '2',
          name: 'ഇന്ത്യാ ചരിത്രം (Indian History)',
          marks: '5 Marks (1–3)',
          subject: 'pyq',
          topicId: 'pq_indian_history',
          details: 'മധ്യകാല ഇന്ത്യ, ഒന്നാം സ്വാതന്ത്ര്യ സമരം (1857), ഇന്ത്യൻ നാഷണൽ കോൺഗ്രസിന്റെ രൂപീകരണം, സ്വദേശി പ്രസ്ഥാനം, സാമൂഹ്യപരിഷ്കരണ പ്രസ്ഥാനങ്ങൾ, പത്രങ്ങൾ, സാഹിത്യവും കലയും, ഗാന്ധിജിയും ദേശീയ പ്രസ്ഥാനവും, സ്വാതന്ത്ര്യാനന്തര ഇന്ത്യ, സംസ്ഥാന പുനഃസംഘടന, വിദേശനയം.'
        },
        {
          num: '3',
          name: 'ലോക ചരിത്രം (World History)',
          marks: '5 Marks (1–3)',
          subject: 'pyq',
          topicId: 'pq_world_history',
          details: 'ഇംഗ്ലീഷ് വിപ്ലവം (Glorious Revolution), അമേരിക്കൻ സ്വാതന്ത്ര്യ സമരം, ഫ്രഞ്ച് വിപ്ലവം, റഷ്യൻ വിപ്ലവം, ചൈനീസ് വിപ്ലവം, രണ്ടാം ലോക മഹായുദ്ധാനന്തര രാഷ്ട്രീയ ചരിത്രം, ഐക്യരാഷ്ട്ര സംഘടന (UNO) & മറ്റ് അന്താരാഷ്ട്ര സംഘടനകൾ.'
        },
        {
          num: '4',
          name: 'ഭൂമിശാസ്ത്ര അടിസ്ഥാന തത്വങ്ങൾ (Basic Geography)',
          marks: '5 Marks (4–6)',
          subject: 'pyq',
          topicId: 'pq_basic_geography',
          details: 'ഭൂമിയുടെ ഘടന, അന്തരീക്ഷം, പാറകൾ, ഭൗമോപരിതല രൂപങ്ങൾ, അന്തരീക്ഷമർദ്ദവും കാറ്റുകളും, താപനിലയും ഋതുഭേദങ്ങളും, ആഗോളപ്രശ്നങ്ങളും ആഗോളതാപനവും, ഭൂപടങ്ങൾ, ടോപ്പോഗ്രാഫിക് മാപ്പുകളും അടയാളങ്ങളും, Remote Sensing, GIS, മഹാസമുദ്രങ്ങളും സമുദ്രചലനങ്ങളും, ഭൂഖണ്ഡങ്ങൾ, സമയവും അക്ഷാംശ-രേഖാംശ രേഖകളും.'
        },
        {
          num: '5',
          name: 'ഇന്ത്യ — ഭൂമിശാസ്ത്ര സവിശേഷതകൾ (Indian Geography)',
          marks: '5 Marks (4–6)',
          subject: 'pyq',
          topicId: 'pq_indian_geography',
          details: 'ഇന്ത്യയുടെ ഭൂപ്രകൃതി, സംസ്ഥാനങ്ങളും സവിശേഷതകളും, ഉത്തരേന്ത്യൻ സമതലം, ഉപദ്വീപീയ പീഠഭൂമി, തീരപ്രദേശം, ഇന്ത്യൻ നദികൾ, കാലാവസ്ഥ, സ്വാഭാവിക സസ്യജാലം, കൃഷി, മണ്ണിനങ്ങൾ, ധാതുക്കളും വ്യവസായവും, ഊർജ്ജസ്രോതസ്സുകൾ, റോഡ്-ജല-റെയിൽ-വ്യോമ ഗതാഗത സംവിധാനങ്ങൾ.'
        },
        {
          num: '6',
          name: 'കേരളം — ഭൂമിശാസ്ത്ര സവിശേഷതകൾ (Kerala Geography)',
          marks: '5 Marks (4–6)',
          subject: 'pyq',
          topicId: 'pq_kerala_geography',
          details: 'കേരളത്തിന്റെ ഭൂപ്രകൃതി, 14 ജില്ലകളും സവിശേഷതകളും, നദികൾ, കായലുകൾ, കാലാവസ്ഥ, മണ്ണിനങ്ങൾ, സ്വാഭാവിക സസ്യജാലം, വന്യജീവി സങ്കേതങ്ങളും ദേശീയോദ്യാനങ്ങളും, മത്സ്യബന്ധനം, ധാതുക്കൾ, വ്യവസായം, അടിസ്ഥാന സൗകര്യങ്ങൾ, കൃഷി, ഗതാഗത സംവിധാനങ്ങൾ.'
        },
        {
          num: '7',
          name: 'ധനതത്വശാസ്ത്രം — ഇന്ത്യ : സാമ്പത്തിക രംഗം (Economics)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_economics',
          details: 'ഇന്ത്യയുടെ സാമ്പത്തിക രംഗം, പഞ്ചവത്സര പദ്ധതികൾ, ആസൂത്രണ കമ്മീഷൻ, നീതി ആയോഗ് (NITI Aayog), നവ സാമ്പത്തിക പരിഷ്കാരങ്ങൾ, റിസർവ് ബാങ്ക് & ധനകാര്യ സ്ഥാപനങ്ങൾ, കാർഷിക വിളകൾ, ധാതുക്കൾ, ഹരിത വിപ്ലവം.'
        },
        {
          num: '8',
          name: 'ഇന്ത്യൻ ഭരണഘടന (Indian Constitution)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_constitution',
          details: 'ഭരണഘടനാ നിർമ്മാണ സഭ, ആമുഖം, മൗലികാവകാശങ്ങൾ, നിർദ്ദേശക തത്വങ്ങൾ, മൗലിക കർത്തവ്യങ്ങൾ, പൗരത്വം, ഭരണഘടനാ ഭേദഗതികൾ (42, 44, 52, 73, 74, 86, 91), പഞ്ചായത്തീരാജ്, ഭരണഘടനാ സ്ഥാപനങ്ങളും ചുമതലകളും, യൂണിയൻ ലിസ്റ്റ്-സ്റ്റേറ്റ് ലിസ്റ്റ്-കൺകറന്റ് ലിസ്റ്റ്.'
        },
        {
          num: '9',
          name: 'കേരളം — ഭരണവും ഭരണസംവിധാനങ്ങളും (Kerala Governance)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_kerala_governance',
          details: 'കേരളം — സംസ്ഥാന സിവിൽ സർവീസ്, ഭരണഘടനാ സ്ഥാപനങ്ങൾ, വിവിധ കമ്മീഷനുകൾ, സാമൂഹിക ക്ഷേമ പദ്ധതികൾ, ഭൂപരിഷ്കരണം, സാമൂഹ്യ സുരക്ഷാ പെൻഷനുകൾ, കുടുംബശ്രീ, ദേശീയ ഗ്രാമീണ തൊഴിൽ പദ്ധതികൾ, ദുരന്ത നിവാരണ അതോറിറ്റി, സ്ത്രീ-ശിശു സംരക്ഷണം.'
        },
        {
          num: '10',
          name: 'ജീവശാസ്ത്രവും പൊതുജനാരോഗ്യവും (Biology & Public Health)',
          marks: '6 Marks',
          subject: 'pyq',
          topicId: 'pq_biology',
          details: 'മനുഷ്യശരീരത്തെക്കുറിച്ചുള്ള പൊതുഅറിവ്, അവയവങ്ങളും അവയവ വ്യവസ്ഥകളും, പോഷകഘടകങ്ങളും അപര്യാപ്തതാരോഗങ്ങളും, സാംക്രമിക രോഗങ്ങളും രോഗകാരികളും, കേരളത്തിലെ ആരോഗ്യക്ഷേമ പ്രവർത്തനങ്ങൾ, ജീവിതശൈലി രോഗങ്ങൾ, സസ്യങ്ങളും വനങ്ങളും, പരിസ്ഥിതിയും ആവാസവ്യവസ്ഥയും.'
        },
        {
          num: '11',
          name: 'ഭൗതികശാസ്ത്രം (Physics)',
          marks: '3 Marks',
          subject: 'pyq',
          topicId: 'pq_physics',
          details: 'ഭൗതികശാസ്ത്ര ശാഖകൾ, ദ്രവ്യം, യൂണിറ്റുകളും അളവുകളും, പ്രകാശം, ശബ്ദം, താപം, ചലനം, ചലനനിയമങ്ങൾ, തരംഗങ്ങൾ, ബലം, കാന്തികത, വൈദ്യുതി, മർദ്ദം, പ്ലവക്ഷമത, ബഹിരാകാശ ശാസ്ത്രവും ISRO ദൗത്യങ്ങളും, സൗരയൂഥം, ഊർജ്ജവും ഊർജ്ജസ്രോതസ്സുകളും.'
        },
        {
          num: '12',
          name: 'രസതന്ത്രം (Chemistry)',
          marks: '3 Marks',
          subject: 'pyq',
          topicId: 'pq_chemistry',
          details: 'ആറ്റവും തന്മാത്രയും, ദ്രവ്യത്തിന്റെ അവസ്ഥകൾ, മൂലകങ്ങളും ആവർത്തനപ്പട്ടികയും, സംയുക്തങ്ങളും രാസപ്രവർത്തനങ്ങളും, ലോഹങ്ങളും അലോഹങ്ങളും സങ്കരലോഹങ്ങളും, ആസിഡും ആൽക്കലിയും (pH മൂല്യം), വാതക നിയമങ്ങൾ.'
        },
        {
          num: '13',
          name: 'കലയും സംസ്കാരവും (Arts & Culture)',
          marks: '5 Marks (13–15)',
          subject: 'pyq',
          topicId: 'pq_arts_culture',
          details: 'കേരളത്തിലെ പ്രധാന ദൃശ്യ-ശ്രാവ്യ കലാരൂപങ്ങൾ (ഉത്ഭവം, വ്യാപനം, പരിശീലനം), പ്രശസ്തമായ സ്ഥലങ്ങൾ, പ്രശസ്തമായ സ്ഥാപനങ്ങൾ, പ്രശസ്തരായ കലാകാരന്മാർ, ഉത്സവങ്ങളും ക്ഷേത്രങ്ങളും.'
        },
        {
          num: '14',
          name: 'കായികം (Sports)',
          marks: '5 Marks (13–15)',
          subject: 'pyq',
          topicId: 'pq_sports',
          details: 'കായികരംഗത്ത് വ്യക്തിമുദ്ര പതിപ്പിച്ച കേരളത്തിലെയും ഇന്ത്യയിലെയും ലോകത്തിലെയും പ്രധാന കായികതാരങ്ങൾ, പ്രധാന അവാർഡുകൾ, ട്രോഫികൾ, ഒളിമ്പിക്സ്, ഏഷ്യൻ ഗെയിംസ്, കോമൺവെൽത്ത് ഗെയിംസ്, ദേശീയ ഗെയിംസ്, കായിക പദങ്ങളും ഗ്രൗണ്ടുകളും.'
        },
        {
          num: '15',
          name: 'സാഹിത്യവും സിനിമയും (Literature & Cinema)',
          marks: '5 Marks (13–15)',
          subject: 'pyq',
          topicId: 'pq_literature_cinema',
          details: 'മലയാളത്തിലെ പ്രധാന സാഹിത്യ പ്രസ്ഥാനങ്ങൾ, ആദ്യകൃതികൾ, ഗ്രന്ഥകർത്താക്കൾ, തൂലികാനാമങ്ങൾ, കഥാപാത്രങ്ങൾ, ജ്ഞാനപീഠം-എഴുത്തച്ഛൻ പുരസ്കാരങ്ങൾ, മലയാള സിനിമയുടെ ഉത്ഭവം, വളർച്ച, നാഴികക്കല്ലുകൾ, ദേശീയ ചലച്ചിത്ര പുരസ്കാരങ്ങൾ.'
        },
        {
          num: '16',
          name: 'കമ്പ്യൂട്ടർ — അടിസ്ഥാന വിവരങ്ങൾ (Computer Basics)',
          marks: '3 Marks',
          subject: 'pyq',
          topicId: 'pq_computer',
          details: 'Hardware (Input, Output, Memory), Software (System & Application, OS), Computer Networks (LAN, WAN, MAN), Internet (WWW, E-mail, Search Engines, HTML Basics), Cyber Crimes & IT Act 2000.'
        },
        {
          num: '17',
          name: 'സുപ്രധാന നിയമങ്ങൾ (Important Acts & Laws)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_acts_laws',
          details: 'വിവരാവകാശ നിയമം (RTI Act 2005), ഉപഭോക്തൃ സംരക്ഷണ നിയമം, മനുഷ്യാവകാശ സംരക്ഷണ നിയമം (NHRC/SHRC), SC/ST സംരക്ഷണം (1989), ഗാർഹിക പീഡന നിരോധന നിയമം (2005), വനിതാ കമ്മീഷൻ, പോക്സോ നിയമം (POCSO Act 2012).'
        }
      ]
    },
    {
      id: 'part2',
      title: 'Part II: ആനുകാലിക വിഷയങ്ങൾ (Current Affairs)',
      marks: '20 Marks',
      badgeColor: '#06b6d4',
      desc: 'ദേശീയ, അന്തർദേശീയ, സംസ്ഥാന തലത്തിലുള്ള പ്രധാന സംഭവങ്ങൾ, പുരസ്കാരങ്ങൾ, കായിക നേട്ടങ്ങൾ',
      topics: [
        {
          num: '18',
          name: 'ആനുകാലിക സംഭവങ്ങൾ (Current Affairs)',
          marks: '20 Marks',
          subject: 'pyq',
          topicId: 'pq_current_affairs',
          details: 'കേരളം — ആനുകാലികം, ഇന്ത്യ — ദേശീയ ആനുകാലികം, ലോകം — അന്താരാഷ്ട്ര ആനുകാലികം, പുരസ്കാരങ്ങളും ബഹുമതികളും, കായിക ആനുകാലികം, ശാസ്ത്ര-സാങ്കേതിക-ബഹിരാകാശ ആനുകാലികം.'
        }
      ]
    },
    {
      id: 'part3',
      title: 'Part III: ലഘുഗണിതവും മാനസിക ശേഷിയും (Simple Arithmetic & Mental Ability)',
      marks: '10 Marks',
      badgeColor: '#6366f1',
      desc: 'ലഘുഗണിതം (5 Marks) + മാനസിക ശേഷിയും നിരീക്ഷണപാടവ പരിശോധനയും (5 Marks)',
      topics: [
        {
          num: '19',
          name: 'ലഘുഗണിതം (Simple Arithmetic)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_arithmetic',
          details: 'സംഖ്യകളും അടിസ്ഥാന ക്രിയകളും, ഭിന്നസംഖ്യകൾ & ദശാംശങ്ങൾ, ശതമാനം, ലാഭവും നഷ്ടവും, സാധാരണ പലിശയും കൂട്ടുപലിശയും, അംശബന്ധവും അനുപാതവും, സമയവും ദൂരവും, സമയവും പ്രവൃത്തിയും, ശരാശരി, കൃത്യങ്കങ്ങൾ, ജ്യാമിതി, പ്രോഗ്രഷനുകൾ.'
        },
        {
          num: '20',
          name: 'മാനസിക ശേഷിയും നിരീക്ഷണപാടവവും (Mental Ability)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_mental_ability',
          details: 'സംഖ്യാ ശ്രേണികൾ, അക്ഷര ശ്രേണികൾ, ഗണിത ചിഹ്നങ്ങൾ, സ്ഥാന നിർണ്ണയം, സമാന ബന്ധങ്ങൾ (Analogy), ഒറ്റയാനെ കണ്ടെത്തുക, കോഡിംഗ് & ഡീകോഡിംഗ്, കുടുംബ ബന്ധങ്ങൾ, ദിശാവബോധം, ക്ലോക്ക്, കലണ്ടർ, ക്ലറിക്കൽ ശേഷി പരിശോധന.'
        }
      ]
    },
    {
      id: 'part4',
      title: 'Part IV: ജനറൽ ഇംഗ്ലീഷ് (General English)',
      marks: '10 Marks',
      badgeColor: '#3b82f6',
      desc: 'English Grammar (5 Marks) + Vocabulary (5 Marks)',
      topics: [
        {
          num: '21',
          name: 'English Grammar',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_english_grammar',
          details: 'Types of Sentences, Parts of Speech, Subject-Verb Agreement, Articles, Auxiliaries, Question Tags, Infinitives & Gerunds, Tenses, Prepositions, Voice, Direct & Indirect Speech, Degrees of Comparison.'
        },
        {
          num: '22',
          name: 'English Vocabulary',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_english_vocabulary',
          details: 'Singular & Plural, Gender, Collective Nouns, Prefix & Suffix, Compound Words, Synonyms, Antonyms, Phrasal Verbs, One Word Substitutes, Words Often Confused, Spelling Test, Idioms & Meanings, Abbreviations.'
        }
      ]
    },
    {
      id: 'part5',
      title: 'Part V: പ്രാദേശിക ഭാഷകൾ (മലയാളം)',
      marks: '10 Marks',
      badgeColor: '#0ea5e9',
      desc: 'മലയാള വ്യാകരണവും സാഹിത്യവും (10 Marks)',
      topics: [
        {
          num: '23',
          name: 'മലയാളം (Malayalam Language & Grammar)',
          marks: '10 Marks',
          subject: 'pyq',
          topicId: 'pq_malayalam',
          details: 'പദശുദ്ധി, വാക്യശുദ്ധി, പരിഭാഷ, ഒറ്റപ്പദം, പര്യായം, വിപരീത പദം, ശൈലികൾ & പഴഞ്ചൊല്ലുകൾ, സമാനപദം, ചേർത്തെഴുതുക, സ്ത്രീലിംഗം-പുല്ലിംഗം, വചനം, പിരിച്ചെഴുതുക, ഘടകപദം, സാഹിത്യവും എഴുത്തുകാരും.'
        }
      ]
    }
  ];

  const filteredSections = activeTab === 'all'
    ? sections
    : sections.filter(s => s.id === activeTab);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card syllabus-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="syllabus-modal-header">
          <div className="syllabus-header-left">
            <span className="syllabus-icon"><BookOpenIcon size={22} /></span>
            <div>
              <h2 className="syllabus-modal-title">Kerala PSC LD Clerk (LDC) Official Syllabus</h2>
              <div className="syllabus-modal-subtitle">
                Category No: 503/2023, 504/2023 • Total Marks: 100 • 75 Minutes OMR Examination
              </div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <XIcon size={18} />
          </button>
        </div>

        {/* 100 Marks Overview Bar */}
        <div className="syllabus-mark-bar-container">
          <div className="syllabus-mark-pill p1" title="Part I: GK (50 Marks)">
            <span>Part I: GK</span>
            <strong>50 Marks</strong>
          </div>
          <div className="syllabus-mark-pill p2" title="Part II: Current Affairs (20 Marks)">
            <span>Part II: CA</span>
            <strong>20 Marks</strong>
          </div>
          <div className="syllabus-mark-pill p3" title="Part III: Maths (10 Marks)">
            <span>Part III: Maths</span>
            <strong>10 Marks</strong>
          </div>
          <div className="syllabus-mark-pill p4" title="Part IV: English (10 Marks)">
            <span>Part IV: English</span>
            <strong>10 Marks</strong>
          </div>
          <div className="syllabus-mark-pill p5" title="Part V: Malayalam (10 Marks)">
            <span>Part V: Mal</span>
            <strong>10 Marks</strong>
          </div>
        </div>

        {/* Section Filter Tabs */}
        <div className="syllabus-tabs-row">
          <button
            type="button"
            className={`syllabus-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All 100 Marks
          </button>
          <button
            type="button"
            className={`syllabus-tab-btn ${activeTab === 'part1' ? 'active' : ''}`}
            onClick={() => setActiveTab('part1')}
          >
            Part I: GK (50M)
          </button>
          <button
            type="button"
            className={`syllabus-tab-btn ${activeTab === 'part2' ? 'active' : ''}`}
            onClick={() => setActiveTab('part2')}
          >
            Part II: CA (20M)
          </button>
          <button
            type="button"
            className={`syllabus-tab-btn ${activeTab === 'part3' ? 'active' : ''}`}
            onClick={() => setActiveTab('part3')}
          >
            Part III: Maths (10M)
          </button>
          <button
            type="button"
            className={`syllabus-tab-btn ${activeTab === 'part4' ? 'active' : ''}`}
            onClick={() => setActiveTab('part4')}
          >
            Part IV: English (10M)
          </button>
          <button
            type="button"
            className={`syllabus-tab-btn ${activeTab === 'part5' ? 'active' : ''}`}
            onClick={() => setActiveTab('part5')}
          >
            Part V: Mal (10M)
          </button>
        </div>

        {/* Syllabus Content Body */}
        <div className="syllabus-modal-body">
          {filteredSections.map(sec => (
            <div key={sec.id} className="syllabus-section-card">
              <div className="syllabus-sec-header">
                <div>
                  <h3 className="syllabus-sec-title">{sec.title}</h3>
                  <div className="syllabus-sec-desc">{sec.desc}</div>
                </div>
                <span className="syllabus-sec-badge" style={{ background: sec.badgeColor }}>
                  {sec.marks}
                </span>
              </div>

              <div className="syllabus-topics-grid">
                {sec.topics.map((t, idx) => (
                  <div key={idx} className="syllabus-topic-card">
                    <div className="syllabus-topic-card-header">
                      <div className="syllabus-topic-left">
                        <span className="syllabus-topic-num">{t.num}</span>
                        <h4 className="syllabus-topic-title">{t.name}</h4>
                      </div>
                      <div className="syllabus-topic-right">
                        <span className="syllabus-topic-mark">{t.marks}</span>
                        {onSelectSubjectTopic && (
                          <button
                            type="button"
                            className="syllabus-practice-btn"
                            onClick={() => {
                              onSelectSubjectTopic(t.subject, t.topicId);
                              onClose();
                            }}
                            title={`Practice questions for ${t.name}`}
                          >
                            <span>Practice</span>
                            <ArrowRightIcon size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="syllabus-topic-details">{t.details}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="syllabus-modal-footer">
          <div className="syllabus-footer-note" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <InfoIcon size={16} />
            <span>Refer to <strong>L D Clerks.pdf</strong> for the official Kerala Public Service Commission detailed syllabus.</span>
          </div>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
}
