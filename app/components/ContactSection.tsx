'use client'
import { useState, useEffect, useRef } from 'react'

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
  { code: '+420', flag: '🇨🇿', name: 'Czech Republic' },
  { code: '+45',  flag: '🇩🇰', name: 'Denmark' },
  { code: '+20',  flag: '🇪🇬', name: 'Egypt' },
  { code: '+33',  flag: '🇫🇷', name: 'France' },
  { code: '+49',  flag: '🇩🇪', name: 'Germany' },
  { code: '+30',  flag: '🇬🇷', name: 'Greece' },
  { code: '+91',  flag: '🇮🇳', name: 'India' },
  { code: '+62',  flag: '🇮🇩', name: 'Indonesia' },
  { code: '+98',  flag: '🇮🇷', name: 'Iran' },
  { code: '+964', flag: '🇮🇶', name: 'Iraq' },
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
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+47',  flag: '🇳🇴', name: 'Norway' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+92',  flag: '🇵🇰', name: 'Pakistan' },
  { code: '+63',  flag: '🇵🇭', name: 'Philippines' },
  { code: '+48',  flag: '🇵🇱', name: 'Poland' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+7',   flag: '🇷🇺', name: 'Russia' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+65',  flag: '🇸🇬', name: 'Singapore' },
  { code: '+27',  flag: '🇿🇦', name: 'South Africa' },
  { code: '+82',  flag: '🇰🇷', name: 'South Korea' },
  { code: '+34',  flag: '🇪🇸', name: 'Spain' },
  { code: '+46',  flag: '🇸🇪', name: 'Sweden' },
  { code: '+41',  flag: '🇨🇭', name: 'Switzerland' },
  { code: '+886', flag: '🇹🇼', name: 'Taiwan' },
  { code: '+90',  flag: '🇹🇷', name: 'Turkey' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+44',  flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+1',   flag: '🇺🇸', name: 'United States' },
  { code: '+84',  flag: '🇻🇳', name: 'Vietnam' },
  { code: '+967', flag: '🇾🇪', name: 'Yemen' },
  { code: '+263', flag: '🇿🇼', name: 'Zimbabwe' },
]

const validate = {
  name:    (v: string) => v.trim().length < 2 ? 'Name must be at least 2 characters' : '',
  email:   (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address',
  phone:   (v: string) => {
    if (v === '') return ''
    const digits = v.replace(/[\s\-()+]/g, '')
    if (!/^\d+$/.test(digits)) return 'Digits only — no letters or symbols'
    if (digits.length < 6)  return 'Too short — minimum 6 digits'
    if (digits.length > 15) return 'Too long — maximum 15 digits'
    return ''
  },
  message: (v: string) => v.trim().length < 10 ? 'Message must be at least 10 characters' : '',
}

const GA = { cx:860, cy:90,  r:72, teeth:24, dir: 1  }
const GB = { cx:760, cy:132, r:44, teeth:14, dir:-1  }
const GC = { cx:874, cy:208, r:32, teeth:10, dir:-1  }
const GD = { cx:820, cy:240, r:20, teeth: 6, dir: 1  }
const GE = { cx:856, cy:268, r:13, teeth: 4, dir:-1  }
const GL = { cx:72,  cy:88,  r:52, teeth:16, dir: 1  }
const GM = { cx:150, cy:110, r:32, teeth:10, dir:-1  }
const GN = { cx:72,  cy:186, r:30, teeth: 9, dir:-1  }
const GO = { cx:76,  cy:510, r:36, teeth:12, dir: 1  }
const GP = { cx:142, cy:536, r:22, teeth: 7, dir:-1  }
const GQ = { cx:908, cy:430, r:28, teeth: 9, dir: 1  }

function gearPath(cx:number,cy:number,r:number,teeth:number){
  const ir=r*0.62,th=r*0.2;let d=''
  for(let i=0;i<teeth;i++){
    const a=(j:number)=>((i+j)/teeth)*Math.PI*2
    const p=(ang:number,rr:number):[number,number]=>[cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr]
    const[x1,y1]=p(a(0),r),[x2,y2]=p(a(0.22),r+th),[x3,y3]=p(a(0.78),r+th),[x4,y4]=p(a(1),r)
    d+=`${i===0?'M':'L'}${x1.toFixed(2)},${y1.toFixed(2)}L${x2.toFixed(2)},${y2.toFixed(2)}L${x3.toFixed(2)},${y3.toFixed(2)}L${x4.toFixed(2)},${y4.toFixed(2)}`
  }
  return d+'Z'
}

function Gear({g,rot,color,op=0.9,hollow=false}:{g:{cx:number;cy:number;r:number;teeth:number;dir:number};rot:number;color:string;op?:number;hollow?:boolean}){
  const{cx,cy,r,teeth}=g;const ir=r*0.62
  return(
    <g transform={`rotate(${rot},${cx},${cy})`} opacity={op}>
      <path d={gearPath(cx,cy,r,teeth)} fill={color}/>
      <circle cx={cx} cy={cy} r={ir} fill="#06060a" stroke={color} strokeWidth="1.2"/>
      {hollow&&<circle cx={cx} cy={cy} r={r*0.18} fill={color}/>}
      {[0,45,90,135,180,225,270,315].map(ang=>{const rd=ang*Math.PI/180;return<line key={ang} x1={cx+Math.cos(rd)*ir*0.25} y1={cy+Math.sin(rd)*ir*0.25} x2={cx+Math.cos(rd)*ir*0.78} y2={cy+Math.sin(rd)*ir*0.78} stroke={color} strokeWidth="1" opacity="0.4"/>})}
      <circle cx={cx} cy={cy} r={r*0.11} fill={color} opacity="0.75"/>
      <circle cx={cx} cy={cy} r={ir*1.06} fill="none" stroke={color} strokeWidth="0.5" opacity="0.25" strokeDasharray="3 5"/>
    </g>
  )
}
function Bolt({cx,cy,color}:{cx:number;cy:number;color:string}){return(<><circle cx={cx} cy={cy} r={5} fill="#06060a" stroke={color} strokeWidth="1.2" opacity="0.8"/><circle cx={cx} cy={cy} r={2} fill={color} opacity="0.9"/></>)}
function Shaft({ax,ay,bx,by,color}:{ax:number;ay:number;bx:number;by:number;color:string}){return<line x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth="0.7" opacity="0.18" strokeDasharray="4 4"/>}
function Rim({x,y,r,rot,color,spokes=10}:{x:number;y:number;r:number;rot:number;color:string;spokes?:number}){
  return(<g transform={`rotate(${rot},${x},${y})`}><circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth="2.2" opacity="0.5"/><circle cx={x} cy={y} r={r*0.68} fill="none" stroke={color} strokeWidth="0.8" opacity="0.2"/>{Array.from({length:spokes}).map((_,i)=>{const a=(i/spokes)*Math.PI*2;return<line key={i} x1={x+Math.cos(a)*r*0.1} y1={y+Math.sin(a)*r*0.1} x2={x+Math.cos(a)*r} y2={y+Math.sin(a)*r} stroke={color} strokeWidth="1.4" opacity="0.38"/>})}{Array.from({length:14}).map((_,i)=>{const a=(i/14)*Math.PI*2;return<circle key={i} cx={x+Math.cos(a)*r} cy={y+Math.sin(a)*r} r="2.2" fill={color} opacity="0.55"/>})}<circle cx={x} cy={y} r={r*0.09} fill={color} opacity="0.8"/></g>)
}
function Pendulum({angle,cx,cy,len,color}:{angle:number;cx:number;cy:number;len:number;color:string}){
  const rad=angle*Math.PI/180,ex=cx+Math.sin(rad)*len,ey=cy+Math.cos(rad)*len
  return(<g><circle cx={cx} cy={cy} r={5} fill={color} opacity="0.7"/><line x1={cx} y1={cy} x2={ex} y2={ey} stroke={color} strokeWidth="2" opacity="0.6"/><circle cx={ex} cy={ey} r={16} fill="none" stroke={color} strokeWidth="2" opacity="0.7"/><circle cx={ex} cy={ey} r={9} fill="none" stroke={color} strokeWidth="0.8" opacity="0.3"/><circle cx={ex} cy={ey} r={4} fill={color} opacity="0.9"/><line x1={ex-7} y1={ey} x2={ex+7} y2={ey} stroke={color} strokeWidth="0.9" opacity="0.4"/><line x1={ex} y1={ey-7} x2={ex} y2={ey+7} stroke={color} strokeWidth="0.9" opacity="0.4"/></g>)
}
function Piston({x,y,off,color}:{x:number;y:number;off:number;color:string}){
  return(<g opacity="0.65"><rect x={x-13} y={y} width={26} height={52} rx="2" fill="none" stroke={color} strokeWidth="1"/><rect x={x-10} y={y+off} width={20} height={14} rx="1.5" fill="none" stroke={color} strokeWidth="1.4"/><rect x={x-6} y={y+off+3} width={12} height={4} fill={color} opacity="0.22"/><line x1={x} y1={y} x2={x} y2={y+off} stroke={color} strokeWidth="2"/><rect x={x-16} y={y+46} width={32} height={7} rx="1" fill="none" stroke={color} strokeWidth="1"/><line x1={x-10} y1={y+10} x2={x+10} y2={y+10} stroke={color} strokeWidth="0.6" opacity="0.3"/><line x1={x-10} y1={y+20} x2={x+10} y2={y+20} stroke={color} strokeWidth="0.6" opacity="0.3"/></g>)
}
function Chain({x1,y1,x2,y2,t,color}:{x1:number;y1:number;x2:number;y2:number;t:number;color:string}){
  const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy),links=Math.floor(len/13),ang=Math.atan2(dy,dx)*180/Math.PI
  return(<g opacity="0.28">{Array.from({length:links}).map((_,i)=>{const p=((i+(t*0.022)%1))/links,bx=x1+dx*p,by=y1+dy*p;return(<g key={i} transform={`rotate(${ang},${bx},${by})`}><rect x={bx-4} y={by-2.5} width={8} height={5} rx="1.2" fill="none" stroke={color} strokeWidth="0.9"/></g>)})}</g>)
}
function Sparks({cx,cy,active,t}:{cx:number;cy:number;active:boolean;t:number}){
  if(!active)return null
  return(<g>{Array.from({length:10},(_,i)=>i*36).map(a=>{const rd=a*Math.PI/180,r=5+Math.sin(t*0.25+a*0.08)*6;return<line key={a} x1={cx} y1={cy} x2={cx+Math.cos(rd)*r} y2={cy+Math.sin(rd)*r} stroke="#f0cc6e" strokeWidth="1.3" opacity="0.8"/>})}<circle cx={cx} cy={cy} r={2.5} fill="#fff" opacity="0.9"/></g>)
}

/* ─── TERMS MODAL ─── */
function TermsModal({onClose}:{onClose:()=>void}){
  return(
    <div style={{position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.88)',backdropFilter:'blur(4px)'}} onClick={onClose}>
      <div style={{width:'min(680px,92vw)',maxHeight:'80vh',background:'#0a0a10',border:'1px solid rgba(201,168,76,0.25)',display:'flex',flexDirection:'column',position:'relative'}} onClick={e=>e.stopPropagation()}>
        {/* header */}
        <div style={{padding:'20px 26px 16px',borderBottom:'1px solid rgba(201,168,76,0.12)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:5,color:'rgba(232,25,44,0.6)',textTransform:'uppercase',marginBottom:4}}>// legal document</p>
            <h3 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:16,color:'#f0cc6e',fontWeight:700,letterSpacing:2}}>Transmission Terms</h3>
          </div>
          <button onClick={onClose} style={{background:'none',border:'1px solid rgba(201,168,76,0.2)',color:'rgba(244,244,246,0.5)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,padding:'6px 12px',cursor:'pointer',letterSpacing:2,transition:'all .2s'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(232,25,44,0.5)';(e.currentTarget as HTMLButtonElement).style.color='#e8192c'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(201,168,76,0.2)';(e.currentTarget as HTMLButtonElement).style.color='rgba(244,244,246,0.5)'}}>
            ✕ CLOSE
          </button>
        </div>
        {/* body */}
        <div style={{overflowY:'auto',padding:'24px 26px 28px',scrollbarWidth:'thin',scrollbarColor:'rgba(201,168,76,0.25) transparent'}}>
          {[
            {
              n:'01', title:'Collection of Information',
              body:`When you submit this contact form, we collect only what you provide — your name, email address, phone number (if given), and your message. This information is used solely to respond to your inquiry. We do not collect IP addresses, browser fingerprints, or any data beyond what you voluntarily enter. Your details are never sold, rented, or traded to any third party under any circumstance.`
            },
            {
              n:'02', title:'How We Use Your Data',
              body:`Your submission is used exclusively to contact you in response to your inquiry. We may store your message in a secure internal system for reference during our conversation with you. We do not use your data for marketing, advertising, analytics profiling, or automated decision-making. Every response to your inquiry is handled personally by our team.`
            },
            {
              n:'03', title:'Data Retention',
              body:`We retain contact form submissions for a maximum of 12 months from the date of your last communication with us. After this period, your data is securely deleted from all our systems. You may request earlier deletion at any time by emailing us directly — we will process your request within 5 business days and confirm once complete.`
            },
            {
              n:'04', title:'Third-Party Services',
              body:`We do not share your personal information with third-party advertisers or data brokers. If we use any tool to manage incoming messages (such as an email delivery service), that service is bound by a strict data processing agreement and is prohibited from using your data for their own purposes. We take full responsibility for any subprocessor we engage.`
            },
            {
              n:'05', title:'Your Rights',
              body:`You have the right to access, correct, or delete any personal data you have submitted to us. You may also request a copy of your data in a portable format. These rights are not conditional — you do not need to justify your request. Simply reach out through any of our contact channels and we will respond within 48 hours.`
            },
            {
              n:'06', title:'Security',
              body:`All data transmitted through this form is encrypted in transit using TLS 1.2 or higher. We do not store payment information through this form. Our internal systems follow industry-standard security practices including access controls, audit logging, and regular security reviews. While no digital system is completely immune, we are committed to protecting your information with the highest reasonable care.`
            },
            {
              n:'07', title:'No Spam Policy',
              body:`By submitting your contact details, you are not subscribing to any mailing list. You will only receive messages directly related to the inquiry you submitted. We will never add you to newsletters, promotional campaigns, or automated sequences without your explicit and separate consent. If you ever receive unsolicited communication from us, please report it immediately.`
            },
            {
              n:'08', title:'Contact & Disputes',
              body:`If you have any questions about these terms, believe your data has been mishandled, or wish to withdraw consent, contact us directly at your earliest convenience. Disputes relating to data handling will first be addressed through direct communication. These terms are governed by the applicable laws of the jurisdiction in which we operate and are reviewed periodically to remain current.`
            },
          ].map(s=>(
            <div key={s.n} style={{marginBottom:24,paddingBottom:24,borderBottom:'1px solid rgba(201,168,76,0.07)'}}>
              <div style={{display:'flex',alignItems:'baseline',gap:12,marginBottom:8}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'rgba(232,25,44,0.55)',letterSpacing:2,flexShrink:0}}>{s.n}</span>
                <h4 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:11,color:'#c9a84c',letterSpacing:2,fontWeight:700}}>{s.title}</h4>
              </div>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,lineHeight:1.85,color:'rgba(244,244,246,0.5)',letterSpacing:0.3}}>{s.body}</p>
            </div>
          ))}
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'rgba(201,168,76,0.3)',letterSpacing:2,textAlign:'center',marginTop:4}}>
            ◆ LAST UPDATED — {new Date().getFullYear()} ◆
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ContactSection(){
  const[name,setName]=useState('')
  const[email,setEmail]=useState('')
  const[dialCode,setDialCode]=useState('+92')
  const[phone,setPhone]=useState('')
  const[message,setMessage]=useState('')
  const[agreed,setAgreed]=useState(false)
  const[touched,setTouched]=useState({name:false,email:false,phone:false,message:false,agreed:false})
  const[submitted,setSubmitted]=useState(false)
  const[dropOpen,setDropOpen]=useState(false)
  const[search,setSearch]=useState('')
  const[termsOpen,setTermsOpen]=useState(false)

  const tickRef=useRef(0)
  const[tick,setTick]=useState(0)
  const rafRef=useRef<number>(0)
  const[cursor,setCursor]=useState({x:0.5,y:0.5})
  const[hovered,setHovered]=useState(false)
  const dropRef=useRef<HTMLDivElement>(null)

  useEffect(()=>{
    const loop=()=>{tickRef.current++;setTick(tickRef.current);rafRef.current=requestAnimationFrame(loop)}
    rafRef.current=requestAnimationFrame(loop)
    return()=>cancelAnimationFrame(rafRef.current)
  },[])

  useEffect(()=>{
    const h=(e:MouseEvent)=>{if(dropRef.current&&!dropRef.current.contains(e.target as Node))setDropOpen(false)}
    document.addEventListener('mousedown',h)
    return()=>document.removeEventListener('mousedown',h)
  },[])

  const handleMouseMove=(e:React.MouseEvent<HTMLDivElement>)=>{
    const rect=e.currentTarget.getBoundingClientRect()
    setCursor({x:(e.clientX-rect.left)/rect.width,y:(e.clientY-rect.top)/rect.height})
  }

  const errs={
    name:    touched.name    ?validate.name(name):'',
    email:   touched.email   ?validate.email(email):'',
    phone:   touched.phone   ?validate.phone(phone):'',
    message: touched.message ?validate.message(message):'',
    agreed:  touched.agreed&&!agreed?'You must agree to proceed':'',
  }
  const fieldsDone=[!!(name&&!validate.name(name)),!!(email&&!validate.email(email)),!!(message&&!validate.message(message)),agreed].filter(Boolean).length
  const progress=(fieldsDone/4)*100
  const canSubmit=!validate.name(name)&&!validate.email(email)&&!validate.phone(phone)&&!validate.message(message)&&agreed&&name&&email&&message
  const blur=(f:keyof typeof touched)=>setTouched(p=>({...p,[f]:true}))
  const handleSubmit=()=>{
    setTouched({name:true,email:true,phone:true,message:true,agreed:true})
    if(!canSubmit)return
    setSubmitted(true)
    setTimeout(()=>setSubmitted(false),3500)
  }
  const filtered=COUNTRY_CODES.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.code.includes(search))
  const sel=COUNTRY_CODES.find(c=>c.code===dialCode)||COUNTRY_CODES[0]

  const BASE_SPD=0.9,spd=BASE_SPD*(1+(progress/100)*2.5),t=tick,masterRot=t*spd
  const rotA=masterRot,rotB=-masterRot*(GA.teeth/GB.teeth),rotC=-masterRot*(GA.teeth/GC.teeth)
  const rotD=masterRot*(GC.teeth/GD.teeth),rotE=-masterRot*(GC.teeth/GD.teeth)*(GD.teeth/GE.teeth)
  const rotL=-masterRot*0.65,rotM=-rotL*(GL.teeth/GM.teeth),rotN=-rotL*(GL.teeth/GN.teeth)
  const rotO=masterRot*0.42,rotP=-rotO*(GO.teeth/GP.teeth),rotQ=-masterRot*0.55
  const pendAngle=Math.sin(t*0.045)*28,pistonOff=16+Math.sin(t*spd*0.055)*22

  /* heading hover effect */
  const skewX=hovered?(cursor.x-0.5)*14:0
  const skewY=hovered?(cursor.y-0.5)*7:0
  const glowX=hovered?(cursor.x-0.5)*28:0
  const glowY=hovered?(cursor.y-0.5)*14:0

  const PR=26,PCX=490,PCY=30,circ=2*Math.PI*PR,dash=(progress/100)*circ

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;600&display=swap');
        @keyframes ct-scanline{from{top:-2px}to{top:642px}}
        @keyframes ct-blink{0%,100%{opacity:.15}50%{opacity:.6}}
        @keyframes ct-fadein{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        @keyframes ct-underline{from{width:0}to{width:55%}}
        @keyframes ct-eyeblink{0%,100%{opacity:.3}50%{opacity:.9}}
        @keyframes ct-letterwave{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}

        #ct-sec{
          background:#06060a;position:relative;overflow:hidden;
          padding:clamp(3.5rem,8vh,6rem) clamp(1.5rem,5vw,5rem);
          font-family:'JetBrains Mono',monospace;
          background-image:
            radial-gradient(ellipse 65% 55% at 50% 0%,rgba(232,25,44,0.05) 0%,transparent 70%),
            radial-gradient(ellipse 40% 35% at 8% 85%,rgba(201,168,76,0.04) 0%,transparent 65%),
            radial-gradient(ellipse 38% 32% at 92% 88%,rgba(139,0,0,0.04) 0%,transparent 60%);
        }
        #ct-sec::before{
          content:'';position:absolute;inset:0;pointer-events:none;z-index:0;
          background-image:radial-gradient(circle,rgba(255,255,255,0.042) 1px,transparent 1px);
          background-size:28px 28px;
          mask-image:radial-gradient(ellipse 88% 88% at 50% 50%,black 20%,transparent 100%);
          -webkit-mask-image:radial-gradient(ellipse 88% 88% at 50% 50%,black 20%,transparent 100%);
        }

        /* HEADING */
        #ct-head{
          position:relative;z-index:10;text-align:center;
          margin-bottom:clamp(1.8rem,4vh,3rem);
          animation:ct-fadein .6s cubic-bezier(.16,1,.3,1) both;
          cursor:default;user-select:none;
        }
        .ct-eyebrow{
          font-size:clamp(.4rem,.72vw,.55rem);letter-spacing:.52em;text-transform:uppercase;
          color:rgba(232,25,44,.5);margin-bottom:.8rem;
          display:flex;align-items:center;justify-content:center;gap:12px;
          animation:ct-eyeblink 3s ease-in-out infinite;
        }
        .ct-ey-line{width:26px;height:1px;background:rgba(232,25,44,.4);flex-shrink:0;}

        .ct-h1{
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(2rem,5.5vw,5rem);font-weight:900;line-height:.96;
          letter-spacing:-.01em;display:inline-block;
          background:linear-gradient(160deg,#fff 0%,#f0cb6a 48%,#c9a84c 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          transition:transform .15s ease,filter .15s ease;
          will-change:transform;
        }
        .ct-h1:hover{
          filter:brightness(1.15);
        }
        .ct-h1 .red{
          background:linear-gradient(160deg,#ff6070 0%,#e8192c 55%,#8b000a 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }

        /* individual letter animation on heading hover */
        .ct-letter{
          display:inline-block;
          transition:transform .18s ease, filter .18s ease;
        }
        #ct-head:hover .ct-letter{
          animation:ct-letterwave .55s ease-in-out both;
        }
        ${Array.from({length:16},(_,i)=>`#ct-head:hover .ct-letter:nth-child(${i+1}){animation-delay:${i*0.04}s}`).join('')}

        .ct-h1-line{
          display:block;height:2px;margin:.6rem auto 0;
          background:linear-gradient(to right,transparent,#e8192c 40%,#c9a84c 60%,transparent);
          animation:ct-underline .8s .3s cubic-bezier(.16,1,.3,1) both;
        }
        .ct-sub{
          font-family:'Outfit',sans-serif;
          font-size:clamp(.68rem,1.1vw,.86rem);color:rgba(244,244,246,.28);
          margin-top:.8rem;font-weight:300;
        }

        /* MACHINE */
        #ct-machine{
          position:relative;width:100%;max-width:980px;margin:0 auto;
          height:clamp(520px,62vh,640px);background:transparent;overflow:hidden;z-index:5;
        }
        .ct-scan{
          position:absolute;left:0;right:0;height:1px;pointer-events:none;z-index:30;
          background:linear-gradient(to right,transparent,rgba(232,25,44,.06),transparent);
          animation:ct-scanline 12s linear infinite;
        }

        /* FORM */
        #ct-form{
          position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          width:clamp(300px,36vw,355px);z-index:20;
          display:flex;flex-direction:column;gap:10px;
        }
        .ct-row{display:flex;align-items:flex-start;gap:8px;}
        .ct-conn{width:16px;height:2px;background:rgba(201,168,76,0.35);flex-shrink:0;margin-top:19px;}
        .ct-field{flex:1;position:relative;}
        .ct-label{
          position:absolute;top:-8px;left:8px;z-index:1;
          font-size:8px;letter-spacing:3px;text-transform:uppercase;
          color:#c9a84c;background:#06060a;padding:0 4px;
        }
        .ct-input,.ct-textarea{
          width:100%;background:rgba(6,6,10,0.96);
          border:1px solid rgba(201,168,76,0.28);color:rgba(244,244,246,.9);
          font-family:'JetBrains Mono',monospace;font-size:11px;
          padding:9px 11px;outline:none;resize:none;
          transition:border-color .25s,box-shadow .25s;
        }
        .ct-input::placeholder,.ct-textarea::placeholder{color:rgba(201,168,76,0.2);font-size:10px;letter-spacing:1px;}
        .ct-input:focus,.ct-textarea:focus{border-color:#c9a84c;box-shadow:0 0 0 1px rgba(201,168,76,0.18),0 0 14px rgba(201,168,76,0.12);}
        .ct-input.ok,.ct-textarea.ok{border-color:#e8192c;box-shadow:0 0 0 1px rgba(232,25,44,0.2),0 0 10px rgba(232,25,44,0.1);}
        .ct-input.err,.ct-textarea.err{border-color:#ff4444;}
        .ct-err{font-size:8px;letter-spacing:1px;color:#ff5555;margin-top:2px;min-height:11px;padding-left:2px;}

        /* phone */
        .ct-phone-wrap{display:flex;}
        .ct-dial{
          width:102px;flex-shrink:0;background:rgba(6,6,10,0.96);
          border:1px solid rgba(201,168,76,0.28);border-right:none;
          color:rgba(244,244,246,.85);font-family:'JetBrains Mono',monospace;
          font-size:10px;padding:9px 7px;cursor:pointer;
          display:flex;align-items:center;gap:5px;user-select:none;
          transition:border-color .25s;
        }
        .ct-dial:hover,.ct-dial.open{border-color:#c9a84c;}
        .ct-phone-num{
          flex:1;background:rgba(6,6,10,0.96);
          border:1px solid rgba(201,168,76,0.28);border-left:none;
          color:rgba(244,244,246,.9);font-family:'JetBrains Mono',monospace;
          font-size:11px;padding:9px 10px;outline:none;
          transition:border-color .25s,box-shadow .25s;
        }
        .ct-phone-num:focus{border-color:#c9a84c;box-shadow:0 0 0 1px rgba(201,168,76,0.15),0 0 12px rgba(201,168,76,0.1);}
        .ct-phone-num.ok{border-color:#e8192c;}
        .ct-phone-num.err{border-color:#ff4444;}
        .ct-phone-num::placeholder{color:rgba(201,168,76,0.2);font-size:10px;}
        .ct-drop{
          position:absolute;top:100%;left:0;width:268px;
          background:#0a0a0f;border:1px solid rgba(201,168,76,0.22);
          z-index:200;max-height:185px;overflow-y:auto;
          box-shadow:0 14px 44px rgba(0,0,0,0.92);
        }
        .ct-drop::-webkit-scrollbar{width:3px;}
        .ct-drop::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.28);border-radius:2px;}
        .ct-drop-search{
          width:100%;background:#080810;border:none;border-bottom:1px solid rgba(201,168,76,0.18);
          color:rgba(244,244,246,.8);font-family:'JetBrains Mono',monospace;
          font-size:10px;padding:7px 10px;outline:none;letter-spacing:1px;
        }
        .ct-drop-search::placeholder{color:rgba(201,168,76,0.2);}
        .ct-drop-item{padding:6px 10px;cursor:pointer;font-size:10px;color:rgba(244,244,246,.75);display:flex;gap:8px;align-items:center;transition:background .1s;}
        .ct-drop-item:hover{background:rgba(201,168,76,0.07);}
        .ct-drop-item.sel{background:rgba(232,25,44,0.1);}

        /* checkbox row — terms inline */
        .ct-cb-row{display:flex;align-items:center;gap:10px;cursor:pointer;flex-wrap:wrap;}
        .ct-cb{
          width:14px;height:14px;flex-shrink:0;
          border:1px solid rgba(201,168,76,0.32);background:transparent;
          display:flex;align-items:center;justify-content:center;
          transition:border-color .2s,background .2s;
        }
        .ct-cb.on{border-color:#e8192c;background:rgba(232,25,44,0.14);}
        .ct-cb.on::after{content:'';width:6px;height:6px;background:#e8192c;}
        .ct-cb.err{border-color:#ff4444;}
        .ct-cb-lbl{font-size:9px;letter-spacing:1.5px;color:rgba(244,244,246,.32);text-transform:uppercase;}
        .ct-terms-btn{
          background:none;border:none;padding:0;cursor:pointer;
          font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1.5px;
          color:#c9a84c;text-transform:uppercase;text-decoration:underline;
          text-underline-offset:3px;text-decoration-color:rgba(201,168,76,0.35);
          transition:color .2s,text-decoration-color .2s;
        }
        .ct-terms-btn:hover{color:#f0cc6e;text-decoration-color:rgba(240,204,110,0.6);}

        /* submit */
        .ct-submit{background:none;border:none;cursor:pointer;padding:0;width:100%;margin-top:2px;}
        .ct-submit-inner{
          display:flex;align-items:center;justify-content:space-between;
          border:1px solid rgba(232,25,44,0.38);padding:11px 18px;
          background:rgba(232,25,44,0.06);position:relative;overflow:hidden;
          transition:background .3s,border-color .3s;
        }
        .ct-submit-inner::before{
          content:'';position:absolute;left:-100%;top:0;width:100%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(201,168,76,0.08),transparent);
          transition:left .5s;
        }
        .ct-submit:hover .ct-submit-inner::before{left:100%;}
        .ct-submit:hover .ct-submit-inner{background:rgba(232,25,44,0.18);border-color:rgba(232,25,44,0.8);}
        .ct-submit-txt{font-family:'Cinzel Decorative',serif;font-size:11px;letter-spacing:3px;color:#fff;text-transform:uppercase;}
        .ct-submit-arr{color:#c9a84c;font-size:15px;transition:transform .3s;}
        .ct-submit:hover .ct-submit-arr{transform:translateX(4px);}

        .ct-prog{position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(201,168,76,0.06);z-index:15;}
        .ct-prog-fill{height:100%;background:linear-gradient(90deg,#8b0000,#e8192c 50%,#c9a84c);transition:width .7s cubic-bezier(.4,0,.2,1);box-shadow:0 0 8px rgba(232,25,44,0.5);}
        .ct-status{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);font-size:9px;letter-spacing:4px;color:#c9a84c;white-space:nowrap;opacity:0;transition:opacity .4s;pointer-events:none;z-index:20;}
        .ct-status.on{opacity:1;}
        .ct-cnt{font-size:8px;letter-spacing:1px;color:rgba(201,168,76,0.28);text-align:right;margin-top:2px;}
      `}</style>

      {termsOpen&&<TermsModal onClose={()=>setTermsOpen(false)}/>}

      <section id="ct-sec">

        {/* HEADING */}
        <div
          id="ct-head"
          onMouseMove={handleMouseMove}
          onMouseEnter={()=>setHovered(true)}
          onMouseLeave={()=>{setHovered(false);setCursor({x:0.5,y:0.5})}}
        >
          <div className="ct-eyebrow">
            <span className="ct-ey-line"/>
            TRANSMISSION OPEN
            <span className="ct-ey-line"/>
          </div>

          <h2
            className="ct-h1"
            style={{
              transform:`perspective(600px) rotateX(${-skewY}deg) rotateY(${skewX}deg) scale(${hovered?1.03:1})`,
              filter:`drop-shadow(${glowX*0.4}px ${glowY*0.4}px 22px rgba(232,25,44,${hovered?0.4:0.1})) drop-shadow(${-glowX*0.15}px ${-glowY*0.15}px 14px rgba(201,168,76,${hovered?0.25:0.05}))`,
            }}
          >
            {'CONTACT'.split('').map((ch,i)=>(
              <span key={i} className="ct-letter" style={{animationDelay:`${i*0.04}s`}}>{ch}</span>
            ))}
            <br/>
            <span className="red">
              {'MACHINE'.split('').map((ch,i)=>(
                <span key={i} className="ct-letter" style={{animationDelay:`${(i+7)*0.04}s`}}>{ch}</span>
              ))}
            </span>
            <span className="ct-h1-line"/>
          </h2>
          <p className="ct-sub">Let&apos;s build something real — send the signal</p>
        </div>

        {/* MACHINE */}
        <div id="ct-machine">
          <div className="ct-scan"/>

          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}} viewBox="0 0 980 640" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="ctgrid" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M36 0 L0 0 0 36" fill="none" stroke="rgba(201,168,76,0.02)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="980" height="640" fill="url(#ctgrid)"/>

            <Shaft ax={GA.cx} ay={GA.cy} bx={GB.cx} by={GB.cy} color="#c9a84c"/>
            <Shaft ax={GA.cx} ay={GA.cy} bx={GC.cx} by={GC.cy} color="#c9a84c"/>
            <Shaft ax={GC.cx} ay={GC.cy} bx={GD.cx} by={GD.cy} color="#c9a84c"/>
            <Shaft ax={GD.cx} ay={GD.cy} bx={GE.cx} by={GE.cy} color="#c9a84c"/>
            <Gear g={GA} rot={rotA} color="#c9a84c" op={0.92}/>
            <Gear g={GB} rot={rotB} color="#8b0000" op={0.85} hollow/>
            <Gear g={GC} rot={rotC} color="#e8192c" op={0.80}/>
            <Gear g={GD} rot={rotD} color="#c9a84c" op={0.72}/>
            <Gear g={GE} rot={rotE} color="#f0cc6e" op={0.62}/>
            <Sparks cx={(GA.cx+GB.cx)/2} cy={(GA.cy+GB.cy)/2} active={progress>50} t={t}/>
            <Sparks cx={(GA.cx+GC.cx)/2} cy={(GA.cy+GC.cy)/2} active={progress>75} t={t}/>
            <Bolt cx={GA.cx} cy={GA.cy} color="#c9a84c"/>
            <Bolt cx={GB.cx} cy={GB.cy} color="#8b0000"/>
            <Bolt cx={GC.cx} cy={GC.cy} color="#e8192c"/>
            <Bolt cx={GD.cx} cy={GD.cy} color="#c9a84c"/>
            <Bolt cx={GE.cx} cy={GE.cy} color="#f0cc6e"/>

            <Chain x1={72} y1={148} x2={72} y2={440} t={t} color="#c9a84c"/>
            <Shaft ax={GL.cx} ay={GL.cy} bx={GM.cx} by={GM.cy} color="#8b0000"/>
            <Shaft ax={GL.cx} ay={GL.cy} bx={GN.cx} by={GN.cy} color="#8b0000"/>
            <Rim x={GL.cx} y={GL.cy} r={GL.r*1.35} rot={rotL} color="#c9a84c" spokes={12}/>
            <Gear g={GL} rot={rotL} color="#c9a84c" op={0.88}/>
            <Gear g={GM} rot={rotM} color="#8b0000" op={0.78} hollow/>
            <Gear g={GN} rot={rotN} color="#e8192c" op={0.72}/>
            <Bolt cx={GL.cx} cy={GL.cy} color="#c9a84c"/>
            <Bolt cx={GM.cx} cy={GM.cy} color="#8b0000"/>
            <Bolt cx={GN.cx} cy={GN.cy} color="#e8192c"/>

            <Shaft ax={GO.cx} ay={GO.cy} bx={GP.cx} by={GP.cy} color="#c9a84c"/>
            <Gear g={GO} rot={rotO} color="#8b0000" op={0.68}/>
            <Gear g={GP} rot={rotP} color="#c9a84c" op={0.60}/>
            <Bolt cx={GO.cx} cy={GO.cy} color="#8b0000"/>
            <Bolt cx={GP.cx} cy={GP.cy} color="#c9a84c"/>

            <Chain x1={GQ.cx} y1={GQ.cy-GQ.r} x2={880} y2={200} t={t} color="#8b0000"/>
            <Gear g={GQ} rot={rotQ} color="#8b0000" op={0.72}/>
            <Bolt cx={GQ.cx} cy={GQ.cy} color="#8b0000"/>
            <Pendulum angle={pendAngle} cx={740} cy={390} len={115} color="#c9a84c"/>

            <line x1={GL.cx+GL.r*0.8} y1={GL.cy} x2={150} y2={175} stroke="#c9a84c" strokeWidth="1" opacity="0.25" strokeDasharray="3 4"/>
            <Piston x={150} y={168} off={pistonOff} color="#c9a84c"/>
            <circle cx={150} cy={166} r={18} fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.25"/>

            <circle cx={PCX} cy={PCY} r={PR} fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="2.5"/>
            <circle cx={PCX} cy={PCY} r={PR} fill="none" stroke="#c9a84c" strokeWidth="2.8"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
              transform={`rotate(-90,${PCX},${PCY})`} opacity="0.82"/>
            <text x={PCX} y={PCY+4} textAnchor="middle" fill="#c9a84c" fontSize="9" fontFamily="JetBrains Mono">{Math.round(progress)}%</text>

            {Array.from({length:21}).map((_,i)=>{
              const v=i*5,a=(v/100)*Math.PI*1.4-Math.PI*0.7,r1i=36,r2i=i%4===0?47:41
              return<line key={i} x1={922+Math.cos(a)*r1i} y1={510+Math.sin(a)*r1i} x2={922+Math.cos(a)*r2i} y2={510+Math.sin(a)*r2i} stroke={v<=progress?'#c9a84c':'rgba(201,168,76,0.14)'} strokeWidth={i%4===0?2:1}/>
            })}
            {(()=>{const na=(progress/100)*Math.PI*1.4-Math.PI*0.7;return<line x1={922} y1={510} x2={922+Math.cos(na)*40} y2={510+Math.sin(na)*40} stroke="#e8192c" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>})()}
            <circle cx={922} cy={510} r={4} fill="#e8192c" opacity="0.8"/>
            <text x={922} y={514} textAnchor="middle" fill="#c9a84c" fontSize="8" fontFamily="JetBrains Mono" opacity="0.45">LOAD</text>

            {Array.from({length:18}).map((_,i)=>(
              <line key={i} x1={0} y1={35+i*32} x2={i%5===0?14:8} y2={35+i*32} stroke="#c9a84c" strokeWidth="0.8" opacity={i%5===0?0.32:0.12}/>
            ))}
            {Array.from({length:18}).map((_,i)=>(
              <line key={i} x1={980} y1={35+i*32} x2={i%5===0?966:972} y2={35+i*32} stroke="#c9a84c" strokeWidth="0.8" opacity={i%5===0?0.32:0.12}/>
            ))}
            <line x1={0} y1={(t*spd*0.65)%640} x2={980} y2={(t*spd*0.65)%640} stroke="#c9a84c" strokeWidth="0.6" opacity="0.038"/>
          </svg>

          {/* FORM */}
          <div id="ct-form">

            <div className="ct-row">
              <div className="ct-conn"/>
              <div className="ct-field">
                <span className="ct-label">Name</span>
                <input type="text" placeholder="YOUR NAME" value={name}
                  onChange={e=>setName(e.target.value)} onBlur={()=>blur('name')}
                  className={`ct-input${errs.name?' err':name&&!validate.name(name)?' ok':''}`}/>
                <div className="ct-err">{errs.name}</div>
              </div>
            </div>

            <div className="ct-row">
              <div className="ct-conn"/>
              <div className="ct-field">
                <span className="ct-label">E-Mail</span>
                <input type="email" placeholder="YOUR@EMAIL.COM" value={email}
                  onChange={e=>setEmail(e.target.value)} onBlur={()=>blur('email')}
                  className={`ct-input${errs.email?' err':email&&!validate.email(email)?' ok':''}`}/>
                <div className="ct-err">{errs.email}</div>
              </div>
            </div>

            <div className="ct-row">
              <div className="ct-conn"/>
              <div className="ct-field">
                <span className="ct-label">Phone (Optional)</span>
                <div style={{position:'relative'}} ref={dropRef}>
                  <div className="ct-phone-wrap">
                    <div className={`ct-dial${dropOpen?' open':''}`} onClick={()=>setDropOpen(o=>!o)}>
                      <span style={{fontSize:13}}>{sel.flag}</span>
                      <span style={{fontSize:10,color:'#c9a84c',letterSpacing:1}}>{dialCode}</span>
                      <span style={{marginLeft:'auto',fontSize:9,color:'rgba(201,168,76,0.4)'}}>▾</span>
                    </div>
                    <input type="tel" placeholder="3001234567" value={phone}
                      onChange={e=>setPhone(e.target.value.replace(/[^\d\s\-()+]/g,''))}
                      onBlur={()=>blur('phone')}
                      className={`ct-phone-num${errs.phone?' err':phone&&!validate.phone(phone)?' ok':''}`}/>
                  </div>
                  {dropOpen&&(
                    <div className="ct-drop">
                      <input className="ct-drop-search" placeholder="Search country or code..."
                        value={search} onChange={e=>setSearch(e.target.value)} autoFocus/>
                      {filtered.map(c=>(
                        <div key={c.name+c.code} className={`ct-drop-item${dialCode===c.code?' sel':''}`}
                          onClick={()=>{setDialCode(c.code);setDropOpen(false);setSearch('')}}>
                          <span style={{fontSize:13}}>{c.flag}</span>
                          <span style={{color:'#c9a84c',fontSize:10,width:38,flexShrink:0}}>{c.code}</span>
                          <span style={{fontSize:10,color:'rgba(244,244,246,.48)'}}>{c.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ct-err">{errs.phone}</div>
              </div>
            </div>

            <div className="ct-row">
              <div className="ct-conn"/>
              <div className="ct-field">
                <span className="ct-label">Message</span>
                <textarea rows={3} placeholder="YOUR MESSAGE..." value={message}
                  onChange={e=>setMessage(e.target.value.slice(0,500))} onBlur={()=>blur('message')}
                  className={`ct-textarea${errs.message?' err':message&&!validate.message(message)?' ok':''}`}/>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div className="ct-err">{errs.message}</div>
                  <div className="ct-cnt">{message.length}/500</div>
                </div>
              </div>
            </div>

            {/* CHECKBOX + TERMS */}
            <div>
              <div className="ct-cb-row">
                <div className={`ct-cb${agreed?' on':''}${errs.agreed?' err':''}`}
                  onClick={()=>{setAgreed(a=>!a);blur('agreed')}}/>
                <span className="ct-cb-lbl" onClick={()=>{setAgreed(a=>!a);blur('agreed')}}>
                  I agree to the
                </span>
                <button className="ct-terms-btn" onClick={e=>{e.stopPropagation();setTermsOpen(true)}}>
                  Transmission Terms
                </button>
              </div>
              {errs.agreed&&<div style={{fontSize:8,color:'#ff5555',letterSpacing:1.2,paddingLeft:24,marginTop:2}}>{errs.agreed}</div>}
            </div>

            <button className="ct-submit" onClick={handleSubmit}>
              <div className="ct-submit-inner">
                <span className="ct-submit-txt">{submitted?'Transmitted ✓':'Send Signal'}</span>
                <span className="ct-submit-arr">{submitted?'✓':'→'}</span>
              </div>
            </button>
          </div>

          <div className="ct-prog">
            <div className="ct-prog-fill" style={{width:`${progress}%`}}/>
          </div>
          <div className={`ct-status${submitted?' on':''}`}>◆ SIGNAL RECEIVED — STANDING BY ◆</div>
        </div>
      </section>
    </>
  )
}