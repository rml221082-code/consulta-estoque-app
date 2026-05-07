async function apiGet(action) {
  const res = await fetch(CONFIG.API_URL + "?action=" + action);
  return res.json();
}

async function apiPost(action, data) {
  const form = new URLSearchParams();
  form.append("action", action);

  for (let key in data) {
    form.append(key, data[key]);
  }

  const res = await fetch(CONFIG.API_URL, {
    method: "POST",
    body: form
  });

  return res.json();
}