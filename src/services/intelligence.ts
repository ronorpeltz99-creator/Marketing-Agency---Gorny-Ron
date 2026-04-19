import Anthropic from '@anthropic-ai/sdk';
import { getApiKey } from '@/utils/keys';

/**
 * Intelligence Service - PRODUCTION READY
 * Responsibility: Real-world competitor analysis using live search and AI.
 */
export class IntelligenceService {
  async analyzeCompetitors(productUrl: string) {
    console.log(`[IntelAgent] PERFORMING REAL RESEARCH FOR: ${productUrl}`);
    
    const serperKey = await getApiKey('serper');
    const anthropicKey = await getApiKey('anthropic');

    if (!serperKey || !anthropicKey) {
      throw new Error('Missing API keys for research (serper or anthropic). Please configure them in the Command Center.');
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey });

    // 1. Identify the product from the URL
    const identifyPrompt = `Extract the main product name and category from this URL: ${productUrl}. Return only the product name (e.g. "130,000 RPM Jet Fan").`;
    const idResponse = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 50,
      messages: [{ role: 'user', content: identifyPrompt }]
    });

    const productName = idResponse.content[0].type === 'text' ? idResponse.content[0].text.trim() : 'this product';

    // 2. Search for competitors
    const searchQuery = `"${productName}" shopify store competitors price facebook ads`;
    console.log(`[IntelAgent] Searching for: ${searchQuery}`);

    const searchResponse = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: searchQuery, num: 10 })
    });
    
    const searchData = await searchResponse.json();

    // 3. Analyze results with Claude to extract structured data
    const analyzePrompt = `
      You are an expert E-commerce Market Researcher. 
      Analyze the following search results for the product: ${productName} (URL: ${productUrl}).
      
      Search Results:
      ${JSON.stringify(searchData.organic, null, 2)}
      
      Task:
      1. Identify the top 3 direct competitors (actual stores, not marketplaces like Amazon/AliExpress).
      2. For each competitor, provide:
         - Name
         - Price (estimate if not explicitly clear)
         - Estimated Ad Activity (e.g. "High", "Moderate", "Low" based on search presence)
         - Store URL
         - A generated link to their Facebook Ads Library (format: https://www.facebook.com/ads/library/?view_all_page_id=[GUESS_OR_LEAVE_BLANK_IF_UNKNOWN])
      3. Generate 3 winning marketing hooks for this product:
         - Benefit-driven (The "What's in it for me")
         - Emotional (The "Feeling")
         - Savings/Logic-driven (The "Smart Choice")
      4. Suggest a premium branded store name.
      5. Define the specific target audience.
      
      Return ONLY a valid JSON object in this exact format:
      {
        "competitors": [
          { "id": 1, "name": "Name", "price": "$XX.XX", "ads": 10, "url": "https://...", "adsUrl": "https://..." }
        ],
        "winningHooks": [
          { "id": 1, "text": "Hook text", "type": "Benefit" }
        ],
        "suggestedStoreName": "Branded Name",
        "targetAudience": "Audience description"
      }
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1500,
      messages: [{ role: 'user', content: analyzePrompt }]
    });

    const textContent = response.content[0].type === 'text' ? response.content[0].text : '';
    
    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(textContent);
      
      // Ensure IDs are consistent for the UI
      result.competitors = result.competitors.map((c: any, i: number) => ({ ...c, id: 101 + i }));
      result.winningHooks = result.winningHooks.map((h: any, i: number) => ({ ...h, id: 201 + i }));
      
      return result;
    } catch (err) {
      console.error('Failed to parse Claude analysis:', textContent);
      throw new Error('Failed to generate structured market data from AI analysis.');
    }
  }
}
