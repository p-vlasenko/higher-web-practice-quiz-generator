import type { QuizAddingError } from '@/errors/quiz-adding.error';
import type { QuizGettingError } from '@/errors/quiz-getting-error';
import type { QuizzesLoadingError } from '@/errors/quizzes-loading.error';

export type ErrorMessageMap = {
    ['quiz_adding_error']: QuizAddingError;
    ['quizzes_loading_error']: QuizzesLoadingError;
    ['quiz_getting_error']: QuizGettingError;
};
