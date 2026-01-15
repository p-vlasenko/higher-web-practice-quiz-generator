import type { ResultInfo } from '../presenters/types';
import { getFirstElementOrFail, show, hide } from '@/utils/dom-utils';
import { Observable } from '@/utils/observable';
import type { QuizGameResultView, QuizGameResultViewEvents } from './view.types';

type Deps = {
    element: HTMLElement;
};

export class QuizGameResultBrowserView extends Observable<QuizGameResultViewEvents> implements QuizGameResultView {
    #element: HTMLElement;
    #title: HTMLElement;
    #details: HTMLElement;
    #summary: HTMLElement;
    #restartButton: HTMLButtonElement;

    constructor({ element }: Deps) {
        super();
        this.#element = element;
        this.#title = getFirstElementOrFail('.quiz-result__title', element);
        this.#details = getFirstElementOrFail('.quiz-result__details', element);
        this.#summary = getFirstElementOrFail('.quiz-result__summary', element);
        this.#restartButton = getFirstElementOrFail('.quiz-result__restart-button', element) as HTMLButtonElement;

        this.#restartButton.addEventListener('click', () => {
            this.hide();
            this.emit('restart', undefined);
        });
    }

    render({ title, details, summary }: ResultInfo): void {
        this.#title.textContent = title;
        this.#details.textContent = details;
        this.#summary.textContent = summary;

        this.show();
    }

    show() {
        show(this.#element);
        this.#element.classList.add('modal--open');
    }

    hide() {
        hide(this.#element);
        this.#element.classList.remove('modal--open');
    }
}
