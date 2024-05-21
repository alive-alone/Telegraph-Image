export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  console.log(url.search);
  const searchParams = new URLSearchParams(url.search);
  const value = await env.img_url.list();
  const list = value.keys;
  // if (searchParams.has("type") && searchParams.get("type") != "2") {

  // } else {

  // }
  return new Response(JSON.stringify(value));
}
