---
title: "Is your portfolio data ready for AI? Readiness is a governance property"
seoTitle: "Is your portfolio data ready for AI?"
description: "AI on a portfolio fails before the model is chosen. Why readiness is a governance property, and how AI-ready differs from report-ready."
pubDate: 2026-09-09
author: "TruMandate team, Intertec Systems"
lang: "en"
translationKey: "portfolio-data-ready-for-ai"
tags: ["ai-readiness", "data-quality", "portfolio-governance", "epmo", "kpi"]
draft: false
---

The question typed into the box is a fair one. Which objectives are exposed if the permits initiative slips two quarters.

The answer arrives in four seconds. Fluent, three objectives named, a short paragraph on each. It is also wrong. Two of the three were retired in last year's strategy refresh and nobody removed them from the record. The link to the third exists in a slide from the funding paper and nowhere else. The objective genuinely exposed is not mentioned, because the initiative was never attached to it.

Nothing malfunctioned. A model can read what the record connects. That is the whole of what it can read.

## Why does AI on a portfolio fail before the model is chosen?

Because the choice of model is not where the outcome gets decided.

A model reasoning over your portfolio is not looking at your portfolio. It is looking at the relations the record happens to hold: which initiative points at which objective, which objective is measured by which KPI, which actual was taken on which date, who is accountable for it. Where a relation is missing the model does not report a gap. It infers, from names and adjacency and the general shape of portfolio documents, and produces the most plausible sentence available. Plausible is the problem. A missing link yields a confident answer rather than an error.

Gartner expects 60% of AI initiatives to be scrapped through 2026 in organisations that lack AI-ready data. Reported industry surveys put abandonment higher and rising: 42% of companies gave up on most of their AI initiatives in 2025, against 17% the year before. Data preparedness is the leading constraint CIOs report on AI value, ahead of talent and cost.

Gartner's framing of why is the part usually skipped. AI-ready data is a different requirement from traditional data management, and an organisation treating the two as one requirement puts its AI work at risk. Carefully stewarded data can still be unreadable by a model.

## What is the difference between report-ready and AI-ready?

A monthly pack can be immaculate and useless to a model.

The pack is a rendering. It was built for a reader who arrives with context already in their head: that the amber on line nine is the third slip, that the vendor changed in March, that the owner listed is on secondment. None of that is in the pack, and it does not need to be, because the eight people who read it know it. A model arrives with nothing.

Take a rollup as ordinary as counting how much of the portfolio is running. Computed from records, that count is produced when somebody asks and can be recomputed a different way by whoever asks next. Typed into a pack, it is a number whose choices have gone invisible: what was included, what was treated as not yet started, when it was last worked out. A reader who knows the portfolio corrects for those silently.

Report-ready rewards summary. AI-ready rewards the reverse: links kept as links, dates kept as dates, retired things marked retired.

The test: can you ask the record a question the pack was never designed to answer and get an answer without an analyst in the loop? If everything outside the pack's shape needs a person to assemble it, you have a reporting asset, not a readable record.

## The four properties, in the order they bite

None is a data-cleaning task.

**Traceable links.** Every initiative attached to the objective that funded it, every objective attached to the measure that shows it moving, held as a relation rather than as a mapping somebody maintains by hand. This one decides whether a model can reason at all, because traversal is most of portfolio reasoning: exposure, contention, double counting, dependency.

**Named owners.** An individual, not a department. For a model this is the difference between an answer and an action, since the useful output of a portfolio question is usually a person to call. And a number with a named owner has someone who notices when it is wrong.

**Dated actuals.** A baseline value with the date it was taken, then actuals each carrying their own date. A number with no date is not a series, and nearly every question worth asking a portfolio is about movement rather than position. A value with no date is not partial data. It is a fact the model will place in the present.

**Retired measures.** The dull one, and the one that does most of the damage. Strategies get refreshed, objectives get merged, measures stop mattering, and almost nobody deletes. So the record keeps objectives that were true once with nothing to say they were superseded, and a model cannot tell a live one from a dead one. Retirement has to be an event with a date and a name.

## Why is readiness a governance property rather than a cleaning exercise?

Because cleaning is a state and governance is a routine.

You can clean a portfolio record in six weeks. Deduplicate the initiatives, attach the orphans, chase the missing baselines: the result is genuinely better. It will also decay, because the portfolio keeps moving: a funding round, a restructure, a strategy refresh, four owners changing role in a quarter. Within two or three quarters the record is back where it started, unless the point of entry refuses a partial record at the moment somebody tries to create one.

The framework language exists already. DAMA-DMBOK gives you the quality dimensions and the stewardship roles, ISO 21504 what a portfolio record is supposed to hold, ISO/IEC 42001 the management-system requirements for AI itself: stated purpose, accountable roles, records of decisions, review.

## Where does this argument break?

Two places. This is the weakest part of what you have just read, and worth reading twice if your office already has a readiness business case drafted.

**The readiness programme that never ships.** Take "get the data ready first" literally and you get a two-year data project. It is a comfortable thing to be doing: a plan, a budget line, a workstream structure, and no moment at which anyone has to decide anything. Meanwhile the portfolio keeps moving, so the cleanup is chasing a target that will not stand still.

Nobody's portfolio will ever be fully ready. Waiting for that is a decision not to start.

**The judgement you should not have automated.** Suppose the record is genuinely good. Links intact, owners named, actuals dated, retirements marked. Now ask a model which initiatives to stop.

It will answer. The answer will be defensible. The committee will accept it, and that is the problem: a defensible recommendation under time pressure is hard to argue with when nobody in the room built it and the working looks tidy. What makes a stop decision legitimate is not that it was optimal. It is that a named person took it, on evidence they can be asked about, and stays answerable when the consequence lands eighteen months later.

One more thing about the four seconds at the start of this piece. That record had been through a data quality programme two years earlier and passed it. Nothing in the wrong answer came from dirty data. The links were the problem, and no quality dimension in the DAMA-DMBOK list would have caught them, because a link nobody created is not an error in a field. Which leaves this uncomfortable: the work described above is necessary, and there is no audit that tells you when you have done enough of it.

## Who owns readiness?

Not the data team alone, which is where most entities put it.

Their version of the conversation happens in another room and sounds reasonable. "Give us the fields and the refresh cadence and we will build the pipeline." They are right about the pipeline. They cannot decide which objective an initiative serves, and no amount of pipeline makes that decision appear.

So the strategy office or the EPMO owns the record: what it must hold, what it refuses, who is named against each row, when a measure gets retired. The data function owns how actuals arrive from delivery systems, how identity stays stable across them, how history is kept.

Gartner's 2026 priorities for EPMO leaders set the ordering plainly. Data governance and data quality first. Then governance of AI use. Then the PMO's own competence at framing context for a model. Then financial controls embedded in execution rather than reviewed beside it. The first two need no procurement. Adoption of AI in programme and portfolio management is accelerating while most PMOs stay underprepared on exactly those two, which is how an entity ends up with a pilot before a baseline.

Saudi Vision 2030 and the UAE AI Strategy 2031 both push entities to put AI into the operating layer, so a strategy office gets asked for an AI plan long before its record can support one.

## What would you check first?

Take the question your board asks most often. Not a category of question. The actual sentence.

Then answer it from the record alone, with no analyst and no assembly. Trace the objective down to its initiatives, the initiatives to their measures, the measures to their last actual and the date on it, and every row to a person's name. Write down each point where you had to ask somebody.

Four things usually show up: initiatives attached to no objective, objectives with no live measure, measures with no baseline or no date, and objectives retired in a refresh that were never marked retired. Each is a governance fix with a name against it. None needs a model.

## Common questions

### Do we need a data warehouse before AI can read our portfolio?

Usually not, and starting there defers the part that matters. A warehouse consolidates, and consolidation does not create relations or accountability: copying five disconnected registers into one place gives you five disconnected registers with better uptime. Attach the links and name the owners in the governance record first. A warehouse earns its place later, on history and volume.

### Can a model clean the record for us?

Partly, and only where its output is verifiable. Matching duplicate initiative names, proposing which objective an unattached initiative most likely serves, flagging every KPI with no baseline: good uses, because a person can confirm or reject each suggestion in seconds. What a model cannot do is decide what an initiative was funded to move, or who is accountable for a benefit after closure. Those are not facts missing from your data but decisions nobody has taken, and generating a plausible version of them makes the record worse while making it look better.

### Which portfolio questions should a model never answer?

Anything that allocates money, stops work, or judges a person. Exposure, dependency, the arithmetic of slip, which benefit forecasts have gone quiet: fair questions, and a ready record supports them. Which initiatives to cancel is a different kind of question, because its legitimacy comes from a named person having decided it and being answerable afterwards.

## Where this comes from

We build TruMandate, a portfolio governance platform for government entities and large enterprises in the UAE and Saudi Arabia. Readiness is not something we added for AI. It is what holding objectives, initiatives, measures, benefits and the links between them as one record turned out to require.
