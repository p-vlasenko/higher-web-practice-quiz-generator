import { getFirstElementOrFail, getTemplateFirstChild } from '@/utils/dom-utils';
import { Observable } from '@/utils/observable';
import type { QuizCardView, QuizCardViewEvents } from '../presenters/view.types';
import type { Renderer } from '@/types/base';

export class QuizzesBrowserView
    extends Observable<QuizCardViewEvents>
    implements Renderer<QuizCardView[]> {
    #element: HTMLElement;
    #cardsContainerOrigin: HTMLElement;
    #emptyContentOrigin: HTMLElement;

    constructor() {
        super();
        this.#element = getFirstElementOrFail('.quizzes');
        this.#cardsContainerOrigin = getTemplateFirstChild('quiz-list-template');
        this.#emptyContentOrigin = getTemplateFirstChild('quiz-card-template');
    }

    render(cards: QuizCardView[]): void {
        if (cards.length < 1) {
            return this.#renderEmptyContent();
        }

        this.#renderCards(cards);
    }

    clear(): void {
        this.#renderEmptyContent();
    }

    #renderCards(cards: QuizCardView[]): void {
        const cardsContent = this.#cardsContainerOrigin.cloneNode(true) as DocumentFragment;
        const cardsContainer = getFirstElementOrFail('.quizzes__cards', cardsContent);
        cards.forEach(card => card.renderTo(cardsContainer));

        this.#element.replaceChildren(cardsContent);

        cards.forEach(it => it.on(
            'start_quiz_click',
            payload => this.emit('start_quiz_click', payload),
        ));
    }

    #renderEmptyContent() {
        const emptyContent = this.#emptyContentOrigin.cloneNode(true) as HTMLElement;
        this.#element.replaceChildren(emptyContent);
    }
}
