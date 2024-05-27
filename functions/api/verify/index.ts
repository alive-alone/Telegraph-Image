export async function onRequest(context) {
  const { request, env } = context;

  if (request.method.toUpperCase() === "POST") {
    const body = await request.json();
    const searchParams = new URLSearchParams(body);
    try {
      console.log(searchParams.has("list"), searchParams.has("type"));
      if (searchParams.has("list") && searchParams.has("type")) {
        const list = searchParams.get("list");
        const type = searchParams.get("type");
        if (list?.length) {
          for (let id of list) {
            const value = await env.img_url.getWithMetadata(id);
            value.metadata.verify = type;
            await env.img_url.put(id, "", { metadata: value.metadata });
          }
        }
      }
      return new Response("verify success");
    } catch (err) {
      return new Response(err);
    }
  } else {
    return new Response("Not supported url request!");
  }
}
