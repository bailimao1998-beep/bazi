export function logInfo(message, meta = {}) {
  console.log(JSON.stringify({ level: "info", message, ...meta }));
}

export function logError(message, error) {
  console.error(JSON.stringify({ level: "error", message, error: error.message ?? String(error) }));
}
