export const hasEmailError = (email) => {
  if (!email) {
    return false;
  }

  const trimmedEmail = String(email).trim();

  const result = trimmedEmail
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

  return result === null ? true : false;
};
