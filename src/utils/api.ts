export interface GenerateMessageResult {
  success: boolean;
  message?: string;
  error?: string;
}

const APIFREELLM_ENDPOINT = 'https://apifreellm.com/api/v1/chat';

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

  const truncatedDiff = diff.length > 2000 ? diff.substring(0, 2000) + '\n...(truncated)' : diff;

  const prompt = `You are a git commit message generator. Analyze this git diff and generate ONLY a single conventional commit message. Nothing else, just the message.

Rules:
- Start with type: feat, fix, docs, style, refactor, perf, test, chore, ci
- Format: "type(scope): subject" where scope is optional
- Subject must be lowercase, imperative, max 50 chars
- No period at end
- ONLY output ONE commit message line

Git diff:
${truncatedDiff}`;

  try {
    const response = await fetch(APIFREELLM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        message: prompt,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error: '⚠ Invalid API key. Check your key at apifreellm.com',
        };
      } else if (response.status === 429) {
        return {
          success: false,
          error: '⚠ Rate limit reached. Wait a moment and try again.',
        };
      } else if (response.status === 404) {
        return {
          success: false,
          error: '⚠ API endpoint not found. Check apifreellm.com status.',
        };
      } else {
        return {
          success: false,
          error: `⚠ API error ${response.status}. Try again later.`,
        };
      }
    }

    const data = await response.json() as Record<string, unknown>;

    // The API returns { success, response, provider, model, ... }
    const message = typeof data.response === 'string' ? data.response : null;

    if (!message || typeof message !== 'string') {
      return {
        success: false,
        error: '⚠ Empty response from API. Try again.',
      };
    }

    const trimmed = message.trim();
    if (!trimmed) {
      return {
        success: false,
        error: '⚠ Empty message generated. Try again.',
      };
    }

    return { success: true, message: trimmed };
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
        error: '⚠ Network error. Check internet and try again.',
      };
    }

    if (error.includes('JSON')) {
      return {
        success: false,
        error: '⚠ Invalid response. API may be down.',
      };
    }

    return {
      success: false,
      error: '⚠ Error: ' + error.substring(0, 40),
    };
  }
};
