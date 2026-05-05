/**
 * RTL text detection and DOM mutation observer.
 *
 * Watches for new posts and labels them with:
 *   .mmRTL--rtl  → message text starts with a strong RTL character
 *   .mmRTL--ltr  → message text starts with a strong LTR character
 *
 * Posts that are already owned by the logged-in user already carry the
 * Mattermost-native class `current--user`, which the CSS layer uses for
 * the right-hand bubble styling.
 */

// Unicode ranges for strong RTL characters
// Arabic, Persian, Hebrew, Syriac, Thaana, NKo, Samaritan, Mandaic, …
const RTL_RANGES = /[֐-׿؀-ۿ܀-ݏݐ-ݿހ-޿߀-߿ࠀ-࠿ࡀ-࡟ࢠ-ࣿיִ-﷽ﹰ-ﻼ]/;

// Strong LTR (basic Latin letters)
const LTR_RANGES = /[A-Za-z]/;

/**
 * Returns 'rtl', 'ltr', or null (neutral / no strong chars found).
 * Skips code spans and code fences so that code blocks are never flipped.
 */
function detectDirection(rawText) {
    if (!rawText) return null;

    // Strip inline code and fenced code blocks from direction analysis
    const text = rawText
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`\n]+`/g, '');

    for (const ch of text) {
        if (RTL_RANGES.test(ch)) return 'rtl';
        if (LTR_RANGES.test(ch)) return 'ltr';
    }
    return null;
}

/**
 * Apply direction classes to a single `.post` element.
 */
function processPost(postEl) {
    // Skip system messages
    if (postEl.classList.contains('post--system')) return;

    // Prefer the rendered text node; fall back to the whole body text
    const textEl =
        postEl.querySelector('.post-message__text') ||
        postEl.querySelector('.post-message') ||
        postEl.querySelector('.post__body');

    if (!textEl) return;

    const dir = detectDirection(textEl.textContent || '');

    postEl.classList.remove('mmRTL--rtl', 'mmRTL--ltr');
    if (dir === 'rtl') {
        postEl.classList.add('mmRTL--rtl');
    } else if (dir === 'ltr') {
        postEl.classList.add('mmRTL--ltr');
    }
    // null → no class added → browser default (unicode-bidi: plaintext handles it)
}

/**
 * Process every post currently visible in the DOM.
 */
function processAllPosts() {
    document.querySelectorAll('.post:not(.post--system)').forEach(processPost);
}

let observer = null;

/**
 * Start observing DOM mutations to tag new/updated posts.
 * Called once during plugin initialization.
 */
export function initRTLDetector() {
    // Tag whatever is already on screen
    processAllPosts();

    if (observer) observer.disconnect();

    observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;

                    // Direct post node
                    if (node.classList && node.classList.contains('post')) {
                        processPost(node);
                        continue;
                    }

                    // Container that holds posts (e.g. virtual list row)
                    if (node.querySelectorAll) {
                        node.querySelectorAll('.post:not(.post--system)').forEach(processPost);
                    }
                }
            }
        }
    });

    // #app-content is the main channel area; fall back to body
    const root = document.getElementById('app-content') || document.body;
    observer.observe(root, { childList: true, subtree: true });

    // Re-scan when the user switches channels (Mattermost is a SPA)
    window.addEventListener('popstate', () => setTimeout(processAllPosts, 400));

    // Disconnect cleanly when the page unloads
    window.addEventListener('beforeunload', () => observer && observer.disconnect());
}
