/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2241337012")

  // remove field
  collection.fields.removeById("json2246671724")

  // remove field
  collection.fields.removeById("json129054881")

  // remove field
  collection.fields.removeById("json2565116048")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1602912115",
    "maxSelect": 1,
    "name": "source",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "template",
      "custom"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2241337012")

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "json2246671724",
    "maxSize": 0,
    "name": "therapyNotes",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "json129054881",
    "maxSize": 0,
    "name": "progressionRules",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "json2565116048",
    "maxSize": 0,
    "name": "aiPromptSnapshot",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1602912115",
    "maxSelect": 1,
    "name": "source",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "ai_generated",
      "template",
      "custom"
    ]
  }))

  return app.save(collection)
})
