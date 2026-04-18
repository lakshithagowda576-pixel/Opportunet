import path from "path"
import { fileURLToPath } from "url"
import nextEnv from "@next/env"

const { loadEnvConfig } = nextEnv

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appDir = __dirname
const parentDir = path.resolve(appDir, "..")

const dev = process.env.NODE_ENV !== "production"
if (dev) {
  loadEnvConfig(parentDir, dev)
}
loadEnvConfig(appDir, dev)

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default nextConfig
