export async function onRequest(context) {
  const { request, env } = context;
  const url = "https://telegra.ph/upload";
  const res = await fetch(url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  }).then(async (res) => {
    const json = await res.json();
    const id = json[0].src.split("/").pop();
    addImage(env, id);
    return new Response(JSON.stringify(json));
  });
  return res;
}

const addImage = async (env, id) => {
  const time = new Date().getTime();
  if (
    typeof env.img_url == "undefined" ||
    env.img_url == null ||
    env.img_url == ""
  ) {
  } else {
    //add image to kv
    await env.img_url.put(id, "", { metadata: { verify: 0, TimeStamp: time } });
  }
};
