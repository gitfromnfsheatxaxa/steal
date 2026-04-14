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
        "id": "wrkplans_user",
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
        "id": "wrkplans_title",
        "name": "title",
        "type": "text",
        "required": true,
        "presentable": true,
        "min": 2,
        "max": 300,
        "pattern": ""
      },
      {
        "hidden": false,
        "id": "wrkplans_description",
        "name": "description",
        "type": "text",
        "required": false,
        "presentable": false,
        "min": null,
        "max": 2000,
        "pattern": ""
      },
      {
        "hidden": false,
        "id": "wrkplans_source",
        "name": "source",
        "type": "select",
        "required": false,
        "presentable": false,
        "maxSelect": 1,
        "values": [
          "ai_generated",
          "template",
          "custom"
        ]
      },
      {
        "hidden": false,
        "id": "wrkplans_goalType",
        "name": "goalType",
        "type": "select",
        "required": false,
        "presentable": false,
        "maxSelect": 1,
        "values": [
          "muscle_building",
          "strength",
          "fat_loss",
          "endurance",
          "rehabilitation",
          "general_fitness"
        ]
      },
      {
        "hidden": false,
        "id": "wrkplans_environment",
        "name": "environment",
        "type": "select",
        "required": false,
        "presentable": false,
        "maxSelect": 1,
        "values": [
          "gym",
          "home",
          "outdoor",
          "mixed"
        ]
      },
      {
        "hidden": false,
        "id": "wrkplans_durationWeeks",
        "name": "durationWeeks",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 1,
        "max": 52
      },
      {
        "hidden": false,
        "id": "wrkplans_currentWeek",
        "name": "currentWeek",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 1,
        "max": 52
      },
      {
        "hidden": false,
        "id": "wrkplans_status",
        "name": "status",
        "type": "select",
        "required": false,
        "presentable": false,
        "maxSelect": 1,
        "values": [
          "active",
          "completed",
          "paused",
          "archived"
        ]
      },
      {
        "hidden": false,
        "id": "wrkplans_therapyNotes",
        "name": "therapyNotes",
        "type": "json",
        "required": false,
        "presentable": false,
        "maxSize": 2000000
      },
      {
        "hidden": false,
        "id": "wrkplans_progressionRules",
        "name": "progressionRules",
        "type": "json",
        "required": false,
        "presentable": false,
        "maxSize": 2000000
      },
      {
        "hidden": false,
        "id": "wrkplans_aiPromptSnapshot",
        "name": "aiPromptSnapshot",
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
    "id": "wrkplans01",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "workout_plans",
    "system": false,
    "type": "base",
    "updateRule": "user = @request.auth.id",
    "viewRule": "@request.auth.id != \"\"",
    "deleteRule": "user = @request.auth.id"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("wrkplans01");

  return app.delete(collection);
})
