/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1551814176")

  // remove field
  collection.fields.removeById("text14752260")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1551814176")

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text14752260",
    "max": 0,
    "min": 0,
    "name": "therapyReflection",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
