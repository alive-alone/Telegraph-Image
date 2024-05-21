export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const value = await env.img_url.list();
  const list = value.keys;
  if (
    list.length &&
    searchParams.has("type") &&
    searchParams.get("type") != "2"
  ) {
    const type = searchParams.get("type");
    return new Response(
      JSON.stringify(list.filter((item) => item.metadata.verify == type))
    );
  } else {
    return new Response(JSON.stringify(list));
  }
}
