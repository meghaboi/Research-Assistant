
export const fetchUrlContent = async (url: string): Promise<string> => {
  if (!url) {
    throw new Error('No URL provided.');
  }

  // Fix: Switched to a different CORS proxy to avoid Cloudflare blocks.
  const proxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(proxyUrl, {
        headers: {
            // Some sites might block requests without a user-agent
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content from ${url}. Status: ${response.status}`);
    }

    const html = await response.text();

    // Add specific check for Cloudflare block page.
    if (html.includes('<title>Attention Required! | Cloudflare</title>')) {
        throw new Error('The request was blocked by a security service.');
    }

    // Use DOMParser to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Attempt to find the main content area for better results, falling back to body
    const mainContent = doc.querySelector('main') || doc.querySelector('article') || doc.body;

    if (!mainContent) {
        throw new Error("Could not parse the main content of the page.");
    }
    
    // Remove script and style elements to clean up the text
    mainContent.querySelectorAll('script, style, nav, header, footer, aside').forEach(el => el.remove());

    // Get the text content, which strips all HTML tags
    let text = mainContent.textContent || '';

    // Basic cleanup of the extracted text
    text = text.replace(/\s\s+/g, ' ').trim(); // Replace multiple whitespace with single space

    if (!text) {
        return "Could not extract readable content from the page."
    }

    return text;
  } catch (error) {
    console.error(`Error fetching or parsing URL content: ${url}`, error);
    throw new Error('Failed to retrieve or process the page content.');
  }
};