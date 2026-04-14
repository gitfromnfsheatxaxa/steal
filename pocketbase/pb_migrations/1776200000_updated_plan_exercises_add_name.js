/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("plan_exercises")

  // add name field for free-text exercise name (used in manual plans)
  const nameField = new Field({
    "id": "planexs_name",
    "name": "name",
    "type": "text",
    "required": false,
    "presentable": true,
    "unique": false,
    "options": { "min": null, "max": 200, "pattern": "" }
  })

  collection.fields.add(nameField)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("plan_exercises")

  const field = collection.fields.getByName("name")
  if (field) {
    collection.fields.remove(field)
  }

  return app.save(collection)
})
