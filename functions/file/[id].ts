export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  let fileUrl = "https://telegra.ph/" + url.pathname + url.search;
  if (url.pathname.length > 39) {
    const formdata = new FormData();
    formdata.append("file_id", url.pathname);
    const filePath = await getFilePath(
      env,
      url.pathname.split(".")[0].split("/")[2]
    );
    fileUrl = `https://api.telegram.org/file/bot${env.TG_Bot_Token}/${filePath}`;
  }
  const response = fetch(fileUrl, {
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

async function getFilePath(env, file_id) {
  try {
    const url = `https://api.telegram.org/bot${env.TG_Bot_Token}/getFile?file_id=${file_id}`;
    const res = await fetch(url, {
      method: "GET",
    });

    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      return null;
    }

    const responseData = await res.json();
    const { ok, result } = responseData;

    if (ok && result) {
      return result.file_path;
    } else {
      console.error("Error in response data:", responseData);
      return null;
    }
  } catch (error) {
    console.error("Error fetching file path:", error.message);
    return null;
  }
}
