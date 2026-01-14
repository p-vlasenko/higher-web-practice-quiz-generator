import type { Quiz } from '@/types/quiz';
import type { QuizCardView } from '../presenters/view.types';
import { QuizCardBrowserView } from './quiz-card.view';

type Deps = {
    quizCardTemplate: HTMLElement;
};

export class QuizCardBrowserViewFactory {
    #quizCardTemplate: HTMLElement;

    constructor({ quizCardTemplate }: Deps) {
        this.#quizCardTemplate = quizCardTemplate;
    }

    make(quiz: Quiz): QuizCardView {
        const card = new QuizCardBrowserView({
            quizId: quiz.id,
            element: this.#quizCardTemplate.cloneNode(true) as HTMLElement,
        });

        card.render(quiz);

        return card;
    }
}
