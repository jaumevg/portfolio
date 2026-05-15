# Jaume Vidal — Cloud Data Engineer Portfolio

A modern, high-performance personal portfolio tailored for a Cloud Data Engineer. The design language follows a "Tech-Zen / Cyberpunk" aesthetic, blending minimalist layouts with neon accents, glassmorphism, and hardware-inspired data grids.

## Architecture & Tech Stack

This project is built using a strict Vanilla architecture, prioritizing performance, modularity, and zero dependencies.

- **Structure**: Semantic HTML5
- **Styling**: Vanilla CSS3 with a modular architecture (BEM-inspired)
- **Logic**: Vanilla JavaScript (ES6 Modules)
- **Icons**: Font Awesome 6
- **Typography**: JetBrains Mono (Technical/Data), Plus Jakarta Sans (Body), Outfit (Headings)

## Project Structure

The project has been refactored from a monolithic stylesheet into a scalable, component-based structure:

```text
/
├── index.html                  # Main landing page (Hero, About, Timeline, Projects)
├── certifications.html         # Dedicated certifications data-grid page
├── css/
│   ├── base/                   # Reset, variables, animations, and typography
│   └── components/             # Modular CSS for discrete UI elements
├── js/                         # Modular JavaScript (animations, scrolling, navigation)
└── images/                     # Optimized assets and vendor logos
```

## Key UI/UX Features

- **Cyberpunk Aesthetic**: Dark mode by default (`data-theme="dark"`), leveraging pure blacks, violet/cyan gradients, and subtle neon text shadows.
- **Glassmorphism**: Navigation and floating elements use `backdrop-filter` to create a frosted glass effect.
- **Terminal Data Grids**: Certification metadata and technical stacks are displayed using strict, monospace tabular layouts (Vercel/Linear style) instead of traditional paragraphs.
- **Micro-Interactions**: Custom `glitch` animations, smooth scroll reveals, and diagonal directional arrows (`↗`) for external links.
- **Canvas Background**: A lightweight particle network animation running on the `<canvas>` element.

## Setup & Development

No build tools or package managers are required. The project relies entirely on native browser features.

1. Clone the repository.
2. Serve the directory using any local web server (e.g., `python -m http.server`, VS Code Live Server, or `npx serve`).
   *Note: Using a local server is required to properly resolve JavaScript ES6 module imports.*
3. Open `http://localhost:8000` (or your server's assigned port) in a modern web browser.

## Deployment

The repository is deployment-ready for static hosting platforms such as GitHub Pages, Vercel, Netlify, or AWS S3 + CloudFront.

## License

MIT License.
