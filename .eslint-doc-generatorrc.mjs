import prettier from "prettier";

const config = {
  postprocess: async (content, path) => {
    return prettier.format(content, {
      ...(await prettier.resolveConfig(path)),
      parser: "markdown",
    });
  },
};

export default config;
