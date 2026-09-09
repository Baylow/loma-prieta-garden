'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CurriculumTabs() {
  const [activeTab, setActiveTab] = useState('curriculum');
  const [activeUnit, setActiveUnit] = useState('sep1');

  const curriculumUnits = [
    {
      id: 'sep1',
      month: 'September',
      session: 'Class 1',
      title: 'Bed Preparation & Soil Health',
      tag: 'Soil Science',
      image: '/images/wheelbarrow_team.jpg',
      what: [
        'Compost: Outside the garden gate in the organic compost pile',
        'Hand-rakes & Trowels: Located in the Garden Shed',
        'Wheelbarrows: Stored against the side of the Garden Shed',
        'Watering Cans: Staged along the fence line',
        'Hands & Gloves: Ready to work!'
      ],
      why: 'Before planting, it is essential to prepare the garden bed—just like "making the bed" for our baby plants! Mixing rich compost into the dirt improves soil structure, creates a loose and crumbly texture for tender roots, and replenishes vital nutrients consumed by summer crops. The compost layer also acts as an insulating blanket, protecting soil microbiology, buffering rain impact, and locking in moisture.',
      how: [
        'Before Class: Delineate equal sections of the garden box so every student group has an assigned area; collect necessary trowels and rakes.',
        'Weeding & Rock Clearing: Guide students to use their hands to pull weeds and remove large rocks; deposit debris into the designated garden pile.',
        'Compost Hauling: Support kids in filling wheelbarrows with organic compost and rolling them safely to their bed.',
        'Layering: Help students shovel compost across the bed to create a uniform layer 3"-4" thick.',
        'Mixing: With trowels and hands, gently turn and blend the compost into the top 8" of native soil.',
        'Raking: Use hand-rakes to smooth the soil surface evenly.',
        'Deep Watering: Fill watering cans and water the freshly amended soil deeply to settle the bed.',
        'Cleanup: Wash hands at the hose station and return tools to the staging area.'
      ]
    },
    {
      id: 'sep2',
      month: 'September',
      session: 'Class 2',
      title: 'Fall Planting & Garden Design',
      tag: 'Planting & Botany',
      image: '/images/corn_harvest.jpg',
      what: [
        'Direct Sow Seeds: Beets, carrots, garlic, onions, sugar snap peas, radishes, spinach',
        'Seedling Starts: Chard, kale, lettuce, calendula, edible flowers',
        'Tools: Trowels, rulers, and watering cans from the shed',
        'Garden Maps & Colors: Printable planting grid worksheets & colored pencils'
      ],
      why: 'Fall is one of the most rewarding planting seasons in the Santa Cruz Mountains! Warm soil combined with cooler ambient air creates prime conditions for robust root growth without high heat stress. We emphasize crop diversity by planning a healthy balance of vegetables (up to 6 types), companion flowers (up to 4 types), and herbs (up to 4 types) in each bed.',
      how: [
        'Planning Ahead: Coordinate your bed layout 1 week prior with Garden Coordinators (GPs).',
        'Coloring the Plan: Gather students around the picnic table; review the map and have each child color in the assigned spots for seeds and starts.',
        'Bed Division: Ensure each child has a clearly marked planting station along their bed.',
        'Planting Depth: Guide students to measure planting depth using rulers (1/2" for small seeds, root ball depth for starts).',
        'Gentle Tamping: Place starts in soil, cover gently, and lightly press around the stem base.',
        'Gentle Watering: Water with fine rose nozzles to avoid displacing delicate seeds.',
        'Staking: Label each crop row with plant markers.'
      ]
    },
    {
      id: 'oct1',
      month: 'October',
      session: 'Class 1',
      title: 'Garden Helpers & Scarecrow Building',
      tag: 'Ecology & Stewardship',
      image: '/images/scarecrow.jpg',
      what: [
        'Scarecrow Materials: Wooden cross-frames, straw bales, twine, safety pins',
        'Clothing: Recycled child and adult shirts, overalls, hats, and bandanas',
        'Face Materials: Burlap sacks, fabric markers, felt scraps'
      ],
      why: 'Scarecrows are a celebrated tradition in agricultural history, serving as visual deterrents for birds while welcoming beneficial insect predators. This lesson emphasizes creative teamwork, spatial problem-solving, and celebrating the turn of the autumn season.',
      how: [
        'Discussion: Discuss how birds, insects, and mammals interact with our young seedlings.',
        'Straw Stuffing: Students work in small groups to stuff the scarecrow torso, arms, and legs with fresh straw.',
        'Assembly: Fasten arms and legs using twine; decorate and secure the scarecrow head.',
        'Installation: Stand the scarecrow up firmly in the center garden pathway overlooking the beds.',
        'Garden Check: Inspect emerging seedlings and pull any opportunistic weeds around the bed perimeter.'
      ]
    },
    {
      id: 'oct2',
      month: 'October',
      session: 'Class 2',
      title: 'Indian Corn Harvest & Seed Anatomy',
      tag: 'Harvest & Anatomy',
      image: '/images/corn_harvest.jpg',
      what: [
        'Mature Corn Stalks: Ready for harvesting in the garden',
        'Inspection Tools: Hand magnifying lenses, harvest baskets',
        'Seed Saving Envelopes: For collecting colorful kernels'
      ],
      why: 'Corn is a cornerstone of American agriculture and Indigenous Three Sisters companion planting (corn, beans, squash). Examining mature corn ears allows students to study pollination (every silk connects to a kernel), genetic color variation, and the life cycle of seed-bearing grasses.',
      how: [
        'Harvesting: Guide students in gently twisting and snapping mature corn cobs from the stalks.',
        'Husking: Peel back the protective husks to reveal the multi-colored kernels beneath.',
        'Anatomy Exploration: Use magnifying lenses to inspect silks, kernels, cobs, and tassels.',
        'Seed Saving: Demonstrate how kernels dry on the cob to become next season\'s seeds.'
      ]
    },
    {
      id: 'nov1',
      month: 'November',
      session: 'Class 1',
      title: 'Pumpkins, Squash & Decomposition',
      tag: 'Life Cycles',
      image: '/images/garden_straw.jpg',
      what: [
        'Pumpkins & Winter Squash: Harvested from the patch',
        'Tools: Scooping spoons, compost pails, seed drying trays'
      ],
      why: 'Decomposition is nature\'s recycling program. By exploring cucurbit fruit structure and composting post-harvest plant matter, students understand how old organic material transforms into nutrient-rich soil food.',
      how: [
        'Exploration: Examine pumpkin skin, stem, pulp, and seeds.',
        'Seed Harvesting: Scoop and count seeds; separate seeds for roasting and spring replanting.',
        'Composting: Chop remaining pumpkin pulp and rinds and layer them into the active compost bin with dry straw.'
      ]
    },
    {
      id: 'nov2',
      month: 'November',
      session: 'Class 2',
      title: 'Vermicomposting: Worms at Work',
      tag: 'Soil Biology',
      image: '/images/beekeeper.jpg',
      what: [
        'Classroom Worm Bins: Red Wiggler earthworms (Eisenia fetida)',
        'Observation Trays, magnifying glasses, spray bottles with water, shredded damp newspaper'
      ],
      why: 'Earthworms are nature\'s ultimate soil engineers. In vermicomposting, red wigglers consume organic food scraps and produce nutrient-dense worm castings ("black gold"), accelerating healthy soil rejuvenation.',
      how: [
        'Guest Educator / Lead Demo: Gentle handling guidelines for living organisms (keep hands damp).',
        'Observation: Place worms on damp trays; observe movement, segments, and sensitivity to light.',
        'Bin Maintenance: Add balanced kitchen scraps, layer with damp shredded paper bedding, and mist lightly with water.'
      ]
    },
    {
      id: 'dec1',
      month: 'December',
      session: 'Class 1 & 2',
      title: 'Winter Garden Care & Seed Starts',
      tag: 'Winter Prep',
      image: '/images/hero_garden.jpg',
      what: [
        'Frost Cloth & Cloches: Stored in the garden shed',
        'Mulch: Straw and wood chips',
        'Indoor Seed Trays: Seed starting mix, plant labels, spray bottles'
      ],
      why: 'Winter brings colder mountain temperatures and dormancy. Applying mulch and frost barriers shields root systems from freezing ground temperatures while indoor seed starting gives cool-weather crops a head start for early spring planting.',
      how: [
        'Winterizing Beds: Spread a clean mulch layer around perennial herbs and winter greens.',
        'Frost Cover Setup: Anchor frost cloth securely over delicate beds.',
        'Indoor Starts: Fill seedling cells with seed-starting medium, sow early spring starts, and place in classroom sunny windows or grow racks.'
      ]
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('curriculum')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            border: activeTab === 'curriculum' ? '2px solid var(--primary-purple)' : '1px solid #cbd5e1',
            backgroundColor: activeTab === 'curriculum' ? 'var(--primary-purple)' : '#fff',
            color: activeTab === 'curriculum' ? '#fff' : '#334155',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'curriculum' ? '0 4px 12px rgba(102, 46, 128, 0.2)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          🌱 2nd Grade Fall Curriculum
        </button>

        <button
          onClick={() => setActiveTab('handbook')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            border: activeTab === 'handbook' ? '2px solid var(--teal)' : '1px solid #cbd5e1',
            backgroundColor: activeTab === 'handbook' ? 'var(--teal)' : '#fff',
            color: activeTab === 'handbook' ? '#fff' : '#334155',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'handbook' ? '0 4px 12px rgba(59, 181, 181, 0.2)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          📖 Volunteer Handbook & Protocols
        </button>

        <button
          onClick={() => setActiveTab('outline')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            border: activeTab === 'outline' ? '2px solid var(--sapphire-blue)' : '1px solid #cbd5e1',
            backgroundColor: activeTab === 'outline' ? 'var(--sapphire-blue)' : '#fff',
            color: activeTab === 'outline' ? '#fff' : '#334155',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'outline' ? '0 4px 12px rgba(0, 75, 141, 0.2)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          📋 Program Outline & Class Leads
        </button>
      </div>

      {/* TAB 1: CURRICULUM */}
      {activeTab === 'curriculum' && (
        <div className="animate-fade-in-up">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--primary-purple)', marginBottom: '0.5rem' }}>2nd Grade Fall Garden Curriculum</h2>
            <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>
              Structured, hands-on lesson plans designed for class volunteers and students. Select a unit below to explore what to bring, why it matters, and step-by-step instructions.
            </p>
          </div>

          {/* Unit Selector Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            {curriculumUnits.map(unit => (
              <button
                key={unit.id}
                onClick={() => setActiveUnit(unit.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: activeUnit === unit.id ? '2px solid var(--primary-purple)' : '1px solid #e2e8f0',
                  backgroundColor: activeUnit === unit.id ? 'rgba(102, 46, 128, 0.08)' : '#fff',
                  color: activeUnit === unit.id ? 'var(--primary-purple)' : '#64748b',
                  fontWeight: activeUnit === unit.id ? 'bold' : 'normal',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                {unit.month}: {unit.session}
              </button>
            ))}
          </div>

          {/* Selected Unit Content Card */}
          {(() => {
            const unit = curriculumUnits.find(u => u.id === activeUnit) || curriculumUnits[0];
            return (
              <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--teal)', paddingBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--teal)', fontWeight: 'bold' }}>
                      {unit.month} • {unit.session}
                    </span>
                    <h2 style={{ color: 'var(--primary-purple)', marginTop: '0.25rem' }}>{unit.title}</h2>
                  </div>
                  <span style={{ backgroundColor: 'rgba(59, 181, 181, 0.15)', color: 'var(--teal)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                    {unit.tag}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                  
                  {/* WHAT Section */}
                  <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--sapphire-blue)' }}>
                    <h3 style={{ color: 'var(--sapphire-blue)', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      📦 What You Need (Tools & Materials)
                    </h3>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', lineHeight: '1.7', color: '#334155' }}>
                      {unit.what.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* WHY Section */}
                  <div style={{ backgroundColor: 'rgba(102, 46, 128, 0.03)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-purple)' }}>
                    <h3 style={{ color: 'var(--primary-purple)', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      💡 Why We Do It (The Science & Education)
                    </h3>
                    <p style={{ fontSize: '0.92rem', lineHeight: '1.7', color: '#334155' }}>
                      {unit.why}
                    </p>
                  </div>
                </div>

                {/* HOW Section */}
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '1.75rem', borderRadius: '8px' }}>
                  <h3 style={{ color: 'var(--teal)', fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🛠️ How To Lead The Session (Step-by-Step)
                  </h3>
                  <ol style={{ paddingLeft: '1.4rem', fontSize: '0.95rem', lineHeight: '1.8', color: '#1e293b' }}>
                    {unit.how.map((step, idx) => (
                      <li key={idx} style={{ marginBottom: '0.5rem' }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: HANDBOOK */}
      {activeTab === 'handbook' && (
        <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '6px solid var(--teal)' }}>
            <h2 style={{ color: 'var(--teal)', marginBottom: '0.75rem' }}>Welcome to the Loma Garden Project</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#334155' }}>
              Thank you for being an essential part of the Loma Garden! This initiative thrives solely because of the passion, dedication, and volunteer support of our parent and teacher community. 
              Here is to growing our kids in community together!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            {/* Signing In & Out */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ color: 'var(--primary-purple)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ✍️ Front Desk Check-in & Shed Lock
              </h3>
              <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.7', fontSize: '0.9rem', color: '#334155' }}>
                <li><strong>Sign In:</strong> Always check in at the Loma front desk before your volunteer shift. If accessing the shed, request the shed lock/key.</li>
                <li><strong>Sign Out:</strong> Check out at the front desk when done and return the lock to the shed, confirming it is securely fastened.</li>
                <li><strong>Volunteer Training:</strong> If you volunteer on campus more than 10 hours during the year, please complete the district volunteer training.</li>
              </ul>
            </div>

            {/* Using Garden Shed */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ color: 'var(--primary-purple)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🏡 Shed Protocol (Adults Only)
              </h3>
              <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.7', fontSize: '0.9rem', color: '#334155' }}>
                <li><strong>Adults Only:</strong> Only adults may access the shed. Students should never enter unattended.</li>
                <li><strong>Retrieve in Advance:</strong> Get tools, seeds, clipboards, or coloring plates before students arrive.</li>
                <li><strong>Secure Lock:</strong> Lock the shed immediately after extracting tools and after returning them.</li>
              </ul>
            </div>

            {/* Tool Distribution */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ color: 'var(--sapphire-blue)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🧤 Tool Check-out & Safety
              </h3>
              <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.7', fontSize: '0.9rem', color: '#334155' }}>
                <li><strong>Count Tools:</strong> Count the number of shovels, hand-rakes, and trowels you hand out to students.</li>
                <li><strong>Return Procedure:</strong> Dedicate 5 minutes at the end of class for students to return tools to a central drop spot.</li>
                <li><strong>Recount:</strong> Count tools before placing back into the shed. If a tool is missing, do a visual sweep of the garden beds.</li>
              </ul>
            </div>

            {/* Reimbursements */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ color: 'var(--sapphire-blue)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                💳 Purchases & HSC Reimbursements
              </h3>
              <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.7', fontSize: '0.9rem', color: '#334155' }}>
                <li><strong>Pre-Approval:</strong> Before purchasing items, contact GPs with the item name, purpose, vendor, and estimated cost.</li>
                <li><strong>Submission:</strong> Once approved, submit receipts through the Home and School Club (HSC) reimbursement portal.</li>
                <li><strong>Budget:</strong> Loma Garden operates on a lean community budget—we prioritize free/discounted or recycled materials when possible.</li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: PROGRAM OUTLINE */}
      {activeTab === 'outline' && (
        <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ color: 'var(--primary-purple)', marginBottom: '1rem' }}>Garden Leadership & Coordinators (2026–2027)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--teal)' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--teal)', fontSize: '1rem' }}>Garden Coordinators (GPs)</div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  <div><strong>Joanna Rauh:</strong> 408.489.0909 • <a href="mailto:rudyrauh@gmail.com" style={{ color: 'var(--sapphire-blue)' }}>rudyrauh@gmail.com</a></div>
                  <div style={{ marginTop: '0.25rem' }}><strong>Kris Beleau:</strong> 707.695.3362 • <a href="mailto:baylow@gmail.com" style={{ color: 'var(--sapphire-blue)' }}>baylow@gmail.com</a></div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-purple)' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--primary-purple)', fontSize: '1rem' }}>School & HSC Leadership</div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  <div><strong>Amy Ramsay:</strong> 408.353.1106 • a.ramsay@lpjusd.com</div>
                  <div><strong>Edward Kluding:</strong> e.kluding@lpjusd.com</div>
                  <div><strong>Leanna:</strong> HSC President</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ color: 'var(--teal)', marginBottom: '1.25rem' }}>Class Leads & Assigned Garden Beds</h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Grade & Teacher</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Bed #</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Schedule Slot</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Assigned Leads / Volunteers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>Kinder: Zook</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Bed 1 / 2</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Every Other Friday 9:00–9:40 AM</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Pam Hagedorn (Lead), Stephen Garaffo</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#fafafa' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>Kinder: DePiazza</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Bed 1 / 2</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Every 3rd Friday 10:30–11:30 AM</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#b91c1c' }}>Open for volunteers!</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>1st: Templeton / Cole</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Bed 10</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Every Other Friday 1:00–1:40 PM</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Joanna Rauh (Lead), Lauren Miller</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#fafafa' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>1st: Ponkey</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Bed 9</td>
                    <td style={{ padding: '0.75rem 1rem' }}>1st & 3rd Friday 2:00–2:45 PM</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Rebecca Whitmer (Lead), Pam Hagedorn</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>2nd: Sanford</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Bed 8</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Coordinated with Teacher</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Pam Hagedorn (Lead)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#fafafa' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>3rd: Hoefer</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Bed 5 / 6</td>
                    <td style={{ padding: '0.75rem 1rem' }}>1st & 3rd Thursday 8:50–9:20 AM</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Karly Fogg (Lead), Amy Wakim (Lead), Erin Matteucci, Stephen Garaffo, Irene Whitney</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>3rd: LaMacchia</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Bed 5 / 6</td>
                    <td style={{ padding: '0.75rem 1rem' }}>2nd & 4th Friday 2:00–2:45 PM</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Pam Hagedorn (Lead), Kathy Adams</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#fafafa' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>4th: Ray / Perry</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Bed 4</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Weekly Thursday 12:00–12:45 PM</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Adelia Rowland (Lead)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>4th: Ignoffo</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Bed 3</td>
                    <td style={{ padding: '0.75rem 1rem' }}>1st & 3rd Monday 2:00–2:45 PM</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Rebecca Whitmer (Lead)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#fafafa' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>5th: Zanotto & Walsh</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Bed 11 / 12</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Fridays 12:00–1:50 PM</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#b91c1c' }}>Open for volunteer leads!</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <Link href="/schedule" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                View Full Live Schedule & Sign Up &rarr;
              </Link>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
