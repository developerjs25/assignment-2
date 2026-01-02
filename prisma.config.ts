import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  datasource: {
    url:"mysql://root:root@localhost:8889/assignment-2old",
  },
});
