import { useState, useRef, useCallback } from "react";

const mineralDB = {
  minerals: [
    { name: "Actinolite", formula: "Ca₂(Mg,Fe)₅Si₈O₂₂(OH)₂", hardness: "5.5 - 6.0", crystal_system: "Monoclinic", luster: "Vitreous", streak: "White", gravity: "3.0", localities: "Kogi, Kwara, FCT" },
    { name: "Barite", formula: "BaSO₄", hardness: "3.0 - 3.5", crystal_system: "Orthorhombic", luster: "Vitreous to Pearly", streak: "White", gravity: "4.5", localities: "Benue, Nasarawa, Taraba, Cross River, Gombe" },
    { name: "Bottinoite", formula: "NiSb₂(OH)₁₂", hardness: "3.5", crystal_system: "Trigonal", luster: "Vitreous", streak: "Pale Green", gravity: "4.0", localities: "Nasarawa, Kaduna" },
    { name: "Cassiterite", formula: "SnO₂", hardness: "6.0 - 7.0", crystal_system: "Tetragonal", luster: "Adamantine to Metallic", streak: "White to Pale Brown", gravity: "7.0", localities: "Plateau (Jos), Nasarawa, Bauchi, Kaduna, Kano" },
    { name: "Chromite", formula: "FeCr₂O₄", hardness: "5.5", crystal_system: "Isometric", luster: "Submetallic to Metallic", streak: "Dark Brown", gravity: "4.6", localities: "Kano, Kaduna, Zamfara, Katsina" },
    { name: "Columbite", formula: "FeNb₂O₆", hardness: "6.0", crystal_system: "Orthorhombic", luster: "Submetallic", streak: "Dark Red to Black", gravity: "5.2", localities: "Plateau, Nasarawa, Kogi, Kwara, Cross River" },
    { name: "Fluorite", formula: "CaF₂", hardness: "4.0", crystal_system: "Isometric", luster: "Vitreous", streak: "White", gravity: "3.2", localities: "Taraba, Bauchi, Plateau, Benue" },
    { name: "Gold", formula: "Au", hardness: "2.5 - 3.0", crystal_system: "Isometric", luster: "Metallic", streak: "Golden Yellow", gravity: "19.3", localities: "Zamfara, Kaduna, Osun, Kwara, Niger, Kebbi" },
    { name: "Gypsum", formula: "CaSO₄·2H₂O", hardness: "2.0", crystal_system: "Monoclinic", luster: "Vitreous to Pearly", streak: "White", gravity: "2.3", localities: "Sokoto, Adamawa, Gombe, Taraba, Benue" },
    { name: "Halite", formula: "NaCl", hardness: "2.5", crystal_system: "Isometric", luster: "Vitreous", streak: "White", gravity: "2.1", localities: "Benue, Cross River, Ebonyi" },
    { name: "Hastingite", formula: "NaCa₂(Fe₄Al)(Si₆Al₂)O₂₂(OH)₂", hardness: "5.0 - 6.0", crystal_system: "Monoclinic", luster: "Vitreous", streak: "Greenish-White", gravity: "3.4", localities: "Bauchi, Kaduna, Plateau" },
    { name: "Hematite", formula: "Fe₂O₃", hardness: "5.5 - 6.5", crystal_system: "Trigonal", luster: "Metallic to Dull", streak: "Rust Red", gravity: "5.3", localities: "Kogi (Ajaokuta), Enugu, Nasarawa, Zamfara" },
    { name: "Lead", formula: "PbS (Galena)", hardness: "2.5", crystal_system: "Isometric", luster: "Metallic", streak: "Lead Gray", gravity: "7.6", localities: "Ebonyi, Benue, Taraba, Plateau, Kano" },
    { name: "Magnetite", formula: "Fe₃O₄", hardness: "5.5 - 6.5", crystal_system: "Isometric", luster: "Metallic", streak: "Black", gravity: "5.2", localities: "Kogi, Zamfara, Oyo, Kaduna" },
    { name: "Mica", formula: "KAl₂(AlSi₃O₁₀)(OH)₂", hardness: "2.5 - 3.0", crystal_system: "Monoclinic", luster: "Pearly to Vitreous", streak: "White", gravity: "2.8", localities: "Kogi, Ekiti, Oyo, Nasarawa, Cross River" },
    { name: "Quartz", formula: "SiO₂", hardness: "7.0", crystal_system: "Trigonal", luster: "Vitreous", streak: "White", gravity: "2.65", localities: "Kwara, Oyo, Kaduna, Taraba, Plateau, Jigawa" },
    { name: "Staurolite", formula: "Fe₂Al₉O₆(SiO₄)₄(O,OH)₂", hardness: "7.0 - 7.5", crystal_system: "Monoclinic", luster: "Vitreous to Resinous", streak: "White/Gray", gravity: "3.7", localities: "Kaduna, Taraba, Bauchi" },
    { name: "Talc", formula: "Mg₃Si₄O₁₀(OH)₂", hardness: "1.0", crystal_system: "Monoclinic", luster: "Pearly to Greasy", streak: "White", gravity: "2.7", localities: "Oyo, Niger, Kaduna, Kogi, Ogun" },
    { name: "Tantalite", formula: "FeTa₂O₆", hardness: "6.0 - 6.5", crystal_system: "Orthorhombic", luster: "Submetallic", streak: "Black to Dark Brown", gravity: "8.2", localities: "Kogi, Ekiti, Cross River, Nasarawa, Kwara" },
    { name: "Topaz", formula: "Al₂SiO₄(F,OH)₂", hardness: "8.0", crystal_system: "Orthorhombic", luster: "Vitreous", streak: "White", gravity: "3.5", localities: "Plateau, Nasarawa, Oyo, Bauchi" },
    { name: "Zincite", formula: "ZnO", hardness: "4.0", crystal_system: "Hexagonal", luster: "Subadamantine", streak: "Orange-Yellow", gravity: "5.6", localities: "Plateau, Kano, Abuja" },
    { name: "Zircon", formula: "ZrSiO₄", hardness: "7.5", crystal_system: "Tetragonal", luster: "Adamantine", streak: "White", gravity: "4.7", localities: "Kaduna, Plateau, Nasarawa, Taraba" },
  ],
  state_distributions: [
    { state_name: "Sokoto", mineral_list: ["Gypsum", "Quartz"] },
    { state_name: "Zamfara", mineral_list: ["Gold", "Chromite", "Magnetite", "Hematite"] },
    { state_name: "Kebbi", mineral_list: ["Gold", "Quartz"] },
    { state_name: "Niger", mineral_list: ["Talc", "Gold", "Lead"] },
    { state_name: "Kaduna", mineral_list: ["Gold", "Columbite", "Zircon", "Staurolite", "Chromite", "Hastingite", "Talc", "Quartz", "Bottinoite"] },
    { state_name: "Kano", mineral_list: ["Chromite", "Zincite", "Cassiterite", "Lead"] },
    { state_name: "Borno", mineral_list: ["Gypsum"] },
    { state_name: "Plateau", mineral_list: ["Cassiterite", "Columbite", "Topaz", "Fluorite", "Zincite", "Zircon", "Hastingite", "Quartz", "Lead"] },
    { state_name: "Kogi", mineral_list: ["Hematite", "Magnetite", "Tantalite", "Mica", "Actinolite", "Columbite", "Talc"] },
    { state_name: "Nasarawa", mineral_list: ["Barite", "Cassiterite", "Columbite", "Topaz", "Bottinoite", "Hematite", "Mica", "Tantalite", "Zircon"] },
    { state_name: "Oyo", mineral_list: ["Magnetite", "Mica", "Quartz", "Talc", "Topaz"] },
    { state_name: "Benue", mineral_list: ["Barite", "Lead", "Halite", "Fluorite", "Gypsum"] },
  ],
};

const mineralColors = {
  Gold: "#B8860B", Quartz: "#6fa3d8", Hematite: "#8B1A1A", Cassiterite: "#7a5c3a",
  Columbite: "#5a3a6e", Barite: "#3a7a6e", Chromite: "#4a5a2a", Zircon: "#6e7ab8",
  Talc: "#7a8a7a", Mica: "#a87a3a", Magnetite: "#3a3a3a", Fluorite: "#7a3a8a",
  Lead: "#5a6a7a", Topaz: "#7ab8a8", Halite: "#d4b896", Gypsum: "#c8b87a",
  Staurolite: "#8a7a5a", Actinolite: "#3a6a4a", Tantalite: "#6a3a4a",
  Bottinoite: "#4a7a5a", Hastingite: "#5a4a6a", Zincite: "#c87a3a",
};

const mineralIcons = {
  Gold: "◆", Quartz: "◇", Hematite: "◉", Cassiterite: "◈", Columbite: "◧",
  Barite: "◰", Chromite: "◱", Zircon: "◲", Talc: "○", Mica: "◎",
  Magnetite: "●", Fluorite: "◐", Lead: "◑", Topaz: "◒", Halite: "◓",
  Gypsum: "◔", Staurolite: "◕", Actinolite: "◖", Tantalite: "◗", default: "◆",
};

const recentIds = [
  { name: "Cassiterite", sub: "Tin oxide · Tetragonal", time: "3 min ago", conf: 94, state: "Plateau" },
  { name: "Gold", sub: "Native element · Isometric", time: "18 min ago", conf: 89, state: "Zamfara" },
  { name: "Columbite", sub: "Niobate · Orthorhombic", time: "1 hr ago", conf: 76, state: "Kogi" },
  { name: "Barite", sub: "Sulfate · Orthorhombic", time: "2 hr ago", conf: 82, state: "Benue" },
  { name: "Unknown Sample", sub: "Below confidence threshold", time: "Yesterday", conf: 12, state: "—" },
  { name: "Quartz", sub: "Silicate · Trigonal", time: "Yesterday", conf: 97, state: "Kaduna" },
];

// Nigerian states with simplified SVG path data (approximate shapes)
const nigerianStates = [
  { id: "Sokoto", name: "Sokoto", x: 60, y: 35, w: 75, h: 65 },
  { id: "Kebbi", name: "Kebbi", x: 40, y: 95, w: 75, h: 60 },
  { id: "Zamfara", name: "Zamfara", x: 120, y: 40, w: 80, h: 65 },
  { id: "Katsina", name: "Katsina", x: 190, y: 30, w: 75, h: 65 },
  { id: "Kano", name: "Kano", x: 255, y: 55, w: 80, h: 65 },
  { id: "Jigawa", name: "Jigawa", x: 325, y: 40, w: 75, h: 60 },
  { id: "Yobe", name: "Yobe", x: 390, y: 45, w: 85, h: 65 },
  { id: "Borno", name: "Borno", x: 460, y: 35, w: 100, h: 100 },
  { id: "Niger", name: "Niger", x: 95, y: 150, w: 110, h: 90 },
  { id: "Kaduna", name: "Kaduna", x: 200, y: 115, w: 90, h: 75 },
  { id: "Bauchi", name: "Bauchi", x: 330, y: 110, w: 90, h: 75 },
  { id: "Gombe", name: "Gombe", x: 400, y: 140, w: 75, h: 65 },
  { id: "Adamawa", name: "Adamawa", x: 450, y: 185, w: 110, h: 90 },
  { id: "Taraba", name: "Taraba", x: 365, y: 210, w: 100, h: 85 },
  { id: "FCT", name: "FCT", x: 230, y: 210, w: 50, h: 40 },
  { id: "Nasarawa", name: "Nasarawa", x: 270, y: 195, w: 85, h: 70 },
  { id: "Plateau", name: "Plateau", x: 290, y: 150, w: 85, h: 65 },
  { id: "Kwara", name: "Kwara", x: 110, y: 240, w: 90, h: 75 },
  { id: "Kogi", name: "Kogi", x: 195, y: 255, w: 90, h: 70 },
  { id: "Benue", name: "Benue", x: 275, y: 265, w: 100, h: 70 },
  { id: "Oyo", name: "Oyo", x: 80, y: 310, w: 90, h: 75 },
  { id: "Osun", name: "Osun", x: 140, y: 345, w: 70, h: 60 },
  { id: "Ekiti", name: "Ekiti", x: 200, y: 340, w: 65, h: 55 },
  { id: "Ondo", name: "Ondo", x: 155, y: 395, w: 70, h: 60 },
  { id: "Ogun", name: "Ogun", x: 85, y: 385, w: 80, h: 60 },
  { id: "Lagos", name: "Lagos", x: 80, y: 440, w: 70, h: 40 },
  { id: "Edo", name: "Edo", x: 220, y: 335, w: 80, h: 75 },
  { id: "Delta", name: "Delta", x: 200, y: 410, w: 85, h: 60 },
  { id: "Anambra", name: "Anambra", x: 290, y: 350, w: 65, h: 55 },
  { id: "Enugu", name: "Enugu", x: 340, y: 325, w: 70, h: 60 },
  { id: "Ebonyi", name: "Ebonyi", x: 360, y: 365, w: 65, h: 55 },
  { id: "Imo", name: "Imo", x: 290, y: 405, w: 65, h: 55 },
  { id: "Abia", name: "Abia", x: 340, y: 410, w: 65, h: 55 },
  { id: "Cross River", name: "Cross River", x: 400, y: 320, w: 80, h: 95 },
  { id: "Akwa Ibom", name: "Akwa Ibom", x: 365, y: 420, w: 75, h: 60 },
  { id: "Rivers", name: "Rivers", x: 285, y: 460, w: 85, h: 60 },
  { id: "Bayelsa", name: "Bayelsa", x: 250, y: 480, w: 70, h: 45 },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --stone:#2C2416;--stone2:#5C4A30;--gold:#B8860B;--gold2:#D4A017;--cream:#FAF7F0;
    --cream2:#F0EAD6;--accent:#7B5E2A;--green:#2D6A4F;--red:#8B1A1A;
    --text:#1a1208;--text2:#5a4a30;--text3:#8a7a60;
    --card:rgba(255,255,255,0.9);--border:rgba(120,90,40,0.15);
    font-family:'DM Sans',sans-serif;
  }
  body{background:var(--cream);color:var(--text);min-height:100vh;overflow-x:hidden}
  .app{display:flex;flex-direction:column;min-height:100vh}

  /* NAV */
  .nav{display:flex;align-items:center;justify-content:space-between;padding:0 28px;height:56px;background:var(--stone);border-bottom:1px solid rgba(184,134,11,0.3);position:sticky;top:0;z-index:100}
  .nav-brand{display:flex;align-items:center;gap:10px;cursor:pointer}
  .nav-logo{width:34px;height:34px;background:var(--gold2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:17px;color:var(--stone);font-weight:700}
  .nav-title{font-family:'DM Serif Display',serif;font-size:18px;color:#FAF7F0;letter-spacing:0.3px}
  .nav-title span{color:var(--gold2)}
  .nav-links{display:flex;gap:2px}
  .nav-link{padding:6px 14px;border-radius:6px;font-size:13px;color:rgba(250,247,240,0.65);cursor:pointer;transition:all .2s;border:none;background:transparent;display:flex;align-items:center;gap:6px}
  .nav-link:hover{background:rgba(212,160,23,0.12);color:rgba(250,247,240,0.9)}
  .nav-link.active{background:rgba(212,160,23,0.2);color:var(--gold2)}
  .nav-right{display:flex;align-items:center;gap:12px}
  .avatar{width:32px;height:32px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#FAF7F0;cursor:pointer}
  .notif-btn{width:32px;height:32px;border-radius:8px;background:rgba(212,160,23,0.12);border:none;color:var(--gold2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;position:relative}
  .notif-dot{width:7px;height:7px;border-radius:50%;background:var(--red);position:absolute;top:6px;right:6px;border:1.5px solid var(--stone)}

  /* LAYOUT */
  .layout{display:grid;grid-template-columns:220px 1fr;flex:1}
  
  /* SIDEBAR */
  .sidebar{background:var(--stone);padding:20px 0;border-right:1px solid rgba(184,134,11,0.18);overflow-y:auto}
  .sidebar-section{padding:0 14px;margin-bottom:22px}
  .sidebar-label{font-size:10px;font-weight:600;color:rgba(250,247,240,0.3);letter-spacing:1.2px;text-transform:uppercase;padding:0 8px;margin-bottom:6px}
  .sidebar-item{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;font-size:13px;color:rgba(250,247,240,0.6);cursor:pointer;transition:all .2s;margin-bottom:1px;border:none;background:transparent;width:100%;text-align:left}
  .sidebar-item:hover{background:rgba(212,160,23,0.1);color:rgba(250,247,240,0.9)}
  .sidebar-item.active{background:rgba(212,160,23,0.18);color:var(--gold2)}
  .sidebar-icon{font-size:15px;width:22px;text-align:center;flex-shrink:0}
  .sidebar-badge{margin-left:auto;font-size:10px;background:rgba(212,160,23,0.2);color:var(--gold2);padding:2px 7px;border-radius:10px}
  .sidebar-divider{height:1px;background:rgba(184,134,11,0.12);margin:8px 14px}
  .sidebar-user{padding:14px;border-top:1px solid rgba(184,134,11,0.15);margin-top:auto;display:flex;align-items:center;gap:10px}
  .sidebar-user-name{font-size:13px;color:rgba(250,247,240,0.8);font-weight:500}
  .sidebar-user-role{font-size:11px;color:rgba(250,247,240,0.4)}

  /* MAIN */
  .main{padding:28px;overflow-y:auto;background:var(--cream)}
  .page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px}
  .page-title{font-family:'DM Serif Display',serif;font-size:26px;color:var(--stone);line-height:1.2}
  .page-sub{font-size:13px;color:var(--text3);margin-top:4px}
  .btn-row{display:flex;gap:8px}
  .btn-primary{display:inline-flex;align-items:center;gap:6px;background:var(--stone);color:#FAF7F0;border:none;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s}
  .btn-primary:hover{background:var(--stone2)}
  .btn-secondary{display:inline-flex;align-items:center;gap:6px;background:transparent;color:var(--accent);border:1.5px solid rgba(123,94,42,0.3);padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s}
  .btn-secondary:hover{background:rgba(123,94,42,0.08)}
  .btn-gold{display:inline-flex;align-items:center;gap:6px;background:var(--gold2);color:var(--stone);border:none;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}
  .btn-gold:hover{background:var(--gold)}

  /* STATS */
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
  .stat-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px 18px}
  .stat-label{font-size:11px;color:var(--text3);font-weight:500;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.6px}
  .stat-value{font-size:26px;font-weight:600;color:var(--stone);font-family:'DM Serif Display',serif;line-height:1}
  .stat-sub{font-size:11px;color:var(--text3);margin-top:5px}
  .badge{display:inline-block;font-size:10px;padding:2px 8px;border-radius:10px;margin-top:5px;font-weight:500}
  .badge-green{background:rgba(45,106,79,0.1);color:var(--green)}
  .badge-gold{background:rgba(184,134,11,0.12);color:var(--gold)}
  .badge-red{background:rgba(139,26,26,0.1);color:var(--red)}

  /* CARDS */
  .card{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden}
  .card-header{padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
  .card-title{font-size:14px;font-weight:600;color:var(--stone);display:flex;align-items:center;gap:7px}
  .card-body{padding:20px}
  .grid-2{display:grid;grid-template-columns:1.2fr 1fr;gap:20px;margin-bottom:20px}
  .grid-bottom{display:grid;grid-template-columns:1.3fr 1fr;gap:20px;margin-bottom:20px}

  /* UPLOAD */
  .upload-zone{border:2px dashed rgba(123,94,42,0.25);border-radius:12px;padding:32px 20px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(240,234,214,0.4)}
  .upload-zone:hover,.upload-zone.drag-over{border-color:var(--gold);background:rgba(212,160,23,0.06)}
  .upload-icon{width:52px;height:52px;border-radius:14px;background:rgba(184,134,11,0.1);display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 12px}
  .upload-text{font-size:14px;font-weight:500;color:var(--stone2);margin-bottom:4px}
  .upload-sub{font-size:12px;color:var(--text3)}
  .divider{display:flex;align-items:center;gap:10px;margin:14px 0;color:var(--text3);font-size:11px}
  .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
  
  /* IMAGE PREVIEW */
  .img-preview-wrap{border-radius:10px;overflow:hidden;background:#f0ead6;position:relative;margin-bottom:14px}
  .img-preview{width:100%;max-height:200px;object-fit:cover;display:block}
  .img-preview-overlay{position:absolute;top:8px;right:8px;display:flex;gap:6px}
  .img-preview-btn{width:28px;height:28px;border-radius:6px;background:rgba(44,36,22,0.75);border:none;color:#faf7f0;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px}
  .img-preview-label{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(44,36,22,0.7));padding:20px 12px 10px;color:#faf7f0;font-size:11px;font-weight:500}

  /* RESULT */
  .result-box{background:rgba(240,234,214,0.5);border:1px solid var(--border);border-radius:10px;padding:13px;display:flex;align-items:center;gap:12px;margin-bottom:8px;cursor:pointer;transition:all .2s}
  .result-box:hover{border-color:rgba(184,134,11,0.4);background:rgba(212,160,23,0.06)}
  .result-box.selected{border-color:var(--gold);background:rgba(212,160,23,0.1)}
  .result-img{width:48px;height:48px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:22px}
  .result-name{font-size:14px;font-weight:600;color:var(--stone)}
  .result-conf{font-size:11px;font-weight:500;margin-top:2px}
  .confidence-bar{height:3px;border-radius:2px;background:rgba(123,94,42,0.1);margin-top:5px;overflow:hidden}
  .conf-fill{height:100%;border-radius:2px}

  /* PROPERTIES */
  .prop-row{display:flex;padding:8px 0;border-bottom:1px solid var(--border)}
  .prop-row:last-child{border-bottom:none}
  .prop-key{font-size:12px;color:var(--text3);width:120px;flex-shrink:0}
  .prop-val{font-size:12px;color:var(--stone);font-weight:500}
  .prop-val.unknown{color:var(--text3);font-style:italic;font-weight:400}

  /* RECENT */
  .search-wrap{position:relative;margin-bottom:14px}
  .search-input{width:100%;padding:9px 14px 9px 34px;border:1.5px solid var(--border);border-radius:9px;font-size:13px;background:rgba(255,255,255,0.7);color:var(--stone);outline:none;transition:border .2s}
  .search-input:focus{border-color:rgba(184,134,11,0.5);background:#fff}
  .search-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--text3)}
  .recent-item{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:all .2s}
  .recent-item:last-child{border-bottom:none}
  .recent-item:hover{background:rgba(212,160,23,0.04);margin:0 -20px;padding:9px 20px}
  .recent-dot{width:30px;height:30px;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px}
  .recent-name{font-size:13px;font-weight:500;color:var(--stone)}
  .recent-sub{font-size:11px;color:var(--text3);margin-top:1px}
  .recent-time{margin-left:auto;font-size:11px;color:var(--text3);white-space:nowrap}
  .status-dot{width:6px;height:6px;border-radius:50%;margin-left:6px;flex-shrink:0}
  
  /* MINI BARS */
  .mini-bar-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
  .mini-label{font-size:12px;color:var(--text2);width:80px;flex-shrink:0}
  .mini-bar{flex:1;height:6px;background:rgba(123,94,42,0.1);border-radius:3px;overflow:hidden}
  .mini-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--stone2),var(--gold2))}
  .mini-count{font-size:11px;color:var(--text3);width:30px;text-align:right}

  /* MAP PAGE */
  .map-layout{display:grid;grid-template-columns:1fr 320px;gap:20px}
  .map-container{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden}
  .nigeria-map{width:100%;cursor:pointer}
  .state-path{transition:all .2s;stroke:#FAF7F0;stroke-width:1.5;rx:3}
  .state-path:hover{opacity:0.85;stroke-width:2.5;stroke:var(--gold2)}
  .state-path.has-minerals{cursor:pointer}
  .state-path.selected{stroke:var(--gold2);stroke-width:3;opacity:1}
  .map-legend{display:flex;gap:14px;padding:10px 16px;border-top:1px solid var(--border);background:rgba(240,234,214,0.3)}
  .legend-item{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text3)}
  .legend-dot{width:12px;height:12px;border-radius:3px}

  /* DATABASE PAGE */
  .db-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
  .mineral-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;cursor:pointer;transition:all .2s}
  .mineral-card:hover{border-color:rgba(184,134,11,0.4);transform:translateY(-2px);box-shadow:0 6px 20px rgba(44,36,22,0.08)}
  .mineral-icon-big{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:10px}
  .mineral-name{font-size:15px;font-weight:600;color:var(--stone);font-family:'DM Serif Display',serif}
  .mineral-formula{font-size:12px;color:var(--text3);margin-top:2px;margin-bottom:10px}
  .mineral-props{display:grid;grid-template-columns:1fr 1fr;gap:4px}
  .mprop{font-size:11px;color:var(--text3);padding:3px 0}
  .mprop span{color:var(--text2);font-weight:500}
  .mineral-locality{font-size:10px;color:var(--accent);background:rgba(123,94,42,0.1);padding:3px 8px;border-radius:6px;margin-top:8px;display:inline-block}

  /* SETTINGS */
  .settings-grid{display:grid;grid-template-columns:220px 1fr;gap:24px}
  .settings-nav{display:flex;flex-direction:column;gap:2px}
  .settings-nav-item{padding:9px 14px;border-radius:8px;font-size:13px;color:var(--text2);cursor:pointer;transition:all .2s}
  .settings-nav-item:hover{background:rgba(123,94,42,0.08)}
  .settings-nav-item.active{background:rgba(184,134,11,0.12);color:var(--accent);font-weight:500}
  .settings-panel{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px}
  .settings-section{margin-bottom:28px}
  .settings-section-title{font-size:13px;font-weight:600;color:var(--stone);margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid var(--border)}
  .settings-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(120,90,40,0.08)}
  .settings-row:last-child{border-bottom:none}
  .settings-label{font-size:13px;color:var(--stone);font-weight:500}
  .settings-sub{font-size:11px;color:var(--text3);margin-top:2px}
  .toggle{width:40px;height:22px;border-radius:11px;border:none;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0}
  .toggle.on{background:var(--green)}
  .toggle.off{background:rgba(123,94,42,0.2)}
  .toggle::after{content:'';width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:3px;transition:left .2s}
  .toggle.on::after{left:21px}
  .toggle.off::after{left:3px}
  .settings-input{padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;color:var(--stone);background:rgba(255,255,255,0.8);outline:none;width:200px}
  .settings-input:focus{border-color:rgba(184,134,11,0.5)}

  /* LOADING SPINNER */
  .spinner{width:32px;height:32px;border:3px solid rgba(123,94,42,0.15);border-top:3px solid var(--gold2);border-radius:50%;animation:spin .8s linear infinite;margin:20px auto}
  @keyframes spin{to{transform:rotate(360deg)}}
  
  /* TOAST */
  .toast{position:fixed;bottom:24px;right:24px;background:var(--stone);color:#faf7f0;padding:12px 18px;border-radius:10px;font-size:13px;display:flex;align-items:center;gap:8px;z-index:999;animation:slideUp .3s ease;box-shadow:0 8px 24px rgba(0,0,0,0.2)}
  @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

  /* MODAL */
  .modal-bg{position:fixed;inset:0;background:rgba(44,36,22,0.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
  .modal{background:var(--cream);border-radius:16px;max-width:560px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.25)}
  .modal-header{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--cream)}
  .modal-title{font-family:'DM Serif Display',serif;font-size:20px;color:var(--stone)}
  .modal-close{width:30px;height:30px;border:none;background:transparent;cursor:pointer;font-size:18px;color:var(--text3);border-radius:6px;display:flex;align-items:center;justify-content:center}
  .modal-close:hover{background:var(--border);color:var(--stone)}
  .modal-body{padding:20px 24px}
  
  /* SCROLLBAR */
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(123,94,42,0.2);border-radius:3px}
  
  /* CONFIDENCE COLORS */
  .conf-high{color:var(--green)}
  .conf-med{color:var(--gold)}
  .conf-low{color:var(--red)}

  /* empty state */
  .empty{padding:40px 20px;text-align:center;color:var(--text3)}
  .empty-icon{font-size:36px;margin-bottom:12px;opacity:0.5}
  .empty-text{font-size:14px;font-weight:500;color:var(--text2);margin-bottom:4px}
  .empty-sub{font-size:12px}

  .tag{font-size:10px;padding:2px 8px;border-radius:10px;background:rgba(123,94,42,0.1);color:var(--accent);font-weight:500;display:inline-block;margin:2px 2px 0 0}
`;

// Fake AI identification results
const fakeResults = [
  { name: "Cassiterite", confidence: 87, color: "#7a5c3a" },
  { name: "Columbite", confidence: 9, color: "#5a3a6e" },
  { name: "Tantalite", confidence: 4, color: "#6a3a4a" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [dbSearch, setDbSearch] = useState("");
  const [recentSearch, setRecentSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [settingsTab, setSettingsTab] = useState("general");
  const [toggles, setToggles] = useState({ darkMode: false, notifications: true, autoAnalyze: true, geoTag: false, cloudBackup: true });
  const fileInputRef = useRef();

  const showToast = (msg, icon = "✓") => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2800);
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) { showToast("Please upload an image file", "✕"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setAnalysisResult(null);
      setSelectedResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = () => {
    if (!uploadedImage) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(fakeResults);
      setSelectedResult(fakeResults[0]);
      showToast("Analysis complete — Cassiterite identified", "◆");
    }, 2200);
  };

  const selectedMineral = selectedResult
    ? mineralDB.minerals.find(m => m.name === selectedResult.name)
    : null;

  const confColor = (c) => c >= 70 ? "var(--green)" : c >= 40 ? "var(--gold)" : "var(--red)";

  const stateHasMinerals = (name) => mineralDB.state_distributions.some(s => s.state_name === name);
  const getMineralCount = (name) => {
    const s = mineralDB.state_distributions.find(s => s.state_name === name);
    return s ? s.mineral_list.length : 0;
  };
  const getStateColor = (name) => {
    const count = getMineralCount(name);
    if (count === 0) return "#d4c8a0";
    if (count <= 2) return "#b8a870";
    if (count <= 5) return "#9a7a3a";
    return "#7a5a1a";
  };
  const selectedStateData = selectedState
    ? mineralDB.state_distributions.find(s => s.state_name === selectedState)
    : null;

  const filteredMinerals = mineralDB.minerals.filter(m =>
    m.name.toLowerCase().includes(dbSearch.toLowerCase()) ||
    m.crystal_system.toLowerCase().includes(dbSearch.toLowerCase()) ||
    m.localities.toLowerCase().includes(dbSearch.toLowerCase())
  );

  const filteredRecent = recentIds.filter(r =>
    r.name.toLowerCase().includes(recentSearch.toLowerCase())
  );

  // Top minerals count
  const mineralCounts = {};
  mineralDB.state_distributions.forEach(s => s.mineral_list.forEach(m => { mineralCounts[m] = (mineralCounts[m] || 0) + 1; }));
  const topMinerals = Object.entries(mineralCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxCount = topMinerals[0]?.[1] || 1;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-brand" onClick={() => setPage("dashboard")}>
            <div className="nav-logo">⛏</div>
            <div className="nav-title">Mineral<span>ID</span> Nigeria</div>
          </div>
          <div className="nav-links">
            {[["dashboard","⊞","Dashboard"],["identify","◈","Identify"],["map","⊕","State Map"],["database","◧","Database"]].map(([p,ic,lb]) => (
              <button key={p} className={`nav-link${page===p?" active":""}`} onClick={() => setPage(p)}>
                <span>{ic}</span>{lb}
              </button>
            ))}
          </div>
          <div className="nav-right">
            <button className="notif-btn" onClick={() => showToast("3 new identifications pending review", "🔔")}>
              🔔<span className="notif-dot" />
            </button>
            <button className="btn-secondary" style={{fontSize:12,padding:"6px 12px"}} onClick={() => setPage("settings")}>⚙ Settings</button>
            <div className="avatar" onClick={() => setPage("settings")}>GK</div>
          </div>
        </nav>

        <div className="layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="sidebar-section">
              <div className="sidebar-label">Main</div>
              {[["dashboard","⊞","Dashboard"],["identify","◈","Identify Mineral"],["map","⊕","State Map"],["database","◧","Database"]].map(([p,ic,lb]) => (
                <button key={p} className={`sidebar-item${page===p?" active":""}`} onClick={() => setPage(p)}>
                  <span className="sidebar-icon">{ic}</span>{lb}
                </button>
              ))}
            </div>
            <div className="sidebar-divider" />
            <div className="sidebar-section">
              <div className="sidebar-label">Reports</div>
              <button className="sidebar-item" onClick={() => showToast("Analytics report generated")}>
                <span className="sidebar-icon">◰</span>Analytics
                <span className="sidebar-badge">New</span>
              </button>
              <button className="sidebar-item" onClick={() => showToast("Export started — CSV downloading")}>
                <span className="sidebar-icon">↓</span>Export Data
              </button>
              <button className="sidebar-item" onClick={() => setPage("history")}>
                <span className="sidebar-icon">◷</span>History
              </button>
            </div>
            <div className="sidebar-divider" />
            <div className="sidebar-section">
              <div className="sidebar-label">System</div>
              <button className={`sidebar-item${page==="settings"?" active":""}`} onClick={() => setPage("settings")}>
                <span className="sidebar-icon">⚙</span>Settings
              </button>
              <button className="sidebar-item" onClick={() => showToast("Documentation opened in new tab")}>
                <span className="sidebar-icon">?</span>Help & Docs
              </button>
            </div>
            <div style={{padding:"0 14px",marginTop:"auto"}}>
              <div className="sidebar-user">
                <div className="avatar">GK</div>
                <div>
                  <div className="sidebar-user-name">Geologist K.</div>
                  <div className="sidebar-user-role">Field Researcher</div>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="main">
            {/* ===== DASHBOARD ===== */}
            {page === "dashboard" && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Dashboard</div>
                    <div className="page-sub">Nigerian mineral identification overview — {new Date().toLocaleDateString("en-NG",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
                  </div>
                  <div className="btn-row">
                    <button className="btn-secondary" onClick={() => showToast("Report exported as PDF")}>↓ Export</button>
                    <button className="btn-primary" onClick={() => setPage("identify")}>+ New Identification</button>
                  </div>
                </div>
                <div className="stats">
                  {[
                    ["Total Identified","2,418","Since inception","badge-green","↑ 12% this month"],
                    ["States Covered","12","Of 36 states + FCT","badge-gold","4 new this quarter"],
                    ["Mineral Types","22","In Nigerian database","badge-green","All documented"],
                    ["Avg Confidence","84%","Model accuracy","badge-green","↑ from 79%"],
                  ].map(([l,v,s,b,t]) => (
                    <div className="stat-card" key={l}>
                      <div className="stat-label">{l}</div>
                      <div className="stat-value">{v}</div>
                      <div className="stat-sub">{s}</div>
                      <span className={`badge ${b}`}>{t}</span>
                    </div>
                  ))}
                </div>

                <div className="grid-2">
                  {/* Upload & Identify */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">◈ Quick Identify</div>
                      <button className="btn-secondary" style={{fontSize:11,padding:"5px 11px"}} onClick={() => setPage("identify")}>Full Page →</button>
                    </div>
                    <div className="card-body">
                      {!uploadedImage ? (
                        <div
                          className={`upload-zone${isDragging?" drag-over":""}`}
                          onDragOver={e=>{e.preventDefault();setIsDragging(true)}}
                          onDragLeave={()=>setIsDragging(false)}
                          onDrop={handleDrop}
                          onClick={()=>fileInputRef.current.click()}
                        >
                          <div className="upload-icon">📷</div>
                          <div className="upload-text">Drop a mineral image here</div>
                          <div className="upload-sub">JPG, PNG, WEBP up to 20MB</div>
                          <div className="upload-btn">Browse Files</div>
                          <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])} />
                        </div>
                      ) : (
                        <div>
                          <div className="img-preview-wrap">
                            <img src={uploadedImage} alt="Mineral preview" className="img-preview" />
                            <div className="img-preview-overlay">
                              <button className="img-preview-btn" onClick={()=>fileInputRef.current.click()} title="Change image">↺</button>
                              <button className="img-preview-btn" onClick={()=>{setUploadedImage(null);setAnalysisResult(null);setSelectedResult(null)}} title="Remove">✕</button>
                            </div>
                            <div className="img-preview-label">Image ready for analysis</div>
                            <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])} />
                          </div>
                          {!isAnalyzing && !analysisResult && (
                            <button className="btn-gold" style={{width:"100%",justifyContent:"center"}} onClick={handleAnalyze}>◈ Analyze Mineral</button>
                          )}
                          {isAnalyzing && (
                            <div style={{textAlign:"center",padding:"10px 0"}}>
                              <div className="spinner" />
                              <div style={{fontSize:12,color:"var(--text3)"}}>Analyzing sample...</div>
                            </div>
                          )}
                        </div>
                      )}
                      {analysisResult && (
                        <div style={{marginTop:4}}>
                          {analysisResult.map(r => (
                            <div key={r.name} className={`result-box${selectedResult?.name===r.name?" selected":""}`} onClick={()=>setSelectedResult(r)}>
                              <div className="result-img" style={{background:`${r.color}22`}}>
                                <span style={{color:r.color}}>{mineralIcons[r.name]||"◆"}</span>
                              </div>
                              <div style={{flex:1}}>
                                <div className="result-name">{r.name}</div>
                                <div className="result-conf" style={{color:confColor(r.confidence)}}>{r.confidence}% confidence</div>
                                <div className="confidence-bar"><div className="conf-fill" style={{width:`${r.confidence}%`,background:confColor(r.confidence)}} /></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Properties */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">◧ Mineral Properties</div>
                      <div style={{display:"flex",gap:6}}>
                        <button className="btn-secondary" style={{fontSize:11,padding:"5px 11px"}} onClick={()=>showToast("Properties copied to clipboard")}>⊡ Copy</button>
                        <button className="btn-secondary" style={{fontSize:11,padding:"5px 11px"}} onClick={()=>showToast("Exported to PDF")}>↓ Export</button>
                      </div>
                    </div>
                    <div className="card-body" style={{padding:"14px 20px"}}>
                      {selectedMineral ? (
                        <>
                          <div style={{display:"flex",alignItems:"center",gap:10,padding:12,background:"rgba(184,134,11,0.07)",borderRadius:10,marginBottom:14,border:"1px solid rgba(184,134,11,0.15)"}}>
                            <div style={{width:44,height:44,borderRadius:10,background:`${mineralColors[selectedMineral.name]||"#9a7a3a"}22`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                              {mineralIcons[selectedMineral.name]||"◆"}
                            </div>
                            <div>
                              <div style={{fontSize:16,fontWeight:600,color:"var(--stone)",fontFamily:"DM Serif Display,serif"}}>{selectedMineral.name}</div>
                              <div style={{fontSize:11,color:"var(--text3)"}}>{selectedMineral.formula}</div>
                            </div>
                            <span className="badge badge-green" style={{marginLeft:"auto"}}>AI Identified</span>
                          </div>
                          {[["Mohs Hardness",selectedMineral.hardness],["Crystal System",selectedMineral.crystal_system],["Luster",selectedMineral.luster],["Streak",selectedMineral.streak],["Specific Gravity",selectedMineral.gravity],["Localities",selectedMineral.localities]].map(([k,v])=>(
                            <div className="prop-row" key={k}>
                              <div className="prop-key">{k}</div>
                              <div className="prop-val">{v}</div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="empty">
                          <div className="empty-icon">◧</div>
                          <div className="empty-text">No mineral selected</div>
                          <div className="empty-sub">Upload and analyze an image to see properties</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid-bottom">
                  {/* Recent */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">◷ Recent Identifications</div>
                      <button className="btn-secondary" style={{fontSize:11,padding:"5px 11px"}} onClick={()=>setPage("history")}>View All →</button>
                    </div>
                    <div className="card-body">
                      <div className="search-wrap">
                        <span className="search-icon">⊕</span>
                        <input className="search-input" placeholder="Filter results..." value={recentSearch} onChange={e=>setRecentSearch(e.target.value)} />
                      </div>
                      {filteredRecent.map(r => (
                        <div key={r.name+r.time} className="recent-item" onClick={()=>setModal(r)}>
                          <div className="recent-dot" style={{background:`${mineralColors[r.name]||"#9a7a3a"}18`,color:mineralColors[r.name]||"var(--accent)"}}>
                            {mineralIcons[r.name]||"◆"}
                          </div>
                          <div>
                            <div className="recent-name">{r.name}</div>
                            <div className="recent-sub">{r.sub}</div>
                          </div>
                          <div className="recent-time">{r.time}</div>
                          <div className="status-dot" style={{background:r.conf>=70?"var(--green)":r.conf>=40?"var(--gold)":"var(--red)"}} />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Top minerals */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">◈ Most Found by State</div>
                      <button className="btn-secondary" style={{fontSize:11,padding:"5px 11px"}} onClick={()=>setPage("database")}>Full DB →</button>
                    </div>
                    <div className="card-body">
                      <div style={{fontSize:11,color:"var(--text3)",marginBottom:12}}>By number of states with deposits</div>
                      {topMinerals.map(([name,count])=>(
                        <div className="mini-bar-row" key={name}>
                          <div className="mini-label">{name}</div>
                          <div className="mini-bar"><div className="mini-fill" style={{width:`${(count/maxCount)*100}%`}} /></div>
                          <div className="mini-count">{count}</div>
                        </div>
                      ))}
                      <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid var(--border)",display:"flex",gap:8}}>
                        <button className="btn-secondary" style={{flex:1,justifyContent:"center",fontSize:11,padding:7}} onClick={()=>setPage("database")}>Full Database →</button>
                        <button className="btn-primary" style={{flex:1,justifyContent:"center",fontSize:11,padding:7}} onClick={()=>setPage("identify")}>+ Identify Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ===== IDENTIFY PAGE ===== */}
            {page === "identify" && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Identify Mineral</div>
                    <div className="page-sub">Upload a mineral sample image for AI-powered identification</div>
                  </div>
                  <div className="btn-row">
                    <button className="btn-secondary" onClick={()=>{setUploadedImage(null);setAnalysisResult(null);setSelectedResult(null);showToast("Session cleared")}}>✕ Clear</button>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:20}}>
                  <div style={{display:"flex",flexDirection:"column",gap:16}}>
                    {/* Upload card */}
                    <div className="card">
                      <div className="card-header"><div className="card-title">📷 Upload Sample Image</div></div>
                      <div className="card-body">
                        {!uploadedImage ? (
                          <div
                            className={`upload-zone${isDragging?" drag-over":""}`}
                            style={{padding:"48px 20px"}}
                            onDragOver={e=>{e.preventDefault();setIsDragging(true)}}
                            onDragLeave={()=>setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={()=>fileInputRef.current.click()}
                          >
                            <div className="upload-icon" style={{width:64,height:64,fontSize:30}}>📸</div>
                            <div className="upload-text" style={{fontSize:15}}>Drag & drop your mineral photo</div>
                            <div className="upload-sub">Supports JPG, PNG, WEBP, HEIC — up to 20MB</div>
                            <div className="upload-btn" style={{marginTop:18,padding:"10px 28px",fontSize:13}}>Browse Files</div>
                            <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])} />
                          </div>
                        ) : (
                          <div>
                            <div className="img-preview-wrap">
                              <img src={uploadedImage} alt="Uploaded mineral" className="img-preview" style={{maxHeight:260}} />
                              <div className="img-preview-overlay">
                                <button className="img-preview-btn" onClick={()=>fileInputRef.current.click()} title="Change">↺ Change</button>
                                <button className="img-preview-btn" onClick={()=>{setUploadedImage(null);setAnalysisResult(null);setSelectedResult(null)}} title="Remove">✕</button>
                              </div>
                              <div className="img-preview-label">✓ Image loaded — ready for analysis</div>
                              <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])} />
                            </div>
                            {!isAnalyzing && !analysisResult && (
                              <button className="btn-gold" style={{width:"100%",justifyContent:"center",padding:"12px 18px",fontSize:14}} onClick={handleAnalyze}>
                                ◈ Run AI Analysis
                              </button>
                            )}
                            {isAnalyzing && (
                              <div style={{textAlign:"center",padding:"16px 0"}}>
                                <div className="spinner" />
                                <div style={{fontSize:13,color:"var(--text3)"}}>Analyzing mineral sample...</div>
                                <div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>This may take a moment</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Results */}
                    {analysisResult && (
                      <div className="card">
                        <div className="card-header">
                          <div className="card-title">◈ Identification Results</div>
                          <span className="badge badge-green">Analysis Complete</span>
                        </div>
                        <div className="card-body">
                          <div style={{fontSize:12,color:"var(--text3)",marginBottom:12}}>Top matches ranked by confidence</div>
                          {analysisResult.map(r => (
                            <div key={r.name} className={`result-box${selectedResult?.name===r.name?" selected":""}`} onClick={()=>setSelectedResult(r)}>
                              <div className="result-img" style={{background:`${r.color}22`}}>
                                <span style={{color:r.color,fontSize:24}}>{mineralIcons[r.name]||"◆"}</span>
                              </div>
                              <div style={{flex:1}}>
                                <div className="result-name" style={{fontSize:15}}>{r.name}</div>
                                <div className="result-conf" style={{color:confColor(r.confidence)}}>{r.confidence}% confidence</div>
                                <div className="confidence-bar" style={{height:4,marginTop:6}}>
                                  <div className="conf-fill" style={{width:`${r.confidence}%`,background:confColor(r.confidence)}} />
                                </div>
                              </div>
                              {selectedResult?.name===r.name && <span style={{fontSize:16,color:"var(--gold2)"}}>✓</span>}
                            </div>
                          ))}
                          <div style={{display:"flex",gap:8,marginTop:12}}>
                            <button className="btn-secondary" style={{flex:1,justifyContent:"center",fontSize:12}} onClick={()=>showToast("Result saved to history")}>↓ Save Result</button>
                            <button className="btn-secondary" style={{flex:1,justifyContent:"center",fontSize:12}} onClick={()=>showToast("Copied to clipboard")}>⊡ Copy</button>
                            <button className="btn-primary" style={{flex:1,justifyContent:"center",fontSize:12}} onClick={()=>showToast("Report generated")}>↗ Report</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Properties + Tips */}
                  <div style={{display:"flex",flexDirection:"column",gap:16}}>
                    <div className="card">
                      <div className="card-header">
                        <div className="card-title">◧ Mineral Properties</div>
                        {selectedMineral && <button className="btn-secondary" style={{fontSize:11,padding:"5px 11px"}} onClick={()=>showToast("Properties exported")}>↓ Export</button>}
                      </div>
                      <div className="card-body" style={{padding:"14px 20px"}}>
                        {selectedMineral ? (
                          <>
                            <div style={{display:"flex",alignItems:"center",gap:10,padding:12,background:"rgba(184,134,11,0.07)",borderRadius:10,marginBottom:14,border:"1px solid rgba(184,134,11,0.15)"}}>
                              <div style={{width:48,height:48,borderRadius:10,background:`${mineralColors[selectedMineral.name]||"#9a7a3a"}22`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>
                                {mineralIcons[selectedMineral.name]||"◆"}
                              </div>
                              <div>
                                <div style={{fontSize:17,fontWeight:600,color:"var(--stone)",fontFamily:"DM Serif Display,serif"}}>{selectedMineral.name}</div>
                                <div style={{fontSize:12,color:"var(--text3)"}}>{selectedMineral.formula}</div>
                              </div>
                            </div>
                            {[["Mohs Hardness",selectedMineral.hardness],["Crystal System",selectedMineral.crystal_system],["Luster",selectedMineral.luster],["Streak",selectedMineral.streak],["Specific Gravity",selectedMineral.gravity],["Cleavage","See classification"],["Localities",selectedMineral.localities]].map(([k,v])=>(
                              <div className="prop-row" key={k}>
                                <div className="prop-key">{k}</div>
                                <div className="prop-val">{v}</div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="empty">
                            <div className="empty-icon">◧</div>
                            <div className="empty-text">Awaiting identification</div>
                            <div className="empty-sub">Upload and analyze an image to see mineral properties</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-header"><div className="card-title">💡 Photo Tips</div></div>
                      <div className="card-body" style={{padding:"14px 20px"}}>
                        {[["Good lighting","Use natural light or a bright lamp — avoid flash glare"],["Show texture","Capture the surface texture and crystal structure clearly"],["Multiple angles","Take 2–3 photos from different angles if possible"],["Include scale","Place a coin or ruler beside the sample for scale"],["Clean the sample","Remove dirt or debris before photographing"]].map(([t,d])=>(
                          <div key={t} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                            <span style={{color:"var(--green)",flexShrink:0}}>✓</span>
                            <div>
                              <div style={{fontSize:12,fontWeight:600,color:"var(--stone)"}}>{t}</div>
                              <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{d}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ===== MAP PAGE ===== */}
            {page === "map" && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">State Mineral Map</div>
                    <div className="page-sub">Click any Nigerian state to explore its mineral deposits</div>
                  </div>
                  <div className="btn-row">
                    <button className="btn-secondary" onClick={()=>setSelectedState(null)}>✕ Clear Selection</button>
                    <button className="btn-primary" onClick={()=>showToast("Map exported as PNG")}>↓ Export Map</button>
                  </div>
                </div>
                <div className="map-layout">
                  <div className="card" style={{overflow:"visible"}}>
                    <div className="card-header">
                      <div className="card-title">⊕ Nigeria — Mineral Distribution</div>
                      <span className="badge badge-gold">{mineralDB.state_distributions.length} states mapped</span>
                    </div>
                    <div style={{padding:16}}>
                      <svg viewBox="0 50 580 490" className="nigeria-map" style={{width:"100%"}}>
                        {nigerianStates.map(state => {
                          const hasMinerals = stateHasMinerals(state.name);
                          const count = getMineralCount(state.name);
                          const fill = getStateColor(state.name);
                          const isSelected = selectedState === state.name;
                          const textLen = state.name.length;
                          const fontSize = textLen > 8 ? 7 : textLen > 6 ? 8 : 9;
                          return (
                            <g key={state.id} onClick={()=>hasMinerals && setSelectedState(state.name)} style={{cursor:hasMinerals?"pointer":"default"}}>
                              <rect
                                x={state.x} y={state.y} width={state.w} height={state.h}
                                rx={4}
                                fill={isSelected ? "#B8860B" : fill}
                                stroke={isSelected ? "#D4A017" : "#FAF7F0"}
                                strokeWidth={isSelected ? 3 : 1.5}
                                opacity={hasMinerals ? 1 : 0.7}
                              />
                              <text
                                x={state.x + state.w/2} y={state.y + state.h/2 - (hasMinerals&&count>0?5:0)}
                                textAnchor="middle" dominantBaseline="middle"
                                fontSize={fontSize} fill={isSelected?"#FAF7F0":"rgba(44,36,22,0.85)"} fontWeight="600"
                                style={{pointerEvents:"none",userSelect:"none"}}
                              >{state.name}</text>
                              {hasMinerals && count > 0 && (
                                <text
                                  x={state.x + state.w/2} y={state.y + state.h/2 + 8}
                                  textAnchor="middle" dominantBaseline="middle"
                                  fontSize={7} fill={isSelected?"rgba(250,247,240,0.75)":"rgba(44,36,22,0.55)"}
                                  style={{pointerEvents:"none",userSelect:"none"}}
                                >{count} mineral{count!==1?"s":""}</text>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                    <div className="map-legend">
                      {[["#d4c8a0","No data"],["#b8a870","1–2 minerals"],["#9a7a3a","3–5 minerals"],["#7a5a1a","6+ minerals"],["#B8860B","Selected"]].map(([c,l])=>(
                        <div className="legend-item" key={l}>
                          <div className="legend-dot" style={{background:c,border:"1px solid rgba(0,0,0,0.1)"}} />
                          {l}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* State detail panel */}
                  <div style={{display:"flex",flexDirection:"column",gap:16}}>
                    <div className="card">
                      <div className="card-header">
                        <div className="card-title">{selectedState ? `⊕ ${selectedState} State` : "⊕ State Details"}</div>
                        {selectedStateData && <span className="badge badge-gold">{selectedStateData.mineral_list.length} minerals</span>}
                      </div>
                      <div className="card-body">
                        {!selectedState ? (
                          <div className="empty">
                            <div className="empty-icon">⊕</div>
                            <div className="empty-text">Select a state</div>
                            <div className="empty-sub">Click any highlighted state on the map to view its mineral deposits</div>
                          </div>
                        ) : !selectedStateData ? (
                          <div className="empty">
                            <div className="empty-icon">○</div>
                            <div className="empty-text">No data for {selectedState}</div>
                            <div className="empty-sub">Mineral survey data not yet available for this state</div>
                          </div>
                        ) : (
                          <>
                            <div style={{marginBottom:14}}>
                              <div style={{fontSize:12,color:"var(--text3)",marginBottom:8}}>Known mineral deposits:</div>
                              {selectedStateData.mineral_list.map(mn => {
                                const md = mineralDB.minerals.find(m=>m.name===mn);
                                return (
                                  <div key={mn} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid var(--border)",cursor:"pointer"}}
                                    onClick={()=>setModal({name:mn,sub:md?.crystal_system||"",conf:100,state:selectedState})}>
                                    <div style={{width:28,height:28,borderRadius:6,background:`${mineralColors[mn]||"#9a7a3a"}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:mineralColors[mn]||"var(--accent)"}}>
                                      {mineralIcons[mn]||"◆"}
                                    </div>
                                    <div>
                                      <div style={{fontSize:13,fontWeight:500,color:"var(--stone)"}}>{mn}</div>
                                      {md && <div style={{fontSize:11,color:"var(--text3)"}}>{md.formula} · {md.crystal_system}</div>}
                                    </div>
                                    <span style={{marginLeft:"auto",fontSize:11,color:"var(--accent)"}}>→</span>
                                  </div>
                                );
                              })}
                            </div>
                            <button className="btn-primary" style={{width:"100%",justifyContent:"center",fontSize:12}} onClick={()=>setPage("database")}>
                              View Full Database →
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* States list */}
                    <div className="card">
                      <div className="card-header"><div className="card-title">All Mapped States</div></div>
                      <div className="card-body" style={{padding:"10px 20px"}}>
                        {mineralDB.state_distributions.map(s=>(
                          <div key={s.state_name}
                            style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid var(--border)",cursor:"pointer",transition:"all .15s"}}
                            onClick={()=>setSelectedState(s.state_name)}
                          >
                            <div style={{width:8,height:8,borderRadius:2,background:getStateColor(s.state_name),flexShrink:0}} />
                            <div style={{fontSize:12,fontWeight:500,color:selectedState===s.state_name?"var(--gold)":"var(--stone)"}}>{s.state_name}</div>
                            <div style={{marginLeft:"auto",fontSize:11,color:"var(--text3)"}}>{s.mineral_list.length} minerals</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ===== DATABASE PAGE ===== */}
            {page === "database" && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Mineral Database</div>
                    <div className="page-sub">{mineralDB.minerals.length} minerals documented across Nigerian states</div>
                  </div>
                  <div className="btn-row">
                    <button className="btn-secondary" onClick={()=>showToast("Database exported as CSV")}>↓ Export CSV</button>
                    <button className="btn-primary" onClick={()=>showToast("Add mineral — feature coming soon")}>+ Add Mineral</button>
                  </div>
                </div>
                <div style={{display:"flex",gap:12,marginBottom:20,alignItems:"center"}}>
                  <div className="search-wrap" style={{flex:1,marginBottom:0}}>
                    <span className="search-icon">⊕</span>
                    <input className="search-input" placeholder="Search by name, crystal system, or state..." value={dbSearch} onChange={e=>setDbSearch(e.target.value)} />
                  </div>
                  <div style={{fontSize:13,color:"var(--text3)",whiteSpace:"nowrap"}}>{filteredMinerals.length} results</div>
                </div>
                <div className="db-grid">
                  {filteredMinerals.map(m => (
                    <div key={m.name} className="mineral-card" onClick={()=>setModal({name:m.name,sub:m.crystal_system,conf:100,state:m.localities})}>
                      <div className="mineral-icon-big" style={{background:`${mineralColors[m.name]||"#9a7a3a"}18`}}>
                        <span style={{color:mineralColors[m.name]||"var(--accent)",fontSize:24}}>{mineralIcons[m.name]||"◆"}</span>
                      </div>
                      <div className="mineral-name">{m.name}</div>
                      <div className="mineral-formula">{m.formula}</div>
                      <div className="mineral-props">
                        <div className="mprop">Hardness: <span>{m.hardness}</span></div>
                        <div className="mprop">Gravity: <span>{m.gravity}</span></div>
                        <div className="mprop">Luster: <span>{m.luster}</span></div>
                        <div className="mprop">System: <span>{m.crystal_system}</span></div>
                      </div>
                      <div className="mineral-locality">📍 {m.localities.split(",")[0].trim()}{m.localities.includes(",")?" +more":""}</div>
                    </div>
                  ))}
                </div>
                {filteredMinerals.length === 0 && (
                  <div className="empty">
                    <div className="empty-icon">◧</div>
                    <div className="empty-text">No minerals found</div>
                    <div className="empty-sub">Try a different search term</div>
                  </div>
                )}
              </>
            )}

            {/* ===== HISTORY PAGE ===== */}
            {page === "history" && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Identification History</div>
                    <div className="page-sub">All past mineral analyses and results</div>
                  </div>
                  <div className="btn-row">
                    <button className="btn-secondary" onClick={()=>showToast("History exported")}>↓ Export</button>
                    <button className="btn-secondary" style={{color:"var(--red)",borderColor:"rgba(139,26,26,0.25)"}} onClick={()=>showToast("History cleared")}>✕ Clear All</button>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">◷ All Identifications</div>
                    <span className="badge badge-gold">{recentIds.length} records</span>
                  </div>
                  <div className="card-body">
                    <div className="search-wrap">
                      <span className="search-icon">⊕</span>
                      <input className="search-input" placeholder="Search history..." value={recentSearch} onChange={e=>setRecentSearch(e.target.value)} />
                    </div>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead>
                        <tr style={{borderBottom:"2px solid var(--border)"}}>
                          {["Mineral","Classification","State","Confidence","Time","Action"].map(h=>(
                            <th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:11,color:"var(--text3)",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecent.map((r,i)=>(
                          <tr key={i} style={{borderBottom:"1px solid var(--border)",cursor:"pointer",transition:"background .15s"}}
                            onMouseEnter={e=>e.currentTarget.style.background="rgba(212,160,23,0.04)"}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                            onClick={()=>setModal(r)}>
                            <td style={{padding:"10px 10px"}}>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <span style={{color:mineralColors[r.name]||"var(--accent)"}}>{mineralIcons[r.name]||"◆"}</span>
                                <span style={{fontSize:13,fontWeight:500,color:"var(--stone)"}}>{r.name}</span>
                              </div>
                            </td>
                            <td style={{padding:"10px 10px",fontSize:12,color:"var(--text3)"}}>{r.sub}</td>
                            <td style={{padding:"10px 10px",fontSize:12,color:"var(--text2)"}}>{r.state}</td>
                            <td style={{padding:"10px 10px"}}>
                              <span style={{fontSize:12,fontWeight:600,color:confColor(r.conf)}}>{r.conf}%</span>
                            </td>
                            <td style={{padding:"10px 10px",fontSize:12,color:"var(--text3)"}}>{r.time}</td>
                            <td style={{padding:"10px 10px"}}>
                              <button className="btn-secondary" style={{fontSize:11,padding:"4px 10px"}} onClick={e=>{e.stopPropagation();showToast(`${r.name} details opened`)}}>View →</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ===== SETTINGS PAGE ===== */}
            {page === "settings" && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Settings</div>
                    <div className="page-sub">Configure your MineralID Nigeria preferences</div>
                  </div>
                  <button className="btn-primary" onClick={()=>showToast("Settings saved")}>✓ Save Changes</button>
                </div>
                <div className="settings-grid">
                  <div>
                    <div className="settings-nav">
                      {[["general","⊞","General"],["model","◈","AI Model"],["notifications","🔔","Notifications"],["account","◧","Account"],["about","?","About"]].map(([k,ic,lb])=>(
                        <div key={k} className={`settings-nav-item${settingsTab===k?" active":""}`} onClick={()=>setSettingsTab(k)}>
                          {ic} {lb}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="settings-panel">
                    {settingsTab === "general" && (
                      <>
                        <div className="settings-section">
                          <div className="settings-section-title">Interface</div>
                          {[["darkMode","Dark Mode","Use dark theme across the app"],["autoAnalyze","Auto-Analyze","Automatically analyze when image is uploaded"],["geoTag","Geo-Tagging","Attach location data to identifications"]].map(([k,l,s])=>(
                            <div className="settings-row" key={k}>
                              <div><div className="settings-label">{l}</div><div className="settings-sub">{s}</div></div>
                              <button className={`toggle ${toggles[k]?"on":"off"}`} onClick={()=>setToggles(t=>({...t,[k]:!t[k]}))} />
                            </div>
                          ))}
                        </div>
                        <div className="settings-section">
                          <div className="settings-section-title">Display</div>
                          <div className="settings-row">
                            <div><div className="settings-label">Default View</div><div className="settings-sub">Landing page after login</div></div>
                            <select className="settings-input" style={{width:160}}>
                              <option>Dashboard</option><option>Identify</option><option>Map</option>
                            </select>
                          </div>
                          <div className="settings-row">
                            <div><div className="settings-label">Language</div><div className="settings-sub">Interface language</div></div>
                            <select className="settings-input" style={{width:160}}>
                              <option>English</option><option>Hausa</option><option>Yoruba</option><option>Igbo</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                    {settingsTab === "model" && (
                      <>
                        <div className="settings-section">
                          <div className="settings-section-title">AI Model Configuration</div>
                          <div className="settings-row">
                            <div><div className="settings-label">Model Version</div><div className="settings-sub">Active identification model</div></div>
                            <select className="settings-input" style={{width:180}}>
                              <option>MineralNet v2.1 (Latest)</option><option>MineralNet v1.8</option>
                            </select>
                          </div>
                          <div className="settings-row">
                            <div><div className="settings-label">Confidence Threshold</div><div className="settings-sub">Minimum confidence to show result</div></div>
                            <input className="settings-input" type="number" defaultValue={70} min={0} max={100} style={{width:80}} />
                          </div>
                          <div className="settings-row">
                            <div><div className="settings-label">Max Results</div><div className="settings-sub">Number of top matches to display</div></div>
                            <select className="settings-input" style={{width:120}}>
                              <option>3</option><option>5</option><option>10</option>
                            </select>
                          </div>
                        </div>
                        <div className="settings-section">
                          <div className="settings-section-title">Model Info</div>
                          {[["Accuracy","84.2% on test set"],["Training Data","22 Nigerian minerals"],["Last Updated","March 2024"],["Backend","Python / FastAPI"]].map(([k,v])=>(
                            <div className="prop-row" key={k}><div className="prop-key">{k}</div><div className="prop-val">{v}</div></div>
                          ))}
                        </div>
                      </>
                    )}
                    {settingsTab === "notifications" && (
                      <>
                        <div className="settings-section">
                          <div className="settings-section-title">Notification Preferences</div>
                          {[["notifications","Push Notifications","Receive in-app notifications"],["cloudBackup","Cloud Backup","Auto-backup identifications"]].map(([k,l,s])=>(
                            <div className="settings-row" key={k}>
                              <div><div className="settings-label">{l}</div><div className="settings-sub">{s}</div></div>
                              <button className={`toggle ${toggles[k]?"on":"off"}`} onClick={()=>setToggles(t=>({...t,[k]:!t[k]}))} />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {settingsTab === "account" && (
                      <>
                        <div className="settings-section">
                          <div className="settings-section-title">Profile</div>
                          {[["Name","Geologist K."],["Email","geo.k@mineralid.ng"],["Organization","NGSA - Nigeria"]].map(([l,v])=>(
                            <div className="settings-row" key={l}>
                              <div><div className="settings-label">{l}</div></div>
                              <input className="settings-input" defaultValue={v} />
                            </div>
                          ))}
                        </div>
                        <button className="btn-secondary" style={{color:"var(--red)",borderColor:"rgba(139,26,26,0.25)"}} onClick={()=>showToast("Logged out")}>Sign Out</button>
                      </>
                    )}
                    {settingsTab === "about" && (
                      <div>
                        <div style={{textAlign:"center",padding:"20px 0"}}>
                          <div style={{width:64,height:64,background:"var(--stone)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 14px"}}>⛏</div>
                          <div style={{fontFamily:"DM Serif Display,serif",fontSize:22,color:"var(--stone)"}}>MineralID Nigeria</div>
                          <div style={{fontSize:13,color:"var(--text3)",marginTop:4}}>Version 2.1.0 · Built for Nigerian Geology</div>
                        </div>
                        <div style={{marginTop:20}}>
                          {[["Minerals in DB","22 species"],["States Covered","12 of 37"],["Model Accuracy","84.2%"],["Data Source","NGSA, MMSD Nigeria"]].map(([k,v])=>(
                            <div className="prop-row" key={k}><div className="prop-key">{k}</div><div className="prop-val">{v}</div></div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* MINERAL DETAIL MODAL */}
      {modal && (
        <div className="modal-bg" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{modal.name}</div>
              <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              {(() => {
                const md = mineralDB.minerals.find(m=>m.name===modal.name);
                return md ? (
                  <>
                    <div style={{display:"flex",alignItems:"center",gap:14,padding:16,background:"rgba(184,134,11,0.07)",borderRadius:12,marginBottom:20,border:"1px solid rgba(184,134,11,0.15)"}}>
                      <div style={{width:56,height:56,borderRadius:12,background:`${mineralColors[md.name]||"#9a7a3a"}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>
                        {mineralIcons[md.name]||"◆"}
                      </div>
                      <div>
                        <div style={{fontSize:20,fontWeight:600,color:"var(--stone)",fontFamily:"DM Serif Display,serif"}}>{md.name}</div>
                        <div style={{fontSize:13,color:"var(--text3)"}}>{md.formula}</div>
                        <div style={{marginTop:6}}>
                          {md.localities.split(",").map(l=><span key={l} className="tag">{l.trim()}</span>)}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                      {[["Mohs Hardness",md.hardness],["Crystal System",md.crystal_system],["Luster",md.luster],["Streak",md.streak],["Specific Gravity",md.gravity],["Formula",md.formula]].map(([k,v])=>(
                        <div key={k} style={{background:"rgba(240,234,214,0.6)",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:3}}>{k}</div>
                          <div style={{fontSize:13,fontWeight:600,color:"var(--stone)"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="btn-primary" style={{flex:1,justifyContent:"center"}} onClick={()=>{showToast(`${md.name} saved to collection`);setModal(null)}}>+ Save to Collection</button>
                      <button className="btn-secondary" style={{flex:1,justifyContent:"center"}} onClick={()=>{setPage("map");setSelectedState(md.localities.split(",")[0].trim().split(" ")[0]);setModal(null)}}>View on Map →</button>
                    </div>
                  </>
                ) : (
                  <div className="empty"><div className="empty-icon">◧</div><div className="empty-text">No data available</div></div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast"><span>{toast.icon}</span>{toast.msg}</div>}
    </>
  );
}
