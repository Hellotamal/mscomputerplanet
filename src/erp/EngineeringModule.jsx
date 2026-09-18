import React, { useState, useMemo } from 'react';
import { 
  SunMedium, 
  Calculator, 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Printer, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Send, 
  Layers, 
  Download, 
  IndianRupee, 
  ArrowRight, 
  Leaf, 
  Building2, 
  X,
  Zap
} from 'lucide-react';
import { generateEntityId, escapeHtml } from './erpSecurity';
import { recordAuditLog, saveErpData } from './erpStorage';
import { getCompanyPrintHeaderHtml } from '../data/companyLogo';

const SYSTEM_TYPES = [
  'On-Grid Net Metering',
  'Hybrid with Battery',
  'Off-Grid Solar UPS',
  'IT Network & Hardware'
];

const ROOF_TYPES = [
  'RCC Flat Roof',
  'Tin Shed Structure',
  'Commercial Metal Profile',
  'Slanted Tile Roof',
  'Ground Mount Solar Array'
];

// Presets for quick 1-click BOQ generation
const PRESET_TEMPLATES = {
  solar3kW: {
    title: '3 kWp Residential Solar Rooftop (PM Surya Ghar)',
    systemType: 'On-Grid Net Metering',
    category: 'Solar Rooftop EPC',
    roofType: 'RCC Flat Roof',
    recommendedKw: 3.3,
    requiredAreaSqFt: 300,
    dailyUnitsGen: 13.5,
    monthlySavings: 3300,
    annualSavings: 39600,
    subsidyEligible: 78000,
    estimatedCost: 215000,
    netClientCost: 137000,
    paybackYears: 3.4,
    co2OffsetTonnes25Yr: 85,
    boqItems: [
      { item: '550W Waaree Mono PERC Bifacial Solar PV Modules', qty: 6, unit: 'Nos', rate: 14200, amount: 85200 },
      { item: 'Growatt 3.3kW Single-Phase On-Grid Inverter with WiFi', qty: 1, unit: 'Set', rate: 38000, amount: 38000 },
      { item: 'Hot Dip Galvanized (HDG) Elevated Module Structure (150 km/h)', qty: 1, unit: 'Set', rate: 26000, amount: 26000 },
      { item: '1-In 1-Out DC Distribution Box with 1000V SPD & DC Fuse', qty: 1, unit: 'Set', rate: 6500, amount: 6500 },
      { item: 'AC Distribution Box with 2-Pole 32A MCB & Type 2 SPD', qty: 1, unit: 'Set', rate: 6500, amount: 6500 },
      { item: '4 sq mm TUV Solar DC Cable (Polycab/Havells)', qty: 60, unit: 'Mtr', rate: 58, amount: 3480 },
      { item: 'Chemical Earthing Pits with Electrodes & Compound (2 Pits)', qty: 2, unit: 'Sets', rate: 6500, amount: 13000 },
      { item: 'ESE Lightning Arrester with 10m GI Mast & Cable', qty: 1, unit: 'Set', rate: 12500, amount: 12500 },
      { item: 'APDCL Net Metering Liaisoning & Commissioning Kit', qty: 1, unit: 'Job', rate: 23820, amount: 23820 }
    ]
  },
  solar5kWHybrid: {
    title: '5 kWp Hybrid Commercial Solar System with Lithium Storage',
    systemType: 'Hybrid with Battery',
    category: 'Solar Rooftop EPC',
    roofType: 'RCC Flat Roof',
    recommendedKw: 5.4,
    requiredAreaSqFt: 500,
    dailyUnitsGen: 22.0,
    monthlySavings: 5400,
    annualSavings: 64800,
    subsidyEligible: 78000,
    estimatedCost: 365000,
    netClientCost: 287000,
    paybackYears: 4.4,
    co2OffsetTonnes25Yr: 140,
    boqItems: [
      { item: '540W Tata Power Solar Mono PERC Modules', qty: 10, unit: 'Nos', rate: 13900, amount: 139000 },
      { item: 'Livguard 5kVA 48V MPPT Hybrid Solar Inverter', qty: 1, unit: 'Set', rate: 49500, amount: 49500 },
      { item: '48V 100Ah LiFePO4 Lithium Battery with Smart BMS (5 kWh)', qty: 1, unit: 'Unit', rate: 75000, amount: 75000 },
      { item: 'HDG Aluminium/GI Elevated Mounting Structure', qty: 1, unit: 'Set', rate: 35000, amount: 35000 },
      { item: 'ACDB & DCDB Dual Protection Enclosures with SPDs', qty: 1, unit: 'Set', rate: 14500, amount: 14500 },
      { item: 'Solar DC Cable 4 sq mm + AC Output Copper Wiring', qty: 90, unit: 'Mtr', rate: 65, amount: 5850 },
      { item: 'Triple Chemical Earthing System (Inverter, DC, Lightning)', qty: 3, unit: 'Sets', rate: 6500, amount: 19500 },
      { item: 'Installation, Testing, APDCL Net Meter Application', qty: 1, unit: 'Job', rate: 26650, amount: 26650 }
    ]
  },
  solar10kWOnGrid: {
    title: '10 kWp High-Efficiency Industrial Rooftop Plant',
    systemType: 'On-Grid Net Metering',
    category: 'Solar Rooftop EPC',
    roofType: 'Commercial Metal Profile',
    recommendedKw: 10.8,
    requiredAreaSqFt: 1000,
    dailyUnitsGen: 44.0,
    monthlySavings: 10500,
    annualSavings: 126000,
    subsidyEligible: 0,
    estimatedCost: 560000,
    netClientCost: 560000,
    paybackYears: 4.4,
    co2OffsetTonnes25Yr: 280,
    boqItems: [
      { item: '540W Tier-1 Bifacial Solar PV Modules', qty: 20, unit: 'Nos', rate: 13800, amount: 276000 },
      { item: 'Growatt / Solis 10kW 3-Phase IP65 On-Grid Inverter', qty: 1, unit: 'Set', rate: 78000, amount: 78000 },
      { item: 'Short-Rail HDG Structure for Metal Trapezoidal Profile', qty: 1, unit: 'Lot', rate: 52000, amount: 52000 },
      { item: '2-In 2-Out 1000V DC Distribution Box with Type 2 SPD', qty: 1, unit: 'Set', rate: 12500, amount: 12500 },
      { item: 'AC Distribution Box with 32A 4-Pole MCB & Class-B SPD', qty: 1, unit: 'Set', rate: 9500, amount: 9500 },
      { item: 'Solar DC Cable 4 sq mm TUV Certified Copper', qty: 160, unit: 'Mtr', rate: 58, amount: 9280 },
      { item: 'Armoured 4C x 10 sq mm AC Cable (Finolex/Polycab)', qty: 40, unit: 'Mtr', rate: 310, amount: 12400 },
      { item: 'Chemical Earthing Pits with Copper Bonded Electrodes (3 Pits)', qty: 3, unit: 'Sets', rate: 6800, amount: 20400 },
      { item: 'Early Streamer Emission (ESE) Lightning Protection Terminal', qty: 1, unit: 'Set', rate: 16500, amount: 16500 },
      { item: 'Civil Foundations, Walkway, Testing & APDCL Formalities', qty: 1, unit: 'Lot', rate: 73420, amount: 73420 }
    ]
  },
  itBankInfrastructure: {
    title: 'Bank Branch IT Infrastructure Modernization BOQ',
    systemType: 'IT Network & Hardware',
    category: 'Banking IT AMC',
    roofType: 'N/A - IT Server Rack',
    recommendedKw: 0,
    requiredAreaSqFt: 0,
    dailyUnitsGen: 0,
    monthlySavings: 0,
    annualSavings: 0,
    subsidyEligible: 0,
    estimatedCost: 325000,
    netClientCost: 325000,
    paybackYears: 0,
    co2OffsetTonnes25Yr: 0,
    boqItems: [
      { item: 'HP ProDesk 400 Core i5 Desktop (16GB RAM, 512GB SSD, Win 11 Pro)', qty: 4, unit: 'Units', rate: 42500, amount: 170000 },
      { item: 'HP LaserJet Pro M404dn Duplex Network Banking Printer', qty: 2, unit: 'Units', rate: 26500, amount: 53000 },
      { item: 'Cisco CBS250 24-Port Gigabit Smart Managed Switch', qty: 1, unit: 'Unit', rate: 24500, amount: 24500 },
      { item: 'APC Back-UPS Pro 2kVA Line Interactive UPS for Cash Counters', qty: 2, unit: 'Sets', rate: 22000, amount: 44000 },
      { item: 'Cat6 Structured Cabling, Patch Panel & 6U Server Rack Setup', qty: 1, unit: 'Lot', rate: 33500, amount: 33500 }
    ]
  }
};

export default function EngineeringModule({
  engineeringDesigns = [],
  setEngineeringDesigns,
  quotations = [],
  setQuotations,
  setActiveTab,
  currentUser
}) {
  const [activeSubTab, setActiveSubTab] = useState('calculator'); // 'calculator' | 'register' | 'builder'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedDesignForView, setSelectedDesignForView] = useState(null);
  const [copiedNotification, setCopiedNotification] = useState('');

  // Sizing Calculator Form State
  const [calcInputs, setCalcInputs] = useState({
    monthlyBill: 5500, // ₹
    roofAreaSqFt: 800,
    roofType: 'RCC Flat Roof',
    systemType: 'On-Grid Net Metering',
    clientSector: 'Residential (PM Surya Ghar)', // 'Residential' | 'Commercial'
    tariffPerUnit: 8.0 // APDCL average ₹/kWh
  });

  // Calculate live engineering metrics from inputs
  const calculatedMetrics = useMemo(() => {
    const bill = Number(calcInputs.monthlyBill) || 0;
    const tariff = Number(calcInputs.tariffPerUnit) || 8.0;
    const monthlyUnits = Math.round(bill / tariff);
    
    // Average daily consumption
    const dailyUnits = monthlyUnits / 30;
    
    // Barak Valley Peak Sun Hours (PSH) avg: 4.1 hours/day
    // Recommended capacity in kWp = dailyUnits / 4.1
    let rawKw = dailyUnits / 4.1;
    if (rawKw < 1) rawKw = 1;
    const recommendedKw = Math.round(rawKw * 10) / 10;
    
    // Rooftop area needed: approx 100 sq.ft per kWp
    const requiredArea = Math.round(recommendedKw * 100);
    const hasEnoughSpace = calcInputs.roofAreaSqFt >= requiredArea;

    // Actual estimated generation
    const dailyGenUnits = Math.round(recommendedKw * 4.1 * 10) / 10;
    const monthlySavings = Math.round(dailyGenUnits * 30 * tariff);
    const annualSavings = monthlySavings * 12;

    // PM Surya Ghar Subsidy Computation
    let subsidy = 0;
    if (calcInputs.clientSector.includes('Residential')) {
      if (recommendedKw <= 2.0) {
        subsidy = Math.round(recommendedKw * 30000);
      } else {
        subsidy = 78000; // Cap at ₹78,000 for 3kW and above
      }
    }

    // Benchmark turnkey installation cost: approx ₹55,000 to ₹65,000 per kWp for on-grid
    const ratePerKw = calcInputs.systemType === 'Hybrid with Battery' ? 72000 : 54000;
    const estimatedCost = Math.round(recommendedKw * ratePerKw);
    const netCost = Math.max(0, estimatedCost - subsidy);
    const paybackYears = annualSavings > 0 ? Math.round((netCost / annualSavings) * 10) / 10 : 0;
    const co2Tonnes = Math.round(recommendedKw * 25.8); // ~25.8 tonnes CO2 offset over 25 years per kW

    return {
      monthlyUnits,
      recommendedKw,
      requiredArea,
      hasEnoughSpace,
      dailyGenUnits,
      monthlySavings,
      annualSavings,
      subsidy,
      estimatedCost,
      netCost,
      paybackYears,
      co2Tonnes
    };
  }, [calcInputs]);

  // Builder Form State
  const [builderForm, setBuilderForm] = useState({
    id: '',
    clientName: '',
    projectTitle: '',
    systemType: 'On-Grid Net Metering',
    category: 'Solar Rooftop EPC',
    city: 'Silchar',
    status: 'Draft',
    roofType: 'RCC Flat Roof',
    recommendedKw: 3.0,
    requiredAreaSqFt: 300,
    dailyUnitsGen: 12.3,
    monthlySavings: 2950,
    annualSavings: 35400,
    subsidyEligible: 78000,
    estimatedCost: 195000,
    netClientCost: 117000,
    paybackYears: 3.3,
    co2OffsetTonnes25Yr: 78,
    boqItems: [
      { item: '550W Waaree Mono PERC Bifacial Solar PV Modules', qty: 6, unit: 'Nos', rate: 14200, amount: 85200 },
      { item: 'Growatt 3.3kW Single Phase On-Grid Inverter', qty: 1, unit: 'Set', rate: 38000, amount: 38000 },
      { item: 'Hot Dip Galvanized Module Mounting Structure', qty: 1, unit: 'Set', rate: 26000, amount: 26000 }
    ],
    engineer: currentUser?.name || 'Solar Technical Lead',
    notes: ''
  });

  // Calculate subtotal of builder BOQ
  const builderBoqTotal = useMemo(() => {
    return (builderForm.boqItems || []).reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  }, [builderForm.boqItems]);

  // Transfer Sizing Calculator metrics to Design Builder
  const handleLoadCalculatorIntoBuilder = () => {
    setBuilderForm(prev => ({
      ...prev,
      projectTitle: `${calculatedMetrics.recommendedKw} kWp ${calcInputs.systemType} Rooftop Plant`,
      systemType: calcInputs.systemType,
      roofType: calcInputs.roofType,
      recommendedKw: calculatedMetrics.recommendedKw,
      requiredAreaSqFt: calculatedMetrics.requiredArea,
      dailyUnitsGen: calculatedMetrics.dailyGenUnits,
      monthlySavings: calculatedMetrics.monthlySavings,
      annualSavings: calculatedMetrics.annualSavings,
      subsidyEligible: calculatedMetrics.subsidy,
      estimatedCost: calculatedMetrics.estimatedCost,
      netClientCost: calculatedMetrics.netCost,
      paybackYears: calculatedMetrics.paybackYears,
      co2OffsetTonnes25Yr: calculatedMetrics.co2Tonnes,
      boqItems: [
        { 
          item: `${Math.ceil(calculatedMetrics.recommendedKw * 1000 / 540)} x 540W Mono PERC Bifacial Solar Modules`, 
          qty: Math.ceil(calculatedMetrics.recommendedKw * 1000 / 540), 
          unit: 'Nos', 
          rate: 13900, 
          amount: Math.ceil(calculatedMetrics.recommendedKw * 1000 / 540) * 13900 
        },
        { 
          item: `${Math.ceil(calculatedMetrics.recommendedKw)} kW High-Efficiency Inverter (IP65/WiFi)`, 
          qty: 1, 
          unit: 'Set', 
          rate: Math.round(calculatedMetrics.recommendedKw * 7500), 
          amount: Math.round(calculatedMetrics.recommendedKw * 7500) 
        },
        { 
          item: `Heavy Duty Galvanized Structure for ${calcInputs.roofType}`, 
          qty: 1, 
          unit: 'Lot', 
          rate: Math.round(calculatedMetrics.recommendedKw * 5500), 
          amount: Math.round(calculatedMetrics.recommendedKw * 5500) 
        },
        { 
          item: 'ACDB & DCDB Surge Protection Enclosures', 
          qty: 1, 
          unit: 'Set', 
          rate: 9500, 
          amount: 9500 
        },
        { 
          item: 'Chemical Earthing Pits & Lightning Arrester Setup', 
          qty: 2, 
          unit: 'Sets', 
          rate: 7000, 
          amount: 14000 
        },
        { 
          item: 'APDCL Net Metering Process, Testing & Commissioning', 
          qty: 1, 
          unit: 'Job', 
          rate: 22000, 
          amount: 22000 
        }
      ]
    }));
    setActiveSubTab('builder');
  };

  // Load Preset Template into Builder
  const handleLoadPreset = (key) => {
    const preset = PRESET_TEMPLATES[key];
    if (!preset) return;
    setBuilderForm(prev => ({
      ...prev,
      projectTitle: preset.title,
      systemType: preset.systemType,
      category: preset.category,
      roofType: preset.roofType,
      recommendedKw: preset.recommendedKw,
      requiredAreaSqFt: preset.requiredAreaSqFt,
      dailyUnitsGen: preset.dailyUnitsGen,
      monthlySavings: preset.monthlySavings,
      annualSavings: preset.annualSavings,
      subsidyEligible: preset.subsidyEligible,
      estimatedCost: preset.estimatedCost,
      netClientCost: preset.netClientCost,
      paybackYears: preset.paybackYears,
      co2OffsetTonnes25Yr: preset.co2OffsetTonnes25Yr,
      boqItems: [...preset.boqItems]
    }));
  };

  // Handle BOQ Item line edit in builder
  const handleBoqItemChange = (idx, field, val) => {
    const updated = [...builderForm.boqItems];
    updated[idx] = { ...updated[idx], [field]: val };
    if (field === 'qty' || field === 'rate') {
      const q = Number(field === 'qty' ? val : updated[idx].qty) || 0;
      const r = Number(field === 'rate' ? val : updated[idx].rate) || 0;
      updated[idx].amount = Math.round(q * r);
    }
    setBuilderForm(prev => ({ ...prev, boqItems: updated }));
  };

  const handleAddBoqItem = () => {
    setBuilderForm(prev => ({
      ...prev,
      boqItems: [
        ...prev.boqItems,
        { item: '', qty: 1, unit: 'Nos', rate: 0, amount: 0 }
      ]
    }));
  };

  const handleRemoveBoqItem = (idx) => {
    setBuilderForm(prev => ({
      ...prev,
      boqItems: prev.boqItems.filter((_, i) => i !== idx)
    }));
  };

  // Save Design
  const handleSaveDesign = (e) => {
    e.preventDefault();
    if (!builderForm.clientName.trim() || !builderForm.projectTitle.trim()) {
      alert('Please provide Client Name and Project Title.');
      return;
    }

    const designId = builderForm.id || generateEntityId('ENG');
    const newDesign = {
      ...builderForm,
      id: designId,
      estimatedCost: builderBoqTotal,
      netClientCost: Math.max(0, builderBoqTotal - (Number(builderForm.subsidyEligible) || 0)),
      createdDate: new Date().toISOString().split('T')[0]
    };

    let updated;
    if (builderForm.id) {
      updated = engineeringDesigns.map(d => d.id === builderForm.id ? newDesign : d);
      recordAuditLog("ENGINEERING_UPDATED", "Engineering", `Updated design ${designId} for ${newDesign.clientName}`);
    } else {
      updated = [newDesign, ...engineeringDesigns];
      recordAuditLog("ENGINEERING_CREATED", "Engineering", `Created technical design ${designId} (${newDesign.projectTitle}) for ${newDesign.clientName}`);
    }

    setEngineeringDesigns(updated);
    saveErpData("engineering_designs", updated);
    setActiveSubTab('register');
    setSelectedDesignForView(newDesign);
  };

  // 1-Click Convert Engineering Design to Quotation
  const handlePushToQuotation = (design) => {
    const quoteItems = (design.boqItems || []).map(b => ({
      desc: b.item,
      hsn: b.item.toLowerCase().includes('solar') ? '8541' : (b.item.toLowerCase().includes('inverter') ? '8504' : '8471'),
      qty: b.qty || 1,
      unit: b.unit || 'Nos',
      rate: b.rate || 0
    }));

    const newQuote = {
      id: generateEntityId('QT'),
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      clientName: design.clientName,
      contactPerson: '',
      clientPhone: '',
      clientEmail: '',
      clientAddress: design.city ? `${design.city}, Assam` : 'Silchar, Assam',
      clientGst: '',
      category: design.category || 'Solar Rooftop EPC',
      placeOfSupply: 'Assam (18)',
      taxType: 'intra',
      status: 'Draft',
      items: quoteItems,
      gstRate: design.category?.includes('Solar') ? 12 : 18,
      terms: 
`1. Payment Terms: 50% mobilization advance along with formal purchase order, 40% on material delivery, 10% after APDCL net metering commissioning.
2. Subsidy: PM Surya Ghar central DBT subsidy (₹${design.subsidyEligible?.toLocaleString('en-IN') || 0}) directly credited to client bank account post-inspection.
3. Execution Timeline: 10-15 working days from APDCL technical feasibility clearance.
4. Warranty: 25-Year performance warranty on solar modules; 5-Year manufacturer replacement warranty on inverters.
5. Quotation Validity: 30 days from date of issuance.`,
      notes: `Generated from Engineering Feasibility Design ${design.id} (${design.projectTitle}). Calculated Daily Output: ${design.dailyUnitsGen || 0} kWh/day.`
    };

    const updatedQuotes = [newQuote, ...quotations];
    setQuotations(updatedQuotes);
    saveErpData("quotations", updatedQuotes);
    recordAuditLog("QUOTE_FROM_ENGINEERING", "Engineering", `Converted Engineering BOQ ${design.id} to Quotation ${newQuote.id} for ${design.clientName}`);

    // Update design status to Quoted
    const updatedDesigns = engineeringDesigns.map(d => d.id === design.id ? { ...d, status: 'Quoted', quotationId: newQuote.id } : d);
    setEngineeringDesigns(updatedDesigns);
    saveErpData("engineering_designs", updatedDesigns);

    setCopiedNotification(`Quotation ${newQuote.id} created successfully! Redirecting to Quotations...`);
    setTimeout(() => {
      setCopiedNotification('');
      if (setActiveTab) setActiveTab('quotations');
    }, 1500);
  };

  // Print Official Technical Proposal & BOQ
  const handlePrintTechnicalBOQ = (design) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the engineering specification report.');
      return;
    }

    const itemsRows = (design.boqItems || []).map((item, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 10px; text-align: center; font-size: 11px; color: #64748b;">${idx + 1}</td>
        <td style="padding: 8px 10px; font-size: 11px; font-weight: 600; color: #1e293b;">${escapeHtml(item.item)}</td>
        <td style="padding: 8px 10px; text-align: center; font-size: 11px; color: #334155;">${item.qty} ${escapeHtml(item.unit || 'Nos')}</td>
        <td style="padding: 8px 10px; text-align: right; font-size: 11px; font-family: monospace; color: #334155;">₹${Number(item.rate).toLocaleString('en-IN')}</td>
        <td style="padding: 8px 10px; text-align: right; font-size: 11px; font-weight: bold; font-family: monospace; color: #0f172a;">₹${Number(item.amount).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Engineering Feasibility & BOQ — ${escapeHtml(design.id)}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 25px; color: #0f172a; background: #fff; }
          .container { max-width: 800px; margin: 0 auto; }
          .header-box { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 18px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin: 0 0 4px 0; }
          .badge { display: inline-block; padding: 3px 8px; font-size: 10px; font-weight: 800; border-radius: 4px; background: #0284c7; color: #fff; text-transform: uppercase; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; }
          .card-title { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
          .metric-row { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; }
          .metric-row:last-child { margin-bottom: 0; }
          .metric-bold { font-weight: bold; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #f1f5f9; padding: 8px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #475569; border-top: 1px solid #cbd5e1; border-bottom: 2px solid #cbd5e1; }
          .total-box { margin-top: 20px; padding: 12px 16px; background: #f8fafc; border-left: 4px solid #059669; border-radius: 4px; }
          .footer-note { font-size: 10px; color: #64748b; margin-top: 30px; border-top: 1px dashed #cbd5e1; padding-top: 10px; text-align: center; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="container">
          ${getCompanyPrintHeaderHtml()}
          
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 15px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
            <div>
              <span class="badge">TECHNICAL BOQ & FEASIBILITY REPORT</span>
              <h2 class="title" style="margin-top: 6px;">${escapeHtml(design.projectTitle)}</h2>
              <div style="font-size: 11px; color: #64748b;">Client: <strong>${escapeHtml(design.clientName)}</strong> (${escapeHtml(design.city || 'Silchar')})</div>
            </div>
            <div style="text-align: right; font-size: 11px;">
              <div>Document ID: <strong>${escapeHtml(design.id)}</strong></div>
              <div>Date: <strong>${escapeHtml(design.createdDate)}</strong></div>
              <div>Engineer: <strong>${escapeHtml(design.engineer || 'Technical Lead')}</strong></div>
            </div>
          </div>

          <!-- Technical Specs Highlights -->
          <div class="grid-2" style="margin-top: 15px;">
            <div class="card">
              <div class="card-title">System Technical Parameters</div>
              <div class="metric-row"><span>System Topology:</span><span class="metric-bold">${escapeHtml(design.systemType)}</span></div>
              <div class="metric-row"><span>Installed Capacity:</span><span class="metric-bold">${design.recommendedKw} kWp</span></div>
              <div class="metric-row"><span>Roof Structure Type:</span><span class="metric-bold">${escapeHtml(design.roofType)}</span></div>
              <div class="metric-row"><span>Rooftop Footprint:</span><span class="metric-bold">${design.requiredAreaSqFt} sq. ft.</span></div>
              <div class="metric-row"><span>Expected Generation:</span><span class="metric-bold">${design.dailyUnitsGen} kWh / Day</span></div>
            </div>

            <div class="card">
              <div class="card-title">Financial & Environmental Return</div>
              <div class="metric-row"><span>Gross Estimated Cost:</span><span class="metric-bold">₹${Number(design.estimatedCost).toLocaleString('en-IN')}</span></div>
              <div class="metric-row"><span>PM Surya Ghar Subsidy:</span><span class="metric-bold" style="color: #059669;">- ₹${Number(design.subsidyEligible || 0).toLocaleString('en-IN')}</span></div>
              <div class="metric-row"><span>Net Investment:</span><span class="metric-bold" style="font-size: 12px; color: #0284c7;">₹${Number(design.netClientCost).toLocaleString('en-IN')}</span></div>
              <div class="metric-row"><span>Est. Annual Savings:</span><span class="metric-bold">₹${Number(design.annualSavings || 0).toLocaleString('en-IN')}</span></div>
              <div class="metric-row"><span>25-Yr CO₂ Footprint Saved:</span><span class="metric-bold" style="color: #059669;">${design.co2OffsetTonnes25Yr || 0} Metric Tonnes</span></div>
            </div>
          </div>

          <!-- Bill of Quantities Table -->
          <table>
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">#</th>
                <th style="text-align: left;">Component Description / Engineering Specification</th>
                <th style="width: 80px; text-align: center;">Quantity</th>
                <th style="width: 100px; text-align: right;">Unit Rate (₹)</th>
                <th style="width: 120px; text-align: right;">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="total-box">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold;">
              <span>Total Turnkey Bill of Quantities (Excl. Tax):</span>
              <span style="font-family: monospace; font-size: 15px;">₹${Number(design.estimatedCost).toLocaleString('en-IN')}</span>
            </div>
            ${design.subsidyEligible > 0 ? `
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: #059669; margin-top: 4px;">
                <span>Less: Direct PM Surya Ghar Central Subsidy:</span>
                <span style="font-family: monospace;">- ₹${Number(design.subsidyEligible).toLocaleString('en-IN')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 6px; padding-top: 6px; border-top: 1px dashed #cbd5e1;">
                <span>Effective Net Investment for Client:</span>
                <span style="font-family: monospace; font-size: 16px; color: #0284c7;">₹${Number(design.netClientCost).toLocaleString('en-IN')}</span>
              </div>
            ` : ''}
          </div>

          <div class="footer-note">
            This is a computer-generated engineering feasibility specification by <strong>M/S COMPUTER PLANET</strong>.
            Authorized Solar EPC & Banking IT Hardware Solutions Provider | Club Road, Silchar, Assam - 788001 | Phone: +91 86380 83712
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Design ID', 'Client Name', 'Project Title', 'System Type', 'Capacity kWp', 'Gross Cost', 'Subsidy', 'Net Cost', 'Annual Savings', 'Engineer', 'Status'];
    const rows = engineeringDesigns.map(d => [
      d.id,
      `"${d.clientName || ''}"`,
      `"${d.projectTitle || ''}"`,
      `"${d.systemType || ''}"`,
      d.recommendedKw || 0,
      d.estimatedCost || 0,
      d.subsidyEligible || 0,
      d.netClientCost || 0,
      d.annualSavings || 0,
      `"${d.engineer || ''}"`,
      `"${d.status || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mcp_engineering_boq_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDeleteDesign = (id, name) => {
    if (window.confirm(`Are you sure you want to delete technical design ${id} (${name})?`)) {
      const updated = engineeringDesigns.filter(d => d.id !== id);
      setEngineeringDesigns(updated);
      saveErpData("engineering_designs", updated);
      recordAuditLog("ENGINEERING_DELETED", "Engineering", `Deleted technical design ${id} (${name})`);
    }
  };

  // Filtered designs
  const filteredDesigns = useMemo(() => {
    return engineeringDesigns.filter(d => {
      const q = search.toLowerCase();
      const matchesSearch = !q || 
        d.clientName?.toLowerCase().includes(q) ||
        d.projectTitle?.toLowerCase().includes(q) ||
        d.id?.toLowerCase().includes(q) ||
        d.city?.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
      const matchesType = typeFilter === 'All' || d.systemType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [engineeringDesigns, search, statusFilter, typeFilter]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Header & Sub-Navigation */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>Pillar 2: Technical Engineering & Pre-Sales</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Solar Sizing & Dynamic BOQ Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Calculate APDCL kWh rooftop capacity, generate engineering Bill of Quantities, and push 1-click quotes.
          </p>
        </div>

        {/* Sub-Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveSubTab('calculator')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'calculator' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SunMedium className="w-3.5 h-3.5 text-amber-500" />
            <span>Sizing Calculator</span>
          </button>

          <button
            onClick={() => setActiveSubTab('register')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'register' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
            <span>BOQ Register ({engineeringDesigns.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('builder')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'builder' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Custom BOQ Builder</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SOLAR SIZING & FEASIBILITY CALCULATOR */}
      {activeSubTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Inputs Column */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Site & Consumption Parameters</span>
            </h3>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Monthly APDCL Power Bill (₹)</label>
                <span className="text-xs font-mono font-bold text-teal-700">₹{calcInputs.monthlyBill.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={calcInputs.monthlyBill}
                onChange={(e) => setCalcInputs({ ...calcInputs, monthlyBill: Number(e.target.value) })}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>₹1,000 (Domestic)</span>
                <span>₹25,000 (Commercial)</span>
                <span>₹50,000 (Industrial)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Shadow-Free Rooftop Area (Sq. Ft.)</label>
                <span className="text-xs font-mono font-bold text-teal-700">{calcInputs.roofAreaSqFt} sq. ft.</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={calcInputs.roofAreaSqFt}
                onChange={(e) => setCalcInputs({ ...calcInputs, roofAreaSqFt: Number(e.target.value) })}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>100 sq.ft (1 kW)</span>
                <span>1,000 sq.ft (10 kW)</span>
                <span>5,000 sq.ft (50 kW)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Roof Surface Type</label>
                <select
                  value={calcInputs.roofType}
                  onChange={(e) => setCalcInputs({ ...calcInputs, roofType: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                >
                  {ROOF_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">System Topology</label>
                <select
                  value={calcInputs.systemType}
                  onChange={(e) => setCalcInputs({ ...calcInputs, systemType: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                >
                  {SYSTEM_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Tariff Bracket</label>
                <select
                  value={calcInputs.clientSector}
                  onChange={(e) => setCalcInputs({ ...calcInputs, clientSector: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                >
                  <option value="Residential (PM Surya Ghar)">Residential (PM Surya Ghar)</option>
                  <option value="Commercial / Hospital">Commercial / Clinic / Hotel</option>
                  <option value="Institutional / School">School / College / NGO</option>
                  <option value="Industrial / Tea Garden">Industrial / Tea Garden</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">APDCL Tariff (₹/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  value={calcInputs.tariffPerUnit}
                  onChange={(e) => setCalcInputs({ ...calcInputs, tariffPerUnit: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>
            </div>

            <button
              onClick={handleLoadCalculatorIntoBuilder}
              className="w-full mt-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition"
            >
              <span>Build Complete BOQ from this Sizing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Computed Outputs Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary KPI Hero Box */}
            <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block mb-1">
                    Recommended Engineering Capacity
                  </span>
                  <div className="text-4xl sm:text-5xl font-black font-mono text-teal-300">
                    {calculatedMetrics.recommendedKw} <span className="text-xl font-normal font-sans text-slate-300">kWp</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Offsets ~{calculatedMetrics.monthlyUnits} kWh / month based on Barak Valley 4.1 PSH radiation.
                  </p>
                </div>

                <div className="p-3 bg-teal-500/20 text-teal-300 rounded-2xl border border-teal-500/30">
                  <SunMedium className="w-8 h-8" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80">
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Daily Generation</div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">{calculatedMetrics.dailyGenUnits} kWh</div>
                  <div className="text-[10px] text-teal-400">units/day</div>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Area Required</div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">{calculatedMetrics.requiredArea} sq ft</div>
                  <div className={`text-[10px] ${calculatedMetrics.hasEnoughSpace ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {calculatedMetrics.hasEnoughSpace ? '✓ Space OK' : '⚠️ Area Limited'}
                  </div>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Savings</div>
                  <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">₹{calculatedMetrics.monthlySavings.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-400">₹{calculatedMetrics.annualSavings.toLocaleString('en-IN')}/yr</div>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Simple Payback</div>
                  <div className="text-base font-bold font-mono text-amber-400 mt-0.5">{calculatedMetrics.paybackYears} Years</div>
                  <div className="text-[10px] text-slate-400">25-Yr Lifetime</div>
                </div>
              </div>
            </div>

            {/* Financial & Environmental Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Financial Box */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="text-xs font-bold text-slate-900 uppercase flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-teal-600" />
                    <span>Cost & Subsidy Estimate</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">Turnkey EPC</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Gross System Cost:</span>
                    <strong className="font-mono text-slate-800">₹{calculatedMetrics.estimatedCost.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>PM Surya Ghar Central Subsidy:</span>
                    <strong className="font-mono">- ₹{calculatedMetrics.subsidy.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-bold text-slate-900 text-sm">
                    <span>Net Client Investment:</span>
                    <span className="font-mono text-teal-700 text-base">₹{calculatedMetrics.netCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {calculatedMetrics.subsidy > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] leading-relaxed">
                    🌟 <strong>DBT Subsidy Direct to Client:</strong> Eligible for ₹{calculatedMetrics.subsidy.toLocaleString('en-IN')} through National Portal under PM Surya Ghar.
                  </div>
                )}
              </div>

              {/* Environmental Box */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="text-xs font-bold text-slate-900 uppercase flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Green Energy & Carbon Offset</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">25 Years</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">CO₂ Emissions Offset:</span>
                    <strong className="font-mono text-emerald-700">{calculatedMetrics.co2Tonnes} Metric Tonnes</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Equivalent Trees Planted:</span>
                    <strong className="font-mono text-emerald-700">{Math.round(calculatedMetrics.co2Tonnes * 16)} Teak Trees</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Coal Consumption Saved:</span>
                    <strong className="font-mono text-slate-800">{Math.round(calculatedMetrics.co2Tonnes * 0.4 * 10) / 10} Tonnes</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 text-[11px] leading-relaxed">
                  🌱 <strong>Cachar Environmental Impact:</strong> A {calculatedMetrics.recommendedKw} kWp rooftop plant displaces ~{Math.round(calculatedMetrics.dailyGenUnits * 365)} units of grid thermal power every year.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOQ REGISTER & DESIGNS DIRECTORY */}
      {activeSubTab === 'register' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client, project title, design ID or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-700"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Under Review">Under Review</option>
                <option value="Quoted">Quoted</option>
                <option value="Draft">Draft</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-700"
              >
                <option value="All">All Topologies</option>
                {SYSTEM_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <button
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Designs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDesigns.map((d) => (
              <div 
                key={d.id} 
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {d.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      d.status === 'Quoted' ? 'bg-blue-100 text-blue-800' :
                      d.status === 'Under Review' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {d.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1" title={d.projectTitle}>
                    {d.projectTitle}
                  </h3>
                  <div className="text-xs text-slate-600 font-semibold mb-3 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{d.clientName}</span>
                  </div>

                  {/* Sizing & Specs Box */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Topology:</span>
                      <strong className="text-slate-800">{d.systemType}</strong>
                    </div>
                    {d.recommendedKw > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Capacity:</span>
                        <strong className="font-mono text-teal-700">{d.recommendedKw} kWp</strong>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">BOQ Items:</span>
                      <strong className="text-slate-800">{d.boqItems?.length || 0} Components</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                      <span className="text-slate-700">Turnkey Value:</span>
                      <span className="font-mono text-slate-900">₹{Number(d.estimatedCost).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedDesignForView(d)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View BOQ</span>
                  </button>

                  <button
                    onClick={() => handlePrintTechnicalBOQ(d)}
                    className="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition"
                    title="Print technical specification report"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={() => handlePushToQuotation(d)}
                    className="py-1.5 px-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition"
                    title="Generate official quotation from this BOQ"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Quote</span>
                  </button>

                  <button
                    onClick={() => handleDeleteDesign(d.id, d.projectTitle)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                    title="Delete design"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDesigns.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No technical designs match the selected filters.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CUSTOM BOQ BUILDER */}
      {activeSubTab === 'builder' && (
        <div className="bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Custom Engineering BOQ Studio</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Assemble component line items, specify module makes, and calculate total turnkey price.
              </p>
            </div>

            {/* Template Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Quick Templates:</span>
              <button
                onClick={() => handleLoadPreset('solar3kW')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-200"
              >
                3 kW Solar
              </button>
              <button
                onClick={() => handleLoadPreset('solar5kWHybrid')}
                className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-[11px] border border-teal-200"
              >
                5 kW Hybrid
              </button>
              <button
                onClick={() => handleLoadPreset('solar10kWOnGrid')}
                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-[11px] border border-sky-200"
              >
                10 kW Commercial
              </button>
              <button
                onClick={() => handleLoadPreset('itBankInfrastructure')}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-[11px] border border-indigo-200"
              >
                Banking IT
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveDesign} className="space-y-6">
            {/* Primary Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Client / Entity Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Green Valley Tea Estate"
                  value={builderForm.clientName}
                  onChange={(e) => setBuilderForm({ ...builderForm, clientName: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 kWp On-Grid Solar Plant"
                  value={builderForm.projectTitle}
                  onChange={(e) => setBuilderForm({ ...builderForm, projectTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">System Topology</label>
                <select
                  value={builderForm.systemType}
                  onChange={(e) => setBuilderForm({ ...builderForm, systemType: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                >
                  {SYSTEM_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City / Circle</label>
                <input
                  type="text"
                  placeholder="Silchar"
                  value={builderForm.city}
                  onChange={(e) => setBuilderForm({ ...builderForm, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>
            </div>

            {/* Sizing Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">System Capacity (kWp)</label>
                <input
                  type="number"
                  step="0.1"
                  value={builderForm.recommendedKw}
                  onChange={(e) => setBuilderForm({ ...builderForm, recommendedKw: Number(e.target.value) })}
                  className="w-full mt-1 px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">PM Surya Ghar Subsidy (₹)</label>
                <input
                  type="number"
                  value={builderForm.subsidyEligible}
                  onChange={(e) => setBuilderForm({ ...builderForm, subsidyEligible: Number(e.target.value) })}
                  className="w-full mt-1 px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 bg-white text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Daily Generation (Units)</label>
                <input
                  type="number"
                  step="0.1"
                  value={builderForm.dailyUnitsGen}
                  onChange={(e) => setBuilderForm({ ...builderForm, dailyUnitsGen: Number(e.target.value) })}
                  className="w-full mt-1 px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Annual Savings (₹)</label>
                <input
                  type="number"
                  value={builderForm.annualSavings}
                  onChange={(e) => setBuilderForm({ ...builderForm, annualSavings: Number(e.target.value) })}
                  className="w-full mt-1 px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            {/* Dynamic BOQ Line Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>Bill of Quantities Components ({builderForm.boqItems.length})</span>
                </h3>

                <button
                  type="button"
                  onClick={handleAddBoqItem}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold flex items-center gap-1 border border-teal-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Component / Specification</th>
                      <th className="p-3 w-24">Qty</th>
                      <th className="p-3 w-24">Unit</th>
                      <th className="p-3 w-32">Rate (₹)</th>
                      <th className="p-3 w-32">Amount (₹)</th>
                      <th className="p-3 w-12 text-center">Del</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {builderForm.boqItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2">
                          <input
                            type="text"
                            required
                            placeholder="Component Description (e.g. 540W Waaree Solar Modules)"
                            value={item.item}
                            onChange={(e) => handleBoqItemChange(idx, 'item', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => handleBoqItemChange(idx, 'qty', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 text-center"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.unit || 'Nos'}
                            onChange={(e) => handleBoqItemChange(idx, 'unit', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-center"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleBoqItemChange(idx, 'rate', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 text-right"
                          />
                        </td>
                        <td className="p-2 font-mono font-bold text-right text-slate-900 pr-4">
                          ₹{Number(item.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveBoqItem(idx)}
                            className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Summary Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">
                  Total of {builderForm.boqItems.length} components calculated.
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="font-semibold text-slate-600">Gross Turnkey Value:</span>
                  <span className="text-xl font-black font-mono text-slate-900">
                    ₹{builderBoqTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveSubTab('register')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Engineering Design</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BOQ DETAILED VIEW MODAL */}
      {selectedDesignForView && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold font-mono text-teal-700 uppercase bg-teal-50 px-2 py-0.5 rounded">
                  {selectedDesignForView.id}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedDesignForView.projectTitle}
                </h2>
                <div className="text-xs text-slate-500">
                  Client: <strong>{selectedDesignForView.clientName}</strong> ({selectedDesignForView.city || 'Silchar'})
                </div>
              </div>

              <button
                onClick={() => setSelectedDesignForView(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spec Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Topology</span>
                <strong className="text-slate-800">{selectedDesignForView.systemType}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Capacity</span>
                <strong className="font-mono text-teal-700">{selectedDesignForView.recommendedKw} kWp</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Subsidy</span>
                <strong className="font-mono text-emerald-700">₹{Number(selectedDesignForView.subsidyEligible || 0).toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Net Cost</span>
                <strong className="font-mono text-slate-900">₹{Number(selectedDesignForView.netClientCost).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* BOQ Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Bill of Quantities Components</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Component / Spec</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Unit Rate</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {(selectedDesignForView.boqItems || []).map((b, i) => (
                      <tr key={i}>
                        <td className="p-2.5 text-slate-400 text-center">{i + 1}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{b.item}</td>
                        <td className="p-2.5 text-center font-mono">{b.qty} {b.unit}</td>
                        <td className="p-2.5 text-right font-mono">₹{Number(b.rate).toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900">₹{Number(b.amount).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => handlePrintTechnicalBOQ(selectedDesignForView)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Report</span>
              </button>

              <button
                onClick={() => handlePushToQuotation(selectedDesignForView)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Send className="w-4 h-4" />
                <span>Convert to Commercial Quotation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
