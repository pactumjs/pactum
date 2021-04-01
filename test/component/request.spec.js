const pactum = require("../../src/index");
const request = pactum.request;
const config = require("../../src/config");

describe("Request", () => {
  it("GET with baseurl", async () => {
    request.setBaseUrl("http://localhost:9393");
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: "GET",
          path: "/users",
        },
        response: {
          status: 200,
        },
      })
      .get("/users")
      .expectStatus(200)
      .inspect();
  });

  it("OPTIONS with baseurl", async () => {
    request.setBaseUrl("http://localhost:9393");
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: "OPTIONS",
          path: "/users",
        },
        response: {
          status: 204,
          headers: {
            "access-control-allow-methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
          },
        },
      })
      .options("/users")
      .expectStatus(204)
      .expectHeader(
        "access-control-allow-methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE"
      );
  });

  it("TRACE with baseurl", async () => {
    request.setBaseUrl("http://localhost:9393");
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: "TRACE",
          path: "/users",
        },
        response: {
          status: 200,
        },
      })
      .trace("/users")
      .expectStatus(200);
  });

  it("HEAD with baseurl", async () => {
    request.setBaseUrl("http://localhost:9393");
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: "HEAD",
          path: "/users",
        },
        response: {
          status: 200,
        },
      })
      .withMethod("HEAD")
      .withPath("/users")
      .expectStatus(200);
  });

  it("with baseurl override", async () => {
    request.setBaseUrl("http://localhost:9392");
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: "GET",
          path: "/users",
        },
        response: {
          status: 200,
        },
      })
      .get("http://localhost:9393/users")
      .expectStatus(200);
  });

  it("with default header", async () => {
    request.setBaseUrl("http://localhost:9393");
    request.setDefaultHeaders("x", "a");
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: "GET",
          path: "/users",
          headers: {
            x: "a",
          },
        },
        response: {
          status: 200,
        },
      })
      .get("http://localhost:9393/users")
      .expectStatus(200);
  });

  it("with override default header to empty value", async () => {
    request.setBaseUrl("http://localhost:9393");
    request.setDefaultHeaders("x", "a");
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: "GET",
          path: "/users",
          headers: {
            x: "",
          },
        },
        response: {
          status: 200,
        },
      })
      .get("http://localhost:9393/users")
      .withHeaders("x", "")
      .expectStatus(200);
  });

  it("with override default header", async () => {
    request.setBaseUrl("http://localhost:9393");
    request.setDefaultHeaders("x", "a");
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: "GET",
          path: "/users",
          headers: {
            x: "b",
          },
        },
        response: {
          status: 200,
        },
      })
      .get("http://localhost:9393/users")
      .withHeaders("x", "b")
      .expectStatus(200);
  });

  it("with file - just path", async () => {
    await pactum
      .spec()
      .useInteraction({
        strict: false,
        request: {
          method: "POST",
          path: "/api/file",
        },
        response: {
          status: 200,
        },
      })
      .post("http://localhost:9393/api/file")
      .withFile("./package.json")
      .expectStatus(200);
  });

  it("with file - path & options", async () => {
    await pactum
      .spec()
      .useInteraction({
        strict: false,
        request: {
          method: "POST",
          path: "/api/file",
        },
        response: {
          status: 200,
        },
      })
      .post("http://localhost:9393/api/file")
      .withFile("./package.json", { contentType: "application/json" })
      .expectStatus(200);
  });

  it("with file - key & path", async () => {
    await pactum
      .spec()
      .useInteraction({
        strict: false,
        request: {
          method: "POST",
          path: "/api/file",
        },
        response: {
          status: 200,
        },
      })
      .post("http://localhost:9393/api/file")
      .withFile("file-2", "./package.json")
      .expectStatus(200);
  });

  it("with file - key, path & options", async () => {
    await pactum
      .spec()
      .useInteraction({
        strict: false,
        request: {
          method: "POST",
          path: "/api/file",
        },
        response: {
          status: 200,
        },
      })
      .post("http://localhost:9393/api/file")
      .withFile("file-2", "./package.json", { contentType: "application/json" })
      .expectStatus(200);
  });

  afterEach(() => {
    config.request.baseUrl = "";
    config.request.headers = {};
  });
});
