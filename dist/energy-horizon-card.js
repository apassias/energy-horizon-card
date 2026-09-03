const EH_VERSION = "0.2.5";

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
    charging:"Charging", discharging:"Discharging", removeBattery:"Remove battery", addBattery:"Add battery", direct:"Direct",
    independence:"Independence", gridPurchase:"Grid purchase", selfConsumption:"Self-consumption", gridFeedIn:"Grid feed-in",
    positiveGrid:"Positive grid power means", gridImport:"Grid import", gridExport:"Grid export", totalGridImport:"Total grid import energy", totalGridExport:"Total grid export energy",
    socAtSunset:"sunset SoC", socAtSunrise:"sunrise SoC", atThisRate:"at this rate", solarCurve:"current solar curve"
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
    charging:"Charge", discharging:"Décharge", removeBattery:"Supprimer la batterie", addBattery:"Ajouter une batterie", direct:"Directe",
    independence:"Indépendance", gridPurchase:"Achat réseau", selfConsumption:"Autoconsommation", gridFeedIn:"Injection réseau",
    positiveGrid:"Une puissance réseau positive signifie", gridImport:"Import réseau", gridExport:"Export réseau", totalGridImport:"Énergie totale importée", totalGridExport:"Énergie totale injectée",
    socAtSunset:"SoC coucher", socAtSunrise:"SoC lever", atThisRate:"à cette allure", solarCurve:"courbe solaire actuelle"
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
    charging:"Opladen", discharging:"Ontladen", removeBattery:"Batterij verwijderen", addBattery:"Batterij toevoegen", direct:"Direct",
    independence:"Onafhankelijkheid", gridPurchase:"Netafname", selfConsumption:"Zelfverbruik", gridFeedIn:"Netinjectie",
    positiveGrid:"Positief netvermogen betekent", gridImport:"Netafname", gridExport:"Netinjectie", totalGridImport:"Totale netafname-energie", totalGridExport:"Totale netinjectie-energie",
    socAtSunset:"gecombineerde SoC bij zonsondergang", socAtSunrise:"gecombineerde SoC bij zonsopgang", atThisRate:"aan dit tempo", solarCurve:"huidige zonnecurve"
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
  const powerState = hass?.states?.[battery.power_entity];
  const unit = String(powerState?.attributes?.unit_of_measurement || "").toLowerCase();
  const powerScale = unit === "kw" ? 1000 : unit === "mw" ? 1000000 : 1;
  const validPower = Boolean(powerState) && (powerState.attributes?.device_class === "power" || ["w", "kw", "mw"].includes(unit));
  const signed = validPower ? number(hass, battery.power_entity) * powerScale : 0;
  const charge = battery.power_positive === "discharge" ? Math.max(0, -signed) : Math.max(0, signed);
  const discharge = battery.power_positive === "discharge" ? Math.max(0, signed) : Math.max(0, -signed);
  const nominal = Math.max(0, Number(battery.capacity_kwh || 0));
  const usable = nominal * (100 - Number(battery.reserve_percent || 0)) / 100;
  return { raw, soc, charge, discharge, usable, validPower, name: battery.name || "" };
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
      grid_positive: "import",
      grid_import_energy_total: "",
      grid_export_energy_total: "",
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
        const descriptors=[
          ["solar",this.config.solar_power],["load",this.config.consumption_power],["grid",this.config.grid_power],
          ...this.config.batteries.flatMap((battery,index)=>[[`soc${index}`,battery.soc_entity],[`power${index}`,battery.power_entity]])
        ].filter(([,id])=>id);
        const ids=[...new Set(descriptors.map(([,id])=>id))];
        const result=await this._hass.callWS({type:"history/history_during_period",start_time:start.toISOString(),end_time:end.toISOString(),entity_ids:ids,minimal_response:true,no_attributes:true,significant_changes_only:false});
        const events={};descriptors.forEach(([key,id])=>{events[key]=(result[id]||[]).map(row=>{const stamp=row.lu||row.last_updated||row.last_changed;return {at:typeof stamp==="number"?stamp*1000:Date.parse(stamp),value:Number(row.s??row.state)}}).filter(row=>Number.isFinite(row.at)&&Number.isFinite(row.value)).sort((a,b)=>a.at-b.at)});
        const cursor=Object.fromEntries(descriptors.map(([key])=>[key,0])),last=Object.fromEntries(descriptors.map(([key])=>[key,0]));
        const stop=Math.min(end.getTime(),this.anchor===this.today()?Date.now():end.getTime());this.samples=[];
        for(let at=start.getTime();at<stop;at+=60000){const sample={at};for(const [key] of descriptors){const rows=events[key];while(cursor[key]<rows.length&&rows[cursor[key]].at<=at+59999){last[key]=rows[cursor[key]].value;cursor[key]++}sample[key]=last[key]}this.samples.push(sample)}
      } else {
        const statDescriptors=[["solar",this.config.solar_energy_total],["load",this.config.consumption_energy_total],["gridImport",this.config.grid_import_energy_total],["gridExport",this.config.grid_export_energy_total]].filter(([,id])=>id);
        const ids=[...new Set(statDescriptors.map(([,id])=>id))];
        if(ids.length){
          const period=this.period==="month"?"day":"month";
          const stats=await this._hass.callWS({type:"recorder/statistics_during_period",start_time:start.toISOString(),end_time:end.toISOString(),statistic_ids:ids,period,types:["change"]});
          const length=this.period==="month"?new Date(start.getFullYear(),start.getMonth()+1,0).getDate():12;
          this.periodData={solar:Array(length).fill(0),load:Array(length).fill(0),gridImport:Array(length).fill(0),gridExport:Array(length).fill(0)};
          statDescriptors.forEach(([key,id])=>(stats[id]||[]).forEach(row=>{const moment=new Date(row.start),index=this.period==="month"?moment.getDate()-1:moment.getMonth();if(index>=0&&index<length)this.periodData[key][index]=Number(row.change||0)}));
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
      load: number(this._hass, this.config.consumption_power),
      grid: number(this._hass, this.config.grid_power),
      ...Object.fromEntries((this.config.batteries||[]).flatMap((battery,index)=>[[`soc${index}`,number(this._hass,battery.soc_entity)],[`power${index}`,number(this._hass,battery.power_entity)]]))
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
  sunBoundary(kind) {
    if(kind==="setting"&&this._hass?.states?.["sun.sun"]?.state==="below_horizon")return null;
    const sensor=this._hass?.states?.[`sensor.sun_next_${kind}`]?.state;
    const attribute=this._hass?.states?.["sun.sun"]?.attributes?.[`next_${kind}`];
    const timestamp=Date.parse(sensor||attribute||"");
    return Number.isFinite(timestamp)&&timestamp>Date.now()?timestamp:null;
  }
  projectedSoc(stored, capacity, watts, boundary) {
    if(!boundary||capacity<=0)return null;
    const hours=(boundary-Date.now())/3600000;
    return Math.min(100,(stored+watts/1000*hours)/capacity*100);
  }
  projectedSolarSoc(stored, capacity) {
    const setting=this.sunBoundary("setting"),nextRising=this.sunBoundary("rising");
    if(!setting||!nextRising||capacity<=0)return null;
    const now=Date.now(),rising=nextRising-86400000,daylight=(setting-rising)/3600000,remaining=(setting-now)/3600000;
    if(daylight<=0||remaining<=0||now<rising)return null;
    const phase=Math.max(0,Math.min(1,(now-rising)/(setting-rising))),sunFactor=Math.max(.15,Math.sin(Math.PI*phase));
    const equivalentSunHours=daylight/Math.PI*(1+Math.cos(Math.PI*phase));
    const solarW=Math.max(0,number(this._hass,this.config.solar_power)),loadW=Math.max(0,number(this._hass,this.config.consumption_power));
    const remainingSolarKwh=solarW/1000/sunFactor*equivalentSunHours,remainingLoadKwh=loadW/1000*remaining;
    return Math.min(100,(stored+remainingSolarKwh-remainingLoadKwh)/capacity*100);
  }
  forecast(flows) {
    const stored = flows.reduce((sum, flow) => sum + Math.max(0, flow.soc) / 100 * flow.usable, 0);
    const missing = flows.reduce((sum, flow) => sum + Math.max(0, 100 - flow.soc) / 100 * flow.usable, 0);
    const measuredNet = flows.reduce((sum, flow) => sum + flow.charge - flow.discharge, 0);
    const capacity = flows.reduce((sum, flow) => sum + flow.usable, 0);
    const solar = Math.max(0, number(this._hass, this.config.solar_power));
    const load = Math.max(0, number(this._hass, this.config.consumption_power));
    const gridRaw = number(this._hass, this.config.grid_power);
    const gridImport = this.config.grid_positive === "export" ? -gridRaw : gridRaw;
    const balanceNet = solar + gridImport - load;
    const hasValidBatteryPower = flows.some(flow => flow.validPower);
    const net = hasValidBatteryPower && Math.abs(measuredNet) > 20 ? measuredNet : balanceNet;
    const discharge = Math.max(0, -net);
    const socDetails = flows.filter(flow => Number.isFinite(flow.soc)).map((flow,index) => `${flow.name || `${this.t.battery} ${index+1}`} ${flow.soc.toFixed(1)}%`).join(" · ");
    if (net > 50 && missing > 0) {
      const hours = missing / (net / 1000);
      const projected=this.projectedSolarSoc(stored,capacity);
      const outlook=projected===null?"":` · ${this.t.socAtSunset} ≈ ${projected.toFixed(0)}%`;
      return { icon: "mdi:battery-clock-outline", text: `${this.t.fullIn} ${this.formatDuration(hours)} · ${this.target(hours)}`, sub: `${Math.round(net)} W net · ${socDetails}${outlook}` };
    }
    if (discharge > 20 && stored > 0) {
      const hours = stored / (discharge / 1000);
      const projected=this.projectedSoc(stored,capacity,-discharge,this.sunBoundary("rising"));
      const outlook=projected===null?"":` · ${this.t.socAtSunrise} ≈ ${projected.toFixed(0)}%`;
      return { icon: "mdi:battery-clock", text: `${this.t.endurance} ${this.formatDuration(hours)} · ${this.t.until} ${this.target(hours)}`, sub: `${Math.round(discharge)} W ${this.t.discharge} · ${stored.toFixed(1)} kWh ${this.t.usable}${outlook}` };
    }
    return { icon: "mdi:battery-sync-outline", text: this.t.stableEndurance, sub: `${stored.toFixed(1)} kWh ${this.t.usable} · ${socDetails} · ${this.t.covered}` };
  }
  formattedAnchor() {
    const date=new Date(`${this.anchor}T12:00:00`);
    if(this.period==="year")return String(date.getFullYear());
    if(this.period==="month")return new Intl.DateTimeFormat(localeCode(this.lang),{month:"long",year:"numeric"}).format(date);
    return new Intl.DateTimeFormat(localeCode(this.lang),{day:"2-digit",month:"2-digit",year:"numeric"}).format(date);
  }
  viewData() {
    if(this.period!=="day"){
      if(!this.periodData)return null;const length=this.periodData.solar.length;
      return {labels:Array.from({length},(_,i)=>this.period==="month"?String(i+1):new Intl.DateTimeFormat(localeCode(this.lang),{month:"short"}).format(new Date(2026,i,1))),series:{production:this.periodData.solar,consumption:this.periodData.load},totals:{production:this.periodData.solar.reduce((a,b)=>a+b,0),consumption:this.periodData.load.reduce((a,b)=>a+b,0),grid_import:this.periodData.gridImport.reduce((a,b)=>a+b,0),grid_export:this.periodData.gridExport.reduce((a,b)=>a+b,0)}};
    }
    const samples=this.samples||[],batteries=this.config.batteries||[],positiveImport=this.config.grid_positive!=="export";
    const production=samples.map(x=>Math.max(0,x.solar||0)/1000),consumption=samples.map(x=>Math.max(0,x.load||0)/1000),direct=production.map((v,i)=>Math.min(v,consumption[i]));
    const batteryDischarge=index=>batteries[index]?samples.map(x=>{const signed=x[`power${index}`]||0,positive=batteries[index].power_positive!=="discharge";return Math.max(0,positive?-signed:signed)/1000}):[];
    const soc=index=>batteries[index]?samples.map(x=>userSoc(Number(x[`soc${index}`]||0),batteries[index])):[];
    const gridImport=samples.map(x=>Math.max(0,positiveImport?(x.grid||0):-(x.grid||0))/1000),gridExport=samples.map(x=>Math.max(0,positiveImport?-(x.grid||0):(x.grid||0))/1000);
    const energy=series=>series.reduce((sum,value)=>sum+value/60,0);
    return {labels:samples.map(x=>new Intl.DateTimeFormat(localeCode(this.lang),{hour:"2-digit",minute:"2-digit"}).format(new Date(x.at))),series:{production,consumption,direct_consumption:direct,battery_discharge:batteryDischarge(0),secondary_discharge:batteryDischarge(1),soc:soc(0),soc_secondary:soc(1)},totals:{production:energy(production),consumption:energy(consumption),grid_import:energy(gridImport),grid_export:energy(gridExport)}};
  }
  chart() {
    const d=this.viewData();if(!d?.labels.length)return `<div class="empty">${this.t.noHistory}</div>`;
    const w=900,h=650,left=this.period==="day"?68:72,right=this.period==="day"?68:30,top=28,bottom=460,n=d.labels.length,x=i=>left+(this.period==="day"?(n===1?0:i/(n-1)):(i+.5)/n)*(w-left-right);
    if(this.period==="day"){
      const s=d.series,max=Math.max(1,...s.production,...s.consumption,...s.direct_consumption),py=v=>bottom-v/max*(bottom-top),sy=v=>bottom-v/100*(bottom-top);
      const area=(series,color,opacity)=>{const line=series.map((v,i)=>`${i?'L':'M'} ${x(i)} ${py(v)}`).join(' ');return `<path d="${line} L ${x(n-1)} ${bottom} L ${x(0)} ${bottom} Z" fill="${color}" fill-opacity="${opacity}" stroke="${color}" stroke-width="3"/>`};
      const secondary=s.secondary_discharge||Array(n).fill(0),withoutSecondary=s.consumption.map((v,i)=>Math.max(0,v-secondary[i]));
      const band=(upper,lower)=>{const a=upper.map((v,i)=>`${i?'L':'M'} ${x(i)} ${py(v)}`).join(' '),b=lower.map((_,i)=>`L ${x(lower.length-1-i)} ${py(lower[lower.length-1-i])}`).join(' ');return `<path d="${a} ${b} Z" fill="#8e6ac8" fill-opacity=".9"/>`};
      let svg=`<svg style="min-height:0;height:auto" viewBox="0 0 ${w} ${h}" role="img">`;
      [0,.25,.5,.75,1].forEach(v=>{const y=bottom-v*(bottom-top);svg+=`<line x1="${left}" y1="${y}" x2="${w-right}" y2="${y}" stroke="var(--divider-color)" stroke-width="1.5"/><text x="2" y="${y+6}" font-size="18" fill="var(--secondary-text-color)">${(max*v).toFixed(1)} kW</text><text x="${w-right+8}" y="${y+6}" font-size="18" fill="#69a400">${Math.round(v*100)}%</text>`});
      svg+=area(s.consumption,"#09afd0",.72)+area(s.direct_consumption,"#a8e5d7",.82)+area(s.production,"#f5b000",.45)+band(s.consumption,withoutSecondary);
      if(s.soc.length)svg+=`<path d="${s.soc.map((v,i)=>`${i?'L':'M'} ${x(i)} ${sy(v)}`).join(' ')}" fill="none" stroke="#69a400" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
      if(s.soc_secondary.length)svg+=`<path d="${s.soc_secondary.map((v,i)=>`${i?'L':'M'} ${x(i)} ${sy(v)}`).join(' ')}" fill="none" stroke="#d04a9b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
      [0,.25,.5,.75,1].forEach(v=>{const i=Math.min(n-1,Math.round(v*(n-1)));svg+=`<text x="${x(i)-22}" y="500" font-size="18" fill="var(--secondary-text-color)">${d.labels[i]}</text>`});
      const selected=Math.max(0,Math.min(this.selectedIndex??n-1,n-1));return svg+`<line id="cursor" x1="${x(selected)}" y1="${top}" x2="${x(selected)}" y2="590" stroke="#888" stroke-width="2"/><circle id="cursor-dot" cx="${x(selected)}" cy="590" r="18" fill="var(--card-background-color)" stroke="#1686c0" stroke-width="6"/></svg>`;
    }
    const max=Math.max(1,...d.series.production,...d.series.consumption),bw=(w-left-right)/n,bar=bw*.36;let svg=`<svg style="min-height:0;height:auto" viewBox="0 0 ${w} ${h}" role="img">`;
    [0,.25,.5,.75,1].forEach(v=>{const y=bottom-v*(bottom-top);svg+=`<line x1="${left}" y1="${y}" x2="${w-right}" y2="${y}" stroke="var(--divider-color)" stroke-width="1.5"/><text x="2" y="${y+6}" font-size="18" fill="var(--secondary-text-color)">${(max*v).toFixed(1)} kWh</text>`});
    [[d.series.production,"#f6c945"],[d.series.consumption,"#09afd0"]].forEach(([series,color],si)=>series.forEach((v,i)=>{const bh=v/max*(bottom-top),bx=left+i*bw+(bw-bar*2)/2+si*bar;svg+=`<rect x="${bx}" y="${bottom-bh}" width="${Math.max(2,bar-1.5)}" height="${bh}" rx="2" fill="${color}"/>`}));
    d.labels.forEach((label,i)=>{if(i%Math.ceil(n/12)===0)svg+=`<text x="${x(i)}" y="500" text-anchor="middle" font-size="18" fill="var(--secondary-text-color)">${label}</text>`});const selected=Math.max(0,Math.min(this.selectedIndex??0,n-1));return svg+`<line id="cursor" x1="${x(selected)}" y1="${top}" x2="${x(selected)}" y2="590" stroke="#888" stroke-width="2"/><circle id="cursor-dot" cx="${x(selected)}" cy="590" r="18" fill="var(--card-background-color)" stroke="#1686c0" stroke-width="6"/></svg>`;
  }
  detailReadout(){const d=this.viewData();if(!d?.labels.length)return "";const i=Math.max(0,Math.min(this.selectedIndex??d.labels.length-1,d.labels.length-1)),s=d.series;if(this.period==="day")return `<div class="readout"><b>${this.formattedAnchor()} · ${d.labels[i]}</b><span style="color:#09afd0">● ${(s.consumption[i]||0).toFixed(2)} kW<small>${this.t.consumption}</small></span><span style="color:#75cdbb">● ${(s.direct_consumption[i]||0).toFixed(2)} kW<small>${this.t.direct}</small></span><span style="color:#f5b000">● ${(s.production[i]||0).toFixed(2)} kW<small>${this.t.solar}</small></span><span style="color:#8e6ac8">● ${(s.secondary_discharge[i]||0).toFixed(2)} kW<small>${this.config.batteries?.[1]?.name||this.t.battery}</small></span><span style="color:#69a400">━ ${(s.soc[i]||0).toFixed(1)} %<small>${this.config.batteries?.[0]?.name||`${this.t.battery} 1`}</small></span><span style="color:#d04a9b">━ ${s.soc_secondary.length?(s.soc_secondary[i]||0).toFixed(1):'—'} %<small>${this.config.batteries?.[1]?.name||`${this.t.battery} 2`}</small></span></div>`;return `<div class="readout summary"><b>${d.labels[i]}</b><span style="color:#f5b000">● ${(s.production[i]||0).toFixed(2)} kWh<small>${this.t.solar}</small></span><span style="color:#09afd0">● ${(s.consumption[i]||0).toFixed(2)} kWh<small>${this.t.consumption}</small></span></div>`}
  performanceRings(){const t=this.viewData()?.totals||{},cons=t.consumption||0,prod=t.production||0,gi=t.grid_import||0,ge=t.grid_export||0,local=Math.max(0,cons-gi),self=Math.max(0,prod-ge),ind=cons?Math.min(100,local/cons*100):0,auto=prod?Math.min(100,self/prod*100):0;this.ringKwh=this.ringKwh||{};const ring=(percent,color,total,key,a,b,av,bv)=>{const kwh=this.ringKwh[key],value=(v,p)=>p?`${v.toFixed(2)} kWh`:`${Math.round(v)}%`;return `<div class="performance"><div class="ring" style="--value:${percent};--color:${color}"><div><b>${total.toFixed(2)}</b> kWh<small>${key===0?this.t.consumption:this.t.solar}</small></div></div><div class="split" data-ring-toggle="${key}" role="button" tabindex="0"><span><i style="background:${color}"></i><b>${value(kwh?av:percent,kwh)}</b> ${a}</span><span><i></i><b>${value(kwh?bv:100-percent,kwh)}</b> ${b}</span></div></div>`};return `<div class="rings">${ring(ind,"#4bb49f",cons,0,this.t.independence,this.t.gridPurchase,local,gi)}${ring(auto,"#f1d900",prod,1,this.t.selfConsumption,this.t.gridFeedIn,self,ge)}</div>`}
  openPicker(){this.pickerPeriod=this.period;this.pickerCursor=this.anchor;this.updatePicker();this.shadowRoot.getElementById("picker").classList.add("open")}
  pickerMarkup(){const p=this.pickerPeriod||this.period;return `<style>.cal-head{display:grid;grid-template-columns:44px 1fr 44px;align-items:center;padding:14px 12px}.close,.cal-nav,.cal-grid button{border:0;background:transparent;color:var(--primary-text-color);cursor:pointer}.close,.cal-nav{font-size:28px}.cal-nav{color:#1686c0}.cal-title{text-align:center;font-size:18px;font-weight:600}.cal-grid{display:grid;gap:4px;padding:14px 18px}.days{grid-template-columns:repeat(7,1fr)}.months,.years{grid-template-columns:repeat(3,1fr)}.weekday{text-align:center;color:var(--secondary-text-color);font-size:12px;padding:5px}.cal-grid button{min-height:40px;border-radius:50%;font-size:16px}.months button,.years button{border-radius:8px}.cal-grid button.selected{background:#1686c0;color:white}.cal-grid button.today{outline:2px solid #1686c0}.cal-grid button:disabled{opacity:.25}</style><div class="cal-head"><span></span><h3>${this.t.day}/${this.t.month}/${this.t.year}</h3><button class="close" id="picker-close">×</button></div><div class="picker-tabs">${[["day",this.t.day],["month",this.t.month],["year",this.t.year]].map(([x,l])=>`<button data-picker-period="${x}" class="${x===p?'on':''}">${l}</button>`).join('')}</div><div>${this.pickerContent()}</div>`}
  pickerContent(){const p=this.pickerPeriod||this.period,[y,m]=this.pickerCursor.split('-').map(Number),locale=localeCode(this.lang),months=Array.from({length:12},(_,i)=>new Intl.DateTimeFormat(locale,{month:"long"}).format(new Date(2026,i,1))),nav=title=>`<div class="cal-head"><button class="cal-nav" data-picker-shift="-1">‹</button><div class="cal-title">${title}</div><button class="cal-nav" data-picker-shift="1">›</button></div>`;if(p==="day"){const count=new Date(Date.UTC(y,m,0)).getUTCDate(),offset=(new Date(Date.UTC(y,m-1,1)).getUTCDay()+6)%7,buttons=Array(offset).fill('<span></span>');for(let day=1;day<=count;day++){const value=`${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;buttons.push(`<button data-picker-value="${value}" class="${value===this.anchor?'selected':''} ${value===this.today()?'today':''}" ${value>this.today()?'disabled':''}>${day}</button>`)}return `${nav(`${months[m-1]} ${y}`)}<div class="cal-grid days">${["Mo","Tu","We","Th","Fr","Sa","Su"].map(x=>`<span class="weekday">${x}</span>`).join('')}${buttons.join('')}</div>`}if(p==="month")return `${nav(y)}<div class="cal-grid months">${months.map((name,i)=>{const value=`${y}-${String(i+1).padStart(2,'0')}-01`;return `<button data-picker-value="${value}" class="${value.slice(0,7)===this.anchor.slice(0,7)?'selected':''}" ${value.slice(0,7)>this.today().slice(0,7)?'disabled':''}>${name}</button>`}).join('')}</div>`;const first=Math.floor(y/9)*9;return `${nav(`${first} – ${first+8}`)}<div class="cal-grid years">${Array.from({length:9},(_,i)=>first+i).map(year=>`<button data-picker-value="${year}-01-01" class="${year===Number(this.anchor.slice(0,4))?'selected':''}" ${year>Number(this.today().slice(0,4))?'disabled':''}>${year}</button>`).join('')}</div>`}
  updatePicker(){const box=this.shadowRoot?.querySelector('.picker-box');if(!box)return;box.innerHTML=this.pickerMarkup();box.querySelectorAll('[data-picker-period]').forEach(b=>b.onclick=()=>{this.pickerPeriod=b.dataset.pickerPeriod;this.updatePicker()});box.querySelectorAll('[data-picker-shift]').forEach(b=>b.onclick=()=>{const [y,m]=this.pickerCursor.split('-').map(Number),d=new Date(Date.UTC(y,m-1,1)),p=this.pickerPeriod||this.period;if(p==='day')d.setUTCMonth(d.getUTCMonth()+Number(b.dataset.pickerShift));else d.setUTCFullYear(d.getUTCFullYear()+Number(b.dataset.pickerShift)*(p==='year'?9:1));this.pickerCursor=d.toISOString().slice(0,10);this.updatePicker()});box.querySelectorAll('[data-picker-value]').forEach(b=>b.onclick=()=>{this.period=this.pickerPeriod||this.period;this.anchor=b.dataset.pickerValue;this.periodData=null;this.shadowRoot.getElementById('picker').classList.remove('open');this.queueHistory();this.render()});box.querySelector('#picker-close').onclick=()=>this.shadowRoot.getElementById('picker').classList.remove('open')}
  bindChart(){const d=this.viewData(),n=d?.labels?.length,svg=this.shadowRoot?.querySelector('svg');if(!n||!svg)return;const daily=this.period==='day',left=daily?68:72,right=daily?68:30,update=e=>{const rect=svg.getBoundingClientRect(),ratio=Math.max(0,Math.min(1,(e.clientX-rect.left-left/900*rect.width)/(rect.width*(900-left-right)/900))),i=Math.round(ratio*(n-1));this.selectedIndex=i;const x=daily?left+(n===1?0:i/(n-1))*(900-left-right):left+(i+.5)*(900-left-right)/n;this.shadowRoot.getElementById('cursor')?.setAttribute('x1',x);this.shadowRoot.getElementById('cursor')?.setAttribute('x2',x);this.shadowRoot.getElementById('cursor-dot')?.setAttribute('cx',x);this.shadowRoot.getElementById('readout').innerHTML=this.detailReadout()};svg.onpointerdown=update;svg.onpointermove=e=>{if(e.buttons||e.pointerType==='touch')update(e)}}
  render() {
    if (!this.config || !this._hass || !this.isConnected) return;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this.rendered=true;this.lang=languageCode(this.config,this._hass);this.t=EH_I18N[this.lang];const flows=(this.config.batteries||[]).filter(x=>x.soc_entity&&x.power_entity).map(x=>({...batteryFlow(this._hass,x),config:x})),forecast=this.forecast(flows);
    this.shadowRoot.innerHTML=`<style>:host{display:block}ha-card{padding:10px 14px 16px;border-radius:18px}.nav{display:grid;grid-template-columns:42px minmax(190px,390px) 42px;align-items:center;justify-content:center;gap:10px;margin:4px 0 10px}.nav button{border:0;background:transparent;color:#1686c0;padding:10px;border-radius:19px;cursor:pointer;font-size:22px}.date{display:flex;align-items:center;justify-content:center;gap:9px;font-size:18px;font-weight:600;border:1px solid var(--primary-text-color)!important;border-radius:5px!important;padding:10px 14px!important;background:transparent!important;color:var(--primary-text-color)!important}.date ha-icon{width:20px;height:20px}.notice{color:var(--secondary-text-color);font-size:11px;margin-top:8px}svg{display:block;width:100%;min-height:360px;touch-action:none}.empty{padding:80px 20px;text-align:center}.readout{display:grid;grid-template-columns:auto repeat(6,minmax(0,1fr));gap:8px;padding:7px 10px;background:var(--secondary-background-color);align-items:center;box-shadow:0 2px 5px #0003}.readout.summary{grid-template-columns:auto repeat(2,minmax(0,1fr))}.readout>b{font-size:12px;color:var(--secondary-text-color)}.readout span{font-size:14px;font-weight:600;white-space:nowrap}.readout small{display:block;color:var(--secondary-text-color);font-size:10px;font-weight:400;white-space:normal}.battery-forecast{display:flex;align-items:center;justify-content:center;gap:9px;margin:4px 12px 8px;padding:8px 10px;border-block:1px solid var(--divider-color);color:var(--secondary-text-color);font-size:13px;text-align:center}.battery-forecast ha-icon{color:#69a400;width:20px}.battery-forecast b{color:var(--primary-text-color)}.battery-forecast small{display:block;font-size:10px}.rings{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:20px auto 8px;max-width:620px}.performance{text-align:center;min-width:0}.ring{--value:0;--color:#4bb49f;width:180px;height:180px;margin:auto;border-radius:50%;background:conic-gradient(var(--color) calc(var(--value)*1%),var(--divider-color) 0);display:grid;place-items:center}.ring>div{width:154px;height:154px;border-radius:50%;background:var(--card-background-color);display:flex;align-items:center;justify-content:center;flex-wrap:wrap;align-content:center;font-size:15px}.ring b{font-size:28px;color:var(--color)}.ring small{display:block;width:100%;color:var(--secondary-text-color);font-size:15px}.split{display:grid;gap:7px;text-align:left;margin:12px auto;max-width:190px;cursor:pointer}.split i{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--divider-color);margin-right:7px}.picker{display:none;position:fixed;inset:0;background:#0008;z-index:99;align-items:center;justify-content:center}.picker.open{display:flex}.picker-box{background:var(--card-background-color);padding:0 0 18px;border-radius:10px;min-width:310px;max-width:90vw;box-shadow:0 8px 40px #0007;overflow:hidden}.picker-tabs{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--divider-color)}.picker-tabs button{border:0;border-bottom:4px solid transparent;background:transparent;color:var(--secondary-text-color);padding:14px 8px;font-size:17px}.picker-tabs .on{color:#1686c0;border-bottom-color:#1686c0}@media(max-width:600px){ha-card{padding:8px 0 14px}.nav{margin:0 10px 7px}.readout{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;padding:7px 6px}.readout>b{grid-column:1/-1}.readout span{font-size:12px}.readout small{font-size:9px}svg{min-height:360px}.rings{gap:8px;margin-top:16px}.ring{width:136px;height:136px}.ring>div{width:116px;height:116px;font-size:11px}.ring b{font-size:22px}.ring small{font-size:12px}.split{font-size:11px;max-width:145px}}</style><ha-card><div class="nav"><button id="previous">‹</button><button class="date" id="date-button"><ha-icon icon="mdi:calendar-month"></ha-icon><span>${this.formattedAnchor()}</span></button><button id="next">›</button></div>${this.historyLoading&&!this.samples?.length?`<div class="empty">${this.t.loading}</div>`:`<div id="readout">${this.detailReadout()}</div>${this.chart()}<div class="battery-forecast"><ha-icon icon="${forecast.icon}"></ha-icon><span><b>${forecast.text}</b><small>${forecast.sub}</small></span></div>${this.performanceRings()}<div class="notice">Energy Horizon · ${this.period==='day'?'1 min':this.period} · Home Assistant Recorder</div>`}<div class="picker" id="picker"><div class="picker-box"></div></div></ha-card>`;
    this.pickerPeriod=this.pickerPeriod||this.period;this.pickerCursor=this.pickerCursor||this.anchor;this.updatePicker();this.shadowRoot.getElementById('previous').onclick=()=>this.shift(-1);this.shadowRoot.getElementById('next').onclick=()=>this.shift(1);this.shadowRoot.getElementById('date-button').onclick=()=>this.openPicker();this.shadowRoot.querySelectorAll('[data-ring-toggle]').forEach(el=>{el.onclick=()=>{this.ringKwh[el.dataset.ringToggle]=!this.ringKwh[el.dataset.ringToggle];this.render()}});this.bindChart();
  }
  getCardSize() { return 8; }
}

class EnergyHorizonCardEditor extends HTMLElement {
  connectedCallback() { this.render(); }
  setConfig(config) { this.config = { ...EnergyHorizonCard.getStubConfig(), ...clone(config), batteries: clone(config.batteries || []) }; this.render(); }
  set hass(hass) {
    this._hass = hass;
    if (!this.shadowRoot) {
      this.render();
      return;
    }
    this.shadowRoot.querySelectorAll("ha-entity-picker").forEach(picker => { picker.hass = hass; });
  }
  fire() { this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: clone(this.config) }, bubbles: true, composed: true })); }
  updateRoot(key, value) { this.config[key] = value; this.fire(); }
  updateBattery(index, key, value) { this.config.batteries[index][key] = value; this.fire(); }
  picker(label, key, value, batteryIndex = null) { return `<label><span>${label}</span><ha-entity-picker data-key="${key}" ${batteryIndex===null?"":`data-battery="${batteryIndex}"`} value="${value || ""}" allow-custom-entity></ha-entity-picker></label>`; }
  render() {
    if (!this.config || !this._hass || !this.isConnected) return;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const lang = languageCode(this.config, this._hass), t = EH_I18N[lang];
    const batteryBlocks = this.config.batteries.map((battery,index)=>`<section><h3>${t.battery} ${index+1}</h3><label><span>${t.name}</span><input data-battery="${index}" data-key="name" value="${battery.name||""}"></label>${this.picker(t.socEntity,"soc_entity",battery.soc_entity,index)}${this.picker(t.batteryPower,"power_entity",battery.power_entity,index)}<div class="row"><label><span>${t.capacity}</span><input type="number" step="0.1" data-battery="${index}" data-key="capacity_kwh" value="${battery.capacity_kwh||0}"></label><label><span>${t.reserve}</span><input type="number" step="0.1" data-battery="${index}" data-key="reserve_percent" value="${battery.reserve_percent||0}"></label></div><label class="check"><input type="checkbox" data-battery="${index}" data-key="calculate_user_soc" ${battery.calculate_user_soc?"checked":""}> ${t.calculateSoc}</label><label class="check"><input type="checkbox" data-battery="${index}" data-key="allow_negative_soc" ${battery.allow_negative_soc?"checked":""}> ${t.negativeSoc}</label><label><span>${t.positiveMeans}</span><select data-battery="${index}" data-key="power_positive"><option value="charge" ${battery.power_positive!=="discharge"?"selected":""}>${t.charging}</option><option value="discharge" ${battery.power_positive==="discharge"?"selected":""}>${t.discharging}</option></select></label><button data-remove="${index}">${t.removeBattery}</button></section>`).join("");
    this.shadowRoot.innerHTML=`<style>:host{display:block}.wizard{display:grid;gap:14px;padding:8px}h2,h3{margin:8px 0}section{border:1px solid var(--divider-color);border-radius:12px;padding:12px;display:grid;gap:10px}label{display:grid;gap:5px}label>span,.hint{font-size:12px;color:var(--secondary-text-color)}input,select,button{box-sizing:border-box;width:100%;padding:10px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color)}.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.check{display:flex;align-items:center;gap:8px}.check input{width:auto}button{cursor:pointer;color:var(--primary-color)}</style><div class="wizard"><h2>${t.setup}</h2><label><span>${t.language}</span><select data-key="language"><option value="auto" ${this.config.language==="auto"||!this.config.language?"selected":""}>${t.automatic}</option><option value="en" ${this.config.language==="en"?"selected":""}>English</option><option value="fr" ${this.config.language==="fr"?"selected":""}>Français</option><option value="nl" ${this.config.language==="nl"?"selected":""}>Nederlands</option></select></label><label><span>${t.cardTitle}</span><input data-key="title" value="${this.config.title||""}"></label><section><h3>${t.livePower}</h3>${this.picker(t.solarPower,"solar_power",this.config.solar_power)}${this.picker(t.homePower,"consumption_power",this.config.consumption_power)}${this.picker(t.gridPower,"grid_power",this.config.grid_power)}<label><span>${t.positiveGrid}</span><select data-key="grid_positive"><option value="import" ${this.config.grid_positive!=="export"?"selected":""}>${t.gridImport}</option><option value="export" ${this.config.grid_positive==="export"?"selected":""}>${t.gridExport}</option></select></label></section><section><h3>${t.energyHistory}</h3><div class="hint">${t.historyHint}</div>${this.picker(t.dailySolar,"solar_energy_today",this.config.solar_energy_today)}${this.picker(t.totalSolar,"solar_energy_total",this.config.solar_energy_total)}${this.picker(t.totalConsumption,"consumption_energy_total",this.config.consumption_energy_total)}${this.picker(t.totalGridImport,"grid_import_energy_total",this.config.grid_import_energy_total)}${this.picker(t.totalGridExport,"grid_export_energy_total",this.config.grid_export_energy_total)}</section><label><span>${t.refresh}</span><input type="number" min="5" data-key="refresh_interval" value="${this.config.refresh_interval||15}"></label>${batteryBlocks}<button id="add" ${this.config.batteries.length>=2?"disabled":""}>${t.addBattery}</button></div>`;
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
