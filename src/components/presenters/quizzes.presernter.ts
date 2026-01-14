import type { Channels, ErrorChannel, EventChannel } from '@/messaging/types';
import type { QuizCardFactory, QuizzesView } from './view.types';

type Deps = Pick<Channels, 'eventChannel' | 'errorChannel'> & {
    quizzesView: QuizzesView;
    quizCardFactory: QuizCardFactory;
};

export class QuizzesPresenter {
    #eventChannel: EventChannel;
    #errorChannel: ErrorChannel;
    #quizCardFactory: QuizCardFactory;
    #quizzesView: QuizzesView;

    constructor({
        eventChannel,
        errorChannel,
        quizzesView,
        quizCardFactory,
    }: Deps) {
        this.#eventChannel = eventChannel;
        this.#errorChannel = errorChannel;
        this.#quizzesView = quizzesView;
        this.#quizCardFactory = quizCardFactory;
    }

    init() {
        this.#eventChannel.on('quizzes_loaded', ({ quizzes }) => {
            const cards = quizzes.map(quiz => this.#quizCardFactory.make(quiz));
            this.#quizzesView.render(cards);
        });

        this.#errorChannel.on('quizzes_loading_error', () => {
            this.#quizzesView.clear();
        });

        this.#quizzesView.on('start_quiz_click', ({ quizId }) => {
            window.location.href = `./quiz.html?id=${quizId}`;
        });
    }
}
