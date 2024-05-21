async function errorHandling(context) {
  try {
    return await context.next();
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 });
  }
}

function basicAuthentication(request) {
  const Authorization = request.headers.get("Authorization");
  const [scheme, encoded] = Authorization.split(" ");

  if (!encoded || scheme !== "Basic") {
    throw new BadRequestException("Malformed authorization header.");
  }

  const buffer = Uint8Array.from(atob(encoded), (character) =>
    character.charCodeAt(0)
  );
  const decoded = new TextDecoder().decode(buffer).normalize();
  const index = decoded.indexOf(":");

  if (index === -1 || /[\0-\x1F\x7F]/.test(decoded)) {
    throw new BadRequestException("Invalid authorization value.");
  }

  return {
    user: decoded.substring(0, index),
    pass: decoded.substring(index + 1),
  };
}

function UnauthorizedException(reason) {
  return new Response(reason, {
    status: 401,
    statusText: "Unauthorized",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "Cache-Control": "no-store",
      "Content-Length": reason.length,
    },
  });
}

function BadRequestException(reason) {
  return new Response(reason, {
    status: 400,
    statusText: "Bad Request",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "Cache-Control": "no-store",
      "Content-Length": reason.length,
    },
  });
}

function authentication(context) {
  if (
    typeof context.env.img_url == "undefined" ||
    context.env.img_url == null ||
    context.env.img_url == ""
  ) {
    return new Response(
      "Dashboard is disabled. Please bind a KV namespace to use this feature.",
      { status: 200 }
    );
  }
  if (
    typeof context.env.BASIC_USER == "undefined" ||
    context.env.BASIC_USER == null ||
    context.env.BASIC_USER == ""
  ) {
    return context.next();
  } else {
    if (context.request.headers.has("Authorization")) {
      const { user, pass } = basicAuthentication(context.request);

      if (context.env.BASIC_USER !== user || context.env.BASIC_PASS !== pass) {
        return UnauthorizedException("Invalid credentials.");
      } else {
        return context.next();
      }
    } else {
      return new Response("You need to login.", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="my scope", charset="UTF-8"',
        },
      });
    }
  }
}

export const onRequest = [errorHandling, authentication];
