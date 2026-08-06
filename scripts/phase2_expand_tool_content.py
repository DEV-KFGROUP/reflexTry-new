#!/usr/bin/env python3
"""Phase 2: expand thin toolContent entries with unique editorial copy."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "lib" / "tool-content.ts"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def desc(sections: list[tuple[str, str]]) -> str:
    lines = ["        description: ["]
    for title, content in sections:
        lines.append(f'            {{ title: "{esc(title)}", content: "{esc(content)}" }},')
    lines.append("        ],")
    return "\n".join(lines)


def howto_steps(sections: list[tuple[str, list[str]]]) -> str:
    lines = ["        howToUse: ["]
    for title, steps in sections:
        step_strs = ", ".join(f'"{esc(s)}"' for s in steps)
        lines.append(f'            {{ title: "{esc(title)}", steps: [{step_strs}] }},')
    lines.append("        ],")
    return "\n".join(lines)


def howto_content(sections: list[tuple[str, str]]) -> str:
    lines = ["        howToUse: ["]
    for title, content in sections:
        lines.append(f'            {{ title: "{esc(title)}", content: "{esc(content)}" }},')
    lines.append("        ],")
    return "\n".join(lines)


def improve(sections: list[tuple[str, str]]) -> str:
    lines = ["        howToImprove: ["]
    for title, content in sections:
        lines.append(f'            {{ title: "{esc(title)}", content: "{esc(content)}" }},')
    lines.append("        ],")
    return "\n".join(lines)


def faqs(items: list[tuple[str, str]]) -> str:
    lines = ["        faqs: ["]
    for q, a in items:
        lines.append(f'            {{ question: "{esc(q)}", answer: "{esc(a)}" }},')
    lines.append("        ]")
    return "\n".join(lines)


def pack(
    d: list[tuple[str, str]],
    use: list,
    imp: list[tuple[str, str]],
    faq: list[tuple[str, str]],
    use_steps: bool = True,
) -> str:
    use_block = howto_steps(use) if use_steps else howto_content(use)
    return "\n".join([desc(d), use_block, improve(imp), faqs(faq)])


TOOLS: dict[str, str] = {}

TOOLS["chimp-test"] = pack(
    [
        ("About the Chimp Test", "The Chimp Test is a visuospatial working-memory challenge inspired by ape cognition studies. Numbers appear on a grid; after you tap 1, the rest hide and you must tap the blank cells in ascending order from memory."),
        ("What It Measures", "Success depends on encoding spatial positions quickly, holding them after numbers vanish, and retrieving them without relying on leftover visual cues. Typical comfortable spans for adults often sit around 5–7 items; larger spans need strong chunking."),
        ("How a Round Works", "A set of numbered cells appears. Memorize locations. Tap 1 to begin recall—remaining digits hide. Tap the empty cells in order 2, 3, 4… A wrong cell costs a life (depending on difficulty)."),
        ("Difficulty Modes", "Easier modes use fewer numbers, slower vanish timing, and more lives. Harder modes enlarge the grid, hide numbers faster, and leave less forgiveness. Professional play is about encoding under time pressure, not casual browsing."),
        ("Strategies That Help", "Group numbers into shapes (triangle, L, diagonal). Rehearse a short path aloud. Do not stare at one cell—scan the whole set once, then lock a spatial story."),
        ("Score Meaning", "Higher completed span (how many numbers you cleared) is better. Compare yourself across the same difficulty only—grid size changes the task."),
    ],
    [
        ("Setup", ["Choose difficulty.", "Click Start / Initialize.", "Scan all numbered cells before tapping 1."]),
        ("Recall", ["Tap 1 to hide the remaining numbers.", "Tap blank cells in ascending order.", "Recover calmly after a miss if lives remain."]),
        ("Session Habits", ["Stop after 10–15 focused minutes.", "Note your best span per difficulty in Statistics."]),
    ],
    [
        ("Chunk Into Shapes", "Treat 4–5 positions as one geometric figure instead of isolated coordinates."),
        ("One Clean Encoding Pass", "A single deliberate scan beats frantic re-looking while the clock eats your window."),
        ("Expand Span Gradually", "Stay on a difficulty until you clear it consistently, then step up."),
        ("Protect Sleep and Focus", "Working memory collapses when you are tired or multitasking."),
    ],
    [
        ("What is a typical score?", "Many adults clear about 5–7 on moderate settings; higher needs practice and chunking."),
        ("Why do numbers hide?", "So you cannot search visually and must use working memory."),
        ("Are chimpanzees better at this?", "In famous lab demos, young chimps often outperformed humans on similar rapid spatial recall tasks."),
        ("How many lives do I get?", "Easier modes usually allow more mistakes; Hard/Professional often allow one."),
        ("Does grid size matter?", "Yes—larger grids increase distance and load on spatial mapping."),
        ("Can I improve?", "Yes. Strategy plus short daily practice reliably raises span for most people."),
        ("Is this an IQ test?", "No. It samples visuospatial working memory under game rules."),
        ("Should I go fast or accurate?", "Accurate encoding first; rushing causes early miss cascades."),
        ("What is chunking?", "Grouping items so you remember fewer higher-level units."),
        ("When should I stop a session?", "When errors spike from fatigue—quality beats grinding."),
    ],
)

TOOLS["verbal-memory"] = pack(
    [
        ("About Verbal Memory", "Verbal Memory tests recognition of words across a continuous stream. Each word is either new in the session or a repeat. You must judge SEEN vs NEW without a word list to review."),
        ("Cognitive Demand", "You update a growing set of encountered words, resist proactive interference, and decide under time pressure on harder modes. That stresses verbal working memory and familiarity monitoring."),
        ("How Gameplay Works", "Words appear one at a time. Tap SEEN if it already appeared this run; tap NEW otherwise. Strikes accumulate on mistakes until the run ends."),
        ("Difficulty Changes", "Harder modes enlarge the word bank (repeats are rarer and easier to miss), tighten timing, and reduce allowed strikes. Visually similar words increase false familiarity."),
        ("What Scores Mean", "Higher words survived before strike-out is better. Compare runs on the same difficulty. Late-game confusion is normal as interference builds."),
        ("Real-World Link", "Similar skills support reading comprehension, following conversations, and noticing when information is truly new versus repeated."),
    ],
    [
        ("Start", ["Pick difficulty.", "Initialize the test.", "Read each word fully before deciding."]),
        ("Decide", ["Tap NEW on first encounter.", "Tap SEEN on repeats.", "Keep a steady rhythm—panic taps cause motor errors."]),
        ("End of Run", ["Review how far you got.", "Retry after a short break if interference fried your set."]),
    ],
    [
        ("Phonological Rehearsal", "Mouth or whisper words to strengthen encoding."),
        ("Quick Story Links", "Attach new words to a tiny ongoing story so repeats feel familiar."),
        ("Watch Lookalikes", "On hard banks, distinguish similar spellings deliberately."),
        ("Pace Over Panic", "Accuracy early prevents strike-outs that wipe long runs."),
    ],
    [
        ("What is a good score?", "Around 40–50 words on Normal is a common comfortable range; elite runs go higher."),
        ("Do harder modes change the dictionary?", "Yes—larger banks and tougher timing."),
        ("Is there a time limit per word?", "On Professional, yes—hesitation can cost you."),
        ("Why do I fail late even when focused?", "Proactive interference: old words crowd new decisions."),
        ("How many strikes?", "Often 3 on easier modes and 1 on Hard/Pro—check the live UI."),
        ("Does reading help long-term?", "Broad reading grows vocabulary and verbal familiarity skills."),
        ("Is this the same as sequence memory?", "No—this is linguistic recognition, not spatial sequence recall."),
        ("Do word lists repeat across days?", "Pools are large and shuffled; identical full runs are unlikely."),
        ("Should I say words aloud?", "Quiet rehearsal helps; avoid disturbing others."),
        ("What if I mis-tap?", "Motor errors count—slow the decision loop slightly."),
    ],
)

TOOLS["time-perception"] = pack(
    [
        ("About Time Perception", "This test measures how accurately you can produce a target interval (for example 5 seconds) using only your internal sense of time—no on-screen countdown while you hold."),
        ("What It Measures", "Time production depends on attention, arousal, and your internal clock. Stress and distraction commonly make people release early; boredom can stretch subjective time."),
        ("How a Trial Works", "Read the target duration. Press and hold. Release when you believe the interval has elapsed. Score is absolute error in milliseconds—lower is better."),
        ("Difficulty", "Harder modes demand tighter error margins and may add visual distractors that warp attention away from timing."),
        ("Interpreting Results", "Average people often miss by roughly 10–20% on uncued intervals. Track average error across rounds, not a single lucky trial."),
        ("Training Use", "Useful for musicians, athletes, streamers, and anyone who needs better interval feel—pair it with real metronome practice for music."),
    ],
    [
        ("Begin", ["Select difficulty.", "Start the test.", "Note the target time carefully."]),
        ("Produce the Interval", ["Press and hold.", "Release at the felt target time.", "Do not watch a phone stopwatch."]),
        ("Review", ["Check error in ms.", "Average across rounds for your session score."]),
    ],
    [
        ("Count a Steady Cadence", "Use a consistent 1-and-2-and mental beat rather than rushing the last second."),
        ("Body Metronome", "A light foot tap at ~1 Hz stabilizes longer intervals."),
        ("Lower Arousal", "Breathing down reduces early releases from impatience."),
        ("Ignore Flashy Distractors", "On hard modes, treat visuals as noise; protect the count."),
    ],
    [
        ("Is lower score better?", "Yes—score is timing error in milliseconds."),
        ("Why do I always finish early?", "High arousal and impatience compress subjective time."),
        ("Can adrenaline change results?", "Yes—stress alters time felt versus clock time."),
        ("Is this used in research?", "Time production/estimation tasks are standard in cognitive neuroscience."),
        ("May I use an external timer?", "No—that defeats the measurement."),
        ("How many rounds?", "Typically a short set averaged together—see the live UI."),
        ("What is Professional mode?", "Tighter tolerance plus distractions."),
        ("Does caffeine affect timing?", "It can, via arousal—keep conditions consistent when comparing days."),
        ("Should I train daily?", "Brief daily runs beat occasional long sessions."),
        ("What is a solid beginner goal?", "Stay within about 10% of the target on Normal."),
    ],
)

TOOLS["n-back"] = pack(
    [
        ("About N-Back", "N-Back is a continuous working-memory updating task. Letters appear in a stream; you respond when the current letter matches the one from N steps earlier."),
        ("What N Means", "1-back: match the previous letter. 2-back: match the letter two trials ago. 3-back: three ago. Higher N forces a longer rolling buffer under time pressure."),
        ("Errors That Matter", "Misses (no response on a true match) and false alarms (responding on a non-match) both hurt. Lives or accuracy metrics track both."),
        ("Difficulty Mapping", "Beginner/Easy typically use 1-back. Normal/Hard use 2-back. Professional uses 3-back with faster timing and fewer lives."),
        ("Why People Train It", "It stresses monitoring, updating, and interference control—core working-memory operations studied for decades."),
        ("Honest Transfer", "Expect better N-Back performance with practice. Broad IQ claims are debated; treat this as targeted working-memory exercise."),
    ],
    [
        ("Start", ["Select difficulty (this sets N).", "Initialize.", "Note whether you are on 1-, 2-, or 3-back."]),
        ("Play", ["Watch each letter.", "Press Match / Space only on true N-back matches.", "Withhold on non-matches."]),
        ("Recover", ["After a false alarm, reset your mental buffer.", "Do not mash Match out of panic."]),
    ],
    [
        ("Rehearse the Buffer", "Silently repeat the last N letters as a sliding window."),
        ("Decide Late, Not Early", "Wait until identity is clear to cut false alarms."),
        ("Stability Over Speed", "Smooth accuracy beats spiky high-hit / high-false-alarm play."),
        ("Short Sessions", "12 focused minutes beats an hour of depleted guessing."),
    ],
    [
        ("What is a good score?", "Higher correct hits with strong accuracy %. Hits alone can hide reckless false alarms."),
        ("What does 2-back mean?", "Respond when the current letter equals the one from two trials ago."),
        ("Keyboard support?", "Spacebar typically triggers Match during the stimulus window."),
        ("What costs a life?", "Missed matches and false alarms."),
        ("How fast are stimuli?", "Roughly ~1.5s on easier modes and ~1s on Hard/Pro."),
        ("Letter set size?", "A small set (e.g., A–H) keeps match rates trainable."),
        ("Is this dual n-back?", "No—this build is single-stream letters."),
        ("Does practice help?", "Yes for task performance; keep claims about far transfer modest."),
        ("When does a run end?", "After the trial budget or when lives hit zero."),
        ("Why do I false-alarm late?", "Fatigue and over-eager matching—slow the trigger finger."),
    ],
)

TOOLS["go-no-go"] = pack(
    [
        ("About Go/No-Go", "Go/No-Go measures response inhibition: press quickly on Go cues and withhold on No-Go cues. An ~80% Go rate builds a press habit so No-Go trials become the real challenge."),
        ("What It Measures", "Speeded motor readiness plus inhibitory control—the ability to cancel a prepared action when the cue says stop."),
        ("Trial Anatomy", "Green (Go): press Space/tap ASAP. Red (No-Go): do nothing. Misses and false alarms both reduce score."),
        ("Difficulty", "Harder modes add trials and shorten stimulus windows / gaps so decisions stack rapidly."),
        ("Score Reading", "Count correct trials (Go hits + successful withholds). Also watch Go reaction time—fast but reckless play spikes false alarms."),
        ("Where It Shows Up", "Impulse control under speed pressure matters in driving, sports, and fast UI work—this is a lab-style drill, not a full clinical battery."),
    ],
    [
        ("Setup", ["Choose difficulty.", "Initialize.", "Rest a finger near Space without pressing."]),
        ("Respond", ["Press on green.", "Freeze on red.", "Prefer a clean withhold over a risky mash."]),
        ("Review", ["Check false-alarm count.", "If high, bias slightly more cautious on the next run."]),
    ],
    [
        ("Ready, Not Tense", "Pre-position the finger; tension causes premature presses."),
        ("Value Withholds", "On ambiguous color flashes, not pressing is often safer."),
        ("Rhythm Awareness", "After long Go streaks, expect a No-Go—reset urgency."),
        ("Short Quality Sets", "Inhibition fatigues; stop when false alarms climb."),
    ],
    [
        ("How is score calculated?", "Correct Go hits plus correct No-Go withholds."),
        ("What is a false alarm?", "Pressing on a No-Go (red) trial."),
        ("What is a miss?", "Failing to press during a Go window."),
        ("Why mostly Go trials?", "To build a prepotent response so inhibition is tested."),
        ("Is RT shown?", "Yes for successful Go hits."),
        ("Keyboard?", "Spacebar is supported."),
        ("Trial counts?", "About 20 on Beginner up to ~40 on Professional."),
        ("Used in research?", "Yes—classic executive-function paradigm."),
        ("What hurts most?", "False alarms on No-Go and misses on Go."),
        ("Hard mode tip?", "Commit to color fast; hesitation and impulsivity both rise when windows shrink."),
    ],
)

TOOLS["flanker"] = pack(
    [
        ("About the Flanker Task", "The Eriksen Flanker task measures selective attention under conflict. You respond to a center arrow while ignoring flanking arrows that may point the other way."),
        ("Congruent vs Incongruent", "Congruent: all arrows agree. Incongruent: flankers oppose the center, creating response competition you must inhibit."),
        ("How to Respond", "Read only the center arrow. Press Left/Right (arrows or A/D). Timeouts and wrong directions cost lives."),
        ("Difficulty", "Harder modes raise incongruent rate, shorten deadlines, and reduce lives."),
        ("Metrics", "Track correct responses and average RT on corrects. Fast incongruent RTs with high accuracy indicate strong conflict control."),
        ("Not Stroop", "Flanker is arrow/spatial conflict. Stroop is color-word conflict. Related family, different conflict type."),
    ],
    [
        ("Start", ["Select difficulty.", "Initialize.", "Place fingers on Left/Right controls."]),
        ("Respond", ["Fixate the center character.", "Ignore flankers.", "Press the center direction only."]),
        ("After Errors", ["Reset fixation to center.", "Do not let the previous flanker direction bias the next trial."]),
    ],
    [
        ("Tunnel on Center", "Decide before peripheral arrows dominate."),
        ("Do Not Vote With the Majority", "On incongruent trials the crowd of flankers is the trap."),
        ("Stable Gaze", "Micro-scanning the whole string slows you and invites flanker capture."),
        ("Accuracy First", "Clean center decisions beat reckless speed."),
    ],
    [
        ("What is congruent?", "All arrows point the same way."),
        ("What is incongruent?", "Flankers point opposite the center."),
        ("How is score counted?", "Number of correct center responses."),
        ("Average RT?", "Shown for correct responses."),
        ("A/D keys?", "Yes, along with arrow keys."),
        ("Timeouts?", "Count as misses and cost a life."),
        ("Why incongruent feels harder?", "Competing response activation must be inhibited."),
        ("Is this Stroop?", "No—different conflict dimension."),
        ("Trial count?", "About 20–40 depending on difficulty."),
        ("Best tactic?", "Fixate center, decide, then move."),
    ],
)

TOOLS["choice-reaction"] = pack(
    [
        ("About Choice Reaction Time", "Choice RT measures how quickly you select the correct option among multiple alternatives after a stimulus appears—closer to multi-button real life than simple one-button RT."),
        ("Task Flow", "Several boxes wait. After a random delay, one lights. Click only that box. Early clicks and wrong boxes are errors."),
        ("Why Random Delays", "Random foreperiods stop pure anticipation so you measure decision-plus-motor latency, not prediction."),
        ("Difficulty", "Beginner uses fewer choices; harder modes add boxes, tighten timing, and may show decoy highlights on Professional."),
        ("Score Meaning", "Average RT in ms on correct hits—lower is better. Best RT stores your best average for that difficulty."),
        ("Training Tip", "Hover readiness without twitching. Choice errors explode when you guess early."),
    ],
    [
        ("Start", ["Pick difficulty.", "Initialize.", "Eyes on the full set of boxes."]),
        ("Respond", ["Wait for a true light.", "Click only the lit target.", "Never click during the wait phase."]),
        ("Pro Mode", ["Ignore faint decoy colors.", "Only the bright target counts."]),
    ],
    [
        ("Hands Ready", "Keep the pointer near the grid without pressing."),
        ("Suppress Anticipation", "If you feel a countdown in your head, reset—waits are random."),
        ("Decoy Discipline", "On Professional, dim lights are traps."),
        ("Compare Like-for-Like", "Only compare averages within the same number of choices."),
    ],
    [
        ("Is lower better?", "Yes—average RT in milliseconds."),
        ("What is Best RT?", "Your best (lowest) average for that difficulty."),
        ("What is an error?", "Clicking early or clicking the wrong box."),
        ("Do errors enter the average?", "Usually only correct hits contribute RT samples."),
        ("Attempts per run?", "About 8 on Beginner up to ~20 on Professional."),
        ("Box counts?", "2 on Beginner/Easy, 3 on Normal, 4 on Hard/Pro."),
        ("Keyboard?", "This mode is primarily click/tap on boxes."),
        ("Why random waits?", "To block anticipation cheating."),
        ("New Record meaning?", "Your average beat the stored best (or first score)."),
        ("What are decoys?", "Faint non-target lights on Professional."),
    ],
)

TOOLS["schulte-table"] = pack(
    [
        ("About Schulte Tables", "Schulte Tables are shuffled number grids you clear in order as fast as possible. They train visual search, peripheral awareness, and attention shifting used historically in speed-reading practice."),
        ("How It Works", "Click numbers in ascending order (or descending on Hard). The timer runs until the grid is finished. Wrong clicks flash; keep going for the correct target."),
        ("Grid Sizes", "Beginner 3×3, Easy 4×4, Normal 5×5, Hard 5×5 reverse, Professional 7×7 (1–49)."),
        ("What Improves", "Faster clears usually mean wider useful field of view and less tunnel scanning. Soft focus on the center beats row-by-row reading."),
        ("Score", "Completion time in ms—lower is better. Store bests per difficulty."),
        ("Training Advice", "Prefer several clean clears over one panicked Professional attempt."),
    ],
    [
        ("Start", ["Select difficulty.", "Initialize.", "Note whether you count up or down."]),
        ("Clear the Grid", ["Use the on-screen Target hint.", "Click the next required number.", "Ignore wrong-click flashes and continue."]),
        ("Finish", ["Timer stops when the last number is hit.", "Compare to your best time."]),
    ],
    [
        ("Soft Center Focus", "Look near the middle; let periphery locate the next digit."),
        ("Avoid Line Scanning", "Do not read like a book—jump attention across the table."),
        ("Breathe Between Finds", "Micro-pauses reduce frantic misses that waste time."),
        ("Master 5×5 Before 7×7", "Professional grids punish poor search habits."),
    ],
    [
        ("Is lower time better?", "Yes."),
        ("What is Hard mode?", "5×5 counted downward."),
        ("Professional size?", "7×7 (1–49)."),
        ("Do wrong clicks end the run?", "No—flash and continue."),
        ("When does the timer start?", "When the grid appears after start."),
        ("How is Best saved?", "When finish time beats the stored best."),
        ("Speed-reading link?", "Traditionally used to widen visual span."),
        ("Can I pause?", "No mid-run pause."),
        ("Why reshuffle?", "Stops memorizing positions across attempts."),
        ("What is Target?", "The next number you must click."),
    ],
)

TOOLS["object-tracking"] = pack(
    [
        ("About Multiple Object Tracking", "Multiple Object Tracking (MOT) asks you to follow several target dots among identical distractors while they move, then select the targets when motion stops."),
        ("Attentional Demand", "You maintain an attentional set, survive path crossings without identity swaps, and resist distractors that pass nearby."),
        ("Round Structure", "Targets flash, all dots move, then you click the original targets. Crowding and crossings create most errors."),
        ("Difficulty", "More targets, higher speed, shorter mark time, and denser fields increase load."),
        ("Use Cases", "Sports vision, driving awareness drills, and esports situational attention—transfer still needs real-task practice."),
        ("Scoring Mindset", "Prioritize percent of targets recovered before raising set size."),
    ],
    [
        ("Mark", ["Memorize flashing targets.", "Do not look away during highlights."]),
        ("Track", ["Soft-focus the group centroid.", "Re-acquire after crossings."]),
        ("Select", ["Click each remembered target.", "Avoid nearby distractors."]),
    ],
    [
        ("Soft Focus", "Peripheral motion sensing beats darting gaze."),
        ("Crossing Protocol", "Expect swaps; re-lock using continuity of motion."),
        ("Small Sets First", "Win at 2–3 targets before adding more."),
        ("Stop When Guessing", "Fatigue destroys MOT accuracy."),
    ],
    [
        ("Beginner target count?", "Start with 2–3."),
        ("Why crossings hurt?", "Identity swaps between target and distractor."),
        ("Stare at one dot?", "No—you will lose the set."),
        ("Driving transfer?", "Related attention skill; not a substitute for driving practice."),
        ("Session length?", "5–12 quality minutes."),
        ("Why identical dots?", "Forces attention tracking, not feature shortcuts."),
        ("Faster always better?", "Only with maintained accuracy."),
        ("Aim trainer vs MOT?", "Aim is motor pursuit; MOT is attentional set."),
        ("Improvement signal?", "Same accuracy at harder settings, or higher recovery at same settings."),
        ("Pause mid-motion?", "Treat trials as continuous."),
    ],
)

TOOLS["color-blindness"] = pack(
    [
        ("About This Color Vision Check", "Ishihara-style plates hide a number inside a field of colored dots. Typical red-green vision usually reads the number; red-green deficiency may see another figure or none."),
        ("What It Screens", "Primarily red-green (protan/deutan) patterns. It is weaker for blue-yellow (tritan) issues and is not a full clinic battery."),
        ("Difficulty", "Easier modes raise contrast; Hard/Professional shrink hue differences. Harder is not automatically a diagnosis."),
        ("Critical Limits", "Not medical advice. Night Light, brightness, panel type, and room lighting change results. Occupational needs require certified testing."),
        ("Who Uses It", "Curiosity, accessibility empathy for designers, and informal self-checks before seeking professional testing."),
        ("Reading Results", "Look for consistent misses on red-green style plates across good lighting—not a single Professional miss."),
    ],
    [
        ("Prepare", ["Disable blue-light filters.", "Raise brightness.", "Avoid tinted lenses."]),
        ("Test", ["Pick difficulty.", "Initialize.", "Enter the number you see."]),
        ("If Blank", ["Skip rather than random-guess if you want meaningful accuracy.", "Retest on another calibrated display if surprised."]),
    ],
    [
        ("Same Device Comparisons", "Only compare sessions with matched display settings."),
        ("Daylight Retest", "Warm night themes distort hues."),
        ("Accessibility Takeaway", "If red-green is hard, prefer UI that is not color-only."),
        ("See a Professional When Needed", "Jobs and licenses may require clinic tests."),
    ],
    [
        ("Medical diagnosis?", "No—educational screening only."),
        ("Deficiency type?", "Mainly red-green patterns."),
        ("Phone vs laptop mismatch?", "Different panels/color management."),
        ("Blue-light filter impact?", "Yes—turn off for testing."),
        ("Mild deficiency still sees some plates?", "Common on high-contrast plates."),
        ("Kids?", "OK for learning; confirm clinically if concerned."),
        ("Can practice cure colorblindness?", "No."),
        ("Designers rely on this alone?", "No—use contrast tools and simulations too."),
        ("Worried about results?", "Book a professional color vision exam."),
        ("Skip allowed?", "Yes when no figure is visible."),
    ],
)

TOOLS["mental-rotation"] = pack(
    [
        ("About Mental Rotation", "Decide whether two 3D block figures are the same object at different angles or mirror images that cannot match by rotation."),
        ("What It Measures", "Spatial visualization and the cost of mentally transforming 3D structure—classic Shepard–Metzler style cognition."),
        ("Trial Logic", "Choose Same if a rigid rotation aligns them; Different if one is a mirror (enantiomorph)."),
        ("Difficulty", "Larger angles, complex shapes, and tighter timers increase load—especially depth rotations."),
        ("Improvement Pattern", "Fewer mirror confusions and more stable RTs, not overnight IQ jumps."),
        ("Where It Helps", "Geometry, engineering sketching, design, and games that need imagined layouts."),
    ],
    [
        ("Start", ["Select difficulty.", "Initialize.", "Compare both figures before answering."]),
        ("Judge", ["Pick a landmark arm.", "Imagine rotating it into place.", "If only a mirror works, choose Different."]),
        ("Under Time", ["Avoid panic Same taps.", "Re-check one joint correspondence when unsure."]),
    ],
    [
        ("Landmark Tracking", "Rotate one feature, not the whole cloud at once."),
        ("Chirality Check", "Rotations preserve handedness; mirrors do not."),
        ("Depth Practice", "Spend sessions on into-depth turns—they are harder than picture-plane spins."),
        ("Quiet Environment", "Spatial working memory hates dual-task chatter."),
    ],
    [
        ("Same means?", "Identical up to 3D rotation."),
        ("Different means?", "Mirror or otherwise non-rotatable match."),
        ("IQ test?", "No—spatial skill sample."),
        ("Practice helps?", "Yes, especially mirror-error reduction."),
        ("Why depth is harder?", "Hidden structure and foreshortening load memory."),
        ("Speed or accuracy?", "Accuracy first."),
        ("Shepard–Metzler family?", "Yes."),
        ("Training dose?", "10–15 minutes, a few times weekly."),
        ("Glance identical?", "Force a landmark check anyway."),
        ("Handedness effects?", "Mixed in research; strategy matters more."),
    ],
)

TOOLS["multi-stimulus"] = pack(
    [
        ("About Multi-Stimulus Reaction", "Four options appear with a changing rule (color, uniqueness, or position). You must parse the instruction, pick the correct target, and click fast—selective attention plus decision RT."),
        ("Vs Simple Reaction", "Simple RT is one stimulus, one response. Here you filter distractors and apply a rule under time pressure."),
        ("Instruction Types", "Examples include click a named color, click the odd one out, or click a positional target. Rules change across rounds."),
        ("Scoring", "Accuracy first, then average RT on corrects. Fast wrong clicks are poor training."),
        ("Difficulty Feel", "Shorter reading time and more similar distractors raise load."),
        ("Applications", "Driving glances, UI work, and games that need rule-flexible attention."),
    ],
    [
        ("Start", ["Begin the run.", "Read the instruction before moving."]),
        ("Decide", ["Map the rule to a box.", "Click once with intent.", "Prepare for the next rule change."]),
        ("Finish", ["Review accuracy and average RT.", "Retry focusing on instruction reading if errors dominate."]),
    ],
    [
        ("Read Fully", "Half-read rules cause confident wrong clicks."),
        ("Accuracy Before Speed", "Speed follows clean decisions."),
        ("Quiet Setup", "External distraction destroys rule switching."),
        ("Name the Rule Aloud", "A one-word label (GREEN / ODD / LEFT) stabilizes the mapping."),
    ],
    [
        ("Good RT range?", "Often ~400–600ms with solid accuracy; sub-350ms is strong if accurate."),
        ("Vs simple RT?", "Adds decision and filtering cost."),
        ("Gaming benefit?", "Helps rule-flexible attention under clutter."),
        ("Priority metric?", "Accuracy, then RT."),
        ("Why instructions change?", "To train flexible control, not one memorized mapping."),
        ("Miss budget?", "Limited errors may end a run early—see UI."),
        ("Touch vs mouse?", "Use whatever you play on; compare within device."),
        ("Practice length?", "10–15 minutes daily."),
        ("Colorblind players?", "Positional/oddity rounds still work; color rounds may be harder."),
        ("Improve stuck RT?", "Cut errors first—noise inflates averages."),
    ],
)

TOOLS["sequence-reaction"] = pack(
    [
        ("About Sequence Reaction", "Watch a sequence of lit colors, then reproduce it quickly in order. It combines working-memory encoding with speeded motor output."),
        ("Dual Demand", "Remembering order is not enough—you must also execute the chain rapidly without transposition errors."),
        ("Progression", "Sequences lengthen across rounds. Early accuracy compounds; one swap can end a streak."),
        ("Scoring", "Longer correct sequences and clean execution speed matter. Do not sacrifice order for reckless clicking."),
        ("Skill Transfer", "Helps with multi-step procedures, music-like serial order, and game combos—still practice the real skill separately."),
        ("Common Failures", "Transpositions (swapping two colors) and rushing the first taps after encoding."),
    ],
    [
        ("Watch", ["Start the round.", "Attend to each light in order.", "Rehearse the chain silently."]),
        ("Replay", ["Click colors in the same order.", "Prefer correct order over smash speed."]),
        ("Advance", ["Longer sequences appear after successes.", "Reset composure after a miss."]),
    ],
    [
        ("Chunk Colors", "Group as red-red-blue rather than six isolated steps."),
        ("Encode Then Fire", "Do not start clicking while still unsure of item 1."),
        ("Rhythm Replay", "A steady tap rhythm reduces swaps."),
        ("Daily Short Drills", "Serial memory consolidates with repetition."),
    ],
    [
        ("Good length?", "Many people hold 5–7; practice can push higher."),
        ("Memory or speed first?", "Memory accuracy first."),
        ("Why swaps happen?", "Weak encoding or rushed motor output."),
        ("Chunking help?", "Yes—fewer units to store."),
        ("Same as sequence memory?", "Related, but emphasizes speeded reproduction."),
        ("Session length?", "10–15 minutes."),
        ("After a miss?", "Rebuild with a clean shorter chain mindset."),
        ("Audio cues?", "If present, use them; otherwise rely on vision + rehearsal."),
        ("Compare scores how?", "Same difficulty and input device."),
        ("Plateau fix?", "Slow the replay by 10% to cut transpositions."),
    ],
)

TOOLS["pattern-matching"] = pack(
    [
        ("About Pattern Matching", "A pattern flashes briefly; you must pick the identical match among similar foils. It trains visual encoding speed and fine discrimination."),
        ("What Is Hard", "Foils differ by small shifts. Brief display times punish lazy global glances."),
        ("Flow", "Study flash → options appear → select the exact match → patterns grow more complex / shorter displays."),
        ("Metrics", "Accuracy percentage is primary; speed is secondary. Guessing tanks learning."),
        ("Applications", "QA visual checks, design critique, security image review, and detail-oriented study."),
        ("Limitation", "This is a game drill, not a clinical vision exam."),
    ],
    [
        ("Encode", ["Start.", "Study the flash carefully.", "Note distinctive local features."]),
        ("Choose", ["Compare options systematically.", "Reject near-miss foils.", "Confirm before tapping."]),
        ("Progress", ["Expect shorter flashes later.", "Keep accuracy above ego speed."]),
    ],
    [
        ("Feature Checklist", "Corners, gaps, counts—pick 2–3 anchors during the flash."),
        ("Systematic Compare", "Scan options position-by-position, not by vibe."),
        ("Protect Encoding Time", "Blink after the flash, not during."),
        ("Daily Precision Work", "Short accurate sessions beat long sloppy ones."),
    ],
    [
        ("Good accuracy?", "Aim 80–90%+; chase speed only after that."),
        ("Why harder later?", "To keep discrimination challenging as you improve."),
        ("Speed vs precision?", "Precision first."),
        ("All options look alike?", "Find one differing cell/edge."),
        ("Vision issues?", "Increase display brightness; see an eye doctor for real concerns."),
        ("Session length?", "~10 minutes."),
        ("Touch precision?", "Zoom browser if taps feel clumsy."),
        ("Improve encoding?", "Name a tiny feature aloud during the flash."),
        ("Foils purpose?", "Force detail checks, not silhouette matching."),
        ("Compare runs?", "Same difficulty and screen size."),
    ],
)

TOOLS["precision-click"] = pack(
    [
        ("About Precision Click", "Small targets appear briefly; you must click them accurately. It measures pointer control, visual acquisition, and click discipline."),
        ("Speed–Accuracy Tradeoff", "Raw CPS means little if misses explode. High accuracy with solid pace is the training goal."),
        ("Flow", "Targets spawn → click before timeout → targets shrink as you score → session clock ends the run."),
        ("Metrics", "Hits, accuracy (hits vs misses), and clicks/sec. Track all three."),
        ("Setup Matters", "Mouse DPI, polling, and surface friction change results—compare on one setup."),
        ("Who Benefits", "Gamers, designers, and anyone refining fine cursor control."),
    ],
    [
        ("Start", ["Begin the timed run.", "Keep the cursor moving smoothly."]),
        ("Click", ["Acquire target center.", "Click once cleanly.", "Do not spray clicks around the target."]),
        ("Adapt", ["As targets shrink, slow the final approach.", "Reset grip if tension rises."]),
    ],
    [
        ("Accuracy Bias", "A clean hit streak beats frantic whiffs."),
        ("Warm Up", "30 seconds of easy clicks before a scored run."),
        ("DPI Comfort", "Use a sensitivity you can micro-adjust, not only flick."),
        ("Arm vs Wrist", "Larger moves from arm; fine corrections from fingers/wrist."),
    ],
    [
        ("Good CPS?", "About 2–3 accurate CPS is solid; 3–4 with high accuracy is strong."),
        ("Mouse type?", "Comfort matters more than brand myths."),
        ("Reduce misses?", "Aim small, click once—stop panic spraying."),
        ("Target shrink reason?", "Keeps precision challenging as you improve."),
        ("Session time?", "Often ~30 seconds scored—check UI."),
        ("Touchscreens?", "Different motor skill; keep separate records."),
        ("Fatigue signs?", "Rising misses and grip tension—stop."),
        ("Compare scores?", "Same DPI and mouse."),
        ("Does pad matter?", "Consistent surface helps repeatability."),
        ("Best drill?", "Alternate accuracy-focused and pace-focused days."),
    ],
)


def find_object_span(text: str, key: str) -> tuple[int, int] | None:
    """Return [start, end) of `    \"key\": { ... },` including trailing comma/newline."""
    token = f'    "{key}": {{'
    start = text.find(token)
    if start < 0:
        return None
    i = start + len(token) - 1  # at '{'
    depth = 0
    while i < len(text):
        ch = text[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                if end < len(text) and text[end] == ",":
                    end += 1
                while end < len(text) and text[end] in " \t":
                    end += 1
                if end < len(text) and text[end] == "\n":
                    end += 1
                return start, end
        i += 1
    raise RuntimeError(f"Unbalanced braces for {key}")


def upsert_tool(text: str, key: str, body: str) -> str:
    block = f'    "{key}": {{\n{body}\n    }},\n'
    span = find_object_span(text, key)
    if span:
        a, b = span
        return text[:a] + block + text[b:]
    # Insert before closing of toolContent object: find `\n};\n\n// Related`
    marker = "\n};\n\n// Related tools mapping"
    idx = text.find(marker)
    if idx < 0:
        # try alternate
        marker = "\n};\n\n// Helper function"
        idx = text.find(marker)
        if idx < 0:
            raise RuntimeError("Could not find insertion point for new tools")
        # insert before the }; that closes toolContent — walk back
    # Find the last tool entry's end before related map
    rel = text.find("\n// Related tools mapping")
    if rel < 0:
        raise RuntimeError("related tools marker missing")
    # Insert before the `};` that closes toolContent (immediately preceding related comment)
    close = text.rfind("\n};", 0, rel)
    if close < 0:
        raise RuntimeError("toolContent close not found")
    return text[:close] + "\n" + block + text[close:]


def upsert_related(text: str, key: str, entries: list[tuple[str, str, str]]) -> str:
    """Ensure relatedToolsMap has an entry for key."""
    token = f'    "{key}": ['
    if token in text[text.find("relatedToolsMap") :]:
        return text
    items = ",\n".join(
        f'        {{ id: "{i}", title: "{t}", href: "{h}" }}' for i, t, h in entries
    )
    block = f'    "{key}": [\n{items},\n    ],\n'
    # Insert before closing of relatedToolsMap
    # Find mental-rotation related entry end or map close
    map_start = text.find("const relatedToolsMap")
    map_close = text.find("\n};", map_start)
    return text[:map_close] + "\n" + block + text[map_close:]


RELATED = {
    "n-back": [
        ("verbal-memory", "Verbal Memory", "/memory/verbal-memory"),
        ("chimp-test", "Chimp Test", "/memory/chimp-test"),
        ("sequence-memory", "Sequence Memory", "/memory/sequence"),
    ],
    "go-no-go": [
        ("flanker", "Flanker Task", "/reflex/flanker"),
        ("choice-reaction", "Choice Reaction", "/reflex/choice-reaction"),
        ("reaction-time", "Reaction Time", "/reflex/reaction"),
    ],
    "flanker": [
        ("go-no-go", "Go / No-Go", "/reflex/go-no-go"),
        ("multi-stimulus", "Multi Stimulus", "/reflex/multi-stimulus"),
        ("choice-reaction", "Choice Reaction", "/reflex/choice-reaction"),
    ],
    "choice-reaction": [
        ("reaction-time", "Reaction Time", "/reflex/reaction"),
        ("go-no-go", "Go / No-Go", "/reflex/go-no-go"),
        ("flanker", "Flanker Task", "/reflex/flanker"),
    ],
    "schulte-table": [
        ("number-rush", "Number Rush", "/speed/number-rush"),
        ("grid-shot", "Grid Shot", "/reflex/grid"),
        ("visual-memory", "Visual Memory", "/memory/visual"),
    ],
}


def main() -> None:
    text = TARGET.read_text()
    original = text
    for key, body in TOOLS.items():
        text = upsert_tool(text, key, body)
        print(f"upserted tool: {key}")
    for key, entries in RELATED.items():
        text = upsert_related(text, key, entries)
        print(f"related: {key}")
    if text == original:
        raise SystemExit("No changes made")
    TARGET.write_text(text)
    print(f"Wrote {TARGET} ({len(text)} bytes)")


if __name__ == "__main__":
    main()
