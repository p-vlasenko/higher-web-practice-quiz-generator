import { getFirstElementOrFail, getTemplateFirstChild } from '@/utils/dom-utils';
import { Observable } from '@/utils/observable';
import type { QuizCardView, QuizCardViewEvents, QuizzesView } from './view.types';
import type { QuizId } from '@/types/quiz.js';

export class QuizzesBrowserView
    extends Observable<QuizCardViewEvents>
    implements QuizzesView {
    #element: HTMLElement;
    #cardsContainerOrigin: HTMLElement;
    #emptyContentOrigin: HTMLElement;
    #cards: Map<QuizId, QuizCardView>;

    constructor() {
        super();
        this.#element = getFirstElementOrFail('.quizzes');
        this.#cardsContainerOrigin = getTemplateFirstChild('quiz-list-template');
        this.#emptyContentOrigin = getTemplateFirstChild('empty-quizzes');
        this.#cards = new Map();
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

    remove(quizId: QuizId): void {
        const card = this.#cards.get(quizId);
        card?.remove();
        this.#cards.delete(quizId);
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

        cards.forEach(it => it.on(
            'delete_quiz_click',
            payload => this.emit('delete_quiz_click', payload),
        ));

        this.#cards = new Map(cards.map(it => [it.quizId, it])); // TODO: remove this line after refactoring
    }

    #renderEmptyContent() {
        const emptyContent = this.#emptyContentOrigin.cloneNode(true) as HTMLElement;
        this.#element.replaceChildren(emptyContent);
    }
}
