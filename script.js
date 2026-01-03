 // URL Bulk Opener - Main JavaScript File
class URLBulkOpener {
    constructor() {
        this.urls = [];
        this.validUrls = [];
        this.selectedUrls = [];
        this.isPopupBlocked = false;
        this.currentUrlIndex = 0; // Track which URL to open next
        
        this.initializeElements();
        this.attachEventListeners();
        this.detectBrowser();
        this.checkPopupBlocker();
    }

    initializeElements() {
        // Input elements
        this.urlInput = document.getElementById('urlInput');
        this.submitBtn = document.getElementById('submitBtn');
		this.pasteBtn = document.getElementById('pasteBtn');
		this.urlInputSection = document.getElementById('urlInputSection');
		this.inputContainer = document.querySelector('#urlInputSection .input-container');
        
        // Display elements
        this.urlList = document.getElementById('urlList');
        this.urlCount = document.getElementById('urlCount');
        this.urlItems = document.getElementById('urlItems');
        
        // Action buttons
		this.openSelectedBtn = document.getElementById('openSelectedBtn');
		this.actionButtons = document.querySelector('.action-buttons');
        
        // Warning elements removed
        
        // Navigation elements
        this.hamburger = document.getElementById('hamburger');
        this.nav = document.getElementById('nav');
    }

    attachEventListeners() {
        // Input events
        this.urlInput.addEventListener('input', () => this.handleInputChange());
        this.urlInput.addEventListener('paste', () => this.handlePaste());
        
        // Button events
        this.submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        this.pasteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handlePasteButton();
        });
        // Open Selected URLs button event
        if (this.openSelectedBtn) {
            this.openSelectedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Open All URLs button clicked');
                this.openSelectedUrls();
                return false;
            });
        }
        
        // Browser instruction tabs removed
        
        // Hamburger menu
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // If it's an external link (like blog.html), just close menu and navigate normally
                if (href && !href.startsWith('#')) {
                    this.closeMobileMenu();
                    return; // Let browser handle the navigation
                }
                
                // If it's an anchor link, handle smooth scrolling
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        this.closeMobileMenu();
                    }
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.nav.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.nav.classList.toggle('active');
    }

    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.nav.classList.remove('active');
    }

    detectBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        let browser = 'chrome';
        
        if (userAgent.includes('firefox')) {
            browser = 'firefox';
        } else if (userAgent.includes('edg')) {
            browser = 'edge';
        } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
            browser = 'safari';
        }
        
        // Browser detection simplified
    }

    // Browser instructions removed

    checkPopupBlocker() {
        // Test popup blocker by trying to open a popup
        const testPopup = window.open('', '_blank', 'width=1,height=1');
        if (!testPopup || testPopup.closed || typeof testPopup.closed === 'undefined') {
            this.isPopupBlocked = true;
        } else {
            testPopup.close();
        }
    }

    handleInputChange() {
        const input = this.urlInput.value.trim();
        if (input) {
            this.parseUrls(input);
        } else {
            this.clearUrlList();
        }
    }

    handleSubmit() {
        const input = this.urlInput.value.trim();
        if (!input) {
            this.showNotification('Please enter some URLs first!', 'warning');
            return;
        }

        this.parseUrls(input);
        this.validateUrls();
    }

    handlePaste() {
        // Small delay to ensure paste content is processed
        setTimeout(() => {
            this.handleInputChange();
        }, 100);
    }

    handlePasteButton() {
        // Add click animation effect
        this.pasteBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.pasteBtn.style.transform = '';
        }, 150);
        
        // Focus on the textarea first
        this.urlInput.focus();
        
        // Add loading state
        this.pasteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PASTING...';
        this.pasteBtn.disabled = true;
        
        // Try to read from clipboard and paste content
        if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText().then(text => {
                if (text.trim()) {
                    // Clear existing content and paste new content
                    this.urlInput.value = text;
                    
                    // Process the pasted URLs immediately
                    this.parseUrls(text);
                    this.validateUrls();
                    this.displayUrls();
                    
                    // Show a brief success message
                    this.showPasteSuccess();
                } else {
                    // Suppress popup on empty clipboard; do nothing
                }
                
                // Reset button state
                this.resetPasteButton();
            }).catch(err => {
                console.log('Clipboard access denied or failed:', err);
                // Suppress popup in paste flow; keep silent
                this.resetPasteButton();
            });
        } else {
            // Fallback for older browsers
            // Suppress popup in paste flow; keep silent
            this.resetPasteButton();
        }
    }

    resetPasteButton() {
        // Reset button to original state
        this.pasteBtn.innerHTML = '<i class="fas fa-paste"></i> PASTE';
        this.pasteBtn.disabled = false;
    }

    showPasteSuccess() {
        // Create a temporary success message with emoji and better styling
        const successMsg = document.createElement('div');
        successMsg.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
                <div>
                    <div style="font-weight: 600; font-size: 1rem;">Paste Successful</div>
                    <div style="font-size: 0.85rem; opacity: 0.8;">Found ${this.validUrls.length} valid URLs</div>
                </div>
            </div>
        `;
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #374151, #4b5563);
            color: #f9fafb;
            padding: 14px 20px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(55, 65, 81, 0.3);
            animation: slideIn 0.3s ease;
            border: 1px solid #6b7280;
        `;
        
        document.body.appendChild(successMsg);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successMsg.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                successMsg.remove();
            }, 300);
        }, 4000);
    }

    showPasteError(customMessage = 'Unable to access clipboard. Please paste manually (Ctrl+V).') {
        // Create a temporary error message
        const errorMsg = document.createElement('div');
        errorMsg.textContent = customMessage;
        errorMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(errorMsg);
        
        // Remove after 3 seconds
        setTimeout(() => {
            errorMsg.remove();
        }, 3000);
    }

    createConfetti() {
        // Create confetti effect
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;
        
        document.body.appendChild(confettiContainer);
        
        // Create confetti pieces
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: ${['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
                border-radius: 50%;
            `;
            confettiContainer.appendChild(confetti);
        }
        
        // Remove confetti container after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }

    parseUrls(input) {
        // Split by newlines, commas, or semicolons
        const urlStrings = input.split(/[\n,;]+/)
            .map(url => url.trim())
            .filter(url => url.length > 0 && url !== '');
        
        this.urls = urlStrings.map((url, index) => ({
            id: index,
            original: url,
            processed: this.processUrl(url),
            isValid: false,
            selected: true
        }));
    }

    processUrl(url) {
        // Remove extra whitespace
        url = url.trim();
        
        // Skip empty URLs
        if (!url) return '';
        
        // Add protocol if missing
        if (!url.match(/^https?:\/\//)) {
            url = 'https://' + url;
        }
        
        // Remove trailing slashes for cleaner display
        if (url.endsWith('/') && url.length > 8) {
            url = url.slice(0, -1);
        }
        
        return url;
    }

    validateUrls() {
        if (this.urls.length === 0) {
            this.showNotification('Please enter some URLs first!', 'warning');
            return;
        }

        // Validate all URLs synchronously (fast format check only - no network delay)
        this.urls.forEach((urlObj) => {
            urlObj.isValid = this.validateSingleUrl(urlObj.processed);
        });

        this.validUrls = this.urls.filter(url => url.isValid);
        this.updateUrlList();
        this.updateActionButtons();
        
        const validCount = this.validUrls.length;
        const totalCount = this.urls.length;
        
        if (validCount > 0) {
            this.showNotification(`Found ${validCount} valid URLs! You can now click on individual URLs to open them, or use "Open All" button.`, 'success');
        } else {
            this.showNotification('No valid URLs found. Please check your input and try again.', 'warning');
        }
    }

    validateSingleUrl(url) {
        // Fast synchronous URL format validation (no network check)
        try {
            const urlObj = new URL(url);
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return false;
            }
            
            // Additional validation for common patterns
            if (urlObj.hostname.length === 0) {
                return false;
            }
            
            // Check for common valid domain patterns
            const validDomainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
            if (!validDomainPattern.test(urlObj.hostname)) {
                return false;
            }
            
            // Consider most properly formatted URLs as valid
            return true;
        } catch (e) {
            return false;
        }
    }

    updateUrlList() {
        if (this.urls.length === 0) {
            this.clearUrlList();
            return;
        }

        this.urlCount.textContent = this.validUrls.length;
        this.urlItems.innerHTML = '';

        // Reset the index when new URLs are loaded
        this.currentUrlIndex = 0;

		// Reposition results: place URL list and action buttons right below input container
		if (this.urlInputSection && this.inputContainer && this.urlList) {
			const afterInput = this.inputContainer.nextSibling;
			this.urlInputSection.insertBefore(this.urlList, afterInput);
			if (this.actionButtons) {
				if (this.urlList.nextSibling) {
					this.urlInputSection.insertBefore(this.actionButtons, this.urlList.nextSibling);
				} else {
					this.urlInputSection.appendChild(this.actionButtons);
				}
			}
		}

		// Keep original layout; do not reposition elements

        // Show all URLs (both valid and invalid) for better user experience
        this.urls.forEach(urlObj => {
            const urlItem = this.createUrlItem(urlObj);
            this.urlItems.appendChild(urlItem);
        });

        // Update selected URLs after creating the list
        this.updateSelectedUrls();
        
        // Re-attach event listener to button (in case it was recreated)
        if (this.openSelectedBtn) {
            // Remove old listener and add new one
            const newBtn = this.openSelectedBtn.cloneNode(true);
            this.openSelectedBtn.parentNode.replaceChild(newBtn, this.openSelectedBtn);
            this.openSelectedBtn = newBtn;
            
            this.openSelectedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Open All URLs button clicked');
                this.openSelectedUrls();
                return false;
            });
        }

		// Make sure the URL list is visible
        this.urlList.classList.remove('hidden');
        
		// Scroll to the URL list to make it more visible (align to top)
        setTimeout(() => {
			this.urlList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    createUrlItem(urlObj) {
        const item = document.createElement('div');
        item.className = 'url-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = urlObj.selected;
        checkbox.addEventListener('change', (e) => {
            urlObj.selected = e.target.checked;
            this.updateSelectedUrls();
        });
        
        const urlText = document.createElement('span');
        urlText.className = 'url-text clickable-url';
        urlText.textContent = urlObj.processed;
        urlText.title = 'Click to open in new tab';
        
        // Add click functionality for individual URL opening
        urlText.addEventListener('click', (e) => {
            if (urlObj.isValid) {
                e.preventDefault();
                e.stopPropagation();
                // Always open in new tab to keep user on the site
                window.open(urlObj.processed, '_blank', 'noopener,noreferrer');
                return false;
            }
        });
        
        const status = document.createElement('span');
        status.className = `url-status ${urlObj.isValid ? 'valid' : 'invalid'}`;
        status.textContent = urlObj.isValid ? 'Valid' : 'Invalid';
        
        item.appendChild(checkbox);
        item.appendChild(urlText);
        item.appendChild(status);
        
        return item;
    }

    updateSelectedUrls() {
        this.selectedUrls = this.validUrls.filter(url => url.selected);
        this.updateActionButtons();
    }

    updateActionButtons() {
        const hasValidUrls = this.validUrls.length > 0;
        const hasSelectedUrls = this.selectedUrls.length > 0;
        // Use selected URLs if available, otherwise use all valid URLs
        const urlsToOpen = hasSelectedUrls ? this.selectedUrls : this.validUrls;
        const remainingUrls = urlsToOpen.length - this.currentUrlIndex;
        
        // Enable button if there are valid URLs to open
        if (this.openSelectedBtn) {
            this.openSelectedBtn.disabled = !hasValidUrls || remainingUrls <= 0;
            
            if (hasValidUrls) {
                this.openSelectedBtn.classList.remove('hidden');
                // Update button text to show progress
                if (remainingUrls > 0) {
                    this.openSelectedBtn.innerHTML = `<i class="fas fa-external-link-alt"></i> Open All URLs (${remainingUrls} remaining)`;
                } else {
                    this.openSelectedBtn.innerHTML = `<i class="fas fa-check"></i> All URLs Opened!`;
                }
            } else {
                this.openSelectedBtn.classList.add('hidden');
            }
        }
    }

    clearUrlList() {
        this.urlList.classList.add('hidden');
        this.urlCount.textContent = '0';
        this.urlItems.innerHTML = '';
        this.urls = [];
        this.validUrls = [];
        this.selectedUrls = [];
        this.currentUrlIndex = 0; // Reset the index
        this.updateActionButtons();
    }

    clearAll() {
        this.urlInput.value = '';
        this.clearUrlList();
        this.showNotification('All URLs cleared!', 'info');
    }

    openSelectedUrls() {
        // Always use validUrls array directly (stable reference)
        if (this.validUrls.length === 0) {
            this.showNotification('No URLs to open! Please submit some URLs first.', 'warning');
            return false;
        }

        // Check if we've opened all URLs
        if (this.currentUrlIndex >= this.validUrls.length) {
            this.showNotification('All URLs have been opened! Click Submit again to start over.', 'info');
            this.currentUrlIndex = 0;
            this.updateActionButtons();
            return false;
        }

        // Get the current URL to open from validUrls array (index-based)
        const urlToOpen = this.validUrls[this.currentUrlIndex];
        
        // Open the URL in new tab
        try {
            const newWindow = window.open(urlToOpen.processed, '_blank', 'noopener,noreferrer');
            
            if (!newWindow || newWindow.closed) {
                this.showNotification('Popup blocked! Please allow popups for this site.', 'warning');
                return false;
            }
            
            // Ensure focus stays on current window
            setTimeout(() => {
                newWindow.blur();
                window.focus();
            }, 10);
            
            // IMPORTANT: Increment index AFTER opening URL
            this.currentUrlIndex++;
            const remaining = this.validUrls.length - this.currentUrlIndex;
            
            // Show success notification
            if (remaining > 0) {
                this.showNotification(`Opened: ${urlToOpen.processed} (${remaining} more URLs remaining)`, 'success');
            } else {
                this.showNotification(`Opened: ${urlToOpen.processed} (All URLs opened!)`, 'success');
            }
            
            // Update button text
            this.updateActionButtons();
        } catch (error) {
            console.error('Error opening URL:', error);
            this.showNotification('Error opening URL. Please try again.', 'error');
        }
        
        return false;
    }

   openAllSelectedUrls() {
    console.log('Button clicked!'); // Debug log
    
    // Check if there are any valid URLs
    if (!this.validUrls || this.validUrls.length === 0) {
        this.showNotification('No valid URLs to open! Please submit some URLs first.', 'warning');
        return false;
    }

    // Get the first URL
    const firstUrl = this.validUrls[0].processed;
    console.log('Trying to open URL:', firstUrl); // Debug log

    // Save button state
    const originalText = this.openSelectedBtn.innerHTML;
    this.openSelectedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
    this.openSelectedBtn.disabled = true;

    // Use a small delay to allow UI to update
    setTimeout(() => {
        try {
            // Try to open the URL
            const newWindow = window.open(firstUrl, '_blank');
            
            if (newWindow === null || typeof newWindow === 'undefined') {
                // If popup was blocked
                this.showNotification('Popup was blocked! Please allow popups for this site.', 'warning');
                console.log('Popup was blocked by browser');
            } else {
                // Successfully opened
                this.showNotification('URL opened in new tab!', 'success');
                console.log('URL opened successfully');
                
                // Remove the opened URL from the list
                this.validUrls.shift();
            }
        } catch (e) {
            console.error('Error opening URL:', e);
            this.showNotification('Error opening URL: ' + e.message, 'error');
        } finally {
            // Re-enable the button
            this.openSelectedBtn.disabled = false;
            this.openSelectedBtn.innerHTML = originalText;
        }
    }, 100);
    
    return false;
}


    openSingleUrl(url) {
        if (this.isPopupBlocked) {
            this.showNotification('Popup blocker detected! Please allow popups for this site.', 'error');
            return;
        }

        try {
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
            if (newWindow && !newWindow.closed) {
                this.showNotification('URL opened successfully!', 'success');
            } else {
                this.showNotification('URL was blocked by popup blocker.', 'warning');
            }
        } catch (e) {
            this.showNotification('Failed to open URL.', 'error');
        }
    }



    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;

        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => notification.remove());

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
            info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
        };
        return colors[type] || colors.info;
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new URLBulkOpener();
});

// Refresh when clicking the site title in the header
document.addEventListener('DOMContentLoaded', () => {
    const siteTitle = document.getElementById('siteTitle');
    if (siteTitle) {
        siteTitle.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.reload();
        });
    }
});

// Add some example URLs for demonstration
document.addEventListener('DOMContentLoaded', () => {
    const exampleUrls = [
        'https://www.google.com',
        'https://www.github.com',
        'https://www.stackoverflow.com',
        'https://www.wikipedia.org',
        'https://www.youtube.com'
    ];
    
    // Add example button
    const exampleBtn = document.createElement('button');
    exampleBtn.className = 'btn btn-info';
    exampleBtn.innerHTML = '<i class="fas fa-lightbulb"></i> Load Example URLs';
    exampleBtn.addEventListener('click', () => {
        document.getElementById('urlInput').value = exampleUrls.join('\n');
        document.getElementById('urlInput').dispatchEvent(new Event('input'));
    });
    
    const inputActions = document.querySelector('.input-actions');
    inputActions.appendChild(exampleBtn);
});

// Handle page visibility change to check popup blocker again
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Re-check popup blocker when user returns to the page
        setTimeout(() => {
            const opener = window.urlBulkOpener;
            if (opener) {
                opener.checkPopupBlocker();
            }
        }, 1000);
    }
});

// Export for global access
window.URLBulkOpener = URLBulkOpener;

// Function to scroll to URL input section
function scrollToUrlInput() {
    const urlInputSection = document.getElementById('urlInputSection');
    if (urlInputSection) {
        urlInputSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Focus on the textarea after scrolling
        setTimeout(() => {
            const urlInput = document.getElementById('urlInput');
            if (urlInput) {
                urlInput.focus();
            }
        }, 500);
    }
}

// Function to toggle FAQ items
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const faqAnswer = faqItem.querySelector('.faq-answer');
    const faqQuestion = element;
    const arrow = element.querySelector('.faq-arrow');
    
    // Toggle active class
    faqQuestion.classList.toggle('active');
    faqAnswer.classList.toggle('active');
    
    // Close other FAQ items
    const allFaqItems = document.querySelectorAll('.faq-item');
    allFaqItems.forEach(item => {
        if (item !== faqItem) {
            item.querySelector('.faq-question').classList.remove('active');
            item.querySelector('.faq-answer').classList.remove('active');
        }
    });
}

// Initialize the URLBulkOpener when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the main application
    window.urlBulkOpener = new URLBulkOpener();
    
    const form = document.getElementById('contactForm');
    if (!form) return;
    const emailInput = document.getElementById('contactEmail');
    const linkInput = document.getElementById('contactLink');
    const msgInput = document.getElementById('contactMessage');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const from = (emailInput && emailInput.value ? emailInput.value : '').trim();
        const link = (linkInput && linkInput.value ? linkInput.value : '').trim();
        const message = (msgInput && msgInput.value ? msgInput.value : '').trim();
        const to = 'urlbulkopener@urlbulkopener.com';
        const subject = encodeURIComponent(`New message from ${from || 'website visitor'}`);
        const parts = [];
        if (from) parts.push(`From: ${from}`);
        if (link) parts.push(`Link: ${link}`);
        if (message) parts.push(`Message:\n${message}`);
        const body = encodeURIComponent(parts.join('\n\n'));
        const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
        window.location.href = mailto;
    });
});

  // Add this at the very end of the file
console.log('URL Opener initialized. You can test with: testOpenUrl()');
window.testOpenUrl = () => {
    const testUrl = 'https://www.google.com';
    console.log('Testing URL open with:', testUrl);
    const newWindow = window.open(testUrl, '_blank');
    if (newWindow) {
        console.log('Successfully opened test URL');
        return true;
    } else {
        console.log('Failed to open test URL - popup might be blocked');
        return false;
    }
};  // Added the missing closing brace and semicolon here