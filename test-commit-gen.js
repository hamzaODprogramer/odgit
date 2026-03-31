#!/usr/bin/env node

// Test API with real git diff
const apiKey = 'apf_omp176bmntpkgtzi3nl4v5pv';

const exampleDiff = `diff --git a/src/app.tsx b/src/app.tsx
index 1234567..abcdefg 100644
--- a/src/app.tsx
+++ b/src/app.tsx
@@ -5,6 +5,15 @@ import { Box, Text, useInput } from 'ink';

 export const App = () => {
   const [count, setCount] = useState(0);
+  const [user, setUser] = useState(null);
+
+  const login = async (email, password) => {
+    const res = await fetch('/api/auth/login', {
+      method: 'POST',
+      body: JSON.stringify({ email, password }),
+    });
+    const data = await res.json();
+    setUser(data.user);
+  };

   return (
     <Box>`;

const prompt = `You are a git commit message generator. Analyze this git diff and generate ONLY a single conventional commit message. Nothing else, just the message.

Rules:
- Start with type: feat, fix, docs, style, refactor, perf, test, chore, ci
- Format: "type(scope): subject" where scope is optional
- Subject must be lowercase, imperative, max 50 chars
- No period at end
- ONLY output ONE commit message line

Git diff:
${exampleDiff}`;

console.log('Sending commit message request to API...');
console.log('Prompt length:', prompt.length);
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

  console.log('Status:', response.status);

  const data = await response.json();

  if (data.success) {
    console.log('✓ Success!');
    console.log('Response field:', typeof data.response);
    console.log('');
    console.log('Generated commit message:');
    console.log(data.response);
  } else {
    console.log('✗ API returned success: false');
    console.log(JSON.stringify(data, null, 2));
  }
} catch (err) {
  console.error('Error:', err.message);
}
