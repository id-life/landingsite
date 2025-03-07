import { Subject } from 'rxjs';

type Message = {
  type: string;
  payload?: any;
}

export const eventBus = new Subject<Message>();