import type { JsonParsingError } from '@/errors/json-parsing.error';
import type { QuizAddingError } from '@/errors/quiz-adding.error';
import type { QuizGettingError } from '@/errors/quiz-getting-error';
import type { QuizNotFoundError } from '@/errors/quiz-not-found';
import type { QuizRemovingError } from '@/errors/quiz-removing.error.js';
import type { QuizzesLoadingError } from '@/errors/quizzes-loading.error';
import type { ValidationError } from '@/errors/validation.error';

export type ErrorMessageMap = {
    ['ERROR:QUIZ-ADDING']: QuizAddingError;
    ['ERROR:QUIZ-REMOVING']: QuizRemovingError;
    ['ERROR:QUIZZES-LOADING']: QuizzesLoadingError;
    ['ERROR:QUIZ-GETTING']: QuizGettingError | QuizNotFoundError;
    ['ERROR:QUIZ-VALIDATION']: JsonParsingError | ValidationError;
};
