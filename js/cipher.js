const API_URL = 'https://vebdizajn-4.onrender.com/api/vebdizajn/cezarova-sifra';

const USE_LOCAL_FALLBACK = true;

let currentMode = 'encrypt';

function setMode(mode) {
    currentMode = mode;
    const lang = localStorage.getItem('lang') || 'sr';

    const labels = {
        sr: {
            encrypt: { hint: 'Pretvori čitljiv tekst u šifrovanu poruku', submit: 'Šifruj', inputLabel: 'Originalna poruka', outputLabel: 'Šifrovana poruka' },
            decrypt: { hint: 'Pretvori šifrovanu poruku u čitljiv tekst', submit: 'Dešifruj', inputLabel: 'Šifrovana poruka', outputLabel: 'Dešifrovana poruka' }
        },
        en: {
            encrypt: { hint: 'Convert plain text into an encrypted message', submit: 'Encrypt', inputLabel: 'Original message', outputLabel: 'Encrypted message' },
            decrypt: { hint: 'Convert an encrypted message into plain text', submit: 'Decrypt', inputLabel: 'Encrypted message', outputLabel: 'Decrypted message' }
        }
    };

    const t = labels[lang][mode];

    document.getElementById('btn-encrypt').classList.toggle('active', mode === 'encrypt');
    document.getElementById('btn-decrypt').classList.toggle('active', mode === 'decrypt');
    if (document.getElementById('modeHint')) document.getElementById('modeHint').textContent = t.hint;
    if (document.getElementById('submitText')) document.getElementById('submitText').textContent = t.submit;

    const inputLabel = document.querySelector('.input-panel .panel-label') || document.querySelectorAll('.panel-label')[0];
    if (inputLabel) inputLabel.textContent = t.inputLabel;

    const outputLabel = document.querySelector('.output-panel .panel-label') || document.getElementById('outputLabel');
    if (outputLabel) outputLabel.textContent = t.outputLabel;

    resetOutput();
}

function adjustKey(delta) {
    const input = document.getElementById('shiftKey');
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 25;
    if (val > 25) val = 1;
    input.value = val;
}

function validateKey() {
    const input = document.getElementById('shiftKey');
    let val = parseInt(input.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 25) val = 25;
    input.value = val;
}

function updateCharCount() {
    const text = document.getElementById('inputText').value;
    document.getElementById('charCount').textContent = text.length;
}

async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('inputText').value = text;
        updateCharCount();
    } catch {
        document.getElementById('inputText').focus();
    }
}

async function copyOutput() {
    const result = document.getElementById('resultText').textContent;
    if (!result) return;
    try {
        await navigator.clipboard.writeText(result);
        const btn = document.getElementById('copyBtn');
        const original = btn.textContent;
        btn.textContent = '✓';
        btn.style.color = '#4CAF50';
        btn.style.borderColor = '#4CAF50';
        setTimeout(() => {
            btn.textContent = original;
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 1500);
    } catch {
        console.error('Copy failed');
    }
}

function clearInput() {
    document.getElementById('inputText').value = '';
    updateCharCount();
    resetOutput();
}

function swapTexts() {
    const input = document.getElementById('inputText');
    const result = document.getElementById('resultText').textContent;
    if (!result) return;
    input.value = result;
    updateCharCount();
    setMode(currentMode === 'encrypt' ? 'decrypt' : 'encrypt');
}

function resetOutput() {
    showOutputState('idle');
    hideApiStatus();
}

function showOutputState(state) {
    const states = ['idle', 'loading', 'result', 'error'];
    states.forEach(s => {
        const el = document.getElementById('output' + capitalize(s));
        if (el) {
            if (s === state) {
                el.classList.remove('d-none');
                el.style.display = 'flex';
            } else {
                el.classList.add('d-none');
                el.style.display = 'none';
            }
        }
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showApiStatus(type, text, preview = '') {
    const bar = document.getElementById('apiStatusBar');
    const dot = document.getElementById('apiStatusDot');
    const statusText = document.getElementById('apiStatusText');
    const previewEl = document.getElementById('apiRequestPreview');

    if (dot) dot.className = 'api-status-dot ' + type;
    if (statusText) statusText.textContent = text;
    if (previewEl) previewEl.textContent = preview;
    if (bar) bar.style.display = 'block';
}

function hideApiStatus() {
    const bar = document.getElementById('apiStatusBar');
    if (bar) bar.style.display = 'none';
}

function caesarCipher(text, shift, decrypt = false) {
    if (decrypt) shift = (26 - shift) % 26;
    return text.split('').map(char => {
        if (/[A-Z]/.test(char)) {
            return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
        } else if (/[a-z]/.test(char)) {
            return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
        }
        return char;
    }).join('');
}

async function submitCipher() {
    const text = document.getElementById('inputText').value.trim();
    const shift = parseInt(document.getElementById('shiftKey').value);
    const lang = localStorage.getItem('lang') || 'sr';

    if (!text) {
        document.getElementById('inputText').classList.add('input-error-shake');
        setTimeout(() => document.getElementById('inputText').classList.remove('input-error-shake'), 500);
        return;
    }

    if (isNaN(shift) || shift < 1 || shift > 25) {
        validateKey();
        return;
    }

    showOutputState('loading');

    const isDecrypt = currentMode === 'decrypt';

    const korak = isDecrypt ? -shift : shift;

    const url = `${API_URL}?tekst=${encodeURIComponent(text)}&korak=${korak}`;

    showApiStatus('loading',
        lang === 'sr' ? 'Slanje zahtjeva...' : 'Sending request...',
        `GET ...cezarova-sifra?tekst="${text.substring(0, 20)}..."&korak=${korak}`
    );

    try {
        const response = await fetch(url, {
            method: 'GET',
            signal: AbortSignal.timeout(8000)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        let result;
        if (typeof data === 'string') {
            result = data;
        } else {
            result = data.rezultat || data.result || data.tekst ||
                data.encrypted || data.decrypted || data.output ||
                Object.values(data)[0];
        }

        if (!result) throw new Error('Unexpected response format');

        displayResult(result, lang);
        showApiStatus('success',
            lang === 'sr' ? `200 OK · ${currentMode === 'encrypt' ? 'Šifrovano' : 'Dešifrovano'}` : `200 OK · ${currentMode === 'encrypt' ? 'Encrypted' : 'Decrypted'}`,
            lang === 'sr' ? `Pomak: ${shift} | Znakovi: ${result.length}` : `Shift: ${shift} | Chars: ${result.length}`
        );

    } catch (err) {

        if (USE_LOCAL_FALLBACK) {
            const result = caesarCipher(text, shift, isDecrypt);
            displayResult(result, lang);
            showApiStatus('success',
                lang === 'sr' ? `Lokalni izračun · Pomak: ${shift}` : `Local calculation · Shift: ${shift}`,
                lang === 'sr' ? '(API nedostupan  koristi se lokalna implementacija)' : '(API unavailable  using local implementation)'
            );
        } else {
            showOutputState('error');
            const errMsg = lang === 'sr'
                ? `Greška: ${err.message || 'API nije dostupan'}`
                : `Error: ${err.message || 'API unavailable'}`;
            document.getElementById('errorMsg').textContent = errMsg;
            showApiStatus('error',
                lang === 'sr' ? 'Zahtjev neuspješan' : 'Request failed',
                err.message
            );
        }
    }
}

function displayResult(result, lang) {
    showOutputState('result');
    document.getElementById('resultText').textContent = result;
}

const style = document.createElement('style');
style.textContent = `
    @keyframes input-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        75% { transform: translateX(6px); }
    }
    .input-error-shake { animation: input-shake 0.3s ease; border-color: var(--error) !important; }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    setMode('encrypt');
});