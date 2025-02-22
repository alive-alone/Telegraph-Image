export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const res = await fetch("https://civitai.com/api/v1/images?page=1&limit=10", {
    method: "GET",
  });
  return res;
}
