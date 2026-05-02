'use client'
import { useState, useEffect, useRef } from 'react'

/* ─── COUNTRY CODES ─── */
const COUNTRY_CODES = [
  { code: '+93',  flag: '🇦🇫', name: 'Afghanistan' },
  { code: '+355', flag: '🇦🇱', name: 'Albania' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+54',  flag: '🇦🇷', name: 'Argentina' },
  { code: '+61',  flag: '🇦🇺', name: 'Australia' },
  { code: '+43',  flag: '🇦🇹', name: 'Austria' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+32',  flag: '🇧🇪', name: 'Belgium' },
  { code: '+55',  flag: '🇧🇷', name: 'Brazil' },
  { code: '+1',   flag: '🇨🇦', name: 'Canada' },
  { code: '+86',  flag: '🇨🇳', name: 'China' },
  { code: '+57',  flag: '🇨🇴', name: 'Colombia' },
  { code: '+385', flag: '🇭🇷', name: 'Croatia' },
  { code: '+420', flag: '🇨🇿', name: 'Czech Republic' },
  { code: '+45',  flag: '🇩🇰', name: 'Denmark' },
  { code: '+20',  flag: '🇪🇬', name: 'Egypt' },
  { code: '+372', flag: '🇪🇪', name: 'Estonia' },
  { code: '+358', flag: '🇫🇮', name: 'Finland' },
  { code: '+33',  flag: '🇫🇷', name: 'France' },
  { code: '+49',  flag: '🇩🇪', name: 'Germany' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+30',  flag: '🇬🇷', name: 'Greece' },
  { code: '+36',  flag: '🇭🇺', name: 'Hungary' },
  { code: '+91',  flag: '🇮🇳', name: 'India' },
  { code: '+62',  flag: '🇮🇩', name: 'Indonesia' },
  { code: '+98',  flag: '🇮🇷', name: 'Iran' },
  { code: '+964', flag: '🇮🇶', name: 'Iraq' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland' },
  { code: '+972', flag: '🇮🇱', name: 'Israel' },
  { code: '+39',  flag: '🇮🇹', name: 'Italy' },
  { code: '+81',  flag: '🇯🇵', name: 'Japan' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+60',  flag: '🇲🇾', name: 'Malaysia' },
  { code: '+52',  flag: '🇲🇽', name: 'Mexico' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+977', flag: '🇳🇵', name: 'Nepal' },
  { code: '+31',  flag: '🇳🇱', name: 'Netherlands' },
  { code: '+64',  flag: '🇳🇿', name: 'New Zealand' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+47',  flag: '🇳🇴', name: 'Norway' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+92',  flag: '🇵🇰', name: 'Pakistan' },
  { code: '+51',  flag: '🇵🇪', name: 'Peru' },
  { code: '+63',  flag: '🇵🇭', name: 'Philippines' },
  { code: '+48',  flag: '🇵🇱', name: 'Poland' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+40',  flag: '🇷🇴', name: 'Romania' },
  { code: '+7',   flag: '🇷🇺', name: 'Russia' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+65',  flag: '🇸🇬', name: 'Singapore' },
  { code: '+27',  flag: '🇿🇦', name: 'South Africa' },
  { code: '+82',  flag: '🇰🇷', name: 'South Korea' },
  { code: '+34',  flag: '🇪🇸', name: 'Spain' },
  { code: '+94',  flag: '🇱🇰', name: 'Sri Lanka' },
  { code: '+46',  flag: '🇸🇪', name: 'Sweden' },
  { code: '+41',  flag: '🇨🇭', name: 'Switzerland' },
  { code: '+886', flag: '🇹🇼', name: 'Taiwan' },
  { code: '+66',  flag: '🇹🇭', name: 'Thailand' },
  { code: '+90',  flag: '🇹🇷', name: 'Turkey' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+44',  flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+1',   flag: '🇺🇸', name: 'United States' },
  { code: '+84',  flag: '🇻🇳', name: 'Vietnam' },
  { code: '+967', flag: '🇾🇪', name: 'Yemen' },
  { code: '+263', flag: '🇿🇼', name: 'Zimbabwe' },
]

/* ─── VALIDATION ─── */
const validate = {
  name:    (v: string) => v.trim().length < 2 ? 'Name must be at least 2 characters' : '',
  email:   (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address',
  phone:   (v: string, code: string) => {
    if (v === '') return ''
    const digits = v.replace(/[\s\-()+]/g, '')
    if (!/^\d+$/.test(digits)) return 'Phone must contain digits only'
    if (digits.length < 6)  return 'Phone number too short'
    if (digits.length > 15) return 'Phone number too long'
    return ''
  },
  message: (v: string) => v.trim().length < 10 ? 'Message must be at least 10 characters' : '',
}

/* ─── SVG COMPONENTS ─── */
function Gear({ size, teeth, rot, color, cx, cy, hollow = false, op = 0.9 }: {
  size:number; teeth:number; rot:number; color:string; cx:number; cy:number; hollow?:boolean; op?:number
}) {
  const r = size / 2, ir = r * 0.6, th = r * 0.22
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a = (j: number) => ((i + j) / teeth) * Math.PI * 2
    const p = (ang: number, rr: number): [number,number] => [cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr]
    const [x1,y1] = p(a(0), r),   [x2,y2] = p(a(0.25), r+th)
    const [x3,y3] = p(a(0.75), r+th), [x4,y4] = p(a(1), r)
    d += `${i===0?'M':'L'}${x1},${y1}L${x2},${y2}L${x3},${y3}L${x4},${y4}`
  }
  d += 'Z'
  const spokes = [0,45,90,135,180,225,270,315]
  return (
    <g transform={`rotate(${rot},${cx},${cy})`} opacity={op}>
      <path d={d} fill={color}/>
      <circle cx={cx} cy={cy} r={ir} fill="#06060a" stroke={color} strokeWidth="1.5"/>
      {hollow && <circle cx={cx} cy={cy} r={r*0.18} fill={color}/>}
      {spokes.map(ang => {
        const rd = ang * Math.PI / 180
        return (
          <line key={ang}
            x1={cx + Math.cos(rd)*ir*0.28} y1={cy + Math.sin(rd)*ir*0.28}
            x2={cx + Math.cos(rd)*ir*0.74} y2={cy + Math.sin(rd)*ir*0.74}
            stroke={color} strokeWidth="1.2" opacity="0.45"/>
        )
      })}
      <circle cx={cx} cy={cy} r={r*0.12} fill={color} opacity="0.7"/>
      {/* outer ring detail */}
      <circle cx={cx} cy={cy} r={ir*1.08} fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 4"/>
    </g>
  )
}

function Rim({ x, y, r, rot, color, spokes=10 }: {x:number;y:number;r:number;rot:number;color:string;spokes?:number}) {
  return (
    <g transform={`rotate(${rot},${x},${y})`}>
      <circle cx={x} cy={y} r={r}     fill="none" stroke={color} strokeWidth="2.5" opacity="0.55"/>
      <circle cx={x} cy={y} r={r*0.72} fill="none" stroke={color} strokeWidth="1"   opacity="0.22"/>
      <circle cx={x} cy={y} r={r*0.42} fill="none" stroke={color} strokeWidth="0.8" opacity="0.15"/>
      {Array.from({length: spokes}).map((_,i) => {
        const a = (i / spokes) * Math.PI * 2
        return (
          <line key={i}
            x1={x + Math.cos(a)*r*0.12} y1={y + Math.sin(a)*r*0.12}
            x2={x + Math.cos(a)*r}      y2={y + Math.sin(a)*r}
            stroke={color} strokeWidth="1.5" opacity="0.42"/>
        )
      })}
      {Array.from({length:16}).map((_,i) => {
        const a = (i/16) * Math.PI * 2
        return <circle key={i} cx={x+Math.cos(a)*r} cy={y+Math.sin(a)*r} r="2.5" fill={color} opacity="0.6"/>
      })}
      <circle cx={x} cy={y} r={r*0.1} fill={color} opacity="0.75"/>
    </g>
  )
}

function Pendulum({ angle, cx, cy, y0, len, color }: {angle:number;cx:number;cy:number;y0:number;len:number;color:string}) {
  const rad = angle * Math.PI / 180
  const ex = cx + Math.sin(rad)*len, ey = cy + Math.cos(rad)*len
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} opacity="0.7"/>
      <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={color} strokeWidth="1.8" opacity="0.55"/>
      {/* pendulum bob */}
      <circle cx={ex} cy={ey} r={15} fill="none" stroke={color} strokeWidth="2.2" opacity="0.75"/>
      <circle cx={ex} cy={ey} r={9}  fill="none" stroke={color} strokeWidth="1"   opacity="0.35"/>
      <circle cx={ex} cy={ey} r={4}  fill={color} opacity="0.9"/>
      {/* decorative cross inside bob */}
      <line x1={ex-7} y1={ey} x2={ex+7} y2={ey} stroke={color} strokeWidth="0.8" opacity="0.4"/>
      <line x1={ex} y1={ey-7} x2={ex} y2={ey+7} stroke={color} strokeWidth="0.8" opacity="0.4"/>
    </g>
  )
}

function Piston({ x, y, off, color }: {x:number;y:number;off:number;color:string}) {
  return (
    <g opacity="0.6">
      {/* cylinder */}
      <rect x={x-14} y={y} width={28} height={55} rx="2" fill="none" stroke={color} strokeWidth="1.2"/>
      {/* piston head */}
      <rect x={x-11} y={y+off} width={22} height={16} rx="1.5" fill="none" stroke={color} strokeWidth="1.5"/>
      <rect x={x-7}  y={y+off+3} width={14} height={5} fill={color} opacity="0.25"/>
      {/* rod */}
      <line x1={x} y1={y} x2={x} y2={y+off} stroke={color} strokeWidth="2"/>
      {/* base plate */}
      <rect x={x-18} y={y+49} width={36} height={8} rx="1" fill="none" stroke={color} strokeWidth="1.2"/>
      {/* pressure lines */}
      <line x1={x-11} y1={y+8}  x2={x+11} y2={y+8}  stroke={color} strokeWidth="0.7" opacity="0.35"/>
      <line x1={x-11} y1={y+16} x2={x+11} y2={y+16} stroke={color} strokeWidth="0.7" opacity="0.35"/>
    </g>
  )
}

function Chain({ x1,y1,x2,y2,t,color }: {x1:number;y1:number;x2:number;y2:number;t:number;color:string}) {
  const dx=x2-x1, dy=y2-y1, len=Math.sqrt(dx*dx+dy*dy), links=Math.floor(len/14)
  return (
    <g opacity="0.3">
      {Array.from({length:links}).map((_,i) => {
        const p = ((i + (t*0.016)%1)) / links
        const bx = x1+dx*p, by = y1+dy*p
        const ang = Math.atan2(dy,dx)
        return (
          <g key={i} transform={`rotate(${ang*180/Math.PI},${bx},${by})`}>
            <rect x={bx-4} y={by-2.5} width={8} height={5} rx="1.2" fill="none" stroke={color} strokeWidth="1"/>
          </g>
        )
      })}
    </g>
  )
}

function Sparks({ cx,cy,active,t }: {cx:number;cy:number;active:boolean;t:number}) {
  if (!active) return null
  return (
    <g>
      {[0,40,80,120,160,200,240,280,320].map(a => {
        const rd = a*Math.PI/180, r = 6+Math.sin(t*0.2+a*0.05)*5
        return (
          <line key={a} x1={cx} y1={cy}
            x2={cx+Math.cos(rd)*r} y2={cy+Math.sin(rd)*r}
            stroke="#f0cc6e" strokeWidth="1.4" opacity="0.75"/>
        )
      })}
      <circle cx={cx} cy={cy} r={3} fill="#fff" opacity="0.9"/>
    </g>
  )
}

/* ─── MAIN COMPONENT ─── */
export default function ContactSection() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [dialCode,setDialCode]= useState('+92')
  const [phone,   setPhone]   = useState('')
  const [message, setMessage] = useState('')
  const [agreed,  setAgreed]  = useState(false)
  const [touched, setTouched] = useState({name:false,email:false,phone:false,message:false,agreed:false})
  const [submitted,setSubmitted]=useState(false)
  const [dropOpen,setDropOpen]= useState(false)
  const [search,  setSearch]  = useState('')
  const tickRef = useRef(0)
  const [tick,  setTick]      = useState(0)
  const dropRef = useRef<HTMLDivElement>(null)
  const rafRef  = useRef<number>(0)

  /* continuous RAF tick */
  useEffect(() => {
    const loop = () => {
      tickRef.current++
      setTick(tickRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* close dropdown on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const errs = {
    name:    touched.name    ? validate.name(name)            : '',
    email:   touched.email   ? validate.email(email)          : '',
    phone:   touched.phone   ? validate.phone(phone,dialCode) : '',
    message: touched.message ? validate.message(message)      : '',
    agreed:  touched.agreed && !agreed ? 'You must agree to proceed' : '',
  }

  const fieldsDone = [
    !!(name    && !validate.name(name)),
    !!(email   && !validate.email(email)),
    !!(message && !validate.message(message)),
    agreed,
  ].filter(Boolean).length
  const progress  = (fieldsDone / 4) * 100
  const canSubmit = !validate.name(name) && !validate.email(email) &&
                    !validate.phone(phone,dialCode) && !validate.message(message) && agreed && name && email && message

  const blur = (f: keyof typeof touched) => setTouched(p => ({...p,[f]:true}))

  const handleSubmit = () => {
    setTouched({name:true,email:true,phone:true,message:true,agreed:true})
    if (!canSubmit) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3500)
  }

  /* speed increases as form fills */
  const spd = 0.3 + (progress/100)*2.2
  const t   = tick

  /* gear rotations — all continuous, different rates */
  const g1r = t * spd * 0.28
  const g2r = -(t * spd * 0.52)
  const g3r = t * spd * 0.88
  const g4r = -(t * spd * 0.40)
  const g5r = t * spd * 0.65
  const g6r = -(t * spd * 0.75)
  const g7r = t * spd * 0.35
  const g8r = -(t * spd * 0.58)

  const r1 = t * spd * 0.18
  const r2 = -(t * spd * 0.30)
  const r3 = t * spd * 0.42

  const pendA    = Math.sin(t * 0.035) * 24
  const pistonOff = 18 + Math.sin(t * spd * 0.068) * 20

  const filtered = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
  )
  const sel = COUNTRY_CODES.find(c => c.code === dialCode) || COUNTRY_CODES[0]

  /* progress arc */
  const PR = 26, PCX = 480, PCY = 32
  const circ = 2 * Math.PI * PR
  const dash  = (progress/100) * circ

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;600&display=swap');

        @keyframes ct-glitch {
          0%,100%{ clip-path:inset(0 0 100% 0); transform:translateX(0); }
          10%{ clip-path:inset(30% 0 40% 0); transform:translateX(-3px); }
          20%{ clip-path:inset(70% 0 10% 0); transform:translateX(3px); }
          30%{ clip-path:inset(10% 0 75% 0); transform:translateX(-2px); }
          40%{ clip-path:inset(55% 0 30% 0); transform:translateX(2px); }
          50%{ clip-path:inset(0 0 100% 0); }
        }
        @keyframes ct-scanline { from{transform:translateY(-2px)} to{transform:translateY(602px)} }
        @keyframes ct-blink    { 0%,100%{opacity:.2} 50%{opacity:.8} }
        @keyframes ct-pulse    { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
        @keyframes ct-hglow {
          0%,100%{ text-shadow: 0 0 30px rgba(232,25,44,0.4), 0 0 60px rgba(232,25,44,0.15); }
          50%{     text-shadow: 0 0 50px rgba(232,25,44,0.7), 0 0 100px rgba(201,168,76,0.2), 0 0 150px rgba(232,25,44,0.1); }
        }
        @keyframes ct-underline { from{width:0} to{width:100%} }
        @keyframes ct-fadein    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }

        #ct-sec {
          background:#06060a; position:relative; overflow:hidden;
          padding:clamp(3.5rem,8vh,6rem) clamp(1.5rem,5vw,5rem);
          font-family:'JetBrains Mono',monospace;
        }
        #ct-sec::before {
          content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
          background:
            radial-gradient(ellipse 60% 50% at 50% 0%,   rgba(232,25,44,0.05) 0%,transparent 65%),
            radial-gradient(ellipse 40% 35% at 10% 80%,  rgba(201,168,76,0.04) 0%,transparent 60%),
            radial-gradient(ellipse 35% 30% at 90% 85%,  rgba(139,0,0,0.04) 0%,transparent 55%);
        }
        #ct-sec::after {
          content:''; position:absolute; inset:0; pointer-events:none; z-index:1;
          background-image:radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px);
          background-size:28px 28px;
          mask-image:radial-gradient(ellipse 90% 90% at 50% 50%,black 20%,transparent 100%);
          -webkit-mask-image:radial-gradient(ellipse 90% 90% at 50% 50%,black 20%,transparent 100%);
        }

        /* ── HEADING CENTER ── */
        #ct-head {
          position:relative; z-index:10; text-align:center;
          margin-bottom:clamp(1.8rem,4vh,3rem);
          animation:ct-fadein .6s cubic-bezier(.16,1,.3,1) both;
        }
        .ct-eyebrow {
          font-size:clamp(.4rem,.72vw,.55rem); letter-spacing:.52em; text-transform:uppercase;
          color:rgba(232,25,44,.55); margin-bottom:.8rem;
          display:flex; align-items:center; justify-content:center; gap:12px;
        }
        .ct-ey-line { width:28px; height:1px; background:rgba(232,25,44,.4); flex-shrink:0; }
        .ct-h1 {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(2rem,5.5vw,5rem); font-weight:900; line-height:.96;
          color:#fff; letter-spacing:-.01em;
          animation:ct-hglow 3s ease-in-out infinite;
          position:relative; display:inline-block;
        }
        .ct-h1 .red { color:#e8192c; }
        /* glitch layer */
        .ct-h1::before {
          content:attr(data-text); position:absolute; left:0; top:0; width:100%;
          color:#e8192c; clip-path:inset(0 0 100% 0);
          animation:ct-glitch 6s ease-in-out infinite 1.5s;
        }
        /* underline */
        .ct-h1-line {
          display:block; height:2px; margin:0.6rem auto 0;
          background:linear-gradient(to right,transparent,#e8192c 40%,#c9a84c 60%,transparent);
          animation:ct-underline .8s .3s cubic-bezier(.16,1,.3,1) both;
        }
        .ct-sub {
          font-family:'Outfit',sans-serif;
          font-size:clamp(.68rem,1.1vw,.86rem); color:rgba(244,244,246,.3);
          margin-top:.8rem; font-weight:300; letter-spacing:.03em;
        }

        /* ── MACHINE BOX ── */
        #ct-machine {
          position:relative; width:100%; max-width:980px; margin:0 auto;
          height:clamp(520px,62vh,640px);
          border:1px solid rgba(201,168,76,0.14);
          background:#06060a; overflow:hidden; z-index:5;
        }
        /* scan line inside machine */
        .ct-scanline {
          position:absolute; left:0; right:0; height:1px; z-index:30; pointer-events:none;
          background:linear-gradient(to right,transparent,rgba(232,25,44,.07),transparent);
          animation:ct-scanline 11s linear infinite;
        }

        /* corner brackets on machine */
        .ct-cm { position:absolute; width:18px; height:18px; border-color:rgba(201,168,76,0.45); border-style:solid; z-index:20; pointer-events:none; }
        .ct-tl { top:10px;  left:10px;  border-width:2px 0 0 2px; }
        .ct-tr { top:10px;  right:10px; border-width:2px 2px 0 0; }
        .ct-bl { bottom:10px; left:10px;  border-width:0 0 2px 2px; }
        .ct-br { bottom:10px; right:10px; border-width:0 2px 2px 0; }

        /* ── FORM AREA (centered in machine) ── */
        #ct-form {
          position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
          width:clamp(300px,36vw,360px); z-index:20;
          display:flex; flex-direction:column; gap:10px;
        }
        .ct-row { display:flex; align-items:flex-start; gap:8px; }
        .ct-conn { width:16px; height:2px; background:rgba(201,168,76,0.4); flex-shrink:0; margin-top:19px; }
        .ct-field { flex:1; position:relative; }

        .ct-label {
          position:absolute; top:-8px; left:8px; z-index:1;
          font-size:8px; letter-spacing:3px; text-transform:uppercase;
          color:#c9a84c; background:#06060a; padding:0 4px;
        }
        .ct-input, .ct-textarea {
          width:100%; background:rgba(6,6,10,0.95);
          border:1px solid rgba(201,168,76,0.3);
          color:rgba(244,244,246,.9);
          font-family:'JetBrains Mono',monospace; font-size:11px;
          padding:9px 11px; outline:none; resize:none;
          transition:border-color .25s, box-shadow .25s;
        }
        .ct-input::placeholder, .ct-textarea::placeholder {
          color:rgba(201,168,76,0.22); letter-spacing:1px; font-size:10px;
        }
        .ct-input:focus, .ct-textarea:focus {
          border-color:#c9a84c; box-shadow:0 0 0 1px rgba(201,168,76,0.2),0 0 14px rgba(201,168,76,0.15);
        }
        .ct-input.ok, .ct-textarea.ok {
          border-color:#e8192c; box-shadow:0 0 0 1px rgba(232,25,44,0.25),0 0 10px rgba(232,25,44,0.12);
        }
        .ct-input.err, .ct-textarea.err { border-color:#ff4444; }
        .ct-err { font-size:8px; letter-spacing:1px; color:#ff5555; margin-top:2px; min-height:11px; padding-left:2px; }

        /* phone row */
        .ct-phone-wrap { display:flex; }
        .ct-dial {
          width:104px; flex-shrink:0; background:rgba(6,6,10,0.95);
          border:1px solid rgba(201,168,76,0.3); border-right:none;
          color:rgba(244,244,246,.85); font-family:'JetBrains Mono',monospace;
          font-size:10px; padding:9px 7px; cursor:pointer;
          display:flex; align-items:center; gap:5px; user-select:none;
          transition:border-color .25s;
        }
        .ct-dial:hover { border-color:#c9a84c; }
        .ct-dial.open  { border-color:#c9a84c; box-shadow:0 0 0 1px rgba(201,168,76,0.15); }
        .ct-phone-num {
          flex:1; background:rgba(6,6,10,0.95);
          border:1px solid rgba(201,168,76,0.3); border-left:none;
          color:rgba(244,244,246,.9); font-family:'JetBrains Mono',monospace;
          font-size:11px; padding:9px 10px; outline:none;
          transition:border-color .25s, box-shadow .25s;
        }
        .ct-phone-num:focus { border-color:#c9a84c; box-shadow:0 0 0 1px rgba(201,168,76,0.15),0 0 14px rgba(201,168,76,0.12); }
        .ct-phone-num.ok  { border-color:#e8192c; }
        .ct-phone-num.err { border-color:#ff4444; }
        .ct-phone-num::placeholder { color:rgba(201,168,76,0.22); font-size:10px; }

        /* dropdown */
        .ct-drop {
          position:absolute; top:100%; left:0; width:270px;
          background:#0a0a0f; border:1px solid rgba(201,168,76,0.25);
          z-index:200; max-height:190px; overflow-y:auto;
          box-shadow:0 14px 44px rgba(0,0,0,0.9);
        }
        .ct-drop::-webkit-scrollbar { width:3px; }
        .ct-drop::-webkit-scrollbar-thumb { background:rgba(201,168,76,0.3); border-radius:2px; }
        .ct-drop-search {
          width:100%; background:#080810; border:none; border-bottom:1px solid rgba(201,168,76,0.2);
          color:rgba(244,244,246,.8); font-family:'JetBrains Mono',monospace;
          font-size:10px; padding:7px 10px; outline:none; letter-spacing:1px;
        }
        .ct-drop-search::placeholder { color:rgba(201,168,76,0.22); }
        .ct-drop-item {
          padding:6px 10px; cursor:pointer; font-size:10px; color:rgba(244,244,246,.8);
          display:flex; gap:8px; align-items:center; transition:background .1s;
        }
        .ct-drop-item:hover { background:rgba(201,168,76,0.07); }
        .ct-drop-item.sel   { background:rgba(232,25,44,0.1); }

        /* checkbox */
        .ct-cb-row { display:flex; align-items:center; gap:10px; cursor:pointer; }
        .ct-cb {
          width:14px; height:14px; flex-shrink:0;
          border:1px solid rgba(201,168,76,0.35); background:transparent;
          display:flex; align-items:center; justify-content:center;
          transition:border-color .2s, background .2s;
        }
        .ct-cb.on  { border-color:#e8192c; background:rgba(232,25,44,0.15); }
        .ct-cb.on::after { content:''; width:6px; height:6px; background:#e8192c; }
        .ct-cb.err { border-color:#ff4444; }
        .ct-cb-lbl { font-size:9px; letter-spacing:1.5px; color:rgba(244,244,246,.35); text-transform:uppercase; }

        /* submit button */
        .ct-submit {
          background:none; border:none; cursor:pointer; padding:0; width:100%; margin-top:2px;
        }
        .ct-submit-inner {
          display:flex; align-items:center; justify-content:space-between;
          border:1px solid rgba(232,25,44,0.4); padding:11px 18px;
          background:rgba(232,25,44,0.06); position:relative; overflow:hidden;
          transition:background .3s, border-color .3s;
        }
        .ct-submit-inner::before {
          content:''; position:absolute; left:-100%; top:0; width:100%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(201,168,76,0.08),transparent);
          transition:left .5s;
        }
        .ct-submit:hover .ct-submit-inner::before { left:100%; }
        .ct-submit:hover .ct-submit-inner { background:rgba(232,25,44,0.18); border-color:rgba(232,25,44,0.8); }
        .ct-submit-txt {
          font-family:'Cinzel Decorative',serif; font-size:11px;
          letter-spacing:3px; color:#fff; text-transform:uppercase;
        }
        .ct-submit-arr { color:#c9a84c; font-size:15px; transition:transform .3s; }
        .ct-submit:hover .ct-submit-arr { transform:translateX(4px); }

        /* progress bar */
        .ct-prog { position:absolute; bottom:0; left:0; right:0; height:3px; background:rgba(201,168,76,0.07); z-index:15; }
        .ct-prog-fill {
          height:100%;
          background:linear-gradient(90deg,#8b0000,#e8192c 50%,#c9a84c);
          transition:width .7s cubic-bezier(.4,0,.2,1);
          box-shadow:0 0 8px rgba(232,25,44,0.5);
        }

        /* status */
        .ct-status {
          position:absolute; bottom:12px; left:50%; transform:translateX(-50%);
          font-size:9px; letter-spacing:4px; color:#c9a84c; white-space:nowrap;
          opacity:0; transition:opacity .4s; pointer-events:none; z-index:20;
          animation:ct-pulse 1.5s ease-in-out infinite;
        }
        .ct-status.on { opacity:1; }

        /* char count */
        .ct-cnt { font-size:8px; letter-spacing:1px; color:rgba(201,168,76,0.3); text-align:right; margin-top:2px; }

        @media(max-width:700px) {
          #ct-machine { height:auto; min-height:580px; }
          #ct-form { position:relative; top:auto; left:auto; transform:none; margin:clamp(1.5rem,4vw,3rem) auto; }
        }
      `}</style>

      <section id="ct-sec">

        {/* ── CENTERED HEADING ── */}
        <div id="ct-head">
          <div className="ct-eyebrow">
            <span className="ct-ey-line"/>
            TRANSMISSION OPEN
            <span className="ct-ey-line"/>
          </div>
          <h2 className="ct-h1" data-text="CONTACT MACHINE">
            CONTACT<br/><span className="red">MACHINE</span>
            <span className="ct-h1-line" style={{width:'60%'}}/>
          </h2>
          <p className="ct-sub">Let&apos;s build something real — send the signal</p>
        </div>

        {/* ── MACHINE ── */}
        <div id="ct-machine">
          <div className="ct-scanline"/>
          <div className="ct-cm ct-tl"/>
          <div className="ct-cm ct-tr"/>
          <div className="ct-cm ct-bl"/>
          <div className="ct-cm ct-br"/>

          {/* ── SVG MECHANICAL LAYER ── */}
          <svg
            style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}
            viewBox="0 0 980 640"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* grid */}
            <defs>
              <pattern id="cg" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M36 0 L0 0 0 36" fill="none" stroke="rgba(201,168,76,0.025)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="980" height="640" fill="url(#cg)"/>

            {/* ════ TOP-RIGHT GEAR CLUSTER ════ */}
            {/* main large gear */}
            <Gear size={160} teeth={22} rot={g1r} color="#c9a84c" cx={885} cy={95}  op={0.92}/>
            {/* meshed medium gear */}
            <Gear size={96}  teeth={13} rot={g2r} color="#8b0000" cx={782} cy={138} hollow op={0.85}/>
            {/* small accent */}
            <Gear size={66}  teeth={9}  rot={g3r} color="#e8192c" cx={876} cy={222} op={0.80}/>
            {/* tiny */}
            <Gear size={46}  teeth={7}  rot={g4r} color="#c9a84c" cx={818} cy={246} op={0.72}/>
            <Gear size={32}  teeth={5}  rot={g5r} color="#f0cc6e" cx={862} cy={274} op={0.62}/>
            {/* sparks at mesh point */}
            <Sparks cx={834} cy={192} active={progress > 50} t={t}/>

            {/* ════ BOTTOM-LEFT GEAR CLUSTER ════ */}
            <Gear size={78}  teeth={11} rot={g6r} color="#8b0000" cx={76}  cy={510} op={0.68}/>
            <Gear size={50}  teeth={7}  rot={g3r} color="#c9a84c" cx={138} cy={534} op={0.62}/>
            <Gear size={34}  teeth={5}  rot={g7r} color="#e8192c" cx={174} cy={513} op={0.55}/>

            {/* ════ LEFT RIMS ════ */}
            <Rim x={68}  y={95}  r={60} rot={r1} color="#c9a84c" spokes={12}/>
            <Rim x={95}  y={440} r={42} rot={r2} color="#8b0000" spokes={9}/>
            <Rim x={50}  y={272} r={26} rot={r3} color="#e8192c" spokes={7}/>

            {/* ════ RIGHT SIDE RIM ════ */}
            <Rim x={912} y={440} r={36} rot={g8r} color="#8b0000" spokes={8}/>

            {/* ════ PENDULUM — right side ════ */}
            <Pendulum angle={pendA} cx={740} cy={400} y0={400} len={110} color="#c9a84c"/>

            {/* ════ PISTON — left side ════ */}
            <Piston x={150} y={162} off={pistonOff} color="#c9a84c"/>
            <circle cx={150} cy={162} r={20} fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.3"/>
            <line x1={150} y1={142} x2={150} y2={108} stroke="#c9a84c" strokeWidth="1.5" opacity="0.35"/>
            <circle cx={150} cy={106} r={8} fill="none" stroke="#c9a84c" strokeWidth="1.2" opacity="0.4"/>

            {/* ════ CHAINS ════ */}
            <Chain x1={68} y1={155} x2={68} y2={400} t={t} color="#c9a84c"/>
            <Chain x1={885} y1={253} x2={885} y2={460} t={t} color="#8b0000"/>

            {/* ════ CONNECTING DASHED LINES ════ */}
            {([
              [126,95,200,152,'#c9a84c'],[98,480,178,520,'#8b0000'],
              [782,220,680,290,'#c9a84c'],[740,510,660,548,'#8b0000'],
              [174,510,240,485,'#e8192c'],[130,440,175,430,'#c9a84c'],
            ] as [number,number,number,number,string][]).map(([ax,ay,bx,by,col],i) => (
              <line key={i} x1={ax} y1={ay} x2={bx} y2={by}
                stroke={col} strokeWidth="0.8" opacity="0.2" strokeDasharray="5 5"/>
            ))}

            {/* ════ PROGRESS ARC — top center ════ */}
            <circle cx={PCX} cy={PCY} r={PR} fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="2.5"/>
            <circle cx={PCX} cy={PCY} r={PR} fill="none" stroke="#c9a84c" strokeWidth="2.8"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
              transform={`rotate(-90,${PCX},${PCY})`} opacity="0.8"/>
            <text x={PCX} y={PCY+4} textAnchor="middle" fill="#c9a84c" fontSize="9" fontFamily="JetBrains Mono">{Math.round(progress)}%</text>

            {/* ════ GAUGE — bottom right ════ */}
            {Array.from({length:21}).map((_,i) => {
              const v=i*5, a=(v/100)*Math.PI*1.4 - Math.PI*0.7
              const r1=36, r2=i%4===0?46:40
              return (
                <line key={i}
                  x1={922+Math.cos(a)*r1} y1={506+Math.sin(a)*r1}
                  x2={922+Math.cos(a)*r2} y2={506+Math.sin(a)*r2}
                  stroke={v<=progress ? '#c9a84c' : 'rgba(201,168,76,0.15)'}
                  strokeWidth={i%4===0?2:1} opacity="0.9"/>
              )
            })}
            {/* gauge needle */}
            {(() => {
              const needleA = (progress/100)*Math.PI*1.4 - Math.PI*0.7
              return (
                <line
                  x1={922} y1={506}
                  x2={922+Math.cos(needleA)*38} y2={506+Math.sin(needleA)*38}
                  stroke="#e8192c" strokeWidth="2" opacity="0.85" strokeLinecap="round"/>
              )
            })()}
            <text x={922} y={510} textAnchor="middle" fill="#c9a84c" fontSize="8" fontFamily="JetBrains Mono" opacity="0.5">LOAD</text>
            <circle cx={922} cy={506} r={4} fill="#e8192c" opacity="0.75"/>

            {/* ════ CORNER BRACKET DECORATIONS ════ */}
            {[
              'M14,14 L46,14 L46,18 L18,18 L18,46 L14,46 Z',
              'M966,14 L934,14 L934,18 L962,18 L962,46 L966,46 Z',
              'M14,626 L46,626 L46,622 L18,622 L18,594 L14,594 Z',
              'M966,626 L934,626 L934,622 L962,622 L962,594 L966,594 Z',
            ].map((d,i) => <path key={i} d={d} fill="#c9a84c" opacity="0.35"/>)}

            {/* ════ ANIMATED SCAN LINE ════ */}
            <line
              x1={0} y1={(t * spd * 0.7) % 640}
              x2={980} y2={(t * spd * 0.7) % 640}
              stroke="#c9a84c" strokeWidth="0.6" opacity="0.04"/>

            {/* ════ SMALL DECORATIVE ELEMENTS ════ */}
            {/* bolt circles at gear joints */}
            {([[886,95],[782,138],[876,222],[818,246]] as [number,number][]).map(([cx2,cy2],i) => (
              <circle key={i} cx={cx2} cy={cy2} r={3.5} fill="#06060a" stroke="#c9a84c" strokeWidth="1" opacity="0.6"/>
            ))}
            {/* measurement tick marks — left edge */}
            {Array.from({length:20}).map((_,i) => (
              <line key={i}
                x1={0} y1={30+i*30} x2={i%5===0?14:8} y2={30+i*30}
                stroke="#c9a84c" strokeWidth="0.8" opacity={i%5===0?0.35:0.15}/>
            ))}
            {/* right edge ticks */}
            {Array.from({length:20}).map((_,i) => (
              <line key={i}
                x1={980} y1={30+i*30} x2={i%5===0?966:972} y2={30+i*30}
                stroke="#c9a84c" strokeWidth="0.8" opacity={i%5===0?0.35:0.15}/>
            ))}
          </svg>

          {/* ── FORM ── */}
          <div id="ct-form">

            {/* NAME */}
            <div className="ct-row">
              <div className="ct-conn"/>
              <div className="ct-field">
                <span className="ct-label">Name</span>
                <input
                  type="text" placeholder="YOUR NAME" value={name}
                  onChange={e => setName(e.target.value)}
                  onBlur={() => blur('name')}
                  className={`ct-input${errs.name ? ' err' : name && !validate.name(name) ? ' ok' : ''}`}
                />
                <div className="ct-err">{errs.name}</div>
              </div>
            </div>

            {/* EMAIL */}
            <div className="ct-row">
              <div className="ct-conn"/>
              <div className="ct-field">
                <span className="ct-label">E-Mail</span>
                <input
                  type="email" placeholder="YOUR@EMAIL.COM" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => blur('email')}
                  className={`ct-input${errs.email ? ' err' : email && !validate.email(email) ? ' ok' : ''}`}
                />
                <div className="ct-err">{errs.email}</div>
              </div>
            </div>

            {/* PHONE */}
            <div className="ct-row">
              <div className="ct-conn"/>
              <div className="ct-field">
                <span className="ct-label">Phone (Optional)</span>
                <div style={{position:'relative'}} ref={dropRef}>
                  <div className="ct-phone-wrap">
                    <div
                      className={`ct-dial${dropOpen ? ' open' : ''}`}
                      onClick={() => setDropOpen(o => !o)}
                    >
                      <span style={{fontSize:13}}>{sel.flag}</span>
                      <span style={{fontSize:10,color:'#c9a84c',letterSpacing:1}}>{dialCode}</span>
                      <span style={{marginLeft:'auto',fontSize:9,color:'rgba(201,168,76,0.45)'}}>▾</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="3001234567"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/[^\d\s\-()+]/g,''))}
                      onBlur={() => blur('phone')}
                      className={`ct-phone-num${errs.phone ? ' err' : phone && !validate.phone(phone,dialCode) ? ' ok' : ''}`}
                    />
                  </div>
                  {dropOpen && (
                    <div className="ct-drop">
                      <input
                        className="ct-drop-search"
                        placeholder="Search country or code..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        autoFocus
                      />
                      {filtered.map(c => (
                        <div
                          key={c.name + c.code}
                          className={`ct-drop-item${dialCode === c.code ? ' sel' : ''}`}
                          onClick={() => { setDialCode(c.code); setDropOpen(false); setSearch('') }}
                        >
                          <span style={{fontSize:13}}>{c.flag}</span>
                          <span style={{color:'#c9a84c',fontSize:10,width:38,flexShrink:0}}>{c.code}</span>
                          <span style={{fontSize:10,color:'rgba(244,244,246,.5)'}}>{c.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ct-err">{errs.phone}</div>
              </div>
            </div>

            {/* MESSAGE */}
            <div className="ct-row">
              <div className="ct-conn"/>
              <div className="ct-field">
                <span className="ct-label">Message</span>
                <textarea
                  rows={3}
                  placeholder="YOUR MESSAGE..."
                  value={message}
                  onChange={e => setMessage(e.target.value.slice(0,500))}
                  onBlur={() => blur('message')}
                  className={`ct-textarea${errs.message ? ' err' : message && !validate.message(message) ? ' ok' : ''}`}
                />
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div className="ct-err">{errs.message}</div>
                  <div className="ct-cnt">{message.length}/500</div>
                </div>
              </div>
            </div>

            {/* CHECKBOX */}
            <div>
              <div
                className="ct-cb-row"
                onClick={() => { setAgreed(a => !a); blur('agreed') }}
              >
                <div className={`ct-cb${agreed ? ' on' : ''}${errs.agreed ? ' err' : ''}`}/>
                <span className="ct-cb-lbl">Agree to transmission terms</span>
              </div>
              {errs.agreed && (
                <div style={{fontSize:8,color:'#ff5555',letterSpacing:1.2,paddingLeft:24,marginTop:2}}>
                  {errs.agreed}
                </div>
              )}
            </div>

            {/* SUBMIT */}
            <button className="ct-submit" onClick={handleSubmit}>
              <div className="ct-submit-inner">
                <span className="ct-submit-txt">
                  {submitted ? 'Transmitted ✓' : 'Send Signal'}
                </span>
                <span className="ct-submit-arr">{submitted ? '✓' : '→'}</span>
              </div>
            </button>

          </div>

          {/* PROGRESS BAR */}
          <div className="ct-prog">
            <div className="ct-prog-fill" style={{width:`${progress}%`}}/>
          </div>

          {/* STATUS */}
          <div className={`ct-status${submitted ? ' on' : ''}`}>
            ◆ SIGNAL RECEIVED — STANDING BY ◆
          </div>

        </div>
      </section>
    </>
  )
}