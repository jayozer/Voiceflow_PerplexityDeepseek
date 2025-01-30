# Perplexity Deepseek R1 API Integration
A powerful integration for leveraging Perplexity's AI capabilities to generate thoughtful, reasoned responses to queries.

![sonar.jpg](images/sonar.jpg)

## How It Works
The Perplexity API function processes queries in two distinct steps:
1. **Reasoning Phase**: Analyzes the query to generate thoughtful reasoning (think)
2. **Answer Generation**: Produces a concise, clear answer based on the reasoning

## Features
- **Structured Responses**: Separates reasoning from final answers for transparency
- **Configurable Token Limits**: Customize response length via maxTokens parameter
- **Error Handling**: Robust error management with clear error paths

## Inputs
- **maxTokens**
  - Description: Maximum number of tokens allowed in the response
  - Type: Number
  
- **prompt**
  - Description: The user's query or input text
  - Type: String
  
- **perplexityAPIKey**
  - Description: Your Perplexity API authentication key
  - Type: String

## Outputs
- **think**
  - Description: The reasoning/thought process behind the answer
  - Type: String
  
- **answer**
  - Description: The final response to the user's query
  - Type: String
  
- **error**
  - Description: Error message if something goes wrong
  - Type: String

## Paths
- **success**
  - Description: Indicates successful query processing and response generation
  
- **error**
  - Description: Indicates an error occurred during processing

## Getting Started
### Prerequisites
- A valid Perplexity API key
- Basic understanding of API integration

### Integration Steps
1. Obtain your Perplexity API key
2. Configure the maxTokens parameter based on your needs
3. Prepare your prompt/query
4. Handle both success and error paths in your implementation

## Usage Example

```javascript
// Input
{
"maxTokens": 1000,
"prompt": "What are the requirements to list my car on Turo?",
"perplexityAPIKey": "your-api-key-here"
}
// Success Output
{
"think": "Analyzing Turo's vehicle listing requirements, including age, condition, and registration standards...",
"answer": "To list on Turo, your car must be 12 years old or newer, have less than 130,000 miles, and have a clean title. You'll need valid registration, insurance, and to pass Turo's vehicle inspection standards. Certain luxury or specialty vehicles may have different age requirements.",
"error": null
}
// Error Output
{
"think": null,
"answer": null,
"error": "API key invalid or request failed"
}
```

## Error Handling
The function handles various error scenarios including:
- Invalid API key
- Network connectivity issues
- Token limit exceeded
- Invalid prompt format

## Best Practices
1. Always validate inputs before making API calls
2. Implement proper error handling
3. Monitor token usage to optimize costs
4. Cache responses when appropriate