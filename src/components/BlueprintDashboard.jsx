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
      desc: 'ചരിത്രം, ഭൂമിശാസ്ത്രം, ഭരണഘടന, ധനതത്വശാസ്ത്രം, സയൻസ്, കല-കായികം, കമ്പ്യൂട്ടർ & സുപ്രധാന നിയമങ്ങൾ',
      topics: [
        {
          num: 'i',
          name: 'ചരിത്രം (History)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_history',
          icon: '🏛️',
          details: 'കേരള ചരിത്രം (യൂറോപ്യന്മാർ മുതൽ ഐക്യകേരളം, നവോത്ഥാനം), ഇന്ത്യൻ ചരിത്രം (1857, കോൺഗ്രസ്, ഗാന്ധിയൻ കാലഘട്ടം, സ്വാതന്ത്ര്യാനന്തര ഇന്ത്യ), ലോക വിപ്ലവങ്ങൾ & UNO.'
        },
        {
          num: 'ii',
          name: 'ഭൂമിശാസ്ത്രം (Geography)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_geography',
          icon: '🌍',
          details: 'ഭൂമിശാസ്ത്ര അടിസ്ഥാന തത്വങ്ങൾ, ഇന്ത്യ (ഭൂപ്രകൃതി, നദികൾ, കാലാവസ്ഥ, കൃഷി, ഗതാഗതം), കേരളം (ജില്ലകൾ, നദികൾ, തണ്ണീർത്തടങ്ങൾ, വന്യജീവി).'
        },
        {
          num: 'iii',
          name: 'ധനതത്വശാസ്ത്രം (Economics)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_economics',
          icon: '📈',
          details: 'ഇന്ത്യൻ സാമ്പത്തിക വ്യവസ്ഥ, പഞ്ചവത്സര പദ്ധതികൾ, നീതി ആയോഗ്, റിസർവ് ബാങ്ക്, ധനകാര്യ സ്ഥാപനങ്ങൾ, കാർഷിക വിളകൾ, ഹരിത വിപ്ലവം.'
        },
        {
          num: 'iv',
          name: 'ഇന്ത്യൻ ഭരണഘടന (Constitution)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_constitution',
          icon: '⚖️',
          details: 'ഭരണഘടനാ നിർമ്മാണ സഭ, ആമുഖം, മൗലികാവകാശങ്ങൾ, നിർദ്ദേശക തത്വങ്ങൾ, കർത്തവ്യങ്ങൾ, പ്രധാന ഭേദഗതികൾ (42, 44, 52, 73, 74, 86, 91), പഞ്ചായത്തീരാജ്.'
        },
        {
          num: 'v',
          name: 'കേരളം - ഭരണസംവിധാനങ്ങൾ (Kerala Governance)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_kerala_governance',
          icon: '🏢',
          details: 'കേരള സിവിൽ സർവീസ്, വിവിധ കമ്മീഷനുകൾ, സാമൂഹിക ക്ഷേമ പദ്ധതികൾ, ദുരന്ത നിവാരണം, ദേശീയ ഗ്രാമീണ തൊഴിൽ പദ്ധതികൾ, സ്ത്രീ-ശിശു സംരക്ഷണം.'
        },
        {
          num: 'vi-viii',
          name: 'ജനറൽ സയൻസ് (General Science)',
          marks: '12 Marks',
          subject: 'pyq',
          topicId: 'pq_science',
          icon: '🔬',
          details: 'ജീവശാസ്ത്രവും പൊതുജനാരോഗ്യവും (6 Marks): മനുഷ്യശരീരം, ജീവകങ്ങൾ, സാംക്രമിക രോഗങ്ങൾ, പരിസ്ഥിതി. ഭൗതികശാസ്ത്രം (3 Marks): ചലന നിയമങ്ങൾ, പ്രകാശം, ശബ്ദം, ബലം, ഗുരുത്വാകർഷണം. രസതന്ത്രം (3 Marks): ആറ്റം, മൂലകങ്ങൾ, ലോഹങ്ങൾ-അലോഹങ്ങൾ, ആസിഡും ആൽക്കലിയും, pH മൂല്യം.'
        },
        {
          num: 'ix',
          name: 'കല, കായികം, സാഹിത്യം, സംസ്കാരം (Arts & Sports)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_arts_sports',
          icon: '🎨',
          details: 'കേരളത്തിലെ ദൃശ്യ-ശ്രവ്യ കലകൾ, സാംസ്കാരിക കേന്ദ്രങ്ങൾ. കായികരംഗം, പ്രമുഖ താരങ്ങൾ, പുരസ്കാരങ്ങൾ, ഒളിമ്പിക്സ്, ഏഷ്യൻ ഗെയിംസ്. മലയാള സിനിമ & ദേശീയ പുരസ്കാരങ്ങൾ.'
        },
        {
          num: 'x',
          name: 'കമ്പ്യൂട്ടർ അടിസ്ഥാന വിവരങ്ങൾ (Computer Basics)',
          marks: '3 Marks',
          subject: 'pyq',
          topicId: 'pq_computer',
          icon: '💻',
          details: 'Hardware (Input, Output, Memory), Software (System, Application, OS), Computer Networks (LAN, WAN), Internet (WWW, Email, HTML), Cyber Crimes & IT Act.'
        },
        {
          num: 'xi',
          name: 'സുപ്രധാന നിയമങ്ങൾ (Special Laws & Acts)',
          marks: '5 Marks',
          subject: 'pyq',
          topicId: 'pq_acts_laws',
          icon: '📜',
          details: 'വിവരാവകാശ നിയമം (RTI Act 2005), ഉപഭോക്തൃ സംരക്ഷണം, മനുഷ്യാവകാശ കമ്മീഷൻ (NHRC/SHRC), SC/ST സംരക്ഷണം, ഗാർഹിക പീഡന നിരോധന നിയമം, വനിതാ കമ്മീഷൻ, പോക്സോ നിയമം (POCSO Act 2012).'
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
          num: 'II',
          name: 'ആനുകാലിക സംഭവങ്ങൾ (Current Affairs)',
          marks: '20 Marks',
          subject: 'pyq',
          topicId: 'pq_current_affairs',
          icon: '📰',
          details: 'പരീക്ഷാ തീയതിക്ക് തൊട്ടുമുമ്പുള്ള സമകാലിക സംഭവങ്ങൾ, സർക്കാർ പദ്ധതികൾ, ശാസ്ത്ര സാങ്കേതിക നേട്ടങ്ങൾ, പ്രധാന നിയമനങ്ങൾ, പുരസ്കാരങ്ങൾ, അന്താരാഷ്ട്ര ഉച്ചകോടികൾ.'
        }
      ]
    },
    {
      id: 'part3',
      title: 'Part III: ലഘുഗണിതവും മാനസിക ശേഷിയും',
      marks: '10 Marks',
      accentColor: '#6366f1',
      badgeClass: 'badge-maths',
      desc: 'ലഘുഗണിതം (5 Marks) + മാനസിക ശേഷിയും നിരീക്ഷണപാടവ പരിശോധനയും (5 Marks)',
      topics: [
        {
          num: 'i',
          name: 'ലഘുഗണിതം & റീസണിംഗ് (Maths & Mental Ability)',
          marks: '10 Marks',
          subject: 'pyq',
          topicId: 'pq_maths',
          icon: '🔢',
          details: 'സംഖ്യകൾ, ഭിന്നസംഖ്യകൾ, ശതമാനം, ലാഭവും നഷ്ടവും, സാധാരണ & കൂട്ടുപലിശ, അംശബന്ധം, സമയവും ദൂരവും, സമയവും പ്രവൃത്തിയും, ശരാശരി, കൃത്യങ്കങ്ങൾ, ജ്യാമിതി, ശ്രേണികൾ, കോഡിംഗ്-ഡീകോഡിംഗ്, ദിശാബോധം, ക്ലോക്ക്, കലണ്ടർ.'
        }
      ]
    },
    {
      id: 'part4',
      title: 'Part IV: ജനറൽ ഇംഗ്ലീഷ് (General English)',
      marks: '10 Marks',
      accentColor: '#3b82f6',
      badgeClass: 'badge-english',
      desc: 'English Grammar (5 Marks) + Vocabulary (5 Marks)',
      topics: [
        {
          num: 'i',
          name: 'English Grammar & Usage',
          marks: '5 Marks',
          subject: 'english',
          topicId: 'types_of_sentences',
          icon: '📝',
          details: 'Types of Sentences, Parts of Speech, Subject-Verb Agreement, Articles, Auxiliaries, Question Tags, Infinitives & Gerunds, Tenses, Prepositions, Voice, Direct & Indirect Speech, Degrees of Comparison.'
        },
        {
          num: 'ii',
          name: 'Vocabulary & Phrases',
          marks: '5 Marks',
          subject: 'english',
          topicId: 'synonyms_eng',
          icon: '📖',
          details: 'Singular & Plural, Gender, Collective Nouns, Prefix & Suffix, Compound Words, Synonyms, Antonyms, Phrasal Verbs, One Word Substitutes, Confused Words, Spelling Test, Idioms & Meanings.'
        }
      ]
    },
    {
      id: 'part5',
      title: 'Part V: പ്രാദേശിക ഭാഷകൾ (മലയാളം)',
      marks: '10 Marks',
      accentColor: '#0ea5e9',
      badgeClass: 'badge-malayalam',
      desc: 'മലയാള വ്യാകരണവും സാഹിത്യവും (10 Marks)',
      topics: [
        {
          num: 'V',
          name: 'മലയാളം വ്യാകരണവും സാഹിത്യവും',
          marks: '10 Marks',
          subject: 'malayalam',
          topicId: 'all',
          icon: '📚',
          details: 'പദശുദ്ധി, വാക്യശുദ്ധി, പരിഭാഷ, ഒറ്റപ്പദം, പര്യായം, വിപരീത പദം, ശൈലികൾ & പഴഞ്ചൊല്ലുകൾ, സമാനപദം, ചേർത്തെഴുതുക, ലിംഗം, വചനം, പിരിച്ചെഴുതുക, ഘടകപദം, സാഹിത്യവും കൃതികളും.'
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
