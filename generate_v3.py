import json

# Read the V2 simulation file
with open('simulation_v2_1-5.json', 'r') as f:
    v2_data = json.load(f)

# Transform V2 data to V3 format
v3_data = json.loads(json.dumps(v2_data))  # Deep copy

# Transform each step to use new interaction types
# We'll rotate through the three question types
question_types = ['find_error', 'fill_blank', 'violated_principles']

for sim_idx, simulation in enumerate(v3_data['simulations']):
    for step_idx, step in enumerate(simulation['step_level_design']):
        # Determine which question type to use (rotate)
        question_type = question_types[step_idx % 3]
        
        # Store original MCQ data
        original_options = step.get('options_inputs', [])
        theory = step.get('theory_content', {})
        
        # Update interaction type
        step['interaction_type'] = question_type
        
        if question_type == 'find_error':
            # Create find_error format
            # Use first (correct) option as base, mark parts as errors
            base_prompt = original_options[0] if original_options else 'Sample prompt text here.'
            words = base_prompt.split()
            
            # Create segments - mark middle sections as potential errors
            segments = []
            for i, word in enumerate(words):
                is_error = i in [len(words)//3, len(words)//2]  # Mark some as errors
                segments.append({
                    'id': i,
                    'text': word + ' ',
                    'is_error': is_error
                })
            
            step['segments'] = segments
            step['error_explanation'] = step.get('explain_this_question', 'This violates best practices.')
            
        elif question_type == 'fill_blank':
            # Create fill_blank format
            # Take the correct prompt and add a blank
            base_prompt = original_options[0] if original_options else 'Write a job description with [____] requirements.'
            
            # Find a good place to insert blank (look for keywords)
            if 'inclusive' in base_prompt.lower():
                prompt_template = base_prompt.replace('inclusive language', '[____]')
                blank_options = ['inclusive language', 'buzzwords', 'jargon', 'vague terms']
                correct_index = 0
            elif 'specific' in base_prompt.lower():
                prompt_template = base_prompt.replace('specific', '[____]')
                blank_options = ['specific', 'vague', 'generic', 'random']
                correct_index = 0
            else:
                # Default transformation
                words = base_prompt.split()
                if len(words) > 5:
                    blank_pos = len(words) // 2
                    prompt_template = ' '.join(words[:blank_pos]) + ' [____] ' + ' '.join(words[blank_pos+1:])
                    blank_options = [words[blank_pos], 'alternative1', 'alternative2', 'alternative3']
                    correct_index = 0
                else:
                    prompt_template = base_prompt + ' with [____]'
                    blank_options = ['clear criteria', 'vague terms', 'buzzwords', 'jargon']
                    correct_index = 0
            
            step['prompt_template'] = prompt_template
            step['blank_options'] = blank_options
            step['correct_answer_index'] = correct_index
            
        elif question_type == 'violated_principles':
            # Create violated_principles format
            # Use worst option as problematic prompt
            problematic = original_options[-1] if len(original_options) > 1 else 'Write a job description.'
            
            # Extract principles from theory key_points
            principles = theory.get('key_points', [])
            if not principles:
                principles = [
                    'Be specific and clear',
                    'Use inclusive language',
                    'Set clear constraints',
                    'Avoid jargon and buzzwords'
                ]
            
            # Mark which are violated (for simple case, mark last 2)
            violated = [len(principles) - 2, len(principles) - 1] if len(principles) >= 2 else [0]
            
            step['problematic_prompt'] = problematic
            step['available_principles'] = principles
            step['violated_principle_indices'] = violated

# Write V3 simulation file
with open('simulation_v3_1-5.json', 'w') as f:
    json.dump(v3_data, f, indent=2)

print('✅ Created simulation_v3_1-5.json with new interaction types')
print(f'Total simulations: {len(v3_data["simulations"])}')
for idx, sim in enumerate(v3_data['simulations']):
    print(f'  Simulation {idx+1}: {len(sim["step_level_design"])} steps transformed')
