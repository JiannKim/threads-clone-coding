import "expo-router/entry";

import {
  belongsTo,
  createServer,
  hasMany,
  Model,
  Response,
  RestSerializer,
  Server,
  Factory,
} from "miragejs";
import { faker } from "@faker-js/faker";

declare global {
  interface Window {
    server: Server;
  }
}

let dominica: any;

if (__DEV__) {
  if (window.server) {
    window.server.shutdown();
  }

  window.server = createServer({
    models: {
      user: Model.extend({
        posts: hasMany("post"),
        activities: hasMany("activity"),
      }),
      post: Model.extend({
        user: belongsTo("user"),
      }),
      search: Model.extend({
        user: belongsTo("user"),
      }),
      activity: Model.extend({
        user: belongsTo("user"),
      }),
    },
    serializers: {
      post: RestSerializer.extend({
        include: ["user"],
        embed: true,
      }),
      activity: RestSerializer.extend({
        include: ["user"],
        embed: true,
      }),
    },
    factories: {
      user: Factory.extend({
        id: () => faker.person.firstName(),
        name: () => faker.person.fullName(),
        description: () => faker.lorem.sentence(),
        profileImageUrl: () =>
          `https://avatars.githubusercontent.com/u/${Math.floor(
            Math.random() * 100_000
          )}?v=4`,
        isVerified: () => Math.random() > 0.5,
      }),
      post: Factory.extend({
        id: () => faker.string.numeric(6),
        content: () => faker.lorem.paragraph(),
        imageUrls: () =>
          Array.from({ length: Math.floor(Math.random() * 3) }, () =>
            faker.image.urlLoremFlickr({ category: "earth" })
          ),
        likes: () => Math.floor(Math.random() * 100),
        comments: () => Math.floor(Math.random() * 100),
        reposts: () => Math.floor(Math.random() * 100),
      }),
      search: Factory.extend({
        id: () => faker.string.uuid(),
        name: () => faker.person.firstName(),
        username: () => faker.internet.username().toLowerCase(),
        profileImageUrl: () =>
          `https://avatars.githubusercontent.com/u/${Math.floor(
            Math.random() * 100_000
          )}?v=4`,
        bio: () => faker.lorem.sentence(),
        followers: () => faker.number.int({ min: 10, max: 5000 }),
        isVerified: () => faker.helpers.arrayElement([true, false]),
      }),
      activity: Factory.extend({
        type: () =>
          faker.helpers.arrayElement([
            "followed",
            "reply",
            "like",
            "repost",
            "mention",
            "quote",
            "verified",
          ]),
        content: () => faker.lorem.sentence(),
        timeAgo: () =>
          faker.helpers.arrayElement(["1h", "2h", "5m", "1d", "3d", "1w"]),
        postId: () =>
          Math.random() > 0.3 ? faker.string.numeric(6) : undefined,
        otherCount: () =>
          Math.random() > 0.7
            ? faker.number.int({ min: 1, max: 10 })
            : undefined,
        likes: () =>
          Math.random() > 0.5
            ? faker.number.int({ min: 1, max: 100 })
            : undefined,
        reply: () => (Math.random() > 0.7 ? faker.lorem.sentence() : undefined),
      }),
    },
    seeds(server) {
      dominica = server.create("user", {
        id: "dominica",
        name: "김지안",
        description: "🐢 프로그래머, jongin's mother",
        profileImageUrl: "https://avatars.githubusercontent.com/u/885857?v=4",
      });
      const users = server.createList("user", 10);
      users.forEach((user) => {
        server.createList("post", 5, {
          user,
        });
      });
      server.createList("post", 5, {
        user: dominica,
      });

      const usersForActivity = server.schema.all("user").models;
      usersForActivity.forEach((user: any) => {
        server.createList("activity", 3, { user });
      });
    },
    routes() {
      this.post("/posts", async (schema, request) => {
        const formData = request.requestBody as unknown as FormData;
        const posts: Record<string, string | string[]>[] = [];
        formData.forEach(async (value, key) => {
          const match = key.match(/posts\[(\d+)\]\[(\w+)\](\[(\d+)\])?$/);
          console.log("key", key, match, value);
          if (match) {
            const [_, index, field, , imageIndex] = match;
            const i = parseInt(index);
            const imgI = parseInt(imageIndex);
            if (!posts[i]) {
              posts[i] = {};
            }
            if (field === "imageUrls") {
              if (!posts[i].imageUrls) {
                posts[i].imageUrls = [] as string[];
              }
              (posts[i].imageUrls as string[])[imgI] = (
                value as unknown as { uri: string }
              ).uri;
            } else if (field === "location") {
              try {
                posts[i].location = JSON.parse(value as string)!;
              } catch (error) {
                console.log("post location error", error);
                posts[i].location = [] as string[];
              }
            } else {
              posts[i][field] = value as string;
            }
          }
        });
        console.log("form data posts", posts);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        posts.forEach((post: any) => {
          schema.create("post", {
            id: post.id,
            content: post.content,
            imageUrls: post.imageUrls,
            location: post.location,
            user: schema.find("user", dominica?.id),
          });
        });
        return posts;
      });

      this.get("/posts", (schema, request) => {
        let posts = schema.all("post");
        if (request.queryParams.type === "following") {
          posts = posts.filter((post: any) => post.user?.id === dominica?.id);
        }

        let targetIndex = -1;
        if (request.queryParams.cursor) {
          targetIndex = posts.models.findIndex(
            (post: any) => post.id === request.queryParams.cursor
          );
        }
        return posts.slice(targetIndex + 1, targetIndex + 11);
      });

      this.get("/posts/:id", (schema, request) => {
        return schema.find("post", request.params.id);
      });

      this.get("/posts/:id/comments", (schema, request) => {
        const comments = schema.all("post");
        let targetIndex = -1;
        if (request.queryParams.cursor) {
          targetIndex = comments.models.findIndex(
            (comment: any) => comment.id === request.queryParams.cursor
          );
        }
        return comments.slice(targetIndex + 1, targetIndex + 11);
      });

      this.get("/users/:id", (schema, request) => {
        return schema.find("user", request.params.id.slice(1));
      });

      this.get("/users/:id/:type", (schema, request) => {
        console.log("request", request.queryParams);
        const userId = request.params.id.startsWith("@")
          ? request.params.id.slice(1)
          : request.params.id;
        let posts = schema.all("post");
        if (request.params.type === "threads") {
          posts = posts.filter((post) => post.user?.id === userId);
        } else if (request.params.type === "reposts") {
          posts = posts.filter((post) => post.user?.id !== userId);
        } else if (request.params.type === "replies") {
          posts = posts.filter((post) => post.user?.id !== userId);
        }
        let targetIndex = -1;
        if (request.queryParams.cursor) {
          targetIndex = posts.models.findIndex(
            (v) => v.id === request.queryParams.cursor
          );
        }
        return posts.slice(targetIndex + 1, targetIndex + 11);
      });

      this.get("/search", (schema, request) => {
        const query = (request.queryParams.q as string)?.toLowerCase() || "";
        let users = schema.all("search").models;

        if (query) {
          users = users.filter(
            (user: any) =>
              user.username.toLowerCase().includes(query) ||
              user.name.toLowerCase().includes(query)
          );
        }
        return new Response(
          200,
          {},
          { users: users.map((user: any) => user.attrs) }
        );
      });

      this.get("/activity", (schema: any, request) => {
        const typeFilter = (request.queryParams.type as string) || "all";
        let activities = schema.all("activity").models;

        const typeMap: Record<string, string> = {
          follows: "followed",
          replies: "reply",
          mentions: "mention",
          quotes: "quote",
          reposts: "repost",
          verified: "verified",
        };

        if (typeFilter !== "all") {
          const targetType = typeMap[typeFilter] || typeFilter;
          activities = activities.filter(
            (a: any) => a.attrs.type === targetType
          );
        }

        const result = activities.map((activity: any) => {
          const user = activity.user;
          return {
            id: activity.id,
            username: user?.attrs?.id ?? "unknown",
            avatar:
              user?.attrs?.profileImageUrl ??
              "https://avatars.githubusercontent.com/u/885857?v=4",
            timeAgo: activity.attrs.timeAgo,
            content: activity.attrs.content,
            type: activity.attrs.type,
            postId: activity.attrs.postId,
            otherCount: activity.attrs.otherCount,
            likes: activity.attrs.likes,
            reply: activity.attrs.reply,
          };
        });

        return new Response(200, {}, { activities: result });
      });

      this.post("/login", (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);

        if (username === "jiahnkim" && password === "1234") {
          return {
            accessToken: "access-token",
            refreshToken: "refresh-token",
            user: {
              id: "dominica",
              name: "김지안",
              description: "🐢 프로그래머, jongin's mother",
              profileImageUrl:
                "https://avatars.githubusercontent.com/u/885857?v=4",
            },
          };
        } else {
          return new Response(401, {}, { message: "Invalid credentials" });
        }
      });
    },
  });
}
