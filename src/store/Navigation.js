import { makeAutoObservable, runInAction, autorun, reaction, toJS } from 'mobx';


const sections = {
    TapalkaMain: true,
    CardsMain: false,
    Referal: false,
};


class NavigationStore {
    nav = {};

    constructor(sections) {
        makeAutoObservable(this);
        this.createSections(sections);
    }

    createSections(sections){
        for(let key in sections){
            this.createSection(key, sections[key]);
        }
    }

    createSection(sectionName, active){
        runInAction(() => {
            this.nav[sectionName] = { active };
        });
    }

    // Общая функция для переключения разделов, в основном используется в onClick
    setActiveSection(sectionName) {
        if(!sectionName){
            console.log('Секция не найдена '+sectionName);
            return;
        }
        runInAction(() => {
            // Устанавливаем все секции в false
            let nav = this.nav;
            Object.keys(nav).forEach((key) => {
                if (typeof nav[key].active === 'boolean') {
                    nav[key].active = false;
                }else if(typeof nav[key] === 'undefined'){
                    this.createSection(key, true);
                }
            });
            // Активируем только выбранную секцию
            nav[sectionName].active = true;
        });
    }

    //получить состояние экрана
    getNav(sectionName){
        let nav = this.nav;
        if(typeof nav[sectionName] === 'undefined'){
            this.createSection(sectionName, false);
        }
        return nav[sectionName].active;
    }
}


const navigationStore = new NavigationStore(sections);
export default navigationStore;