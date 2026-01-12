import type { MessageBus } from '@/types';
import type { EventsMap } from './events';
import type { CommandsMap } from './commands';
import type { ErrorMessageMap } from './error-messages';

export type EventChannel = MessageBus<EventsMap>;
export type CommandChannel = MessageBus<CommandsMap>;
export type ErrorChannel = MessageBus<ErrorMessageMap>;

export type EventChannelDeps = {
    eventChannel: EventChannel;
};

export type CommandChannelDeps = {
    commandChannel: CommandChannel;
};

export type ErrorChannelDeps = {
    errorChannel: ErrorChannel;
};

export type Channels = {
    eventChannel: EventChannel;
    commandChannel: CommandChannel;
    errorChannel: ErrorChannel;
};
