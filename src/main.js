import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
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
  CalendarDays,
  ChevronLeft,
  ChevronRight,
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
import { BANKS, makeBankId } from "./domain.js";
import { getSuggestedBanks } from "./bank-catalog.js";
import {
  currentMonth,
  defaultUploadMonth,
  validateLedger,
  restoreLedger,
  mergeLedger,
  ledgerMonths,
  selectInitialMonth,
  encodeLedgerShare,
  decodeLedgerShare,
} from "./ledger.js";
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
Object.assign(copy.en, {
  preparingImage: "Preparing your screenshot…",
  readingBankLabel: "Checking the bank label…",
  monthCount: "months",
  monthLabel: "Cashbacks for",
  monthCurrent: "Current month",
  monthUpcoming: "Upcoming",
  monthHistory: "History",
  monthSelect: "Choose cashback month",
  previousMonth: "Previous available month",
  nextMonth: "Next available month",
  uploadMonth: "Cashback month",
  monthHint:
    "Before the 25th: this month. From the 25th: next month. Change it if needed.",
  retention:
    "The latest 6 months are kept on this device. Export a backup for a longer history.",
  emptyMonth: "A fresh page for this month",
  emptyMonthSub:
    "Add a screenshot and save it for this month. Your other months stay in the selector above.",
  noSharedMonth:
    "No shared cashbacks for this month. Choose another month above.",
  bankPicker: "Choose your bank",
  bankUnknown:
    "The screenshot has no readable bank name. Pick your bank below or type any name.",
  bankSuggested:
    "Suggested from the screen layout. Please confirm or change the bank.",
  bankDetected: "Bank name read from the screenshot. Please check it.",
  saved: "Cashbacks saved for the selected month",
  replace:
    "Replaces only this bank’s list for the selected month. Other months stay unchanged.",
  replaceTitle: "Replace this bank for this month?",
  replaceText:
    "Only this bank’s categories for the selected month will be replaced.",
  importText:
    "Matching bank and month lists will be replaced. The latest six populated months are retained.",
  imported: "Monthly backup imported",
  shareText:
    "This link contains only the cashback lists for the selected month. Anyone with it can read them. Your name and screenshots are not included.",
  monthTooOld:
    "Only the six newest populated months are kept. Choose a more recent month.",
  invalid:
    "Choose a bank, a valid month, and at least one category with a cashback rate above 0 and at most 100%.",
});
Object.assign(copy.ru, {
  preparingImage: "Готовим скриншот…",
  readingBankLabel: "Проверяем название банка…",
  monthCount: "мес.",
  monthLabel: "Кешбэки на",
  monthCurrent: "Текущий месяц",
  monthUpcoming: "Впереди",
  monthHistory: "История",
  monthSelect: "Выбрать месяц кешбэка",
  previousMonth: "Предыдущий доступный месяц",
  nextMonth: "Следующий доступный месяц",
  uploadMonth: "Месяц кешбэка",
  monthHint:
    "До 25-го выбираем текущий месяц, с 25-го — следующий. При необходимости измените.",
  retention:
    "На устройстве хранятся последние 6 месяцев. Для долгой истории экспортируйте копию.",
  emptyMonth: "Чистый лист для этого месяца",
  emptyMonthSub:
    "Добавьте скриншот и сохраните его для этого месяца. Остальные месяцы доступны в переключателе выше.",
  noSharedMonth:
    "За этот месяц общих кешбэков нет. Выберите другой месяц выше.",
  bankPicker: "Выберите банк",
  bankUnknown:
    "На скриншоте нет читаемого названия банка. Выберите банк ниже или введите свой.",
  bankSuggested:
    "Предположили банк по оформлению экрана. Подтвердите или измените его.",
  bankDetected: "Название банка прочитано со скриншота. Проверьте его.",
  saved: "Кешбэки сохранены для выбранного месяца",
  replace:
    "Заменит только список этого банка за выбранный месяц. Остальные месяцы останутся.",
  replaceTitle: "Заменить кешбэки банка за этот месяц?",
  replaceText: "Заменятся только категории этого банка за выбранный месяц.",
  importText:
    "Списки совпавших банков и месяцев заменятся. Останутся шесть последних заполненных месяцев.",
  imported: "История кешбэков импортирована",
  shareText:
    "Ссылка содержит только кешбэки выбранного месяца. Любой получатель сможет их прочитать. Имя и скриншоты в ссылку не входят.",
  monthTooOld:
    "Хранятся только шесть самых новых заполненных месяцев. Выберите более поздний месяц.",
  invalid:
    "Укажите банк, корректный месяц и хотя бы одну категорию с кешбэком больше 0 и не больше 100%.",
});
Object.assign(copy.en, {
  theme: "Appearance",
  themeSystem: "Same as device",
  themeLight: "Light",
  themeDark: "Dark",
  settingsHistory: "History",
  emptyMonthSub: "Add a screenshot to save cashbacks for this month.",
});
Object.assign(copy.ru, {
  theme: "Оформление",
  themeSystem: "Как на устройстве",
  themeLight: "Светлое",
  themeDark: "Тёмное",
  settingsHistory: "История",
  emptyMonthSub: "Добавьте скриншот, чтобы сохранить кешбэки за этот месяц.",
});
const t = copy[ru ? "ru" : "en"];
let displayName = "";
let themePreference = window.BankerTheme?.preference() || "system";
try {
  const preferences = JSON.parse(
    localStorage.getItem("banker.preferences.v1") || "{}",
  );
  if (["system", "light", "dark"].includes(preferences.theme))
    themePreference = preferences.theme;
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
  ocrController = null,
  job = 0,
  saveUnavailable = false,
  offlineReady = false,
  completedLoop = false;
try {
  const saved =
    localStorage.getItem("banker.v2") ?? localStorage.getItem("banker.v1");
  if (saved) {
    const stored = JSON.parse(saved);
    banks = mergeLedger([], restoreLedger(stored).banks);
    completedLoop =
      stored.onboarded === true || banks.some((bank) => bank.categories.length);
  }
  completedLoop =
    completedLoop || localStorage.getItem("banker.onboarded") === "1";
  if (completedLoop) {
    try {
      localStorage.setItem("banker.onboarded", "1");
    } catch {}
  }
} catch {
  saveUnavailable = true;
}
try {
  if (location.hash.startsWith("#share="))
    shared = decodeLedgerShare(location.hash);
} catch {
  queueMicrotask(() => toast(t.shareInvalid));
}
let selectedMonth = selectInitialMonth(banks.length ? banks : shared);
const suggestedBanks = getSuggestedBanks(navigator.language);
const monthName = (month) =>
  new Date(
    Number(month.slice(0, 4)),
    Number(month.slice(5, 7)) - 1,
    1,
  ).toLocaleDateString(ru ? "ru-RU" : "en-GB", {
    month: "long",
    year: "numeric",
  });
const monthBanks = (items) =>
  items.filter((bank) => bank.month === selectedMonth);
const availableMonths = () =>
  [
    ...new Set([
      currentMonth(),
      selectedMonth,
      ...ledgerMonths(banks),
      ...ledgerMonths(shared),
    ]),
  ]
    .sort()
    .reverse();
function changeMonth(month) {
  selectedMonth = month;
  query = "";
  render();
}
function persist(next) {
  try {
    localStorage.setItem(
      "banker.v2",
      JSON.stringify({
        version: 2,
        banks: next,
        onboarded: completedLoop || next.some((bank) => bank.categories.length),
      }),
    );
    banks = next;
    completedLoop =
      completedLoop || next.some((bank) => bank.categories.length);
    if (completedLoop) {
      try {
        localStorage.setItem("banker.onboarded", "1");
      } catch {}
    }
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
  return `<span class="bank-logo monogram ${mini ? "mini-bank" : ""}" style="--bank:${esc(meta.color)}" role="img" aria-label="${esc(bank.name)}"><span>${esc(meta.mark || Array.from(bank.name)[0])}</span></span>`;
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
  return `<div class="category-row"><span class="category-icon" data-type="${categoryIcon(category.name)}">${icon(categoryIcon(category.name))}</span><div class="category-info"><span>${esc(category.name)}</span>${view !== "bank" ? `<small class="category-bank">${badge(bank, true)}<span>${esc(bank.name)}</span></small>` : ""}</div><strong class="rate">${category.rate}<span>%</span></strong><button class="row-delete icon-button" data-delete="${esc(category.id)}" data-bank="${esc(bank.id)}" data-month="${esc(bank.month)}" data-shared="${isShared}" aria-label="${t.delete}: ${esc(category.name)}">${icon("x")}</button></div>`;
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
  const activeBanks = monthBanks(banks);
  const activeShared = monthBanks(shared);
  const count = activeBanks.reduce(
    (sum, bank) => sum + bank.categories.length,
    0,
  );
  const hasData = banks.length > 0;
  const title = displayName
    ? `${t.greeting}, ${esc(displayName)}<span class="greeting-dot">.</span>`
    : hasData
      ? t.dashboardTitle
      : t.title.replace("\n", "<br> ");
  const sampleBanks = suggestedBanks.slice(0, 4);
  $("#app").innerHTML = `
 <div class="ambient ambient-one"></div><div class="ambient ambient-two"></div>
 <div class="shell ${hasData ? "has-data" : ""} ${completedLoop ? "app-mode" : ""}">
  <nav class="topbar" aria-label="Banker">
   <a href="./" class="wordmark" aria-label="Banker"><span class="brand-icon">b<span>✦</span></span>banker<span class="brand-period">.</span></a>
   <div class="nav-right">
    ${!completedLoop ? `<span class="local-pill">${icon("shield-check")}<span>${t.local}</span></span><button class="glass-button install-button" data-install>${icon("smartphone")}<span>${t.install}</span></button>` : ""}
    <button class="settings-button glass-button ${completedLoop && displayName ? "has-name" : ""}" data-settings aria-label="${t.settings}" title="${t.settings}">${completedLoop && displayName ? `<span class="profile-name">${esc(displayName)}</span>` : ""}${icon("settings")}</button>
   </div>
  </nav>
  <main>
   ${
     !completedLoop
       ? `   <section class="hero">
    <div class="hero-copy">
     <div class="eyebrow">${icon("sparkles")}<span>${hasData ? t.total : t.eyebrow}</span></div>
     <h1>${title}</h1>
     <p>${hasData ? t.dashboardIntro : t.intro}</p>

    </div>
    <div class="upload-card glass" id="dropzone">
     <div class="upload-art"><div class="art-card art-back"></div><div class="art-card art-front">${icon("scan-line")}<span>5<span>%</span></span><div class="art-line"></div><div class="art-line short"></div></div><span class="art-plus">${icon("plus")}</span><span class="art-spark">✦</span></div>
     <button class="primary upload-button" data-upload>${icon("plus")}${t.upload}</button>
     <span class="upload-sub">${t.uploadSub}</span><span class="formats">${t.formats}</span>
     <div class="upload-privacy">${icon("lock-keyhole")}${t.privacy}</div>
    </div>
   </section>
`
       : ""
   }
   <div id="offline" ${navigator.onLine ? "hidden" : ""} class="notice">${icon("wifi-off")}${t.offline}</div>
   <section class="month-navigation glass" aria-label="${t.monthSelect}">
    <div class="month-heading"><span class="month-icon">${icon("calendar-days")}</span><div><span>${t.monthLabel}</span><label class="global-month-select"><select id="active-month" aria-label="${t.monthSelect}">${availableMonths()
      .map(
        (month) =>
          `<option value="${month}" ${month === selectedMonth ? "selected" : ""}>${monthName(month)}</option>`,
      )
      .join("")}</select>${icon("chevron-down")}</label></div></div>
    <div class="month-status"><span class="month-badge ${selectedMonth === currentMonth() ? "is-current" : ""}">${selectedMonth === currentMonth() ? t.monthCurrent : selectedMonth > currentMonth() ? t.monthUpcoming : t.monthHistory}</span><div class="month-arrows"><button class="icon-button" id="month-previous" aria-label="${t.previousMonth}" ${availableMonths().indexOf(selectedMonth) === availableMonths().length - 1 ? "disabled" : ""}>${icon("chevron-left")}</button><button class="icon-button" id="month-next" aria-label="${t.nextMonth}" ${availableMonths().indexOf(selectedMonth) === 0 ? "disabled" : ""}>${icon("chevron-right")}</button></div></div>
   </section>
   <section class="cabinet">
    <div class="section-top"><div>${!completedLoop ? `<div class="section-kicker">${t.privacyShort}</div>` : ""}<h2>${t.own}<span class="count-pill">${count}</span></h2></div>
     <div class="actions"><button class="glass-button" data-import aria-label="${t.import}" title="${t.import}">${icon("download")}<span>${t.import}</span></button><button class="glass-button" data-export aria-label="${t.export}" title="${t.export}">${icon("upload")}<span>${t.export}</span></button><button class="glass-button" data-share aria-label="${t.share}" title="${t.share}">${icon("share-2")}<span>${t.share}</span></button></div>
    </div>
    <div id="processing" class="processing glass" ${busy ? "" : "hidden"}><div class="spinner"></div><div><strong>${t.processing}</strong><p id="progress-text">${t.loading}</p><progress id="progress" max="100" value="0"></progress></div><button class="text-button" id="cancel-ocr">${t.cancel}</button></div>
    ${
      hasData || shared.length || completedLoop
        ? `<div class="toolbar"><label class="search-box">${icon("search")}<input type="search" id="search" value="${esc(query)}" aria-label="${t.search}" placeholder="${t.search}"></label><label class="select-wrap">${icon("sliders-horizontal")}<select id="view" aria-label="${ru ? "Сортировка" : "Sort categories"}"><option value="bank" ${view === "bank" ? "selected" : ""}>${t.byBank}</option><option value="rate" ${view === "rate" ? "selected" : ""}>${t.highest}</option><option value="az" ${view === "az" ? "selected" : ""}>${t.az}</option></select>${icon("chevron-down")}</label></div><div class="bank-grid" id="own-list">${activeBanks.length ? collection(activeBanks) : `<div class="empty-month"><h3>${t.emptyMonth}</h3><p>${t.emptyMonthSub}</p><button class="text-button" data-manual>${t.manual}${icon("plus")}</button></div>`}</div>`
        : `
    <div class="empty-layout"><div class="empty-message"><span class="empty-icon">${icon("layers-2")}</span><h3>${t.empty}</h3><p>${t.emptySub}</p><button class="text-button" data-manual>${t.manual}${icon("arrow-right")}</button></div>
     <div class="preview-card"><span class="preview-label">${t.preview}</span><div class="sample-header"><span class="sample-bank-icon">${icon("landmark")}</span><b>${esc(sampleBanks[0].name)}</b><span>${icon("sparkles")}</span></div>
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
   ${shared.length ? `<section class="shared-section"><div class="section-top"><div><div class="section-kicker">${icon("link")} ${ru ? "ПО ССЫЛКЕ" : "FROM A FRIEND"}</div><h2>${t.shared}</h2><p>${t.sharedSub}</p></div><button class="glass-button" id="dismiss-shared">${icon("x")}${t.dismiss}</button></div><div class="bank-grid">${activeShared.length ? collection(activeShared, true) : `<p class="no-results">${t.noSharedMonth}</p>`}</div></section>` : ""}
   ${
     !completedLoop
       ? `   <section class="how-section"><div class="how-title"><span>${t.how}</span><span>01 — 03</span></div><div class="steps">${[
           ["scan-line", "step1", "step1Text"],
           ["list-checks", "step2", "step2Text"],
           ["sparkles", "step3", "step3Text"],
         ]
           .map(
             ([type, title, body], index) =>
               `<div class="step"><span class="step-icon">${icon(type)}</span><div><small>0${index + 1}</small><h3>${t[title]}</h3><p>${t[body]}</p></div></div>`,
           )
           .join("")}</div></section>
`
       : ""
   }
  </main>
  ${!completedLoop ? `  <footer class="page-footer"><span class="footer-brand">banker.</span><p>${icon("lock-keyhole")}${t.footer}</p><button class="text-button" data-install>${t.install}${icon("arrow-up-right")}</button></footer>` : ""}
 </div>
 <button class="floating-add primary" data-upload aria-label="${t.upload}">${icon("plus")}<span>${t.upload}</span></button>`;
  refreshIcons();
  $("#active-month").onchange = (event) => changeMonth(event.target.value);
  $("#month-previous").onclick = () => {
    const months = availableMonths();
    const index = months.indexOf(selectedMonth);
    if (index < months.length - 1) changeMonth(months[index + 1]);
  };
  $("#month-next").onclick = () => {
    const months = availableMonths();
    const index = months.indexOf(selectedMonth);
    if (index > 0) changeMonth(months[index - 1]);
  };
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
      $("#own-list").innerHTML = collection(monthBanks(banks));
      if (shared.length)
        $(".shared-section .bank-grid").innerHTML = collection(
          monthBanks(shared),
          true,
        );
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
  if (zone) {
    zone.ondragover = (event) => {
      event.preventDefault();
      zone.classList.add("dragover");
    };
    zone.ondragleave = () => zone.classList.remove("dragover");
    zone.ondrop = (event) => {
      event.preventDefault();
      zone.classList.remove("dragover");
      if (event.dataTransfer.files[0])
        processImage(event.dataTransfer.files[0]);
    };
  }
  bindDeletes();
}
function showSettings() {
  dialog(
    `<div class="profile-avatar">${displayName ? esc(Array.from(displayName)[0].toLocaleUpperCase()) : icon("user-round")}</div><span class="section-kicker">${t.settings}</span><h2>${t.settingsTitle}</h2><form id="settings-form"><label class="field" for="display-name"><span>${t.nameLabel}<small>${t.optional}</small></span><input id="display-name" type="text" name="name" autocomplete="given-name" maxlength="60" placeholder="${t.namePlaceholder}" value="${esc(displayName)}"></label><label class="field" for="color-theme">${t.theme}<select id="color-theme" class="theme-picker"><option value="system" ${themePreference === "system" ? "selected" : ""}>${t.themeSystem}</option><option value="light" ${themePreference === "light" ? "selected" : ""}>${t.themeLight}</option><option value="dark" ${themePreference === "dark" ? "selected" : ""}>${t.themeDark}</option></select></label><p class="settings-privacy">${icon("lock-keyhole")}<span>${t.namePrivacy}</span></p><p class="settings-history">${t.retention}</p><p class="form-error" id="settings-error" role="alert"></p><button type="submit" class="primary wide">${icon("check")}${t.saveSettings}</button></form><button class="text-button settings-install" id="settings-install">${icon("smartphone")}${t.install}${icon("arrow-up-right")}</button>`,
  );
  $("#settings-install").onclick = showInstall;
  $("#settings-form").onsubmit = (event) => {
    event.preventDefault();
    const name = $("#display-name").value.trim().replace(/\s+/gu, " ");
    const theme = $("#color-theme").value;
    if (name.length > 60 || !["system", "light", "dark"].includes(theme)) {
      $("#settings-error").textContent = t.nameError;
      return;
    }
    try {
      localStorage.setItem(
        "banker.preferences.v1",
        JSON.stringify({ name, theme }),
      );
    } catch {
      $("#settings-error").textContent = t.storageError;
      return;
    }
    displayName = name;
    themePreference = theme;
    window.BankerTheme?.apply(theme);
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
                b.id === button.dataset.bank && b.month === button.dataset.month
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
                (shared.length ? `#share=${encodeLedgerShare(shared)}` : ""),
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
function showReview(result, raw = "") {
  let categories = result.categories.map((category) => ({ ...category }));
  if (!categories.length) categories = [{ id: uid(), name: "", rate: "" }];
  const uploadMonth = result.month || defaultUploadMonth();
  const suggested = result.bankSource === "layout";
  dialog(`<span class="section-kicker">${ru ? "ПЕРЕД СОХРАНЕНИЕМ" : "BEFORE YOU SAVE"}</span><h2>${t.review}</h2><p>${t.reviewSub}</p>
  <form id="review-form">
   <label class="field">${t.bank}<input id="bank-name" list="banks-list" maxlength="80" required placeholder="${t.bankPlaceholder}" value="${esc(result.bank?.name || "")}"><datalist id="banks-list">${suggestedBanks.map((bank) => `<option value="${esc(bank.name)}"></option>`).join("")}</datalist></label>
   <p class="bank-detection-note ${result.bank ? "" : "bank-needs-choice"}">${result.bank ? (suggested ? t.bankSuggested : t.bankDetected) : t.bankUnknown}</p>
   <div class="bank-picker" aria-label="${t.bankPicker}">${suggestedBanks
     .slice(0, 10)
     .map(
       (bank) =>
         `<button type="button" class="bank-choice ${result.bank?.id === bank.id ? "selected" : ""}" data-pick-bank="${esc(bank.name)}" aria-label="${esc(bank.name)}" title="${esc(bank.name)}">${badge(bank, true)}<span>${esc(bank.name)}</span></button>`,
     )
     .join("")}</div>
   <label class="field month-field">${t.uploadMonth}<input type="month" id="upload-month" required value="${esc(uploadMonth)}" aria-label="${t.uploadMonth}"></label>
   <p class="field-hint">${t.monthHint}</p>
   ${!result.categories.length ? `<p class="field-hint">${t.noCategories}</p>` : ""}
   <div class="review-labels"><span>${t.category}</span><span>${t.rate}</span></div><div id="review-rows"></div>
   <button type="button" class="text-button" id="add-category">${icon("plus")}${t.addCategory}</button>
   <p class="replace-note">${icon("refresh-cw")}${t.replace}</p>
   ${raw ? `<details><summary>${t.raw}</summary><pre>${esc(raw)}</pre></details>` : ""}
   <p id="review-error" class="form-error" role="alert"></p><button type="submit" class="primary wide">${icon("check")}${t.save}</button>
  </form>`);
  document.querySelectorAll("[data-pick-bank]").forEach(
    (button) =>
      (button.onclick = () => {
        $("#bank-name").value = button.dataset.pickBank;
        document
          .querySelectorAll("[data-pick-bank]")
          .forEach((item) =>
            item.classList.toggle("selected", item === button),
          );
        $(".bank-detection-note").textContent = t.bankPicker;
        $(".bank-detection-note").classList.remove("bank-needs-choice");
      }),
  );
  function draw() {
    $("#review-rows").innerHTML = categories
      .map(
        (category, index) =>
          `<div class="review-row"><textarea aria-label="${t.category} ${index + 1}" class="review-name" rows="1" maxlength="100" required>${esc(category.name)}</textarea><input aria-label="${t.rate} ${index + 1}" class="review-rate" type="number" step="0.01" min="0.01" max="100" required value="${esc(category.rate)}"><button type="button" class="icon-button" data-remove-row="${index}" aria-label="${t.delete}">${icon("x")}</button></div>`,
      )
      .join("");
    $("#review-rows")
      .querySelectorAll(".review-row")
      .forEach((row, index) => {
        const nameField = row.querySelector(".review-name");
        const fitName = () => {
          nameField.style.height = "auto";
          nameField.style.height = `${nameField.scrollHeight}px`;
        };
        nameField.oninput = (event) => {
          categories[index].name = event.target.value;
          fitName();
        };
        fitName();
        row.querySelector(".review-rate").oninput = (event) =>
          (categories[index].rate = event.target.value);
        row.querySelector("[data-remove-row]").onclick = () => {
          categories.splice(index, 1);
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
  $("#review-form").onsubmit = (event) => {
    event.preventDefault();
    let incoming;
    try {
      if (!categories.length) throw Error();
      const name = $("#bank-name").value.trim();
      incoming = validateLedger({
        version: 2,
        banks: [
          {
            id: makeBankId(name),
            name,
            month: $("#upload-month").value,
            categories: categories.map((category) => ({
              ...category,
              rate: Number(category.rate),
            })),
            updatedAt: new Date().toISOString(),
          },
        ],
      }).banks;
    } catch {
      $("#review-error").textContent = t.invalid;
      return;
    }
    let next;
    try {
      next = mergeLedger(banks, incoming);
    } catch {
      $("#review-error").textContent = t.invalid;
      return;
    }
    if (
      !next.some(
        (bank) =>
          bank.id === incoming[0].id && bank.month === incoming[0].month,
      )
    ) {
      $("#review-error").textContent = t.monthTooOld;
      return;
    }
    const save = () => {
      try {
        if (persist(mergeLedger(banks, incoming))) {
          selectedMonth = incoming[0].month;
          query = "";
          $("#modal").close();
          render();
          toast(t.saved);
        }
      } catch {
        toast(t.invalid);
      }
    };
    if (
      banks.some(
        (bank) =>
          bank.id === incoming[0].id && bank.month === incoming[0].month,
      )
    ) {
      dialog(
        `<div class="modal-symbol">${icon("refresh-cw")}</div><h2>${t.replaceTitle}</h2><p>${esc(incoming[0].name)} · ${monthName(incoming[0].month)}</p><p>${t.replaceText}</p><div class="modal-actions"><button class="glass-button" id="cancel-replace">${t.cancel}</button><button class="primary" id="confirm-replace">${t.confirmReplace}</button></div>`,
      );
      $("#cancel-replace").onclick = () =>
        showReview(
          {
            bank: incoming[0],
            month: incoming[0].month,
            categories: incoming[0].categories,
            bankSource: result.bankSource,
          },
          raw,
        );
      $("#confirm-replace").onclick = save;
    } else save();
  };
}
async function cancelOCR() {
  job++;
  busy = false;
  ocrController?.abort();
  ocrController = null;
  render();
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
  const controller = new AbortController();
  ocrController = controller;
  render();
  $("#processing").scrollIntoView({ behavior: "smooth", block: "center" });
  try {
    const { recognizeScreenshot } = await import("./ocr.js");
    const result = await recognizeScreenshot(file, {
      signal: controller.signal,
      onProgress: (message) => {
        if (thisJob !== job) return;
        $("#progress-text").textContent =
          message.status === "recognizing text"
            ? t.reading
            : message.status === "reading bank label"
              ? t.readingBankLabel
              : message.status === "preparing image"
                ? t.preparingImage
                : t.progressDownload;
        $("#progress").value = Math.round((message.progress || 0) * 100);
      },
    });
    if (thisJob !== job) return;
    busy = false;
    render();
    showReview(result, result.text);
  } catch (error) {
    if (thisJob === job && error.name !== "AbortError") {
      busy = false;
      render();
      dialog(
        `<div class="modal-symbol">${icon("scan-line")}</div><h2>${t.review}</h2><p>${t.ocrError}</p><button class="primary wide" id="fallback-manual">${t.manual}</button>`,
      );
      $("#fallback-manual").onclick = () =>
        showReview({ bank: null, categories: [] });
    }
  } finally {
    if (ocrController === controller) ocrController = null;
  }
}
function exportData() {
  if (!banks.length) {
    toast(t.emptyShare);
    return;
  }
  const blob = new Blob([JSON.stringify({ version: 2, banks }, null, 2)], {
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
    data = validateLedger(JSON.parse(await file.text()));
    if (!data.banks.length) throw Error();
  } catch {
    toast(t.badFile);
    return;
  }
  dialog(
    `<div class="modal-symbol">${icon("download")}</div><h2>${t.importTitle}</h2><p>${new Set(data.banks.map((bank) => bank.id)).size} ${t.bankStat.toLocaleLowerCase()} · ${ledgerMonths(data.banks).length} ${t.monthCount}</p><p>${t.importText}</p><div class="modal-actions"><button class="glass-button" id="cancel-import">${t.cancel}</button><button class="primary" id="confirm-import">${t.confirmImport}</button></div>`,
  );
  $("#cancel-import").onclick = () => $("#modal").close();
  $("#confirm-import").onclick = () => {
    try {
      if (persist(mergeLedger(banks, data.banks))) {
        $("#modal").close();
        selectedMonth = selectInitialMonth(banks);
        render();
        toast(t.imported);
      }
    } catch {
      toast(t.badFile);
    }
  };
}
function shareData() {
  const activeBanks = monthBanks(banks);
  if (!activeBanks.length) {
    toast(t.emptyShare);
    return;
  }
  let url;
  try {
    const payload = encodeLedgerShare(activeBanks);
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
      ? decodeLedgerShare(location.hash)
      : [];
    selectedMonth = selectInitialMonth(banks.length ? banks : shared);
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
      themePreference = ["system", "light", "dark"].includes(p.theme)
        ? p.theme
        : "system";
      window.BankerTheme?.apply(themePreference);
      render();
    } catch {}
  }
  if (
    e.key === "banker.v2" ||
    (e.key === "banker.v1" && !localStorage.getItem("banker.v2"))
  ) {
    try {
      banks = e.newValue
        ? mergeLedger([], restoreLedger(JSON.parse(e.newValue)).banks)
        : [];
      completedLoop =
        completedLoop ||
        banks.some((bank) => bank.categories.length) ||
        (e.newValue && JSON.parse(e.newValue).onboarded === true);
      if (!availableMonths().includes(selectedMonth))
        selectedMonth = selectInitialMonth(banks);
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
