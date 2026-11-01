import {
  Settings,
  UserRound,
  Landmark,
  LayoutGrid,
  Percent,
  createIcons,
  ShieldCheck,
  Smartphone,
  ArrowUpRight,
  Utensils,
  ShoppingBasket,
  CarFront,
  HeartPulse,
  Clapperboard,
  Shirt,
  Plane,
  ShoppingBag,
  Clock3,
  X,
  BadgeCheck,
  Plus,
  LockKeyhole,
  ScanLine,
  WifiOff,
  Download,
  Upload,
  Share2,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Layers2,
  ArrowRight,
  Sparkles,
  ListChecks,
  HardDrive,
  Link,
  Trash2,
  Info,
  RefreshCw,
  Check,
  Copy,
} from "lucide";
const icons = {
  Settings,
  UserRound,
  Landmark,
  LayoutGrid,
  Percent,
  ShieldCheck,
  Smartphone,
  ArrowUpRight,
  Utensils,
  ShoppingBasket,
  CarFront,
  HeartPulse,
  Clapperboard,
  Shirt,
  Plane,
  ShoppingBag,
  Clock3,
  X,
  BadgeCheck,
  Plus,
  LockKeyhole,
  ScanLine,
  WifiOff,
  Download,
  Upload,
  Share2,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Layers2,
  ArrowRight,
  Sparkles,
  ListChecks,
  HardDrive,
  Link,
  Trash2,
  Info,
  RefreshCw,
  Check,
  Copy,
};
import {
  BANKS,
  parseScreenshot,
  makeBankId,
  validateData,
  restoreStoredData,
  mergeBanks,
  encodeShare,
  decodeShare,
} from "./domain.js";
import { BANK_LOGOS } from "./bank-logos.js";
import "./style.css";

const ru = navigator.language.toLowerCase().startsWith("ru");
const copy = {
  en: {
    local: "Only on your device",
    install: "Get the app",
    eyebrow: "A LITTLE MORE BACK, EVERY DAY",
    title: "Your cashbacks.\nAll together.",
    intro:
      "Less bank hopping. More getting back. Turn your bank screenshots into one beautifully simple overview.",
    upload: "Add a screenshot",
    uploadSub: "Drop it here or choose a photo",
    formats: "PNG, JPG, WebP · up to 20 MB",
    privacy: "Your screenshots never leave your device.",
    own: "My cashbacks",
    description: "A good overview. A better everyday.",
    byBank: "Group by bank",
    highest: "Highest cashback",
    az: "Category A–Z",
    export: "Export",
    import: "Import",
    share: "Share",
    banks: "banks",
    categories: "categories",
    highestLabel: "highest cashback",
    empty: "Your first cashback starts here",
    emptySub:
      "Take a screenshot of your cashback categories in your banking app. We’ll take care of the rest.",
    preview: "A LITTLE PREVIEW",
    sample: "Example only · your banks will appear here",
    sampleBank: "T-Bank",
    sampleFood: "Restaurants",
    sampleMarket: "Supermarkets",
    sampleTaxi: "Transport",
    step1: "Screenshot",
    step1Text: "Open cashback categories in your bank app.",
    step2: "Add & review",
    step2Text: "Recognize locally. Make a quick check.",
    step3: "Make the most of it",
    step3Text: "Pick the right bank for every purchase.",
    footer: "Your money. Your data. Your device.",
    how: "How it works",
    processing: "Finding your little rewards",
    processingSub:
      "Recognizing your screenshot on this device. You can keep browsing.",
    loading: "Preparing local recognition…",
    reading: "Reading bank and categories…",
    cancel: "Cancel",
    review: "A quick check, then you’re set",
    reviewSub:
      "OCR can miss details. Check the bank, names and rates before saving.",
    bank: "Bank",
    bankPlaceholder: "Choose or enter a bank",
    category: "Category",
    rate: "Cashback %",
    addCategory: "Add category",
    save: "Save cashbacks",
    replace: "This replaces the entire saved list for this bank.",
    noBank: "The bank name wasn’t visible. Choose the bank below.",
    noCategories:
      "No categories found. Add them manually or try a clearer screenshot.",
    saved: "Cashbacks saved on this device",
    deleted: "Category removed",
    delete: "Delete category",
    updated: "Updated",
    shared: "Shared with you",
    sharedSub:
      "A separate snapshot from a shared link. Your own cashbacks stay above.",
    dismiss: "Remove shared list",
    shareTitle: "Good things are better shared",
    shareText:
      "This link contains a snapshot of your categories. Anyone with it can read them. No screenshots or account details are included.",
    copyLink: "Copy link",
    copied: "Link copied",
    nativeShare: "Share…",
    linkTooLarge:
      "This collection is too large for a reliable link. Export JSON instead.",
    exportDone: "Backup downloaded",
    imported: "Backup imported; matching banks replaced",
    importTitle: "Import a backup?",
    importText:
      "Matching banks will be fully replaced by the imported lists. Other banks stay as they are.",
    confirmImport: "Import banks",
    badFile: "Couldn’t read this file. Choose a valid Banker JSON backup.",
    error: "Something went wrong. Please try again.",
    ocrError:
      "Recognition couldn’t finish. Check your connection for the first download, or add your categories manually.",
    manual: "Add manually",
    invalid:
      "Enter a bank and at least one category with a rate greater than 0 and no more than 100%.",
    imageError: "Choose a PNG, JPG, WebP or BMP image under 20 MB.",
    installTitle: "A little home for your cashbacks",
    installText:
      "On iPhone, open this site in Safari, tap Share, then Add to Home Screen. Keep “Open as Web App” enabled and tap Add.",
    installOther:
      "On Android or desktop, use your browser’s Install app or Add to Home Screen menu.",
    installNote:
      "Open Banker once online to download the app. Recognition becomes available offline after its first successful use. Export a backup before clearing browser data; Safari and the installed app may use separate storage.",
    gotIt: "Got it",
    storageError:
      "Your browser couldn’t save data. Free some space or enable site storage, then try again.",
    backupHint: "Local by design. Export a backup to keep your cashbacks safe.",
    raw: "Recognized text",
    offline: "You’re offline. Previously downloaded recognition works locally.",
    emptyShare: "Add your cashbacks first to share or export them.",
    unknown: "New category",
    confirmDelete: "Delete this category?",
    deleteText: "This removes it from this device only.",
    confirm: "Delete",
    clear: "Clear search",
    search: "Find a category or bank",
    noResults: "No matching categories",
    total: "Your everyday advantage",
    statsEmpty: "A fresh start",
    shareInvalid: "This shared link is invalid or incomplete.",
    progressDownload: "Downloading recognition files. First time only.",
    close: "Close",
    offlineReady: "App available offline",
    demoHint: "Illustrative cashback rates",
    replaceTitle: "Replace this bank’s cashbacks?",
    replaceText:
      "The entire previous list will be replaced with this screenshot’s reviewed categories.",
    confirmReplace: "Replace & save",
  },
  ru: {
    local: "Только на вашем устройстве",
    install: "Установить",
    eyebrow: "ЧУТЬ БОЛЬШЕ ВОЗВРАЩАЕТСЯ КАЖДЫЙ ДЕНЬ",
    title: "Ваши кешбэки.\nВсё в одном месте.",
    intro:
      "Меньше переключений между банками. Больше выгоды. Превратите скриншоты в простой и удобный список кешбэков.",
    upload: "Добавить скриншот",
    uploadSub: "Перетащите сюда или выберите фото",
    formats: "PNG, JPG, WebP · до 20 МБ",
    privacy: "Ваши скриншоты не покидают устройство.",
    own: "Мои кешбэки",
    description: "Всё перед глазами. Больше выгоды каждый день.",
    byBank: "По банкам",
    highest: "Сначала высокий кешбэк",
    az: "Категории А–Я",
    export: "Экспорт",
    import: "Импорт",
    share: "Поделиться",
    banks: "банков",
    categories: "категорий",
    highestLabel: "максимальный кешбэк",
    empty: "Первый кешбэк начинается здесь",
    emptySub:
      "Сделайте скриншот категорий кешбэка в приложении банка. Остальное мы возьмём на себя.",
    preview: "ВОТ КАК ЭТО ВЫГЛЯДИТ",
    sample: "Это пример · здесь появятся ваши банки",
    sampleBank: "Т-Банк",
    sampleFood: "Рестораны",
    sampleMarket: "Супермаркеты",
    sampleTaxi: "Транспорт",
    step1: "Сделайте скриншот",
    step1Text: "Откройте категории кешбэка в приложении банка.",
    step2: "Добавьте и проверьте",
    step2Text: "Распознаём на устройстве. Вы проверяете.",
    step3: "Получайте больше",
    step3Text: "Выбирайте подходящий банк для каждой покупки.",
    footer: "Ваши деньги. Ваши данные. Ваше устройство.",
    how: "Как это работает",
    processing: "Находим вашу выгоду",
    processingSub:
      "Распознаём скриншот на этом устройстве. Можно продолжать просмотр.",
    loading: "Готовим распознавание…",
    reading: "Читаем банк и категории…",
    cancel: "Отмена",
    review: "Проверим — и всё готово",
    reviewSub:
      "Распознавание может ошибаться. Проверьте банк, названия и проценты перед сохранением.",
    bank: "Банк",
    bankPlaceholder: "Выберите или введите банк",
    category: "Категория",
    rate: "Кешбэк %",
    addCategory: "Добавить категорию",
    save: "Сохранить кешбэки",
    replace: "Полностью заменит сохранённые категории этого банка.",
    noBank: "Название банка не найдено. Выберите банк ниже.",
    noCategories:
      "Категории не найдены. Добавьте вручную или попробуйте более чёткий скриншот.",
    saved: "Кешбэки сохранены на устройстве",
    deleted: "Категория удалена",
    delete: "Удалить категорию",
    updated: "Обновлено",
    shared: "С вами поделились",
    sharedSub: "Отдельный список по ссылке. Ваши кешбэки остаются выше.",
    dismiss: "Убрать общий список",
    shareTitle: "Выгодой приятно делиться",
    shareText:
      "Ссылка содержит снимок ваших категорий. Любой, у кого она есть, сможет их прочитать. Без скриншотов и данных аккаунта.",
    copyLink: "Скопировать ссылку",
    copied: "Ссылка скопирована",
    nativeShare: "Поделиться…",
    linkTooLarge:
      "Список слишком большой для надёжной ссылки. Используйте экспорт JSON.",
    exportDone: "Резервная копия скачана",
    imported: "Данные импортированы; списки совпавших банков заменены",
    importTitle: "Импортировать копию?",
    importText:
      "Категории совпавших банков будут полностью заменены. Остальные банки останутся.",
    confirmImport: "Импортировать",
    badFile:
      "Не удалось прочитать файл. Выберите корректную JSON-копию Banker.",
    error: "Что-то пошло не так. Попробуйте ещё раз.",
    ocrError:
      "Не удалось завершить распознавание. Для первой загрузки нужен интернет. Можно добавить категории вручную.",
    manual: "Добавить вручную",
    invalid:
      "Укажите банк и хотя бы одну категорию с кешбэком больше 0 и не больше 100%.",
    imageError: "Выберите PNG, JPG, WebP или BMP размером до 20 МБ.",
    installTitle: "Кешбэки на главном экране",
    installText:
      "На iPhone откройте сайт в Safari, нажмите «Поделиться» → «На экран Домой». Оставьте «Открывать как веб-приложение» включённым и нажмите «Добавить».",
    installOther:
      "На Android и компьютере используйте «Установить приложение» или «Добавить на главный экран» в меню браузера.",
    installNote:
      "Откройте Banker с интернетом для загрузки приложения. Распознавание работает офлайн после первого успешного использования. Экспортируйте копию перед очисткой данных браузера: у Safari и установленного приложения хранилища могут различаться.",
    gotIt: "Понятно",
    storageError:
      "Браузер не смог сохранить данные. Освободите место или разрешите хранение данных сайта.",
    backupHint:
      "Всё хранится локально. Экспортируйте копию, чтобы не потерять кешбэки.",
    raw: "Распознанный текст",
    offline:
      "Вы офлайн. Ранее загруженное распознавание работает на устройстве.",
    emptyShare: "Сначала добавьте свои кешбэки.",
    unknown: "Новая категория",
    confirmDelete: "Удалить категорию?",
    deleteText: "Категория будет удалена только на этом устройстве.",
    confirm: "Удалить",
    clear: "Очистить поиск",
    search: "Найти категорию или банк",
    noResults: "Ничего не найдено",
    total: "Ваша ежедневная выгода",
    statsEmpty: "Начнём с чистого листа",
    shareInvalid: "Ссылка повреждена или содержит некорректные данные.",
    progressDownload: "Загружаем файлы распознавания. Только в первый раз.",
    close: "Закрыть",
    offlineReady: "Приложение доступно офлайн",
    demoHint: "Примерные значения кешбэка",
    replaceTitle: "Заменить кешбэки этого банка?",
    replaceText:
      "Предыдущий список будет полностью заменён проверенными категориями этого скриншота.",
    confirmReplace: "Заменить и сохранить",
  },
};
Object.assign(copy.en, {
  settings: "Settings",
  settingsTitle: "Make yourself at home.",
  settingsIntro: "A little personal. Completely private.",
  nameLabel: "Your name",
  optional: "Optional",
  namePlaceholder: "What should we call you?",
  namePrivacy:
    "Your name stays on this device. It is never included in exports or shared links.",
  saveSettings: "Save changes",
  settingsSaved: "Settings saved",
  greeting: "Hi",
  nameError: "Please use a name of up to 60 characters.",
  bankStat: "Banks",
  categoryStat: "Categories",
  rateStat: "Best cashback",
  title: "Every bank.\nOne clear view.",
  eyebrow: "YOUR EVERYDAY, A LITTLE MORE REWARDING",
  total: "Made for your everyday",
  dashboardTitle: "A little more back.",
  dashboardIntro: "All your rewards, right where you need them.",
  privacyShort: "Private by design",
  search: "Search banks and categories",
  intro:
    "Your cashback categories, beautifully together. Just add a screenshot. Everything stays on your device.",
});
Object.assign(copy.ru, {
  settings: "Настройки",
  settingsTitle: "Сделайте Banker своим.",
  settingsIntro: "Чуть личнее. Так же приватно.",
  nameLabel: "Ваше имя",
  optional: "Необязательно",
  namePlaceholder: "Как к вам обращаться?",
  namePrivacy:
    "Имя хранится только на этом устройстве и не попадает в экспорт или ссылки для друзей.",
  saveSettings: "Сохранить изменения",
  settingsSaved: "Настройки сохранены",
  greeting: "Привет",
  nameError: "Введите имя длиной до 60 символов.",
  bankStat: "Банки",
  categoryStat: "Категории",
  rateStat: "Лучший кешбэк",
  title: "Все кешбэки.\nОдним взглядом.",
  eyebrow: "ЧУТЬ БОЛЬШЕ ВЫГОДЫ КАЖДЫЙ ДЕНЬ",
  total: "Для ваших повседневных планов",
  dashboardTitle: "Больше возвращается.",
  dashboardIntro: "Вся ваша выгода — под рукой.",
  privacyShort: "Приватно по умолчанию",
  search: "Найти банк или категорию",
  intro:
    "Категории кешбэка из всех банков — в одном месте. Просто добавьте скриншот. Всё останется на вашем устройстве.",
});
const t = copy[ru ? "ru" : "en"];
let displayName = "";
try {
  const preferences = JSON.parse(
    localStorage.getItem("banker.preferences.v1") || "{}",
  );
  if (typeof preferences.name === "string" && preferences.name.length <= 60)
    displayName = preferences.name.trim().replace(/\s+/gu, " ");
} catch {
  /* Preferences are optional; bank data uses separate storage. */
}

const noun = (count, kind) => {
  if (!ru)
    return kind === "banks"
      ? count === 1
        ? "bank"
        : "banks"
      : count === 1
        ? "category"
        : "categories";
  const forms =
    kind === "banks"
      ? ["банк", "банка", "банков"]
      : ["категория", "категории", "категорий"];
  const last = count % 10,
    lastTwo = count % 100;
  return forms[
    last === 1 && lastTwo !== 11
      ? 0
      : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)
        ? 1
        : 2
  ];
};
document.documentElement.lang = ru ? "ru" : "en";
document.title = ru
  ? "Banker — все кешбэки вместе"
  : "Banker — cashback, together";
const $ = (s) => document.querySelector(s);
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const icon = (name, cls = "") =>
  `<i data-lucide="${name}" class="${cls}" aria-hidden="true"></i>`;
const refreshIcons = () =>
  createIcons({ icons, attrs: { "stroke-width": 1.7 } });
const uid = () => crypto.randomUUID();
let banks = [],
  shared = [],
  view = "bank",
  query = "",
  busy = false,
  worker = null,
  job = 0,
  saveUnavailable = false,
  offlineReady = false;
try {
  const saved = localStorage.getItem("banker.v1");
  if (saved) banks = restoreStoredData(JSON.parse(saved)).banks;
} catch {
  saveUnavailable = true;
}
try {
  if (location.hash.startsWith("#share=")) shared = decodeShare(location.hash);
} catch {
  queueMicrotask(() => toast(t.shareInvalid));
}
function persist(next) {
  try {
    localStorage.setItem(
      "banker.v1",
      JSON.stringify({ version: 1, banks: next }),
    );
    banks = next;
    return true;
  } catch {
    toast(t.storageError);
    return false;
  }
}
let toastTimer;
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 5000);
}
function dialog(content) {
  const modal = $("#modal");
  modal.innerHTML = `<button class="modal-close icon-button" data-close aria-label="${t.close}">${icon("x")}</button>${content}`;
  if (!modal.open) modal.showModal();
  modal.querySelector("[data-close]").onclick = () => modal.close();
  refreshIcons();
}
function bankMeta(bank) {
  return (
    BANKS.find((b) => b.id === bank.id) || {
      color: "#747480",
      mark: bank.name.slice(0, 1),
    }
  );
}
function badge(bank, mini = false) {
  const meta = bankMeta(bank);
  const logo = BANK_LOGOS[bank.id];
  return `<span class="bank-logo ${mini ? "mini-bank" : ""} ${logo ? "official-logo" : "letter-logo"}" style="--bank:${esc(meta.color)}" role="img" aria-label="${esc(bank.name)}">${logo ? `<img src="${import.meta.env.BASE_URL}${logo}" alt="" decoding="async">` : esc(meta.mark || bank.name.slice(0, 1))}</span>`;
}
function categoryIcon(name) {
  if (/ресторан|кафе|restaurant|coffee/i.test(name)) return "utensils";
  if (/супер|продукт|market/i.test(name)) return "shopping-basket";
  if (/такси|транспорт|taxi|transport/i.test(name)) return "car-front";
  if (/аптек|здоров|pharma/i.test(name)) return "heart-pulse";
  if (/кино|развлеч|cinema/i.test(name)) return "clapperboard";
  if (/одеж|cloth/i.test(name)) return "shirt";
  if (/путеше|travel/i.test(name)) return "plane";
  return "shopping-bag";
}
function categoryRow(category, bank, isShared = false) {
  return `<div class="category-row"><span class="category-icon" data-type="${categoryIcon(category.name)}">${icon(categoryIcon(category.name))}</span><div class="category-info"><span>${esc(category.name)}</span>${view !== "bank" ? `<small class="category-bank">${badge(bank, true)}<span>${esc(bank.name)}</span></small>` : ""}</div><strong class="rate">${category.rate}<span>%</span></strong><button class="row-delete icon-button" data-delete="${esc(category.id)}" data-bank="${esc(bank.id)}" data-shared="${isShared}" aria-label="${t.delete}: ${esc(category.name)}">${icon("x")}</button></div>`;
}
function collection(items, isShared = false) {
  const filtered = items
    .map((b) => ({
      ...b,
      categories: b.categories.filter((c) =>
        `${b.name} ${c.name}`
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()),
      ),
    }))
    .filter((b) => b.categories.length);
  if (!filtered.length) return `<div class="no-results">${t.noResults}</div>`;
  if (view !== "bank") {
    let rows = filtered.flatMap((b) => b.categories.map((c) => ({ c, b })));
    rows.sort((a, b) =>
      view === "rate"
        ? b.c.rate - a.c.rate
        : a.c.name.localeCompare(b.c.name, ru ? "ru" : "en"),
    );
    return `<div class="bank-card glass ungrouped">${rows.map(({ c, b }) => categoryRow(c, b, isShared)).join("")}</div>`;
  }
  return filtered
    .map(
      (bank) =>
        `<article class="bank-card glass"><header class="bank-card-header">${badge(bank)}<div><h3>${esc(bank.name)}</h3><small>${bank.categories.length} ${noun(bank.categories.length, "categories")}</small></div><span class="bank-dots">${icon("badge-check")}</span></header><div>${bank.categories.map((c) => categoryRow(c, bank, isShared)).join("")}</div><footer>${icon("clock-3")} ${t.updated} ${new Date(bank.updatedAt).toLocaleDateString(ru ? "ru-RU" : "en-GB", { day: "numeric", month: "short" })}</footer></article>`,
    )
    .join("");
}
function render() {
  const count = banks.reduce((sum, bank) => sum + bank.categories.length, 0);
  const max = Math.max(
    0,
    ...banks.flatMap((bank) =>
      bank.categories.map((category) => category.rate),
    ),
  );
  const hasData = banks.length > 0;
  const title = displayName
    ? `${t.greeting}, ${esc(displayName)}<span class="greeting-dot">.</span>`
    : hasData
      ? t.dashboardTitle
      : t.title.replace("\n", "<br> ");
  const sampleBanks = ["tbank", "sber", "alfa", "vtb"].map((id) =>
    BANKS.find((bank) => bank.id === id),
  );
  $("#app").innerHTML = `
 <div class="ambient ambient-one"></div><div class="ambient ambient-two"></div>
 <div class="shell ${hasData ? "has-data" : ""}">
  <nav class="topbar" aria-label="Banker">
   <a href="./" class="wordmark" aria-label="Banker"><span class="brand-icon">b<span>✦</span></span>banker<span class="brand-period">.</span></a>
   <div class="nav-right">
    <span class="local-pill">${icon("shield-check")}<span>${t.local}</span></span>
    <button class="glass-button install-button" data-install>${icon("smartphone")}<span>${t.install}</span></button>
    <button class="settings-button glass-button" data-settings aria-label="${t.settings}" title="${t.settings}">${icon("settings")}</button>
   </div>
  </nav>
  <main>
   <section class="hero">
    <div class="hero-copy">
     <div class="eyebrow">${icon("sparkles")}<span>${hasData ? t.total : t.eyebrow}</span></div>
     <h1>${title}</h1>
     <p>${hasData ? t.dashboardIntro : t.intro}</p>
     <div class="hero-signature">${sampleBanks.map((bank) => badge(bank, true)).join("")}<span>${ru ? "Ваши банки. Один взгляд." : "All your banks. One glance."}</span></div>
    </div>
    <div class="upload-card glass" id="dropzone">
     <div class="upload-art"><div class="art-card art-back"></div><div class="art-card art-front">${icon("scan-line")}<span>5<span>%</span></span><div class="art-line"></div><div class="art-line short"></div></div><span class="art-plus">${icon("plus")}</span><span class="art-spark">✦</span></div>
     <button class="primary upload-button" data-upload>${icon("plus")}${t.upload}</button>
     <span class="upload-sub">${t.uploadSub}</span><span class="formats">${t.formats}</span>
     <div class="upload-privacy">${icon("lock-keyhole")}${t.privacy}</div>
    </div>
   </section>
   <div id="offline" ${navigator.onLine ? "hidden" : ""} class="notice">${icon("wifi-off")}${t.offline}</div>
   ${
     hasData
       ? `<section class="summary-grid" aria-label="${t.description}">
    <div class="summary-card glass"><span class="summary-icon blue">${icon("landmark")}</span><strong>${banks.length}</strong><span>${t.bankStat}</span></div>
    <div class="summary-card glass"><span class="summary-icon orange">${icon("layout-grid")}</span><strong>${count}</strong><span>${t.categoryStat}</span></div>
    <div class="summary-card glass"><span class="summary-icon mint">${icon("percent")}</span><strong>${max}<small>%</small></strong><span>${t.rateStat}</span></div>
   </section>`
       : ""
   }
   <section class="cabinet">
    <div class="section-top"><div><div class="section-kicker">${t.privacyShort}</div><h2>${t.own}<span class="count-pill">${count}</span></h2></div>
     <div class="actions"><button class="glass-button" data-import aria-label="${t.import}" title="${t.import}">${icon("download")}<span>${t.import}</span></button><button class="glass-button" data-export aria-label="${t.export}" title="${t.export}">${icon("upload")}<span>${t.export}</span></button><button class="glass-button" data-share aria-label="${t.share}" title="${t.share}">${icon("share-2")}<span>${t.share}</span></button></div>
    </div>
    <div id="processing" class="processing glass" ${busy ? "" : "hidden"}><div class="spinner"></div><div><strong>${t.processing}</strong><p id="progress-text">${t.loading}</p><progress id="progress" max="100" value="0"></progress></div><button class="text-button" id="cancel-ocr">${t.cancel}</button></div>
    ${
      hasData
        ? `<div class="toolbar"><label class="search-box">${icon("search")}<input type="search" id="search" value="${esc(query)}" aria-label="${t.search}" placeholder="${t.search}"></label><label class="select-wrap">${icon("sliders-horizontal")}<select id="view" aria-label="${ru ? "Сортировка" : "Sort categories"}"><option value="bank" ${view === "bank" ? "selected" : ""}>${t.byBank}</option><option value="rate" ${view === "rate" ? "selected" : ""}>${t.highest}</option><option value="az" ${view === "az" ? "selected" : ""}>${t.az}</option></select>${icon("chevron-down")}</label></div><div class="bank-grid" id="own-list">${collection(banks)}</div><p class="backup-hint">${icon("hard-drive")}${t.backupHint}</p>`
        : `
    <div class="empty-layout"><div class="empty-message"><span class="empty-icon">${icon("layers-2")}</span><h3>${t.empty}</h3><p>${t.emptySub}</p><button class="text-button" data-manual>${t.manual}${icon("arrow-right")}</button></div>
     <div class="preview-card"><span class="preview-label">${t.preview}</span><div class="sample-header">${badge(sampleBanks[0], true)}<b>${t.sampleBank}</b><span>${icon("sparkles")}</span></div>
      ${[
        [t.sampleFood, 5, "utensils"],
        [t.sampleMarket, 3, "shopping-basket"],
        [t.sampleTaxi, 7, "car-front"],
      ]
        .map(
          ([name, rate, type]) =>
            `<div class="sample-row"><span class="category-icon" data-type="${type}">${icon(type)}</span><span>${name}</span><b>${rate}<small>%</small></b></div>`,
        )
        .join("")}
      <p>${t.sample}</p>
     </div>
    </div>`
    }
   </section>
   ${shared.length ? `<section class="shared-section"><div class="section-top"><div><div class="section-kicker">${icon("link")} ${ru ? "ПО ССЫЛКЕ" : "FROM A FRIEND"}</div><h2>${t.shared}</h2><p>${t.sharedSub}</p></div><button class="glass-button" id="dismiss-shared">${icon("x")}${t.dismiss}</button></div><div class="bank-grid">${collection(shared, true)}</div></section>` : ""}
   <section class="how-section"><div class="how-title"><span>${t.how}</span><span>01 — 03</span></div><div class="steps">${[
     ["scan-line", "step1", "step1Text"],
     ["list-checks", "step2", "step2Text"],
     ["sparkles", "step3", "step3Text"],
   ]
     .map(
       ([type, title, body], index) =>
         `<div class="step"><span class="step-icon">${icon(type)}</span><div><small>0${index + 1}</small><h3>${t[title]}</h3><p>${t[body]}</p></div></div>`,
     )
     .join("")}</div></section>
  </main>
  <footer class="page-footer"><span class="footer-brand">banker.</span><p>${icon("lock-keyhole")}${t.footer}</p><button class="text-button" data-install>${t.install}${icon("arrow-up-right")}</button></footer>
 </div>
 <button class="floating-add primary" data-upload aria-label="${t.upload}">${icon("plus")}<span>${t.upload}</span></button>`;
  refreshIcons();
  document.querySelectorAll("[data-upload]").forEach(
    (element) =>
      (element.onclick = () => {
        if (!busy) $("#screenshot").click();
        else toast(t.processing);
      }),
  );
  document
    .querySelectorAll("[data-install]")
    .forEach((element) => (element.onclick = showInstall));
  document
    .querySelectorAll("[data-settings]")
    .forEach((element) => (element.onclick = showSettings));
  document
    .querySelectorAll("[data-manual]")
    .forEach(
      (element) =>
        (element.onclick = () =>
          showReview({ bank: null, categories: [] }, "")),
    );
  $("[data-export]").onclick = exportData;
  $("[data-import]").onclick = () => $("#import-file").click();
  $("[data-share]").onclick = shareData;
  $("#cancel-ocr").onclick = cancelOCR;
  if ($("#view"))
    $("#view").onchange = (event) => {
      view = event.target.value;
      render();
    };
  if ($("#search"))
    $("#search").oninput = (event) => {
      query = event.target.value;
      $("#own-list").innerHTML = collection(banks);
      if (shared.length)
        $(".shared-section .bank-grid").innerHTML = collection(shared, true);
      refreshIcons();
      bindDeletes();
    };
  if ($("#dismiss-shared"))
    $("#dismiss-shared").onclick = () => {
      shared = [];
      history.replaceState(null, "", location.pathname + location.search);
      render();
    };
  const zone = $("#dropzone");
  zone.ondragover = (event) => {
    event.preventDefault();
    zone.classList.add("dragover");
  };
  zone.ondragleave = () => zone.classList.remove("dragover");
  zone.ondrop = (event) => {
    event.preventDefault();
    zone.classList.remove("dragover");
    if (event.dataTransfer.files[0]) processImage(event.dataTransfer.files[0]);
  };
  bindDeletes();
}
function showSettings() {
  dialog(
    `<div class="profile-avatar">${displayName ? esc(Array.from(displayName)[0].toLocaleUpperCase()) : icon("user-round")}</div><span class="section-kicker">${t.settings}</span><h2>${t.settingsTitle}</h2><p>${t.settingsIntro}</p><form id="settings-form"><label class="field" for="display-name"><span>${t.nameLabel}<small>${t.optional}</small></span><input id="display-name" type="text" name="name" autocomplete="given-name" maxlength="60" placeholder="${t.namePlaceholder}" value="${esc(displayName)}"></label><p class="settings-privacy">${icon("lock-keyhole")}<span>${t.namePrivacy}</span></p><p class="form-error" id="settings-error" role="alert"></p><button type="submit" class="primary wide">${icon("check")}${t.saveSettings}</button></form>`,
  );
  $("#settings-form").onsubmit = (event) => {
    event.preventDefault();
    const name = $("#display-name").value.trim().replace(/\s+/gu, " ");
    if (name.length > 60) {
      $("#settings-error").textContent = t.nameError;
      return;
    }
    try {
      localStorage.setItem("banker.preferences.v1", JSON.stringify({ name }));
    } catch {
      $("#settings-error").textContent = t.storageError;
      return;
    }
    displayName = name;
    $("#modal").close();
    render();
    toast(t.settingsSaved);
  };
}
function bindDeletes() {
  document.querySelectorAll("[data-delete]").forEach(
    (button) =>
      (button.onclick = () => {
        const isShared = button.dataset.shared === "true";
        dialog(
          `<div class="modal-symbol">${icon("trash-2")}</div><h2>${t.confirmDelete}</h2><p>${t.deleteText}</p><div class="modal-actions"><button class="glass-button" id="keep">${t.cancel}</button><button class="primary danger" id="remove">${t.confirm}</button></div>`,
        );
        $("#keep").onclick = () => $("#modal").close();
        $("#remove").onclick = () => {
          const remove = (items) =>
            items
              .map((b) =>
                b.id === button.dataset.bank
                  ? {
                      ...b,
                      categories: b.categories.filter(
                        (c) => c.id !== button.dataset.delete,
                      ),
                    }
                  : b,
              )
              .filter((b) => b.categories.length);
          if (isShared) {
            shared = remove(shared);
            history.replaceState(
              null,
              "",
              location.pathname +
                location.search +
                (shared.length ? `#share=${encodeShare(shared)}` : ""),
            );
          } else if (!persist(remove(banks))) return;
          $("#modal").close();
          render();
          toast(t.deleted);
        };
      }),
  );
}
function showInstall() {
  dialog(
    `<div class="modal-symbol">${icon("smartphone")}</div><span class="section-kicker">BANKER · PWA</span><h2>${t.installTitle}</h2><p>${t.installText}</p><p>${t.installOther}</p><p id="offline-status" role="status">${offlineReady ? t.offlineReady : t.progressDownload}</p><div class="notice">${icon("info")}<span>${t.installNote}</span></div><button class="primary wide" id="got-it">${t.gotIt}</button>`,
  );
  $("#got-it").onclick = () => $("#modal").close();
}
function showReview(result, raw) {
  let categories = result.categories.map((c) => ({ ...c }));
  if (!categories.length) categories = [{ id: uid(), name: "", rate: "" }];
  dialog(
    `<span class="section-kicker">${ru ? "ПЕРЕД СОХРАНЕНИЕМ" : "BEFORE YOU SAVE"}</span><h2>${t.review}</h2><p>${t.reviewSub}</p><form id="review-form"><label class="field">${t.bank}<input id="bank-name" list="banks-list" maxlength="80" required placeholder="${t.bankPlaceholder}" value="${esc(result.bank?.name || "")}"><datalist id="banks-list">${BANKS.map((b) => `<option value="${esc(b.name)}"></option>`).join("")}</datalist></label>${!result.bank ? `<p class="field-hint">${t.noBank}</p>` : ""}${!result.categories.length ? `<p class="field-hint">${t.noCategories}</p>` : ""}<div class="review-labels"><span>${t.category}</span><span>${t.rate}</span></div><div id="review-rows"></div><button type="button" class="text-button" id="add-category">${icon("plus")}${t.addCategory}</button><p class="replace-note">${icon("refresh-cw")}${t.replace}</p>${raw ? `<details><summary>${t.raw}</summary><pre>${esc(raw)}</pre></details>` : ""}<p id="review-error" class="form-error" role="alert"></p><button type="submit" class="primary wide">${icon("check")}${t.save}</button></form>`,
  );
  function draw() {
    const rows = $("#review-rows");
    rows.innerHTML = categories
      .map(
        (c, i) =>
          `<div class="review-row"><input aria-label="${t.category} ${i + 1}" class="review-name" maxlength="100" required value="${esc(c.name)}"><input aria-label="${t.rate} ${i + 1}" class="review-rate" type="number" step="0.01" min="0.01" max="100" required value="${esc(c.rate)}"><button type="button" class="icon-button" data-remove-row="${i}" aria-label="${t.delete}">${icon("x")}</button></div>`,
      )
      .join("");
    rows.querySelectorAll(".review-row").forEach((row, i) => {
      row.querySelector(".review-name").oninput = (e) =>
        (categories[i].name = e.target.value);
      row.querySelector(".review-rate").oninput = (e) =>
        (categories[i].rate = e.target.value);
      row.querySelector("[data-remove-row]").onclick = () => {
        categories.splice(i, 1);
        draw();
      };
    });
    refreshIcons();
  }
  draw();
  $("#add-category").onclick = () => {
    if (categories.length >= 100) return;
    categories.push({ id: uid(), name: "", rate: "" });
    draw();
    $("#review-rows .review-row:last-child input").focus();
  };
  $("#review-form").onsubmit = (e) => {
    e.preventDefault();
    let incoming;
    try {
      if (!categories.length) throw Error();
      const name = $("#bank-name").value.trim();
      incoming = validateData({
        version: 1,
        banks: [
          {
            id: makeBankId(name),
            name,
            categories: categories.map((c) => ({ ...c, rate: Number(c.rate) })),
            updatedAt: new Date().toISOString(),
          },
        ],
      }).banks;
    } catch {
      $("#review-error").textContent = t.invalid;
      return;
    }
    const save = () => {
      try {
        if (persist(mergeBanks(banks, incoming))) {
          $("#modal").close();
          render();
          toast(t.saved);
        }
      } catch {
        toast(t.invalid);
      }
    };
    if (banks.some((b) => b.id === incoming[0].id)) {
      dialog(
        `<div class="modal-symbol">${icon("refresh-cw")}</div><h2>${t.replaceTitle}</h2><p>${esc(incoming[0].name)} · ${incoming[0].categories.length} ${noun(incoming[0].categories.length, "categories")}</p><p>${t.replaceText}</p><div class="modal-actions"><button class="glass-button" id="cancel-replace">${t.cancel}</button><button class="primary" id="confirm-replace">${t.confirmReplace}</button></div>`,
      );
      $("#cancel-replace").onclick = () =>
        showReview(
          { bank: incoming[0], categories: incoming[0].categories },
          raw,
        );
      $("#confirm-replace").onclick = save;
    } else save();
  };
}
async function cancelOCR() {
  job++;
  busy = false;
  const running = worker;
  worker = null;
  render();
  if (running) await running.terminate().catch(() => {});
}
async function processImage(file) {
  if (busy) {
    toast(t.processing);
    return;
  }
  if (
    !["image/png", "image/jpeg", "image/webp", "image/bmp"].includes(
      file.type,
    ) ||
    file.size > 20 * 1024 * 1024
  ) {
    toast(t.imageError);
    return;
  }
  busy = true;
  const thisJob = ++job;
  render();
  $("#processing").scrollIntoView({ behavior: "smooth", block: "center" });
  let localWorker;
  try {
    const { createWorker } = await import("tesseract.js");
    if (thisJob !== job) return;
    const base = new URL(import.meta.env.BASE_URL, location.href);
    localWorker = await createWorker(["rus", "eng"], 1, {
      workerPath: new URL("ocr/worker.min.js", base).href,
      corePath: new URL("ocr/", base).href,
      langPath: new URL("ocr/", base).href,
      workerBlobURL: false,
      logger: (message) => {
        if (thisJob !== job) return;
        const reading = message.status === "recognizing text";
        $("#progress-text").textContent = reading
          ? t.reading
          : t.progressDownload;
        $("#progress").value = Math.round((message.progress || 0) * 100);
      },
    });
    if (thisJob !== job) {
      await localWorker.terminate();
      return;
    }
    worker = localWorker;
    const { data } = await localWorker.recognize(file);
    if (thisJob !== job) return;
    busy = false;
    render();
    showReview(parseScreenshot(data.text), data.text);
  } catch {
    if (thisJob === job) {
      busy = false;
      render();
      dialog(
        `<div class="modal-symbol">${icon("scan-line")}</div><h2>${t.review}</h2><p>${t.ocrError}</p><button class="primary wide" id="fallback-manual">${t.manual}</button>`,
      );
      $("#fallback-manual").onclick = () =>
        showReview({ bank: null, categories: [] }, "");
    }
  } finally {
    if (localWorker) await localWorker.terminate().catch(() => {});
    if (worker === localWorker) worker = null;
  }
}
function exportData() {
  if (!banks.length) {
    toast(t.emptyShare);
    return;
  }
  const blob = new Blob([JSON.stringify({ version: 1, banks }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `banker-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(t.exportDone);
}
async function importFile(file) {
  if (file.size > 1024 * 1024) {
    toast(t.badFile);
    return;
  }
  let data;
  try {
    data = validateData(JSON.parse(await file.text()));
    if (!data.banks.length) throw Error();
  } catch {
    toast(t.badFile);
    return;
  }
  dialog(
    `<div class="modal-symbol">${icon("download")}</div><h2>${t.importTitle}</h2><p>${data.banks.length} ${noun(data.banks.length, "banks")} · ${data.banks.reduce((n, b) => n + b.categories.length, 0)} ${t.categories}</p><p>${t.importText}</p><div class="modal-actions"><button class="glass-button" id="cancel-import">${t.cancel}</button><button class="primary" id="confirm-import">${t.confirmImport}</button></div>`,
  );
  $("#cancel-import").onclick = () => $("#modal").close();
  $("#confirm-import").onclick = () => {
    try {
      if (persist(mergeBanks(banks, data.banks))) {
        $("#modal").close();
        render();
        toast(t.imported);
      }
    } catch {
      toast(t.badFile);
    }
  };
}
function shareData() {
  if (!banks.length) {
    toast(t.emptyShare);
    return;
  }
  let url;
  try {
    const payload = encodeShare(banks);
    url = `${location.origin}${location.pathname}${location.search}#share=${payload}`;
    if (url.length > 16000) throw Error();
  } catch {
    toast(t.linkTooLarge);
    return;
  }
  dialog(
    `<div class="modal-symbol">${icon("share-2")}</div><h2>${t.shareTitle}</h2><p>${t.shareText}</p><input class="share-url" id="share-url" aria-label="${t.copyLink}" readonly value="${esc(url)}"><div class="modal-actions"><button class="primary" id="copy-link">${icon("copy")}${t.copyLink}</button>${navigator.share ? `<button class="glass-button" id="native-share">${t.nativeShare}</button>` : ""}</div>`,
  );
  $("#share-url").onclick = (e) => e.target.select();
  $("#copy-link").onclick = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast(t.copied);
    } catch {
      $("#share-url").select();
    }
  };
  if ($("#native-share"))
    $("#native-share").onclick = async () => {
      try {
        await navigator.share({ title: "Banker", url });
      } catch {}
    };
}
$("#screenshot").onchange = (e) => {
  const file = e.target.files[0];
  if (file) processImage(file);
  e.target.value = "";
};
$("#import-file").onchange = (e) => {
  const file = e.target.files[0];
  if (file) importFile(file);
  e.target.value = "";
};
window.addEventListener("online", () => {
  $("#offline").hidden = true;
});
window.addEventListener("offline", () => {
  $("#offline").hidden = false;
});
window.addEventListener("hashchange", () => {
  try {
    shared = location.hash.startsWith("#share=")
      ? decodeShare(location.hash)
      : [];
    render();
  } catch {
    toast(t.shareInvalid);
  }
});
window.addEventListener("storage", (e) => {
  if (e.key === "banker.preferences.v1") {
    try {
      const p = JSON.parse(e.newValue || "{}");
      displayName =
        typeof p.name === "string" && p.name.length <= 60
          ? p.name.trim().replace(/\s+/gu, " ")
          : "";
      render();
    } catch {}
  }
  if (e.key === "banker.v1") {
    try {
      banks = e.newValue ? restoreStoredData(JSON.parse(e.newValue)).banks : [];
      render();
    } catch {
      toast(t.badFile);
    }
  }
});
render();
if (saveUnavailable) toast(t.storageError);
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "BANKER_OFFLINE_READY") {
      offlineReady = true;
      if ($("#offline-status"))
        $("#offline-status").textContent = t.offlineReady;
    }
  });
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register(
        `${import.meta.env.BASE_URL}sw.js`,
      );
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({ type: "BANKER_OFFLINE_STATUS" });
    } catch {
      /* The application remains usable without offline caching. */
    }
  });
}
