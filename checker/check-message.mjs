// Notification content checker, implementing the contract at the end of policy.md.
// Self-contained on purpose: no imports, no console, no file access. The grader
// runs it in a sandbox, so the policy rules are embedded here.

// Sensitive clinical terms from policy.md, matched as listed, ignoring case.
// "positive result" is one phrase; "positive" on its own is not a violation.
const CLINICAL_TERMS = [
  'glucose',
  'hemoglobin',
  'positive result',
  'diabetes',
  'metformin',
  'chemotherapy',
];

// Numeric clinical measurements such as "7.2 mmol/L" or "130 mg/dL": a number
// followed by a clinical unit. Plain numbers (support hours, phone numbers,
// version labels) do not match.
const MEASUREMENT =
  /\d+(?:[.,]\d+)?\s*(?:mmol\s*\/\s*l|mg\s*\/\s*dl|g\s*\/\s*dl|mg\s*\/\s*l|ng\s*\/\s*ml|pg\s*\/\s*ml|meq\s*\/\s*l|[mµμu]?iu\s*\/\s*m?l|u\s*\/\s*l|mmhg|mcg|µg|μg|mg)(?![a-z])/i;

// Invisible or spacing characters that could split a term ("gluc​ose").
const INVISIBLE = /[­᠎​-‏⁠-⁤﻿]/g;

function normalise(text) {
  let t = text;
  try {
    t = t.normalize('NFKC');
  } catch (e) {
    // keep the original text if normalisation is unavailable
  }
  return t.replace(INVISIBLE, '').replace(/\s+/g, ' ').toLowerCase();
}

export function checkMessage(message) {
  try {
    let body;
    try {
      body = message == null ? undefined : message.body;
    } catch (e) {
      body = undefined;
    }

    if (typeof body !== 'string' || body.trim() === '') {
      return { allowed: false, violations: ['INVALID_BODY'] };
    }

    const text = normalise(body);
    const violations = [];

    if (CLINICAL_TERMS.some((term) => text.includes(term))) {
      violations.push('CLINICAL_TERM');
    }
    if (MEASUREMENT.test(text)) {
      violations.push('CLINICAL_MEASUREMENT');
    }

    return { allowed: violations.length === 0, violations };
  } catch (e) {
    return { allowed: false, violations: ['CHECK_ERROR'] };
  }
}
