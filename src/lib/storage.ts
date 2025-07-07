// src/lib/storage.ts

export const saveUserToLocalStorage = (name: string, email: string) => {
  localStorage.setItem('userName', name);
  localStorage.setItem('userEmail', email);
};

export const getUserFromLocalStorage = () => {
  const name = localStorage.getItem('userName') || 'John Doe';
  const email = localStorage.getItem('userEmail') || 'john.doe@email.com';
  return { name, email };
};

export const clearUserFromLocalStorage = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('favoriteRecipes');
  localStorage.removeItem('lastSearchQuery');
  localStorage.removeItem('lastLanguage');
};
