export const hasEmailError = (email) => {
  if (!email) {
    return false;
  }

  const trimmedEmail = String(email).trim();

  const result = trimmedEmail.toLowerCase().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.]\.[a-zA-Z0-9.]$/);

  return result === null ? true : false;
};
