export interface GenerateMessageResult {
  success: boolean;
  message?: string;
  error?: string;
}

const APIFREELLM_ENDPOINT = 'https://api.apifreeellm.com/v1/chat/completions';

export const generateCommitMessage = async (
  diff: string,
  apiKey: string
): Promise<GenerateMessageResult> => {
  if (!diff || diff.trim().length === 0) {
    return {
      success: false,
      error: '⚠ Nothing to commit — working tree is clean.',
    };
  }

  if (!apiKey || apiKey.trim().length === 0) {
    return {
      success: false,
      error: '⚠ API key is empty or invalid.',
    };
  }

  const truncatedDiff = diff.length > 3000 ? diff.substring(0, 3000) + '\n...(truncated)' : diff;

  const systemPrompt = `You are a helpful assistant that generates concise, conventional git commit messages.
Given a git diff, generate a single commit message following the conventional commits format:
- Start with a type: feat, fix, docs, style, refactor, perf, test, chore, ci
- Format: "type(scope): subject" where scope is optional
- Subject should be lowercase, imperative, max 50 chars
- No period at the end
Only respond with the commit message, nothing else.`;

  const userPrompt = `Generate a commit message for this diff:\n\n${truncatedDiff}`;

  try {
    const response = await fetch(APIFREELLM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error: '⚠ Invalid API key. Check your key is correct.',
        };
      } else if (response.status === 429) {
        return {
          success: false,
          error: '⚠ Rate limit reached. Please wait a moment.',
        };
      } else if (response.status === 404) {
        return {
          success: false,
          error: '⚠ API endpoint not found. Check apifreellm.com status.',
        };
      } else {
        const text = await response.text();
        return {
          success: false,
          error: `⚠ API error ${response.status}. Try again later.`,
        };
      }
    }

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };

    if (!data.choices || !data.choices[0]?.message?.content) {
      return {
        success: false,
        error: '⚠ No response from API. Please try again.',
      };
    }

    const message = data.choices[0].message.content.trim();
    if (!message) {
      return {
        success: false,
        error: '⚠ Empty message generated. Please try again.',
      };
    }

    return { success: true, message };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';

    if (
      error.includes('fetch') ||
      error.includes('ENOTFOUND') ||
      error.includes('ECONNREFUSED') ||
      error.includes('ERR_')
    ) {
      return {
        success: false,
        error: '⚠ Network error. Check internet connection and try again.',
      };
    }

    if (error.includes('JSON')) {
      return {
        success: false,
        error: '⚠ API response invalid. API may be down.',
      };
    }

    return {
      success: false,
      error: '⚠ AI error: ' + error.substring(0, 50),
    };
  }
};
