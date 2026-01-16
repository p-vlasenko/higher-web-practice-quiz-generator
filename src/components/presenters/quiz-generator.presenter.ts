import type { QuizGeneratorView } from '../view/view.types';
import type {
    Channels,
    CommandChannel,
    ErrorChannel,
    EventChannel,
} from '@/messaging/types';

export type QuizGeneratorPresenterDeps = & Channels
  & {
      generatorView: QuizGeneratorView;
  };

export class QuizGeneratorPresenter {
    #generatorView: QuizGeneratorView;
    #eventChannel: EventChannel;
    #errorChannel: ErrorChannel;
    #commandChannel: CommandChannel;

    constructor({
        generatorView,
        eventChannel,
        commandChannel,
        errorChannel,
    }: QuizGeneratorPresenterDeps) {
        this.#generatorView = generatorView;
        this.#eventChannel = eventChannel;
        this.#commandChannel = commandChannel;
        this.#errorChannel = errorChannel;
    }

    init() {
        this.#generatorView.on(
            'submit',
            payload => this.#commandChannel.emit('QUIZ:ADD', payload),
        );

        this.#generatorView.on(
            'validation_error',
            payload => this.#errorChannel.emit('ERROR:QUIZ-VALIDATION', payload),
        );

        this.#eventChannel.on('QUIZ:ADDED', async () => {
            this.#generatorView.clear();
            window.location.href = './quizzes.html';
        });
    }
}
