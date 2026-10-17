import * as fs from 'fs';
import * as path from 'path';

const DICT_DIR = path.join(process.cwd(), 'lib', 'i18n', 'dictionaries');

const ADDITIONS: Record<string, { home: Record<string, string>; common: Record<string, string> }> = {
    en: {
        home: {
            statReaction: "Reaction Time Scores",
            statTools: "Interactive Tools",
            statFree: "Free & In-Browser",
            enterArena: "Enter Arena",
            startQuest: "Start Quest",
        },
        common: {
            tools: "free tools",
        }
    },
    es: {
        home: {
            statReaction: "Puntuaciones de tiempo de reacción",
            statTools: "Herramientas interactivas",
            statFree: "Gratis y en el navegador",
            enterArena: "Entrar a la Arena",
            startQuest: "Comenzar misión",
        },
        common: {
            tools: "herramientas gratuitas",
        }
    },
    pt: {
        home: {
            statReaction: "Pontuações de tempo de reação",
            statTools: "Ferramentas interativas",
            statFree: "Gratuito e no navegador",
            enterArena: "Entrar na Arena",
            startQuest: "Iniciar missão",
        },
        common: {
            tools: "ferramentas gratuitas",
        }
    },
    de: {
        home: {
            statReaction: "Reaktionszeit-Ergebnisse",
            statTools: "Interaktive Tools",
            statFree: "Kostenlos & im Browser",
            enterArena: "Arena betreten",
            startQuest: "Quest starten",
        },
        common: {
            tools: "kostenlose Tools",
        }
    },
    fr: {
        home: {
            statReaction: "Scores de temps de réaction",
            statTools: "Outils interactifs",
            statFree: "Gratuit et sur navigateur",
            enterArena: "Entrer dans l'arène",
            startQuest: "Démarrer la quête",
        },
        common: {
            tools: "outils gratuits",
        }
    },
    ja: {
        home: {
            statReaction: "反応時間スコア",
            statTools: "インタラクティブツール",
            statFree: "完全無料・ブラウザ完結",
            enterArena: "アリーナに入る",
            startQuest: "クエスト開始",
        },
        common: {
            tools: "種類の無料ツール",
        }
    },
    ko: {
        home: {
            statReaction: "반응 시간 점수",
            statTools: "대화형 도구",
            statFree: "무료 및 브라우저 실행",
            enterArena: "아레나 입장",
            startQuest: "퀘스트 시작",
        },
        common: {
            tools: "개의 무료 도구",
        }
    },
    ru: {
        home: {
            statReaction: "Результаты времени реакции",
            statTools: "Интерактивных инструментов",
            statFree: "Бесплатно и в браузере",
            enterArena: "Войти в арену",
            startQuest: "Начать квест",
        },
        common: {
            tools: "бесплатных инструментов",
        }
    },
    it: {
        home: {
            statReaction: "Punteggi del tempo di reazione",
            statTools: "Strumenti interattivi",
            statFree: "Gratuito e nel browser",
            enterArena: "Entra nell'Arena",
            startQuest: "Inizia missione",
        },
        common: {
            tools: "strumenti gratuiti",
        }
    },
    pl: {
        home: {
            statReaction: "Wyniki czasu reakcji",
            statTools: "Narzędzia interaktywne",
            statFree: "Darmowe i w przeglądarce",
            enterArena: "Wejdź na arenę",
            startQuest: "Rozpocznij misję",
        },
        common: {
            tools: "darmowych narzędzi",
        }
    },
    tr: {
        home: {
            statReaction: "Tepki Süresi Skorları",
            statTools: "Etkileşimli Araç",
            statFree: "Ücretsiz ve Tarayıcıda",
            enterArena: "Arenaya Gir",
            startQuest: "Görevi Başlat",
        },
        common: {
            tools: "ücretsiz araç",
        }
    },
    id: {
        home: {
            statReaction: "Skor Waktu Reaksi",
            statTools: "Alat Interaktif",
            statFree: "Gratis & Di Peramban",
            enterArena: "Masuk ke Arena",
            startQuest: "Mulai Misi",
        },
        common: {
            tools: "alat gratis",
        }
    },
    vi: {
        home: {
            statReaction: "Điểm thời gian phản xạ",
            statTools: "Công cụ tương tác",
            statFree: "Miễn phí & trên trình duyệt",
            enterArena: "Vào đấu trường",
            startQuest: "Bắt đầu nhiệm vụ",
        },
        common: {
            tools: "công cụ miễn phí",
        }
    },
    "zh-CN": {
        home: {
            statReaction: "反应时间得分",
            statTools: "互动测试工具",
            statFree: "免费且免安装",
            enterArena: "进入竞技场",
            startQuest: "开始挑战",
        },
        common: {
            tools: "个免费工具",
        }
    },
    "zh-TW": {
        home: {
            statReaction: "反應時間得分",
            statTools: "互動測試工具",
            statFree: "免費且免安裝",
            enterArena: "進入競技場",
            startQuest: "開始挑戰",
        },
        common: {
            tools: "個免費工具",
        }
    },
    nl: {
        home: {
            statReaction: "Reactietijd scores",
            statTools: "Interactieve tools",
            statFree: "Gratis en in de browser",
            enterArena: "Betreed Arena",
            startQuest: "Start missie",
        },
        common: {
            tools: "gratis tools",
        }
    }
};

for (const [locale, data] of Object.entries(ADDITIONS)) {
    const filePath = path.join(DICT_DIR, `${locale}.json`);
    if (fs.existsSync(filePath)) {
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        json.home = { ...json.home, ...data.home };
        json.common = { ...json.common, ...data.common };
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
        console.log(`Updated ${locale}.json`);
    }
}
