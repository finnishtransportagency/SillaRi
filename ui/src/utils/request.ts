export const getOrigin = (): string => {
  const origin = window.location.hostname === "localhost" ? "http://localhost:8080" : "";
  // console.log("origin", origin);
  return origin;
};

export default getOrigin;
