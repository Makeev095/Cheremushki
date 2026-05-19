/**
 * Запись показаний в Google Таблицы.
 *
 * РЕЖИМ 1 — одна таблица, лист на дом (рекомендуется для бухгалтерии):
 *   Script Properties:
 *     SECRET — как APPS_SCRIPT_SECRET на сайте
 *     MASTER_SPREADSHEET_ID — ID одной таблицы
 *     BUILDING_SHEET_MAP — JSON: {"bulgakova-5":"Булгакова 5", ...} (значение = имя листа)
 *   Один раз в редакторе: Run → setupMasterSpreadsheet (создаст листы и заголовки)
 *
 * РЕЖИМ 2 — отдельная таблица на каждый дом:
 *   Только SECRET и BUILDING_SHEET_MAP: {"slug":"SPREADSHEET_ID", ...}
 *   Без MASTER_SPREADSHEET_ID
 *
 * Развернуть → Веб-приложение → доступ «Все» → URL в APPS_SCRIPT_URL (/exec).
 */

var HEADERS = [
  "Дата и время (ISO)",
  "Код дома",
  "Дом",
  "Квартира",
  "ХВС",
  "ГВС",
  "Газ",
  "Электричество",
];

function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty("SECRET");
    var mapJson = props.getProperty("BUILDING_SHEET_MAP") || "{}";
    var masterId = props.getProperty("MASTER_SPREADSHEET_ID");

    if (!secret) {
      return jsonOut({ ok: false, error: "Не задан SECRET в Script Properties" });
    }
    if (!e.postData || !e.postData.contents) {
      return jsonOut({ ok: false, error: "Пустое тело запроса" });
    }

    var body = JSON.parse(e.postData.contents);
    if (body.secret !== secret) {
      return jsonOut({ ok: false, error: "Неверный пароль" });
    }

    var slug = body.slug;
    var cells = body.cells;
    if (!slug || typeof slug !== "string") {
      return jsonOut({ ok: false, error: "Нет slug" });
    }
    if (!cells || !Array.isArray(cells)) {
      return jsonOut({ ok: false, error: "Нет строки cells" });
    }
    if (cells.length > 20) {
      return jsonOut({ ok: false, error: "Слишком много колонок" });
    }

    var map = JSON.parse(mapJson);
    var sheet;

    if (masterId) {
      var sheetName = map[slug];
      if (!sheetName || typeof sheetName !== "string") {
        return jsonOut({
          ok: false,
          error: "Дом не в BUILDING_SHEET_MAP: " + slug,
        });
      }
      var ss = SpreadsheetApp.openById(masterId);
      sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        return jsonOut({
          ok: false,
          error: 'Лист "' + sheetName + '" не найден. Запустите setupMasterSpreadsheet.',
        });
      }
    } else {
      var spreadsheetId = map[slug];
      if (!spreadsheetId || typeof spreadsheetId !== "string") {
        return jsonOut({ ok: false, error: "Дом не сопоставлен с таблицей" });
      }
      var ssLegacy = SpreadsheetApp.openById(spreadsheetId);
      sheet = ssLegacy.getSheets()[0];
    }

    ensureHeaders(sheet);
    sheet.appendRow(cells);
    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

/** Запустите вручную один раз после настройки MASTER_SPREADSHEET_ID и BUILDING_SHEET_MAP */
function setupMasterSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var masterId = props.getProperty("MASTER_SPREADSHEET_ID");
  var mapJson = props.getProperty("BUILDING_SHEET_MAP") || "{}";

  if (!masterId) {
    throw new Error("Задайте MASTER_SPREADSHEET_ID в Script Properties");
  }

  var map = JSON.parse(mapJson);
  var ss = SpreadsheetApp.openById(masterId);
  var created = 0;
  var existing = 0;

  for (var slug in map) {
    if (!map.hasOwnProperty(slug)) continue;
    var name = map[slug];
    if (!name || typeof name !== "string") continue;

    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(sanitizeSheetName(name));
      created++;
    } else {
      existing++;
    }
    ensureHeaders(sheet);
  }

  var defaultSheet = ss.getSheets()[0];
  if (defaultSheet.getName() === "Лист1" && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  Logger.log("Готово. Создано листов: " + created + ", уже было: " + existing);
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return;
  }
  var first = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var empty = first.every(function (c) {
    return c === "" || c === null;
  });
  if (empty) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function sanitizeSheetName(name) {
  var s = String(name).replace(/[\\/?*[\]]/g, " ").trim();
  if (s.length > 100) s = s.substring(0, 100);
  if (!s) s = "Дом";
  return s;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
