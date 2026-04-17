import type { QuizData, QuizId } from '@/types/quiz';

export type SelectedOptions = {
    selectedOptionIds: Set<number>;
};

export type CommandsMap = {
    ['QUIZ:ADD']: QuizAddingParams;
    ['QUIZ:REMOVE']: { quizId: QuizId };
    ['QUIZ-GAME:QUESTION:NEXT']: undefined;
    ['QUIZ-GAME:RESTART']: undefined;
    ['QUIZ-GAME:QUESTION:ANSWER']: SelectedOptions;
};

export type QuizAddingParams = {
    quiz: QuizData;
};
