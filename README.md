# URL Bulk Opener

A modern, responsive web application that allows you to open multiple URLs simultaneously with a single click. Perfect for researchers, SEO professionals, and anyone who needs to efficiently manage multiple web links.

## Features

- **Bulk URL Opening**: Open multiple URLs at once in new tabs/windows
- **URL Validation**: Validate URLs before opening to ensure they're properly formatted
- **Selective Opening**: Choose which URLs to open with checkboxes
- **Popup Blocker Detection**: Automatically detects and provides instructions for popup blockers
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful, intuitive interface with smooth animations
- **Real-time Feedback**: Visual notifications and status updates
- **Browser Support**: Works with Chrome, Firefox, Edge, and Safari

## How to Use

1. **Enter URLs**: Paste your URLs into the text area (one per line or separated by commas)
2. **Validate URLs**: Click "Validate URLs" to check if all URLs are properly formatted
3. **Select URLs**: Use checkboxes to select which URLs you want to open
4. **Open URLs**: Click "Open All URLs" or "Open Selected" to open the URLs

## Browser Instructions

### Chrome
1. Click the lock icon in the address bar
2. Click "Site settings"
3. Set "Pop-ups and redirects" to "Allow"
4. Refresh this page

### Firefox
1. Click the shield icon in the address bar
2. Click "Enhanced Tracking Protection"
3. Click "Turn off for this site"
4. Refresh this page

### Edge
1. Click the lock icon in the address bar
2. Click "Permissions for this site"
3. Set "Pop-ups and redirects" to "Allow"
4. Refresh this page

## Technical Details

- **Pure HTML/CSS/JavaScript**: No external dependencies required
- **Modern ES6+**: Uses modern JavaScript features and classes
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized for fast loading and smooth interactions

## File Structure

```
URL Bulk Opener/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # This documentation file
```

## Getting Started

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start opening multiple URLs efficiently!

## Features in Detail

### URL Processing
- Automatically adds `https://` protocol if missing
- Supports various input formats (newlines, commas, semicolons)
- Real-time URL validation and formatting

### User Interface
- Clean, modern design inspired by the reference site
- Smooth animations and transitions
- Intuitive navigation and user feedback
- Mobile-responsive layout

### Error Handling
- Comprehensive input validation
- Popup blocker detection and instructions
- User-friendly error messages and notifications
- Graceful fallbacks for unsupported features

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Edge 79+
- Safari 12+

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this tool.

## License

This project is open source and available under the MIT License.

---

**Note**: This tool is designed for legitimate use cases such as research, SEO analysis, and productivity. Please use responsibly and respect website terms of service.
