const thresholds = [0, 100, 300, 700, 1500];
const names = ["New Member", "Sprout", "Sapling", "Tree of Impact", "Legend"];
const colors = ["#64748b", "#16a34a", "#15803d", "#0f766e", "#7c3aed"];
export function getTierForXP(xp = 0) { const index = thresholds.reduce((result, threshold, i) => (xp >= threshold ? i : result), 0); return { name: names[index], color: colors[index] }; }
export function getNextTierProgress(xp = 0) { const index = thresholds.reduce((result, threshold, i) => (xp >= threshold ? i : result), 0); const next = thresholds[index + 1]; return { nextTier: names[index + 1] || null, xpNeeded: next ? next - xp : 0, progressPercent: next ? Math.max(0, Math.min(100, Math.round(((xp - thresholds[index]) / (next - thresholds[index])) * 100))) : 100 }; }
