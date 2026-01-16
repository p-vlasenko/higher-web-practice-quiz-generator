import { v7 as uuidV7 } from 'uuid';
import { Either } from '@/utils/fp/tuple-based-either';
import { QuizAddingError } from '@/errors/quiz-adding.error';
import type { Channels } from '@/messaging/types';
import type { EventsMap } from '@/messaging/events';
import type { CommandsMap } from '@/messaging/commands';
import type { ErrorMessageMap } from '@/messaging/error-messages';
import type { MessageBus, QuizStorage } from '@/types/base';
import type { QuizData } from '@/types/quiz';

type QuizzesModelDeps = Channels & {
    db: QuizStorage;
};

export class QuizzesModel {
    #db: QuizStorage;
    #eventChannel: MessageBus<EventsMap>;
    #commandChannel: MessageBus<CommandsMap>;
    #errorChannel: MessageBus<ErrorMessageMap>;

    constructor({ db, eventChannel, commandChannel, errorChannel }: QuizzesModelDeps) {
        this.#db = db;
        this.#eventChannel = eventChannel;
        this.#commandChannel = commandChannel;
        this.#errorChannel = errorChannel;
    }

    init() {
        this.#commandChannel.on(
            'QUIZ:ADD',
            async ({ quiz }) => { await this.add(quiz); },
        );
    }

    async add(quizData: QuizData): Promise<void> {
        try {
            const quiz = { id: uuidV7(), ...quizData };
            await this.#db.add(quiz);
            this.#eventChannel.emit('quiz_added', { quiz });
        }
        catch (error) {
            this.#errorChannel.emit('quiz_adding_error', new QuizAddingError(error));
        }
    }

    async loadQuizzes(): Promise<void> {
        await this.#db.getList().then(Either.match(
            err => this.#errorChannel.emit('quizzes_loading_error', err),
            quizzes => this.#eventChannel.emit('quizzes_loaded', { quizzes }),
        ));
    }
}
