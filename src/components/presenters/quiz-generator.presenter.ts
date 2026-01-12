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
    #commandChannel: CommandChannel;
    #errorChannel: ErrorChannel;

    constructor({
        generatorView,
        eventChannel,
        errorChannel,
        commandChannel,
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

        this.#errorChannel.on(
            ['quiz_adding_error', 'quiz_validation_error'],
            () => this.#generatorView.toInvalid(),
        );

        this.#errorChannel.on(
            'quiz_validation_error',
            () => this.#generatorView.toInvalid(),
        );

        this.#eventChannel.on('quiz_added', async () => {
            this.#generatorView.clear();
            window.location.href = './quizzes.html';
        });
    }
}
