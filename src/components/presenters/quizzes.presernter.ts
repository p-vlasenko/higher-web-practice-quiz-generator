import type { Channels, CommandChannel, ErrorChannel, EventChannel } from '@/messaging/types';
import type { QuizCardFactory, QuizzesView } from '../view/view.types';

type Deps = Channels & {
    quizzesView: QuizzesView;
    quizCardFactory: QuizCardFactory;
};

export class QuizzesPresenter {
    #eventChannel: EventChannel;
    #errorChannel: ErrorChannel;
    #commandChannel: CommandChannel;
    #quizCardFactory: QuizCardFactory;
    #quizzesView: QuizzesView;

    constructor({
        eventChannel,
        errorChannel,
        commandChannel,
        quizzesView,
        quizCardFactory,
    }: Deps) {
        this.#eventChannel = eventChannel;
        this.#commandChannel = commandChannel;
        this.#errorChannel = errorChannel;
        this.#quizzesView = quizzesView;
        this.#quizCardFactory = quizCardFactory;
    }

    init() {
        this.#eventChannel.on('QUIZZES:LOADED', ({ quizzes }) => {
            const cards = quizzes.map(quiz => this.#quizCardFactory.make(quiz));
            this.#quizzesView.render(cards);
        });

        this.#eventChannel.on('QUIZ:REMOVED', ({ quizId }) => {
            this.#quizzesView.remove(quizId);
        });

        this.#errorChannel.on('ERROR:QUIZZES-LOADING', () => {
            this.#quizzesView.clear();
        });

        this.#quizzesView.on('start_quiz_click', ({ quizId }) => {
            window.location.href = `./quiz.html?id=${quizId}`;
        });

        this.#quizzesView.on(
            'delete_quiz_click',
            ({ quizId }) => this.#commandChannel.emit('QUIZ:REMOVE', { quizId }),
        );
    }
}
