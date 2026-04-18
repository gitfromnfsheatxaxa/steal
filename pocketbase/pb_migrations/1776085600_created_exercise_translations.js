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
        "id": "exercise_translations_exerciseId",
        "maxSelect": 1,
        "collectionId": "exercises01",
        "name": "exerciseId",
        "required": true,
        "presentable": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "exercise_translations_locale",
        "maxSelect": 1,
        "name": "locale",
        "required": true,
        "presentable": false,
        "type": "select",
        "values": [
          "en",
          "ru",
          "uz"
        ]
      },
      {
        "hidden": false,
        "id": "exercise_translations_name",
        "max": 200,
        "min": 2,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "required": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "exercise_translations_bodyPart",
        "max": 100,
        "min": 1,
        "name": "bodyPart",
        "pattern": "",
        "presentable": false,
        "required": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "exercise_translations_equipment",
        "max": 100,
        "min": 1,
        "name": "equipment",
        "pattern": "",
        "presentable": false,
        "required": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "exercise_translations_muscleGroup",
        "max": 100,
        "min": 1,
        "name": "muscleGroup",
        "pattern": "",
        "presentable": false,
        "required": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "exercise_translations_target",
        "max": 100,
        "min": 1,
        "name": "target",
        "pattern": "",
        "presentable": false,
        "required": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "exercise_translations_instructions",
        "max": 5000,
        "min": null,
        "name": "instructions",
        "pattern": "",
        "presentable": false,
        "required": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "exercise_translations_category",
        "max": 50,
        "min": 1,
        "name": "category",
        "pattern": "",
        "presentable": false,
        "required": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "exercise_translations_difficulty",
        "max": 50,
        "min": 1,
        "name": "difficulty",
        "pattern": "",
        "presentable": false,
        "required": false,
        "type": "text"
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
    "id": "exercisetranslations01",
    "indexes": [
      "CREATE UNIQUE INDEX idx_exercise_translations_unique ON exercise_translations (exerciseId, locale)"
    ],
    "listRule": "@request.auth.id != \"\"",
    "name": "exercise_translations",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": "@request.auth.id != \"\""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("exercisetranslations01");

  return app.delete(collection);
})