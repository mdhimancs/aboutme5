/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Timeless Leadership Wisdom & Executive Axioms
 * Curated 10 foundational principles from the Bhagavad Gita, Biblical scripture,
 * Stoic philosophy (Marcus Aurelius & Seneca), and cinematic masterworks.
 */

export interface TimelessLesson {
  id: string;
  number: number;
  title: string;
  source: string;
  tradition: 'Gita & Vedic' | 'Marcus Aurelius & Stoics' | 'Biblical Wisdom' | 'Cinema & Culture' | 'Modern Management';
  quote: string;
  corePrinciple: string;
  executiveApplication: string;
  tacticalExecution: string[];
  modernAnalogy: string;
  keyTheme: string;
  badgeColor: string;
}

export const TIMELESS_LESSONS: TimelessLesson[] = [
  {
    id: 'lesson-01-gita-karma-yoga',
    number: 1,
    title: 'Duty Over Outcome (Karma Yoga)',
    source: 'Bhagavad Gita, Chapter 2, Verse 47',
    tradition: 'Gita & Vedic',
    quote: 'You have a right to your actions, but never to the fruits of your actions. Let not the fruits of action be your motive, nor let your attachment be to inaction.',
    corePrinciple: 'Relentless focus on process, architectural integrity, and duty over paralyzing anxiety regarding unpredictable outcomes.',
    executiveApplication: 'In high-severity incidents, executive breach response, or board scrutiny, leaders cannot control adversary timing or market panic. You control the rigor of the triage, the transparency of telemetry, and the speed of containment. Detachment from panic yields flawless operational execution.',
    tacticalExecution: [
      'Institutionalize blameless incident post-mortems focused strictly on system telemetry rather than human scapegoating.',
      'Reward rigorous process adherence and architectural hygiene over reckless heroics.',
      'Maintain calm executive composure under intense regulatory and SEC disclosure pressure.'
    ],
    modernAnalogy: 'A surgeon in emergency trauma who focuses purely on the incision and vitals, rather than worrying about tomorrow\'s headlines.',
    keyTheme: 'Detached Execution & Process Rigor',
    badgeColor: 'amber'
  },
  {
    id: 'lesson-02-marcus-aurelius-obstacle',
    number: 2,
    title: 'The Alchemy of Adversity (Amor Fati)',
    source: 'Marcus Aurelius, Meditations (Book V.20)',
    tradition: 'Marcus Aurelius & Stoics',
    quote: 'The mind adapts and converts to its own purposes the obstacle to our acting. The impediment to action advances action. What stands in the way becomes the way.',
    corePrinciple: 'Adversity is not an interruption to the mission; it is the raw material from which resilience and structural superiority are forged.',
    executiveApplication: 'Budget contractions, zero-day vulnerabilities, legacy tech debt, and hostile audits are not impediments to enterprise defense—they are the exact crucibles that justify and accelerate Zero Trust transformation, tool consolidation, and autonomous SOC automation.',
    tacticalExecution: [
      'Transform regulatory consent orders into executive board mandates for multi-million dollar modernization.',
      'Leverage legacy vendor outages to eliminate standing administrative privileges and mandate ephemeral JIT access.',
      'Convert failed phishing exercises into continuous adaptive training and automated email defense.'
    ],
    modernAnalogy: 'Aerodynamic lift: the exact wind resistance that pushes back against the aircraft is what lifts it into the sky.',
    keyTheme: 'Transforming Crisis Into Leverage',
    badgeColor: 'indigo'
  },
  {
    id: 'lesson-03-bible-iron-sharpens-iron',
    number: 3,
    title: 'Iron Sharpens Iron & Organizational Seasons',
    source: 'The Holy Bible, Proverbs 27:17 & Ecclesiastes 3:1',
    tradition: 'Biblical Wisdom',
    quote: 'As iron sharpens iron, so one person sharpens another. To everything there is a season, a time for every matter under heaven.',
    corePrinciple: 'High-performing leadership requires constructive intellectual friction, unflinching peer challenge, and the discernment to navigate organizational seasons.',
    executiveApplication: 'A CISO or VP who surrounds themselves with yes-men guarantees blind spots. Rigorous Architecture Review Boards (ARB), external red teams, and adversarial cross-functional critique are vital to sharpen defense. Leaders must also discern seasons—knowing when to aggressively build vs. when to consolidate and fortify.',
    tacticalExecution: [
      'Empower an independent Architecture Review Board (ARB) with binding veto authority on technical security debt.',
      'Conduct recurring purple-team exercises where red and blue engineers dissect architectural flaws side-by-side.',
      'Structure modernization programs into distinct seasons: Discovery, Foundation, Enclave Isolation, and Autonomous Scaling.'
    ],
    modernAnalogy: 'A dual-blade industrial mill: only through mutual abrasion and high pressure are precision edges honed.',
    keyTheme: 'Constructive Friction & Strategic Timing',
    badgeColor: 'emerald'
  },
  {
    id: 'lesson-04-godfather-strategic-calm',
    number: 4,
    title: 'Strategic Composure & Visceral Discipline',
    source: 'The Godfather (1972) — Directed by Francis Ford Coppola',
    tradition: 'Cinema & Culture',
    quote: 'Never hate your enemies; it affects your judgment. It\'s not personal; it\'s strictly business.',
    corePrinciple: 'Emotional reactivity is the greatest strategic vulnerability. Passion clouds analytical discernment; cold calculated poise preserves leverage.',
    executiveApplication: 'During high-stakes board escalations, extortion demands, or aggressive vendor negotiations, visceral anger or injured pride causes catastrophic missteps. The seasoned executive operates with glacial poise, treating threat actors, auditors, and counterparties as variables in an objective game theory matrix.',
    tacticalExecution: [
      'Decouple incident command from emotional executive escalation; enforce structured incident playbooks.',
      'Engage third-party forensic negotiators during ransomware extortion to eliminate internal emotional panic.',
      'Treat regulatory inquiries as clinical fact-finding channels rather than personalized battlegrounds.'
    ],
    modernAnalogy: 'Grandmaster chess: an opponent who baiting you into an emotional retaliation has already won the board.',
    keyTheme: 'Emotional Neutrality & Strategic Poise',
    badgeColor: 'rose'
  },
  {
    id: 'lesson-05-gita-sthitaprajna-equanimity',
    number: 5,
    title: 'Unshakable Equanimity (Sthitaprajna)',
    source: 'Bhagavad Gita, Chapter 2, Verse 56',
    tradition: 'Gita & Vedic',
    quote: 'One whose mind is untroubled in distress, devoid of longing in pleasure, and free from attachment, fear, and anger—such a leader is anchored in wisdom.',
    corePrinciple: 'True executive presence is rooted in an unruffled center that neither panics during catastrophic failure nor succumbs to hubris during historic victory.',
    executiveApplication: 'When a Tier-1 clearing enclave suffers an unexpected outage, or when an audit yields 100% clean attestations, the executive maintains identical, calm equilibrium. This stability radiates downward, preventing catastrophic team burnout during crises and eliminating complacency during peacetime.',
    tacticalExecution: [
      'Lead Sev-1 incident war rooms with a low vocal cadence, measured breathing, and clear decision gates.',
      'Celebrate flawless audit milestones for 24 hours, then immediately pivot team focus to emerging attack vectors.',
      'Mitigate alarm fatigue and cognitive overload in 24/7 SOC teams through structured cognitive rotations.'
    ],
    modernAnalogy: 'The gyroscopic stabilizer of a marine vessel: regardless of oceanic turbulence, the navigation bridge remains level.',
    keyTheme: 'Psychological Anchoring & Grounded Presence',
    badgeColor: 'amber'
  },
  {
    id: 'lesson-06-gladiator-echoes-eternity',
    number: 6,
    title: 'Echoes in Eternity & Collective Cohesion',
    source: 'Gladiator (2000) — Directed by Ridley Scott',
    tradition: 'Cinema & Culture',
    quote: 'What we do in life echoes in eternity. Whatever comes out of these gates, we\'ve got a better chance of survival if we work together. As one.',
    corePrinciple: 'Individual heroism is a systemic liability; collective institutional survival and enduring legacy require total team cohesion under fire.',
    executiveApplication: 'Enterprise cybersecurity is an asymmetric war. The adversary only needs one cracked door; the defenders must protect infinite surface area. Siloed fiefdoms will be systematically picked apart. Defense is a contact sport won through interlocked unity between DevOps, SecOps, IAM, and Legal.',
    tacticalExecution: [
      'Align security OKRs directly with product revenue goals to eliminate adversarial tension between Speed and Safety.',
      'Execute multi-disciplinary tabletop simulations requiring synchronized execution across Legal, PR, Engineering, and C-Suite.',
      'Author enduring institutional blueprints and reference architectures that govern enterprise standards long after your tenure.'
    ],
    modernAnalogy: 'The Roman testudo formation: individual shields overlapping to form an impenetrable collective shell.',
    keyTheme: 'Team Cohesion & Institutional Legacy',
    badgeColor: 'rose'
  },
  {
    id: 'lesson-07-stoic-premeditatio-malorum',
    number: 7,
    title: 'Premeditatio Malorum (Pre-Mortem Thinking)',
    source: 'Marcus Aurelius & Seneca (Letters to Lucilius)',
    tradition: 'Marcus Aurelius & Stoics',
    quote: 'When you arise in the morning, think of what a privilege it is to be alive... Say to yourself in advance: today I will meet the meddlesome, the ungrateful, the arrogant, and the dishonest. Rehearse their faults in your mind so you cannot be surprised.',
    corePrinciple: 'Mental anticipation of worst-case scenarios neutralizes psychological shock, preserves strategic initiative, and builds proactive defenses.',
    executiveApplication: 'This is the philosophical genesis of Zero Trust architecture and chaos engineering. Never assume perimeter benevolence or flawless software. Assume active compromise, assume credential leakage, assume cloud regional disaster, and architect compensating controls so the breach is contained by design.',
    tacticalExecution: [
      'Mandate pre-mortem design reviews prior to launching any critical multi-cloud production architecture.',
      'Deploy automated chaos monkey scripts to inject simulated latency, key expirations, and credential revocations.',
      'Enforce Zero Standing Privilege (ZSP) across all administrative roles, treating every session as potentially compromised.'
    ],
    modernAnalogy: 'Submarine compartmentalization: water entering one chamber automatically triggers pressure-sealed bulkheads.',
    keyTheme: 'Zero Trust Mindset & Proactive Hardening',
    badgeColor: 'indigo'
  },
  {
    id: 'lesson-08-bible-house-on-the-rock',
    number: 8,
    title: 'Building Upon the Rock (Depth Over Expediency)',
    source: 'The Holy Bible, Matthew 7:24–27',
    tradition: 'Biblical Wisdom',
    quote: 'The rain came down, the streams rose, and the winds blew and beat against that house; yet it did not fall, because it had its foundation on the rock. But everyone who hears these words and does not do them is like a foolish man who built his house on sand.',
    corePrinciple: 'The integrity of any architecture is revealed not during sunny conditions, but during catastrophic storms. Superficial shortcuts collapse under pressure.',
    executiveApplication: 'Checkbox compliance tools and rushed vendor integrations build enterprise security on sand. When a nation-state attack occurs or a regulatory audit descends, only bedrock fundamentals endure: cryptographic identity, immutable logging, zero standing privileges, and deterministic access controls.',
    tacticalExecution: [
      'Reject cosmetic compliance overlay tools in favor of verified cryptographic primitives (FIDO2, mTLS, PKI).',
      'Cleanse and consolidate authoritative identity sources before deploying complex AI-driven access governance.',
      'Implement append-only, tamper-proof audit trails with cryptographic timestamping across all Tier-1 enclaves.'
    ],
    modernAnalogy: 'Bedrock civil engineering: skyscrapers anchored into subterranean granite withstand earthquakes that level superficial towers.',
    keyTheme: 'Cryptographic Foundations & Defensibility',
    badgeColor: 'emerald'
  },
  {
    id: 'lesson-09-shawshank-pressure-and-time',
    number: 9,
    title: 'Geology: Relentless Pressure and Time',
    source: 'The Shawshank Redemption (1994) — Directed by Frank Darabont',
    tradition: 'Cinema & Culture',
    quote: 'Geology is the study of pressure and time. That\'s all it takes really: pressure and time. Remember, hope is a good thing, maybe the best of things, and no good thing ever dies.',
    corePrinciple: 'Monumental enterprise transformations are not realized through flamboyant gestures; they are achieved through quiet microscopic discipline and compounding patience.',
    executiveApplication: 'Migrating 50,000 workforce identities to Zero Trust, eliminating millions of standing access grants, and reshaping enterprise risk culture cannot happen in a single quarter. It requires an executive willing to apply persistent, polite, unyielding pressure week after week, chipping away at technical debt until the fortress is complete.',
    tacticalExecution: [
      'Track compounding weekly micro-gains: 1.5% reduction in standing privileges per sprint, compounding to -98.4% over 3 years.',
      'Protect the core transformation roadmap against short-sighted budget reprioritization and executive churn.',
      'Infuse engineering teams with quiet purpose and long-term vision during tedious multi-year legacy migrations.'
    ],
    modernAnalogy: 'Water carving the Grand Canyon: the softest element overcoming solid rock through unyielding, patient persistence.',
    keyTheme: 'Compounding Discipline & Unbroken Vision',
    badgeColor: 'rose'
  },
  {
    id: 'lesson-10-matrix-knowing-vs-walking',
    number: 10,
    title: 'Knowing the Path vs. Walking the Path',
    source: 'The Matrix (1999) — Written & Directed by the Wachowskis',
    tradition: 'Cinema & Culture',
    quote: 'There\'s a difference between knowing the path and walking the path.',
    corePrinciple: 'Theoretical knowledge and documented policies are meaningless without operational muscle memory and automated battle-tested execution.',
    executiveApplication: 'Having a 300-page cybersecurity policy approved by the audit committee is "knowing the path." "Walking the path" is having automated CI/CD policy-as-code blockers, continuous red-team adversary emulation, real-time SOC kill-switch execution, and muscle memory tested during unannounced drills.',
    tacticalExecution: [
      'Translate static Word and PDF security policies into automated policy-as-code guardrails (Open Policy Agent / Rego).',
      'Replace passive annual slide-deck compliance training with active adversary emulation labs for developers.',
      'Validate emergency isolation runbooks through live unannounced containment drills rather than desktop walkthroughs.'
    ],
    modernAnalogy: 'A pilot who has read every flight manual vs. an ace aviator with 10,000 flight hours in hurricane turbulence.',
    keyTheme: 'Operationalization & Muscle Memory',
    badgeColor: 'rose'
  },
  {
    id: 'lesson-11-drucker-doing-right',
    number: 11,
    title: 'Leadership vs. Management',
    source: 'Peter Drucker, The Effective Executive',
    tradition: 'Modern Management',
    quote: 'Management is doing things right; leadership is doing the right things.',
    corePrinciple: 'Optimization of existing processes (management) must be subservient to the strategic selection of the mission itself (leadership).',
    executiveApplication: 'A security organization can be flawlessly "doing things right" by patching 100% of vulnerabilities in 24 hours, but if they are patching legacy systems that should have been decommissioned years ago, they are failing at "doing the right things." Executive focus must prioritize architectural elimination over operational treadmill.',
    tacticalExecution: [
      'Evaluate tool efficacy based on risk reduction surface area rather than simple operational uptime.',
      'Prioritize "Decommissioning" as a Tier-1 strategic pillar to eliminate technical debt at the source.',
      'Audit leadership time allocation to ensure 40% is spent on strategic "future-state" architecture vs. "current-state" maintenance.'
    ],
    modernAnalogy: 'Pruning a tree: management is keeping the shears sharp; leadership is deciding which entire branch to remove to save the trunk.',
    keyTheme: 'Strategic Intent & Prioritization',
    badgeColor: 'blue'
  },
  {
    id: 'lesson-12-grove-paranoid-survive',
    number: 12,
    title: 'Strategic Inflection Points',
    source: 'Andy Grove, Only the Paranoid Survive',
    tradition: 'Modern Management',
    quote: 'Success breeds complacency. Complacency breeds failure. Only the paranoid survive.',
    corePrinciple: 'Continuous vigilance and the anticipation of radical market or technological shifts (inflection points) are mandatory for institutional survival.',
    executiveApplication: 'The shift from perimeter-based defense to Zero Trust, and the emergence of Generative AI, are Strategic Inflection Points. Organizations that rely on "what worked yesterday"—like legacy VPNs or static firewall rules—will be rendered obsolete. The executive must cultivate a culture of constructive paranoia that assumes the current model is already failing.',
    tacticalExecution: [
      'Conduct monthly "Pre-Mortem" sessions where teams brainstorm exactly how current defenses will be bypassed by next-gen AI tools.',
      'Institutionalize "Red Team" thinking across non-technical departments (Finance, Legal, HR) to detect business logic vulnerabilities.',
      'Force-rotate critical security leadership every 3-4 years to eliminate cognitive bias and "blind-spot" complacency.'
    ],
    modernAnalogy: 'The transition from the ice-cutting industry to mechanical refrigeration: those who defined themselves as "ice-cutters" died; those who saw "cooling" survived.',
    keyTheme: 'Vigilance & Adaptive Evolution',
    badgeColor: 'blue'
  },
  {
    id: 'lesson-13-jobs-hire-smart',
    number: 13,
    title: 'Inverted Command & Intellectual Agency',
    source: 'Steve Jobs, Apple Inc.',
    tradition: 'Modern Management',
    quote: 'It doesn\'t make sense to hire smart people and tell them what to do; we hire smart people so they can tell us what to do.',
    corePrinciple: 'The role of the executive is to set the vision and remove obstacles, not to dictate technical implementation to specialized experts.',
    executiveApplication: 'In complex domains like Identity Security or Post-Quantum Cryptography, the CISO cannot be the smartest person in the room. You hire PhD-level cryptographers and enterprise architects so they can inform the strategy. Micromanagement is a symptom of hiring insecurity; executive strength is shown through deferential empowerment.',
    tacticalExecution: [
      'Implement "Bottom-Up" architectural proposals where engineers present "Vision Documents" to the C-Suite.',
      'Reward contrarian technical opinions that challenge executive assumptions with data-backed telemetry.',
      'Shift executive reviews from "Approval of Steps" to "Alignment on Outcomes and Guardrails."'
    ],
    modernAnalogy: 'A conductor of an orchestra: they don\'t play the violin better than the first chair; they synchronize the genius of those who do.',
    keyTheme: 'Empowerment & Intellectual Humility',
    badgeColor: 'blue'
  },
  {
    id: 'lesson-14-sinek-start-with-why',
    number: 14,
    title: 'The Golden Circle of Purpose',
    source: 'Simon Sinek, Start with Why',
    tradition: 'Modern Management',
    quote: 'People don\'t buy what you do; they buy why you do it. And what you do simply proves what you believe.',
    corePrinciple: 'Organizational buy-in and cultural transformation are driven by shared purpose (The Why), not technical specifications (The What).',
    executiveApplication: 'When mandating MFA or strict identity governance, the "What" is annoying to users. If the "Why" is framed as "Protecting our customers\' life savings and maintaining the trust that fuels our payroll," buy-in shifts from compliance to contribution. Security is a mission of trust, not a list of chores.',
    tacticalExecution: [
      'Internal security communications must lead with the "Human Risk" and "Trust Impact" before the "Technical Mandate."',
      'Align security team rewards with "Breach Prevention" (The Why) rather than "Tickets Closed" (The What).',
      'Articulate a 10-year security vision that centers on "Becoming the World\'s Most Trusted Platform" rather than "Implementing NIST 800-53."'
    ],
    modernAnalogy: 'Apple vs. Dell in the 90s: one sold "Tools for Creative Rebels"; the other sold "Beige Boxes with 256MB RAM."',
    keyTheme: 'Purpose-Driven Leadership & Culture',
    badgeColor: 'blue'
  },
  {
    id: 'lesson-15-collins-first-who',
    number: 15,
    title: 'First Who, Then What',
    source: 'Jim Collins, Good to Great',
    tradition: 'Modern Management',
    quote: 'If you have the right people on the bus, the right people in the right seats, and the wrong people off the bus, then you\'ll figure out how to drive it somewhere great.',
    corePrinciple: 'In a rapidly shifting landscape, the quality of the individuals is more important than the specific strategy, as the strategy must inevitably change.',
    executiveApplication: 'In a 5-year security roadmap, the technology (The What) will be unrecognizable by year 3. Therefore, hiring for "Adaptive Intelligence" and "Cultural Integrity" (The Who) is the only sustainable strategy. A Tier-1 engineer with low ego can learn any tool; a Tier-2 engineer with high ego is a permanent architectural liability.',
    tacticalExecution: [
      'Standardize interview loops to prioritize "Learning Agility" and "Blameless Accountability" over specific tool-set knowledge.',
      'Decisively remove "Brilliant Jerks" who create knowledge silos and toxic team friction.',
      'Invest 20% of the security budget in continuous "Human Upskilling" to ensure the "Who" can pivot as the "What" evolves.'
    ],
    modernAnalogy: 'A special-forces unit: they aren\'t trained for one specific mission; they are selected for the psychological grit to handle any mission.',
    keyTheme: 'Talent Density & Cultural Integrity',
    badgeColor: 'blue'
  }
];

