import type { ErrorChannel } from '@/messaging/types';
import { QuizNotFoundError } from '@/errors/quiz-not-found';
import { JsonParsingError } from '@/errors/json-parsing.error';
import type { Renderer } from '@/types/base';
import type { ErrorDescription } from '@/types/view';

export type ErrorPresenterDeps = {
    errorView: Renderer<ErrorDescription>;
    errorChannel: ErrorChannel;
};

export class ErrorPresenter {
    #errorView: Renderer<ErrorDescription>;
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
            const message = error instanceof JsonParsingError
                ? 'Ошибка: не удалось обработать JSON.'
                : 'Ошибка: Неверная структура JSON.';

            this.#errorView.render({
                message,
                details: 'Проверьте формат данных и попробуйте снова.',
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

        this.#errorChannel.on('quizzes_loading_error', () => {
            this.#errorView.render({
                message: 'Ошибка: Ну удалось загрузить список тестов.',
                details: 'Произошла неизвестная ошибка, повторите попытку позже.',
            });
        });
    }
}
