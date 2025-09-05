export const getSessionStorage = (key: string) => {
    if (typeof window !== "undefined") {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  };
  
  export const setSessionStorage = (key: string, value: any) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  };
  
  export const removeSessionStorage = (key: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(key);
    }
  };
  