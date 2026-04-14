/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    id: "achievements",
    name: "achievements",
    type: "base",
    fields: [
      { name: "user", type: "relation", required: true, collectionId: "_pb_users_auth_", cascadeDelete: true },
      { name: "name", type: "text", required: true },
      { name: "type", type: "text", required: true },
      { name: "date_achieved", type: "date", required: true },
    ],
  });
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("achievements");
  return app.delete(collection);
});
