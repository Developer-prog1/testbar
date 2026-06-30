import { spawnSync } from "node:child_process";

const env = { ...process.env, NODE_ENV: "production" };

const run = (command, args) => {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: true,
    env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run("npx", ["prisma", "generate"]);
run("npx", ["next", "build"]);
