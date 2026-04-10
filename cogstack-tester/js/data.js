window.APP_DATA = {
  panels: [
    { group: 'Live API Test', items: ['annotate','deident','terminology','notetype','safety','efficiency','latency','negative','serviceinfo','explainability'] },
    { group: 'Checklist & Analisis', items: ['workflow','docker','licensing','equity','harm','usecase','governance','raci','gonogo','runbook','monitoring','costbenefit'] }
  ],
  syntheticSamples: [
    'Synthetic note: Patient reports chest discomfort and was prescribed aspirin 75mg daily.',
    'Synthetic note: Patient has type 2 diabetes and metformin treatment plan reviewed.',
    'Synthetic note: Follow-up indicates improved blood pressure after lisinopril.'
  ],
  deidentSamples: [
    'Synthetic patient John Doe, age 54, lives at 10 Demo Street, phone 555-100-2000, record RN-99212.',
    'Synthetic patient Maria Lee, age 39, address 23 Test Ave, phone 555-889-1234, record RN-10001.'
  ],
  safetyPresets: [
    {name:'allergy', text:'Synthetic note: allergy to penicillin, rash previously observed.', expected:'penicillin,allergy'},
    {name:'contraindication', text:'Synthetic note: avoid warfarin due to active bleeding risk.', expected:'warfarin,bleeding'},
    {name:'medication stopped', text:'Synthetic note: metoprolol stopped due to bradycardia.', expected:'metoprolol,bradycardia'},
    {name:'critical dose', text:'Synthetic note: insulin dose increased to 60 units nightly.', expected:'insulin,dose'},
    {name:'negation', text:'Synthetic note: no evidence of pneumonia on imaging.', expected:'pneumonia,negation'}
  ],
  negativePayloads: {
    empty: '', malformed: '{"content": [}', missingField: '{"foo": "bar"}', wrongType: '{"content":"text"}',
    emptyText: '{"content":[{"text":""}]}', huge: JSON.stringify({content:[{text:'X'.repeat(30000)}]}), custom: '{"content":[{"text":"Synthetic custom"}]}'
  },
  latencyTexts: {
    short: 'Synthetic short note: mild cough.',
    medium: 'Synthetic medium note: Patient presents with cough, fever, and myalgia. Treated with supportive care and review in 48h.',
    long: 'Synthetic long note: ' + 'This synthetic paragraph contains repeated clinical-style narrative for latency testing. '.repeat(20)
  },
  dockerChecklist: ['Container image available','Model volume mounted','Port 5000 mapped','Healthcheck endpoint works','Logs retained'],
  goNoGoChecklist: [
    {id:'api', label:'API stable', critical:true},
    {id:'safety', label:'Safety scenarios reviewed', critical:true},
    {id:'runbook', label:'Runbook exists', critical:true},
    {id:'monitor', label:'Monitoring configured', critical:false}
  ],
  harmScenarios: [
    ['Missed allergy','Clinical','High','Unrecognized entity','Safety review gate'],
    ['Wrong negation','Model','Medium','Negation failure','Manual verification'],
    ['Bias in terminology','Equity','Medium','Dialect variation','Coverage testing']
  ]
};
