# Writing rules for the blog

Derived from the owner-supplied paper: Russell, Rajendhran, Pham, Iyyer and
Wieting, *StoryScope: Investigating idiosyncrasies in AI fiction*, COLM 2026
(arXiv:2604.03136v6). Recorded here on 2026-09-09 because the first blog batch
was written against these rules from a conversation summary rather than the
paper, and the rules were never written down.

## What the paper actually measures

It asks whether AI writing can be told from human writing **without** looking at
style. It converts 61,608 stories into structured narrative templates, induces
304 discourse-level features, and finds that narrative features alone separate
human from AI at 93.2% macro-F1, keeping over 97% of the performance of a model
that also sees style. The point that matters for us: the tells are **structural
choices**, not word choice. You cannot fix them by swapping vocabulary, which is
exactly why they are worth following.

Two caveats, stated plainly so nobody over-applies this:

1. The corpus is ~5,000-word **fiction**. Our posts are ~1,600-word
   non-fiction. The findings about thematic explicitness, named references,
   reader address and emotional labelling transfer cleanly. The ones about
   protagonists, subplots and flashbacks transfer weakly or not at all.
2. The paper is a **detection** study, not a style guide. We are using its
   measured human/AI gaps as a checklist because they describe real habits, not
   because sounding human is itself the goal. Clear writing is the goal.

## The measured gaps (Table 16), as instructions

Values are human mean vs AI mean. Negative gap = the habit marks AI writing.

### Stop doing these (AI-elevated)

| Habit | Human | AI | What it means for a post |
| --- | --- | --- | --- |
| Emotional expression via embodied metaphor | 38% | 81% | The single largest gap in the paper. Do not render judgement as bodily sensation. No tightening chests, no held breath. |
| Thematic explicitness and moralising | 3.28 | 3.94 | Do not state the lesson. The reader draws it. |
| Narrator explicitly commenting on the theme | 52% | 77% | No "and this is why traceability matters" paragraph. |
| Dialogue serving philosophical debate | 34% | 59% | Quoted speech should do work, not deliver a thesis. |
| Olfactory imagery | 57% | 82% | Smell is an AI tic. Almost never needed in this register. |
| Setting as psychological mirror | 3.58 | 4.07 | The meeting room does not need to feel like the argument. |
| Moral / philosophical weighting | 3.26 | 3.68 | Keep the frame practical. |
| Thematic unity (everything serving one theme) | 4.41 | 4.74 | Tidiness is a tell. Let one section refuse to resolve. |
| Vague allusions rather than named ones | 72% AI | | See the human column below. |
| Continuous single causal chain | 3.92 | 4.20 | Real mechanisms have loose ends. Leave them. |
| Resolution by the protagonist's own choice | 46% | 69% | Not everything is solved by the actor deciding well. |
| Resolution by internal understanding | 27% | 47% | Do not end on "once you see it, you can fix it". |
| No subplots at all | 57% | 79% | A second thread is more human than a single track. |
| Sensory density / interior access | 3.66 / 3.67 | 3.93 / 3.93 | Under-describe rather than over-describe. |

### Start doing these (human-elevated)

| Habit | Human | AI | What it means for a post |
| --- | --- | --- | --- |
| Explicit **named** references | 47% | 24% | Name the real thing: PRINCE2, MSP, ISO 21504, the UAE AI Charter, a real date. Nearly double the human rate. |
| Balanced mix of explicit and implicit reference | 37% | 16% | Some named, some assumed. |
| Direct reader address | 0.28 | 0.07 | Four times the human rate. "Be precise about this." "The test: can you…" |
| Fourth-wall permeability | 0.67 | 0.39 | Acknowledge the reader is reading. |
| Explicit emotion / judgement **labels** | 29% | 8% | Say "this is the weakest part of the argument". Plain labels beat dressed-up ones. |
| Morally ambivalent judgement | 59% | 38% | Let the verdict stay mixed where it honestly is. |
| Depth of re-reading forced by a late turn | 3.28 | 2.95 | A late point that makes an earlier one read differently. |
| Chronological discontinuity / anachrony | 2.40 / 2.58 | 2.12 / 2.31 | Do not march problem → cause → fix in a straight line. |
| Subplots that run thematically parallel | 42% | 21% | A second strand that rhymes rather than repeats. |
| Location variety | 1.34 | 1.08 | More than one concrete scene. |
| Dialogue-to-narration proportion | 2.95 | 2.70 | More quoted speech than feels natural to us. |

### Style-level tells (§2, and already in CLAUDE.md)

Em-dashes, "delve", "tapestry". The paper notes these are fleeting and easily
edited out, which is precisely why the structural list above matters more.

## Claude's own fingerprint (Table 17, §5)

These posts are drafted by Claude, and the paper identifies Claude's specific
divergences from the other models. Worth self-checking against:

- **Flat event escalation** is Claude's strongest fingerprint (SHAP 0.402,
  uniqueness 22.4, the highest of any model on any feature). "Its stories are
  defined by restraint: event intensity escalates less than in any other
  source." In a post this reads as an argument that stays at one pressure the
  whole way. Let the piece actually build.
- **Low event-type diversity** (0.491). Vary what kinds of thing happen.
- **Favours epilogues** (uniqueness 8.9) and quiet endings over "avalanche"
  endings. We already end every post with "Where this comes from", which *is*
  an epilogue. Fine, but do not add a second wrap-up before it.
- **Most uniform narrative voice** of the five models. Disperse the register
  deliberately: some very short sentences, some technical, some plain.
- **Reverent and continuist toward tradition** (62% vs 39–56% for other
  models): Claude honours conventions rather than subverting them. Break one
  convention per piece on purpose.

## Practical checklist before publishing a post

- [ ] Does any paragraph state the lesson? Cut it.
- [ ] Is there a real named framework, document or date? Add one if not.
- [ ] Does the piece address the reader at least once?
- [ ] Is there a section that genuinely complicates the argument, and does it
      stay unresolved?
- [ ] Are judgements labelled plainly rather than dramatised through the body?
- [ ] Does the argument build, or sit at one pressure throughout?
- [ ] Zero em-dashes; none of CLAUDE.md's banned words.
- [ ] Arabic written directly, carrying no less than the English.
