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
        "id": "profiles_user",
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
        "id": "profiles_age",
        "name": "age",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 13,
        "max": 120
      },
      {
        "hidden": false,
        "id": "profiles_height",
        "name": "height",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": true,
        "min": 50,
        "max": 300
      },
      {
        "hidden": false,
        "id": "profiles_weight",
        "name": "weight",
        "type": "number",
        "required": false,
        "presentable": false,
        "onlyInt": false,
        "min": 20,
        "max": 500
      },
      {
        "hidden": false,
        "id": "profiles_gender",
        "name": "gender",
        "type": "select",
        "required": false,
        "presentable": false,
        "maxSelect": 1,
        "values": [
          "male",
          "female",
          "other",
          "prefer_not_to_say"
        ]
      },
      {
        "hidden": false,
        "id": "profiles_fitnessLevel",
        "name": "fitnessLevel",
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
        "id": "profiles_limitations",
        "name": "limitations",
        "type": "json",
        "required": false,
        "presentable": false,
        "maxSize": 2000000
      },
      {
        "hidden": false,
        "id": "profiles_injuryHistory",
        "name": "injuryHistory",
        "type": "text",
        "required": false,
        "presentable": false,
        "min": null,
        "max": 2000,
        "pattern": ""
      },
      {
        "hidden": false,
        "id": "profiles_onboardingComplete",
        "name": "onboardingComplete",
        "type": "bool",
        "required": false,
        "presentable": false
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
    "id": "profiles001",
    "indexes": [
      "CREATE UNIQUE INDEX idx_profiles_user ON profiles (user)"
    ],
    "listRule": "@request.auth.id != \"\"",
    "name": "profiles",
    "system": false,
    "type": "base",
    "updateRule": "user = @request.auth.id",
    "viewRule": "@request.auth.id != \"\"",
    "deleteRule": "user = @request.auth.id"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("profiles001");

  return app.delete(collection);
})
