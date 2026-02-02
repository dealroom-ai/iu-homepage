# IU Hub

A simple, static landing page for the Intelligence Unit (IU) team at Dealroom. Zero dependencies, no build step.

## Features

- **Simple View** (default): Shows page links only - for IU team
- **Advanced View**: Shows repos, datasheets, and caching repos - for Micro-app team
- **Suggestion Form**: Email-based link suggestions via mailto
- **Self-service Editing**: Anyone can edit links directly on GitHub

## Quick Start

Open `index.html` in a browser. That's it - no build step required.

For local development with live reload, you can use any static file server:

```bash
# Python
python -m http.server 8000

# Node.js (if npx available)
npx serve
```

## Editing Links

### Adding a New Link

1. Open [`data/links.json`](data/links.json)
2. Find the appropriate category
3. Add your link entry:

**Simple link:**

```json
{
  "name": "My Dashboard",
  "url": "https://example.com/dashboard"
}
```

**Link with advanced info (for micro-apps):**

```json
{
  "name": "App Name",
  "url": "https://app.dealroom.co/my-app",
  "advanced": {
    "repo": "https://github.com/dealroom-ai/my-app",
    "datasheet": "https://docs.google.com/spreadsheets/d/...",
    "cachingRepo": "https://github.com/dealroom-caching/my-app-cache"
  }
}
```

**Link with sub-pages (for ecosystems):**

```json
{
  "name": "Europe Ecosystem",
  "url": "https://dealroom.co/ecosystems/europe",
  "subPages": [
    {
      "name": "Overview",
      "url": "https://dealroom.co/ecosystems/europe/overview"
    },
    {
      "name": "Funding",
      "url": "https://dealroom.co/ecosystems/europe/funding"
    }
  ]
}
```

### Adding a New Category

Add a new object to the `categories` array:

```json
{
  "id": "my-category",
  "name": "My Category",
  "icon": "🆕",
  "items": []
}
```

### Common Mistakes to Avoid

- **Missing commas**: JSON requires commas between items (but not after the last item)
- **Wrong quotes**: Use double quotes `"`, not single quotes `'`
- **Trailing commas**: Don't put a comma after the last item in an array or object

## Project Structure

```
iu-homepage/
├── index.html          # Main page
├── css/styles.css      # All styles
├── js/app.js           # Dynamic rendering, toggle, form
├── data/links.json     # All link data (edit this!)
├── assets/             # Favicon and images
└── README.md           # This file
```

## Deployment

The site is deployed automatically via Cloudflare Pages whenever changes are pushed to the `main` branch.

## Contact

To suggest a link, use the "+ Suggest a Link" button on the page, or contact felix.ullmer@dealroom.co directly.
