#!/usr/bin/env node

// Quick debug script to test apifreellm API
// No imports needed - native fetch in Node 18+

const apiKey = 'apf_omp176bmntpkgtzi3nl4v5pv';

const prompt = 'feat: add user login system';

console.log('Testing apifreellm.com API...');
console.log('Endpoint: https://apifreellm.com/api/v1/chat');
console.log('Key:', apiKey.substring(0, 10) + '...');
console.log('');

try {
  const response = await fetch('https://apifreellm.com/api/v1/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      message: prompt,
    }),
  });

  console.log('Status:', response.status, response.statusText);
  console.log('Headers:', Object.fromEntries(response.headers));
  console.log('');

  const text = await response.text();
  console.log('RAW Response (first 500 chars):');
  console.log(text.substring(0, 500));
  console.log('');

  if (text) {
    try {
      const data = JSON.parse(text);
      console.log('Parsed JSON:');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Not valid JSON');
    }
  }
} catch (err) {
  console.error('Error:', err.message);
}

