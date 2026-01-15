import type { ErrorChannel } from '@/messaging/types';
import { ErrorPresenter } from './error-presenter';
import { makeErrorView } from '../view/view.factories';

export const makeErrorPresenter = (errorChannel: ErrorChannel) => new ErrorPresenter({
    errorView: makeErrorView(),
    errorChannel,
});
