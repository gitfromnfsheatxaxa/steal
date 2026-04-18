/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("exercisetranslations01");

  // Decouple from exercises01 relation by introducing a canonical external id
  // (the string exerciseId returned by the new exercisedb-api, e.g. "K6NnTv0").
  const existingFieldIds = new Set(collection.fields.map((f) => f.id));

  const additions = [
    {
      hidden: false,
      id: "exercise_translations_exerciseExtId",
      max: 64,
      min: 1,
      name: "exerciseExtId",
      pattern: "",
      presentable: true,
      required: false,
      type: "text",
    },
    {
      hidden: false,
      id: "exercise_translations_overview",
      max: 1500,
      min: null,
      name: "overview",
      pattern: "",
      presentable: false,
      required: false,
      type: "text",
    },
    {
      hidden: false,
      id: "exercise_translations_description",
      max: 1500,
      min: null,
      name: "description",
      pattern: "",
      presentable: false,
      required: false,
      type: "text",
    },
    {
      hidden: false,
      id: "exercise_translations_secondaryMuscles",
      max: 500,
      min: null,
      name: "secondaryMuscles",
      pattern: "",
      presentable: false,
      required: false,
      type: "text",
    },
    {
      hidden: false,
      id: "exercise_translations_exerciseTips",
      max: 3000,
      min: null,
      name: "exerciseTips",
      pattern: "",
      presentable: false,
      required: false,
      type: "text",
    },
    {
      hidden: false,
      id: "exercise_translations_variations",
      max: 2000,
      min: null,
      name: "variations",
      pattern: "",
      presentable: false,
      required: false,
      type: "text",
    },
  ];

  for (const field of additions) {
    if (!existingFieldIds.has(field.id)) {
      collection.fields.push(field);
    }
  }

  // The relation `exerciseId` is kept but no longer required — translations
  // can exist purely keyed on `exerciseExtId`.
  const relationField = collection.fields.find(
    (f) => f.id === "exercise_translations_exerciseId",
  );
  if (relationField) {
    relationField.required = false;
  }

  collection.indexes = [
    "CREATE UNIQUE INDEX idx_exercise_translations_extid ON exercise_translations (exerciseExtId, locale)",
    "CREATE INDEX idx_exercise_translations_locale ON exercise_translations (locale)",
  ];

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("exercisetranslations01");

  const removedIds = new Set([
    "exercise_translations_exerciseExtId",
    "exercise_translations_overview",
    "exercise_translations_description",
    "exercise_translations_secondaryMuscles",
    "exercise_translations_exerciseTips",
    "exercise_translations_variations",
  ]);
  collection.fields = collection.fields.filter((f) => !removedIds.has(f.id));

  const relationField = collection.fields.find(
    (f) => f.id === "exercise_translations_exerciseId",
  );
  if (relationField) {
    relationField.required = true;
  }

  collection.indexes = [
    "CREATE UNIQUE INDEX idx_exercise_translations_unique ON exercise_translations (exerciseId, locale)",
  ];

  return app.save(collection);
});
