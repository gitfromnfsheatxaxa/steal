/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("session_sets")

  // Make exercise relation optional — manual plan exercises don't have an exercises-collection record
  const field = collection.fields.getByName("exercise")
  if (field) {
    field.required = false
    collection.fields.add(field)
  }

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("session_sets")

  const field = collection.fields.getByName("exercise")
  if (field) {
    field.required = true
    collection.fields.add(field)
  }

  return app.save(collection)
})
