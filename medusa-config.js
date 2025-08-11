const { defineConfig, Modules } = require("@medusajs/utils")
const path = require("path")
const os = require("os")

// Simple development configuration without database requirement
module.exports = defineConfig({
  admin: {
    disable: false, // Enable admin for development
    develop: {
      open: process.env.OPEN_BROWSER !== "false",
    },
  },
  projectConfig: {
    http: {
      jwtSecret: process.env.JWT_SECRET || "development-jwt-secret-key",
      cookieSecret: process.env.COOKIE_SECRET || "development-cookie-secret-key",
    },
    databaseUrl: process.env.DATABASE_URL || "postgres://localhost:5432/medusa-dev",
    redisUrl: process.env.REDIS_URL,
  },
  modules: {
    [Modules.CACHE]: {
      resolve: "@medusajs/cache-inmemory",
    },
    [Modules.EVENT_BUS]: {
      resolve: "@medusajs/event-bus-local",
    },
    [Modules.WORKFLOW_ENGINE]: {
      resolve: "@medusajs/workflow-engine-inmemory",
    },
    [Modules.FILE]: {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              upload_dir: path.join(__dirname, "uploads"),
              private_upload_dir: path.join(__dirname, "private"),
            },
          },
        ],
      },
    },
    [Modules.NOTIFICATION]: {
      resolve: "@medusajs/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/notification-local",
            id: "local",
            options: {
              name: "Local Notification Provider",
              channels: ["feed"],
            },
          },
        ],
      },
    },
  },
})