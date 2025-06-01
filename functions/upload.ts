export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const clonedRequest = request.clone();
    const formData = await clonedRequest.formData();
    const datas = {};

    const uploadFile = formData.get("file");

    const fileType = uploadFile.type;
    const fileName = uploadFile.name;
    formData.forEach((value, key) => {
      datas[key] = value;
    });
    console.log({
      formData: datas,
      request: request,
      uploadFile: uploadFile,
      fileType: fileType,
      fileName: fileName,
    });
    return new Response(
      JSON.stringify({
        formData: datas,
        request: request,
        uploadFile: uploadFile,
        fileType: fileType,
        fileName: fileName,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
    const fileExtension = fileName?.split(".").pop().toLowerCase();
    const fileTypeMap = {
      "image/": { url: "sendPhoto", type: "photo" },
      "video/": { url: "sendVideo", type: "video" },
      "audio/": { url: "sendAudio", type: "audio" },
      "application/pdf": { url: "sendDocument", type: "document" },
    };
    const defaultType = { url: "sendDocument", type: "document" };
    const fileTypeKey = Object.keys(fileTypeMap).find((key) =>
      fileType.startsWith(key)
    );
    const { url, type } = fileTypeMap[fileTypeKey] || defaultType;

    const telegramFormData = new FormData();
    telegramFormData.append(type, uploadFile);
    telegramFormData.append("chat_id", env.TG_CHAT_ID);
    // env.TG_BOT_TOKEN  env.TG_CHAT_ID
    const result = await uploadToTelegram(
      telegramFormData,
      url,
      env.TG_BOT_TOKEN
    );

    if (!result.success) {
      throw new Error(result.error);
    }
    const fileId = getFileId(result.data);

    if (!fileId) {
      throw new Error("Failed to get file ID");
    }
    if (
      typeof env.img_url == "undefined" ||
      env.img_url == null ||
      env.img_url == ""
    ) {
    } else {
      const time = new Date().getTime();
      //add image to kv
      await env.img_url.put(`${fileId}.${fileExtension}`, "", {
        metadata: { verify: "0", TimeStamp: time },
      });
    }
    return new Response(
      JSON.stringify([{ src: `/file/${fileId}.${fileExtension}` }]),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message, request: request }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function uploadToTelegram(formData, resourcePath, token, retryCount = 0) {
  const MAX_RETRIES = 2;
  const apiUrl = `https://api.telegram.org/bot${token}/${resourcePath}`;
  try {
    const response = await fetch(apiUrl, { method: "POST", body: formData });
    const responseData = await response.json();

    if (response.ok) {
      return { success: true, data: responseData };
    }

    // 图片上传失败时转为文档方式重试
    if (retryCount < MAX_RETRIES && resourcePath === "sendPhoto") {
      console.log("Retrying image as document...");
      const newFormData = new FormData();
      newFormData.append("chat_id", formData.get("chat_id"));
      newFormData.append("document", formData.get("photo"));
      return await uploadToTelegram(
        newFormData,
        "sendDocument",
        token,
        retryCount + 1
      );
    }

    return {
      success: false,
      error: responseData.description || "Upload to Telegram failed",
    };
  } catch (error) {
    console.error("Network error:", error);
    if (retryCount < MAX_RETRIES) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * (retryCount + 1))
      );
      return await uploadToTelegram(
        formData,
        resourcePath,
        token,
        retryCount + 1
      );
    }
    return { success: false, error: "Network error occurred" };
  }
}

function getFileId(response) {
  if (!response.ok || !response.result) return null;

  const result = response.result;
  if (result.photo) {
    return result.photo.reduce((prev, current) =>
      prev.file_size > current.file_size ? prev : current
    ).file_id;
  }
  if (result.document) return result.document.file_id;
  if (result.video) return result.video.file_id;
  if (result.audio) return result.audio.file_id;

  return null;
}
/**

  const url = "https://telegra.ph/upload";
  const res = await fetch(url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  }).then(async (res) => {
    const json = await res.json();
    const id = json[0].src.split("/").pop();

    if (
      typeof env.img_url == "undefined" ||
      env.img_url == null ||
      env.img_url == ""
    ) {
    } else {
      const time = new Date().getTime();
      //add image to kv
      await env.img_url.put(id, "", {
        metadata: { verify: "0", TimeStamp: time },
      });
    }
    return new Response(JSON.stringify(json));
  });
  return res;
 */

const addImage = async (env, id) => {
  const time = new Date().getTime();
  if (
    typeof env.img_url == "undefined" ||
    env.img_url == null ||
    env.img_url == ""
  ) {
  } else {
    //add image to kv
    await env.img_url.put(id, "value", {
      metadata: { verify: "0" },
    });
  }
};
