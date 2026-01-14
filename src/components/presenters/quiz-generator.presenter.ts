import type { QuizGeneratorView } from './view.types';
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
            payload => this.#commandChannel.emit('add_quiz', payload),
        );

        this.#generatorView.on(
            'validation_error',
            payload => this.#errorChannel.emit('quiz_validation_error', payload),
        );

        this.#eventChannel.on('quiz_added', async () => {
            this.#generatorView.clear();
            window.location.href = './quizzes.html';
        });
    }
}
