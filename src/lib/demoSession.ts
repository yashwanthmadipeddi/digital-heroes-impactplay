export type DemoRole = 'user' | 'admin';
const KEY = 'impactplay-demo-session';
export const startDemoSession = (role: DemoRole) => sessionStorage.setItem(KEY, role);
export const getDemoSessionRole = (): DemoRole | null => {
  const role = sessionStorage.getItem(KEY);
  return role === 'user' || role === 'admin' ? role : null;
};
export const clearDemoSession = () => sessionStorage.removeItem(KEY);
