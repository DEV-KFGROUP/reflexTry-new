# ReflexTry: all-tools engagement, accuracy and responsive audit

**Implementation update:** [Fixes and verification](fixes-2026-11-19.md). The findings below describe the original version.

Date: 19 November 2026. Scope: 48 implemented game/tool routes, their page wrappers, shared layouts, persistence, discovery, daily challenges and statistics.

This is an audit, not a code fix. Source findings are distinguished from browser measurements. Initial screens were inspected at 320×568, 390×844, 768×1024, 1024×768, 1366×768 and 1920×1080. See [viewport evidence](viewport-smoke-results.json) and [initial gameplay evidence](initial-gameplay-results.json) for exact coverage. All 48 pages loaded in the six-size idle smoke pass (288 measurements); 44 start actions were selected by the generic phone pass. Four unmatched labels are not successful play checks. Browser emulation does not certify every device, touch gesture, difficulty, outcome, theme or assistive technology. Short initial-game checks do not replace complete playthroughs.

## Browser reproduction highlights

- [Targeted gameplay evidence](targeted-gameplay-results.json): started all five affected animation tools. Rhythm notes remain at -5%; Stroop Drop never spawns words; Precision Click has no active targets; Dodge position/time and Tracking health do not advance as intended. These match the stale phase guards in source.
- [Chimp hiding check](chimp-hide-check.json): Normal mode still displays the remaining numbers after clicking 1.
- [Rhythm Tap mobile screenshot](rhythm-tap-mobile-stalled.png): arena reached by scrolling to the controls; notes never enter the visible play area.
- Initial-gameplay checks use programmatic clicks with touch emulation. They do not prove real gesture latency or keyboard behavior.

## Anti-pattern verdict

Needs refinement. The repeated decorative grids, gradient accents, deeply nested panels, tiny uppercase monospace labels and large ornaments create a template-like interface. Keep the arena identity, but give the actual task, controls and results more space. Functional defects have higher priority than changing this visual style.

## Executive summary

The main engagement problem is a broken connection between playing and progress: the 48 tools save separate best-score keys without calling the existing history/challenge/achievement writer. Five animation games also start their loops using stale idle-state callbacks; Chimp Test never hides its numbers. Fix scoring, timing and input consistency before expanding rewards.

48 tools comprise 12 memory, 13 reflex, 8 speed, 7 gaming and 8 accuracy tools. Eleven use GameDashboardLayout; 37 repeat custom shells. No tool file uses pointer events or visibilitychange; only Time Perception explicitly handles touch. Click buttons generally work on touch through synthesized clicks, so lack of a touch handler alone is not a defect. Mouse-only continuous movement is a defect.

## Provisional implementation health

| Dimension | Score / 4 | Evidence / limits |
|---|---:|---|
| Accessibility | 1 | Focus removal, unnamed targets and missing keyboard hold path; full contrast/AT audit outstanding. |
| Performance | 2 | Frame-updated React state and accumulating Rhythm notes; low-end frame profiling outstanding. |
| Responsive design | 2 | Breakpoints exist; idle page overflow check passes, but mobile ordering/input and dense-board issues remain. |
| Theming | 2 | Shared layout supports both themes; custom shells mix light surfaces with dark text variants. |
| Anti-patterns | 1 | Repeated ornamental grids, nested cards, tiny technical copy. |
| **Total** | **8 / 20** | **Poor: address functional and interaction gaps first.** |

Scores are a heuristic implementation assessment, not Lighthouse or WCAG certification. The issue inventory below contains 20 grouped findings: 1 P0, 12 P1, 7 P2, 0 P3. A grouped finding may affect many routes.

## Findings

### [P0] F1: Five game loops start with an idle-state closure

- Location: [app/gaming/rhythm-tap/RhythmTapGame.tsx:240](../../app/gaming/rhythm-tap/RhythmTapGame.tsx#L240)
- Category: Accuracy / functionality.
- Impact/evidence: Rhythm Tap, Endless Dodge, Stroop Drop, Target Tracking and Precision Click schedule the current update callback after setting phase to playing. That callback was created while phase was idle/result and immediately returns. Delaying it does not refresh its closure. Target Tracking also starts moveTarget with the same stale phase.
- Recommendation: Start and stop each loop in an effect driven by the active phase, or read a synchronous running ref. Use a run ID to reject callbacks from previous attempts; verify first play and replay.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable harden`.

### [P1] F2: Chimp Test never hides its numbers

- Location: [app/memory/chimp-test/ChimpTestGame.tsx:294](../../app/memory/chimp-test/ChimpTestGame.tsx#L294)
- Category: Accuracy.
- Impact/evidence: Every cell starts with isRevealed=true. Rendering uses numbersShown OR cell.isRevealed, so setting numbersShown=false never hides the numbers. The task measures clicking sequence rather than memory.
- Recommendation: Initialize unrevealed cells correctly and distinguish mistake reveal from normal visibility. Verify automatic hide and first-click hide at each difficulty.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable harden`.

### [P1] F3: End-of-round callbacks save a stale score

- Location: [app/speed/click/ClickGame.tsx:188](../../app/speed/click/ClickGame.tsx#L188)
- Category: Accuracy / persistence.
- Impact/evidence: Timers created in startGame capture score/sortedCount from before that round. Adding score to useCallback dependencies does not update an already-installed interval. Seen in Click Speed, Aim, Flick Shot, Direction, both Grid games, Peripheral, Math, Word Speed, Color Memory and Shape Memory. Precision Click and Stroop Drop also capture old finalizers in their loops.
- Recommendation: Finalize from the latest authoritative state once. Save completed results for every terminal path; test a known score on first play, replay, timeout and life depletion.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable harden`.

### [P1] F4: Playing tools does not populate the existing engagement system

- Location: [utils/saveScoreWithName.ts:22](../../utils/saveScoreWithName.ts#L22)
- Category: Engagement / data.
- Impact/evidence: The shared helper updates history, achievements, daily completion and leaderboard, but repository search finds no caller. All 48 tools use their own best-score keys. Statistics reads ScoreHistory, so these new runs do not appear there.
- Recommendation: Create one local completion event/result writer used by all tools, preserving difficulty and outcome. Keep local history independent of network failures. Make public leaderboard submission a separate deliberate action.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable harden`.

### [P1] F5: Two movement games only support a mouse

- Location: [app/gaming/endless-dodge/EndlessDodgeClient.tsx:540](../../app/gaming/endless-dodge/EndlessDodgeClient.tsx#L540)
- Category: Responsive / input.
- Impact/evidence: Endless Dodge and Target Tracking only update coordinates through onMouseMove. Touch movement has no equivalent handler. Initial Dodge position is also hard-coded to x=250/y=180 instead of the measured arena center.
- Recommendation: Use pointer events and pointer capture for drag controls, with pointer cancel/leave handling and scoped touch-action. Initialize from arena dimensions and provide touch-specific instructions.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable adapt`.

### [P1] F6: Round countdown restarts when a player scores

- Location: [app/reflex/whack-a-mole/WhackAMoleGame.tsx:204](../../app/reflex/whack-a-mole/WhackAMoleGame.tsx#L204)
- Category: Accuracy / timers.
- Impact/evidence: Whack-a-Mole recreates its one-second countdown effect when score changes. Scoring before each tick can repeatedly postpone the decrement, extending a nominal 30-second round.
- Recommendation: Use a fixed monotonic deadline and stable timer lifecycle. Treat slow-motion bonuses separately from elapsed time.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable harden`.

### [P1] F7: Timed round callbacks can retain old round state

- Location: [app/reflex/color-switch/ColorSwitchGame.tsx:245](../../app/reflex/color-switch/ColorSwitchGame.tsx#L245)
- Category: Accuracy / timers.
- Impact/evidence: Color Switch generateRound closes over handleRoundTimeout while only depending on difficulty; timeout and answer handlers also omit proceedNextRound dependencies. Multi Stimulus has the same structure. A timeout can repeatedly advance from old round/error state. Color Switch saves accuracy using correct before the final answer increment.
- Recommendation: Use a reducer or synchronous round refs with one guarded resolveRound path for answer and timeout. Persist the final computed counters.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable harden`.

### [P1] F8: A round can accept multiple submissions during feedback

- Location: [app/accuracy/pattern-matching/PatternMatchingGame.tsx:210](../../app/accuracy/pattern-matching/PatternMatchingGame.tsx#L210)
- Category: Accuracy / interactions.
- Impact/evidence: Pattern Matching leaves phase selecting for the 1100ms feedback delay; repeated selection can award multiple points and queue multiple rounds. Quick Sort similarly keeps the current item active for 150ms. Image Recognition, Angle Estimation and Color Match require the same resolve-once review. Delayed progression also reads pre-increment mistakes, allowing a new round to race with failure.
- Recommendation: Synchronously lock a resolved round, calculate next counters once and track/cancel feedback timers. Disable answer controls while feedback is visible.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable harden`.

### [P1] F9: Mobile puts the game after a long settings stack

- Location: [components/dashboard/GameDashboardLayout.tsx:59](../../components/dashboard/GameDashboardLayout.tsx#L59)
- Category: Responsive / engagement.
- Impact/evidence: The shared layout and 37 custom layouts put difficulty and stats before the game in a single mobile column. At 390×844, 44 measured start buttons sit 1413–1593px below the top of the page, well below the first viewport. Four buttons had different labels and were not selected in this generic pass. The fixed 480–520px arena plus large padding is also unsuitable for short landscape screens.
- Recommendation: On compact screens put a compact level selector, game, then results/stats; expand detailed settings on demand. Size the arena against available dynamic viewport height while preserving usable controls. Test soft keyboard and landscape.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable adapt`.

### [P1] F10: Timing trials include presentation and input-method bias

- Location: [app/reflex/choice-reaction/ChoiceReactionGame.tsx:165](../../app/reflex/choice-reaction/ChoiceReactionGame.tsx#L165)
- Category: Accuracy.
- Impact/evidence: Choice Reaction, Go/No-Go and Flanker timestamp before React presents the stimulus, and Choice Reaction animates the state over 150ms. Several reaction tools use Date.now and click-release timing. These implementations cannot support claims of device-independent precision.
- Recommendation: Use one monotonic clock, immediate measured stimulus presentation and consistent pointer-down/keyboard timing. Record input method and test configuration; compare like-for-like attempts and expose variability. Avoid interpreting the results as laboratory measurements.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable harden`.

### [P1] F11: Rhythm speed depends on display refresh rate

- Location: [app/gaming/rhythm-tap/RhythmTapGame.tsx:248](../../app/gaming/rhythm-tap/RhythmTapGame.tsx#L248)
- Category: Accuracy / performance.
- Impact/evidence: Notes advance a fixed amount per frame. A 120Hz display moves them roughly twice as fast as 60Hz. Hit/missed notes then stop advancing but removal requires y>=115, so resolved notes persist. Completion can schedule a new finish timeout each frame.
- Recommendation: After fixing F1, use elapsed time and timing windows in milliseconds. Remove resolved notes after feedback and schedule completion once. Align a scheduled beat cue with the notes; current effects are hit/start sounds rather than a sustained beat.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable optimize`.

### [P1] F12: No tool handles a hidden tab consistently

- Location: [app/gaming/endless-dodge/EndlessDodgeClient.tsx:278](../../app/gaming/endless-dodge/EndlessDodgeClient.tsx#L278)
- Category: Accuracy / lifecycle.
- Impact/evidence: No visibilitychange handling was found in the 48 tool files. Background timer throttling can extend countdowns; resumed animation timestamps can produce large movement or drain jumps. This is a lifecycle coverage gap, not a claim that every browser reproduces each effect.
- Recommendation: Adopt an explicit pause or invalidate policy, stop scoring while hidden and reset timing on resume. Cancel every pending spawn, feedback and reveal callback on abort, restart and unmount.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable harden`.

### [P1] F13: Ordinary controls lose focus visibility and game targets lack names

- Location: [app/accuracy/precision-click/PrecisionClickGame.tsx:537](../../app/accuracy/precision-click/PrecisionClickGame.tsx#L537)
- Category: Accessibility.
- Impact/evidence: Precision target buttons remove outlines and contain no accessible name; multiple custom difficulty and Play buttons suppress outlines without a replacement. Time Perception has mouse/touch hold handlers but no keyboard hold/release path.
- Recommendation: Give actionable controls names, a visible focus style and keyboard equivalents where the task permits. Use meaningful grid coordinates without revealing hidden answers. Distinguish intentional precision targets from ordinary navigation targets.
- Standard: Keyboard operation, focus visibility and accessible control naming where applicable; verify task-specific alternatives.
- Suggested command: `$impeccable harden`.

### [P2] F14: Two different games share the same best-score key

- Location: [app/accuracy/color-match/ColorMatchGame.tsx:180](../../app/accuracy/color-match/ColorMatchGame.tsx#L180)
- Category: Accuracy / persistence.
- Impact/evidence: Accuracy Color Match and Memory Color both use color-hs-${difficulty}; they save different metrics and overwrite or inherit each other’s records.
- Recommendation: Namespace scores by canonical tool ID and version. Migrate only records whose provenance can be identified; keep unrelated old records separate.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable harden`.

### [P2] F15: Statistics labels faster times as declining

- Location: [utils/scoreHistory.ts:97](../../utils/scoreHistory.ts#L97)
- Category: Accuracy / engagement.
- Impact/evidence: Trend calculation always treats a rising value as improving, although lower ms wins. Statistics also mixes difficulty values in one tool aggregate. Unit-based direction inference cannot represent all future score types.
- Recommendation: Store metric direction explicitly and filter comparison groups by difficulty/configuration and input method. Show personal changes with sample counts.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable harden`.

### [P2] F16: Daily challenge and streak behavior is inconsistent

- Location: [utils/dailyChallenge.ts:31](../../utils/dailyChallenge.ts#L31)
- Category: Engagement / accuracy.
- Impact/evidence: The daily tool is picked randomly per browser rather than deterministically per day. UTC date keys reset at 05:30 in India; getStreak starts today and returns zero before today is completed even if yesterday’s streak is intact. Completion also uses the passed unit without checking it matches the challenge.
- Recommendation: Choose a documented daily reset timezone, deterministic daily seed/configuration, explicit metric matching, and a streak display that preserves yesterday’s streak until the current day ends.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable harden`.

### [P2] F17: Some scores measure a different thing than their labels suggest

- Location: [app/accuracy/data/DataEntryClient.tsx:268](../../app/accuracy/data/DataEntryClient.tsx#L268)
- Category: Accuracy / copy.
- Impact/evidence: Data Entry floors completed speed at 12 WPM. Number Memory saves the digit count of a failed level as a best result. Card Match derives used time from remaining bonus/penalty time. Image Recognition accepts any text containing the answer, including negated strings. Typing only saves best WPM on exact paragraph completion, not normal timed expiry.
- Recommendation: Report raw measured speed, last successfully completed level, actual wall elapsed time and explicit answer aliases. Define partial/timed completion policies before unifying persistence.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable clarify`.

### [P2] F18: Dark styles are applied to light surfaces

- Location: [app/gaming/rhythm-tap/RhythmTapGame.tsx:121](../../app/gaming/rhythm-tap/RhythmTapGame.tsx#L121)
- Category: Theming / accessibility.
- Impact/evidence: Custom difficulty cards keep a white background but use very light dark-mode description text. Several custom headings stay text-slate-800 on dark-slate-800 containers. The 11 shared-layout tools have better theme coverage than many custom clones.
- Recommendation: Use shared semantic surface/text tokens and verify computed contrast in both themes. Do not infer accessibility from class names alone.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable colorize`.

### [P2] F19: Reduced motion and decorative effects need a shared policy

- Location: [app/globals.css:238](../../app/globals.css#L238)
- Category: Performance / accessibility / anti-pattern.
- Impact/evidence: Repository search found no implemented prefers-reduced-motion, useReducedMotion or MotionConfig policy. Repeated glows, decorative grids, spinning ornaments, nested panels and tiny tracked uppercase labels compete with the task. Frame-updated React state in multiple games also deserves profiling on low-end hardware.
- Recommendation: Keep stimulus-critical motion, reduce decorative motion, respect the user preference and simplify the shared shell. Profile frame pacing before assigning a performance score based on runtime.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable animate`.

### [P2] F20: All Tools omits two published tools

- Location: [app/tools/AllToolsClient.tsx:31](../../app/tools/AllToolsClient.tsx#L31)
- Category: Discovery / engagement.
- Impact/evidence: The explicit All Tools list contains 46 links; Color Blindness and Mental Rotation are implemented and mapped but absent from it. Parallel registries also use varying names, including Word Reading for a typing task.
- Recommendation: Generate discovery and canonical IDs from one registry, including input support, expected duration, goal and skill category. Offer filters and continue-last-tool navigation.
- Standard: Product behavior / measurement consistency; no formal conformance verdict.
- Suggested command: `$impeccable clarify`.

## Per-tool action matrix

All rows also inherit F4 (progress integration), F9 (compact layout) and F12 (lifecycle policy). Review items describe remaining checks, not confirmed defects.

| Tool / route | Accuracy / correctness | Engagement improvement | Screen-size / input priority |
|---|---|---|---|
| `/memory/card-match` | F17; completion callbacks | Show pairs, moves and actual elapsed time; replay same board seed. | Dense grids; test hardest board and feedback at 320px. |
| `/memory/chimp-test` | F2; number hiding | Show last completed number count; gradual progression. | Eight columns need a deliberate compact/touch mode. |
| `/memory/color` | F3, F14 | Clarify ink vs word rule; show streak and accuracy. | Large readable prompt; label answer controls. |
| `/memory/n-back` | Trial/response denominator and life policy review | Show hits, misses, false alarms, correct rejections. | Large Match button; Space plus touch parity. |
| `/memory/number` | F17; failed level credited | Show successfully recalled digits and retry goal. | Long digit strings, numeric keyboard and safe zoom. |
| `/memory/object-tracking` | Delta-time movement exists; verify resize bounds | Show target reveal and round-by-round progress. | Small proportional dots need a touch configuration. |
| `/memory/sequence` | Untracked playback interval and delayed callbacks | Short demonstration; completed length vs attempted length. | Keep full board and next action visible in landscape. |
| `/memory/shape` | F3; delayed grid reset | Explain which shapes to find; completed-board feedback. | Dense grid and tiny labels; respect touch spacing. |
| `/memory/symbol` | Delayed match/shuffle callback lifecycle | Show matched pairs and consistent moves/time score. | Test largest board, symbol labels and dark theme. |
| `/memory/verbal-memory` | Dictionary exhaustion and timeout paths review | Display distinct words remembered; Seen/New shortcuts. | Keep word and both response buttons in one viewport. |
| `/memory/visual` | Reveal/next-level timeouts not all cancelled | Show tiles correctly recalled and completed level. | Largest grid needs readable targets and stable geometry. |
| `/memory/word-recall` | Failed level recorded; untracked next-level callbacks | Show missed/reordered words after submit. | Keep input and submit above software keyboard. |
| `/reflex/choice-reaction` | F10; successful-response-only mean | Show error rate with median and variability. | Consistent pointer-down input; retain labelled choices. |
| `/reflex/color-switch` | F7; final accuracy before final increment | Explain active rule; show accurate round history. | Fit eight answer choices with readable text. |
| `/reflex/direction` | F3; timed persistence | Practice direct/inverse rules before ranked attempt. | min-w 280 prompt can clip in padded mobile arena. |
| `/reflex/flanker` | F10; correctness by condition | Show congruent/incongruent results and errors. | Readable center arrow; large left/right controls. |
| `/reflex/go-no-go` | F10; expose misses and false alarms | Show inhibition accuracy rather than only points. | Space and tap equivalence; no color-only instruction. |
| `/reflex/grid` | F3; floating target lifecycle | Show hits, expired targets and accuracy. | 22px targets require explicit precision/touch rules. |
| `/reflex/multi-stimulus` | F7; stale timeout/progression | Give practice examples of each rule. | Show instruction and complete grid together. |
| `/reflex/peripheral` | F3; screen-size comparability | Describe this as task practice; compare same setup. | Arena width changes stimulus eccentricity; record geometry. |
| `/reflex/reaction` | F10; timestamp/input onset | Show median and spread across clean trials. | Large stable stimulus; immediate input and feedback. |
| `/reflex/sequence-reaction` | Untracked playback interval; timeout closures | Show sequence-length-specific completion time. | Preserve target identity through shuffle; avoid cramped grids. |
| `/reflex/sound` | F10; sound scheduling/audio-ready onset | Add sound check and quiet/loud volume preview. | Tap/keyboard parity; separate audio modality scores. |
| `/reflex/time-perception` | Zero error is treated as false in feedback | Show signed error and mean absolute error. | Implement keyboard hold/release and pointer capture. |
| `/reflex/whack-a-mole` | F6; unify life-depletion saving | Clear mole types; show hit rate and round goal. | Fit grid to short screens; distinguish bombs without color alone. |
| `/speed/click` | F3; deadline and final CPS | Show exact duration and repeatable CPS trend. | Measure same input event on touch/mouse; separate records. |
| `/speed/grid` | F3; target repeat protection | Show waves and accuracy; next-wave feedback. | Largest matrix needs intentional target sizes. |
| `/speed/math` | F3; parseInt accepts partial strings | Show correct answers and practice weak operations. | InputMode and software keyboard; do not hide the equation. |
| `/speed/number-rush` | Clock and completed-number rule review | Show next number, mistakes and actual completion time. | Dense board, rotation/jitter and input-specific comparisons. |
| `/speed/quick-sort` | F3, F8 | Clear category examples; streak-based feedback. | Two or more large category buttons, shortcuts optional. |
| `/speed/schulte-table` | Monotonic clock exists; compare board configuration | Show completion time and consistent scan practice. | Test largest board and target dimensions. |
| `/speed/typing` | F17; current WPM includes incorrect characters | Start timing on first input; show net speed and accuracy. | Soft keyboard, caret visibility, paste/autocorrect policy. |
| `/speed/words` | F3; repeated bad-prefix events count more errors | Rename to match actual word-typing task; show word rate. | Keep prompt and input together with soft keyboard open. |
| `/gaming/aim` | F3; replaced targets not always counted as missed | Show accuracy, time and expiry policy. | Use same geometry for visual and hit target; touch mode. |
| `/gaming/endless-dodge` | F1, F5; homing interpolation is per-frame | Show survival milestone and next achievable goal. | Drag input, pointer capture and real arena center. |
| `/gaming/flick-shot` | F3; captured score-based difficulty | Show actual hit/expiry accuracy and speed. | Small targets and bombs need explicit mobile difficulty. |
| `/gaming/reaction` | Date.now reaction timing; closure review | Practice block directions; summarize valid blocks. | Large on-screen direction controls plus keyboard. |
| `/gaming/rhythm-tap` | F1, F11 | Beat cue, countdown, timing feedback and next combo goal. | Touch lanes and keyboard chords; do not hide arena below stats. |
| `/gaming/stroop-drop` | F1; final score capture | Readable ink-rule demo and one-step replay. | Fit word and all color controls; avoid ornamental blur. |
| `/gaming/target-tracking` | F1, F5 | Show tracked ratio/time and progress milestones. | Continuous drag support; separate mouse/touch records. |
| `/accuracy/angle-estimation` | F8; failure and next-round race | Show degree error, correct angle and next target. | Sharp canvas on resize; labelled slider and numeric option. |
| `/accuracy/color-blindness` | Custom generated plates; validate task claims separately | Describe exercise provenance and limits clearly. | Canvas size, display conditions and keypad usability. |
| `/accuracy/color-match` | F8, F14; timeout closure can capture old color | Show target/user swatches and clearly named metric. | Label RGB sliders; do not imply RGB distance is perceptual accuracy. |
| `/accuracy/data` | F17; stale final WPM save after setWpm | Show exact-match accuracy and raw correct-character rate. | Monospace wrapping, first-input behavior, keyboard visibility. |
| `/accuracy/image-recognition` | F8, F17 | Accept explicit aliases; show explanation and correct answer. | Emoji differ across platforms; alternatives need readable labels. |
| `/accuracy/mental-rotation` | Mirroring can produce rotation-equivalent symmetric shapes | Reject ambiguous generated pairs; show rotation explanation. | Fit both objects at 320px; keyboard response support. |
| `/accuracy/pattern-matching` | F8 | One result per round, highlight exact differing symbols. | Longest patterns and options must wrap without losing meaning. |
| `/accuracy/precision-click` | F1, F3; per-frame random spawn probability | Show honest accuracy and explicit precision goal. | Tiny targets are task-specific; ordinary controls stay large. |

## Responsive acceptance matrix for the fixes

| Surface | Required behavior |
|---|---|
| 320×568 compact phone | No clipped task or controls; game before expanded settings; readable instructions; avoid forced horizontal navigation. |
| 390×844 common phone | Primary Play visible early; continuous gestures work; sound toggle and retry reachable. |
| 844×390 landscape phone | Short arena and compact HUD; controls remain visible; no fixed 520px minimum forcing an unusable play area. |
| 768×1024 tablet | Use available width for task, allow touch, avoid desktop-only hover instructions. |
| 1024×768 small laptop | Two columns must leave enough arena width; dense boards should not shrink below intended interaction sizes. |
| 1366×768 laptop | Entire important play region and controls fit at default zoom. |
| 1920×1080 desktop | Bounded arena geometry and comparable scoring; avoid enormous travel distances. |
| 200% text / zoom | Copy wraps; no hidden buttons; scrolling remains possible outside the game. |
| Software keyboard open | Typed prompt, input, error and submit remain visible; timer-start policy is clear. |
| Resize/orientation mid-round | Pause or recompute geometry without moving targets out of bounds or changing a ranked task silently. |
| Reduced motion / dark theme | Suppress ornament, preserve required stimulus; verify contrast in every state. |

For ordinary controls target approximately 44–48 CSS pixels with adequate spacing. Precision-game targets can intentionally be smaller: do not silently enlarge their hit boxes and then compare their scores with the mouse task. Offer a named touch configuration and store its version. A viewport-only overflow pass can miss content clipped inside overflow-hidden containers.

## Engagement plan using the features already present

1. One completion record per real attempt: canonical tool ID, difficulty, metric/direction, duration, correct/incorrect/omitted counts, outcome, input method, arena configuration and version. Keep raw measures separate from bonus points.
2. Results show the measured result, personal change for a comparable setup, one concrete improvement tip and one clear Play again action. Offer Next difficulty only when the player is ready.
3. Connect existing statistics, achievements and daily challenges to those results. Provide useful local progress without requiring registration or public score submission.
4. Put a deterministic daily challenge and a short three-tool routine near relevant results. Track a routine’s completion, allow exit, and avoid punishing a missed day.
5. Fix discovery: include all 48 tools, distinguish similarly named color/grid games, and filter by goal, duration and supported input.
6. Add consent-aware events for game_view, start, first_valid_action, completed, failed, aborted and replay. No such gameplay events were found in the current GA component. Evaluate completion, replay, day-1/day-7 return and active foreground play time, rather than raw time-on-page alone.

## What is already useful

- Broad variety of tasks and per-difficulty configurations.
- Local per-difficulty best records, needing a consistent writer rather than a new account requirement.
- Shared components already available for eleven tools.
- Monotonic timing/ref guards in several newer tasks; delta-time movement in Object Tracking.
- Existing history, challenge, achievement and leaderboard building blocks that can be connected.
- Page-level overflow smoke checks pass across all six tested widths in idle state.

## Prioritized execution

1. **P0 — `$impeccable harden`**: F1 game-loop starts and single terminal-state transitions.
2. **P1 — `$impeccable harden`**: F2/F3/F6/F7/F8 measurement, persistence and submission guards, then connect F4.
3. **P1 — `$impeccable adapt`**: F5/F9 input parity, compact game-first layout, board sizing and software keyboard.
4. **P1 — `$impeccable optimize`**: F10/F11/F12 timing lifecycle, refresh-rate independence and bounded frame work.
5. **P1/P2 — `$impeccable harden`**: focus, keyboard/name coverage and F14/F15/F16 persistence correctness.
6. **P2 — `$impeccable clarify`**: F17/F20 labels, real metrics, discovery and simpler instructions.
7. **P2 — `$impeccable colorize`** and **`$impeccable animate`**: F18/F19 theme and motion policy.
8. **`$impeccable polish`**: verify complete first-play, replay, failure and completion flows at the acceptance sizes.

Re-run `$impeccable audit` after fixes. These can be tackled individually or together. Optional: `$impeccable init` would capture shared product and design decisions in PRODUCT.md; its absence did not block this audit.
