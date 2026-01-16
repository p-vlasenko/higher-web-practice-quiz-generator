import { QuizGeneratorBrowserView } from '@view/quiz-generator.view';
import { QuizzesModel } from '@/components/models/quizzes';
import { QuizGeneratorPresenter } from '@/components/presenters/quiz-generator.presenter';
import { getFirstElementOrFail } from '@/utils/dom-utils';
import { initDb } from '@/utils/storage';
import { makeChannels } from '@/messaging/channels.factory';
import { ErrorLogger } from '@/components/error-logger';
import { BurgerBrowserView } from '@/components/view/burger.view';
import { makeErrorPresenter } from '@/components/presenters/presenter.factories';

const db = await initDb();
const channels = makeChannels();

const quizzesModel = new QuizzesModel({ db, ...channels });

const quizGeneratorPresenter = new QuizGeneratorPresenter({
    generatorView: new QuizGeneratorBrowserView(getFirstElementOrFail('.generator')),
    ...channels,
});

const errorPresenter = makeErrorPresenter(channels.errorChannel);

const errorLogger = new ErrorLogger(channels);

const burgerView = new BurgerBrowserView({
    menu: getFirstElementOrFail('.burger-menu'),
});

burgerView.init();
errorLogger.init();
quizzesModel.init();
quizGeneratorPresenter.init();
errorPresenter.init();
