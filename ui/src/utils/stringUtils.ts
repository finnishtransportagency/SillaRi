export const capitalizeFirstLetter = (text: string): string => {
  if (text) {
    const text1 = text.toLocaleLowerCase();
    return text1.charAt(0).toLocaleUpperCase() + (text1.length > 1 ? text1.slice(1) : "");
  }
  return "";
};
