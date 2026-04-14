/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4162712844")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1176952354",
    "maxSelect": 1,
    "name": "environment",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "gym",
      "home",
      "outdoor",
      "mixed"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4162712844")

  // remove field
  collection.fields.removeById("select1176952354")

  return app.save(collection)
})
