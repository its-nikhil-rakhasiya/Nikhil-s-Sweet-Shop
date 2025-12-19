import Cookies from 'js-cookie';

export const getTheme = () => {
  return 'light';
};

export const setTheme = (theme) => {
  // Always remove dark mode for white theme requirement
  document.documentElement.classList.remove('dark');
};