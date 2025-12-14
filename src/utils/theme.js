import Cookies from 'js-cookie';

export const getTheme = () => {
  return Cookies.get('theme') || 'light';
};

export const setTheme = (theme) => {
  Cookies.set('theme', theme, { expires: 365 });
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};