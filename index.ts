import "expo-router/entry";

import { createServer, Response, Server } from "miragejs";

declare global {
  interface Window {
    server: Server;
  }
}

if (__DEV__) {
  if (window.server) {
    window.server.shutdown();
  }

  window.server = createServer({
    routes() {
      this.post("/login", (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);

        if (username === "jiahnkim" && password === "1234") {
          return {
            accessToken: "access-token",
            refreshToken: "refresh-token",
            user: {
              id: "dominica.world",
              name: "김지안",
              description: "🐢 프로그래머, jongin's mother",
              profileImageUrl:
                "https://avatars.githubusercontent.com/u/123456789?v=4",
            },
          };
        } else {
          return new Response(401, {}, { message: "Invalid credentials" });
        }
      });
    },
  });
}
