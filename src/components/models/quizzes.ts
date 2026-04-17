import { Either } from '@/utils/fp/tuple-based-either';
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

        this.#commandChannel.on(
            'QUIZ:REMOVE',
            async ({ quizId }) => { this.remove(quizId); },
        );
    }

    async loadQuizzes(): Promise<void> {
        await this.#db.getList().then(Either.match(
            err => this.#errorChannel.emit('ERROR:QUIZZES-LOADING', err),
            quizzes => this.#eventChannel.emit('QUIZZES:LOADED', { quizzes }),
        ));
    }

    private async add(quizData: QuizData): Promise<void> {
        await this.#db.add(quizData).then(Either.match(
            error => this.#errorChannel.emit('ERROR:QUIZ-ADDING', error),
            quiz => this.#eventChannel.emit('QUIZ:ADDED', { quiz }),
        ));
    }

    private async remove(quizId: string): Promise<void> {
        await this.#db.remove(quizId).then(Either.match(
            error => this.#errorChannel.emit('ERROR:QUIZ-REMOVING', error),
            () => this.#eventChannel.emit('QUIZ:REMOVED', { quizId }),
        ));
    }
}
