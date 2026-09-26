export const medicalCategories = [
  { id: "all", name: "All Topics", icon: "BookOpen" },
  { id: "symptoms", name: "Symptoms", icon: "Activity" },
  { id: "conditions", name: "Conditions", icon: "Stethoscope" },
  { id: "anatomy", name: "Anatomy", icon: "Cpu" },
  { id: "first-aid", name: "First Aid", icon: "HeartPulse" },
  { id: "prevention", name: "Prevention", icon: "ShieldCheck" },
  { id: "healthy-living", name: "Healthy Living", icon: "Apple" }
];

export const mockMedicalReferences = [
  {
    id: "ref-1",
    title: "Understanding Fever & Body Temperature",
    category: "symptoms",
    categoryName: "Symptoms",
    summary: "Clinical definitions of low-grade, moderate, and high fevers, accurate measurement methods, and when fever signals a medical emergency.",
    readTime: "4 min read",
    tags: ["Fever", "Pediatrics", "Thermometry", "Infection"],
    keyPoints: [
      "Normal body temperature typically hovers around 37°C (98.6°F), varying by time of day and activity.",
      "A clinical fever in adults is considered 38°C (100.4°F) or above.",
      "Fevers stimulate white blood cell production and inhibit microbial reproduction.",
      "Seek emergency care for fevers accompanied by stiff neck, confusion, breathing difficulties, or persistent vomiting."
    ],
    fullArticle: `A fever (pyrexia) is a temporary elevation in body temperature triggered by the hypothalamus in response to pyrogens released by the immune system or invading pathogens.

### Temperature Thresholds
* **Normal**: 36.1°C – 37.2°C (97°F – 99°F)
* **Low-grade Fever**: 37.3°C – 38.0°C (99.1°F – 100.4°F)
* **Fever (Adults)**: ≥ 38.0°C (100.4°F)
* **High Fever**: ≥ 39.4°C (103°F)
* **Hyperpyrexia**: > 41.1°C (106°F) – Medical Emergency

### Red Flags
In infants younger than 3 months old, any rectal temperature of 38.0°C or higher requires immediate emergency room evaluation regardless of other symptoms.`
  },
  {
    id: "ref-2",
    title: "Type 2 Diabetes Mellitus: Pathophysiology & Management",
    category: "conditions",
    categoryName: "Conditions",
    summary: "An overview of insulin resistance, diagnostic blood tests (HbA1c, Fasting Blood Glucose), dietary strategies, and oral medications.",
    readTime: "6 min read",
    tags: ["Endocrine", "Blood Sugar", "Insulin", "Chronic Disease"],
    keyPoints: [
      "Caused by cellular resistance to insulin combined with progressive pancreatic beta-cell dysfunction.",
      "Diagnosed with HbA1c ≥ 6.5% or Fasting Plasma Glucose ≥ 126 mg/dL on two separate occasions.",
      "Cornerstones of treatment include nutritional therapy, aerobic exercise, weight reduction, and medications like metformin.",
      "Prevention of microvascular (retinopathy, nephropathy) and macrovascular complications is the core clinical objective."
    ],
    fullArticle: `Type 2 diabetes is a chronic metabolic disorder where cells fail to respond effectively to insulin. Over time, elevated blood glucose levels damage blood vessels and organs throughout the body.

### Common Signs & Symptoms
* Polyuria (excessive urination)
* Polydipsia (unquenchable thirst)
* Polyphagia (extreme hunger)
* Unexplained weight loss
* Blurry vision
* Slow-healing cuts or sores

### Diagnostic Criteria
* Normal HbA1c: Below 5.7%
* Prediabetes: 5.7% to 6.4%
* Diabetes: 6.5% or higher on two separate tests`
  },
  {
    id: "ref-3",
    title: "Basic Life Support: CPR & Choking Response",
    category: "first-aid",
    categoryName: "First Aid",
    summary: "Step-by-step guidance for adult bystander Hands-Only CPR, AED deployment protocols, and the Heimlich maneuver.",
    readTime: "5 min read",
    tags: ["Emergency", "CPR", "AED", "Resuscitation", "Life Support"],
    keyPoints: [
      "Check responsiveness and call local emergency services immediately.",
      "Hands-Only CPR: Push hard and fast in the center of the chest at 100–120 beats per minute.",
      "Allow full chest recoil between compressions; compress to a depth of at least 2 inches (5 cm).",
      "Apply an Automated External Defibrillator (AED) as soon as available and follow voice prompts."
    ],
    fullArticle: `When cardiac arrest occurs, every minute without CPR decreases the chance of survival by 7–10%. Prompt bystander intervention doubles or triples survival rates.

### Hands-Only CPR Steps:
1. **Scene Safety**: Ensure the surrounding area is safe for you and the patient.
2. **Assess Responsiveness**: Tap shoulders firmly and shout "Are you okay?". Look for normal breathing.
3. **Call for Help**: Call 911 (or local emergency number) and retrieve an AED.
4. **Chest Compressions**: Place the heel of one hand in the center of the chest, interlock your other hand on top. Push straight down hard and fast (100–120 bpm to the rhythm of 'Stayin Alive').
5. **Continue** until emergency medical personnel arrive or the person shows signs of consciousness.`
  },
  {
    id: "ref-4",
    title: "Human Cardiovascular System: Heart & Circulation",
    category: "anatomy",
    categoryName: "Anatomy",
    summary: "The chambers of the heart, systemic vs. pulmonary circulation, coronary artery network, and electrical conduction system.",
    readTime: "5 min read",
    tags: ["Heart", "Vascular", "Circulation", "Cardiology"],
    keyPoints: [
      "The heart features four chambers: right and left atria (collecting) and right and left ventricles (pumping).",
      "Pulmonary circulation transports deoxygenated blood to the lungs; systemic circulation delivers oxygenated blood to the body.",
      "The sinoatrial (SA) node acts as the heart's natural biological pacemaker.",
      "Coronary arteries branch from the aorta to supply the myocardium itself with oxygenated blood."
    ],
    fullArticle: `The cardiovascular system comprises the muscular four-chambered heart, approximately 60,000 miles of blood vessels, and blood. It delivers oxygen and nutrients to tissues while carrying away metabolic waste products.

### The Cardiac Cycle
* **Systole**: Contraction phase where ventricles pump blood into the pulmonary artery and aorta.
* **Diastole**: Relaxation phase where chambers fill with blood from venous circulation.`
  },
  {
    id: "ref-5",
    title: "Cardiovascular Disease Prevention & Risk Reduction",
    category: "prevention",
    categoryName: "Prevention",
    summary: "Evidence-based preventative measures including blood pressure regulation, lipid profile optimization, and smoking cessation.",
    readTime: "4 min read",
    tags: ["Heart Health", "Hypertension", "Cholesterol", "Longevity"],
    keyPoints: [
      "At least 150 minutes of moderate-intensity aerobic physical activity per week reduces cardiac risk significantly.",
      "Target blood pressure below 120/80 mmHg through reduced sodium intake and stress management.",
      "Quit smoking to reduce risk of coronary heart disease by 50% within 1 year.",
      "Maintain a Mediterranean-style dietary pattern rich in leafy greens, nuts, legumes, and omega-3 fatty acids."
    ],
    fullArticle: `Cardiovascular disease remains the leading cause of mortality worldwide, yet up to 80% of premature heart attacks and strokes are preventable through lifestyle modifications and early intervention.`
  },
  {
    id: "ref-6",
    title: "Sleep Hygiene & Circadian Health Optimization",
    category: "healthy-living",
    categoryName: "Healthy Living",
    summary: "The neurological stages of sleep, benefits of restorative slow-wave sleep, and actionable habits for overcoming insomnia.",
    readTime: "4 min read",
    tags: ["Sleep", "Circadian Rhythm", "Recovery", "Mental Health"],
    keyPoints: [
      "Adults require 7 to 9 hours of quality sleep nightly for cellular repair and memory consolidation.",
      "Morning exposure to natural sunlight anchors the circadian pacemaker and regulates nocturnal melatonin production.",
      "Keep bedroom temperature cool (around 18°C / 65°F) and pitch-black for optimal sleep architecture.",
      "Avoid blue light screens and caffeine within 6 hours of scheduled bedtime."
    ],
    fullArticle: `Sleep is an active neurobiological state during which the brain flushes neurotoxic waste products through the glymphatic system and synthesizes critical growth and immune hormones.`
  },
  {
    id: "ref-7",
    title: "Acute Burn Management & First Aid Protocols",
    category: "first-aid",
    categoryName: "First Aid",
    summary: "Classifying first, second, and third-degree burns, cooling techniques, and what never to apply to a thermal burn.",
    readTime: "3 min read",
    tags: ["Burns", "Wound Care", "First Aid", "Trauma"],
    keyPoints: [
      "Cool the burn immediately with cool (not ice cold) running water for at least 10–20 minutes.",
      "Do NOT apply ice, butter, toothpaste, or greasy ointments, as they trap heat and increase infection risk.",
      "Cover loosely with a clean, sterile, non-adherent dressing or clean plastic wrap.",
      "Seek emergency care for burns involving the face, hands, major joints, genitals, or large body surfaces."
    ],
    fullArticle: `Proper immediate cooling reduces tissue damage and depth of the burn. Never pop blisters, as the intact skin blister acts as a natural sterile barrier against bacterial invasion.`
  },
  {
    id: "ref-8",
    title: "The Human Immune System: Innate vs. Adaptive Immunity",
    category: "anatomy",
    categoryName: "Anatomy",
    summary: "How neutrophils, macrophages, B-lymphocytes, and T-lymphocytes coordinate defense against bacterial and viral pathogens.",
    readTime: "6 min read",
    tags: ["Immunology", "Antibodies", "Lymphatic", "Defense"],
    keyPoints: [
      "Innate immunity provides rapid, non-specific frontline defense (skin barriers, phagocytes, natural killer cells).",
      "Adaptive immunity provides antigen-specific memory through B-cells (antibodies) and T-cells (cell-mediated cytotoxicity).",
      "Lymph nodes filter lymphatic fluid and act as central hubs for immune cell activation."
    ],
    fullArticle: `The immune system is an intricate biological surveillance network consisting of lymphoid organs (thymus, spleen, bone marrow, lymph nodes) and specialized mobile cellular defenders.`
  }
];
