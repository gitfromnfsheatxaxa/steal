/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("wrkplans01");

  // Add imageUrls field to store multiple images as JSON array
  const field = new Field({
    "hidden": false,
    "id": "plan_images",
    "name": "imageUrls",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json",
    "maxSize": 2000000,
  });

  collection.fields.add(field);

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("wrkplans01");
  collection.fields.removeById("plan_images");
  return app.save(collection);
})