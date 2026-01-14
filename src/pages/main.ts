import { QuizGeneratorBrowserView } from '@view/quiz-generator.view';
import { QuizzesModel } from '@/components/models/quizzes';
import { QuizGeneratorPresenter } from '@/components/presenters/quiz-generator.presenter';
import { ErrorPresenter } from '@/components/presenters/error-presenter';
import { getFirstElementOrFail } from '@/utils/dom-utils';
import { initDb } from '@/utils/storage';
import { makeChannels } from '@/messaging/channels.factory';
import { ErrorLogger } from '@/components/error-logger';
import { ErrorBrowserView } from '@/components/view/error.view';

const db = await initDb();
const channels = makeChannels();

const quizzesModel = new QuizzesModel({ db, ...channels });

const quizGeneratorPresenter = new QuizGeneratorPresenter({
    generatorView: new QuizGeneratorBrowserView(getFirstElementOrFail('.generator')),
    ...channels,
});

const errorPresenter = new ErrorPresenter({
    errorView: new ErrorBrowserView(getFirstElementOrFail('#error-toast')),
    ...channels,
});

const errorLogger = new ErrorLogger(channels);

errorLogger.init();
quizzesModel.init();
quizGeneratorPresenter.init();
errorPresenter.init();
