import type { QuizData } from '@/types/quiz';

export type SelectedOptions = {
    selectedOptionIds: Set<number>;
};

export type CommandsMap = {
    ['add_quiz']: QuizAddingParams;
    ['move_to_next_question']: undefined;
    ['restart_quiz_game']: undefined;
    ['add_answer']: SelectedOptions;
};

export type QuizAddingParams = {
    quiz: QuizData;
};
