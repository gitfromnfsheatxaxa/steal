/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4162712844")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select3144380399",
    "maxSelect": 1,
    "name": "difficulty",
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
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number1334145142",
    "max": null,
    "min": null,
    "name": "durationWeeks",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "json1862350826",
    "maxSize": 0,
    "name": "structure",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number3150426505",
    "max": null,
    "min": null,
    "name": "popularity",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4162712844")

  // remove field
  collection.fields.removeById("select3144380399")

  // remove field
  collection.fields.removeById("number1334145142")

  // remove field
  collection.fields.removeById("json1862350826")

  // remove field
  collection.fields.removeById("number3150426505")

  return app.save(collection)
})
