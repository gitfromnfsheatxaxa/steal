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
        "id": "goals_user",
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
        "id": "goals_type",
        "name": "type",
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
        "id": "goals_environment",
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
        "id": "goals_equipment",
        "name": "equipment",
        "type": "json",
        "required": false,
        "presentable": false,
        "maxSize": 2000000
      },
      {
        "hidden": false,
        "id": "goals_daysPerWeek",
        "name": "daysPerWeek",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 1,
        "max": 7
      },
      {
        "hidden": false,
        "id": "goals_sessionMinutes",
        "name": "sessionMinutes",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 15,
        "max": 180
      },
      {
        "hidden": false,
        "id": "goals_priority",
        "name": "priority",
        "type": "select",
        "required": false,
        "presentable": false,
        "maxSelect": 1,
        "values": [
          "primary",
          "secondary"
        ]
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
    "id": "goals0001",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "goals",
    "system": false,
    "type": "base",
    "updateRule": "user = @request.auth.id",
    "viewRule": "@request.auth.id != \"\"",
    "deleteRule": "user = @request.auth.id"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("goals0001");

  return app.delete(collection);
})
