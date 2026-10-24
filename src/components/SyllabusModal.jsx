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
      desc: 'ചരിത്രം, ഭൂമിശാസ്ത്രം, ഭരണഘടന, ധനതത്വശാസ്ത്രം, സയൻസ്, കല-കായികം, കമ്പ്യൂട്ടർ & സുപ്രധാന നിയമങ്ങൾ',
      topics: [
        {
          num: 'i',
          name: 'ചരിത്രം (History)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_history',
          details: 'കേരള ചരിത്രം (യൂറോപ്യന്മാരുടെ വരവ് മുതൽ ഐക്യകേരളം വരെ, നവോത്ഥാനം), ഇന്ത്യൻ ചരിത്രം (1857 സമരം, INC, ഗാന്ധിയൻ കാലഘട്ടം, സ്വാതന്ത്ര്യാനന്തര ഇന്ത്യ), ലോക ചരിത്രം (വിപ്ലവങ്ങൾ, UNO).'
        },
        {
          num: 'ii',
          name: 'ഭൂമിശാസ്ത്രം (Geography)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_geography',
          details: 'ഭൂമിശാസ്ത്ര അടിസ്ഥാന തത്വങ്ങൾ, ഇന്ത്യ (ഭൂപ്രകൃതി, നദികൾ, കാലാവസ്ഥ, കൃഷി, ഗതാഗതം), കേരളം (ജില്ലകൾ, നദികൾ, തണ്ണീർത്തടങ്ങൾ, വന്യജീവി).'
        },
        {
          num: 'iii',
          name: 'ധനതത്വശാസ്ത്രം (Economics)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_economics',
          details: 'ഇന്ത്യൻ സാമ്പത്തിക വ്യവസ്ഥ, പഞ്ചവത്സര പദ്ധതികൾ, ആസൂത്രണ കമ്മീഷൻ, നീതി ആയോഗ്, റിസർവ് ബാങ്ക് & ധനകാര്യ സ്ഥാപനങ്ങൾ, ഹരിത വിപ്ലവം.'
        },
        {
          num: 'iv',
          name: 'ഇന്ത്യൻ ഭരണഘടന (Indian Constitution)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_constitution',
          details: 'ഭരണഘടനാ നിർമ്മാണ സഭ, ആമുഖം, മൗലികാവകാശങ്ങൾ, നിർദ്ദേശക തത്വങ്ങൾ, മൗലിക കർത്തവ്യങ്ങൾ, പ്രധാന ഭേദഗതികൾ (42, 44, 52, 73, 74, 86, 91), പഞ്ചായത്തീരാജ്.'
        },
        {
          num: 'v',
          name: 'കേരളം - ഭരണവും ഭരണസംവിധാനങ്ങളും',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_kerala_governance',
          details: 'കേരള സിവിൽ സർവീസ്, വിവിധ കമ്മീഷനുകൾ, സാമൂഹിക ക്ഷേമ പദ്ധതികൾ, ദേശീയ ഗ്രാമീണ തൊഴിൽ പദ്ധതികൾ, ദുരന്ത നിവാരണ അതോറിറ്റി, സ്ത്രീ-ശിശു സംരക്ഷണം.'
        },
        {
          num: 'vi-viii',
          name: 'ജനറൽ സയൻസ് (General Science)',
          marks: '12 Marks',
          subject: 'pyq',
          topicId: 'pq_science',
          details: 'ജീവശാസ്ത്രവും പൊതുജനാരോഗ്യവും (6 Marks): മനുഷ്യശരീരം, ജീവകങ്ങൾ, സാംക്രമിക രോഗങ്ങൾ, പരിസ്ഥിതി. ഭൗതികശാസ്ത്രം (3 Marks): ചലന നിയമങ്ങൾ, പ്രകാശം, ശബ്ദം, ബലം, ഗുരുത്വാകർഷണം, പ്രവൃത്തി. രസതന്ത്രം (3 Marks): ആറ്റം, മൂലകങ്ങൾ, ലോഹങ്ങൾ-അലോഹങ്ങൾ, ആസിഡും ആൽക്കലിയും, pH മൂല്യം.'
        },
        {
          num: 'ix',
          name: 'കല, കായികം, സാഹിത്യം, സംസ്കാരം',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_arts_sports',
          details: 'കേരളത്തിലെ ദൃശ്യ-ശ്രവ്യ കലകൾ, സാംസ്കാരിക കേന്ദ്രങ്ങൾ. കായികരംഗം, പ്രമുഖ താരങ്ങൾ, പുരസ്കാരങ്ങൾ, ട്രോഫികൾ, ഒളിമ്പിക്സ്, ഏഷ്യൻ ഗെയിംസ്. മലയാള സിനിമയുടെ ഉത്ഭവം, വളർച്ച, ദേശീയ പുരസ്കാരങ്ങൾ.'
        },
        {
          num: 'x',
          name: 'കമ്പ്യൂട്ടർ - അടിസ്ഥാന വിവരങ്ങൾ',
          marks: '3 Marks',
          subject: 'pyq',
          topicId: 'pq_computer',
          details: 'Hardware (Input, Output, Memory), Software (System & Application, OS), Computer Networks (LAN, WAN), Internet (WWW, E-mail, Search Engines, HTML Basics), Cyber Crimes & IT Act.'
        },
        {
          num: 'xi',
          name: 'സുപ്രധാന നിയമങ്ങൾ (Special Laws & Acts)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_acts_laws',
          details: 'വിവരാവകാശ നിയമം (RTI Act 2005), ഉപഭോക്തൃ സംരക്ഷണം, മനുഷ്യാവകാശ കമ്മീഷൻ (NHRC/SHRC), SC/ST സംരക്ഷണം, ഗാർഹിക പീഡന നിരോധന നിയമം (2005), വനിതാ കമ്മീഷൻ, പോക്സോ നിയമം (POCSO Act 2012).'
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
          num: 'II',
          name: 'ആനുകാലിക സംഭവങ്ങൾ (Current Affairs)',
          marks: '20 Marks',
          subject: 'current_affairs',
          topicId: 'all',
          details: 'പരീക്ഷാ തീയതിക്ക് തൊട്ടുമുമ്പുള്ള സമകാലിക സംഭവങ്ങൾ, സർക്കാർ പദ്ധതികൾ, ശാസ്ത്ര സാങ്കേതിക നേട്ടങ്ങൾ, പ്രധാന നിയമനങ്ങൾ, പുരസ്കാരങ്ങൾ, അന്താരാഷ്ട്ര ഉച്ചകോടികൾ.'
        }
      ]
    },
    {
      id: 'part3',
      title: 'Part III: ലഘുഗണിതവും മാനസിക ശേഷിയും',
      marks: '10 Marks',
      badgeColor: '#6366f1',
      desc: 'ലഘുഗണിതം (5 Marks) + മാനസിക ശേഷിയും നിരീക്ഷണപാടവ പരിശോധനയും (5 Marks)',
      topics: [
        {
          num: 'i',
          name: 'ലഘുഗണിതം (Simple Arithmetic)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_maths',
          details: 'സംഖ്യകളും അടിസ്ഥാന ക്രിയകളും, ഭിന്നസംഖ്യകൾ & ദശാംശങ്ങൾ, ശതമാനം, ലാഭവും നഷ്ടവും, സാധാരണ പലിശയും കൂട്ടുപലിശയും, അംശബന്ധവും അനുപാതവും, സമയവും ദൂരവും, സമയവും പ്രവൃത്തിയും, ശരാശരി, കൃത്യങ്കങ്ങൾ, ജ്യാമിതി, പ്രോഗ്രഷനുകൾ.'
        },
        {
          num: 'ii',
          name: 'മാനസിക ശേഷിയും റീസണിംഗും (Mental Ability)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_maths',
          details: 'സംഖ്യാ ശ്രേണികൾ, അക്ഷര ശ്രേണികൾ, ഗണിത ചിഹ്നങ്ങൾ, സ്ഥാന നിർണ്ണയം, അനലോഗി, ഒറ്റയാനെ കണ്ടെത്തുക, കോഡിംഗ് & ഡീകോഡിംഗ്, കുടുംബ ബന്ധങ്ങൾ, ദിശാബോധം, ക്ലോക്ക്, കലണ്ടർ.'
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
          num: 'i',
          name: 'English Grammar',
          marks: '5 Marks',
          subject: 'english',
          topicId: 'all',
          details: 'Types of Sentences, Parts of Speech, Subject-Verb Agreement, Articles, Auxiliaries, Question Tags, Infinitives & Gerunds, Tenses, Prepositions, Voice, Direct & Indirect Speech, Degrees of Comparison.'
        },
        {
          num: 'ii',
          name: 'Vocabulary',
          marks: '5 Marks',
          subject: 'english',
          topicId: 'all',
          details: 'Singular & Plural, Gender, Collective Nouns, Prefix & Suffix, Compound Words, Synonyms, Antonyms, Phrasal Verbs, One Word Substitutes, Words Often Confused, Spelling Test, Idioms & Meanings.'
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
          num: 'V',
          name: 'മലയാളം (Malayalam Language & Grammar)',
          marks: '10 Marks',
          subject: 'malayalam',
          topicId: 'all',
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
