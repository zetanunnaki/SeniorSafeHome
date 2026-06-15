import fs from 'node:fs';
const date = '2026-06-15';
const items = [
  { slug: 'activities-of-daily-living', term: 'Activities of Daily Living (ADLs)', cat: 'reachers-dressing-aids', related: ['occupational-therapist', 'aging-in-place'],
    desc: 'Activities of daily living (ADLs) are the basic self-care tasks a person does every day, such as bathing, dressing, eating, toileting, and moving around.',
    body: `**Activities of daily living (ADLs)** are the fundamental self-care tasks people perform each day to live independently. They are usually grouped as: **bathing**, **dressing**, **eating**, **toileting** (using the bathroom), **transferring** (moving in and out of a bed or chair), and **continence** (controlling the bladder and bowels).

## Why ADLs matter

Health professionals assess ADLs to gauge how much help an older adult needs and whether they can safely live alone. Difficulty with one or more ADLs is a key signal that more support — equipment, home modifications, or care — may be needed.

A related set, **instrumental activities of daily living (IADLs)**, covers more complex tasks like cooking, managing medications and money, shopping, and using the phone or transportation.

## Supporting ADLs at home

Many ADL challenges have practical solutions: a [shower chair](/categories/shower-chairs) and [grab bars](/categories/grab-bars) for bathing, [adaptive clothing](/categories/adaptive-clothing) and [dressing aids](/categories/reachers-dressing-aids) for dressing, [adaptive utensils](/categories/adaptive-eating-aids) for eating, and a [raised toilet seat](/categories/raised-toilet-seats) for toileting. An [occupational therapist](/glossary/occupational-therapist) can assess which ADLs are difficult and recommend the right aids.` },

  { slug: 'durable-medical-equipment', term: 'Durable Medical Equipment (DME)', cat: 'walkers-rollators', related: ['weight-capacity', 'activities-of-daily-living'],
    desc: 'Durable medical equipment (DME) is reusable, medically necessary equipment prescribed for home use, such as walkers, wheelchairs, commodes, and hospital beds.',
    body: `**Durable medical equipment (DME)** is the term insurers and clinicians use for reusable medical equipment that is prescribed as medically necessary and used in the home. Common examples include [walkers and rollators](/categories/walkers-rollators), [wheelchairs](/categories/transport-wheelchairs), [bedside commodes](/categories/bedside-commodes), hospital beds, oxygen equipment, and canes.

## Why the term matters

The DME label is important because it determines insurance coverage. In the U.S., Medicare Part B typically covers 80% of approved DME when a doctor prescribes it as medically necessary and it is bought from an enrolled supplier. By contrast, items classified as home modifications or "convenience" — like grab bars, shower chairs, and raised toilet seats — usually are **not** covered by Original Medicare.

Knowing whether an item counts as DME tells you which funding source to pursue. See our guide on [how to pay for home safety equipment](/guides/paying-for-home-safety-equipment) for the full picture, including FSA/HSA, Medicaid, and VA options.` },

  { slug: 'polypharmacy', term: 'Polypharmacy', cat: 'automatic-pill-dispensers', related: ['activities-of-daily-living'],
    desc: 'Polypharmacy is the use of multiple medications at once — common in older adults and a leading cause of drug interactions and medication errors.',
    body: `**Polypharmacy** refers to taking multiple medications at the same time, often defined as five or more. It is very common in older adults, who may see several specialists and accumulate prescriptions over the years.

## Why it is a safety concern

The more medications a person takes, the higher the risk of **drug interactions**, **side effects**, and **medication errors** — especially when different doctors prescribe without seeing the full list. Aging also changes how the body processes drugs, making seniors more sensitive to their effects. Polypharmacy is linked to falls, confusion, and hospital visits.

## Managing it safely

Key steps include keeping one complete, current medication list (prescriptions, over-the-counter drugs, and supplements), using a single pharmacy so the pharmacist can catch interactions, and asking for a regular medication review to safely stop drugs that are no longer needed (called deprescribing). An organized [pill organizer or automatic pill dispenser](/categories/automatic-pill-dispensers) helps prevent missed and double doses. See our [medication safety guide](/guides/medication-safety-for-seniors).` },

  { slug: 'respite-care', term: 'Respite Care', cat: 'medical-alert-systems', related: ['aging-in-place'],
    desc: 'Respite care is short-term, temporary relief for a primary caregiver, ranging from a few hours to a longer stay, so the caregiver can rest.',
    body: `**Respite care** is short-term, temporary care that gives a family caregiver a break. It can last a few hours, a day, or a longer stretch, and the goal is simple: let the primary caregiver rest, run errands, work, or recover so they can keep caregiving sustainably.

## Forms of respite

- **Informal respite** — family or friends taking shifts.
- **In-home respite** — a paid aide who comes to the home.
- **Adult day programs** — supervised, social daytime care outside the home.
- **Short-term residential respite** — a brief stay at a care facility.

## Why it matters

Respite is one of the most important tools for preventing [caregiver burnout](/guides/caregiver-burnout-signs-and-respite). An exhausted caregiver cannot provide safe care, so regular breaks protect both people. In the U.S., the Area Agency on Aging (Eldercare Locator, 1-800-677-1116) can connect families to local respite services and any financial help, some of which is covered by Medicaid waivers or the VA.` },

  { slug: 'sundowning', term: 'Sundowning', cat: 'door-wander-alarms', related: ['wandering', 'fall-detection'],
    desc: 'Sundowning is a pattern of increased confusion, agitation, and restlessness in the late afternoon and evening seen in some people with dementia.',
    body: `**Sundowning** describes a pattern of worsening symptoms — confusion, agitation, anxiety, restlessness, or irritability — that appears in the late afternoon and evening in some people with dementia or Alzheimer's disease. The same person may be calmer in the morning and more distressed as the day winds down.

## Why it happens

There is no single cause, but contributors include a disrupted internal body clock, end-of-day fatigue, fading light and confusing shadows, unmet needs like hunger or pain, overstimulation, and poor sleep.

## Easing it

The two biggest levers are **routine** (predictable daily rhythms, demanding activities in the morning) and **light** (bright light early in the day, lamps on before dusk to remove shadows). Keeping evenings calm, limiting late caffeine, and responding with reassurance rather than correction all help. Because sundowning raises the risk of [wandering](/glossary/wandering), evening safety layers like [door alarms](/categories/door-wander-alarms) matter. See our full guide on [understanding sundowning](/guides/understanding-sundowning-in-dementia).` },

  { slug: 'pressure-ulcer', term: 'Pressure Ulcer (Bedsore)', cat: 'seat-cushions', related: ['bariatric'],
    desc: 'A pressure ulcer, or bedsore, is skin and tissue damage caused by sustained pressure, common in people who sit or lie in one position for long periods.',
    body: `A **pressure ulcer** — also called a bedsore or pressure sore — is an injury to the skin and underlying tissue caused by prolonged pressure, often combined with friction or moisture. They develop where bone is close to the skin, such as the tailbone, hips, heels, and elbows, in people who sit or lie in one position for long periods.

## Who is at risk

Seniors with limited mobility, those who use a wheelchair full-time, and people who are bedbound are most at risk, especially if they also have fragile skin, poor nutrition, or [incontinence](/glossary/incontinence).

## Prevention

The keys are **relieving and redistributing pressure** and **repositioning regularly** (often every 1-2 hours for someone bedbound). A ventilated or gel [pressure-relief cushion](/categories/seat-cushions) helps for sitting, and a pressure-redistributing mattress for lying down. Keeping skin clean and dry, eating well, and inspecting at-risk areas daily all matter. Anyone with an existing or high-risk pressure sore should be evaluated by a wound-care nurse or [occupational therapist](/glossary/occupational-therapist), who may recommend a clinical-grade alternating-pressure system.` },

  { slug: 'dysphagia', term: 'Dysphagia', cat: 'adaptive-eating-aids', related: ['activities-of-daily-living'],
    desc: 'Dysphagia is difficulty swallowing, which can make eating and drinking unsafe and raises the risk of choking and pneumonia in seniors.',
    body: `**Dysphagia** is the medical term for difficulty swallowing. It can affect any stage of swallowing — from chewing and moving food to the back of the mouth, to moving it safely down the throat and esophagus — and it becomes more common with age, stroke, Parkinson's, and dementia.

## Why it is serious

Unsafe swallowing can cause **choking** and **aspiration** (food or liquid entering the airway), which can lead to aspiration pneumonia. Dysphagia also contributes to [poor nutrition and dehydration](/guides/nutrition-and-hydration-for-seniors) when eating and drinking become difficult or frightening.

## Signs and what to do

Watch for coughing or choking during meals, a wet or gurgly voice after eating, food pocketing in the cheeks, drooling, or unexplained weight loss. Dysphagia should always be evaluated by a doctor or speech-language pathologist, who can recommend safe textures (such as thickened liquids), positioning, and techniques. Specialized [no-spill cups and adaptive utensils](/categories/adaptive-eating-aids) can also help make eating and drinking safer.` },

  { slug: 'universal-design', term: 'Universal Design', cat: 'grab-bars', related: ['ada-compliant', 'aging-in-place'],
    desc: 'Universal design is the practice of designing homes and products to be usable by people of all ages and abilities, without the need for adaptation.',
    body: `**Universal design** is the approach of creating homes, spaces, and products that are usable by as many people as possible — regardless of age, size, or ability — without needing special adaptation. In a home, it means features that work for a young family, a person using a wheelchair, and an aging adult alike.

## Examples in the home

- **No-step (zero-threshold) entries** and wide doorways and hallways
- **Lever door handles and faucets** instead of knobs (easier for arthritic hands)
- **Curbless, roll-in showers** with built-in seating and [grab bars](/categories/grab-bars)
- **Rocker light switches** and good, even lighting
- **Counters and storage at reachable heights**

## Why it matters for aging in place

Universal design makes a home naturally safer and more accessible as needs change, supporting [aging in place](/glossary/aging-in-place) without obvious "medical" modifications. It overlaps with — but is broader than — [ADA-compliant](/glossary/ada-compliant) design, which refers to specific public-accessibility standards. Building or remodeling with universal-design principles means the home adapts to the person over time, rather than the other way around.` },

  { slug: 'orthostatic-hypotension', term: 'Orthostatic Hypotension', cat: 'canes', related: ['fall-detection'],
    desc: 'Orthostatic hypotension is a drop in blood pressure when standing up that causes dizziness or lightheadedness — a common, treatable cause of falls in seniors.',
    body: `**Orthostatic hypotension** (also called postural hypotension) is a sudden drop in blood pressure that happens when a person stands up from sitting or lying down. It causes brief dizziness, lightheadedness, blurred vision, or unsteadiness — and in seniors it is a common, often overlooked cause of falls.

## Why it happens

With age, the body's blood-pressure reflexes slow down. Dehydration, certain medications (especially blood-pressure drugs and diuretics), prolonged bed rest, and some medical conditions can all trigger or worsen it.

## Managing it to prevent falls

Practical steps include **standing up slowly** — sit on the edge of the bed for a moment, then rise gradually — staying [well hydrated](/guides/nutrition-and-hydration-for-seniors), and having a stable handhold like a [grab bar](/categories/grab-bars), [bed rail](/categories/bed-rails), or [cane](/categories/canes) nearby when getting up. Because it is often medication-related, anyone with frequent dizziness on standing should have their medications reviewed by a doctor. Addressing it is an important part of [fall prevention](/guides/fall-prevention-guide-seniors-home).` },

  { slug: 'incontinence', term: 'Incontinence', cat: 'incontinence-bed-protection', related: ['pressure-ulcer', 'activities-of-daily-living'],
    desc: 'Incontinence is the loss of bladder or bowel control, a common and manageable condition in older adults that affects dignity, skin health, and sleep.',
    body: `**Incontinence** is the involuntary loss of bladder (urinary) or bowel (fecal) control. It is common in older adults — though not an inevitable or untreatable part of aging — and ranges from occasional leaks to a complete loss of control.

## Why it matters beyond the obvious

Beyond comfort and dignity, incontinence affects health and safety: it can lead to skin irritation and [pressure sores](/glossary/pressure-ulcer), disrupted sleep, and rushed nighttime trips to the bathroom that raise [fall risk](/guides/fall-prevention-guide-seniors-home). It is also a frequent reason families consider more care.

## Managing it at home

Many causes are treatable, so it is worth a medical evaluation — infections, medications, and other conditions can all contribute. For day-to-day management, layered protection keeps things clean and dignified: a waterproof mattress protector under the sheet plus washable [reusable bed pads](/categories/incontinence-bed-protection) on top, [chair pads](/categories/incontinence-bed-protection) for seating, and a [bedside commode](/categories/bedside-commodes) or [raised toilet seat](/categories/raised-toilet-seats) to make toileting easier and safer. Good lighting on the path to the bathroom helps prevent nighttime falls.` },
];

let n = 0;
for (const it of items) {
  const term = it.term.replace(/ \(.*\)$/, '');
  const fm = `---
title: ${JSON.stringify(it.term)}
term: ${JSON.stringify(term)}
slug: "${it.slug}"
description: ${JSON.stringify(it.desc)}
datePublished: "${date}"
dateUpdated: "${date}"
type: "glossary"
category: "${it.cat}"
relatedTerms:
${it.related.map((r) => '  - ' + r).join('\n')}
---

${it.body}
`;
  fs.writeFileSync('content/glossary/' + it.slug + '.mdx', fm);
  n++;
}
console.log('wrote', n, 'glossary terms; total now:', fs.readdirSync('content/glossary').filter((f) => f.endsWith('.mdx')).length);
