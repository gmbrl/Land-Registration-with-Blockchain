import React, { useState, useRef, useEffect, useMemo } from "react";
import "./AIExplainer.css";
import explainerBg from "./assets/images/explainer-bg.jpg";

// Script translations, keyed by two-letter language code. Add more languages
// here any time — just match the key to the language prefix of the system
// voices you want supported (e.g. "en" matches "en-US", "en-GB", ...).
const SLIDE_TRANSLATIONS = {
    en: [
        {
            title: "Welcome",
            text:
                "Welcome to the Land Registration System. This is a blockchain " +
                "based platform that lets you securely buy and sell land, with " +
                "every transaction verified on the Ethereum network.",
        },
        {
            title: "Getting Started",
            text:
                "Before you begin, make sure you have the MetaMask browser " +
                "extension installed, and Ganache running to simulate a local " +
                "Ethereum blockchain for testing.",
        },
        {
            title: "Registering",
            text:
                "If you own land and want to sell it, register as a Seller. If " +
                "you're looking to purchase land, register as a Buyer.",
        },
        {
            title: "Verification",
            text:
                "After you register, a Land Inspector will verify your profile " +
                "and documents. Once approved, sellers can list land and buyers " +
                "can request it.",
        },
        {
            title: "You're Ready",
            text:
                "That's the core workflow. Explore the FAQ below for more " +
                "detail, or replay this explainer any time.",
        },
    ],
    nl: [
        {
            title: "Welkom",
            text:
                "Welkom bij het Grondregistratiesysteem. Dit is een blockchain " +
                "gebaseerd platform waarmee je veilig grond kunt kopen en " +
                "verkopen, waarbij elke transactie wordt geverifieerd op het " +
                "Ethereum-netwerk.",
        },
        {
            title: "Aan de slag",
            text:
                "Zorg er voordat je begint voor dat je de MetaMask " +
                "browserextensie hebt geïnstalleerd, en dat Ganache draait om " +
                "een lokale Ethereum-blockchain te simuleren voor testen.",
        },
        {
            title: "Registreren",
            text:
                "Als je grond bezit en wilt verkopen, registreer je als " +
                "Verkoper. Wil je grond kopen, registreer je als Koper.",
        },
        {
            title: "Verificatie",
            text:
                "Nadat je je hebt geregistreerd, controleert een " +
                "Landinspecteur je profiel en documenten. Na goedkeuring " +
                "kunnen verkopers grond aanbieden en kopers dit aanvragen.",
        },
        {
            title: "Klaar om te starten",
            text:
                "Dat is de kern van het proces. Bekijk de FAQ hieronder voor " +
                "meer details, of speel deze uitleg opnieuw af wanneer je wilt.",
        },
    ],
    fr: [
        {
            title: "Bienvenue",
            text:
                "Bienvenue sur le systeme d'enregistrement foncier. Il s'agit " +
                "d'une plateforme basee sur la blockchain qui vous permet " +
                "d'acheter et de vendre des terrains en toute securite, chaque " +
                "transaction etant verifiee sur le reseau Ethereum.",
        },
        {
            title: "Pour commencer",
            text:
                "Avant de commencer, assurez-vous d'avoir installe l'extension " +
                "de navigateur MetaMask, et que Ganache fonctionne pour simuler " +
                "une blockchain Ethereum locale a des fins de test.",
        },
        {
            title: "Inscription",
            text:
                "Si vous possedez un terrain et souhaitez le vendre, inscrivez " +
                "vous en tant que vendeur. Si vous souhaitez acheter un " +
                "terrain, inscrivez vous en tant qu'acheteur.",
        },
        {
            title: "Verification",
            text:
                "Apres votre inscription, un inspecteur foncier verifiera " +
                "votre profil et vos documents. Une fois approuves, les " +
                "vendeurs peuvent lister des terrains et les acheteurs les " +
                "demander.",
        },
        {
            title: "Vous etes pret",
            text:
                "Voila le fonctionnement principal. Consultez la FAQ ci " +
                "dessous pour plus de details, ou relancez cette presentation " +
                "a tout moment.",
        },
    ],
    de: [
        {
            title: "Willkommen",
            text:
                "Willkommen beim Grundstuecksregistrierungssystem. Dies ist " +
                "eine blockchain basierte Plattform, mit der Sie sicher Land " +
                "kaufen und verkaufen koennen, wobei jede Transaktion im " +
                "Ethereum Netzwerk verifiziert wird.",
        },
        {
            title: "Erste Schritte",
            text:
                "Stellen Sie vor dem Start sicher, dass die MetaMask Browser " +
                "Erweiterung installiert ist und Ganache laeuft, um eine " +
                "lokale Ethereum Blockchain zum Testen zu simulieren.",
        },
        {
            title: "Registrierung",
            text:
                "Wenn Sie Land besitzen und verkaufen moechten, registrieren " +
                "Sie sich als Verkaeufer. Wenn Sie Land kaufen moechten, " +
                "registrieren Sie sich als Kaeufer.",
        },
        {
            title: "Verifizierung",
            text:
                "Nach der Registrierung prueft ein Grundstuecksinspektor Ihr " +
                "Profil und Ihre Dokumente. Nach der Freigabe koennen " +
                "Verkaeufer Land anbieten und Kaeufer es anfragen.",
        },
        {
            title: "Bereit",
            text:
                "Das ist der Kernablauf. Schauen Sie sich unten die FAQ an, " +
                "oder spielen Sie diese Erklaerung jederzeit erneut ab.",
        },
    ],
    es: [
        {
            title: "Bienvenido",
            text:
                "Bienvenido al Sistema de Registro de Tierras. Esta es una " +
                "plataforma basada en blockchain que te permite comprar y " +
                "vender terrenos de forma segura, con cada transaccion " +
                "verificada en la red Ethereum.",
        },
        {
            title: "Primeros pasos",
            text:
                "Antes de comenzar, asegurate de tener instalada la extension " +
                "de navegador MetaMask, y que Ganache este ejecutandose para " +
                "simular una blockchain Ethereum local para pruebas.",
        },
        {
            title: "Registro",
            text:
                "Si posees un terreno y quieres venderlo, registrate como " +
                "Vendedor. Si quieres comprar un terreno, registrate como " +
                "Comprador.",
        },
        {
            title: "Verificacion",
            text:
                "Despues de registrarte, un Inspector de Tierras verificara " +
                "tu perfil y documentos. Una vez aprobado, los vendedores " +
                "pueden listar terrenos y los compradores solicitarlos.",
        },
        {
            title: "Listo",
            text:
                "Ese es el flujo principal. Explora las preguntas frecuentes " +
                "abajo para mas detalle, o vuelve a reproducir esta " +
                "explicacion cuando quieras.",
        },
    ],
    sw: [
        {
            title: "Karibu",
            text:
                "Karibu kwenye Mfumo wa Usajili wa Ardhi. Hii ni jukwaa " +
                "linalotumia teknolojia ya blockchain linalokuwezesha kununua " +
                "na kuuza ardhi kwa usalama, huku kila muamala ukithibitishwa " +
                "kwenye mtandao wa Ethereum.",
        },
        {
            title: "Kuanza",
            text:
                "Kabla ya kuanza, hakikisha umesakinisha kiendelezi cha " +
                "kivinjari cha MetaMask, na Ganache inafanya kazi ili kuiga " +
                "blockchain ya Ethereum ya ndani kwa ajili ya majaribio.",
        },
        {
            title: "Kujisajili",
            text:
                "Ikiwa unamiliki ardhi na unataka kuiuza, jisajili kama " +
                "Muuzaji. Ikiwa unatafuta kununua ardhi, jisajili kama " +
                "Mnunuzi.",
        },
        {
            title: "Uthibitishaji",
            text:
                "Baada ya kujisajili, Mkaguzi wa Ardhi atathibitisha wasifu " +
                "wako na hati zako. Baada ya kuidhinishwa, wauzaji wanaweza " +
                "kuorodhesha ardhi na wanunuzi wanaweza kuiomba.",
        },
        {
            title: "Uko Tayari",
            text:
                "Huo ndio mtiririko mkuu wa mfumo. Angalia Maswali Yanayoulizwa " +
                "Mara kwa Mara hapa chini kwa maelezo zaidi, au cheza tena " +
                "maelezo haya wakati wowote.",
        },
    ],
};

const DEFAULT_LANG = "en";

const LANGUAGE_LABELS = {
    en: "English",
    nl: "Nederlands",
    fr: "Français",
    de: "Deutsch",
    es: "Español",
    sw: "Kiswahili",
};

// Find a system voice whose language prefix matches the requested language.
// Returns null if the device/browser has no such voice installed.
function findVoiceIndexForLang(lang, voices) {
    const idx = voices.findIndex(
        (v) => v.lang && v.lang.slice(0, 2).toLowerCase() === lang
    );
    return idx === -1 ? null : idx;
}

export default function AIExplainer() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [progress, setProgress] = useState(0);
    const [supported, setSupported] = useState(true);
    const [voices, setVoices] = useState([]);
    const [voiceIndex, setVoiceIndex] = useState(-1);
    const [selectedLang, setSelectedLang] = useState(DEFAULT_LANG);
    const slideIndexRef = useRef(0);
    const voiceIndexRef = useRef(-1);

    useEffect(() => {
        if (typeof window === "undefined" || !window.speechSynthesis) {
            setSupported(false);
            return;
        }

        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            if (available.length) {
                setVoices(available);
                const preferred = available.findIndex(
                    (v) => /en[-_]/i.test(v.lang) && /Google|Natural|Neural/i.test(v.name)
                );
                const initial = preferred !== -1 ? preferred : 0;
                setVoiceIndex(initial);
                voiceIndexRef.current = initial;
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const slides = useMemo(() => SLIDE_TRANSLATIONS[selectedLang], [selectedLang]);
    const nativeVoiceIndex = useMemo(
        () => findVoiceIndexForLang(selectedLang, voices),
        [selectedLang, voices]
    );
    const hasNativeVoice = nativeVoiceIndex !== null;

    const resetPlayback = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setIsSpeaking(false);
        setProgress(0);
        setCurrentSlide(0);
        slideIndexRef.current = 0;
    };

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        resetPlayback();
        setSelectedLang(lang);

        // If the device has a matching voice, switch to it automatically.
        // Otherwise keep the currently selected voice as a best-effort reader.
        const match = findVoiceIndexForLang(lang, voices);
        if (match !== null) {
            setVoiceIndex(match);
            voiceIndexRef.current = match;
        }
    };

    const speakSlide = (index, activeSlides) => {
        if (index >= activeSlides.length) {
            setIsPlaying(false);
            setIsPaused(false);
            setIsSpeaking(false);
            setProgress(0);
            slideIndexRef.current = 0;
            return;
        }

        slideIndexRef.current = index;
        setCurrentSlide(index);
        setProgress(0);

        const slideText = activeSlides[index].text;
        const utterance = new SpeechSynthesisUtterance(slideText);
        utterance.rate = 0.98;
        utterance.pitch = 1;
        if (voices[voiceIndexRef.current]) {
            utterance.voice = voices[voiceIndexRef.current];
        }

        utterance.onstart = () => setIsSpeaking(true);

        utterance.onboundary = (event) => {
            if (event.charIndex != null) {
                setProgress(Math.min(100, (event.charIndex / slideText.length) * 100));
            }
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setProgress(100);
            speakSlide(index + 1, activeSlides);
        };

        window.speechSynthesis.speak(utterance);
    };

    const handlePlay = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
            setIsSpeaking(true);
            return;
        }
        window.speechSynthesis.cancel();
        setIsPlaying(true);
        setIsPaused(false);
        speakSlide(0, slides);
    };

    const handlePause = () => {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setIsPlaying(false);
        setIsSpeaking(false);
    };

    const handleRestart = () => {
        resetPlayback();
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setIsSpeaking(false);
        setProgress(0);
    };

    const handleVoiceChange = (e) => {
        resetPlayback();
        const idx = Number(e.target.value);
        setVoiceIndex(idx);
        voiceIndexRef.current = idx;
    };

    if (!supported) {
        return (
            <div className="ai-explainer ai-explainer--unsupported">
                <p>
                    Your browser doesn't support voice narration. Please try Chrome,
                    Edge, or Safari.
                </p>
            </div>
        );
    }

    const overallProgress = ((currentSlide + progress / 100) / slides.length) * 100;

    return (
        <div
            className="ai-explainer"
            style={{ backgroundImage: `url(${explainerBg})` }}
        >
            <div className="ai-explainer__overlay" />
            <div className="ai-explainer__content">
                <div className="ai-explainer__badge">
                    <span
                        className={
                            "ai-explainer__pulse" +
                            (isSpeaking ? " ai-explainer__pulse--active" : "")
                        }
                    />
                    AI Explainer
                </div>

                <div className="ai-explainer__selectors">
                    <select
                        className="ai-explainer__lang-select"
                        value={selectedLang}
                        onChange={handleLanguageChange}
                        disabled={isPlaying}
                    >
                        {Object.keys(SLIDE_TRANSLATIONS).map((lang) => (
                            <option key={lang} value={lang}>
                                {LANGUAGE_LABELS[lang] || lang}
                            </option>
                        ))}
                    </select>

                    {voices.length > 0 && (
                        <select
                            className="ai-explainer__voice-select"
                            value={voiceIndex}
                            onChange={handleVoiceChange}
                            disabled={isPlaying}
                        >
                            {voices.map((v, i) => (
                                <option key={i} value={i}>
                                    {v.name} ({v.lang})
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {!hasNativeVoice && (
                    <p className="ai-explainer__voice-note">
                        No {LANGUAGE_LABELS[selectedLang]} voice found on this device —
                        using the selected voice as a best-effort reader.
                    </p>
                )}

                <div className="ai-explainer__overall-track">
                    <div
                        className="ai-explainer__overall-fill"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>

                <div className="ai-explainer__slide" key={`${selectedLang}-${currentSlide}`}>
                    <h3>{slides[currentSlide].title}</h3>
                    <p>{slides[currentSlide].text}</p>
                </div>

                <div className="ai-explainer__slide-progress-track">
                    <div
                        className="ai-explainer__slide-progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="ai-explainer__dots">
                    {slides.map((_, i) => (
                        <span
                            key={i}
                            className={
                                "ai-explainer__dot" +
                                (i === currentSlide ? " ai-explainer__dot--active" : "") +
                                (i < currentSlide ? " ai-explainer__dot--done" : "")
                            }
                        />
                    ))}
                </div>

                <div className="ai-explainer__controls">
                    {!isPlaying ? (
                        <button className="ai-explainer__btn--primary" onClick={handlePlay}>
                            {isPaused ? "Resume" : "▶  Play Explainer"}
                        </button>
                    ) : (
                        <button onClick={handlePause}>⏸  Pause</button>
                    )}
                    <button onClick={handleStop} disabled={!isPlaying && !isPaused}>
                        ⏹  Stop
                    </button>
                    <button onClick={handleRestart}>↺  Restart</button>
                </div>
            </div>
        </div>
    );
}