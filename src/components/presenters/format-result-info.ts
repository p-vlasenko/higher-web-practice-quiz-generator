import type { ResultInfo } from '../presenters/types';
import type { QuizResult } from '@/messaging/events';

const CORRECT_PLACEHOLDER = '{{correct}}';
const TOTAL_PLACEHOLDER = '{{total}}';

export const formatResult = (result: QuizResult): ResultInfo => {
    const grade = getGrade(result);
    const resultInfo = getResultInfo(grade);

    return populateInfo(resultInfo, result);
};

const populateInfo = (
    { title, details, summary }: ResultInfo,
    result: QuizResult) => ({
    title,
    details: populate(details, result),
    summary: populate(summary, result),
});

const populate = (text: string, { correct, total }: QuizResult): string =>
    text.replace(CORRECT_PLACEHOLDER, correct.toString())
        .replace(TOTAL_PLACEHOLDER, total.toString());

const perfectResult: ResultInfo = {
    title: 'Тест завершён!',
    details: 'Вы ответили правильно на все вопросы 🎉',
    summary: 'Ваши знания на высоте - вы уверенно разбираетесь в теме',
};

const goodResult: ResultInfo = {
    title: 'Хороший результат!',
    details: `Вы ответили правильно на ${CORRECT_PLACEHOLDER} из ${TOTAL_PLACEHOLDER} вопросов.`,
    summary: 'Отличная попытка! Вы хорошо понимаете подход, но некоторые темы стоит освежить. Пройдите тест ещё раз, чтобы закрепить знания.',
};

const poorResult: ResultInfo = {
    title: 'Не расстраивайтесь!',
    details: `Вы ответили правильно только на ${CORRECT_PLACEHOLDER} из ${TOTAL_PLACEHOLDER} вопросов.`,
    summary: 'Не переживайте - ошибки это часть обучения. Попробуйте пройти тест снова, чтобы закрепить материал и улучшить результат.',
};

const getGrade = ({ correct, total }: QuizResult): number =>
    total === 0 ? 0 : correct / total;

const getResultInfo = (grade: number): ResultInfo =>
    grade === 1 ? perfectResult :
    grade > 0.5 ? goodResult :
    poorResult;
