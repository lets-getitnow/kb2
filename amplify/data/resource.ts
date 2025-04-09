import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  knowledgeBase: a
    .query()
    .arguments({ input: a.string() })
    .handler(
      a.handler.custom({
        dataSource: "KnowledgeBaseDataSource",
        entry: "./resolvers/kbResolver.js",
      }),
    )
    .returns(a.string())
    .authorization((allow) =>[ allow.authenticated(),allow.publicApiKey()]),

  chat: a.conversation({
    aiModel: a.ai.model("Claude 3.5 Haiku"),
    systemPrompt: `You are a helpful assistant.`,
    tools: [
      a.ai.dataTool({
        name: 'searchDocumentation',
        description: 'Performs a similarity search over the documentation for relevant information',
        query: a.ref('knowledgeBase'),
      }),
    ]
  }).authorization((allow) => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({ schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
 });
