export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  return Response.redirect(url.origin + "/admin", 302);
}
