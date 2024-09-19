export default function jsonp(url: string, callbackName?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const uniqueCallbackName = callbackName || `jsonpCallback_${Math.random().toString(36).substr(2)}`;

    (window as any)[uniqueCallbackName] = (response: any) => {
      resolve(response);
      document.body.removeChild(scriptElement);
      delete (window as any)[uniqueCallbackName];
    };

    const scriptElement = document.createElement('script');
    scriptElement.src = `${url}${url.includes('?') ? '&' : '?'}c=${uniqueCallbackName}`;
    scriptElement.onerror = (error: Event | string) => {
      reject(error);
      document.body.removeChild(scriptElement);
      delete (window as any)[uniqueCallbackName];
    };

    document.body.appendChild(scriptElement);
  });
}
