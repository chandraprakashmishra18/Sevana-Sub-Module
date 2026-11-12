const KEY="sevana_demo_beneficiary_programs";
export function getBeneficiaryPrograms(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return[]}}
export function saveBeneficiaryProgram(program){const saved=getBeneficiaryPrograms();const next={...program,id:`beneficiary-program-${Date.now()}`,createdAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify([next,...saved]));return next}
