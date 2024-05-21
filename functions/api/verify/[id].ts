export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const value = await env.img_url.getWithMetadata(params.id);
  if (searchParams.has("type")) {
    value.metadata.verify = searchParams.get("type");
    await env.img_url.put(params.id, "", { metadata: value.metadata });
  }
  return new Response(JSON.stringify(value.metadata));
}
