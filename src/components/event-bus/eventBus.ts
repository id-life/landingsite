// A synchronous publish/subscribe bus, the part of an rxjs Subject the site used (PERF-10: rxjs was about 4 kB gzip
// of the episode page's first-load JavaScript for this alone). As with a Subject, every message reaches the current
// subscribers in subscription order, and a subscriber that throws does not stop the others: its error is rethrown
// asynchronously, where rxjs reports it too.
type Message = {
  type: string;
  payload?: any;
};

type Listener = (message: Message) => void;

const listeners = new Set<Listener>();

export const eventBus = {
  next(message: Message) {
    for (const listener of [...listeners]) {
      try {
        listener(message);
      } catch (error) {
        setTimeout(() => {
          throw error;
        });
      }
    }
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return { unsubscribe: () => listeners.delete(listener) };
  },
};
