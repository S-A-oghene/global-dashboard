# Global Insight Dashboard

A modern, responsive web application that displays real-time news headlines and currency exchange rates for countries worldwide.

## 🌟 Features

- **Real-Time News**: Fetches the latest 6 headlines for your selected country from the GNews API
- **Live Exchange Rates**: Get current USD to local currency conversion rates from the Frankfurter API
- **Persistent Selection**: Your country preference is automatically saved and restored
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Accessible**: Meets WCAG AA accessibility standards with proper semantic HTML and careful color contrast
- **Fast & Lightweight**: Under 30KB in total size with optimized lazy-loaded images
- **Error Handling**: Graceful error messages and fallback content if data is unavailable
- **Beautiful UI**: Modern card-based design with smooth animations and professional styling

## 🚀 Quick Start

### 1. Get Your GNews API Key

1. Go to [gnews.io](https://gnews.io)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Open `script.js` and find line 16
5. Replace `'YOUR_GNEWS_API_TOKEN_HERE'` with your actual API key:
   ```javascript
   const GNEWS_API_TOKEN = "your_actual_token_here";
   ```

### 2. Open in Browser

Simply open `index.html` in your web browser. No server or build process needed!

```bash
# On macOS/Linux
open index.html

# On Windows
start index.html

# Or just double-click index.html in your file explorer
```

### 3. Select a Country

1. Use the dropdown menu to select a country
2. The dashboard will automatically fetch news and exchange rates
3. Your selection is saved automatically

## 📁 File Structure

```
global-dashboard/
├── index.html                     # Main HTML structure
├── script.js                      # JavaScript logic (337 lines)
├── style.css                      # Styling & responsive design (587 lines)
├── README.md                      # This file
└── REQUIREMENTS_VERIFICATION.md   # Complete requirements checklist
```

## 🎯 Supported Countries

- 🇺🇸 United States (USD)
- 🇬🇧 United Kingdom (GBP)
- 🇳🇬 Nigeria (NGN)
- 🇨🇦 Canada (CAD)
- 🇦🇺 Australia (AUD)
- 🇩🇪 Germany (EUR)
- 🇮🇳 India (INR)
- 🇯🇵 Japan (JPY)

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Grid layout, Flexbox, animations, responsive design
- **Vanilla JavaScript**: No frameworks or libraries
- **APIs Used**:
  - [GNews API](https://gnews.io) - News headlines
  - [Frankfurter API](https://www.frankfurter.app) - Exchange rates

## ♿ Accessibility

This dashboard meets **WCAG AA** accessibility standards:

- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy
- ✅ Color contrast ratios exceed 4.5:1 (WCAG AA minimum)
- ✅ All images have descriptive alt text
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Respects `prefers-reduced-motion` setting

Test with tools like:

- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse (Chrome DevTools)](https://developer.chrome.com/docs/lighthouse/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

## 📱 Responsive Breakpoints

- **Mobile (< 768px)**: Single column layout, currency card below news
- **Tablet (768px - 1023px)**: 2-column grid, sticky currency panel
- **Desktop (1024px+)**: 3-column news grid, fixed sidebar

## 🎨 Design System

### Colors

- **Primary**: `#2563eb` (Blue) - Conveys trust and finance
- **Secondary**: `#64748b` (Slate Grey) - UI accents
- **Background**: `#f8fafc` (Soft off-white) - Main background
- **Text**: `#334155` (Dark slate) - Primary text

### Typography

- **Font Family**: Inter, system-ui, sans-serif
- **Font Weights**: 400 (normal), 600 (semibold), 700 (bold)

### Animations

- **Fade-In**: Content smoothly appears on load
- **Card Hover**: News cards lift slightly when hovered (8px translateY)
- **Transitions**: Smooth 0.2s transitions on interactive elements

## 💾 Local Storage

The app saves your country preference in the browser's `localStorage` under the key `active_region`. No personal data is collected or stored on any server.

To clear your saved preference:

- Open browser DevTools (F12)
- Go to Application > Local Storage
- Delete the `active_region` entry
- Refresh the page (will reset to USA)

## ⚠️ Troubleshooting

### No news articles appearing?

- Verify your GNews API token is correct in `script.js` line 16
- Check that you have API requests remaining (100/day free tier)
- Open browser DevTools (F12) and check the Console for error messages

### Exchange rate showing as "undefined"?

- Check your internet connection
- Verify the currency code is supported by Frankfurter API
- Try refreshing the page

### Dropdown not populating?

- Make sure JavaScript is enabled in your browser
- Check browser console for JavaScript errors (F12 → Console)
- Ensure `script.js` is loading (check Network tab in DevTools)

### Images not loading?

- Check your internet connection
- Placeholder images require internet to load from placeholder service
- Open DevTools Network tab to see if image requests are failing

## 🚀 Deployment

### Deploy to GitHub Pages

1. Create a GitHub repository named `global-dashboard`
2. Clone it locally
3. Copy all project files into the repository
4. Add and commit:
   ```bash
   git add .
   git commit -m "Initial commit: Global Insight Dashboard"
   ```
5. Push to GitHub:
   ```bash
   git push -u origin main
   ```
6. Go to repository Settings → Pages
7. Select "Deploy from a branch" and choose "main"
8. Your site will be live at `https://yourusername.github.io/global-dashboard/`

### Deploy to Other Platforms

The application can be deployed to any static hosting service:

- Netlify
- Vercel
- Firebase Hosting
- AWS S3 + CloudFront
- Any web server (just copy files to public directory)

## 📊 Performance

- **Page Weight**: ~30KB (HTML + CSS + JS combined)
- **API Calls**: 2 parallel requests (news + exchange rate)
- **Images**: Lazy loaded for better performance
- **Caching**: Leverages browser caching for external resources

## 📝 Code Documentation

The JavaScript file is thoroughly documented with:

- JSDoc comments for all functions
- 10 clearly labeled major functions
- Inline comments explaining key logic
- Organized sections with clear separation of concerns

View the complete requirements verification at `REQUIREMENTS_VERIFICATION.md`

## 🎓 Learning Resources

This project demonstrates:

- Async/await with Promise.all for parallel requests
- localStorage API for client-side persistence
- DOM manipulation with vanilla JavaScript
- Responsive CSS Grid layout
- Web API integration (fetch)
- Error handling and fallbacks
- Accessible web design principles
- WCAG AA compliance

## 📜 License

This project is created as a learning exercise for web development education.

## 🤝 Contributing

This is an educational project. Feel free to fork, modify, and learn from it!

## ❓ Questions?

Check the `REQUIREMENTS_VERIFICATION.md` file for a complete breakdown of all features and requirements met by this application.

---

**Last Updated**: 2024  
**Version**: 1.0  
**Status**: Production Ready ✅
