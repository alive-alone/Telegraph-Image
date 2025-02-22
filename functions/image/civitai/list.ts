export async function onRequest(context) {
  const { request } = context;
  try {
    const url = new URL(request.url);
    const response = fetch("https://civitai.com/api/v1/images" + url.search, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    return response;
  } catch (err) {
    return new Response(
      JSON.stringify({
        state: -1,
        message: "请求错误",
        errorMessage: err,
        error: true,
      }),
      { status: 500 }
    );
  }
}
