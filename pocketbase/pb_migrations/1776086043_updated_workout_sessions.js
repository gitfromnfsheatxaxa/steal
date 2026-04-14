/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1551814176")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2585384460",
    "hidden": false,
    "id": "relation1396025563",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "planDay",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2241337012",
    "hidden": false,
    "id": "relation4264702100",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "plan",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1551814176")

  // remove field
  collection.fields.removeById("relation1396025563")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2241337012",
    "hidden": false,
    "id": "relation4264702100",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "workout_plans",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
