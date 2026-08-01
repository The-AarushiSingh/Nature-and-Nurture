export function logActivity(token, { type, title, subtitle, relatedPlantId }) {
  if (!token) return; // only log for logged-in users
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activity`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type, title, subtitle, relatedPlantId }),
  }).catch(() => {}); // fire-and-forget, don't block UI on logging failures
}