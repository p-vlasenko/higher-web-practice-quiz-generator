import { hide, show } from '@/utils/dom-utils';

export class QuizSectionBrowserView {
    #element: HTMLElement;

    constructor(element: HTMLElement) {
        this.#element = element;
    }

    show(): void {
        show(this.#element);
    }

    hide(): void {
        hide(this.#element);
    }
}
