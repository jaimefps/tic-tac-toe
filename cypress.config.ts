import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "ufz2rw",
  // e2e: {
  //   setupNodeEvents(on, config) {
  //     return {
  //       ...config,
  //       baseUrl: "http://localhost:3000/",
  //     };
  //   },
  // },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
