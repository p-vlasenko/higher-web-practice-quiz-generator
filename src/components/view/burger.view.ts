import { getFirstElementOrFail } from '@/utils/dom-utils';
import { navigateTo } from '@/utils/location.utils';

type Deps = {
    menu: HTMLElement;
};

export class BurgerBrowserView {
    #button: HTMLButtonElement;
    #menu: HTMLElement;
    #icon: HTMLImageElement;
    #dropdownTextElements: HTMLElement[];
    #isOpen: boolean;

    constructor({ menu }: Deps) {
        this.#menu = menu;
        this.#button = getFirstElementOrFail('.header__menu-button') as HTMLButtonElement;
        this.#icon = getFirstElementOrFail('.header__menu-icon') as HTMLImageElement;
        this.#dropdownTextElements = Array.from(document.querySelectorAll('.dropdown-text'));
        this.#isOpen = false;
    }

    init(): void {
        this.#button.addEventListener('click', () => this.#toggleIsOpen());

        this.#dropdownTextElements.forEach(item => {
            item.addEventListener(
                'click',
                () => item.textContent === 'Добавить квиз'
                    ? navigateTo('./index.html')
                    : navigateTo('./quizzes.html'),
            );
        });

        this.#menu.addEventListener('click', (evt: MouseEvent): void => {
            const target = evt.target as Element;

            if (
                this.#isOpen
                && !this.#menu.contains(target)
                && !this.#button.contains(target)
            ) {
                this.#close();
            }
        });
    }

    #close(): void {
        this.#isOpen = false;
        this.#updateView();
    };

    #toggleIsOpen(): void {
        this.#isOpen = !this.#isOpen;
        this.#updateView();
    };

    #updateView(): void {
        this.#menu.classList.toggle('burger-menu_active', this.#isOpen);
        document.documentElement.classList.toggle('menu__overflow', this.#isOpen);
        document.body.classList.toggle('menu__overflow', this.#isOpen);

        this.#icon.src = this.#isOpen ? './assets/cross.svg' : './assets/burger.svg';
        this.#icon.alt = this.#isOpen ? 'Закрыть меню' : 'Открыть меню';
    };
};
