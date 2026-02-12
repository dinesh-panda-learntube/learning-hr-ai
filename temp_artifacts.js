
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
                <div style={{ marginTop: '10px', fontWeight: 600, fontSize: '14px' }}>Hiring Manager</div>
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
