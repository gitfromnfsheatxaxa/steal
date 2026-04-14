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
        "id": "exercises_name",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": true,
        "min": 2,
        "max": 200,
        "pattern": ""
      },
      {
        "hidden": false,
        "id": "exercises_slug",
        "name": "slug",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": true,
        "min": 2,
        "max": 200,
        "pattern": "^[a-z0-9-]+$"
      },
      {
        "hidden": false,
        "id": "exercises_muscleGroups",
        "name": "muscleGroups",
        "type": "json",
        "required": false,
        "presentable": false,
        "maxSize": 2000000
      },
      {
        "hidden": false,
        "id": "exercises_equipment",
        "name": "equipment",
        "type": "json",
        "required": false,
        "presentable": false,
        "maxSize": 2000000
      },
      {
        "hidden": false,
        "id": "exercises_category",
        "name": "category",
        "type": "select",
        "required": false,
        "presentable": false,
        "maxSelect": 1,
        "values": [
          "compound",
          "isolation",
          "cardio",
          "mobility",
          "warmup",
          "cooldown"
        ]
      },
      {
        "hidden": false,
        "id": "exercises_difficulty",
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
        "id": "exercises_instructions",
        "name": "instructions",
        "type": "text",
        "required": false,
        "presentable": false,
        "min": null,
        "max": 5000,
        "pattern": ""
      },
      {
        "hidden": false,
        "id": "exercises_videoUrl",
        "name": "videoUrl",
        "type": "url",
        "required": false,
        "presentable": false,
        "exceptDomains": null,
        "onlyDomains": null
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
    "id": "exercises01",
    "indexes": [
      "CREATE UNIQUE INDEX idx_exercises_slug ON exercises (slug)"
    ],
    "listRule": "@request.auth.id != \"\"",
    "name": "exercises",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": "@request.auth.id != \"\"",
    "deleteRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("exercises01");

  return app.delete(collection);
})
