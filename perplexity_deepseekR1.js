export default async function main(args) {
  const { inputVars } = args;
  let { prompt, perplexityApiKey, maxTokens } = inputVars;

  // Step 1: Input validation and preprocessing
  prompt = prompt?.trim() || '';
  perplexityApiKey = perplexityApiKey?.trim() || '';
  maxTokens = maxTokens ? Math.round(parseFloat(maxTokens)) : undefined;

  // Step 2: Check for required inputs
  if (!perplexityApiKey) {
    return {
      outputVars: { error: 'Please provide your Perplexity API key', think: '', answer: '' },
      next: { path: 'error' },
      trace: [{ type: 'debug', payload: { message: 'No Perplexity API key provided' } }],
    };
  }
  if (!prompt) {
    return {
      outputVars: { error: 'No prompt provided', think: '', answer: '' },
      next: { path: 'error' },
      trace: [{ type: 'debug', payload: { message: 'No prompt value' } }],
    };
  }

  try {
    // Step 3: Prepare API request
    const url = 'https://api.perplexity.ai/chat/completions';
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-reasoning',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant specializing in peer-to-peer carsharing services and the sharing economy. Your primary goal is to provide extremely concise, clear, and accurate answers about carsharing, with particular expertise about Turo's platform. Follow these guidelines strictly:

1. Conciseness: Aim for shorter responses that fully address queries. Use simple language and avoid unnecessary details. Each response should ideally be no more than 3-4 short sentences. If a longer response is absolutely necessary, use bullet points.

2. Relevance: If a question does not relate to carsharing, vehicle rentals, or the sharing economy, respond only with: "I can only provide information related to carsharing and peer-to-peer vehicle rentals."

3. Language: Maintain clear, professional language that's easy to understand.

4. Ambiguity: For ambiguous questions, provide a direct, concise answer or briefly state if the information is not available.

5. Safety Guardrails:
   - Never provide harmful or unethical information
   - Do not make recommendations beyond carsharing and vehicle rentals
   - If unsure, briefly state the lack of sufficient information
   - Focus on general industry knowledge and best practices
   - Avoid making specific claims about insurance coverage or legal advice
   - For specific policy questions, direct users to check the platform's current terms

6. Recommendations: When discussing industry examples, you may reference Turo as a leading platform while maintaining objectivity about the broader market.

7. Accuracy: Ensure all information about carsharing practices, safety, and industry standards is current and factual.

Remember: Prioritize brevity over comprehensiveness. Ensure your entire response fits within ${maxTokens || 'the default'} tokens.`,
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.2,
        top_p: 0.9,
        return_citations: false,
        search_domain_filter: [
          'turo.com',
          'support.turo.com',
          'carsharing.org',
          'sharedmobility.org',
          'transportation.gov',
          'nhtsa.gov'
        ],
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'year',
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1,
      }),
    };

    // Step 4: Make API request
    const response = await fetch(url, options);
    const result = await response.json;

    // Step 5: Handle API response
    if (response.ok && result.choices && result.choices.length > 0) {
      const content = result.choices[0].message.content || '';

      // Extract <think>...</think> into 'think' and everything else into 'answer'
      let think = '';
      let answer = content.trim();

      const thinkRegex = /<think>([\s\S]*?)<\/think>/;
      const match = content.match(thinkRegex);
      if (match) {
        think = match[1].trim();
        answer = content.replace(thinkRegex, '').trim();
      }

      return {
        outputVars: { answer, think, error: '' },
        next: { path: 'success' },
        trace: [{ type: 'text', payload: { message: answer } }],
      };
    } else {
      const errorMessage = result.error?.message || 'Unable to get an answer';
      return {
        outputVars: { answer: '', think: '', error: errorMessage },
        next: { path: 'error' },
        trace: [{ type: 'debug', payload: { message: errorMessage } }],
      };
    }
  } catch (error) {
    return {
      outputVars: { answer: '', think: '', error: error.toString() },
      next: { path: 'error' },
      trace: [{ type: 'debug', payload: { message: `Error: ${error}` } }],
    };
  }


}