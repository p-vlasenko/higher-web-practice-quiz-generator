import type { Quiz, QuizId } from '@/types/quiz';
import { getFirstElementOrFail } from '@/utils/dom-utils';
import { Observable } from '@/utils/observable';
import type { QuizCardView, QuizCardViewEvents } from '../presenters/view.types';

type Deps = {
    element: HTMLElement;
    quizId: QuizId;
};

export class QuizCardBrowserView
    extends Observable<QuizCardViewEvents>
    implements QuizCardView {
    #quizId: QuizId;
    #element: HTMLElement;
    #title: HTMLElement;
    #description: HTMLElement;
    #count: HTMLElement;
    #action: HTMLElement;

    constructor({ element, quizId }: Deps) {
        super();
        this.#element = element;
        this.#quizId = quizId;

        this.#title = getFirstElementOrFail('.quiz-card__title', element);
        this.#description = getFirstElementOrFail('.quiz-card__description', element);
        this.#count = getFirstElementOrFail('.quiz-card__count', element);
        this.#action = getFirstElementOrFail('.quiz-card__action', element);

        this.#initListeners();
    }

    renderTo(container: HTMLElement | DocumentFragment): void {
        container.appendChild(this.#element);
    }

    render(quiz: Quiz): void {
        this.#quizId = quiz.id;
        this.#title.textContent = quiz.title;
        this.#description.textContent = quiz.description;
        const questionNumber = quiz.questions.length;
        this.#count.textContent = `${questionNumber} ${this.#getCountPostfix(questionNumber)}`;
    }

    #initListeners(): void {
        this.#action.addEventListener('click', event => {
            event.preventDefault();
            this.emit('start_quiz_click', { quizId: this.#quizId });
        });
    }

    #getCountPostfix(n: number): string {
        const lastDigit = parseInt(n.toString().at(-1) ?? '0', 10);

        return (
            lastDigit === 0 ? 'вопросов' :
            lastDigit === 1 ? 'вопрос' :
            lastDigit <= 4 ? 'вопроса' :
            'вопросов'
        );
    }
}
