if (!window.__app__) {
  throw new Error("Config missing.");
}

let parsed;

try {
  parsed = JSON.parse(atob(window.__app__));
} catch (e) {
  throw new Error("Config invalid.");
}

const Config = Object.freeze(parsed);

export default Config;
