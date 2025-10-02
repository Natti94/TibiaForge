export async function generateCsrf() {
  return Math.random().toString(36).slice(2);
}
