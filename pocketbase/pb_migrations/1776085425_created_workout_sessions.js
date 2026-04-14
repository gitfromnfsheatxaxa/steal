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
        "id": "wrksess_user",
        "name": "user",
        "type": "relation",
        "required": true,
        "presentable": false,
        "cascadeDelete": true,
        "collectionId": "_pb_users_auth_",
        "maxSelect": 1,
        "minSelect": null,
        "displayFields": ["email"]
      },
      {
        "hidden": false,
        "id": "wrksess_planDay",
        "name": "planDay",
        "type": "relation",
        "required": false,
        "presentable": false,
        "cascadeDelete": false,
        "collectionId": "plandays01",
        "maxSelect": 1,
        "minSelect": null,
        "displayFields": ["label"]
      },
      {
        "hidden": false,
        "id": "wrksess_plan",
        "name": "plan",
        "type": "relation",
        "required": false,
        "presentable": false,
        "cascadeDelete": false,
        "collectionId": "wrkplans01",
        "maxSelect": 1,
        "minSelect": null,
        "displayFields": ["title"]
      },
      {
        "hidden": false,
        "id": "wrksess_startedAt",
        "name": "startedAt",
        "type": "date",
        "required": false,
        "presentable": false,
        "min": "",
        "max": ""
      },
      {
        "hidden": false,
        "id": "wrksess_completedAt",
        "name": "completedAt",
        "type": "date",
        "required": false,
        "presentable": false,
        "min": "",
        "max": ""
      },
      {
        "hidden": false,
        "id": "wrksess_status",
        "name": "status",
        "type": "select",
        "required": false,
        "presentable": false,
        "maxSelect": 1,
        "values": [
          "in_progress",
          "completed",
          "skipped"
        ]
      },
      {
        "hidden": false,
        "id": "wrksess_mood",
        "name": "mood",
        "type": "select",
        "required": false,
        "presentable": false,
        "maxSelect": 1,
        "values": [
          "great",
          "good",
          "okay",
          "rough",
          "terrible"
        ]
      },
      {
        "hidden": false,
        "id": "wrksess_energyLevel",
        "name": "energyLevel",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 1,
        "max": 5
      },
      {
        "hidden": false,
        "id": "wrksess_sessionNotes",
        "name": "sessionNotes",
        "type": "text",
        "required": false,
        "presentable": false,
        "min": null,
        "max": 2000,
        "pattern": ""
      },
      {
        "hidden": false,
        "id": "wrksess_therapyReflection",
        "name": "therapyReflection",
        "type": "text",
        "required": false,
        "presentable": false,
        "min": null,
        "max": 3000,
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
    "id": "wrksess01",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "workout_sessions",
    "system": false,
    "type": "base",
    "updateRule": "user = @request.auth.id",
    "viewRule": "@request.auth.id != \"\"",
    "deleteRule": "user = @request.auth.id"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("wrksess01");

  return app.delete(collection);
})
