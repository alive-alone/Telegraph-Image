export async function onRequest(context) {
  const { request, env } = context;

  if (request.method.toUpperCase() === "POST") {
    const body = await readRequestBody(request);
    try {
      if (body["list"] && body["type"]) {
        const list = body["list"];
        const type = body["type"];
        if (list?.length) {
          for (let id of list) {
            const value = await env.img_url.getWithMetadata(id);
            if (value.metadata) {
              value.metadata.verify = type;
              await env.img_url.put(id, "", { metadata: value.metadata });
            }
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

async function readRequestBody(request) {
  const contentType = request.headers.get("content-type");
  if (contentType.includes("application/json")) {
    return await request.json();
  } else if (contentType.includes("application/text")) {
    return request.text();
  } else if (contentType.includes("text/html")) {
    return request.text();
  } else if (contentType.includes("form")) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return body;
  } else {
    return {};
  }
}
