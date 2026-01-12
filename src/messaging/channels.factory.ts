import { EventEmitter } from '@/utils/event-emitter';
import type { EventsMap } from './events';
import type { CommandsMap } from './commands';
import type { ErrorMessageMap } from './error-messages';
import type { Channels } from './types';

export const makeChannels = (): Channels => ({
    eventChannel: new EventEmitter<EventsMap>(),
    commandChannel: new EventEmitter<CommandsMap>(),
    errorChannel: new EventEmitter<ErrorMessageMap>(),
});
