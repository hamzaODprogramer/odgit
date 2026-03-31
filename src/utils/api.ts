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

  // Truncate diff to prevent token limits
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
          error: '⚠ Invalid API key. Run "change api key" to update it.',
        };
      } else if (response.status === 429) {
        return {
          success: false,
          error: '⚠ Rate limit reached. Please wait a moment and try again.',
        };
      } else {
        return {
          success: false,
          error: `⚠ API error (${response.status}). Please try again.`,
        };
      }
    }

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };

    if (!data.choices || !data.choices[0]?.message?.content) {
      return {
        success: false,
        error: '⚠ AI error. Please try again.',
      };
    }

    const message = data.choices[0].message.content.trim();
    return { success: true, message };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';

    if (error.includes('fetch') || error.includes('ENOTFOUND') || error.includes('ECONNREFUSED')) {
      return {
        success: false,
        error: '⚠ Network error. Check your internet connection.',
      };
    }

    return {
      success: false,
      error: '⚠ AI error. Please try again.',
    };
  }
};
