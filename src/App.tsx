declare global {
  interface Window {
    google: typeof google;
    initMap?: () => void;
  }
}// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { google: any; } }

import { useState, useEffect, useCallback, useRef } from "react";

// ─── ⚙️ CONFIG — Replace with your actual Google OAuth Client ID ──────────────
const GOOGLE_CLIENT_ID = "715546293706-prti9e4md5daeqkkr50vkb606f5m9j2u.apps.googleusercontent.com";

// ─── Game Data ────────────────────────────────────────────────────────────────
const GAME_DATA = {
  Blacksmithing: {
    icon: "⚒️",
    sections: [
      {
        name: "Armor Traits",
        items: ["Heavy Chest Cuirass","Heavy Sabatons","Heavy Gauntlets","Heavy Helm","Heavy Greaves","Heavy Pauldrons","Heavy Girdle"],
        traits: [
          {name:"Sturdy",desc:"Reduces the cost of Block by 4%.",researchable:true},
          {name:"Impenetrable",desc:"Increases Critical Resistance by 132 and this item takes 50% less durability damage.",researchable:true},
          {name:"Reinforced",desc:"Increases this item's Armor value by 16%.",researchable:true},
          {name:"Well-fitted",desc:"Reduces the cost of Roll Dodge and Sprint by 6%.",researchable:true},
          {name:"Training",desc:"Increase experience gained from kills by 11%.",researchable:true},
          {name:"Infused",desc:"Increase armor enchantment effect by 25%.",researchable:true},
          {name:"Invigorating",desc:"Increases Health, Magicka, and Stamina Recovery by 16.",researchable:true},
          {name:"Divines",desc:"Increases Mundus Stone effects by 9.1%.",researchable:true},
          {name:"Nirnhoned",desc:"Increases Physical and Spell Resistance by 253.",researchable:true},
          {name:"Intricate",desc:"Increases inspiration gained from deconstruction by 300%.",researchable:false},
          {name:"Ornate",desc:"Increases this item's sell price by 300%.",researchable:false},
        ]
      },
      {
        name: "Weapon Traits",
        items: ["1H Axe","1H Mace","1H Sword","2H Battle Axe","2H Maul","2H Greatsword","1H Dagger"],
        traits: [
          {name:"Powered",desc:"Increases healing done by 4.5%.",researchable:true},
          {name:"Charged",desc:"Increases chance to apply status effects by 117.5%.",researchable:true},
          {name:"Precise",desc:"Increases Weapon and Spell Critical by 3.6%.",researchable:true},
          {name:"Infused",desc:"Increases weapon enchantment effect by 30% and reduces enchantment cooldown by 50%.",researchable:true},
          {name:"Defending",desc:"Increases Physical and Spell Resistance by 1638.",researchable:true},
          {name:"Training",desc:"Increases experience gained from kills by 4.5%.",researchable:true},
          {name:"Sharpened",desc:"Increases Physical and Spell Penetration by 1638.",researchable:true},
          {name:"Decisive",desc:"When you gain Ultimate you have a 27.5% chance to gain 1 additional Ultimate.",researchable:true},
          {name:"Nirnhoned",desc:"Increases Damage of this weapon by 15%.",researchable:true},
          {name:"Intricate",desc:"Increases inspiration gained from deconstruction by 300%.",researchable:false},
          {name:"Ornate",desc:"Increases this item's sell price by 300%.",researchable:false},
        ]
      }
    ]
  },
  Woodworking: {
    icon: "🪵",
    sections: [
      {
        name: "Apparel Traits",
        items: ["Shield"],
        traits: [
          {name:"Sturdy",desc:"Reduces the cost of Block by 4%.",researchable:true},
          {name:"Impenetrable",desc:"Increases Critical Resistance by 132 and this item takes 50% less durability damage.",researchable:true},
          {name:"Reinforced",desc:"Increases this item's Armor value by 16%.",researchable:true},
          {name:"Well-fitted",desc:"Reduces the cost of Roll Dodge and Sprint by 6%.",researchable:true},
          {name:"Training",desc:"Increase experience gained from kills by 11%.",researchable:true},
          {name:"Infused",desc:"Increase armor enchantment effect by 25%.",researchable:true},
          {name:"Invigorating",desc:"Increases Health, Magicka, and Stamina Recovery by 16.",researchable:true},
          {name:"Divines",desc:"Increases Mundus Stone effects by 9.1%.",researchable:true},
          {name:"Nirnhoned",desc:"Increases Physical and Spell Resistance by 253.",researchable:true},
          {name:"Intricate",desc:"Increases inspiration gained from deconstruction by 300%.",researchable:false},
          {name:"Ornate",desc:"Increases this item's sell price by 300%.",researchable:false},
        ]
      },
      {
        name: "Weapon Traits",
        items: ["Bow","Inferno Staff","Ice Staff","Lightning Staff","Restoration Staff"],
        traits: [
          {name:"Powered",desc:"Increases healing done by 4.5%.",researchable:true},
          {name:"Charged",desc:"Increases chance to apply status effects by 117.5%.",researchable:true},
          {name:"Precise",desc:"Increases Weapon and Spell Critical by 3.6%.",researchable:true},
          {name:"Infused",desc:"Increases weapon enchantment effect by 30% and reduces enchantment cooldown by 50%.",researchable:true},
          {name:"Defending",desc:"Increases Physical and Spell Resistance by 1638.",researchable:true},
          {name:"Training",desc:"Increases experience gained from kills by 4.5%.",researchable:true},
          {name:"Sharpened",desc:"Increases Physical and Spell Penetration by 1638.",researchable:true},
          {name:"Decisive",desc:"When you gain Ultimate you have a 27.5% chance to gain 1 additional Ultimate.",researchable:true},
          {name:"Nirnhoned",desc:"Increases Damage of this weapon by 15%.",researchable:true},
          {name:"Intricate",desc:"Increases inspiration gained from deconstruction by 300%.",researchable:false},
          {name:"Ornate",desc:"Increases this item's sell price by 300%.",researchable:false},
        ]
      }
    ]
  },
  Clothier: {
    icon: "🧵",
    sections: [
      {
        name: "Apparel Traits",
        items: ["Robe & Jerkin","Shoes","Gloves","Hat","Breeches","Epaulets","Sash","Jack","Boots","Bracers","Helmet","Guards","Arm Cops","Belt"],
        traits: [
          {name:"Sturdy",desc:"Reduces the cost of Block by 4%.",researchable:true},
          {name:"Impenetrable",desc:"Increases Critical Resistance by 132 and this item takes 50% less durability damage.",researchable:true},
          {name:"Reinforced",desc:"Increases this item's Armor value by 16%.",researchable:true},
          {name:"Well-fitted",desc:"Reduces the cost of Roll Dodge and Sprint by 6%.",researchable:true},
          {name:"Training",desc:"Increase experience gained from kills by 11%.",researchable:true},
          {name:"Infused",desc:"Increase armor enchantment effect by 25%.",researchable:true},
          {name:"Invigorating",desc:"Increases Health, Magicka, and Stamina Recovery by 16.",researchable:true},
          {name:"Divines",desc:"Increases Mundus Stone effects by 9.1%.",researchable:true},
          {name:"Nirnhoned",desc:"Increases Physical and Spell Resistance by 253.",researchable:true},
          {name:"Intricate",desc:"Increases inspiration gained from deconstruction by 300%.",researchable:false},
          {name:"Ornate",desc:"Increases this item's sell price by 300%.",researchable:false},
        ]
      }
    ]
  },
  Jewelry: {
    icon: "💍",
    sections: [
      {
        name: "Jewelry Traits",
        items: ["Ring","Necklace"],
        traits: [
          {name:"Arcane",desc:"Increases Maximum Magicka by 877.",researchable:true},
          {name:"Robust",desc:"Increases Maximum Stamina by 877.",researchable:true},
          {name:"Healthy",desc:"Increases Maximum Health by 965.",researchable:true},
          {name:"Triune",desc:"Increases Maximum Magicka by 439, Maximum Stamina by 439, and Maximum Health by 482.",researchable:true},
          {name:"Infused",desc:"Increases jewelry enchantment effectiveness by 60%.",researchable:true},
          {name:"Protective",desc:"Increases Spell Resistance and Physical Resistance by 1190.",researchable:true},
          {name:"Swift",desc:"Increases movement speed by 7%.",researchable:true},
          {name:"Harmony",desc:"Activating a synergy restores 880 Health, Magicka, and Stamina.",researchable:true},
          {name:"Bloodthirsty",desc:"Increases your Weapon and Spell Damage against enemies under 90% Health by up to 350.",researchable:true},
          {name:"Intricate",desc:"Increases inspiration gained from deconstruction by 400%.",researchable:false},
          {name:"Ornate",desc:"Increases this item's sell price by 300%.",researchable:false},
        ]
      }
    ]
  }
};

const CRAFTS = Object.keys(GAME_DATA);
const DB_KEY = "eso_trait_tracker_v2";

// ─── DB Helpers ───────────────────────────────────────────────────────────────
function loadDB() {
  try { return JSON.parse(localStorage.getItem(DB_KEY) || "[]"); } catch { return []; }
}
function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

function makeCharacter({ characterName, ownerGoogleId, ownerDisplayName, ownerEmail, ownerPicture }) {
  return {
    id: `${ownerGoogleId}_${Date.now()}`,
    characterName,
    ownerGoogleId,
    ownerDisplayName,
    ownerEmail,
    ownerPicture: ownerPicture || null,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    appVersion: "2.0-phase2",
    source: "local",
    traitData: {}
  };
}

function getStatus(char, craft, section, item, trait) {
  return char?.traitData?.[craft]?.[section]?.[item]?.[trait] ?? "unknown";
}
function setStatus(char, craft, section, item, trait, status) {
  const next = JSON.parse(JSON.stringify(char));
  if (!next.traitData[craft]) next.traitData[craft] = {};
  if (!next.traitData[craft][section]) next.traitData[craft][section] = {};
  if (!next.traitData[craft][section][item]) next.traitData[craft][section][item] = {};
  next.traitData[craft][section][item][trait] = status;
  next.lastUpdated = new Date().toISOString();
  return next;
}
const STATUS_CYCLE = { unknown:"researchable", researchable:"done", done:"unknown" };

// ─── Google Identity Services Loader ─────────────────────────────────────────
function useGoogleAuth(clientId, onSignIn) {
  const [gsiReady, setGsiReady] = useState(false);
  const [gsiError, setGsiError] = useState(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
      setGsiError("placeholder");
      return;
    }
    // Load the GSI script
    const existing = document.getElementById("gsi-script");
    if (existing) { initGsi(); return; }
    const script = document.createElement("script");
    script.id = "gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => initGsi();
    script.onerror = () => setGsiError("load-failed");
    document.head.appendChild(script);

    function initGsi() {
      if (!window.google) { setGsiError("load-failed"); return; }
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          // Decode the JWT credential
          const payload = JSON.parse(atob(response.credential.split(".")[1]));
          onSignIn({
            googleId: payload.sub,
            displayName: payload.name,
            email: payload.email,
            picture: payload.picture,
            authMethod: "google"
          });
        },
        auto_select: true,
      });
      setGsiReady(true);
    }
    return () => {};
  }, [clientId]);

  // Render the sign-in button into btnRef
  useEffect(() => {
    if (!gsiReady || !btnRef.current || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") return;
    if (!window.google) return;
    window.google.accounts.id.renderButton(btnRef.current, {
      theme: "filled_black",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      width: 280,
    });
    // Also trigger One Tap
    window.google.accounts.id.prompt();
  }, [gsiReady]);

  return { gsiReady, gsiError, btnRef };
}

// ─── Sign-In Screen ───────────────────────────────────────────────────────────
function SignInScreen({ clientId, onSignIn }) {
  const { gsiError, btnRef } = useGoogleAuth(clientId, onSignIn);
  const isPlaceholder = clientId === "YOUR_GOOGLE_CLIENT_ID_HERE";

  return (
    <div style={{
      minHeight:"100vh",background:"#0a0a0b",display:"flex",
      alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',Arial,sans-serif"
    }}>
      <div style={{
        background:"#131314",border:"1px solid #c9a227",borderRadius:16,
        padding:"40px 36px",maxWidth:380,width:"90%",textAlign:"center",
        boxShadow:"0 8px 40px rgba(0,0,0,0.8)"
      }}>
        <div style={{fontSize:48,marginBottom:12}}>⚔️</div>
        <div style={{fontSize:22,fontWeight:800,color:"#c9a227",marginBottom:6}}>
          ESO Trait Tracker
        </div>
        <div style={{fontSize:13,color:"#888",marginBottom:32,lineHeight:1.6}}>
          Sign in with Google to track your crafting research.<br/>
          Your characters are tied to your Google identity.
        </div>

        {isPlaceholder ? (
          <div style={{
            background:"#1a0a0a",border:"1px solid #7f1d1d",borderRadius:8,
            padding:"16px",marginBottom:16
          }}>
            <div style={{color:"#ef4444",fontWeight:700,fontSize:13,marginBottom:6}}>
              ⚠️ Client ID Not Configured
            </div>
            <div style={{color:"#888",fontSize:12,lineHeight:1.6}}>
              Open the code and replace<br/>
              <code style={{color:"#fca5a5",background:"#2a0a0a",padding:"2px 6px",borderRadius:3,fontSize:11}}>
                YOUR_GOOGLE_CLIENT_ID_HERE
              </code><br/>
              with your actual OAuth Client ID from Google Cloud Console.
            </div>
          </div>
        ) : gsiError === "load-failed" ? (
          <div style={{
            background:"#1a0a0a",border:"1px solid #7f1d1d",borderRadius:8,
            padding:"16px",color:"#ef4444",fontSize:13
          }}>
            Failed to load Google Sign-In. Check your Client ID and that this page is served from an authorized origin.
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
            <div ref={btnRef} style={{minHeight:44}} />
            <div style={{fontSize:11,color:"#555",lineHeight:1.6}}>
              By signing in you agree that your character data<br/>
              will be associated with your Google account.
            </div>
          </div>
        )}

        <div style={{
          marginTop:24,background:"#0d1a0d",border:"1px solid #1a3a1a",
          borderRadius:8,padding:"10px 14px",fontSize:11,color:"#555",lineHeight:1.6,textAlign:"left"
        }}>
          <span style={{color:"#22c55e",fontWeight:700}}>Phase 2:</span> Google Sign-In active.
          Your Google account ID is used to tag character ownership.
          Phase 3 will add Google Drive sync.
        </div>
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ identity, size=32 }) {
  const [imgError, setImgError] = useState(false);
  if (identity.picture && !imgError) {
    return (
      <img
        src={identity.picture}
        onError={()=>setImgError(true)}
        style={{width:size,height:size,borderRadius:"50%",border:"2px solid #c9a227",objectFit:"cover",flexShrink:0}}
        alt={identity.displayName}
      />
    );
  }
  return (
    <div style={{
      width:size,height:size,borderRadius:"50%",background:"#c9a227",
      display:"flex",alignItems:"center",justifyContent:"center",
      fontSize:size*0.45,fontWeight:700,color:"#000",flexShrink:0,
      border:"2px solid #c9a227"
    }}>
      {identity.displayName.charAt(0).toUpperCase()}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, notResearchable, onClick, compact, readOnly }) {
  if (notResearchable) {
    return (
      <div style={{
        background:"#2a2a2a",color:"#666",borderRadius:4,
        padding:compact?"2px 4px":"3px 6px",fontSize:compact?9:10,
        fontWeight:600,textAlign:"center",cursor:"default",
        border:"1px solid #333",userSelect:"none",whiteSpace:"nowrap"
      }}>N/A</div>
    );
  }
  const cfg = {
    done:        {bg:"#0d3320",border:"#22c55e",color:"#22c55e",label:"✓"},
    researchable:{bg:"#2d2500",border:"#eab308",color:"#eab308",label:"Res"},
    unknown:     {bg:"#1a1a1a",border:"#555",   color:"#888",   label:"Unk"},
  };
  const c = cfg[status] || cfg.unknown;
  return (
    <div
      onClick={readOnly ? undefined : onClick}
      title={readOnly ? "Read-only: you are not the owner of this character" : undefined}
      style={{
        background:c.bg,border:`1px solid ${c.border}`,color:c.color,
        borderRadius:4,padding:compact?"2px 4px":"3px 6px",
        fontSize:compact?9:10,fontWeight:700,textAlign:"center",
        cursor:readOnly?"not-allowed":"pointer",userSelect:"none",
        whiteSpace:"nowrap",opacity:readOnly?0.6:1,
        transition:"all 0.15s",minWidth:compact?28:32
      }}
    >{c.label}</div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ done, total, color="#22c55e" }) {
  const pct = total===0?0:Math.round((done/total)*100);
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,height:6,background:"#2a2a2a",borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:3,transition:"width 0.3s"}}/>
      </div>
      <span style={{fontSize:11,color:"#888",minWidth:52,textAlign:"right"}}>{done}/{total} ({pct}%)</span>
    </div>
  );
}

// ─── Trait Grid ───────────────────────────────────────────────────────────────
function TraitGrid({ section, craft, character, readOnly, onUpdate }) {
  const { name, items, traits } = section;
  const [tooltip, setTooltip] = useState(null);
  const researchable = traits.filter(t=>t.researchable);
  let done=0, total=0;
  items.forEach(item => researchable.forEach(trait => {
    total++;
    if (getStatus(character,craft,name,item,trait.name)==="done") done++;
  }));
  const compact = items.length > 6;
  const handleClick = (item, trait) => {
    if (readOnly || !trait.researchable) return;
    const cur = getStatus(character,craft,name,item,trait.name);
    onUpdate(setStatus(character,craft,name,item,trait.name,STATUS_CYCLE[cur]||"unknown"));
  };
  return (
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#c9a227"}}>{name}</h3>
        <div style={{width:220}}><ProgressBar done={done} total={total}/></div>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{borderCollapse:"collapse",width:"100%",minWidth:300}}>
          <thead>
            <tr>
              <th style={{textAlign:"left",padding:"4px 8px",fontSize:11,color:"#888",fontWeight:600,borderBottom:"1px solid #333",minWidth:90,position:"sticky",left:0,background:"#131314",zIndex:1}}>Trait</th>
              {items.map(item=>(
                <th key={item} style={{textAlign:"center",padding:"4px 4px",fontSize:compact?9:10,color:"#aaa",fontWeight:600,borderBottom:"1px solid #333",minWidth:compact?52:64,maxWidth:compact?64:80,wordBreak:"break-word",lineHeight:1.2}}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {traits.map((trait,ti)=>(
              <tr key={trait.name} style={{background:ti%2===0?"#0d0d0e":"#111112"}}>
                <td style={{padding:"4px 8px",fontSize:11,color:trait.researchable?"#ddd":"#555",fontWeight:500,borderBottom:"1px solid #222",position:"sticky",left:0,background:ti%2===0?"#0d0d0e":"#111112",zIndex:1,whiteSpace:"nowrap"}}>
                  <span style={{cursor:"help",borderBottom:"1px dotted #555"}} onMouseEnter={e=>setTooltip({text:trait.desc,x:e.clientX,y:e.clientY})} onMouseLeave={()=>setTooltip(null)}>{trait.name}</span>
                </td>
                {items.map(item=>(
                  <td key={item} style={{textAlign:"center",padding:"3px 3px",borderBottom:"1px solid #222"}}>
                    <StatusBadge status={getStatus(character,craft,name,item,trait.name)} notResearchable={!trait.researchable} compact={compact} readOnly={readOnly} onClick={()=>handleClick(item,trait)}/>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tooltip&&(
        <div style={{position:"fixed",left:tooltip.x+12,top:tooltip.y-8,background:"#1e1e1e",border:"1px solid #444",borderRadius:6,padding:"8px 12px",fontSize:12,color:"#ddd",maxWidth:280,zIndex:9999,pointerEvents:"none",boxShadow:"0 4px 16px rgba(0,0,0,0.6)",lineHeight:1.5}}>{tooltip.text}</div>
      )}
    </div>
  );
}

// ─── Craft View ───────────────────────────────────────────────────────────────
function CraftView({ craft, character, readOnly, onUpdate }) {
  return (
    <div>
      {GAME_DATA[craft].sections.map(section=>(
        <TraitGrid key={section.name} section={section} craft={craft} character={character} readOnly={readOnly} onUpdate={onUpdate}/>
      ))}
    </div>
  );
}

// ─── Character Summary ────────────────────────────────────────────────────────
function CharSummary({ character }) {
  const stats = CRAFTS.map(craft => {
    let done=0,total=0;
    GAME_DATA[craft].sections.forEach(sec=>{
      sec.items.forEach(item=>{
        sec.traits.filter(t=>t.researchable).forEach(trait=>{
          total++;
          if(getStatus(character,craft,sec.name,item,trait.name)==="done") done++;
        });
      });
    });
    return {craft,done,total,pct:total?Math.round(done/total*100):0};
  });
  const totalDone=stats.reduce((a,s)=>a+s.done,0);
  const totalAll=stats.reduce((a,s)=>a+s.total,0);
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10,marginBottom:20}}>
      {stats.map(s=>(
        <div key={s.craft} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,padding:"10px 14px"}}>
          <div style={{fontSize:12,color:"#888",marginBottom:4}}>{GAME_DATA[s.craft].icon} {s.craft}</div>
          <div style={{fontSize:20,fontWeight:700,color:"#c9a227",marginBottom:4}}>{s.pct}%</div>
          <ProgressBar done={s.done} total={s.total} color="#c9a227"/>
        </div>
      ))}
      <div style={{background:"#1a1a1a",border:"1px solid #c9a227",borderRadius:8,padding:"10px 14px"}}>
        <div style={{fontSize:12,color:"#888",marginBottom:4}}>⭐ Overall</div>
        <div style={{fontSize:20,fontWeight:700,color:"#22c55e",marginBottom:4}}>{totalAll?Math.round(totalDone/totalAll*100):0}%</div>
        <ProgressBar done={totalDone} total={totalAll} color="#22c55e"/>
      </div>
    </div>
  );
}

// ─── Add Character Modal ──────────────────────────────────────────────────────
function AddCharModal({ identity, onAdd, onClose }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError("Character name is required."); return; }
    onAdd(makeCharacter({ characterName:trimmed, ownerGoogleId:identity.googleId, ownerDisplayName:identity.displayName, ownerEmail:identity.email, ownerPicture:identity.picture }));
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
      <div style={{background:"#131314",border:"1px solid #2a2a2a",borderRadius:10,padding:24,maxWidth:340,width:"90%"}}>
        <div style={{fontSize:15,fontWeight:700,color:"#e8e8e8",marginBottom:4}}>New Character</div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
          <Avatar identity={identity} size={24}/>
          <span style={{fontSize:12,color:"#888"}}>Owner: <span style={{color:"#c9a227"}}>{identity.displayName}</span></span>
          <span style={{background:"#0d3320",border:"1px solid #22c55e",color:"#22c55e",borderRadius:4,padding:"1px 6px",fontSize:9,fontWeight:700}}>GOOGLE</span>
        </div>
        <input
          autoFocus value={name}
          onChange={e=>{setName(e.target.value);setError("");}}
          onKeyDown={e=>{if(e.key==="Enter")handleAdd();if(e.key==="Escape")onClose();}}
          placeholder="Character name…"
          style={{width:"100%",background:"#1e1e1e",border:"1px solid #444",color:"#e8e8e8",borderRadius:6,padding:"8px 10px",fontSize:13,boxSizing:"border-box",outline:"none",marginBottom:8}}
        />
        {error&&<div style={{color:"#ef4444",fontSize:12,marginBottom:8}}>{error}</div>}
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button onClick={handleAdd} style={{flex:1,background:"#c9a227",border:"none",color:"#000",borderRadius:6,padding:"8px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>Create</button>
          <button onClick={onClose} style={{flex:1,background:"#2a2a2a",border:"1px solid #333",color:"#aaa",borderRadius:6,padding:"8px 0",fontSize:13,cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Sign Out Confirm ─────────────────────────────────────────────────────────
function SignOutConfirm({ identity, onConfirm, onCancel }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
      <div style={{background:"#131314",border:"1px solid #2a2a2a",borderRadius:10,padding:24,maxWidth:320,width:"90%",textAlign:"center"}}>
        <Avatar identity={identity} size={48}/>
        <div style={{fontSize:15,fontWeight:700,color:"#e8e8e8",marginTop:12,marginBottom:6}}>Sign Out?</div>
        <div style={{fontSize:13,color:"#888",marginBottom:20}}>
          Signed in as <span style={{color:"#c9a227"}}>{identity.displayName}</span><br/>
          <span style={{fontSize:11}}>{identity.email}</span>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onConfirm} style={{flex:1,background:"#2a2a2a",border:"1px solid #555",color:"#aaa",borderRadius:6,padding:"8px 0",fontSize:13,cursor:"pointer"}}>Sign Out</button>
          <button onClick={onCancel} style={{flex:1,background:"#c9a227",border:"none",color:"#000",borderRadius:6,padding:"8px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>Stay Signed In</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [identity,      setIdentity]      = useState(null);
  const [characters,    setCharacters]    = useState(()=>loadDB());
  const [selectedId,    setSelectedId]    = useState(null);
  const [activeCraft,   setActiveCraft]   = useState("Blacksmithing");
  const [showAddChar,   setShowAddChar]   = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showSignOut,   setShowSignOut]   = useState(false);
  const [filterOwned,   setFilterOwned]   = useState(false);
  const [dark,          setDark]          = useState(true);

  useEffect(()=>{
    if (characters.length>0 && !selectedId) setSelectedId(characters[0].id);
    if (selectedId && !characters.find(c=>c.id===selectedId)) setSelectedId(characters[0]?.id||null);
  },[characters]);

  const selectedChar = characters.find(c=>c.id===selectedId)||null;
  const isOwner = selectedChar && identity && selectedChar.ownerGoogleId===identity.googleId;

  const handleSignIn = useCallback((id)=>{ setIdentity(id); },[]);

  const handleSignOut = () => {
    if (window.google) window.google.accounts.id.disableAutoSelect();
    setIdentity(null);
    setShowSignOut(false);
    setSelectedId(null);
  };

  const handleAddChar = (newChar)=>{
    const next=[...characters,newChar];
    setCharacters(next); saveDB(next);
    setSelectedId(newChar.id); setShowAddChar(false);
  };

  const handleUpdateChar = useCallback((updated)=>{
    const next=characters.map(c=>c.id===updated.id?updated:c);
    setCharacters(next); saveDB(next);
  },[characters]);

  const handleDeleteChar = (id)=>{
    const next=characters.filter(c=>c.id!==id);
    setCharacters(next); saveDB(next); setDeleteConfirm(null);
    if(selectedId===id) setSelectedId(next[0]?.id||null);
  };

  const visibleChars = filterOwned ? characters.filter(c=>c.ownerGoogleId===identity?.googleId) : characters;
  const surface = dark?"#131314":"#ffffff";
  const border  = dark?"#2a2a2a":"#d0d0d0";
  const text    = dark?"#e8e8e8":"#111111";
  const muted   = dark?"#888":"#666";

  // Show sign-in screen if not authenticated
  if (!identity) {
    return <SignInScreen clientId={GOOGLE_CLIENT_ID} onSignIn={handleSignIn}/>;
  }

  return (
    <div style={{minHeight:"100vh",background:dark?"#0a0a0b":"#f0f0f0",color:text,fontFamily:"'Segoe UI',Arial,sans-serif"}}>
      {/* Header */}
      <div style={{background:surface,borderBottom:`1px solid ${border}`,padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,gap:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>⚔️</span>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:"#c9a227"}}>ESO Trait Research Tracker</div>
            <div style={{fontSize:10,color:muted}}>Phase 2 — Google Sign-In Active</div>
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          {/* Identity pill */}
          <button
            onClick={()=>setShowSignOut(true)}
            style={{
              display:"flex",alignItems:"center",gap:8,
              background:dark?"#1a1a1a":"#f5f5f5",
              border:`1px solid ${border}`,borderRadius:20,
              padding:"5px 12px 5px 6px",fontSize:12,cursor:"pointer",color:text
            }}
          >
            <Avatar identity={identity} size={26}/>
            <div style={{textAlign:"left"}}>
              <div style={{fontWeight:600,lineHeight:1.2}}>{identity.displayName}</div>
              <div style={{fontSize:10,color:muted}}>{identity.email}</div>
            </div>
            <span style={{background:"#0d3320",border:"1px solid #22c55e",color:"#22c55e",borderRadius:4,padding:"1px 6px",fontSize:9,fontWeight:700,marginLeft:4}}>GOOGLE</span>
          </button>

          {/* Dark/Light toggle */}
          <div onClick={()=>setDark(d=>!d)} style={{width:48,height:26,borderRadius:13,background:dark?"#2a2a2a":"#ccc",position:"relative",cursor:"pointer",border:`1px solid ${border}`,transition:"background 0.2s",flexShrink:0}}>
            <div style={{position:"absolute",top:3,left:dark?24:3,width:18,height:18,borderRadius:"50%",background:dark?"#c9a227":"#fff",transition:"left 0.2s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>{dark?"🌙":"☀️"}</div>
          </div>
        </div>
      </div>

      <div style={{display:"flex",height:"calc(100vh - 57px)"}}>
        {/* Sidebar */}
        <div style={{width:210,minWidth:210,background:surface,borderRight:`1px solid ${border}`,display:"flex",flexDirection:"column",overflowY:"auto"}}>
          <div style={{padding:"10px 12px 6px",borderBottom:`1px solid ${border}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:11,fontWeight:700,color:muted,letterSpacing:1,textTransform:"uppercase"}}>Characters</span>
              <button onClick={()=>setShowAddChar(true)} style={{background:"#c9a227",border:"none",color:"#000",borderRadius:4,width:22,height:22,cursor:"pointer",fontSize:16,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
            <button
              onClick={()=>setFilterOwned(v=>!v)}
              style={{width:"100%",background:filterOwned?(dark?"#1e1a0a":"#fff8e6"):(dark?"#1a1a1a":"#f5f5f5"),border:`1px solid ${filterOwned?"#c9a227":border}`,color:filterOwned?"#c9a227":muted,borderRadius:4,padding:"4px 8px",fontSize:10,cursor:"pointer",fontWeight:filterOwned?700:400}}
            >{filterOwned?"★ My Characters Only":"☆ All Characters"}</button>
          </div>

          {visibleChars.length===0&&(
            <div style={{padding:"20px 12px",textAlign:"center",color:muted,fontSize:12}}>
              {filterOwned?"You have no characters yet.":"No characters yet."}<br/>
              Click <strong style={{color:"#c9a227"}}>+</strong> to add one.
            </div>
          )}

          {visibleChars.map(char=>{
            const owned=char.ownerGoogleId===identity?.googleId;
            const isSel=selectedId===char.id;
            return (
              <div key={char.id} onClick={()=>setSelectedId(char.id)} style={{padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",background:isSel?(dark?"#1e1a0a":"#fff8e6"):"transparent",borderLeft:isSel?"3px solid #c9a227":"3px solid transparent",transition:"background 0.15s"}}>
                <div style={{display:"flex",alignItems:"center",gap:7,flex:1,overflow:"hidden"}}>
                  <div style={{flexShrink:0}}>
                    {char.ownerPicture
                      ? <img src={char.ownerPicture} style={{width:22,height:22,borderRadius:"50%",border:`1px solid ${owned?"#22c55e":"#eab308"}`}} alt="" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      : <div style={{width:22,height:22,borderRadius:"50%",background:owned?"#22c55e":"#eab308",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#000"}}>{char.ownerDisplayName.charAt(0)}</div>
                    }
                  </div>
                  <div style={{overflow:"hidden"}}>
                    <div style={{fontSize:12,fontWeight:600,color:isSel?"#c9a227":text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{char.characterName}</div>
                    <div style={{fontSize:10,color:muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{owned?"You":char.ownerDisplayName}</div>
                  </div>
                </div>
                {owned&&(
                  <button onClick={e=>{e.stopPropagation();setDeleteConfirm(char.id);}} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:13,padding:"0 2px",flexShrink:0}}>🗑</button>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          {!selectedChar?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:muted}}>
              <div style={{fontSize:48,marginBottom:16}}>⚔️</div>
              <div style={{fontSize:18,fontWeight:700,color:text,marginBottom:8}}>No Character Selected</div>
              <div style={{fontSize:13}}>Add a character using the <strong style={{color:"#c9a227"}}>+</strong> button in the sidebar.</div>
            </div>
          ):(
            <>
              <div style={{marginBottom:12,display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#c9a227"}}>{selectedChar.characterName}</h2>
                    {isOwner
                      ?<span style={{background:"#0d3320",border:"1px solid #22c55e",color:"#22c55e",borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700}}>✦ YOUR CHARACTER</span>
                      :<span style={{background:"#2d2500",border:"1px solid #eab308",color:"#eab308",borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700}}>👁 READ-ONLY</span>
                    }
                  </div>
                  <div style={{fontSize:12,color:muted,marginTop:3,display:"flex",alignItems:"center",gap:8}}>
                    {selectedChar.ownerPicture&&<img src={selectedChar.ownerPicture} style={{width:16,height:16,borderRadius:"50%"}} alt=""/>}
                    <span>Owner: <span style={{color:"#c9a227"}}>{selectedChar.ownerDisplayName}</span></span>
                    {!isOwner&&<span style={{color:"#555"}}>· Read-only</span>}
                    {isOwner&&<span style={{color:"#555"}}>· Click cells to cycle status</span>}
                  </div>
                </div>
              </div>

              <CharSummary character={selectedChar}/>

              <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>
                {CRAFTS.map(craft=>(
                  <button key={craft} onClick={()=>setActiveCraft(craft)} style={{padding:"7px 14px",borderRadius:6,border:`1px solid ${activeCraft===craft?"#c9a227":border}`,background:activeCraft===craft?(dark?"#1e1a0a":"#fff8e6"):(dark?"#1a1a1a":"#f5f5f5"),color:activeCraft===craft?"#c9a227":muted,fontWeight:activeCraft===craft?700:500,fontSize:13,cursor:"pointer",transition:"all 0.15s"}}>{GAME_DATA[craft].icon} {craft}</button>
                ))}
              </div>

              <div style={{display:"flex",gap:12,marginBottom:14,flexWrap:"wrap"}}>
                {[{label:"Done",bg:"#0d3320",border:"#22c55e",color:"#22c55e",sym:"✓"},{label:"Researchable",bg:"#2d2500",border:"#eab308",color:"#eab308",sym:"Res"},{label:"Unknown",bg:"#1a1a1a",border:"#555",color:"#888",sym:"Unk"},{label:"Not Researchable",bg:"#2a2a2a",border:"#333",color:"#666",sym:"N/A"}].map(l=>(
                  <div key={l.label} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:muted}}>
                    <div style={{background:l.bg,border:`1px solid ${l.border}`,color:l.color,borderRadius:4,padding:"2px 6px",fontSize:10,fontWeight:700}}>{l.sym}</div>
                    {l.label}
                  </div>
                ))}
              </div>

              <div style={{background:surface,border:`1px solid ${border}`,borderRadius:8,padding:"16px"}}>
                <CraftView craft={activeCraft} character={selectedChar} readOnly={!isOwner} onUpdate={handleUpdateChar}/>
              </div>
            </>
          )}
        </div>
      </div>

      {showAddChar&&<AddCharModal identity={identity} onAdd={handleAddChar} onClose={()=>setShowAddChar(false)}/>}
      {showSignOut&&<SignOutConfirm identity={identity} onConfirm={handleSignOut} onCancel={()=>setShowSignOut(false)}/>}

      {deleteConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
          <div style={{background:surface,border:`1px solid ${border}`,borderRadius:10,padding:24,maxWidth:320,width:"90%"}}>
            <div style={{fontSize:16,fontWeight:700,color:text,marginBottom:8}}>Delete Character?</div>
            <div style={{fontSize:13,color:muted,marginBottom:20}}>Delete <strong style={{color:"#c9a227"}}>{characters.find(c=>c.id===deleteConfirm)?.characterName}</strong> and all their data? This cannot be undone.</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>handleDeleteChar(deleteConfirm)} style={{flex:1,background:"#7f1d1d",border:"1px solid #ef4444",color:"#fca5a5",borderRadius:6,padding:"8px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>Delete</button>
              <button onClick={()=>setDeleteConfirm(null)} style={{flex:1,background:"#2a2a2a",border:`1px solid ${border}`,color:muted,borderRadius:6,padding:"8px 0",fontSize:13,cursor:"pointer"}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}