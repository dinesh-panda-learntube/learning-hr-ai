WEB FLOW / UX GENERATION PROMPT (REWRITTEN)

Purpose of this Prompt

Generate a mobile-first web experience that runs a Job-Readiness Simulation from a provided JSON config.
The experience must feel like:

handling a real work situation, not taking a test or course.

CORE UX OBJECTIVE

* The user should feel:
    * “I am making real HR Manager decisions”
    * “This is how interviews and early job challenges feel”
* The UI must never distract from the current decision
* The user should always know:
    * where they are
    * what action is required
    * what happens next

UX CONTRACT (NON-NEGOTIABLE)

1. The UI must prioritise completion over exploration.
2. At any moment, the user should process only one decision.
3. No screen should feel informational or instructional.
4. The experience must work smoothly one-handed on mobile.
5. Progress must feel fast, even if the simulation is long.

ATTENTION BUDGET RULE (CRITICAL)

At any step, the screen may contain only:

* 1 instruction or question
* 1 interactive artefact OR options block
* 1 primary CTA (or auto-advance)

Anything else must be:

* hidden
* collapsible
* delayed

SCREEN-LEVEL FLOW (STRICT)

Screen 1: Start Hook Card (10–20 seconds max)

Purpose: Immediate commitment, no friction.
Must include (above the fold):

* Target role assertion

“You’re stepping into an HR Manager role”

* Credibility claim

“Top MNCs look for thinking, not theory”

* Time commitment

“15 minutes · real job decisions”

* Proof promise

“You’ll prove: judgment, communication, crisis handling”

* Primary CTA (sticky): Start Now

Rules

* No secondary CTAs
* No scrolling required
* Tap → immediate transition

Screen 2: Scenario Setup (10–20 seconds)

Purpose: Context, not exposition.
Must include:

* Scenario title
* One-paragraph workplace context
* Stakes implied, not explained

Rules

* Same typography as questions (no visual hierarchy shift)
* No “Next” button — auto-advance into first step

Screen 3: Step Loop (15–20 steps)

This is the core experience.
Step Composition Rules
Each step must contain:

1. Instruction / Question

    * Written as a work action
    * No academic language
    * Example:

“Draft the message you’ll send to leadership.”

1. Interactive Artefact OR Options

    * One only
    * Never both visible simultaneously

1. Primary Interaction

    * MCQ
    * ordering
    * selection
    * trade-off meters
    * diagram completion
    * text selection / highlighting

Artefact Interaction Rules

* Artefacts must:
    * feel incomplete at first
    * visually change when interacted with
    * respond immediately to taps
* Use animation to show:
    * cause → effect
    * decision → outcome

Examples

* Email draft fills in
* Workflow highlights next step
* Chart bars move with trade-off sliders

Early Momentum Rule (Enforced)

* First 3–4 steps must:
    * require minimal reading
    * be answerable in <30 seconds each
    * produce visible artefact change

No emotionally negative feedback before step 4.

Feedback Handling (Critical)

Feedback Replacement Rule

* After a response:
    * options disappear
    * feedback replaces the options area
* Feedback must be:
    * short
    * impact-based
    * framed as consequences

Examples

* “This builds leadership trust.”
* “This increases legal risk.”
* “This delays resolution.”

Auto-Advance Rule

* Feedback remains visible for:
    * 3–7 seconds (adaptive)
* A visible timeout bar indicates transition
* No confirmation click required

Mentor Explanations (On-Demand Only)

* Mentor explanations:
    * appear only when tapped
    * sit between question and options
    * never block progression

Used to:

* explain trade-offs
* clarify why something matters

Screen 4: End-of-Scenario Closure

Purpose: Mini-win + reset attention.
Must include:

* “What happened because of your decisions”
* Final state of the artefact
* One-line reflection:

“This is the kind of situation HR Managers are evaluated on.”

Primary CTA: Next Scenario

Screen 5: End-of-Simulation Results

Purpose: Satisfaction + retention.
Must be instantly scannable:

* Skillions earned (or equivalent)
* Proven competencies (chips)
* Deliverables unlocked
    * certifications
    * badges
    * recruiter-readable proof
* What’s still locked (preview)

Primary CTA (sticky):

Continue & unlock next scenario

Optional Exploration (De-Emphasised)

May include:

* “Explore other companies”
* “Specialise in a role type”

Rules:

* Must be visually secondary
* Must not compete with continuation CTA

PROGRESS & MOTIVATION SIGNALING

* Show progress at:
    * step level (within scenario)
    * scenario level (within simulation)
* Do NOT show:
    * total path progress during a simulation
* Each scenario completion must feel like:

“One more real situation handled.”

UI STYLE CONSTRAINTS (APPLIED AFTER FLOW)

* Mobile-first responsive layout
* Dark theme: #0D2436
* CTA: #7FC241
* Highlights: #406AFF
* Touch targets ≥ 40px
* Sticky CTAs where continuation matters

WHAT NOT TO GENERATE

* No teaching screens
* No long explanations
* No modal confirmations after answers
* No skill definitions on main flow

OUTPUT REQUIREMENT

Generate:
Do not generate:
