export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const response = fetch("https://telegra.ph/" + url.pathname + url.search, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  }).then(async (response) => {
    if (response.ok || (!response.ok && response.status === 304)) {
      if (request.headers.get("Referer") == url.origin + "/admin") {
        return response;
      }
      if (
        typeof env.img_url == "undefined" ||
        env.img_url == null ||
        env.img_url == ""
      ) {
      } else {
        const record = await env.img_url.getWithMetadata(params.id);
        if (record.metadata && record.metadata.verify == "1") {
          return response;
        }
      }
    }
    return new Response(
      JSON.stringify({ state: -1, message: "图片禁止访问或不存在" }),
      { status: 401 }
    );
  });
  return response;
}
