import { Either } from '@/utils/fp/tuple-based-either';

export class QuizRemovingError extends Error {
    constructor(cause: unknown) {
        super(`Unknown quiz removing error`, { cause });
    }
}

export const makeQuizRemovingErrorResult = (cause: unknown) =>
    Either.left(new QuizRemovingError(cause));
