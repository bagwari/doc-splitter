function normalizeText(text) {
  return text
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

function getPANConfidenceScore(text) {
  let score = 0;

  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;

  if (panRegex.test(text)) score += 50;
  if (text.includes('INCOME TAX DEPARTMENT')) score += 20;
  if (text.includes('PERMANENT ACCOUNT NUMBER')) score += 15;
  if (text.includes(' PAN ')) score += 10;
  if (text.includes('GOVERNMENT OF INDIA')) score += 5;

  return Math.min(score, 100);
}

function containsHindi(text) {
  // Unicode range for Devanagari
  return /[\u0900-\u097F]/.test(text);
}

function getAadhaarConfidenceScore(text) {
  let score = 0;

  const aadhaarRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/;

  if (aadhaarRegex.test(text)) score += 50;
  if (text.includes('UIDAI')) score += 15;
  if (text.includes('AADHAAR')) score += 10;
  if (text.includes('GOVERNMENT OF INDIA')) score += 10;
  if (text.includes('DOB') || text.includes('YEAR OF BIRTH')) score += 10;
  if (containsHindi(text)) score += 5;

  return Math.min(score, 100);
}


function identifyDocumentWithConfidence(rawText) {
  const text = normalizeText(rawText);

  const panScore = getPANConfidenceScore(text);
  const aadhaarScore = getAadhaarConfidenceScore(text);

  if (panScore >= 70 && panScore > aadhaarScore) {
    return {
      documentType: 'PAN_CARD',
      confidence: panScore
    };
  }

  if (aadhaarScore >= 70 && aadhaarScore > panScore) {
    return {
      documentType: 'AADHAAR_CARD',
      confidence: aadhaarScore
    };
  }

  return {
    documentType: 'UNKNOWN',
    confidence: Math.max(panScore, aadhaarScore)
  };
}


const textractText = `
Government of India
भारत सरकार
Unique Identification Authority of India
UIDAI

Name: RAMESH KUMAR
नाम: रमेश कुमार

DOB: 12/04/1990
लिंग / Gender: MALE

1234 5678 9012
`;

console.log(identifyDocumentWithConfidence(textractText));
