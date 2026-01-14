import type { ErrorChannel } from '@/messaging/types';
import type { ErrorBrowserView } from '../view/error.view';
import { QuizNotFoundError } from '@/errors/quiz-not-found';
import { JsonParsingError } from '@/errors/json-parsing.error';

export type ErrorPresenterDeps = {
    errorView: ErrorBrowserView;
    errorChannel: ErrorChannel;
};

export class ErrorPresenter {
    #errorView: ErrorBrowserView;
    #errorChannel: ErrorChannel;

    constructor({ errorView, errorChannel }: ErrorPresenterDeps) {
        this.#errorView = errorView;
        this.#errorChannel = errorChannel;
    }

    init() {
        this.#errorChannel.on('quiz_adding_error', () => {
            this.#errorView.render({
                message: 'Ошибка: Не удалось сохранить тест.',
                details: 'Произошла ошибка при сохранении в базу данных.',
            });
        });

        this.#errorChannel.on('quiz_validation_error', error => {
            const details = error instanceof JsonParsingError
                ? 'Ошибка: не удалось обработать JSON.'
                : 'Ошибка: Неверная структура JSON.';

            this.#errorView.render({
                message: 'Проверьте формат данных и попробуйте снова.',
                details,
            });
        });

        this.#errorChannel.on('quiz_getting_error', err => {
            if (err instanceof QuizNotFoundError) {
                this.#errorView.render({
                    message: 'Ошибка: Тест не найден.',
                    details: 'Возможно, вы ввели неверный идентификатор тест в строке URL.',
                });
            }
            else {
                this.#errorView.render({
                    message: 'Ошибка: Не удалось загрузить тест.',
                    details: 'Произошла неизвестная ошибка при загрузке теста.',
                });
            }
        });
    }
}
