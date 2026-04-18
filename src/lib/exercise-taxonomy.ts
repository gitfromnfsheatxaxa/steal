import type { Language } from "@/lib/translations";

type TaxonomyGroup = Record<string, Record<Language, string>>;

/**
 * Static translations for the fixed taxonomy values the exercisedb-api
 * returns (bodyParts, equipments, targetMuscles). Missing keys fall back
 * to the raw English value.
 */

const bodyParts: TaxonomyGroup = {
  back: { en: "Back", ru: "Спина", uz: "Orqa" },
  cardio: { en: "Cardio", ru: "Кардио", uz: "Kardio" },
  chest: { en: "Chest", ru: "Грудь", uz: "Ko'krak" },
  "lower arms": { en: "Lower Arms", ru: "Предплечья", uz: "Bilak" },
  "lower legs": { en: "Lower Legs", ru: "Голени", uz: "Boldir" },
  neck: { en: "Neck", ru: "Шея", uz: "Bo'yin" },
  shoulders: { en: "Shoulders", ru: "Плечи", uz: "Yelkalar" },
  "upper arms": { en: "Upper Arms", ru: "Руки", uz: "Qo'l" },
  "upper legs": { en: "Upper Legs", ru: "Бёдра", uz: "Son" },
  waist: { en: "Waist", ru: "Талия", uz: "Bel" },
  "full body": { en: "Full Body", ru: "Всё тело", uz: "Butun tana" },
};

const equipments: TaxonomyGroup = {
  assisted: { en: "Assisted", ru: "С помощью", uz: "Yordamchi" },
  band: { en: "Band", ru: "Резина", uz: "Rezina" },
  barbell: { en: "Barbell", ru: "Штанга", uz: "Shtanga" },
  "body weight": { en: "Body Weight", ru: "Свой вес", uz: "Tana vazni" },
  "bosu ball": { en: "Bosu Ball", ru: "Босу-мяч", uz: "Bosu to'pi" },
  cable: { en: "Cable", ru: "Блок", uz: "Blok" },
  dumbbell: { en: "Dumbbell", ru: "Гантель", uz: "Gantel" },
  "elliptical machine": {
    en: "Elliptical",
    ru: "Эллиптический тренажёр",
    uz: "Elliptik trenajyor",
  },
  "ez barbell": { en: "EZ Barbell", ru: "EZ-штанга", uz: "EZ shtanga" },
  hammer: { en: "Hammer", ru: "Молот", uz: "Bolg'a" },
  kettlebell: { en: "Kettlebell", ru: "Гиря", uz: "Giryon" },
  "leverage machine": {
    en: "Leverage Machine",
    ru: "Рычажный тренажёр",
    uz: "Richag trenajyor",
  },
  "medicine ball": { en: "Medicine Ball", ru: "Медбол", uz: "Med to'pi" },
  "olympic barbell": {
    en: "Olympic Barbell",
    ru: "Олимпийская штанга",
    uz: "Olimpik shtanga",
  },
  "resistance band": {
    en: "Resistance Band",
    ru: "Эспандер",
    uz: "Rezina lenta",
  },
  roller: { en: "Roller", ru: "Валик", uz: "Rolik" },
  rope: { en: "Rope", ru: "Канат", uz: "Arqon" },
  "smith machine": {
    en: "Smith Machine",
    ru: "Машина Смита",
    uz: "Smit trenajyori",
  },
  "stability ball": { en: "Stability Ball", ru: "Фитбол", uz: "Fitbol" },
  "stationary bike": {
    en: "Stationary Bike",
    ru: "Велотренажёр",
    uz: "Velotrenajyor",
  },
  "trap bar": { en: "Trap Bar", ru: "Трэп-гриф", uz: "Trep grif" },
  "upper body ergometer": {
    en: "Upper Body Ergometer",
    ru: "Ручной эргометр",
    uz: "Qo'l ergometri",
  },
  weighted: { en: "Weighted", ru: "С отягощением", uz: "Og'irlik bilan" },
  "wheel roller": { en: "Wheel Roller", ru: "Ролик для пресса", uz: "G'ildirak" },
  "sled machine": { en: "Sled", ru: "Сани", uz: "Chana" },
  "stepmill machine": {
    en: "Stepmill",
    ru: "Степпер",
    uz: "Stepper",
  },
  "skierg machine": { en: "SkiErg", ru: "SkiErg", uz: "SkiErg" },
  tire: { en: "Tire", ru: "Покрышка", uz: "Shina" },
};

const muscles: TaxonomyGroup = {
  abductors: { en: "Abductors", ru: "Отводящие", uz: "Abduktorlar" },
  abs: { en: "Abs", ru: "Пресс", uz: "Press" },
  adductors: { en: "Adductors", ru: "Приводящие", uz: "Adduktorlar" },
  biceps: { en: "Biceps", ru: "Бицепс", uz: "Bitseps" },
  calves: { en: "Calves", ru: "Икры", uz: "Boldir" },
  "cardiovascular system": {
    en: "Cardio",
    ru: "Сердечно-сосудистая",
    uz: "Yurak-qon tomir",
  },
  delts: { en: "Delts", ru: "Дельты", uz: "Deltoid" },
  forearms: { en: "Forearms", ru: "Предплечья", uz: "Bilaklar" },
  glutes: { en: "Glutes", ru: "Ягодицы", uz: "Dumba" },
  hamstrings: { en: "Hamstrings", ru: "Бицепс бедра", uz: "Son bitsepsi" },
  lats: { en: "Lats", ru: "Широчайшие", uz: "Keng mushaklar" },
  "levator scapulae": {
    en: "Levator Scapulae",
    ru: "Леватор лопатки",
    uz: "Kurak leviatori",
  },
  pectorals: { en: "Pectorals", ru: "Грудные", uz: "Ko'krak mushaklari" },
  quads: { en: "Quads", ru: "Квадрицепс", uz: "Kvadritseps" },
  "serratus anterior": {
    en: "Serratus Anterior",
    ru: "Передняя зубчатая",
    uz: "Oldingi tishsimon",
  },
  spine: { en: "Spine", ru: "Позвоночник", uz: "Umurtqa" },
  traps: { en: "Traps", ru: "Трапеция", uz: "Trapetsiya" },
  triceps: { en: "Triceps", ru: "Трицепс", uz: "Tritseps" },
  "upper back": { en: "Upper Back", ru: "Верх спины", uz: "Yuqori orqa" },
  back: { en: "Back", ru: "Спина", uz: "Orqa" },
};

function lookup(group: TaxonomyGroup, key: string, lang: Language): string {
  if (!key) return "";
  const entry = group[key.toLowerCase()];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}

export function tBodyPart(key: string, lang: Language): string {
  return lookup(bodyParts, key, lang);
}

export function tEquipment(key: string, lang: Language): string {
  return lookup(equipments, key, lang);
}

export function tMuscle(key: string, lang: Language): string {
  return lookup(muscles, key, lang);
}
