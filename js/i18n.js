const translations = {
    sr: {
        "page-title": "Cezarova Šifra | Caesar Cipher",
        "brand-main": "Cezarova Šifra",
        "brand-sub": "Drevna umetnost šifrovanja",
        "nav-home": "Početna",
        "nav-cipher": "Šifrator",
        "nav-about": "O projektu",
        "nav-contact": "Kontakt",
        "nav-login": "Prijava",
        "hero-label": "Anno Domini · I vijek p.n.e.",
        "hero-title-1": "Drevna Tajnost",
        "hero-title-2": "Rimskih Legija",
        "hero-desc": "Gaj Julije Cezar koristio je jednostavnu, ali genijalnu metodu zaštite svojih vojnih poruka. Svako slovo pomjereno za određeni broj pozicija u abecedi  tajna koja je čuvala imperiju.",
        "hero-cta": "Isprobaj Šifrator",
        "hero-cta2": "Saznaj više",
        "scroll-down": "Skroluj dole",
        "how-eyebrow": "Princip rada",
        "how-title": "Kako funkcioniše?",
        "step1-title": "Unesi poruku",
        "step1-desc": "Ukucaj tekst koji želiš da šifruješ  može biti bilo koja kombinacija slova.",
        "step2-title": "Odaberi ključ",
        "step2-desc": "Broj od 1 do 25  za koliko pozicija se pomjeraju slova u abecedi.",
        "step3-title": "Dobij šifru",
        "step3-desc": "API vraća šifrovanu poruku. Samo onaj ko zna ključ može je dešifrovati.",
        "try-now": "Isprobaj odmah",
        "hist-eyebrow": "Historija",
        "hist-title": "Šifra stara 2000 godina",
        "hist-p1": "Gaj Julije Cezar (100–44 p.n.e.) koristio je ovu šifru za tajnu komunikaciju sa svojim generalima tokom vojnih pohoda. Svako slovo u poruci zamjenjivalo se slovom koje se nalazi tri mjesta dalje u abecedi.",
        "hist-p2": "Rimski historičar Svetonije opisao je ovu metodu u djelu Život dvanaestorice careva. Upravo zbog Cezarove upotrebe, ova vrsta supstitucijske šifre nosi njegovo ime do danas.",
        "hist-quote": "\"Si qui occultius perferenda erant, per notas scripsit...\"",
        "demo-plain": "Originalna abeceda",
        "demo-cipher": "Šifrovana abeceda",
        "footer-sub": "Projektni zadatak · Web dizajn",
        "footer-copy": "© 2026 · Državni Univerzitet u Novom Pazaru",
    },
    en: {
        "page-title": "Caesar Cipher | Cezarova Šifra",
        "brand-main": "Caesar Cipher",
        "brand-sub": "The ancient art of encryption",
        "nav-home": "Home",
        "nav-cipher": "Cipher Tool",
        "nav-about": "About",
        "nav-contact": "Contact",
        "nav-login": "Login",
        "hero-label": "Anno Domini · 1st Century BC",
        "hero-title-1": "Ancient Secret",
        "hero-title-2": "Of Roman Legions",
        "hero-desc": "Julius Caesar used a simple yet brilliant method to protect his military messages. Each letter shifted by a fixed number of positions in the alphabet  a secret that guarded the empire.",
        "hero-cta": "Try the Cipher",
        "hero-cta2": "Learn more",
        "scroll-down": "Scroll down",
        "how-eyebrow": "How it works",
        "how-title": "How does it work?",
        "step1-title": "Enter a message",
        "step1-desc": "Type the text you want to encrypt  any combination of letters will do.",
        "step2-title": "Choose a key",
        "step2-desc": "A number from 1 to 25  how many positions each letter shifts in the alphabet.",
        "step3-title": "Get the cipher",
        "step3-desc": "The API returns the encrypted message. Only those who know the key can decrypt it.",
        "try-now": "Try it now",
        "hist-eyebrow": "History",
        "hist-title": "A 2000-year-old cipher",
        "hist-p1": "Julius Caesar (100–44 BC) used this cipher for secret communication with his generals during military campaigns. Each letter was replaced by a letter three positions further in the alphabet.",
        "hist-p2": "Roman historian Suetonius described this method in his work The Twelve Caesars. Because of Caesar's use, this type of substitution cipher bears his name to this day.",
        "hist-quote": "\"Si qui occultius perferenda erant, per notas scripsit...\"",
        "demo-plain": "Plain alphabet",
        "demo-cipher": "Cipher alphabet",
        "footer-sub": "Project Assignment · Web Design",
        "footer-copy": "© 2026 · State University of Novi Pazar",
    }
};

function setLanguage(lang) {
    if (!translations[lang]) return;
    localStorage.setItem('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    if (translations[lang]['page-title']) {
        document.title = translations[lang]['page-title'];
    }

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + lang);
    if (activeBtn) activeBtn.classList.add('active');

    document.documentElement.lang = lang;
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang') || 'sr';
    setLanguage(savedLang);
});
