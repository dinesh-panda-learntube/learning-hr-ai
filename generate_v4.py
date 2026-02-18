
import json

# Data mapping for V4 rewrites
# Structure: (sim_id, step_id) -> { 'theory': text, 'question_type': type, 'question': ..., 'options': ... }

V4_CONTENT = {
    "SIM_01": {
        1: {
            "theory": {
                "title": "Context Injection Strategy",
                "key_points": [
                    "**Context Injection** basically means we stop asking the AI to guess stuff. It's a method used widely in top-tier tech companies because it stops the AI from lying, or 'hallucinating', when it doesn't have the facts.",
                    "**Common Mistake:** When AI invents details (e.g., 'ping pong tables') because it lacks context.",
                    "**Best Practice:** Never say 'Describe our culture'. Instead, paste your 'Values' page."
                ]
            },
            "instruction_question": "The prompt asks AI to 'describe' culture without data, leading to **Hallucination**. Identify the error.",
            "prompt_text": "Act as an expert recruiter. Write a comprehensive job description for a Senior Data Scientist role at {{1}}our Series B fintech startup{{/1}}. Use a professional but engaging tone. {{2}}Include sections for: Introduction, Responsibilities (Python, SQL, AWS){{/2}}. {{0}}Describe our unique and amazing company culture in detail{{/0}}.",
            "clickable_options": [
                "Describe our unique and amazing company culture in detail",
                "our Series B fintech startup",
                "Include sections for: Introduction, Responsibilities (Python, SQL, AWS)"
            ],
            "correct_option_index": 0,
            "interaction_type": "clickable_prompt",
            "outcomes": {
                "correct": "Correct. This forces **Hallucination**. Without injected context (values/mission), AI invents generic tropes.",
                "partially_correct": "Context is good. The error is the instruction requiring invention.",
                "incorrect": "Structure is standard. Look for the command requiring knowledge AI doesn't have."
            },
            "immediate_feedback": "Without data, AI hallucinates. Inject context first."
        },
        2: {
            "theory": {
                "title": "Constraint-Based Prompting",
                "key_points": [
                    "**Constraint-Based Prompting** is all about setting boundaries. We use this in the industry because large language models are trained on the entire internet—which means they've learned every human stereotype and bias.",
                    "**Common Mistake:** Stereotypes hidden in the AI's training data (e.g., Engineer = Male).",
                    "**Best Practice:** Use negative constraints: 'Do not use gender-coded words'."
                ]
            },
            "instruction_question": "To prevent **Latent Bias**, add a constraint to this prompt. Choose the elite syntax.",
            "interaction_type": "fill_blank",
            "prompt_template": "Write a JD for a Developer. [____] like 'rockstar' or 'ninja'. Focus on skills.",
            "blank_options": [
                "Explicitly avoid gender-coded terms",
                "Try not to use cool words",
                "Make it sound professional",
                "Don't be biased"
            ],
            "correct_answer_index": 0,
            "outcomes": {
                "correct": "Correct. Explicit constraints ('Avoid X') are stronger than vague requests ('Be professional').",
                "partially_correct": "Too vague. AI needs specific constraints.",
                "incorrect": "Undefined instruction."
            },
            "immediate_feedback": "Unconstrained prompts leak bias. Be explicit."
        },
        3: {
            "theory": {
                "title": "Outcome-Focus vs Credentialism",
                "key_points": [
                    "**Outcome-Focus** is a shift away from old-school hiring. We focus on what candidates can *do* rather than where they studied, because elite degrees don't always equal elite performance.",
                    "**Common Mistake:** Over-reliance on degrees/titles as proxies for skill (creates False Negatives).",
                    "**Best Practice:** Prompt for 'Demonstrated ability to [X]' not 'Degree in [Y]'."
                ]
            },
            "instruction_question": "Avoid **Credentialism** by refining the requirements section.",
            "interaction_type": "fill_blank",
            "prompt_template": "Requirements: [____] instead of specific degrees or years of tenure.",
            "blank_options": [
                "Focus on demonstrated projects and outcomes",
                "Ask for PhDs from top schools",
                "Require 10+ years experience",
                "List every possible certification"
            ],
            "correct_answer_index": 0,
            "outcomes": {
                "correct": "Correct. Focusing on outcomes reduces false negatives from non-traditional backgrounds.",
                "partially_correct": "Reinforces credentialism.",
                "incorrect": "Creates barriers for skilled talent."
            },
            "immediate_feedback": "Credentials != Competence. Prompt for outcomes."
        },
        4: {
            "theory": {
                "title": "Zero-Shot Neutrality",
                "key_points": [
                    "**Zero-Shot Neutrality** is a technique to fix bias before the AI even starts writing. It's cheaper and faster than editing later, effectively cutting off bias at the source.",
                    "**Common Mistake:** Language that unconsciously signals a specific gender (e.g., 'He', 'Aggressive').",
                    "**Best Practice:** Force neutrality: 'Refer to the applicant as The Candidate'."
                ]
            },
            "instruction_question": "This prompt introduces **Gender Coding**. Identify the biased instruction.",
            "prompt_text": "Draft a requirement list for a {{1}}Lead Developer{{/1}}. {{0}}He needs to be a strong leader{{/0}} who can manage the team. Focus on {{2}}React and Node.js skills{{/2}}.",
            "clickable_options": [
                "He needs to be a strong leader",
                "Lead Developer",
                "React and Node.js skills"
            ],
            "correct_option_index": 0,
            "interaction_type": "clickable_prompt",
            "outcomes": {
                "correct": "Correct. Using 'He' primes the AI to generate masculine text. Use 'The Candidate'.",
                "partially_correct": "Title is neutral.",
                "incorrect": "Skills are neutral."
            },
            "immediate_feedback": "Pronouns in prompts dictate output gender."
        },
        5: {
            "theory": {
                "title": "A/B Prompt Testing",
                "key_points": [
                    "**A/B Testing** isn't just for marketing—it's for prompts too. We use it to stop guessing and start measuring, ensuring that our recruiting messages actually land with the best talent.",
                    "**Common Mistake:** The single element you change between versions to measure effect.",
                    "**Best Practice:** Generate 3 variants changing ONLY the Tone or Emphasis."
                ]
            },
            "instruction_question": "We want to test which tone attracts more applicants. Choose the correct **Variable Parameter** setup.",
            "interaction_type": "fill_blank",
            "prompt_template": "Generate 3 JD variants. Keep skills constant. Vary the [____] to test appeal.",
            "blank_options": [
                "Tone: Narrative vs List vs Challenge",
                "Salary range randomly",
                "Job Title entirely",
                "Company Name"
            ],
            "correct_answer_index": 0,
            "outcomes": {
                "correct": "Correct. Testing Tone (Variable) while keeping content constant validates the impact.",
                "partially_correct": "Changing salary invalidates the content test.",
                "incorrect": "Too chaotic to measure."
            },
            "immediate_feedback": "Test one variable at a time."
        }
    },
    "SIM_02": {
        1: {
            "theory": {
                "title": "Structured Data Extraction",
                "key_points": [
                    "**Structured Data Extraction** turns messy chat into usable data. In HR, this is critical because comparing paragraphs of text is impossible, but comparing rows in a table is instant.",
                    "**Common Mistake:** Free text (paragraphs) that is hard to compare or filter.",
                    "**Best Practice:** Force output format: 'Output as JSON' or 'Output as CSV table'."
                ]
            },
            "instruction_question": "This prompt invites **Unstructured Data**. Identify the weak instruction.",
            "prompt_text": "Review this resume for {{1}}Product Management fit{{/1}}. {{2}}Check specifically for agile experience{{/2}}. {{0}}Let me know your thoughts{{/0}} on the candidate.",
            "clickable_options": [
                "Let me know your thoughts",
                "Product Management fit",
                "Check specifically for agile experience"
            ],
            "correct_option_index": 0,
            "interaction_type": "clickable_prompt",
            "outcomes": {
                "correct": "Correct. 'Thoughts' results in essays. Ask for 'Score (1-10)' or 'Table'.",
                "partially_correct": "Role is clear.",
                "incorrect": "Criteria is clear."
            },
            "immediate_feedback": "Don't ask for thoughts; ask for Data."
        },
        2: {
            "theory": {
                "title": "Skills-First Filtering",
                "key_points": [
                    "**Skills-First Filtering** is a way to look past the resume timeline. Industry leaders use this to find hidden gems who might have employment gaps but possess world-class technical skills.",
                    "**Common Mistake:** The unconscious bias to reject candidates with employment breaks.",
                    "**Best Practice:** Instruct AI: 'Ignore employment dates; score based on project complexity'."
                ]
            },
            "instruction_question": "This instruction enforces a **Gap Penalty**. Identify the bias.",
            "prompt_text": "Screen these resumes for the {{1}}Account Manager role{{/1}}. {{0}}Reject anyone with gaps over 6 months{{/0}}. Focus on {{2}}B2B sales experience{{/2}}.",
            "clickable_options": [
                "Reject anyone with gaps over 6 months",
                "Account Manager role",
                "B2B sales experience"
            ],
            "correct_option_index": 0,
            "interaction_type": "clickable_prompt",
            "outcomes": {
                "correct": "Correct. Gaps don't equal incompetence. Filter by skill, not timeline.",
                "partially_correct": "Role is fine.",
                "incorrect": "Skill requirement is valid."
            },
            "immediate_feedback": "Filter by 'What', not 'When'."
        },
        3: {
            "theory": {
                "title": "Transferable Skill Mapping",
                "key_points": [
                    "**Transferable Skill Mapping** helps us hire for potential. It's used heavily because the best talent often comes from non-traditional backgrounds, like a teacher becoming a great customer success manager.",
                    "**Common Mistake:** Careers that switch domains (e.g., Teacher -> Trainer -> HR).",
                    "**Best Practice:** Prompt AI to map 'Adjacent Skills' (Server -> Customer Success)."
                ]
            },
            "instruction_question": "Capture **Non-Linear Paths** by refining the evaluation criteria.",
            "interaction_type": "fill_blank",
            "prompt_template": "Evaluate candidates based on [____] rather than exact job titles.",
            "blank_options": [
                "Transferable skills and outcomes",
                "Ivy League education",
                "Previous job titles",
                "Keywords matching exactly"
            ],
            "correct_answer_index": 0,
            "outcomes": {
                "correct": "Correct. This captures high-potential talent from other industries.",
                "partially_correct": "Too restrictive.",
                "incorrect": "Ignores transferability."
            },
            "immediate_feedback": "Map skills, don't just match titles."
        },
        4: {
            "theory": {
                "title": "Flagging vs Rejection",
                "key_points": [
                    "**Flagging vs Rejection** is about keeping humans in the loop. We use this because AI lacks nuance—it might reject a genius just because they don't fit a standard box.",
                    "**Common Mistake:** Incorrectly flagging a good candidate as 'bad' (or vice versa).",
                    "**Best Practice:** Don't auto-reject outliers (like overqualified). 'Flag for Review' instead."
                ]
            },
            "instruction_question": "Avoid **False Positives** with overqualified candidates. Choose the right logic.",
            "interaction_type": "fill_blank",
            "prompt_template": "If candidate exceeds requirements by 5+ years, [____].",
            "blank_options": [
                "Flag as 'Senior Potential' for manual review",
                "Auto-reject for flight risk",
                "Downgrade their score",
                "Ignore the extra experience"
            ],
            "correct_answer_index": 0,
            "outcomes": {
                "correct": "Correct. Keep them in the pool but tag them for specific conversation.",
                "partially_correct": "Eliminates potential talent.",
                "incorrect": "Wastes data."
            },
            "immediate_feedback": "Flag outliers; don't delete them."
        },
        5: {
            "theory": {
                "title": "Algorithmic Audit",
                "key_points": [
                    "**Algorithmic Auditing** is our safety check. We do this to ensure our AI isn't secretly favoring one demographic over another, keeping us compliant and fair.",
                    "**Common Mistake:** When a neutral rule unintentionally hurts one protected group more.",
                    "**Best Practice:** Compare 'Pass Rate' across demographics to detect hidden bias."
                ]
            },
            "instruction_question": "We need to check for **Disparate Impact**. How should we audit the AI results?",
            "interaction_type": "fill_blank",
            "prompt_template": "Analyze the shortlist variances by comparing [____] against the rejected pool.",
            "blank_options": [
                "demographic pass rates",
                "resume length",
                "file formats",
                "time submitted"
            ],
            "correct_answer_index": 0,
            "outcomes": {
                "correct": "Correct. If 50% of men pass but only 10% of women, you have Disparate Impact.",
                "partially_correct": "Irrelevant metric.",
                "incorrect": "Irrelevant metric."
            },
            "immediate_feedback": "Audit the *rates* by group."
        }
    },
    "SIM_03": {
        1: {
            "theory": {
                "title": "Behavioral Event Interviewing (BEI)",
                "key_points": [
                    "**Behavioral Event Interviewing (BEI)** is the gold standard for predicting performance. It works because past behavior is the only reliable predictor of future action, unlike hypothetical wishes.",
                    "**Common Mistake:** Question types that allow for rehearsed or fake answers.",
                    "**Best Practice:** Never ask 'What would you do?'. Ask 'Tell me about a time you did...'."
                ]
            },
            "instruction_question": "This instruction solicits hypotheticals, not **BEI**. Identify the error.",
            "prompt_text": "Generate interview questions for {{1}}Stakeholder Management{{/1}}. {{0}}Ask typical questions about problems{{/0}}. Use {{2}}STAR format{{/2}}.",
            "clickable_options": [
                "Ask typical questions about problems",
                "Stakeholder Management",
                "Use STAR format"
            ],
            "correct_option_index": 0,
            "interaction_type": "clickable_prompt",
            "outcomes": {
                "correct": "Correct. 'Typical questions' usually means generic hypotheticals. Ask for 'Specific Incidents'.",
                "partially_correct": "Topic is fine.",
                "incorrect": "STAR is the goal."
            },
            "immediate_feedback": "Hypotheticals = Lies. Ask for History."
        },
        2: {
            "theory": {
                "title": "Anchored Rating Scales",
                "key_points": [
                    "**Anchored Rating Scales** eliminate guesswork in scoring. We use these because 'a good answer' means something different to everyone, but 'provided 3 examples' is a hard fact.",
                    "**Common Mistake:** The consistency of scores between different interviewers.",
                    "**Best Practice:** Define anchors: '5 = Achieved X impact'; '3 = Attempted X'."
                ]
            },
            "instruction_question": "Improve **Inter-Rater Reliability** by defining the top score anchor.",
            "interaction_type": "fill_blank",
            "prompt_template": "Define Score 5 as: Candidate provides [____] of business impact.",
            "blank_options": [
                "concrete, quantitative evidence",
                "a good feeling",
                "theoretical understanding",
                "perfect answers"
            ],
            "correct_answer_index": 0,
            "outcomes": {
                "correct": "Correct. Anchors must be observable facts, not feelings.",
                "partially_correct": "Too subjective.",
                "incorrect": "Too vague."
            },
            "immediate_feedback": "Define the evidence, not the vibe."
        },
        3: {
            "theory": {
                "title": "Recursive Probing",
                "key_points": [
                    "**Recursive Probing** is how we dig for the truth. Candidates often give polished, rehearsed answers; recursive probing forces them to reveal the messy, real details underneath.",
                    "**Common Mistake:** A polished, high-level answer that hides the messy details.",
                    "**Best Practice:** Prompt AI to generate: 'If answer is general, ask: What specifically did YOU do?'"
                ]
            },
            "instruction_question": "Candidates often give **Surface Responses**. Set a probe to dig deeper.",
            "interaction_type": "fill_blank",
            "prompt_template": "If the candidate says 'We launched', ask [____].",
            "blank_options": [
                "What was your specific role in that launch?",
                "That sounds great!",
                "What happened next?",
                "Can you elaborate?"
            ],
            "correct_answer_index": 0,
            "outcomes": {
                "correct": "Correct. The 'We' trap hides individual contribution. Probe for 'I'.",
                "partially_correct": "Too polite.",
                "incorrect": "Vague."
            },
            "immediate_feedback": "Probe for the 'I' in 'We'."
        },
        4: {
            "theory": {
                "title": "Compliance Guardrails",
                "key_points": [
                    "**Compliance Guardrails** keep us out of court. AI doesn't know labor laws by default, so we have to explicitly forbid it from asking illegal questions about age or family.",
                    "**Common Mistake:** Groups protected by law (Age, Race, Family Status, etc.).",
                    "**Best Practice:** Hard constraint: 'Do not ask about personal life, kids, or age'."
                ]
            },
            "instruction_question": "This question violates **Protected Class** laws. Identify it.",
            "prompt_text": "Create an interview script for a {{1}}Sales Manager{{/1}}. {{0}}Ask if they are planning to have kids soon{{/0}} (for scheduling). {{2}}Check if they can travel 50% of the time{{/2}}.",
            "clickable_options": [
                "Ask if they are planning to have kids soon",
                "Sales Manager",
                "Check if they can travel 50% of the time"
            ],
            "correct_option_index": 0,
            "interaction_type": "clickable_prompt",
            "outcomes": {
                "correct": "Correct. Family status is a Protected Class. Asking causes liability.",
                "partially_correct": "Role is fine.",
                "incorrect": "Travel is a valid job requirement."
            },
            "immediate_feedback": "Never ask about family. Focus on availability."
        },
        5: {
            "theory": {
                "title": "Structured Interview Protocol",
                "key_points": [
                    "**Structured Interview Protocol** ensures that every candidate gets a fair shot. By strictly timing each section, we stop charismatic talkers from dominating the clock and focus on the skills.",
                    "**Common Mistake:** Strictly allocating minutes to each section to prevent rambles.",
                    "**Best Practice:** Guide: '10 min for Skill A, 10 min for Skill B'. No overruns."
                ]
            },
            "instruction_question": "Ensure fairness using **Time-Boxing**. Complete the prompt.",
            "interaction_type": "fill_blank",
            "prompt_template": "Structure the guide with [____] for each competency to ensure equal opportunity.",
            "blank_options": [
                "equal, strict time limits",
                "approximate timing",
                "flexible open time",
                "as much time as needed"
            ],
            "correct_answer_index": 0,
            "outcomes": {
                "correct": "Correct. Without time limits, charismatic candidates hog the clock.",
                "partially_correct": "Allows bias.",
                "incorrect": "Unfair."
            },
            "immediate_feedback": "Fairness = Standardized Time."
        }
    }
}

try:
    with open('v3.json', 'r') as f:
        data = json.load(f)

    # Update data structure
    for sim in data['simulations']:
        sim_id = sim['simulation_metadata']['simulation_id']
        if sim_id in V4_CONTENT:
            for step in sim['step_level_design']:
                step_id = step['step_id']
                if step_id in V4_CONTENT[sim_id]:
                    # Transformation Logic
                    new_content = V4_CONTENT[sim_id][step_id]
                    
                    # Update Theory (Mentor Notes)
                    step['theory_content'] = new_content['theory']
                    
                    # Update Questions
                    step['interaction_type'] = new_content['interaction_type']
                    step['instruction_question'] = new_content['instruction_question']
                    step['outcomes'] = new_content['outcomes']
                    step['immediate_feedback'] = new_content['immediate_feedback']
                    
                    # Handle Clickable Prompt
                    if new_content['interaction_type'] == 'clickable_prompt':
                        step['prompt_text'] = new_content['prompt_text']
                        step['clickable_options'] = new_content['clickable_options']
                        # Remove fill_blank fields if present
                        step.pop('prompt_template', None)
                        step.pop('blank_options', None)
                        step.pop('correct_answer_index', None)
                        # Add explanation usually found
                        step['explain_this_question'] = new_content['outcomes']['correct'] # Fallback
                        
                    # Handle Fill Blank
                    elif new_content['interaction_type'] == 'fill_blank':
                        step['prompt_template'] = new_content['prompt_template']
                        step['blank_options'] = new_content['blank_options']
                        step['correct_answer_index'] = new_content['correct_answer_index']
                        # Remove clickable fields if present
                        step.pop('prompt_text', None)
                        step.pop('clickable_options', None)
                        step.pop('segments', None)
                        step['explain_this_question'] = new_content['outcomes']['correct']

    # Write V4 file
    with open('v4.json', 'w') as f:
        json.dump(data, f, indent=2)
        
    print("V4 Simulation created successfully.")

except Exception as e:
    print(f"Error: {e}")
