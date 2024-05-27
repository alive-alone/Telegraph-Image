export async function onRequest(context) {
  const { request, env, params } = context;
  let datas = [] as Array<string>;

  const list = await env.img_url.list();
  const keys = list.keys;
  for (let key of keys) {
    const record = await env.img_url.getWithMetadata(key["name"]);
    if (record.metadata && record.metadata.verify == "1") {
      datas.push(key["name"] as string);
    }
  }
  const index = Math.floor(Math.random() * datas.length);
  const name = datas[index];
  return await fetch("https://telegra.ph/file/" + name, {
    method: "GET",
    headers: request.headers,
  });
}

const getRandom = (list: Array<string>) => {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
};
