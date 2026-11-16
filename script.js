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
        this.clearBtn = document.getElementById('clearBtn');
        this.removeDupesBtn = document.getElementById('removeDupesBtn');
        this.txtFileInput = document.getElementById('txtFileInput');
        this.csvFileInput = document.getElementById('csvFileInput');
        this.xlsxFileInput = document.getElementById('xlsxFileInput');
        this.docxFileInput = document.getElementById('docxFileInput');
        this.libPromises = {};
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
        if (this.urlInput) {
            this.urlInput.addEventListener('input', () => this.handleInputChange());
            this.urlInput.addEventListener('paste', () => this.handlePaste());
        }
        
        // Button events
        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
        if (this.pasteBtn) {
            this.pasteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePasteButton();
            });
        }
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearAll();
            });
        }
        if (this.removeDupesBtn) {
            this.removeDupesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.removeDuplicateLines();
            });
        }
        if (this.txtFileInput) {
            this.txtFileInput.addEventListener('change', (e) => this.handleTxtImport(e));
        }
        if (this.csvFileInput) {
            this.csvFileInput.addEventListener('change', (e) => this.handleCsvImport(e));
        }
        if (this.xlsxFileInput) {
            this.xlsxFileInput.addEventListener('change', (e) => this.handleExcelImport(e));
        }
        if (this.docxFileInput) {
            this.docxFileInput.addEventListener('change', (e) => this.handleDocxImport(e));
        }
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
        if (this.hamburger && this.nav) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href) return;

                const hashIndex = href.indexOf('#');
                const hash = hashIndex !== -1 ? href.slice(hashIndex) : '';
                const path = hashIndex !== -1 ? href.slice(0, hashIndex) : href;
                const isIndexPage = /(?:^|\/)index\.html?$/i.test(window.location.pathname) ||
                    window.location.pathname === '/' ||
                    window.location.pathname.endsWith('/');

                if (hash && (href.startsWith('#') || (isIndexPage && (!path || /index\.html?$/i.test(path))))) {
                    e.preventDefault();
                    const targetId = hash.slice(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        history.pushState(null, '', `#${targetId}`);
                        this.closeMobileMenu();
                    }
                    return;
                }

                this.closeMobileMenu();
            });
        });

        if (window.location.hash) {
            this.scrollToPageSection(window.location.hash.slice(1));
        }

        document.querySelectorAll('.btn-header-cta').forEach(button => {
            button.addEventListener('click', (e) => {
                const href = button.getAttribute('href');
                if (!href || !href.includes('#urlInputSection')) return;

                const isIndexPage = /(?:^|\/)index\.html?$/i.test(window.location.pathname) ||
                    window.location.pathname === '/' ||
                    window.location.pathname.endsWith('/');

                if (isIndexPage) {
                    e.preventDefault();
                    scrollToUrlInput();
                    this.closeMobileMenu();
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger || !this.nav) return;
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

    scrollToPageSection(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (!targetElement) return;

        window.requestAnimationFrame(() => {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

            if (sectionId === 'urlInputSection') {
                setTimeout(() => {
                    const urlInput = document.getElementById('urlInput');
                    if (urlInput) urlInput.focus();
                }, 500);
            }
        });
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
        if (this.urlInput) this.urlInput.value = '';
        ['txtFileInput', 'csvFileInput', 'xlsxFileInput', 'docxFileInput'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        ['txtFileName', 'csvFileName', 'xlsxFileName', 'docxFileName'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.textContent = '';
        });
        this.clearUrlList();
        this.showNotification('All URLs cleared!', 'info');
        if (this.urlInput) this.urlInput.focus();
    }

    splitLines(text) {
        return String(text || '')
            .split(/\r\n|\r|\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
    }

    looksLikeUrl(value) {
        const text = String(value || '').trim();
        if (!text) return false;
        try {
            const withProtocol = /^https?:\/\//i.test(text) ? text : `https://${text}`;
            const parsed = new URL(withProtocol);
            return ['http:', 'https:'].includes(parsed.protocol) && parsed.hostname.includes('.');
        } catch (e) {
            return /^(https?:\/\/|www\.)/i.test(text);
        }
    }

    normalizeUrlKey(value) {
        try {
            const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
            const parsed = new URL(withProtocol);
            parsed.hash = '';
            parsed.hostname = parsed.hostname.toLowerCase();
            if ((parsed.protocol === 'http:' && parsed.port === '80') || (parsed.protocol === 'https:' && parsed.port === '443')) {
                parsed.port = '';
            }
            let path = parsed.pathname.replace(/\/+$/, '');
            if (!path) path = '/';
            parsed.pathname = path;
            return parsed.toString().toLowerCase();
        } catch (e) {
            return String(value || '').trim().toLowerCase().replace(/\/+$/, '');
        }
    }

    appendImportedLines(lines) {
        if (!this.urlInput) return;
        const addition = lines.join('\n');
        const existing = this.urlInput.value.trim();
        this.urlInput.value = existing ? `${existing}\n${addition}` : addition;
        this.urlInput.dispatchEvent(new Event('input'));
    }

    parseCsv(text) {
        const rows = [];
        let row = [];
        let field = '';
        let inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const next = text[i + 1];
            if (inQuotes) {
                if (char === '"' && next === '"') {
                    field += '"';
                    i++;
                } else if (char === '"') {
                    inQuotes = false;
                } else {
                    field += char;
                }
            } else if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                row.push(field);
                field = '';
            } else if (char === '\n') {
                row.push(field);
                rows.push(row);
                row = [];
                field = '';
            } else if (char !== '\r') {
                field += char;
            }
        }
        if (field.length || row.length) {
            row.push(field);
            rows.push(row);
        }
        return rows;
    }

    extractUrlsFromCsv(text) {
        const rows = this.parseCsv(text);
        if (rows.length === 0) return [];
        const headerRow = rows[0];
        let urlColumnIndex = -1;
        headerRow.forEach((cell, index) => {
            const normalized = String(cell).trim().toLowerCase();
            if (
                urlColumnIndex === -1 &&
                (normalized === 'url' ||
                    normalized === 'urls' ||
                    normalized === 'link' ||
                    normalized === 'links' ||
                    normalized.includes('url') ||
                    normalized.includes('link'))
            ) {
                urlColumnIndex = index;
            }
        });
        const urls = [];
        if (urlColumnIndex !== -1) {
            for (let i = 1; i < rows.length; i++) {
                const cell = rows[i][urlColumnIndex];
                if (cell && String(cell).trim()) urls.push(String(cell).trim());
            }
            return urls;
        }
        rows.forEach((row) => {
            row.forEach((cell) => {
                const trimmed = String(cell).trim();
                if (trimmed && /^https?:\/\//i.test(trimmed)) urls.push(trimmed);
            });
        });
        return urls;
    }

    setFileName(id, name) {
        const el = document.getElementById(id);
        if (el) el.textContent = name || '';
    }

    handleTxtImport(event) {
        const file = event.target.files && event.target.files[0];
        event.target.value = '';
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('Files are limited to 10 MB.', 'warning');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const lines = this.splitLines(reader.result);
            if (!lines.length) {
                this.showNotification('No URLs were found in that TXT file.', 'warning');
                return;
            }
            this.appendImportedLines(lines);
            this.setFileName('txtFileName', file.name);
            this.showNotification(`Imported ${lines.length} line(s) from ${file.name}.`, 'success');
        };
        reader.onerror = () => this.showNotification('Could not read that TXT file.', 'error');
        reader.readAsText(file);
    }

    handleCsvImport(event) {
        const file = event.target.files && event.target.files[0];
        event.target.value = '';
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('Files are limited to 10 MB.', 'warning');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const urls = this.extractUrlsFromCsv(String(reader.result || ''));
            if (!urls.length) {
                this.showNotification('No URLs were found in that CSV file. Use a URL/Link column or full http/https addresses.', 'warning');
                return;
            }
            this.appendImportedLines(urls);
            this.setFileName('csvFileName', file.name);
            this.showNotification(`Imported ${urls.length} URL(s) from ${file.name}.`, 'success');
        };
        reader.onerror = () => this.showNotification('Could not read that CSV file.', 'error');
        reader.readAsText(file);
    }

    injectScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.referrerPolicy = 'no-referrer';
            script.onload = resolve;
            script.onerror = () => {
                script.remove();
                reject(new Error('load failed'));
            };
            document.head.appendChild(script);
        });
    }

    loadLib(name) {
        const libs = {
            xlsx: {
                test: () => window.XLSX,
                urls: [
                    'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
                ]
            },
            jszip: {
                test: () => window.JSZip,
                urls: [
                    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
                    'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'
                ]
            }
        };
        const lib = libs[name];
        if (lib.test()) return Promise.resolve(lib.test());
        if (!this.libPromises[name]) {
            this.libPromises[name] = (async () => {
                for (const url of lib.urls) {
                    try {
                        await this.injectScript(url);
                        if (lib.test()) return lib.test();
                    } catch (e) { /* try next */ }
                }
                throw new Error('library unavailable');
            })();
            this.libPromises[name].catch(() => { delete this.libPromises[name]; });
        }
        return this.libPromises[name];
    }

    findUrlsInText(text) {
        const matches = String(text || '').match(/(?:https?:\/\/|www\.)[^\s<>"'`\u00a0]+/gi) || [];
        return matches.map((value) => value.replace(/[.,;:!?'"\]}>]+$/, '')).filter(Boolean);
    }

    readBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error || new Error('read failed'));
            reader.readAsArrayBuffer(file);
        });
    }

    async handleExcelImport(event) {
        const input = event.target;
        const file = input.files && input.files[0];
        input.value = '';
        if (!file) return;
        const name = file.name.toLowerCase();
        if (!name.endsWith('.xlsx') && !name.endsWith('.xls')) {
            this.showNotification('Please choose an .xlsx or .xls file.', 'error');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('Files are limited to 10 MB.', 'warning');
            return;
        }
        this.showNotification(`Reading ${file.name}...`, 'info');
        let XLSX;
        try {
            XLSX = await this.loadLib('xlsx');
        } catch (e) {
            this.showNotification('Excel reader could not load. Check your connection or save as CSV.', 'error');
            return;
        }
        let workbook;
        try {
            workbook = XLSX.read(await this.readBuffer(file), { type: 'array' });
        } catch (e) {
            this.showNotification(`Could not read ${file.name}. It may be password-protected or not a real Excel file.`, 'error');
            return;
        }
        const found = [];
        (workbook.SheetNames || []).forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) return;
            Object.keys(sheet).forEach((addr) => {
                if (addr.charAt(0) === '!') return;
                const cell = sheet[addr];
                if (!cell) return;
                if (cell.l && typeof cell.l.Target === 'string' && /^https?:\/\//i.test(cell.l.Target.trim())) {
                    found.push(cell.l.Target.trim());
                }
                if (typeof cell.f === 'string') this.findUrlsInText(cell.f).forEach((url) => found.push(url));
                const text = typeof cell.w === 'string' ? cell.w : (typeof cell.v === 'string' ? cell.v : '');
                if (text) this.findUrlsInText(text).forEach((url) => found.push(url));
            });
        });
        this.finishFileImport(found, file.name, 'xlsxFileName');
    }

    async extractFromDocx(buffer, JSZip) {
        const relNs = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
        const zip = await JSZip.loadAsync(buffer);
        if (!zip.file('word/document.xml')) throw new Error('not docx');
        const parse = async (name) => {
            const file = zip.file(name);
            if (!file) return null;
            const doc = new DOMParser().parseFromString(await file.async('string'), 'application/xml');
            if (doc.getElementsByTagName('parsererror').length) throw new Error('bad xml');
            return doc;
        };
        const parts = Object.keys(zip.files).filter((n) => /^word\/(document|footnotes|endnotes|header\d*|footer\d*)\.xml$/.test(n));
        const found = [];
        for (const part of parts) {
            const doc = await parse(part);
            const rels = {};
            const relDoc = await parse(part.replace('word/', 'word/_rels/') + '.rels');
            if (relDoc) {
                Array.from(relDoc.getElementsByTagName('Relationship')).forEach((rel) => {
                    if (/^external$/i.test(rel.getAttribute('TargetMode') || '')) {
                        rels[rel.getAttribute('Id')] = rel.getAttribute('Target');
                    }
                });
            }
            Array.from(doc.getElementsByTagNameNS('*', 'hyperlink')).forEach((node) => {
                const id = node.getAttributeNS(relNs, 'id');
                const target = id && rels[id];
                if (target && /^https?:\/\//i.test(target.trim())) found.push(target.trim());
            });
            Array.from(doc.getElementsByTagNameNS('*', 'instrText')).forEach((node) => {
                const match = /HYPERLINK\s+"([^"]+)"/i.exec(node.textContent || '');
                if (match && /^https?:\/\//i.test(match[1])) found.push(match[1]);
            });
            Array.from(doc.getElementsByTagNameNS('*', 'p')).forEach((p) => {
                const text = Array.from(p.getElementsByTagNameNS('*', 't')).map((t) => t.textContent).join('');
                this.findUrlsInText(text).forEach((url) => found.push(url));
            });
        }
        return found;
    }

    async handleDocxImport(event) {
        const input = event.target;
        const file = input.files && input.files[0];
        input.value = '';
        if (!file) return;
        const name = file.name.toLowerCase();
        if (name.endsWith('.doc')) {
            this.showNotification('Older .doc files are not supported. Save as .docx and import again.', 'error');
            return;
        }
        if (!name.endsWith('.docx')) {
            this.showNotification('Please choose a .docx file.', 'error');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('Files are limited to 10 MB.', 'warning');
            return;
        }
        this.showNotification(`Reading ${file.name}...`, 'info');
        let JSZip;
        try {
            JSZip = await this.loadLib('jszip');
        } catch (e) {
            this.showNotification('Word reader could not load. Check your internet connection and try again.', 'error');
            return;
        }
        try {
            const found = await this.extractFromDocx(await this.readBuffer(file), JSZip);
            this.finishFileImport(found, file.name, 'docxFileName');
        } catch (e) {
            this.showNotification(`Could not read ${file.name}. It may be corrupted or not a real .docx file.`, 'error');
        }
    }

    finishFileImport(found, fileName, nameId) {
        const seen = new Set();
        let urls = [];
        found.forEach((url) => {
            const key = this.looksLikeUrl(url) ? this.normalizeUrlKey(url) : String(url).toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                urls.push(url);
            }
        });
        if (!urls.length) {
            this.showNotification(`No web URLs were found in ${fileName}.`, 'warning');
            return;
        }
        if (urls.length > 5000) urls = urls.slice(0, 5000);
        this.appendImportedLines(urls);
        this.setFileName(nameId, fileName);
        this.showNotification(`Imported ${urls.length} URL(s) from ${fileName}. Click Submit URLs to review.`, 'success');
    }

    removeDuplicateLines() {
        if (!this.urlInput) return;
        const rawList = this.splitLines(this.urlInput.value);
        if (!rawList.length) {
            this.showNotification('Paste or import URLs first.', 'warning');
            return;
        }
        const seen = new Set();
        const deduped = [];
        let removedCount = 0;
        rawList.forEach((line) => {
            if (this.looksLikeUrl(line)) {
                const key = this.normalizeUrlKey(line);
                if (seen.has(key)) {
                    removedCount += 1;
                    return;
                }
                seen.add(key);
            }
            deduped.push(line);
        });
        if (removedCount === 0) {
            this.showNotification('No duplicate URLs were found.', 'info');
            return;
        }
        this.urlInput.value = deduped.join('\n');
        this.urlInput.dispatchEvent(new Event('input'));
        this.showNotification(`Removed ${removedCount} duplicate URL(s). Click Submit URLs to refresh.`, 'success');
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
    if (!window.urlBulkOpener) {
        window.urlBulkOpener = new URLBulkOpener();
    }
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
    if (inputActions && !document.getElementById('removeDupesBtn')) {
        inputActions.appendChild(exampleBtn);
    }
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
    // Initialize the main application once
    if (!window.urlBulkOpener) {
        window.urlBulkOpener = new URLBulkOpener();
    }
    
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