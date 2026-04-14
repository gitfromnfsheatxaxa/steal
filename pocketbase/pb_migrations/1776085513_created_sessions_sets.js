/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "relation2375276105",
        "name": "session",
        "type": "relation",
        "required": true,
        "presentable": false,
        "cascadeDelete": true,
        "collectionId": "wrksess01",
        "maxSelect": 1,
        "minSelect": null
      },
      {
        "hidden": false,
        "id": "sesssets_exercise",
        "name": "exercise",
        "type": "relation",
        "required": false,
        "presentable": false,
        "cascadeDelete": false,
        "collectionId": "exercises01",
        "maxSelect": 1,
        "minSelect": null,
        "displayFields": ["name"]
      },
      {
        "hidden": false,
        "id": "sesssets_setNumber",
        "name": "setNumber",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 1,
        "max": 100
      },
      {
        "hidden": false,
        "id": "sesssets_reps",
        "name": "reps",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 0,
        "max": 10000
      },
      {
        "hidden": false,
        "id": "sesssets_weight",
        "name": "weight",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": false,
        "min": 0,
        "max": 10000
      },
      {
        "hidden": false,
        "id": "sesssets_rpe",
        "name": "rpe",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": false,
        "min": 1,
        "max": 10
      },
      {
        "hidden": false,
        "id": "sesssets_completed",
        "name": "completed",
        "type": "bool",
        "required": false,
        "presentable": false
      },
      {
        "hidden": false,
        "id": "sesssets_notes",
        "name": "notes",
        "type": "text",
        "required": false,
        "presentable": false,
        "min": null,
        "max": 500,
        "pattern": ""
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "sesssets01",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "session_sets",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("sesssets01");

  return app.delete(collection);
})
