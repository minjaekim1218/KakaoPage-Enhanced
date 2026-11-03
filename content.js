let settings = {
    hideAds: true,
    injectRecent: true,
    highlightContinue: true,
    highlightTicket: true
};

// Sync settings from chrome storage
chrome.storage.sync.get(Object.keys(settings), (storedSettings) => {
    settings = { ...settings, ...storedSettings };
    applySettings();
});

chrome.storage.onChanged.addListener((changes) => {
    for (let key in changes) {
        if (key in settings) {
            settings[key] = changes[key].newValue;
        }
    }
    applySettings();
});

function applySettings() {
    //Hide Ads toggle
    document.body.classList.toggle('ext-hide-ads', settings.hideAds);

    //Recent Button toggle
    if (settings.injectRecent) {
        injectRecentButton();
    } else {
        document.getElementById('userscript-recent-btn')?.remove();
    }

    //Highlight "이어보기" toggle
    if (settings.highlightContinue) {
        checkAndHighlight();
    } else {
        document.querySelectorAll('.userscript-highlight').forEach(el => el.classList.remove('userscript-highlight'));
    }

    //Ticket popup highlight toggle
    if (settings.highlightTicket) {
        highlightTicketPopup();
    } else {
        document.querySelectorAll('div.flex.flex-col.px-18pxr.pb-10pxr.space-y-10pxr button').forEach(button => {
            button.style.removeProperty('background-color');
        });
    }
}

function injectRecentButton() {
    if (document.getElementById('userscript-recent-btn')) return;

    const navList = document.querySelector('div[style*="height: 56px"] ul.flex');
    if (navList) {
        const newLi = document.createElement('li');
        newLi.id = 'userscript-recent-btn';
        
        const isLight = document.body.classList.contains('light');
        const colorMode = isLight ? "black" : "white";

        newLi.className = 'jsx-190339078 jsx-1307001962 list-child-item';
        newLi.style.marginLeft = '16px';
        newLi.style.display = 'flex';
        newLi.style.alignItems = 'center';

        newLi.innerHTML = `
            <a href="https://page.kakao.com/inven/recent" style="display: flex; align-items: center; text-decoration: none; gap: 4px;" class="active:opacity-30 cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 3C5.44772 3 5 3.44772 5 4C5 4.55228 5.44772 5 6 5H18C18.5523 5 19 4.55228 19 4C19 3.44772 18.5523 3 18 3H6Z" fill="${colorMode}"/>
                    <path d="M9 12C9 11.4477 9.44772 11 10 11H14C14.5523 11 15 11.4477 15 12C15 12.5523 14.5523 13 14 13H10C9.44772 13 9 12.5523 9 12Z" fill="${colorMode}"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 7C3.44772 7 3 7.44772 3 8V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V8C21 7.44772 20.5523 7 20 7H4ZM19 9H5V17.5C5 18.3284 5.67157 19 6.5 19H17.5C18.3284 19 19 18.3284 19 17.5V9Z" fill="${colorMode}"/>
                </svg>
                <span style="color: ${colorMode}; font-size: 12px; font-weight: 600; white-space: nowrap; letter-spacing: -0.3px;">최근본</span>
            </a>
        `;
        navList.appendChild(newLi);
    }
}

function checkAndHighlight() {
    const spans = document.querySelectorAll('span.font-x-small1.pt-1pxr.text-theme-solid-100');

    spans.forEach(span => {
        const text = span.textContent.trim();
        if (text.includes('이어보기')) {
            const targetDiv = span.closest('div[tabindex="0"], button, a, [class*="cursor-pointer"], div[role="button"]');
            if (targetDiv && targetDiv.parentElement) {
                targetDiv.parentElement.classList.add('userscript-highlight');
            }
        } else if (text.includes('다음화 보기')) {
            const targetDiv = span.closest('div[tabindex="0"], button, a, [class*="cursor-pointer"], div[role="button"]');
            if (targetDiv && targetDiv.parentElement) {
                targetDiv.parentElement.classList.remove('userscript-highlight');
            }
        }
    });
}

function highlightTicketPopup() {
    const buttons = document.querySelectorAll(`div.flex.flex-col.px-18pxr.pb-10pxr.space-y-10pxr button:not([data-t-obj*="대여_기다무대여권"])`);
    buttons.forEach(button => {
        button.style.setProperty('background-color', 'red', 'important');
    });
}

// Observer for dynamic element loading
let timeout = null;
const observer = new MutationObserver(() => {
    if (timeout) return;
    timeout = setTimeout(() => {
        applySettings();
        timeout = null;
    }, 150);
});

observer.observe(document.body, { childList: true, subtree: true });