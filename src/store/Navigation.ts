import { makeAutoObservable, runInAction } from 'mobx';

// Определяем тип для секций навигации
interface Section {
    active: boolean;
}

type Sections = {
    [key: string]: boolean; // Ключи могут быть любыми строками, значения - булевыми
};

class NavigationStore {
    nav: Record<string, Section> = {}; // Объект с секциями

    constructor(sections: Sections) {
        makeAutoObservable(this);
        this.createSections(sections);
    }

    // Создает секции на основе переданных параметров
    createSections(sections: Sections) {
        for (const key in sections) {
            this.createSection(key, sections[key]);
        }
    }

    // Создает отдельную секцию
    createSection(sectionName: string, active: boolean) {
        runInAction(() => {
            this.nav[sectionName] = { active };
        });
    }

    // Устанавливает активную секцию
    setActiveSection(sectionName: string) {
        if (!sectionName) {
            console.log('Секция не найдена: ' + sectionName);
            return;
        }

        runInAction(() => {
            // Устанавливаем все секции в false
            const nav = this.nav;
            Object.keys(nav).forEach((key) => {
                if (typeof nav[key].active === 'boolean') {
                    nav[key].active = false;
                } else if (typeof nav[key] === 'undefined') {
                    this.createSection(key, false); // Изменено с true на false, чтобы не активировать несуществующую секцию
                }
            });
            // Активируем только выбранную секцию
            if (nav[sectionName]) {
                nav[sectionName].active = true;
            }
        });
    }

    // Получить состояние экрана
    getNav(sectionName: string): boolean {
        const nav = this.nav;
        if (typeof nav[sectionName] === 'undefined') {
            this.createSection(sectionName, false);
        }
        return nav[sectionName].active;
    }
}

// Инициализация секций
const sections: Sections = {
    TapalkaMain: true,
    // CardsMain: false,
    // Referal: false,
};

const navigationStore = new NavigationStore(sections);
export default navigationStore;