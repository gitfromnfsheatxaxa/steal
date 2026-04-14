/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2341434656")

  // update collection data
  unmarshal({
    "name": "session_sets"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2341434656")

  // update collection data
  unmarshal({
    "name": "sessions_sets"
  }, collection)

  return app.save(collection)
})
