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
        "id": "planexs_planDay",
        "name": "planDay",
        "type": "relation",
        "required": true,
        "presentable": false,
        "cascadeDelete": true,
        "collectionId": "plandays01",
        "maxSelect": 1,
        "minSelect": null,
        "displayFields": ["label"]
      },
      {
        "hidden": false,
        "id": "planexs_exercise",
        "name": "exercise",
        "type": "relation",
        "required": true,
        "presentable": false,
        "cascadeDelete": false,
        "collectionId": "exercises01",
        "maxSelect": 1,
        "minSelect": null,
        "displayFields": ["name"]
      },
      {
        "hidden": false,
        "id": "planexs_name",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": true,
        "min": null,
        "max": 200,
        "pattern": ""
      },
      {
        "hidden": false,
        "id": "planexs_order",
        "name": "order",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 1,
        "max": 100
      },
      {
        "hidden": false,
        "id": "planexs_sets",
        "name": "sets",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 1,
        "max": 20
      },
      {
        "hidden": false,
        "id": "planexs_repsMin",
        "name": "repsMin",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 1,
        "max": 100
      },
      {
        "hidden": false,
        "id": "planexs_repsMax",
        "name": "repsMax",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 1,
        "max": 100
      },
      {
        "hidden": false,
        "id": "planexs_rpeTarget",
        "name": "rpeTarget",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": false,
        "min": 1,
        "max": 10
      },
      {
        "hidden": false,
        "id": "planexs_restSeconds",
        "name": "restSeconds",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 15,
        "max": 600
      },
      {
        "hidden": false,
        "id": "planexs_notes",
        "name": "notes",
        "type": "text",
        "required": false,
        "presentable": false,
        "min": null,
        "max": 1000,
        "pattern": ""
      },
      {
        "hidden": false,
        "id": "planexs_substitutions",
        "name": "substitutions",
        "type": "json",
        "required": false,
        "presentable": false,
        "maxSize": 2000000
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
    "id": "planexs001",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "plan_exercises",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("planexs001");

  return app.delete(collection);
})
