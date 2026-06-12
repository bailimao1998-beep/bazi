export async function requestNarrative(payload) {
  const response = await fetch("/api/narrative", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`请求失败：${response.status}`);
  return response.json();
}

export async function getAiSettings() {
  const response = await fetch("/api/settings/ai");
  if (!response.ok) throw new Error(`设置读取失败：${response.status}`);
  return response.json();
}

export async function saveAiSettings(payload) {
  const response = await fetch("/api/settings/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`设置保存失败：${response.status}`);
  return response.json();
}

export async function testAiSettings(payload) {
  const response = await fetch("/api/settings/ai/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`连接测试失败：${response.status}`);
  return response.json();
}

export async function listCases() {
  const response = await fetch("/api/cases");
  if (!response.ok) throw new Error(`案例列表读取失败：${response.status}`);
  return response.json();
}

export async function saveCase(payload) {
  const response = await fetch("/api/cases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`案例保存失败：${response.status}`);
  return response.json();
}

export async function getCase(id) {
  const response = await fetch(`/api/cases/${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error(`案例读取失败：${response.status}`);
  return response.json();
}

export async function updateCase(id, payload) {
  const response = await fetch(`/api/cases/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`案例更新失败：${response.status}`);
  return response.json();
}

export async function deleteCase(id) {
  const response = await fetch(`/api/cases/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!response.ok) throw new Error(`案例删除失败：${response.status}`);
  return response.json();
}
