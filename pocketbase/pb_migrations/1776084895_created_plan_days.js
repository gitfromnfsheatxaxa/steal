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
        "id": "plandays_plan",
        "name": "plan",
        "type": "relation",
        "required": true,
        "presentable": false,
        "cascadeDelete": true,
        "collectionId": "wrkplans01",
        "maxSelect": 1,
        "minSelect": null,
        "displayFields": ["title"]
      },
      {
        "hidden": false,
        "id": "plandays_week",
        "name": "week",
        "type": "number",
        "required": true,
        "presentable": false,
        "onlyInt": true,
        "min": 1,
        "max": 52
      },
      {
        "hidden": false,
        "id": "plandays_dayOfWeek",
        "name": "dayOfWeek",
        "type": "number",
        "required": true,
        "presentable": false,
        "onlyInt": true,
        "min": 1,
        "max": 7
      },
      {
        "hidden": false,
        "id": "plandays_label",
        "name": "label",
        "type": "text",
        "required": false,
        "presentable": true,
        "min": null,
        "max": 200,
        "pattern": ""
      },
      {
        "hidden": false,
        "id": "plandays_focus",
        "name": "focus",
        "type": "json",
        "required": false,
        "presentable": false,
        "maxSize": 2000000
      },
      {
        "hidden": false,
        "id": "plandays_warmup",
        "name": "warmup",
        "type": "json",
        "required": false,
        "presentable": false,
        "maxSize": 2000000
      },
      {
        "hidden": false,
        "id": "plandays_cooldown",
        "name": "cooldown",
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
    "id": "plandays01",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "plan_days",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("plandays01");

  return app.delete(collection);
})
