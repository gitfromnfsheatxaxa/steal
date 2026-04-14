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
        "id": "pltmpls_title",
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
        "id": "pltmpls_description",
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
        "id": "pltmpls_goalType",
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
        "id": "pltmpls_environment",
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
        "id": "pltmpls_difficulty",
        "name": "difficulty",
        "type": "select",
        "required": false,
        "presentable": false,
        "maxSelect": 1,
        "values": [
          "beginner",
          "intermediate",
          "advanced"
        ]
      },
      {
        "hidden": false,
        "id": "pltmpls_durationWeeks",
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
        "id": "pltmpls_structure",
        "name": "structure",
        "type": "json",
        "required": false,
        "presentable": false,
        "maxSize": 5000000
      },
      {
        "hidden": false,
        "id": "pltmpls_popularity",
        "name": "popularity",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 0,
        "max": 999999
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
    "id": "pltmpls01",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "plan_templates",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": "@request.auth.id != \"\"",
    "deleteRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pltmpls01");

  return app.delete(collection);
})
