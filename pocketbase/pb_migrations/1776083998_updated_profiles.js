/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3414089001")

  // remove field
  collection.fields.removeById("text3723958568")

  // remove field
  collection.fields.removeById("text2654567225")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select3343321666",
    "maxSelect": 1,
    "name": "gender",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "male",
      "female",
      "prefer_not_to_say"
    ]
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select3723958568",
    "maxSelect": 1,
    "name": "fitness_level",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "beginner",
      "intermediate",
      "advanced"
    ]
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "json2654567225",
    "maxSize": 0,
    "name": "limitations",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4249574915",
    "max": 0,
    "min": 0,
    "name": "injuryHistory",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "bool244436895",
    "name": "onboardingComplete",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3414089001")

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3723958568",
    "max": 0,
    "min": 0,
    "name": "fitness_level",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2654567225",
    "max": 0,
    "min": 0,
    "name": "limitations",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("select3343321666")

  // remove field
  collection.fields.removeById("select3723958568")

  // remove field
  collection.fields.removeById("json2654567225")

  // remove field
  collection.fields.removeById("text4249574915")

  // remove field
  collection.fields.removeById("bool244436895")

  return app.save(collection)
})
