import type { MessageBus } from './base';
import type { EventsMap } from '@/messaging/events';
import type { QuestionOption } from './quiz';

export type BaseViewSettings = {
    events: MessageBus<EventsMap>;
};

export type QuizGeneratorViewSettings = BaseViewSettings;

export type ErrorDescription = {
    message: string;
    details: string;
};

export type ToastViewSettings = BaseViewSettings;

export type QuizCardViewSettings = BaseViewSettings;

export type QuizzesViewData = {
    cards: HTMLElement[];
};

export type OptionViewData = {
    option: QuestionOption;
};

export type AnsweredOptionViewData = OptionViewData & {
    option: QuestionOption;
    checked: boolean;
    result?: {
        message: string;
        ok: boolean;
    };
};

export type QuestionOptionsData = {
    text: string;
    optionElements: HTMLElement[];
};

export type QuestionData = {
    questionElement: HTMLElement;
};

export type QuizContentViewSettings = BaseViewSettings;

export type QuizHeadViewData = {
    title: string;
    description: string;
};

export type Progress = {
    currentIndex: number;
    total: number;
};

export type ModalViewData = {
    data?: {
        title: string;
        subtitle: string;
        message: string;
    };
    isOpen: boolean;
};

export type ModalViewSettings = BaseViewSettings;

export type HeaderViewData = {
    isOpen?: boolean;
};
