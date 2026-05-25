/** @type {import('orval').ConfigExternal} */
module.exports = {
  reactQuery: {
    input: "./openapi.yaml",
    output: {
      mode: "tags-split",
      target: "../api-client-react/generated/index.ts",
      client: "react-query",
      httpClient: "fetch",
      baseUrl: "/api",
      override: {
        mutator: {
          path: "../api-client-react/src/fetcher.ts",
          name: "apiFetch",
        },
        query: { useQuery: true, useMutation: true },
      },
    },
  },
  zod: {
    input: "./openapi.yaml",
    output: {
      mode: "tags-split",
      target: "../api-zod/generated/index.ts",
      client: "zod",
    },
  },
}
