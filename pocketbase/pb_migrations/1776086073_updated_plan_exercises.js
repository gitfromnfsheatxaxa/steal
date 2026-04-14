/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2559885587")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2585384460",
    "hidden": false,
    "id": "relation4264702100",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "planDay",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1804250889",
    "hidden": false,
    "id": "relation262228369",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "exercise",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2559885587")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2585384460",
    "hidden": false,
    "id": "relation4264702100",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "plan_days",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1804250889",
    "hidden": false,
    "id": "relation262228369",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "exercises",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
