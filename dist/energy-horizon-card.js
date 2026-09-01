const EH_VERSION = "0.1.2";

const EH_I18N = {
  en: {
    day:"Day", month:"Month", year:"Year", solar:"Solar", consumption:"Consumption", grid:"Grid",
    loading:"Loading history…", noHistory:"Select long-term solar and consumption energy counters in the editor.",
    stable:"Stable", noBattery:"No battery configured", fullIn:"Full charge in", remaining:"remaining",
    endurance:"Endurance", until:"until", discharge:"discharge", usable:"usable", stableEndurance:"Stable endurance",
    covered:"production currently covers demand", setup:"Energy Horizon setup", language:"Language", automatic:"Automatic (Home Assistant)",
    cardTitle:"Card title", livePower:"Live power", solarPower:"Solar power (W)", homePower:"Real home consumption (W)",
    gridPower:"Signed grid power (optional)", energyHistory:"Energy and long-term history",
    historyHint:"Choose total-increasing energy counters for persistent Month and Year statistics.", dailySolar:"Daily solar energy (optional)",
    totalSolar:"Total solar energy", totalConsumption:"Total consumption energy", refresh:"Refresh interval (seconds)",
    battery:"Battery", name:"Name", socEntity:"SoC entity", batteryPower:"Signed battery power", capacity:"Capacity (kWh)", reserve:"Reserve (%)",
    calculateSoc:"Calculate user SoC after reserve", negativeSoc:"Allow negative user SoC", positiveMeans:"Positive power means",
    charging:"Charging", discharging:"Discharging", removeBattery:"Remove battery", addBattery:"Add battery"
  },
  fr: {
    day:"Jour", month:"Mois", year:"Année", solar:"Solaire", consumption:"Consommation", grid:"Réseau",
    loading:"Chargement de l’historique…", noHistory:"Sélectionnez les compteurs d’énergie solaire et de consommation dans l’éditeur.",
    stable:"Stable", noBattery:"Aucune batterie configurée", fullIn:"Charge complète dans", remaining:"restants",
    endurance:"Autonomie", until:"jusqu’à", discharge:"décharge", usable:"utilisables", stableEndurance:"Autonomie stable",
    covered:"la production couvre actuellement la demande", setup:"Configuration d’Energy Horizon", language:"Langue", automatic:"Automatique (Home Assistant)",
    cardTitle:"Titre de la carte", livePower:"Puissance instantanée", solarPower:"Puissance solaire (W)", homePower:"Consommation réelle de la maison (W)",
    gridPower:"Puissance réseau signée (facultatif)", energyHistory:"Énergie et historique à long terme",
    historyHint:"Choisissez des compteurs d’énergie croissants pour conserver les statistiques mensuelles et annuelles.", dailySolar:"Énergie solaire du jour (facultatif)",
    totalSolar:"Énergie solaire totale", totalConsumption:"Consommation totale", refresh:"Intervalle d’actualisation (secondes)",
    battery:"Batterie", name:"Nom", socEntity:"Entité SoC", batteryPower:"Puissance signée de la batterie", capacity:"Capacité (kWh)", reserve:"Réserve (%)",
    calculateSoc:"Calculer le SoC utilisateur après réserve", negativeSoc:"Autoriser un SoC utilisateur négatif", positiveMeans:"Une puissance positive signifie",
    charging:"Charge", discharging:"Décharge", removeBattery:"Supprimer la batterie", addBattery:"Ajouter une batterie"
  },
  nl: {
    day:"Dag", month:"Maand", year:"Jaar", solar:"Zonne-energie", consumption:"Verbruik", grid:"Net",
    loading:"Geschiedenis laden…", noHistory:"Selecteer in de editor de totale tellers voor zonne-energie en verbruik.",
    stable:"Stabiel", noBattery:"Geen batterij geconfigureerd", fullIn:"Volledig opgeladen over", remaining:"resterend",
    endurance:"Autonomie", until:"tot", discharge:"ontlading", usable:"bruikbaar", stableEndurance:"Stabiele autonomie",
    covered:"de productie dekt momenteel het verbruik", setup:"Energy Horizon instellen", language:"Taal", automatic:"Automatisch (Home Assistant)",
    cardTitle:"Kaarttitel", livePower:"Actueel vermogen", solarPower:"Zonnevermogen (W)", homePower:"Werkelijk woningverbruik (W)",
    gridPower:"Netvermogen met teken (optioneel)", energyHistory:"Energie en langetermijngeschiedenis",
    historyHint:"Kies oplopende energietellers voor blijvende maand- en jaarstatistieken.", dailySolar:"Zonne-energie vandaag (optioneel)",
    totalSolar:"Totale zonne-energie", totalConsumption:"Totaal verbruik", refresh:"Vernieuwingsinterval (seconden)",
    battery:"Batterij", name:"Naam", socEntity:"SoC-entiteit", batteryPower:"Batterijvermogen met teken", capacity:"Capaciteit (kWh)", reserve:"Reserve (%)",
    calculateSoc:"Gebruikers-SoC na reserve berekenen", negativeSoc:"Negatieve gebruikers-SoC toestaan", positiveMeans:"Positief vermogen betekent",
    charging:"Opladen", discharging:"Ontladen", removeBattery:"Batterij verwijderen", addBattery:"Batterij toevoegen"
  }
};
const languageCode = (config, hass) => {
  const requested = config?.language;
  if (requested && requested !== "auto" && EH_I18N[requested]) return requested;
  const detected = String(hass?.locale?.language || hass?.language || navigator.language || "en").toLowerCase().split("-")[0];
  return EH_I18N[detected] ? detected : "en";
};
const localeCode = language => ({ en:"en-GB", fr:"fr-BE", nl:"nl-BE" }[language] || "en-GB");

const clone = value => JSON.parse(JSON.stringify(value));
const number = (hass, entity, fallback = 0) => {
  const value = Number(hass?.states?.[entity]?.state);
  return Number.isFinite(value) ? value : fallback;
};
const userSoc = (raw, battery) => {
  if (!battery.calculate_user_soc) return raw;
  const reserve = Number(battery.reserve_percent || 0);
  const calculated = (raw - reserve) / Math.max(1, 100 - reserve) * 100;
  return battery.allow_negative_soc ? calculated : Math.max(0, calculated);
};
const batteryFlow = (hass, battery) => {
  const raw = number(hass, battery.soc_entity);
  const soc = userSoc(raw, battery);
  const signed = number(hass, battery.power_entity);
  const charge = battery.power_positive === "discharge" ? Math.max(0, -signed) : Math.max(0, signed);
  const discharge = battery.power_positive === "discharge" ? Math.max(0, signed) : Math.max(0, -signed);
  const nominal = Math.max(0, Number(battery.capacity_kwh || 0));
  const usable = nominal * (100 - Number(battery.reserve_percent || 0)) / 100;
  return { raw, soc, charge, discharge, usable };
};

class EnergyHorizonCard extends HTMLElement {
  static getStubConfig() {
    return {
      title: "Energy Horizon",
      language: "auto",
      solar_power: "",
      solar_energy_today: "",
      solar_energy_total: "",
      consumption_power: "",
      consumption_energy_total: "",
      grid_power: "",
      refresh_interval: 15,
      batteries: [{
        name: "Battery 1", soc_entity: "", power_entity: "",
        capacity_kwh: 10, reserve_percent: 10,
        calculate_user_soc: true, allow_negative_soc: true,
        power_positive: "charge"
      }]
    };
  }
  static async getConfigElement() { return document.createElement("energy-horizon-card-editor"); }
  setConfig(config) {
    this.config = { ...EnergyHorizonCard.getStubConfig(), ...clone(config), batteries: clone(config.batteries || []) };
    this.samples = this.samples || [];
    this.period = this.period || "day";
    this.anchor = this.anchor || this.today();
    this.restartTimer();
    this.render();
    this.queueHistory();
  }
  set hass(hass) {
    this._hass = hass;
    if (!this.rendered) { this.render(); this.queueHistory(); }
  }
  connectedCallback() { this.restartTimer(); this.render(); }
  disconnectedCallback() { clearInterval(this.timer); clearTimeout(this.historyTimer); }
  restartTimer() {
    clearInterval(this.timer);
    const seconds = Math.max(5, Number(this.config?.refresh_interval || 15));
    this.timer = setInterval(() => { this.capture(); this.render(); if(this.period==="day"&&this.anchor===this.today()&&Date.now()-(this.lastHistoryLoad||0)>300000)this.queueHistory(); }, seconds * 1000);
  }
  today() { return new Date().toLocaleDateString("sv-SE", { timeZone: this._hass?.config?.time_zone || undefined }); }
  queueHistory() { clearTimeout(this.historyTimer); this.historyTimer=setTimeout(()=>this.loadHistory(),50); }
  range() {
    const date=new Date(`${this.anchor}T00:00:00`),start=new Date(date),end=new Date(date);
    if(this.period==="day")end.setDate(end.getDate()+1);
    if(this.period==="month"){start.setDate(1);end.setDate(1);end.setMonth(end.getMonth()+1)}
    if(this.period==="year"){start.setMonth(0,1);end.setMonth(0,1);end.setFullYear(end.getFullYear()+1)}
    return {start,end};
  }
  shift(direction) {
    const date=new Date(`${this.anchor}T12:00:00`);
    if(this.period==="day")date.setDate(date.getDate()+direction);
    if(this.period==="month")date.setMonth(date.getMonth()+direction);
    if(this.period==="year")date.setFullYear(date.getFullYear()+direction);
    const next=date.toLocaleDateString("sv-SE");if(next<=this.today()){this.anchor=next;this.queueHistory();this.render()}
  }
  async loadHistory() {
    if(!this._hass||!this.config||this.historyLoading)return;
    this.historyLoading=true;
    try {
      const {start,end}=this.range();
      if(this.period==="day"){
        const ids=[this.config.solar_power,this.config.consumption_power].filter(Boolean);
        const result=await this._hass.callWS({type:"history/history_during_period",start_time:start.toISOString(),end_time:end.toISOString(),entity_ids:ids,minimal_response:true,no_attributes:true,significant_changes_only:false});
        const buckets=new Map();
        ids.forEach((id,entityIndex)=>(result[id]||[]).forEach(row=>{
          const timestamp=(row.lu||row.last_updated||row.last_changed);const millis=typeof timestamp==="number"?timestamp*1000:Date.parse(timestamp);if(!Number.isFinite(millis))return;
          const minute=Math.floor(millis/60000)*60000,value=Number(row.s??row.state);if(!Number.isFinite(value))return;
          const bucket=buckets.get(minute)||{at:minute,solarValues:[],loadValues:[]};(entityIndex===0?bucket.solarValues:bucket.loadValues).push(value);buckets.set(minute,bucket)
        }));
        let previousSolar=0,previousLoad=0;
        this.samples=[...buckets.values()].sort((a,b)=>a.at-b.at).map(bucket=>{if(bucket.solarValues.length)previousSolar=Math.max(...bucket.solarValues);if(bucket.loadValues.length)previousLoad=bucket.loadValues.reduce((a,b)=>a+b,0)/bucket.loadValues.length;return {at:bucket.at,solar:previousSolar,load:previousLoad}});
      } else {
        const ids=[this.config.solar_energy_total,this.config.consumption_energy_total].filter(Boolean);
        if(ids.length){
          const period=this.period==="month"?"day":"month";
          const stats=await this._hass.callWS({type:"recorder/statistics_during_period",start_time:start.toISOString(),end_time:end.toISOString(),statistic_ids:ids,period,types:["change"]});
          const length=this.period==="month"?new Date(start.getFullYear(),start.getMonth()+1,0).getDate():12;
          this.periodData={solar:Array(length).fill(0),load:Array(length).fill(0)};
          ids.forEach((id,entityIndex)=>(stats[id]||[]).forEach(row=>{const moment=new Date(row.start),index=this.period==="month"?moment.getDate()-1:moment.getMonth();if(index>=0&&index<length)this.periodData[entityIndex===0?"solar":"load"][index]=Number(row.change||0)}));
        } else this.periodData=null;
      }
      this.historyError=null;this.lastHistoryLoad=Date.now();
    } catch(error){this.historyError=String(error)}
    this.historyLoading=false;this.render();
  }
  capture() {
    if (!this._hass || !this.config) return;
    this.samples.push({
      at: Date.now(),
      solar: number(this._hass, this.config.solar_power),
      load: number(this._hass, this.config.consumption_power)
    });
    if (this.samples.length > 2000) this.samples.splice(0, this.samples.length - 2000);
  }
  formatDuration(hours) {
    if (!Number.isFinite(hours) || hours <= 0) return "—";
    const days = Math.floor(hours / 24), h = Math.floor(hours % 24), minutes = Math.round(hours % 1 * 60);
    return `${days ? `${days} d ` : ""}${h} h${!days && minutes ? ` ${minutes} min` : ""}`;
  }
  target(hours) {
    return new Intl.DateTimeFormat(localeCode(this.lang), { weekday: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(Date.now() + hours * 3600000));
  }
  forecast(flows) {
    const stored = flows.reduce((sum, flow) => sum + Math.max(0, flow.soc) / 100 * flow.usable, 0);
    const missing = flows.reduce((sum, flow) => sum + Math.max(0, 100 - flow.soc) / 100 * flow.usable, 0);
    const charge = flows.reduce((sum, flow) => sum + flow.charge, 0);
    const discharge = flows.reduce((sum, flow) => sum + flow.discharge, 0);
    const net = charge - discharge;
    if (net > 50 && missing > 0) {
      const hours = missing / (net / 1000);
      return { icon: "mdi:battery-clock-outline", text: `${this.t.fullIn} ${this.formatDuration(hours)} · ${this.target(hours)}`, sub: `${Math.round(net)} W net · ${missing.toFixed(1)} kWh ${this.t.remaining}` };
    }
    if (discharge > 20 && stored > 0) {
      const hours = stored / (discharge / 1000);
      return { icon: "mdi:battery-clock", text: `${this.t.endurance} ${this.formatDuration(hours)} · ${this.t.until} ${this.target(hours)}`, sub: `${Math.round(discharge)} W ${this.t.discharge} · ${stored.toFixed(1)} kWh ${this.t.usable}` };
    }
    return { icon: "mdi:battery-infinity", text: this.t.stableEndurance, sub: `${stored.toFixed(1)} kWh ${this.t.usable} · ${this.t.covered}` };
  }
  formattedAnchor() {
    const date=new Date(`${this.anchor}T12:00:00`);
    if(this.period==="year")return String(date.getFullYear());
    if(this.period==="month")return new Intl.DateTimeFormat(localeCode(this.lang),{month:"long",year:"numeric"}).format(date);
    return new Intl.DateTimeFormat(localeCode(this.lang),{day:"2-digit",month:"2-digit",year:"numeric"}).format(date);
  }
  periodChart() {
    const data=this.periodData;if(!data)return `<div class="empty">${this.t.noHistory}</div>`;
    const length=data.solar.length,w=900,h=300,left=55,bottom=255,top=18,bucket=(w-left-15)/length,max=Math.max(1,...data.solar,...data.load),bar=bucket*.34;
    const bars=(series,color,offset)=>series.map((value,index)=>{const height=value/max*(bottom-top),x=left+index*bucket+bucket*.15+offset;return `<rect x="${x}" y="${bottom-height}" width="${Math.max(2,bar-1)}" height="${height}" rx="2" fill="${color}"><title>${value.toFixed(2)} kWh</title></rect>`}).join("");
    const labels=Array.from({length},(_,index)=>this.period==="month"?index+1:new Intl.DateTimeFormat(localeCode(this.lang),{month:"short"}).format(new Date(2026,index,1)));
    return `<svg viewBox="0 0 ${w} ${h}" role="img">${[0,.25,.5,.75,1].map(part=>{const y=bottom-part*(bottom-top);return `<line x1="${left}" y1="${y}" x2="${w-15}" y2="${y}" stroke="var(--divider-color)"/><text x="2" y="${y+5}" fill="var(--secondary-text-color)" font-size="13">${(max*part).toFixed(1)}</text>`}).join("")}${bars(data.solar,"#f5b000",0)}${bars(data.load,"#08abc8",bar)}${labels.map((label,index)=>(this.period==="year"||index%3===0)?`<text x="${left+(index+.5)*bucket}" y="280" text-anchor="middle" fill="var(--secondary-text-color)" font-size="13">${label}</text>`:"").join("")}</svg>`;
  }
  chart(solar, load) {
    if(this.period!=="day")return this.periodChart();
    const samples = this.samples.length ? this.samples : [{ at: Date.now(), solar, load }];
    const w = 900, h = 280, left = 52, bottom = 235, top = 18;
    const max = Math.max(1, ...samples.flatMap(sample => [sample.solar, sample.load])) / 1000;
    const x = index => left + index / Math.max(1, samples.length - 1) * (w - left - 18);
    const y = value => bottom - value / 1000 / max * (bottom - top);
    const area = (key, color) => {
      const line = samples.map((sample, index) => `${index ? "L" : "M"} ${x(index)} ${y(sample[key])}`).join(" ");
      return `<path d="${line} L ${x(samples.length - 1)} ${bottom} L ${x(0)} ${bottom} Z" fill="${color}" fill-opacity=".35" stroke="${color}" stroke-width="4"/>`;
    };
    return `<svg viewBox="0 0 ${w} ${h}" role="img">${[0,.25,.5,.75,1].map(part => { const yy=bottom-part*(bottom-top); return `<line x1="${left}" y1="${yy}" x2="${w-18}" y2="${yy}" stroke="var(--divider-color)"/><text x="2" y="${yy+5}" fill="var(--secondary-text-color)" font-size="14">${(max*part).toFixed(1)}</text>` }).join("")}${area("load", "#08abc8")}${area("solar", "#f5b000")}</svg>`;
  }
  render() {
    if (!this.config || !this._hass || !this.isConnected) return;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this.rendered = true;
    this.lang = languageCode(this.config, this._hass); this.t = EH_I18N[this.lang];
    const solar = number(this._hass, this.config.solar_power), load = number(this._hass, this.config.consumption_power);
    const solarEnergy = this.config.solar_energy_today ? number(this._hass, this.config.solar_energy_today) : null;
    const grid = this.config.grid_power ? number(this._hass, this.config.grid_power) : null;
    const flows = (this.config.batteries || []).filter(item => item.soc_entity && item.power_entity).map(item => ({ ...batteryFlow(this._hass, item), config: item }));
    const forecast = this.forecast(flows);
    const batteries = flows.map(flow => `<div class="battery"><div class="soc" style="--soc:${Math.max(0,Math.min(100,flow.soc))}"><span><b>${flow.soc.toFixed(1)}%</b><small>${flow.config.name}</small></span></div><div>${flow.charge ? `▲ ${Math.round(flow.charge)} W` : flow.discharge ? `▼ ${Math.round(flow.discharge)} W` : this.t.stable}</div></div>`).join("");
    this.shadowRoot.innerHTML = `<style>:host{display:block}ha-card{padding:16px;border-radius:20px}.head{display:flex;justify-content:space-between;align-items:center}.head h2{margin:0}.periods,.nav{display:flex;justify-content:center;align-items:center;gap:8px;margin:12px 0}.periods button,.nav button{border:0;border-radius:18px;padding:8px 14px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}.periods button.on{background:var(--primary-color);color:white}.nav b{min-width:180px;text-align:center}.live{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0}.metric{padding:12px;border-radius:12px;background:var(--secondary-background-color);text-align:center}.metric b{display:block;font-size:22px}.solar b{color:#f5b000}.load b{color:#08abc8}.grid b{color:#8e6ac8}svg{display:block;width:100%;height:auto}.empty{padding:60px 20px;text-align:center;color:var(--secondary-text-color)}.forecast{display:flex;justify-content:center;align-items:center;gap:10px;border-block:1px solid var(--divider-color);padding:9px;margin:6px 0 16px;text-align:center}.forecast small,.soc small{display:block;color:var(--secondary-text-color)}.batteries{display:flex;justify-content:center;gap:24px;flex-wrap:wrap}.battery{text-align:center}.soc{--soc:0;width:130px;height:130px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#4bb49f calc(var(--soc)*1%),var(--divider-color) 0)}.soc span{width:108px;height:108px;border-radius:50%;background:var(--card-background-color);display:grid;place-content:center}.soc b{font-size:24px}@media(max-width:600px){ha-card{padding:10px}.live{gap:5px}.metric{padding:8px 4px}.metric b{font-size:17px}.soc{width:110px;height:110px}.soc span{width:92px;height:92px}}</style><ha-card><div class="head"><h2>${this.config.title || "Energy Horizon"}</h2><small>v${EH_VERSION}</small></div><div class="periods">${[["day",this.t.day],["month",this.t.month],["year",this.t.year]].map(([period,label])=>`<button data-period="${period}" class="${this.period===period?"on":""}">${label}</button>`).join("")}</div><div class="nav"><button id="previous">‹</button><b>${this.formattedAnchor()}</b><button id="next">›</button></div><div class="live"><div class="metric solar"><b>${(solar/1000).toFixed(2)} kW</b>${this.t.solar}${solarEnergy===null?"":` · ${solarEnergy.toFixed(1)} kWh`}</div><div class="metric load"><b>${(load/1000).toFixed(2)} kW</b>${this.t.consumption}</div><div class="metric grid"><b>${grid===null?"—":`${(grid/1000).toFixed(2)} kW`}</b>${this.t.grid}</div></div>${this.historyLoading?`<div class="empty">${this.t.loading}</div>`:this.chart(solar,load)}<div class="forecast"><ha-icon icon="${forecast.icon}"></ha-icon><span><b>${forecast.text}</b><small>${forecast.sub}</small></span></div><div class="batteries">${batteries || this.t.noBattery}</div></ha-card>`;
    this.shadowRoot.querySelectorAll("[data-period]").forEach(button=>button.onclick=()=>{this.period=button.dataset.period;this.periodData=null;this.queueHistory();this.render()});
    this.shadowRoot.getElementById("previous").onclick=()=>this.shift(-1);
    this.shadowRoot.getElementById("next").onclick=()=>this.shift(1);
  }
  getCardSize() { return 8; }
}

class EnergyHorizonCardEditor extends HTMLElement {
  connectedCallback() { this.render(); }
  setConfig(config) { this.config = { ...EnergyHorizonCard.getStubConfig(), ...clone(config), batteries: clone(config.batteries || []) }; this.render(); }
  set hass(hass) { this._hass = hass; this.render(); }
  fire() { this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: clone(this.config) }, bubbles: true, composed: true })); }
  updateRoot(key, value) { this.config[key] = value; this.fire(); }
  updateBattery(index, key, value) { this.config.batteries[index][key] = value; this.fire(); }
  picker(label, key, value, batteryIndex = null) { return `<label><span>${label}</span><ha-entity-picker data-key="${key}" ${batteryIndex===null?"":`data-battery="${batteryIndex}"`} value="${value || ""}" allow-custom-entity></ha-entity-picker></label>`; }
  render() {
    if (!this.config || !this._hass || !this.isConnected) return;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const lang = languageCode(this.config, this._hass), t = EH_I18N[lang];
    const batteryBlocks = this.config.batteries.map((battery,index)=>`<section><h3>${t.battery} ${index+1}</h3><label><span>${t.name}</span><input data-battery="${index}" data-key="name" value="${battery.name||""}"></label>${this.picker(t.socEntity,"soc_entity",battery.soc_entity,index)}${this.picker(t.batteryPower,"power_entity",battery.power_entity,index)}<div class="row"><label><span>${t.capacity}</span><input type="number" step="0.1" data-battery="${index}" data-key="capacity_kwh" value="${battery.capacity_kwh||0}"></label><label><span>${t.reserve}</span><input type="number" step="0.1" data-battery="${index}" data-key="reserve_percent" value="${battery.reserve_percent||0}"></label></div><label class="check"><input type="checkbox" data-battery="${index}" data-key="calculate_user_soc" ${battery.calculate_user_soc?"checked":""}> ${t.calculateSoc}</label><label class="check"><input type="checkbox" data-battery="${index}" data-key="allow_negative_soc" ${battery.allow_negative_soc?"checked":""}> ${t.negativeSoc}</label><label><span>${t.positiveMeans}</span><select data-battery="${index}" data-key="power_positive"><option value="charge" ${battery.power_positive!=="discharge"?"selected":""}>${t.charging}</option><option value="discharge" ${battery.power_positive==="discharge"?"selected":""}>${t.discharging}</option></select></label><button data-remove="${index}">${t.removeBattery}</button></section>`).join("");
    this.shadowRoot.innerHTML=`<style>:host{display:block}.wizard{display:grid;gap:14px;padding:8px}h2,h3{margin:8px 0}section{border:1px solid var(--divider-color);border-radius:12px;padding:12px;display:grid;gap:10px}label{display:grid;gap:5px}label>span,.hint{font-size:12px;color:var(--secondary-text-color)}input,select,button{box-sizing:border-box;width:100%;padding:10px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color)}.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.check{display:flex;align-items:center;gap:8px}.check input{width:auto}button{cursor:pointer;color:var(--primary-color)}</style><div class="wizard"><h2>${t.setup}</h2><label><span>${t.language}</span><select data-key="language"><option value="auto" ${this.config.language==="auto"||!this.config.language?"selected":""}>${t.automatic}</option><option value="en" ${this.config.language==="en"?"selected":""}>English</option><option value="fr" ${this.config.language==="fr"?"selected":""}>Français</option><option value="nl" ${this.config.language==="nl"?"selected":""}>Nederlands</option></select></label><label><span>${t.cardTitle}</span><input data-key="title" value="${this.config.title||""}"></label><section><h3>${t.livePower}</h3>${this.picker(t.solarPower,"solar_power",this.config.solar_power)}${this.picker(t.homePower,"consumption_power",this.config.consumption_power)}${this.picker(t.gridPower,"grid_power",this.config.grid_power)}</section><section><h3>${t.energyHistory}</h3><div class="hint">${t.historyHint}</div>${this.picker(t.dailySolar,"solar_energy_today",this.config.solar_energy_today)}${this.picker(t.totalSolar,"solar_energy_total",this.config.solar_energy_total)}${this.picker(t.totalConsumption,"consumption_energy_total",this.config.consumption_energy_total)}</section><label><span>${t.refresh}</span><input type="number" min="5" data-key="refresh_interval" value="${this.config.refresh_interval||15}"></label>${batteryBlocks}<button id="add" ${this.config.batteries.length>=2?"disabled":""}>${t.addBattery}</button></div>`;
    this.shadowRoot.querySelectorAll("ha-entity-picker").forEach(el=>{el.hass=this._hass;el.addEventListener("value-changed",event=>{const i=el.dataset.battery; i===undefined?this.updateRoot(el.dataset.key,event.detail.value):this.updateBattery(Number(i),el.dataset.key,event.detail.value)})});
    this.shadowRoot.querySelectorAll("input,select").forEach(el=>el.addEventListener("change",()=>{let value=el.type==="checkbox"?el.checked:el.type==="number"?Number(el.value):el.value;const i=el.dataset.battery;i===undefined?this.updateRoot(el.dataset.key,value):this.updateBattery(Number(i),el.dataset.key,value);if(el.dataset.key==="language")this.render()}));
    this.shadowRoot.querySelectorAll("[data-remove]").forEach(el=>el.onclick=()=>{this.config.batteries.splice(Number(el.dataset.remove),1);this.fire();this.render()});
    this.shadowRoot.getElementById("add").onclick=()=>{if(this.config.batteries.length<2){this.config.batteries.push(clone(EnergyHorizonCard.getStubConfig().batteries[0]));this.fire();this.render()}};
  }
}

customElements.define("energy-horizon-card", EnergyHorizonCard);
customElements.define("energy-horizon-card-editor", EnergyHorizonCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({ type: "energy-horizon-card", name: "Energy Horizon Card", description: "Vendor-neutral solar and multi-battery dashboard", preview: true });
console.info(`%c ENERGY HORIZON CARD %c v${EH_VERSION} `, "color:white;background:#1686c0;font-weight:bold", "color:#1686c0;background:white");
