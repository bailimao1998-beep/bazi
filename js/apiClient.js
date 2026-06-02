export async function requestNarrative(payload) {
  const response = await fetch("/api/narrative", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`请求失败：${response.status}`);
  return response.json();
}
