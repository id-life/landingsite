export default function jsonp(url: string, callbackName?: string, timeout: number = 3000): Promise<any> {
  return new Promise((resolve, reject) => {
    const uniqueCallbackName = callbackName || `jsonpCallback_${Math.random().toString(36).substr(2)}`;
    let isResolved = false;

    const timeoutId = setTimeout(() => {
      if (!isResolved) {
        reject('JSONP request timeout');
        cleanup();
      }
    }, timeout);

    const cleanup = () => {
      clearTimeout(timeoutId);
      if (scriptElement.parentNode) {
        document.body.removeChild(scriptElement);
      }
      delete (window as any)[uniqueCallbackName];
      isResolved = true;
    };

    (window as any)[uniqueCallbackName] = (response: any) => {
      if (!isResolved) {
        resolve(response);
        cleanup();
      }
    };

    const scriptElement = document.createElement('script');
    scriptElement.src = `${url}${url.includes('?') ? '&' : '?'}c=${uniqueCallbackName}`;
    scriptElement.onerror = (error: Event | string) => {
      if (!isResolved) {
        reject(error);
        cleanup();
      }
    };

    document.body.appendChild(scriptElement);
  });
}
