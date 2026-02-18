// React and hooks are available globally via CDN in index.html
const { useState, useEffect, useCallback } = React;

// Helper components defined as window properties to ensure they are available to each other
window.ProgressTimer = ({ duration, color, onComplete }) => {
  const COLORS = window.COLORS;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); onComplete?.(); return 100; }
        return prev + (100 / (duration / 50));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [duration, onComplete]);
  return (
    <div style={{ height: '3px', background: COLORS.bgLight, borderRadius: '2px', overflow: 'hidden', marginTop: '16px' }}>
      <div style={{ height: '100%', width: `${progress}%`, background: color || COLORS.highlight, transition: 'width 50ms linear' }} />
    </div>
  );
};

window.CandidateCard = ({ candidate, selected, onSelect, showRisks, selectedRisks, onRiskToggle, compact }) => {
  const COLORS = window.COLORS;
  const RISK_FLAGS = window.RISK_FLAGS;
  const matchColor = candidate.match >= 80 ? COLORS.success : candidate.match >= 60 ? '#F59E0B' : COLORS.warning;
  return (
    <div onClick={() => !showRisks && onSelect?.(candidate.id)} style={{ background: selected ? COLORS.highlightSoft : COLORS.bgCard, border: `2px solid ${selected ? COLORS.highlight : 'transparent'}`, borderRadius: '12px', padding: compact ? '12px' : '16px', cursor: showRisks ? 'default' : 'pointer', transition: 'all 0.2s ease', marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 600, fontSize: '15px', color: COLORS.text }}>{candidate.name}</span>
            {selected && !showRisks && <span style={{ background: COLORS.highlight, color: COLORS.text, fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>SELECTED</span>}
          </div>
          <div style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '6px' }}>{candidate.role} · {candidate.company}</div>
        </div>
        {candidate.match && <div style={{ background: `${matchColor}20`, color: matchColor, fontWeight: 700, fontSize: '14px', padding: '6px 10px', borderRadius: '8px', minWidth: '48px', textAlign: 'center' }}>{candidate.match}%</div>}
      </div>
      {showRisks && <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{RISK_FLAGS.map(flag => { const isSelected = selectedRisks[candidate.id]?.includes(flag.id); return <button key={flag.id} onClick={() => onRiskToggle(candidate.id, flag.id)} style={{ background: isSelected ? COLORS.warningBg : COLORS.bgLight, border: `1px solid ${isSelected ? COLORS.warning : 'transparent'}`, color: isSelected ? COLORS.warning : COLORS.textMuted, fontSize: '11px', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s ease' }}><span>{flag.icon}</span>{flag.label}</button>; })}</div>}
    </div>
  );
};

window.EmailPreview = ({ from, subject, body, isReply, critical }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '12px', overflow: 'hidden', border: critical ? `1px solid ${COLORS.warning}` : 'none', marginBottom: '20px' }}>
      <div style={{ background: critical ? COLORS.warningBg : COLORS.bgLight, padding: '12px 16px', borderBottom: `1px solid ${COLORS.bg}` }}>
        <div style={{ fontSize: '11px', color: COLORS.textDim, marginBottom: '4px' }}>{isReply ? 'RE: ' : 'FROM: '}{from}</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text }}>{subject}</div>
      </div>
      <div style={{ padding: '16px', fontSize: '13px', color: COLORS.textMuted, lineHeight: 1.6 }}>{body}</div>
    </div>
  );
};

window.OptionButton = ({ label, selected, onClick, disabled }) => {
  const COLORS = window.COLORS;
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: '100%', padding: '16px 18px', background: selected ? COLORS.highlightSoft : COLORS.bgCard, border: `2px solid ${selected ? COLORS.highlight : 'transparent'}`, borderRadius: '12px', cursor: disabled ? 'not-allowed' : 'pointer', textAlign: 'left', marginBottom: '10px', transition: 'all 0.15s ease', opacity: disabled ? 0.5 : 1 }}>
      <span style={{ fontSize: '14px', color: COLORS.text, lineHeight: 1.5 }}>{label}</span>
    </button>
  );
};

window.MarkdownText = ({ text, boldColor }) => {
  if (!text) return null;
  if (typeof text !== 'string') return text;

  // Split by **
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.slice(2, -2);
          
          let color;
          if (boldColor) {
             color = boldColor;
          } else {
             // Default logic
             const isLabel = ['Issue:', 'Solution:', 'Common Mistake:', 'Best Practice:'].includes(content.trim());
             color = isLabel ? '#FFFFFF' : window.COLORS.highlight;
          }

          return <strong key={i} style={{ color: color, fontWeight: 700 }}>{content}</strong>;
        }
        return part;
      })}
    </span>
  );
};

window.TheoryCard = ({ theoryContent }) => {
  const COLORS = window.COLORS;
  // Always expanded, no card container
  if (!theoryContent) return null;

  const { title, key_points } = theoryContent;

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Title removed as requested */}
      
      {/* Key Points */}
      {key_points && key_points.length > 0 && (
        <div style={{ paddingLeft: '8px' }}>
          {key_points.map((point, idx) => {
            let icon = null;
            if (idx !== 0) {
               icon = (
                <span style={{
                  color: COLORS.highlight,
                  fontSize: '16px',
                  marginTop: '1px',
                  flexShrink: 0,
                  opacity: 0.8
                }}>•</span>
               );
            }
            
            if (point.includes('**Common Mistake:**')) {
               icon = (
                 <div style={{
                   width: '18px', height: '18px',
                   background: COLORS.warning,
                   borderRadius: '50%',
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   marginTop: '2px', flexShrink: 0
                 }}>
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                     <line x1="18" y1="6" x2="6" y2="18"></line>
                     <line x1="6" y1="6" x2="18" y2="18"></line>
                   </svg>
                 </div>
               );
            } else if (point.includes('**Best Practice:**')) {
               icon = (
                 <div style={{
                   width: '18px', height: '18px',
                   background: COLORS.success,
                   borderRadius: '50%',
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   marginTop: '2px', flexShrink: 0
                 }}>
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                     <polyline points="20 6 9 17 4 12"></polyline>
                   </svg>
                 </div>
               );
            }

            return (
            <div key={idx} style={{
              display: 'flex',
              gap: icon ? '12px' : '0',
              marginBottom: idx === key_points.length - 1 ? '0' : '12px',
              alignItems: 'flex-start'
            }}>
              {icon}
              <span style={{
                fontSize: '15px',
                color: COLORS.text,
                lineHeight: 1.6,
                fontWeight: 400
              }}>
                <window.MarkdownText text={point} />
              </span>
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

// V3 Question Type Components
window.FindErrorQuestion = ({ segments, onAnswer, disabled }) => {
  const COLORS = window.COLORS;
  const [selected, setSelected] = React.useState(null);

  const handleSelect = (segmentId) => {
    if (disabled) return;
    setSelected(segmentId);
    onAnswer?.(segmentId);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        background: COLORS.bgCard,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '13px', color: COLORS.textDim, marginBottom: '12px', textTransform: 'uppercase', fontWeight: 600 }}>
          Click on the problematic part:
        </div>
        <div style={{ fontSize: '14px', color: COLORS.text, lineHeight: 1.8 }}>
          {segments && segments.map((segment) => (
            <span
              key={segment.id}
              onClick={() => handleSelect(segment.id)}
              style={{
                padding: '4px 8px',
                margin: '2px',
                borderRadius: '6px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                background: selected === segment.id ? COLORS.warningBg : 'transparent',
                border: selected === segment.id ? `2px solid ${COLORS.warning}` : '2px solid transparent',
                color: selected === segment.id ? COLORS.warning : COLORS.text,
                transition: 'all 0.2s ease',
                display: 'inline-block',
                opacity: disabled ? 0.6 : 1
              }}
            >
              {segment.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

window.FillBlankQuestion = ({ promptTemplate, blankOptions, onAnswer, disabled }) => {
  const COLORS = window.COLORS;
  const [selected, setSelected] = React.useState(null);

  const handleSelect = (index) => {
    if (disabled) return;
    setSelected(index);
    // Don't auto-submit - wait for button
  };

  const handleSubmit = () => {
    if (selected !== null && !disabled) {
      onAnswer?.(selected);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        background: COLORS.bgCard,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '14px', color: COLORS.text, lineHeight: 1.8, marginBottom: '16px' }}>
          {promptTemplate.split('[____]').map((part, idx, arr) => (
            <React.Fragment key={idx}>
              {part}
              {idx < arr.length - 1 && (
                <span style={{
                  background: COLORS.highlightSoft,
                  color: COLORS.highlight,
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  border: `2px dashed ${COLORS.highlight}`
                }}>
                  {selected !== null ? blankOptions[selected] : '[____]'}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {blankOptions && blankOptions.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={disabled}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: selected === idx ? COLORS.highlightSoft : COLORS.bgCard,
              border: `2px solid ${selected === idx ? COLORS.highlight : 'transparent'}`,
              borderRadius: '12px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
              opacity: disabled ? 0.5 : 1
            }}
          >
            <span style={{ fontSize: '14px', color: COLORS.text, lineHeight: 1.5 }}>{option}</span>
          </button>
        ))}
      </div>

      {/* Submit button */}
      {selected !== null && !disabled && (
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '16px',
            background: COLORS.cta,
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600,
            color: '#0D2436',
            boxShadow: '0 4px 24px rgba(127, 194, 65, 0.3)',
            transition: 'transform 0.1s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Submit Answer
        </button>
      )}
    </div>
  );
};

window.ViolatedPrinciplesQuestion = ({ problematicPrompt, availablePrinciples, onAnswer, disabled }) => {
  const COLORS = window.COLORS;
  const [selectedPrinciples, setSelectedPrinciples] = React.useState([]);

  const togglePrinciple = (index) => {
    if (disabled) return;
    const newSelection = selectedPrinciples.includes(index)
      ? selectedPrinciples.filter(i => i !== index)
      : [...selectedPrinciples, index];
    setSelectedPrinciples(newSelection);
    // Don't auto-submit - wait for button
  };

  const handleSubmit = () => {
    if (!disabled && selectedPrinciples.length > 0) {
      onAnswer?.(selectedPrinciples);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        background: COLORS.warningBg,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        border: `1px solid ${COLORS.warning}40`
      }}>
        <div style={{ fontSize: '12px', color: COLORS.warning, fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>
          ⚠ Problematic Prompt:
        </div>
        <div style={{ fontSize: '14px', color: COLORS.textMuted, lineHeight: 1.6, fontStyle: 'italic' }}>
          "{problematicPrompt}"
        </div>
      </div>

      <div style={{ fontSize: '13px', color: COLORS.textDim, marginBottom: '12px', textTransform: 'uppercase', fontWeight: 600 }}>
        Select ALL violated principles:
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {availablePrinciples && availablePrinciples.map((principle, idx) => {
          const isSelected = selectedPrinciples.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => togglePrinciple(idx)}
              disabled={disabled}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: isSelected ? COLORS.highlightSoft : COLORS.bgCard,
                border: `2px solid ${isSelected ? COLORS.highlight : 'transparent'}`,
                borderRadius: '12px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                opacity: disabled ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                border: `2px solid ${isSelected ? COLORS.highlight : COLORS.textDim}`,
                background: isSelected ? COLORS.highlight : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {isSelected && <span style={{ color: COLORS.text, fontSize: '12px', fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: '14px', color: COLORS.text, lineHeight: 1.5 }}>{principle}</span>
            </button>
          );
        })}
      </div>

      {/* Submit button - no count text */}
      {selectedPrinciples.length > 0 && !disabled && (
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '16px',
            background: COLORS.cta,
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600,
            color: '#0D2436',
            boxShadow: '0 4px 24px rgba(127, 194, 65, 0.3)',
            transition: 'transform 0.1s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Submit Answer
        </button>
      )}
    </div>
  );
};

// New V3 Question Type: Clickable Prompt
// Shows a prompt card with clickable underlined phrases - clicking one proceeds to next question
window.ClickablePromptQuestion = ({ scenarioContext, promptText, clickableOptions, onAnswer, disabled }) => {
  const COLORS = window.COLORS;
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const handleClick = (index) => {
    if (disabled) return;
    onAnswer?.(index);
  };

  // Parse the promptText to identify clickable segments
  // Format: Use {{option_index}} to mark clickable phrases
  // Example: "Please {{0}}review{{/0}} or {{1}}schedule{{/1}}"
  const renderPrompt = () => {
    // 1. Find all occurrences of all markers
    const segments = [];
    
    clickableOptions.forEach((option, index) => {
      const startMarker = `{{${index}}}`;
      const endMarker = `{{/${index}}}`;
      const startIndex = promptText.indexOf(startMarker);
      const endIndex = promptText.indexOf(endMarker);
      
      if (startIndex !== -1 && endIndex !== -1) {
        segments.push({
          start: startIndex,
          end: endIndex + endMarker.length,
          contentStart: startIndex + startMarker.length,
          contentEnd: endIndex,
          index: index,
          type: 'clickable'
        });
      }
    });

    // 2. Sort segments by position in formatting string
    segments.sort((a, b) => a.start - b.start);

    // 3. Build the final parts array
    const parts = [];
    let lastIndex = 0;

    segments.forEach((seg, i) => {
      // Add plain text before this segment
      if (seg.start > lastIndex) {
        parts.push({
          type: 'text',
          content: promptText.substring(lastIndex, seg.start),
          key: `text-${lastIndex}`
        });
      }

      // Add the clickable segment
      parts.push({
        type: 'clickable',
        content: promptText.substring(seg.contentStart, seg.contentEnd),
        optionIndex: seg.index,
        key: `clickable-${seg.index}`
      });

      lastIndex = seg.end;
    });

    // Add remaining plain text
    if (lastIndex < promptText.length) {
      parts.push({
        type: 'text',
        content: promptText.substring(lastIndex),
        key: `text-end`
      });
    }
    
    return parts.map(part => {
      if (part.type === 'text') {
        return <span key={part.key}>{part.content}</span>;
      } else {
        const isHovered = hoveredIndex === part.optionIndex;
        return (
          <span
            key={part.key}
            onClick={() => handleClick(part.optionIndex)}
            onMouseEnter={() => setHoveredIndex(part.optionIndex)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              textDecoration: 'underline',
              textDecorationColor: COLORS.highlight,
              textDecorationThickness: '2px',
              textUnderlineOffset: '3px',
              color: isHovered ? COLORS.highlight : COLORS.text,
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              background: isHovered ? COLORS.highlightSoft : 'transparent',
              padding: '2px 4px',
              borderRadius: '4px',
              opacity: disabled ? 0.5 : 1
            }}
          >
            {part.content}
          </span>
        );
      }
    });
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Scenario Context - Blended with Question */}
      {scenarioContext && (
        <div style={{
          fontSize: '15px',
          color: COLORS.textMuted,
          lineHeight: 1.6,
          marginBottom: '24px',
          fontStyle: 'italic',
          opacity: 0.85,
          borderLeft: `3px solid ${COLORS.highlight}40`,
          paddingLeft: '12px'
        }}>
          {scenarioContext}
        </div>
      )}

      {/* Instruction Header */}
      <div style={{ 
        fontSize: '12px', 
        color: COLORS.textMuted, 
        fontWeight: 600, 
        textAlign: 'center', 
        marginBottom: '12px' 
      }}>
        Click the error phrase in the prompt
      </div>

      {/* Prompt Card with Clickable Phrases */}
      <div style={{
        background: COLORS.bgCard,
        borderRadius: '12px',
        padding: '24px',
        border: `1px solid ${COLORS.bgLight}`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: COLORS.textDim, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
            💬 YOUR AI PROMPT DRAFT
          </div>
        </div>
        
        <div style={{ 
          fontSize: '16px', 
          color: COLORS.text, 
          lineHeight: 1.9,
          fontFamily: 'Georgia, serif'
        }}>
          "{renderPrompt()}"
        </div>
      </div>
    </div>
  );
};


// Tap Sequence Question Components
window.FillBlanksSequence = ({ template, blankOrder, options, requiredSelections, onComplete, disabled }) => {
  const COLORS = window.COLORS;
  const [selections, setSelections] = React.useState({});
  const [currentBlankIndex, setCurrentBlankIndex] = React.useState(0);

  const currentBlank = blankOrder && blankOrder[currentBlankIndex];
  const allFilled = blankOrder && blankOrder.every(blank => selections[blank]);

  const handleSelectOption = (option) => {
    if (disabled) return;

    const newSelections = { ...selections, [currentBlank]: option };
    setSelections(newSelections);

    // Move to next blank if not at the end
    if (currentBlankIndex < blankOrder.length - 1) {
      setCurrentBlankIndex(currentBlankIndex + 1);
    }

    // Check if all blanks are filled
    const allFilledNow = blankOrder.every(blank => newSelections[blank]);
    if (allFilledNow && onComplete) {
      setTimeout(() => onComplete(newSelections), 300);
    }
  };

  const handleBlankClick = (blankId, index) => {
    if (disabled) return;
    setCurrentBlankIndex(index);
  };

  const renderPromptWithBlanks = () => {
    if (!template) return null;
    let parts = [];
    let remaining = template;

    blankOrder.forEach((blankId, idx) => {
      const blankToken = `[${blankId}]`;
      const splitIndex = remaining.indexOf(blankToken);

      if (splitIndex !== -1) {
        // Add text before blank
        if (splitIndex > 0) {
          parts.push({ type: 'text', content: remaining.substring(0, splitIndex) });
        }

        // Add blank
        parts.push({
          type: 'blank',
          id: blankId,
          index: idx,
          value: selections[blankId]
        });

        remaining = remaining.substring(splitIndex + blankToken.length);
      }
    });

    // Add remaining text
    if (remaining) {
      parts.push({ type: 'text', content: remaining });
    }

    return parts.map((part, i) => {
      if (part.type === 'text') {
        return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part.content}</span>;
      } else {
        const isActive = part.index === currentBlankIndex;
        const isFilled = !!part.value;

        return (
          <span
            key={i}
            onClick={() => handleBlankClick(part.id, part.index)}
            style={{
              display: 'inline-block',
              minWidth: '120px',
              padding: '6px 12px',
              margin: '0 4px',
              borderRadius: '6px',
              background: isActive ? COLORS.highlightSoft : (isFilled ? COLORS.bgCard : COLORS.warningBg),
              border: `2px ${isActive ? 'solid' : 'dashed'} ${isActive ? COLORS.highlight : (isFilled ? COLORS.highlight : COLORS.textDim)}`,
              color: isFilled ? COLORS.text : COLORS.textMuted,
              fontWeight: isFilled ? 600 : 400,
              cursor: disabled ? 'not-allowed' : 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              opacity: disabled ? 0.6 : 1
            }}
          >
            {part.value || `[${part.index + 1}]`}
          </span>
        );
      }
    });
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        background: COLORS.bgCard,
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '13px', color: COLORS.textDim, marginBottom: '12px', textTransform: 'uppercase', fontWeight: 600 }}>
          Tap options in order to fill the blanks:
        </div>
        <div style={{ fontSize: '15px', color: COLORS.text, lineHeight: 2, fontFamily: 'monospace' }}>
          {renderPromptWithBlanks()}
        </div>
      </div>

      {currentBlank && !allFilled && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px' }}>
            Filling blank {currentBlankIndex + 1} of {blankOrder.length}:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {options && options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                disabled={disabled}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: COLORS.bgCard,
                  border: `2px solid transparent`,
                  borderRadius: '10px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  opacity: disabled ? 0.5 : 1,
                  fontSize: '14px',
                  color: COLORS.text
                }}
                onMouseEnter={(e) => !disabled && (e.target.style.border = `2px solid ${COLORS.highlight}`)}
                onMouseLeave={(e) => !disabled && (e.target.style.border = '2px solid transparent')}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {allFilled && (
        <div style={{
          padding: '12px',
          background: COLORS.highlightSoft,
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '13px',
          color: COLORS.highlight,
          fontWeight: 600
        }}>
          ✓ All blanks filled! Proceeding...
        </div>
      )}
    </div>
  );
};

window.FlagAndReplaceSequence = ({ promptText, options, requiredFlags, requiredReplacements, onComplete, disabled }) => {
  const COLORS = window.COLORS;
  const [flaggedLines, setFlaggedLines] = React.useState([]);
  const [selectedReplacements, setSelectedReplacements] = React.useState([]);
  const [phase, setPhase] = React.useState('flag'); // 'flag' or 'replace'

  const promptLines = promptText ? promptText.split('\n').filter(line => line.trim()) : [];
  const flagPhaseComplete = flaggedLines.length === requiredFlags;
  const replacePhaseComplete = selectedReplacements.length === requiredReplacements;
  const allComplete = flagPhaseComplete && replacePhaseComplete;

  React.useEffect(() => {
    if (flagPhaseComplete && phase === 'flag') {
      setPhase('replace');
    }
  }, [flagPhaseComplete, phase]);

  React.useEffect(() => {
    if (allComplete && onComplete) {
      setTimeout(() => {
        onComplete({
          flagged: flaggedLines,
          replacements: selectedReplacements
        });
      }, 300);
    }
  }, [allComplete]);

  const handleLineClick = (lineIndex) => {
    if (disabled || phase !== 'flag') return;

    if (flaggedLines.includes(lineIndex)) {
      setFlaggedLines(flaggedLines.filter(i => i !== lineIndex));
    } else if (flaggedLines.length < requiredFlags) {
      setFlaggedLines([...flaggedLines, lineIndex]);
    }
  };

  const handleReplacementClick = (option) => {
    if (disabled || phase !== 'replace') return;

    if (selectedReplacements.includes(option)) {
      setSelectedReplacements(selectedReplacements.filter(o => o !== option));
    } else if (selectedReplacements.length < requiredReplacements) {
      setSelectedReplacements([...selectedReplacements, option]);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Phase indicator */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          flex: 1,
          padding: '8px 12px',
          borderRadius: '8px',
          background: phase === 'flag' ? COLORS.highlightSoft : (flagPhaseComplete ? COLORS.successBg : COLORS.bgCard),
          border: `2px solid ${phase === 'flag' ? COLORS.highlight : (flagPhaseComplete ? COLORS.success : COLORS.textDim)}`,
          fontSize: '12px',
          fontWeight: 600,
          textAlign: 'center',
          color: phase === 'flag' ? COLORS.highlight : (flagPhaseComplete ? COLORS.success : COLORS.textMuted)
        }}>
          {flagPhaseComplete ? '✓' : '1.'} Flag Problems ({flaggedLines.length}/{requiredFlags})
        </div>
        <div style={{
          flex: 1,
          padding: '8px 12px',
          borderRadius: '8px',
          background: phase === 'replace' ? COLORS.highlightSoft : COLORS.bgCard,
          border: `2px solid ${phase === 'replace' ? COLORS.highlight : COLORS.textDim}`,
          fontSize: '12px',
          fontWeight: 600,
          textAlign: 'center',
          color: phase === 'replace' ? COLORS.highlight : COLORS.textMuted,
          opacity: phase === 'flag' ? 0.5 : 1
        }}>
          {replacePhaseComplete ? '✓' : '2.'} Select Fixes ({selectedReplacements.length}/{requiredReplacements})
        </div>
      </div>

      {/* Prompt display with tappable lines */}
      <div style={{
        background: COLORS.bgCard,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '12px', textTransform: 'uppercase', fontWeight: 600 }}>
          {phase === 'flag' ? 'Tap problematic lines:' : 'Problematic lines flagged:'}
        </div>
        {promptLines.map((line, idx) => {
          const isFlagged = flaggedLines.includes(idx);
          const canSelect = phase === 'flag' && !disabled;

          return (
            <div
              key={idx}
              onClick={() => handleLineClick(idx)}
              style={{
                padding: '10px 14px',
                marginBottom: '6px',
                borderRadius: '8px',
                background: isFlagged ? COLORS.warningBg : 'transparent',
                border: `2px solid ${isFlagged ? COLORS.warning : 'transparent'}`,
                cursor: canSelect ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                color: isFlagged ? COLORS.warning : COLORS.text,
                fontWeight: isFlagged ? 600 : 400,
                opacity: disabled ? 0.6 : 1
              }}
            >
              {isFlagged && '⚠ '}{line}
            </div>
          );
        })}
      </div>

      {/* Replacement options */}
      {phase === 'replace' && (
        <div>
          <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
            Select replacement constraints:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {options && options.map((option, idx) => {
              const isSelected = selectedReplacements.includes(option);

              return (
                <button
                  key={idx}
                  onClick={() => handleReplacementClick(option)}
                  disabled={disabled}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: isSelected ? COLORS.highlightSoft : COLORS.bgCard,
                    border: `2px solid ${isSelected ? COLORS.highlight : 'transparent'}`,
                    borderRadius: '10px',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    opacity: disabled ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: `2px solid ${isSelected ? COLORS.highlight : COLORS.textDim}`,
                    background: isSelected ? COLORS.highlight : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isSelected && <span style={{ color: COLORS.text, fontSize: '12px', fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: '14px', color: COLORS.text }}>{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {allComplete && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: COLORS.highlightSoft,
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '13px',
          color: COLORS.highlight,
          fontWeight: 600
        }}>
          ✓ Flags and replacements complete! Proceeding...
        </div>
      )}
    </div>
  );
};

window.TapSequenceQuestion = ({ step, onComplete, disabled }) => {
  // Detect variant based on step data
  if (step.artefact_prompt_template && step.blank_order) {
    // Variant 1: Fill Blanks
    return (
      <window.FillBlanksSequence
        template={step.artefact_prompt_template}
        blankOrder={step.blank_order}
        options={step.options_inputs}
        requiredSelections={step.required_selections}
        onComplete={onComplete}
        disabled={disabled}
      />
    );
  } else if (step.artefact_prompt_displayed && step.required_selections) {
    // Variant 2: Flag and Replace
    return (
      <window.FlagAndReplaceSequence
        promptText={step.artefact_prompt_displayed}
        options={step.options_inputs}
        requiredFlags={step.required_selections.flags}
        requiredReplacements={step.required_selections.replacements}
        onComplete={onComplete}
        disabled={disabled}
      />
    );
  }

  return null;
};


window.FeedbackPanel = ({ type, message, points, outcomeText, percentile, onComplete }) => {
  const COLORS = window.COLORS;
  const ProgressTimer = window.ProgressTimer;
  const isPositive = type === 'correct';
  const isPartial = type === 'partial';

  // "Solved faster than X%" logic - Hide if incorrect
  const speedText = (percentile && type !== 'incorrect') ? `Solved faster than ${percentile}% of candidates` : null;

  // Calculate duration
  const totalLength = (speedText ? speedText.length : 0);
  const duration = Math.max(2500, totalLength * 50);

  return (
    <div onClick={onComplete} style={{ cursor: 'pointer', background: isPositive ? COLORS.successBg : isPartial ? COLORS.highlightSoft : COLORS.warningBg, borderRadius: '12px', padding: '16px', borderLeft: `4px solid ${isPositive ? COLORS.success : isPartial ? COLORS.highlight : COLORS.warning}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '16px', color: isPositive ? COLORS.success : isPartial ? COLORS.highlight : COLORS.warning, fontWeight: 700 }}>{isPositive ? '✓ Strong choice' : isPartial ? '◐ Acceptable' : '✗ Risky approach'}</div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: isPositive ? COLORS.success : isPartial ? COLORS.highlight : COLORS.textMuted }}>{points > 0 ? `+${points} ⚡` : ''}</div>
      </div>

      <div style={{ fontSize: '14px', color: COLORS.text, marginBottom: '12px', lineHeight: 1.5 }}>
        <window.MarkdownText text={message} />
      </div>

      {outcomeText && (
        <div style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '12px', lineHeight: 1.5, background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
          <window.MarkdownText text={outcomeText} />
        </div>
      )}

      {speedText && (
        <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 400, color: COLORS.textMuted }}>
          {speedText}
        </div>
      )}

      <div style={{ fontSize: '12px', color: COLORS.textMuted, marginTop: '8px', fontStyle: 'italic' }}>
        {/* Tap to continue → */}
      </div>

      <ProgressTimer
        duration={duration}
        color={isPositive ? COLORS.success : isPartial ? COLORS.highlight : COLORS.warning}
        onComplete={onComplete}
      />
    </div>
  );
};

window.TradeOffMeters = function ({ meters, onComplete }) {
  const COLORS = window.COLORS;
  const { useState } = React;
  const [values, setValues] = useState(meters.map(m => m.initial || 50));
  const handleChange = (idx, val) => {
    const newValues = [...values];
    newValues[idx] = parseInt(val);
    setValues(newValues);
  };
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
      {meters.map((m, i) => (
        <div key={i} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: COLORS.textMuted }}>{m.label}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: COLORS.highlight }}>{values[i]}%</span>
          </div>
          <input type="range" min="0" max="100" value={values[i]} onChange={(e) => handleChange(i, e.target.value)} style={{ width: '100%', accentColor: COLORS.highlight, cursor: 'pointer' }} />
        </div>
      ))}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px', background: COLORS.bg, zIndex: 10, maxWidth: '600px', margin: '0 auto' }}>
        <button id="tradeoff-confirm" onClick={() => onComplete(values)} style={{ width: '100%', padding: '16px', background: COLORS.cta, border: 'none', borderRadius: '14px', color: '#0D2436', fontWeight: 600, boxShadow: '0 4px 12px rgba(127, 194, 65, 0.3)' }}>Finalise Trade-offs</button>
      </div>
    </div>
  );
};

window.RationaleBuilder = function ({ pool, minSelection = 3, maxSelection = 5, onComplete }) {
  const COLORS = window.COLORS;
  const { useState } = React;
  const [selected, setSelected] = useState([]);
  const toggle = (idx) => {
    const isSelected = selected.includes(idx);
    if (isSelected) setSelected(selected.filter(i => i !== idx));
    else if (selected.length < maxSelection) setSelected([...selected, idx]);
  };
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '11px', color: COLORS.textDim, marginBottom: '12px', textTransform: 'uppercase' }}>Selected {selected.length}/{maxSelection} rationale lines</div>
      <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '8px', marginBottom: '16px', border: `1px solid ${COLORS.bgLight}` }}>
        {selected.length === 0 && <div style={{ padding: '16px', color: COLORS.textDim, fontSize: '13px', fontStyle: 'italic' }}>Select lines to build your rationale...</div>}
        {selected.map(idx => (
          <div key={idx} onClick={() => toggle(idx)} style={{ padding: '12px 14px', background: COLORS.highlightSoft, borderRadius: '8px', marginBottom: '6px', fontSize: '13px', color: COLORS.text, borderLeft: `3px solid ${COLORS.highlight}`, cursor: 'pointer' }}>{pool[idx]}</div>
        ))}
      </div>
      <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '12px' }}>
        {pool.map((line, i) => !selected.includes(i) && (
          <div key={i} onClick={() => toggle(i)} style={{ padding: '12px 14px', background: COLORS.bgLight, borderRadius: '10px', marginBottom: '8px', fontSize: '13px', color: COLORS.textMuted, cursor: 'pointer', opacity: selected.length >= maxSelection ? 0.5 : 1 }}>{line}</div>
        ))}
      </div>
      {selected.length >= minSelection && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px', background: COLORS.bg, zIndex: 10, maxWidth: '600px', margin: '0 auto' }}>
          <button id="rationale-confirm" onClick={() => onComplete(selected)} style={{ width: '100%', padding: '16px', background: COLORS.cta, border: 'none', borderRadius: '14px', color: '#0D2436', fontWeight: 600, boxShadow: '0 4px 12px rgba(127, 194, 65, 0.3)' }}>Send Rationale</button>
        </div>
      )}
    </div>
  );
};

// --- Bonus Timer Component ---
window.BonusTimer = ({ duration = 30, onExpire }) => {
  const COLORS = window.COLORS;
  const [timeLeft, setTimeLeft] = React.useState(duration);

  React.useEffect(() => {
    // If expired, don't tick
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 0.1));
    }, 100);
    return () => clearInterval(interval);
  }, [timeLeft, onExpire]);

  if (timeLeft <= 0) return null;

  const widthPercent = (timeLeft / duration) * 100;

  return (
    <div style={{ position: 'relative', width: '80px', height: '20px', background: 'rgba(64, 106, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${widthPercent}%`,
        background: COLORS.highlight,
        transition: 'width 0.1s linear'
      }} />
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '10px', fontWeight: 700, color: COLORS.text, textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        Bonus
      </div>
    </div>
  );
};

window.ChatMessage = function ({ messages }) {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '16px', marginBottom: '20px', border: `1px solid ${COLORS.bgLight}` }}>
      {messages.map((m, i) => (
        <div key={i} style={{ marginBottom: '14px', display: 'flex', flexDirection: m.isSystem ? 'column' : 'row', alignItems: m.isSystem ? 'center' : 'flex-start', gap: '10px' }}>
          {!m.isSystem && <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: m.isMe ? COLORS.highlight : COLORS.bgLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{m.sender[0]}</div>}
          <div style={{ flex: 1, textAlign: m.isSystem ? 'center' : 'left' }}>
            {!m.isSystem && <div style={{ fontSize: '10px', color: COLORS.textDim, marginBottom: '2px' }}>{m.sender}</div>}
            <div style={{ background: m.isSystem ? 'transparent' : m.isMe ? COLORS.highlightSoft : COLORS.bgLight, padding: m.isSystem ? '4px 0' : '10px 14px', borderRadius: '12px', fontSize: m.isSystem ? '11px' : '13px', color: m.isSystem ? COLORS.textDim : COLORS.text, border: m.isMe ? `1px solid ${COLORS.highlight}` : 'none' }}>{m.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
};


window.ChatResponseSelector = ({ incomingMessage, options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ alignSelf: 'flex-start', background: COLORS.bgLight, color: COLORS.text, padding: '12px 16px', borderRadius: '12px 12px 12px 0', maxWidth: '85%', fontSize: '14px', lineHeight: 1.5 }}>
        <div style={{ fontSize: '11px', color: COLORS.highlight, marginBottom: '4px', fontWeight: 600 }}>MANAGER</div>
        {incomingMessage}
      </div>
      <div style={{ fontSize: '12px', color: COLORS.textDim, textAlign: 'center', margin: '8px 0' }}>Choose your reply:</div>
      {options.map((opt, i) => (
        <div key={i} onClick={() => onSelect(i)} style={{ alignSelf: 'flex-end', background: COLORS.cta, color: '#0D2436', padding: '12px 16px', borderRadius: '12px 12px 0 12px', maxWidth: '85%', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transition: 'transform 0.1s active' }}>
          {opt}
        </div>
      ))}
    </div>
  );
};

window.TimelineVisualizer = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '20px' }}>
      <div style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '16px', textAlign: 'center' }}>PROJECTED CLOSURE TIMELINE</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '14px', left: '10%', right: '10%', height: '2px', background: COLORS.bgLight, zIndex: 0 }}></div>
        {['Today', 'Wed', 'Fri', 'Next Mon'].map((d, i) => (
          <div key={i} style={{ zIndex: 1, textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', background: i === 2 ? COLORS.highlight : COLORS.bgLight, borderRadius: '50%', color: i === 2 ? '#FFF' : COLORS.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, margin: '0 auto 8px' }}>{i + 1}</div>
            <div style={{ fontSize: '11px', color: COLORS.textDim }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ background: 'transparent', border: `1px solid ${COLORS.bgLight}`, borderRadius: '12px', padding: '16px', color: COLORS.text, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>🔧</span>
            <span style={{ fontSize: '13px', lineHeight: 1.4 }}>Fix bottleneck: <strong>{opt}</strong></span>
          </button>
        ))}
      </div>
    </div>
  );
};

window.VideoCallProfile = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ height: '140px', background: 'linear-gradient(135deg, #2C3E50, #000)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative' }}>
        <div style={{ width: '60px', height: '60px', background: COLORS.highlight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '3px solid #FFF' }}>👤</div>
        <div style={{ marginTop: '10px', color: '#e4e4e4ff', fontWeight: 600, fontSize: '14px' }}>Hiring Manager</div>
        <div style={{ fontSize: '11px', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }}></div> Speaking...</div>
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>HQ LIVE</div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '11px', color: COLORS.textDim, marginBottom: '4px' }}>YOUR RESPONSE</div>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ width: '100%', padding: '14px', background: COLORS.bgLight, border: 'none', borderRadius: '10px', color: COLORS.text, fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}>{opt}</button>
        ))}
      </div>
    </div>
  );
};

window.CandidateComparisonTable = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ background: COLORS.bgCard, borderRadius: '12px', padding: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: COLORS.text }}>Candidate A</div>
            <div style={{ fontSize: '10px', color: COLORS.highlight, marginTop: '2px' }}>High Potential</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: COLORS.text }}>Candidate B</div>
            <div style={{ fontSize: '10px', color: COLORS.success, marginTop: '2px' }}>Safe Bet</div>
          </div>
        </div>
        <div style={{ background: COLORS.bg, borderRadius: '8px', padding: '10px', fontSize: '11px', color: COLORS.textMuted, lineHeight: 1.5 }}>
          A has <strong>better strategic answers</strong> but has switched jobs frequently. B has <strong>perfect industry tenure</strong> but struggled with the case study.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ padding: '14px', background: '#253341', border: `1px solid ${COLORS.bgLight}`, borderRadius: '10px', color: COLORS.text, fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}>{opt}</button>
        ))}
      </div>
    </div>
  );
};

window.ChatResponseSelector = ({ incomingMessage, options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ alignSelf: 'flex-start', background: COLORS.bgLight, color: COLORS.text, padding: '12px 16px', borderRadius: '12px 12px 12px 0', maxWidth: '85%', fontSize: '14px', lineHeight: 1.5 }}>
        <div style={{ fontSize: '11px', color: COLORS.highlight, marginBottom: '4px', fontWeight: 600 }}>MANAGER</div>
        {incomingMessage}
      </div>
      <div style={{ fontSize: '12px', color: COLORS.textDim, textAlign: 'center', margin: '8px 0' }}>Choose your reply:</div>
      {options.map((opt, i) => (
        <div key={i} onClick={() => onSelect(i)} style={{ alignSelf: 'flex-end', background: COLORS.cta, color: '#0D2436', padding: '12px 16px', borderRadius: '12px 12px 0 12px', maxWidth: '85%', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transition: 'transform 0.1s active' }}>
          {opt}
        </div>
      ))}
    </div>
  );
};

window.TimelineVisualizer = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '20px' }}>
      <div style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '16px', textAlign: 'center' }}>PROJECTED CLOSURE TIMELINE</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '14px', left: '10%', right: '10%', height: '2px', background: COLORS.bgLight, zIndex: 0 }}></div>
        {['Today', 'Wed', 'Fri', 'Next Mon'].map((d, i) => (
          <div key={i} style={{ zIndex: 1, textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', background: i === 2 ? COLORS.highlight : COLORS.bgLight, borderRadius: '50%', color: i === 2 ? '#FFF' : COLORS.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, margin: '0 auto 8px' }}>{i + 1}</div>
            <div style={{ fontSize: '11px', color: COLORS.textDim }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ background: 'transparent', border: `1px solid ${COLORS.bgLight}`, borderRadius: '12px', padding: '16px', color: COLORS.text, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>🔧</span>
            <span style={{ fontSize: '13px', lineHeight: 1.4 }}>Fix bottleneck: <strong>{opt}</strong></span>
          </button>
        ))}
      </div>
    </div>
  );
};

window.VideoCallProfile = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ height: '140px', background: 'linear-gradient(135deg, #2C3E50, #000)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative' }}>
        <div style={{ width: '60px', height: '60px', background: COLORS.highlight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '3px solid #FFF' }}>👤</div>
        <div style={{ marginTop: '10px', color: '#e1e1e1ff', fontWeight: 600, fontSize: '14px' }}>Hiring Manager</div>
        <div style={{ fontSize: '11px', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }}></div> Speaking...</div>
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>HQ LIVE</div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '11px', color: COLORS.textDim, marginBottom: '4px' }}>YOUR RESPONSE</div>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ width: '100%', padding: '14px', background: COLORS.bgLight, border: 'none', borderRadius: '10px', color: COLORS.text, fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}>{opt}</button>
        ))}
      </div>
    </div>
  );
};

window.CandidateComparisonTable = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ background: COLORS.bgCard, borderRadius: '12px', padding: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: COLORS.text }}>Candidate A</div>
            <div style={{ fontSize: '10px', color: COLORS.highlight, marginTop: '2px' }}>High Potential</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: COLORS.text }}>Candidate B</div>
            <div style={{ fontSize: '10px', color: COLORS.success, marginTop: '2px' }}>Safe Bet</div>
          </div>
        </div>
        <div style={{ background: COLORS.bg, borderRadius: '8px', padding: '10px', fontSize: '11px', color: COLORS.textMuted, lineHeight: 1.5 }}>
          A has <strong>better strategic answers</strong> but has switched jobs frequently. B has <strong>perfect industry tenure</strong> but struggled with the case study.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ padding: '14px', background: '#253341', border: `1px solid ${COLORS.bgLight}`, borderRadius: '10px', color: COLORS.text, fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}>{opt}</button>
        ))}
      </div>
    </div>
  );
};

window.ApprovalNoteBuilder = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  const { useState } = React;
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${COLORS.bgLight}` }}>
      <div style={{ marginBottom: '16px', borderBottom: `1px solid ${COLORS.bgLight}`, paddingBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: COLORS.textDim }}>TO: FOUNDER@COMPANY.COM</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text, marginTop: '4px' }}>SUBJECT: VP Hire - Approval Required</div>
      </div>

      <div style={{ minHeight: '120px', background: COLORS.bg, borderRadius: '8px', padding: '16px', marginBottom: '16px', color: COLORS.text, fontSize: '14px', lineHeight: 1.6, fontFamily: 'monospace' }}>
        {selected !== null ? options[selected] : <span style={{ color: COLORS.textDim, fontStyle: 'italic' }}>[Select a drafting option below to preview message...]</span>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{ padding: '12px', background: selected === i ? COLORS.highlightSoft : COLORS.bgLight, border: `1px solid ${selected === i ? COLORS.highlight : 'transparent'}`, borderRadius: '8px', textAlign: 'left', color: COLORS.text, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <span style={{ fontWeight: 600, color: selected === i ? COLORS.highlight : COLORS.textDim }}>{String.fromCharCode(65 + i)}:</span> {opt.split(';')[0]}...
          </button>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button disabled={selected === null} onClick={() => onSelect(selected)} style={{ width: '100%', padding: '14px', background: selected !== null ? COLORS.cta : COLORS.bgLight, color: selected !== null ? '#0D2436' : COLORS.textDim, border: 'none', borderRadius: '10px', fontWeight: 600, cursor: selected !== null ? 'pointer' : 'not-allowed', boxShadow: selected !== null ? '0 4px 12px rgba(127, 194, 65, 0.3)' : 'none' }}>
          Send Note
        </button>
      </div>
    </div>
  );
};

window.MemoStructureBuilder = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ padding: '16px', background: COLORS.bgCard, border: `1px solid ${COLORS.bgLight}`, borderRadius: '12px', textAlign: 'left', color: COLORS.text, fontSize: '13px', cursor: 'pointer', lineHeight: 1.4, transition: 'all 0.2s hover' }}>
            <div style={{ fontSize: '10px', color: COLORS.highlight, marginBottom: '6px', textTransform: 'uppercase', fontWeight: 700 }}>Structure Option {i + 1}</div>
            {opt}
          </button>
        ))}
      </div>
      <div style={{ background: '#FFF', borderRadius: '4px', padding: '20px', height: '320px', opacity: 0.9, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 10, right: 10, fontSize: '10px', color: '#999' }}>PREVIEW</div>
        <div style={{ width: '40%', height: '8px', background: '#94A3B8', marginBottom: '20px' }}></div>
        <div style={{ width: '100%', height: '4px', background: '#E2E8F0', marginBottom: '8px' }}></div>
        <div style={{ width: '90%', height: '4px', background: '#E2E8F0', marginBottom: '8px' }}></div>
        <div style={{ width: '95%', height: '4px', background: '#E2E8F0', marginBottom: '24px' }}></div>

        <div style={{ width: '30%', height: '8px', background: '#94A3B8', marginBottom: '16px' }}></div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, height: '80px', background: '#F1F5F9', borderRadius: '4px' }}></div>
          <div style={{ flex: 1, height: '80px', background: '#F1F5F9', borderRadius: '4px' }}></div>
        </div>
      </div>
    </div>
  );
};

window.ClosureProofPacket = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>💼</div>
      <div style={{ fontSize: '18px', fontWeight: 600, color: COLORS.text, marginBottom: '8px' }}>Assemble Hiring Closure Proof</div>
      <div style={{ fontSize: '14px', color: COLORS.textMuted, marginBottom: '24px', maxWidth: '80%', margin: '0 auto 24px' }}>Select the most robust evidence package to lock in your certification.</div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ padding: '16px 20px', background: COLORS.bgLight, border: '2px solid transparent', borderRadius: '12px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: COLORS.bg, border: `2px solid ${COLORS.textDim}`, flexShrink: 0, display: 'grid', placeItems: 'center' }}></div>
            <span style={{ fontSize: '14px', color: COLORS.text, lineHeight: 1.4, fontWeight: 500 }}>{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

window.downloadBadge = (badgeTitle) => {
  const canvas = document.createElement('canvas');
  const size = 600;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background - Dark Premium Hexagon
  ctx.fillStyle = '#0D2436';
  ctx.fillRect(0, 0, size, size);

  // Hexagon Shape
  const hexRadius = 240;
  const centerX = size / 2;
  const centerY = size / 2;

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle_deg = 60 * i - 30;
    const angle_rad = Math.PI / 180 * angle_deg;
    const x = centerX + hexRadius * Math.cos(angle_rad);
    const y = centerY + hexRadius * Math.sin(angle_rad);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Gradient Fill
  const gradient = ctx.createLinearGradient(centerX - hexRadius, centerY - hexRadius, centerX + hexRadius, centerY + hexRadius);
  gradient.addColorStop(0, '#1A3A52');
  gradient.addColorStop(1, '#091620');
  ctx.fillStyle = gradient;
  ctx.fill();

  // Border
  ctx.lineWidth = 15;
  ctx.strokeStyle = '#7FC241'; // COLORS.cta
  ctx.stroke();

  // Text Styling
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';

  // Badge Title - Text Wrap (Fixed Font Size)
  ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
  const maxWidth = 380;
  const lineHeight = 55;
  const words = badgeTitle.split(' ');
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    let testLine = currentLine + ' ' + words[i];
    let metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Center the block vertically around centerY - 20
  let startY = (centerY - 20) - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + (index * lineHeight));
  });

  // Subtitle
  ctx.font = '300 24px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#8BA3B9'; // textMuted
  ctx.fillText('HR Manager Job Simulation', centerX, centerY + 50);

  // Footer
  ctx.font = '600 20px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#7FC241'; // cta
  ctx.fillText('LearnTube 2026', centerX, centerY + 130);

  // Open in New Tab
  window.trackEvent('badge_shared', { badge: badgeTitle });
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write('<html><head><title>' + (badgeTitle || 'Badge') + '</title></head><body style="margin:0; background:#091620; display:flex; align-items:center; justify-content:center; height:100vh;"></body></html>');

    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Badge generation failed');
        newWindow.close();
        return;
      }
      const url = URL.createObjectURL(blob);
      const img = newWindow.document.createElement('img');
      img.src = url;
      img.style.maxWidth = '100%';
      img.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
      img.style.borderRadius = '20px'; // Rounded slightly to match feel
      newWindow.document.body.appendChild(img);

      // Cleanup URL revocation on window unload? Browser handles mostly, but good practice
    }, 'image/png');
  } else {
    alert('Please allow popups to view your badge.');
  }
};

window.SimulationResult = ({ simulation, score, onContinue, nextSimTitle, history }) => {
  const COLORS = window.COLORS;
  const metadata = simulation.simulation_metadata;
  const deliverables = metadata.deliverables_unlockable || {};
  const [expandedItems, setExpandedItems] = React.useState(new Set());
  const [isReviewOpen, setIsReviewOpen] = React.useState(false);

  // Filter history for review
  const incorrectItems = history ? history.filter(item => item.type === 'incorrect') : [];
  const partialItems = history ? history.filter(item => item.type === 'partial') : [];
  const correctItems = history ? history.filter(item => item.type === 'correct') : [];

  const toggleItem = (id) => {
    setExpandedItems(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
    });
  };

  const renderReviewItem = (item, uniqueId, color, icon) => {
    const isExpanded = expandedItems.has(uniqueId);
    return (
      <div key={uniqueId} style={{
        /* Linear Style: Subtle border, clean background */
        background: 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${COLORS.bgLight}`,
        borderRadius: '8px',
        marginBottom: '8px',
        overflow: 'hidden',
        transition: 'background 0.2s ease'
      }}>
        {/* Header - Always Visible */}
        <div 
          onClick={() => toggleItem(uniqueId)}
          style={{
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            background: isExpanded ? 'rgba(255, 255, 255, 0.03)' : 'transparent'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, overflow: 'hidden' }}>
             {/* Status Icon */}
             <div style={{ 
               width: '20px', 
               height: '20px', 
               borderRadius: '50%', 
               background: color, 
               flexShrink: 0,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               color: '#000',
               fontSize: '12px',
               fontWeight: 800
             }}>
               {icon}
             </div>
             
             {/* Title (Question) */}
             <div style={{ 
               fontSize: '14px', 
               fontWeight: 500, 
               color: COLORS.text,
               whiteSpace: 'nowrap', 
               overflow: 'hidden', 
               textOverflow: 'ellipsis',
               opacity: isExpanded ? 1 : 0.9
             }}>
               <window.MarkdownText text={item.question} />
             </div>
          </div>
          
          <div style={{ color: COLORS.textDim, fontSize: '18px', marginLeft: '12px', lineHeight: 1 }}>
             {isExpanded ? '−' : '+'}
          </div>
        </div>

        {/* Expanded Content - Details */}
        {isExpanded && (
          <div style={{ padding: '16px 16px 20px 16px', borderTop: `1px solid ${COLORS.bgLight}` }}>
             <div style={{ display: 'grid', gap: '16px' }}>
                
                {/* Selected Answer */}
                <div>
                   <div style={{ fontSize: '11px', color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Selected Answer</div>
                   <div style={{ fontSize: '14px', color: COLORS.text, lineHeight: 1.5 }}>
                     {item.userAnswer}
                   </div>
                </div>

                {/* Review / Outcome */}
                <div>
                   <div style={{ fontSize: '11px', color: color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Review</div>
                   <div style={{ fontSize: '14px', color: COLORS.textMuted, lineHeight: 1.5 }}>
                     <window.MarkdownText text={item.outcomeText} />
                   </div>
                </div>
                
                {/* Best Answer (if needed) */}
                {item.correctAnswer && item.type !== 'correct' && (
                   <div style={{ background: 'rgba(74, 222, 128, 0.05)', border: `1px dashed ${COLORS.success}40`, padding: '12px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: COLORS.success, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', fontWeight: 700 }}>Best Answer</div>
                      <div style={{ fontSize: '14px', color: COLORS.success }}>{item.correctAnswer}</div>
                   </div>
                )}
             </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.bg} 0%, #091620 100%)`, padding: '24px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, paddingBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '20px' }}>
          {/* Removed Tick Icon */}
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.text, marginBottom: '8px' }}>Simulation Complete</h2>
          <div style={{ fontSize: '16px', color: COLORS.cta, fontWeight: 600 }}>+{score.toLocaleString()} Skillions Earned</div>
        </div>

        {/* Impact Metrics Cards */}
        {metadata.impact_metrics && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            {/* Time Saved Card */}
            <div style={{
              background: 'linear-gradient(135deg, #1A3A52 0%, #0D2436 100%)',
              borderRadius: '16px',
              padding: '20px',
              border: `2px solid ${COLORS.success}40`,
              boxShadow: '0 4px 12px rgba(74, 222, 128, 0.1)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏱️</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: COLORS.success, marginBottom: '4px' }}>
                {metadata.impact_metrics.time_saved}
              </div>
              <div style={{ fontSize: '13px', color: COLORS.textMuted, lineHeight: 1.4 }}>
                of your company's time saved
              </div>
            </div>

            {/* Cost Saved Card */}
            <div style={{
              background: 'linear-gradient(135deg, #1A3A52 0%, #0D2436 100%)',
              borderRadius: '16px',
              padding: '20px',
              border: `2px solid ${COLORS.cta}40`,
              boxShadow: '0 4px 12px rgba(64, 224, 208, 0.1)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: COLORS.cta, marginBottom: '4px' }}>
                {metadata.impact_metrics.cost_saved}
              </div>
              <div style={{ fontSize: '13px', color: COLORS.textMuted, lineHeight: 1.4 }}>
                saved for your company
              </div>
            </div>
          </div>
        )}
        
        {/* Review Section - Card Style */}
        {history && history.length > 0 && (
          <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: COLORS.highlight, fontWeight: 700, textTransform: 'uppercase' }}>YOUR PERFORMANCE ANALYSIS</div>
              <div 
                 onClick={() => setIsReviewOpen(!isReviewOpen)}
                 style={{ fontSize: '12px', color: COLORS.highlight, cursor: 'pointer', fontWeight: 600 }}
              >
                 {isReviewOpen ? 'Show Less' : 'Show More'}
              </div>
            </div>

            {/* Content List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* If collapsed, show max 3 items (prioritizing incorrect/partial) */}
              {!isReviewOpen ? (
                 <>
                   {[...incorrectItems, ...partialItems, ...correctItems].slice(0, 3).map((item, i) => {
                      let color = COLORS.success;
                      let icon = '✓';
                      if(item.type === 'incorrect') { color = COLORS.warning; icon = '!'; }
                      else if(item.type === 'partial') { color = '#FCD34D'; icon = '!'; }
                      return renderReviewItem(item, `preview-${i}`, color, icon);
                   })}
                   {history.length > 3 && (
                     <div 
                       onClick={() => setIsReviewOpen(true)}
                       style={{ textAlign: 'center', fontSize: '12px', color: COLORS.textDim, marginTop: '8px', cursor: 'pointer' }}
                     >
                       + {history.length - 3} more items
                     </div>
                   )}
                 </>
              ) : (
                 /* Expanded View - Grouped */
                <>
                   {incorrectItems.length > 0 && (
                     <div style={{ marginBottom: '8px' }}>
                       <div style={{ fontSize: '14px', color: COLORS.warning, fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Needs Attention</div>
                       {incorrectItems.map((item, i) => renderReviewItem(item, `inc-${i}`, COLORS.warning, '!'))}
                     </div>
                   )}
                   {partialItems.length > 0 && (
                     <div style={{ marginBottom: '8px' }}>
                       <div style={{ fontSize: '14px', color: '#FCD34D', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Room for Improvement</div>
                       {partialItems.map((item, i) => renderReviewItem(item, `part-${i}`, '#FCD34D', '!'))}
                     </div>
                   )}
                   {correctItems.length > 0 && (
                     <div style={{ marginBottom: '8px' }}>
                       <div style={{ fontSize: '14px', color: COLORS.success, fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Good Decisions</div>
                       {correctItems.map((item, i) => renderReviewItem(item, `corr-${i}`, COLORS.success, '✓'))}
                     </div>
                   )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Removed Competencies Proven Card */}

        <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: COLORS.highlight, marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase' }}>YOU'VE UNLOCKED</div>

          {/* Locked Certificate Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '12px', border: `1px dashed ${COLORS.textDim}`, borderRadius: '12px', opacity: 0.8 }}>
            <div style={{ fontSize: '24px', opacity: 0.5 }}>&#x1F393;</div>
            <div>
              <div style={{ fontSize: '14px', color: COLORS.textMuted, fontWeight: 600 }}>HR Manager Job Readiness Certification</div>
              <div style={{ fontSize: '11px', color: COLORS.textDim, marginTop: '2px' }}>Score &gt;60% in 10 Simulations to Unlock</div>
            </div>
          </div>

          {/* Job Options Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '12px', border: `1px dashed ${COLORS.textDim}`, borderRadius: '12px', opacity: 0.8 }}>
            <div style={{ fontSize: '24px', opacity: 0.5 }}>💼</div>
            <div>
              <div style={{ fontSize: '14px', color: COLORS.textMuted, fontWeight: 600 }}>Job Options from 1100+ Companies</div>
              <div style={{ fontSize: '11px', color: COLORS.textDim, marginTop: '2px' }}>Emailed to you on passing requirements</div>
            </div>
          </div>

          {deliverables.badges?.map((badge, i) => (
            <div key={`badge-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', background: COLORS.bgLight, padding: '12px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px' }}>🏅</div>
                <div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Badge Earned</div>
                  <div style={{ fontSize: '14px', color: COLORS.text, fontWeight: 600 }}>{badge}</div>
                </div>
              </div>
              <button
                onClick={() => window.downloadBadge(badge)}
                style={{
                  background: 'transparent',
                  border: `1px solid ${COLORS.highlight}`,
                  borderRadius: '20px',
                  color: COLORS.highlight,
                  cursor: 'pointer',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Download Badge"
              >
                Share
              </button>
            </div>
          ))}

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${COLORS.bgLight}` }}>
            <div style={{ fontSize: '11px', color: COLORS.textDim, marginBottom: '8px' }}>REAL TASKS YOU COMPLETED:</div>
            <ul style={{ margin: 0, paddingLeft: '20px', color: COLORS.textMuted, fontSize: '13px', lineHeight: 1.6 }}>
              {deliverables.recruiter_readable_proof?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {nextSimTitle && (
          <div style={{ padding: '16px', border: `1px dashed ${COLORS.textDim}`, borderRadius: '12px', opacity: 0.7 }}>
            <div style={{ fontSize: '11px', color: COLORS.textDim, marginBottom: '4px' }}>YOUR NEXT MISSION</div>
            <div style={{ fontSize: '14px', color: COLORS.textMuted, fontWeight: 600 }}>{nextSimTitle}</div>
          </div>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px', background: `linear-gradient(180deg, rgba(9, 22, 32, 0) 0%, #091620 20%)`, zIndex: 10, maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={onContinue} style={{ width: '100%', padding: '18px', background: COLORS.cta, border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#0D2436', boxShadow: '0 4px 24px rgba(127, 194, 65, 0.3)' }}>
          Continue & Unlock Next Scenario
        </button>
      </div>
    </div>
  );
};

// ReviewPage Removed


window.HRSimulationApp = function ({ simulationData, uiVersion }) {
  const COLORS = window.COLORS;
  const OptionButton = window.OptionButton;
  const CandidateCard = window.CandidateCard;
  const FeedbackPanel = window.FeedbackPanel;
  const EmailPreview = window.EmailPreview;

  // Deep Linking: Parse URL parameters for initial state
  const urlParams = new URLSearchParams(window.location.search);
  const initialSimIndex = parseInt(urlParams.get('sim_index') || '0', 10);
  const initialStepIndex = parseInt(urlParams.get('step_index') || '0', 10);

  // Determine initial screen based on params
  let initialScreen = 'start';
  if (urlParams.has('step_index')) {
    initialScreen = 'step';
  } else if (urlParams.has('sim_index') && initialSimIndex > 0) {
    initialScreen = 'start';
  }

  const [currentSimulationIndex, setCurrentSimulationIndex] = useState(initialSimIndex);
  const [screen, setScreen] = useState(initialScreen);
  const [currentStep, setCurrentStep] = useState(initialStepIndex);
  const [isExplainExpanded, setIsExplainExpanded] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [bonusDuration, setBonusDuration] = useState(30);

  // Helper to calculate question complexity/duration
  const calculateBonusDuration = (stepObj, optionsArr) => {
    if (!stepObj) return 30;
    const qLen = stepObj.instruction_question ? stepObj.instruction_question.length : 0;
    const optLen = optionsArr ? optionsArr.reduce((acc, opt) => acc + (typeof opt === 'string' ? opt.length : 20), 0) : 0;
    const totalChars = qLen + optLen;
    // 15s min, 30s max. Approx 1s per 18 chars + base buffer
    return Math.min(30, Math.max(15, Math.ceil(totalChars / 15)));
  };
  const [optionIndices, setOptionIndices] = useState([]);
  const [hasAttemptedCurrentStep, setHasAttemptedCurrentStep] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  // New State for Review & Timing
  const [userHistory, setUserHistory] = useState([]);
  const [startTime, setStartTime] = useState(null);

  // Simulation Timer
  const [simElapsed, setSimElapsed] = useState(0);
  const [simTimerPaused, setSimTimerPaused] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [colonVisible, setColonVisible] = useState(true);

  const [previousOutcome, setPreviousOutcome] = useState(null);
  const [learningMode, setLearningMode] = useState('guided'); // 'guided' or 'assessment'

  // Timer interval: ticks every second, pauses after 5min idle
  useEffect(() => {
    if (simTimerPaused) return;
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > 5 * 60 * 1000) {
        // Idle for 5 min — pause
        setSimTimerPaused(true);
        return;
      }
      setSimElapsed(prev => prev + 1);
      setColonVisible(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, [simTimerPaused, lastActivity]);

  // Track user activity to resume timer
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      if (simTimerPaused && (screen === 'step' || screen === 'scenario')) {
        setSimTimerPaused(false);
      }
    };
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [simTimerPaused, screen]);

  const formatTimer = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return { m, s };
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Reset start time when entering a step (if not showing feedback)
    if (screen === 'step' && !isFeedbackVisible) {
      setStartTime(Date.now());
    }
  }, [screen, currentStep, isFeedbackVisible]);

  // Analytics: Track Screen Views (Composite)
  React.useEffect(() => {
    let screenName = screen;
    if (screen === 'start') screenName = 'Start';
    if (screen === 'scenario') screenName = 'Scenario Intro';
    if (screen === 'step') screenName = `Step ${currentStep + 1}`;
    if (screen === 'sim_result') screenName = 'Results';
    if (screen === 'feedback') screenName = 'Feedback';

    const compositeName = `Sim ${currentSimulationIndex + 1} - ${screenName}`;
    window.trackEvent('screen_view', { screen_name: compositeName });
  }, [screen, currentStep, currentSimulationIndex]);

  // Analytics: Track Simulation Completion
  React.useEffect(() => {
    if (screen === 'sim_result') {
      const currentSim = simulations[currentSimulationIndex] || simulationData?.simulations?.[currentSimulationIndex];
      if (currentSim) {
        window.trackEvent('simulation_complete', {
          title: currentSim.simulation_metadata.simulation_title,
          score: score
        });
      }
    }
  }, [screen, currentSimulationIndex, score, simulationData]);

  const simulations = simulationData?.simulations || [];
  const currentSim = simulations[currentSimulationIndex];
  if (!currentSim) return <div style={{ color: COLORS.text, padding: '40px' }}>Simulation not found.</div>;

  const scenarios = currentSim.scenario_breakdown || [];
  const currentScenario = scenarios[0];

  const steps = currentSim.step_level_design || [];
  const step = steps[currentStep];

  useEffect(() => {
    if (step && step.options_inputs && Array.isArray(step.options_inputs) && step.options_inputs.length > 0) {
      // Create indices array [0, 1, 2, ...]
      const indices = step.options_inputs.map((_, i) => i);
      // Fisher-Yates Shuffle
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setOptionIndices(indices);
      setShuffledOptions(indices.map(i => step.options_inputs[i]));

      // Calculate Bonus Duration
      const duration = calculateBonusDuration(step, step.options_inputs);
      setBonusDuration(duration);
    } else {
      setShuffledOptions([]);
      setOptionIndices([]);
      // Default duration if no options
      if (step) {
        setBonusDuration(calculateBonusDuration(step, []));
      }
    }
    setHasAttemptedCurrentStep(false);
    setAttemptCount(0);
  }, [step]);

  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedRisks, setSelectedRisks] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [stepResults, setStepResults] = useState([]);

  const handleCandidateSelect = (id) => {
    if (isFeedbackVisible) return;
    const updated = selectedCandidates.includes(id)
      ? selectedCandidates.filter(cid => cid !== id)
      : [...selectedCandidates, id];
    setSelectedCandidates(updated);

    // Auto-evaluate if selection is complete (e.g. 5 candidates for Sim 1 Step 1)
    if (currentSimulationIndex === 0 && currentStep === 0 && updated.length === 5) {
      evaluateStep(null, updated);
    }
  };

  const handleOptionSelect = (index) => {
    if (isFeedbackVisible) return;
    setSelectedOption(index);
    // Auto-advance for traditional MCQ (all versions including V3)
    // V3 fill_blank and violated_principles use their own components with submit buttons
    evaluateStep(index);
  };

  const handleRiskToggle = (candidateId, flagId) => {
    if (isFeedbackVisible) return;
    setSelectedRisks(prev => {
      const current = prev[candidateId] || [];
      const updated = current.includes(flagId) ? current.filter(f => f !== flagId) : [...current, flagId];
      return { ...prev, [candidateId]: updated };
    });
  };

  const evaluateStep = (optionIdx = null, candidates = null) => {
    let type = 'correct';

    // Determine the original logical index from the visual (shuffled) index
    const visualIndex = optionIdx !== null ? optionIdx : selectedOption;
    let originalIndex = visualIndex; // Default callback fallback

    if (visualIndex !== null && optionIndices.length > 0) {
      originalIndex = optionIndices[visualIndex];
    }

    if (originalIndex !== null) {
      if (originalIndex > 1) type = 'incorrect';
      else if (originalIndex === 1) type = 'partial';
    }

    // Time Calculation
    const timeTaken = startTime ? (Date.now() - startTime) / 1000 : 999;
    // Streak Bonus Rule: Correct/Partial answer within dynamic bonus duration
    const isTimedBonus = (type === 'correct' || type === 'partial') && timeTaken <= bonusDuration;

    // Calculate Percentile
    // Base: 60%. Max: 98%.
    // Formula: (bonusDuration - timeTaken) / bonusDuration * 38 + 60
    let percentile = 0;
    if (timeTaken < bonusDuration) {
      percentile = Math.min(98, Math.max(60, Math.floor(60 + ((bonusDuration - timeTaken) / bonusDuration) * 38)));
    } else {
      percentile = Math.floor(Math.random() * (60 - 40) + 40); // 40-60% for slow answers
    }

    // Points & Streak Logic
    let points = 0;

    // Streak Update
    let currentStreakCount = streak;
    if (!hasAttemptedCurrentStep) {
      if (isTimedBonus) {
        currentStreakCount = streak + 1;
        setStreak(currentStreakCount);
      } else {
        // If not a timed bonus (either too slow or incorrect), streak resets
        setStreak(0);
        currentStreakCount = 0;
      }
    }

    // Calculate Points: +10 for correct, +5 for partial, 0 for incorrect
    if (!hasAttemptedCurrentStep) {
      if (type === 'correct') {
        points = 10;
      } else if (type === 'partial') {
        points = 5;
      } else {
        points = 0;
      }
    }

    console.log('Points calculated:', { type, points, hasAttemptedCurrentStep });

    // Construct Feedback Message
    let feedbackMsg = step.immediate_feedback || "Your decision has been recorded.";
    if (isTimedBonus && !hasAttemptedCurrentStep) {
      feedbackMsg += " ⏰ Speed Bonus!";
    }

    // Determine specific outcome text
    let outcomeText = "";
    if (step.outcomes) {
      if (type === 'correct') outcomeText = step.outcomes.correct;
      else if (type === 'partial') outcomeText = step.outcomes.partially_correct;
      else outcomeText = step.outcomes.incorrect;
    }

    // Construct User Answer Text based on Step Type
    let userAnswerText = "";

    if (step.interaction_type === 'violated_principles' && candidates && Array.isArray(candidates)) {
      userAnswerText = candidates
        .map(idx => step.available_principles && step.available_principles[idx])
        .filter(Boolean)
        .join(", ");
    } else if (step.interaction_type === 'fill_blank') {
      if (originalIndex !== null && step.blank_options && step.blank_options[originalIndex]) {
        userAnswerText = step.blank_options[originalIndex];
      } else {
        userAnswerText = "No selection";
      }
    } else {
      userAnswerText = candidates
        ? 'Candidate Selection'
        : (visualIndex !== null && shuffledOptions[visualIndex] ? shuffledOptions[visualIndex] : 'Custom Input');
    }

    // Construct Correct Answer Text based on Step Type
    let correctAnswerText = null;
    if (step.interaction_type === 'violated_principles' && step.violated_principle_indices) {
      correctAnswerText = step.violated_principle_indices
        .map(idx => step.available_principles && step.available_principles[idx])
        .filter(Boolean)
        .join(", ");
    } else if (step.interaction_type === 'fill_blank' && step.correct_answer_index !== undefined) {
      if (step.blank_options && step.blank_options[step.correct_answer_index]) {
        correctAnswerText = step.blank_options[step.correct_answer_index];
      }
    } else {
      correctAnswerText = step.options_inputs ? step.options_inputs[0] : null;
    }

    const result = {
      type: type,
      message: feedbackMsg,
      outcomeText: outcomeText,
      points: points,
      percentile: percentile,
      // Metadata for history
      scenarioId: step.scenario_id,
      stepId: step.step_id,
      question: step.instruction_question,
      userAnswer: userAnswerText,
      correctAnswer: correctAnswerText,
      explanation: step.explain_this_question // Capture explanation for review
    };

    // Record to history if first attempt
    console.log("Evaluating step:", step.step_id, "Scenario:", step.scenario_id, "Attempted:", hasAttemptedCurrentStep);
    if (!hasAttemptedCurrentStep) {
      console.log("Recording history item:", result);
      setUserHistory(prev => [...prev, result]);
    }

    setStepResults(prev => [...prev, result]);
    setAttemptCount(prev => prev + 1);
    setIsFeedbackVisible(true);

    // Add points immediately (since we're skipping feedback display)
    if (!hasAttemptedCurrentStep) {
      setScore(prev => {
        const newScore = prev + points;
        console.log('Score updated:', { previousScore: prev, pointsAdded: points, newScore });
        return newScore;
      });
    }

    // Immediately proceed to next step without showing feedback
    setTimeout(() => handleFeedbackComplete(), 0);
  };

  const handleFeedbackComplete = () => {
    // Proceed regardless of correctness
    proceedToNextStep();
  };

  const proceedToNextStep = () => {
    // Add points from the just-completed step
    let lastOutcomeData = null;
    if (isFeedbackVisible && stepResults.length > 0) {
      const lastResult = stepResults[stepResults.length - 1];
      setScore(prev => prev + lastResult.points);
      // Store outcome to bridge to next step
      lastOutcomeData = { text: lastResult.outcomeText, type: lastResult.type };
    }

    setIsFeedbackVisible(false);
    if (currentStep < steps.length - 1) {
      // Check if Scenario is changing
      const nextStep = steps[currentStep + 1];
      const nextScenarioId = nextStep.scenario_id;
      const currentScenarioId = steps[currentStep].scenario_id;

      if (nextScenarioId === currentScenarioId) {
        setPreviousOutcome(lastOutcomeData);
      } else {
        setPreviousOutcome(null); // Clear if scenario changes
      }

      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setSelectedCandidates([]);
      setScreen('step');
    } else {
      setPreviousOutcome(null);
      // Skip review if all answers are correct
      const allCorrect = userHistory.every(item => item.type === 'correct');
      // Always go to sim_result, never review page
      setScreen('sim_result');
    }
    setIsExplainExpanded(false);
  };

  const nextSimulation = () => {
    setIsFeedbackVisible(false);
    if (currentSimulationIndex < simulations.length - 1) {
      setCurrentSimulationIndex(prev => prev + 1);
      setCurrentStep(0);
      setSelectedOption(null);
      setSelectedCandidates([]);
      setStepResults([]);
      setUserHistory([]); // Clear history for next simulation
      setScreen('start');
    } else {
      setScreen('results');
    }
  };

  if (screen === 'start') {
    return (
      <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.bg} 0%, #091620 100%)`, display: 'flex', flexDirection: 'column', padding: '24px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ background: COLORS.highlightSoft, color: COLORS.highlight, fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', padding: '6px 12px', borderRadius: '20px', alignSelf: 'flex-start', marginBottom: '20px' }}>SIMULATION {currentSimulationIndex + 1} OF {simulations.length}</div>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: COLORS.text, lineHeight: 1.2, marginBottom: '16px' }}>{currentSim.simulation_metadata.simulation_title}</h1>
          {/* <p style={{ fontSize: '15px', color: COLORS.textMuted, lineHeight: 1.6, marginBottom: '32px' }}>{currentSim.simulation_metadata.why_this_matters_for_getting_hired}.<br /><br /><strong>Your Actions Will Solve Key Job Requirements:</strong></p> */}
          {/* Why This Matters Card */}
          {currentSim.simulation_metadata.why_this_matters_for_getting_hired && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(64, 106, 255, 0.1) 0%, rgba(64, 106, 255, 0.05) 100%)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              border: `1px solid ${COLORS.highlight}40`,
              boxShadow: '0 4px 12px rgba(64, 106, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '18px' }}>🚀</span>
                <span style={{ fontSize: '12px', color: COLORS.highlight, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>WHY THIS MATTERS</span>
              </div>
              <p style={{ fontSize: '15px', color: COLORS.text, lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
                {currentSim.simulation_metadata.why_this_matters_for_getting_hired}
              </p>
            </div>
          )}

          {/* Unlockable Items - Simplifed */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', marginBottom: '40px', opacity: 0.8, background: COLORS.bgCard, padding: '12px 16px', borderRadius: '12px', border: `1px dashed ${COLORS.textDim}` }}>
            <span style={{ fontSize: '18px' }}>🎓</span>
            <span style={{ fontSize: '13px', color: COLORS.textMuted, fontWeight: 500, letterSpacing: '0.2px' }}>
              Certification & Job Options available on completion
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.textDim, fontSize: '13px', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>⏱</span>{currentSim.simulation_metadata.estimated_time || '15 minutes'} · {steps.length} critical decisions
          </div>
          <div style={{ position: 'absolute', top: '24px', right: '20px', background: COLORS.highlightSoft, color: COLORS.highlight, fontSize: '13px', fontWeight: 700, padding: '8px 12px', borderRadius: '12px' }}>
            ⚡️ {score.toLocaleString()}
          </div>
        </div>
        <div style={{ position: 'sticky', bottom: 0, padding: '20px 0', background: 'linear-gradient(180deg, rgba(9, 22, 32, 0) 0%, #091620 20%)', zIndex: 10, marginTop: 'auto' }}>
          <button id="start-simulation" onClick={() => {
            window.trackEvent('simulation_start', { title: currentSim.simulation_metadata.simulation_title });
            setUserHistory([]);
            setStepResults([]);
            setCurrentStep(0);
            setSelectedOption(null);
            setSelectedCandidates([]);
            setIsFeedbackVisible(false);
            setSimElapsed(0);
            setSimTimerPaused(false);
            setLastActivity(Date.now());
            setScreen('step');
          }} style={{ width: '100%', padding: '18px', background: COLORS.cta, border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#0D2436', boxShadow: '0 4px 24px rgba(127, 194, 65, 0.3)' }}>Start Simulation</button>
        </div>
      </div >
    );
  }



  if (screen === 'step') {
    let artefact = null;
    // COMMENTED OUT: Feedback panel between questions
    // if (isFeedbackVisible) {
    //   const result = stepResults[stepResults.length - 1];
    //   artefact = (
    //     <div style={{ marginTop: '20px' }}>
    //       <FeedbackPanel
    //         type={result.type}
    //         message={result.message}
    //         points={result.points}
    //         outcomeText={result.outcomeText}
    //         percentile={result.percentile}
    //         onComplete={handleFeedbackComplete}
    //       />
    //     </div>
    //   );
    // } else {
    if (true) {

      // Use description for smart artifact selection
      const description = step.artefact_interaction_description ? step.artefact_interaction_description.toLowerCase() : '';

      // Check for specific "Candidate Selection" artifact (Sim 1 type)
      const isCandidateSelection = step.interaction_type === 'selection' && description.includes('candidate tiles');

      if (isCandidateSelection) {
        artefact = (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '10px' }}>SELECTED: {selectedCandidates.length}/5</div>
            <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '12px' }}>
              {window.MOCK_CANDIDATES.map(c => (
                <CandidateCard key={c.id} candidate={c} selected={selectedCandidates.includes(c.id)} onSelect={handleCandidateSelect} compact />
              ))}
            </div>
          </div>
        );
      } else if (description.includes('chat thread')) {
        // V2 S1 Step 1: Chat Response
        // We try to find the scenario context to get the incoming message
        const scenario = currentSim.scenario_breakdown.find(s => s.scenario_id === step.scenario_id);
        const message = scenario ? scenario.crisis_or_decision_trigger : "How do you respond?";
        artefact = <window.ChatResponseSelector incomingMessage={message} options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); }} />;
      } else if (description.includes('timeline')) {
        // V2 S1 Step 2: Timeline
        artefact = <window.TimelineVisualizer options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); }} />;
      } else if (description.includes('huddle')) {
        // V2 S1 Step 3: Video Call
        artefact = <window.VideoCallProfile options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); }} />;
      } else if (description.includes('comparison')) {
        // V2 S1 Step 4: Comparison
        artefact = <window.CandidateComparisonTable options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); }} />;
      } else if (description.includes('approval note')) {
        // V2 S2 Step 6: Approval Note
        artefact = <window.ApprovalNoteBuilder options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); }} />;
      } else if (description.includes('one-page memo')) {
        // V2 S3 Step 9: Memo Structure
        artefact = <window.MemoStructureBuilder options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); }} />;
      } else if (description.includes('closure proof')) {
        // V2 S3 Step 15: Closure Proof
        artefact = <window.ClosureProofPacket options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); }} />;
      } else if ((step.interaction_type === 'ordering' || step.interaction_type === 'selection') && step.options_inputs) {
        // Generic multi-select / ordering builder
        artefact = (
          <window.RationaleBuilder
            pool={shuffledOptions}
            maxSelection={step.max_selection || 3}
            onComplete={(selected) => evaluateStep(selected[0])}
          />
        );
      } else if (step.interaction_type === 'trade-off meters' && !step.options_inputs) {
        // Legacy Slider Custom Component (Sim 1 V1)
        const meters = [
          { label: 'Hiring Speed', initial: 70 },
          { label: 'Quality Bar', initial: 80 },
          { label: 'Internal Trust', initial: 60 }
        ];
        artefact = <window.TradeOffMeters meters={meters} onComplete={(values) => evaluateStep(0)} />;
      } else if (step.interaction_type === 'find_error' && step.segments) {
        // V3 Question Type: Find the Error
        artefact = (
          <window.FindErrorQuestion
            segments={step.segments}
            onAnswer={(segmentId) => {
              // Find if the selected segment is an error
              const selectedSegment = step.segments.find(s => s.id === segmentId);
              const isCorrect = selectedSegment && selectedSegment.is_error;
              const correctSegment = step.segments.find(s => s.is_error);
              const correctIndex = correctSegment ? correctSegment.id : 0;
              evaluateStep(isCorrect ? 0 : 1, correctIndex);
            }}
            disabled={isFeedbackVisible}
          />
        );
      } else if (step.interaction_type === 'fill_blank' && step.prompt_template) {
        // V3 Question Type: Fill in the Blank
        // Synchronize shuffling: Map blank_options to match the shuffled options_inputs
        const currentBlankOptions = step.blank_options
          ? (optionIndices.length === step.blank_options.length
            ? optionIndices.map(i => step.blank_options[i])
            : step.blank_options)
          : [];

        artefact = (
          <window.FillBlankQuestion
            promptTemplate={step.prompt_template}
            blankOptions={currentBlankOptions}
            onAnswer={(selectedIndex) => {
              // selectedIndex is the VISUAL index (shuffled)
              // evaluateStep handles mapping visual -> original via optionIndices
              evaluateStep(selectedIndex, step.correct_answer_index || 0);
            }}
            disabled={isFeedbackVisible}
          />
        );
      } else if (step.interaction_type === 'clickable_prompt' && step.prompt_text) {
        // V3 Question Type: Clickable Prompt
        artefact = (
          <window.ClickablePromptQuestion
            promptText={step.prompt_text}
            clickableOptions={step.clickable_options || []}
            onAnswer={(selectedIndex) => {
              // Direct evaluation - no shuffling for this type
              evaluateStep(selectedIndex);
            }}
            disabled={isFeedbackVisible}
          />
        );
      } else if (step.interaction_type === 'tap_sequence') {
        // Tap Sequence Questions (Fill Blanks or Flag & Replace)
        artefact = (
          <window.TapSequenceQuestion
            step={step}
            onComplete={(result) => {
              // Auto-proceed on completion
              console.log('Tap sequence completed:', result);
              evaluateStep(0); // Success for learning flow
            }}
            disabled={isFeedbackVisible}
          />
        );
      } else if (step.interaction_type === 'violated_principles' && step.available_principles) {
        // V3 Question Type: Violated Principles
        // Synchronize shuffling for principles
        const currentPrinciples = step.available_principles
          ? (optionIndices.length === step.available_principles.length
            ? optionIndices.map(i => step.available_principles[i])
            : step.available_principles)
          : [];

        artefact = (
          <window.ViolatedPrinciplesQuestion
            problematicPrompt={step.problematic_prompt}
            availablePrinciples={currentPrinciples}
            onAnswer={(selectedIndices) => {
              // selectedIndices are VISUAL (shuffled) indices.
              // Map them back to ORIGINAL indices to check against violated_principle_indices
              const userOriginalIndices = selectedIndices.map(idx => (optionIndices[idx] !== undefined ? optionIndices[idx] : idx));

              const violated = step.violated_principle_indices || [];

              // Sort for comparison
              const userSorted = [...userOriginalIndices].sort((a, b) => a - b);
              const violatedSorted = [...violated].sort((a, b) => a - b);

              const isCorrect =
                userSorted.length === violatedSorted.length &&
                userSorted.every((val, index) => val === violatedSorted[index]);

              // evaluateStep expects a visual index. It effectively does: original = optionIndices[visual].
              // We need to pass a VISUAL index that maps to 0 (Correct) or 2 (Incorrect).
              const visualCorrect = optionIndices.indexOf(0);
              const visualIncorrect = optionIndices.indexOf(2);

              // Fallback if shuffle is not active or weird
              const finalIndex = isCorrect
                ? (visualCorrect !== -1 ? visualCorrect : 0)
                : (visualIncorrect !== -1 ? visualIncorrect : 2);

              evaluateStep(finalIndex, userSorted);
            }}
            disabled={isFeedbackVisible}
          />
        );
      } else if (step.options_inputs && step.options_inputs.length > 0) {
        // Catch-all for MCQ, custom_compose, trade_off_meters (button variant)
        artefact = (
          <div style={{ marginBottom: '20px' }}>
            {shuffledOptions.map((opt, i) => (
              <OptionButton key={i} label={opt} selected={selectedOption === i} onClick={() => handleOptionSelect(i)} />
            ))}
          </div>
        );
      } else {
        artefact = (
          <div style={{ background: COLORS.bgCard, borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🛠️</div>
            <div style={{ fontSize: '14px', color: COLORS.textMuted }}>Interaction: {step.interaction_type}</div>
            <div style={{ position: 'sticky', bottom: 0, padding: '20px 0', background: COLORS.bgCard, zIndex: 10 }}>
              <button id="mock-complete" onClick={() => evaluateStep()} style={{ width: '100%', background: COLORS.cta, border: 'none', padding: '16px', borderRadius: '12px', color: '#0D2436', fontWeight: 600 }}>Mock Completion</button>
            </div>
          </div>
        );
      }
    }

    return (
      <div style={{ minHeight: '100vh', background: COLORS.bg, padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
        {/* Progress Bar: Scenario Scoped & Smooth */}
        <div style={{ height: '6px', background: COLORS.bgCard, borderRadius: '3px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{
            height: '100%',
            width: `${((steps.filter(s => s.scenario_id === step.scenario_id).findIndex(s => s.step_id === step.step_id) + 1) / steps.filter(s => s.scenario_id === step.scenario_id).length) * 100}%`,
            background: COLORS.highlight,
            borderRadius: '3px',
            transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
          }} />
        </div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: COLORS.textDim, letterSpacing: '0.5px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', color: COLORS.text, fontWeight: 700 }}>STEP {currentStep + 1} OF {steps.length}</span>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {streak >= 2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: COLORS.highlightSoft, padding: '6px 12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '16px' }}>🔥</span>
                <span style={{ fontSize: '12px', color: COLORS.highlight, fontWeight: 700 }}>{streak}</span>
              </div>
            )}
            {/* REMOVED: Bonus Timer 
            <window.BonusTimer duration={bonusDuration} onExpire={() => { }} />
            */}
            <span style={{ color: COLORS.highlight }}>⚡️ {score.toLocaleString()}</span>
            {(() => {
              const t = formatTimer(simElapsed); return (
                <span style={{ color: COLORS.textDim, fontSize: '11px', fontFamily: 'monospace', background: 'rgba(56, 130, 202, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                  ⏰ {t.m}<span style={{ opacity: colonVisible ? 1 : 0 }}>:</span>{t.s}
                </span>
              );
            })()}
          </div>
        </div>

        {/* Scenario Header for Q1 */}
        {currentStep === 0 && (
          <div style={{ marginBottom: '24px' }}>
             <h2 style={{ fontSize: '24px', fontWeight: 700, color: COLORS.text, marginBottom: '12px' }}>{currentScenario.scenario_title}</h2>
             <p style={{ fontSize: '15px', color: COLORS.textMuted, lineHeight: 1.6 }}>
               You are a HR Manager in <strong>{currentScenario.workplace_context.company_type}</strong>. {currentScenario.workplace_context.business_state}.
               <br/><br/>
               {currentScenario.crisis_or_decision_trigger}
             </p>
          </div>
        )}

        {/* Integrated Mentor Notes / Theory Content */}
        {step.theory_content && (
           <window.TheoryCard theoryContent={step.theory_content} />
        )}

        {/* Scenario Context - Displayed above question */}
        {step.scenario_context && (
          <div style={{
            fontSize: '15px',
            color: COLORS.textMuted,
            lineHeight: 1.6,
            marginBottom: '24px', // Increased from 16px to match flow
            fontStyle: 'italic',
            opacity: 0.85,
            borderLeft: `3px solid ${COLORS.highlight}40`,
            paddingLeft: '12px'
          }}>
            <window.MarkdownText text={step.scenario_context} />
          </div>
        )}

        <h3 style={{ fontSize: '17px', fontWeight: 600, color: COLORS.text, opacity: 1, lineHeight: 1.4, marginBottom: '24px' }}>
          <window.MarkdownText text={'Q. ' + step.instruction_question} boldColor={COLORS.text} />
        </h3>

        {/* REMOVED: Explain This Question dropdown */}
        {artefact}

      </div>
    );
  }


  if (screen === 'closure') {
    return (
      <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.bg} 0%, #091620 100%)`, padding: '24px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <div style={{ background: COLORS.successBg, color: COLORS.success, fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', padding: '8px 14px', borderRadius: '20px', display: 'inline-block', marginBottom: '24px' }}>✓ SIMULATION COMPLETE</div>
          <h2 style={{ fontSize: '28px', fontWeight: 300, color: COLORS.text, lineHeight: 1.3, marginBottom: '16px' }}>Scenario Handled.</h2>
          <p style={{ fontSize: '14px', color: COLORS.textMuted, lineHeight: 1.6, marginBottom: '32px' }}>{currentSim.simulation_metadata.end_state}</p>
          <div style={{ background: COLORS.highlightSoft, borderRadius: '12px', padding: '16px', borderLeft: `4px solid ${COLORS.highlight}` }}>
            <p style={{ fontSize: '14px', color: COLORS.text, fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>"{currentSim.simulation_metadata.hook_to_next_simulation}"</p>
          </div>
        </div>
        <div style={{ position: 'sticky', bottom: 0, padding: '20px 0', background: '#091620', zIndex: 10, marginTop: 'auto' }}>
          <button id="unlock-next" onClick={nextSimulation} style={{ width: '100%', padding: '18px', background: COLORS.cta, border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#0D2436', boxShadow: '0 4px 24px rgba(127, 194, 65, 0.3)' }}>
            {currentSimulationIndex < simulations.length - 1 ? 'Unlock Next Scenario' : 'View Full Results'}
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'sim_result') {
    const nextSim = simulations[currentSimulationIndex + 1];
    return (
      <window.SimulationResult
        simulation={currentSim}
        score={score}
        onContinue={nextSimulation}
        nextSimTitle={nextSim ? nextSim.simulation_metadata.simulation_title : null}
        history={userHistory}
      />
    )
  }

  if (screen === 'review') {
    return null; // Review page logic is now in SimulationResult
  }

  if (screen === 'results') {
    return (
      <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.bg} 0%, #091620 100%)`, padding: '24px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '40px' }}>
          <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '8px', letterSpacing: '1px' }}>TOTAL SCORE</div>
          <h1 style={{ fontSize: '48px', fontWeight: 700, color: COLORS.highlight, margin: 0, textShadow: `0 0 20px ${COLORS.highlight}40` }}>{score.toLocaleString()}</h1>
          <div style={{ fontSize: '14px', color: COLORS.textMuted, marginTop: '4px' }}>Skillions Earned</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '16px', fontWeight: 600, paddingLeft: '4px' }}>COMPETENCIES PROVEN</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Crisis Mgmt', 'Prioritisation', 'Stakeholder Comms', 'Risk Assessment'].map((skill, i) => (
                <div key={i} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.highlight}`, color: COLORS.text, fontSize: '12px', padding: '8px 14px', borderRadius: '20px' }}>★ {skill}</div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '16px', fontWeight: 600, paddingLeft: '4px' }}>DELIVERABLES UNLOCKED</div>
            {simulations.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: COLORS.highlightSoft, borderRadius: '12px', marginBottom: '10px', borderLeft: `4px solid ${COLORS.highlight}` }}>
                <span style={{ fontSize: '24px' }}>🏆</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text }}>{s.simulation_metadata.simulation_title}</div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Certified Output Generated</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ opacity: 0.5 }}>
            <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '16px', fontWeight: 600, paddingLeft: '4px' }}>UPCOMING CONTENT (LOCKED)</div>
            <div style={{ padding: '16px', background: COLORS.bgCard, borderRadius: '12px', border: `1px dashed ${COLORS.textDim}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🔒</span>
              <div style={{ fontSize: '13px', color: COLORS.textMuted }}>Advanced Negotiation Scenarios</div>
            </div>
          </div>
        </div>

        <div style={{ position: 'sticky', bottom: 0, padding: '20px 0', background: 'transperant', zIndex: 10, marginTop: 'auto' }}>
          <button id="reset-path" onClick={() => window.location.reload()} style={{ width: '100%', padding: '18px', background: COLORS.cta, border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#0D2436', boxShadow: '0 4px 24px rgba(127, 194, 65, 0.3)' }}>⏳ Daily Scenarios Sent To Whatsapp</button>
        </div>
      </div>
    );
  }

  return null;
};
