(function () {
  "use strict";

  var SUPABASE_TABLES = {
    config: "registration_periods",
    courses: "courses",
    classSections: "class_sections",
    enrollments: "enrollments",
    scheduleSlots: "schedule_slots",
    operationLogs: "operation_logs",
    importLogs: "import_logs"
  };

  var Store = {
    prefix: "g8.",
    list: function (table) {
      try {
        var raw = window.localStorage.getItem(this.prefix + table);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },
    save: function (table, rows) {
      try {
        window.localStorage.setItem(this.prefix + table, JSON.stringify(rows));
        return true;
      } catch (e) {
        return false;
      }
    },
    upsert: function (table, row) {
      var rows = this.list(table).filter(function (item) {
        return item.id !== row.id;
      });
      rows.push(row);
      return this.save(table, rows);
    },
    remove: function (table, id) {
      var rows = this.list(table).filter(function (item) {
        return item.id !== id;
      });
      return this.save(table, rows);
    }
  };

  var DEFAULT_CONFIG = {
    id: "dot-1",
    name: "Đợt 1 — Học kỳ 2026-2027",
    academicYear: "2026-2027",
    semester: "2",
    defaultMode: "hp",
    opensAt: "2026-10-26",
    closesAt: "2026-10-30",
    studentGroup: "K66A",
    groups: [
      { id: "K66A", from: "2026-10-26", to: "2026-10-30", mode: "hp" },
      { id: "K66B", from: "2026-10-26", to: "2026-10-30", mode: "hp" },
      { id: "K66C", from: "2026-10-26", to: "2026-10-30", mode: "gd" },
      { id: "K67A", from: "2026-11-02", to: "2026-11-06", mode: "gd" }
    ]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getConfig() {
    var rows = Store.list(SUPABASE_TABLES.config);
    return rows.length ? rows[0] : clone(DEFAULT_CONFIG);
  }

  function readConfigFromForm() {
    var config = clone(DEFAULT_CONFIG);
    var saved = getConfig();
    config.id = saved.id || config.id;
    config.academicYear = saved.academicYear || config.academicYear;
    config.semester = saved.semester || config.semester;
    config.defaultMode = saved.defaultMode || config.defaultMode;
    config.groups = saved.groups || config.groups;

    var year = document.getElementById("rp-namhoc");
    var sem = document.getElementById("rp-hocky");
    var name = document.getElementById("rp-name");
    var open = document.getElementById("rp-open");
    var close = document.getElementById("rp-close");
    var mode = document.querySelector("[data-mode-default]:checked");

    if (year) config.academicYear = year.value;
    if (sem) config.semester = sem.value;
    if (name) config.name = name.value;
    if (open) config.opensAt = open.value.slice(0, 10);
    if (close) config.closesAt = close.value.slice(0, 10);
    if (mode) config.defaultMode = mode.value;

    var groupModes = document.querySelectorAll("[data-mode-nhom]");
    if (groupModes.length) {
      config.groups = [];
      Array.prototype.forEach.call(groupModes, function (select) {
        var row = select.closest("tr");
        var from = row ? row.querySelector('input[name="mode_from"]') : null;
        var to = row ? row.querySelector('input[name="mode_to"]') : null;
        config.groups.push({
          id: select.getAttribute("data-mode-nhom"),
          from: from && from.value ? from.value : config.opensAt,
          to: to && to.value ? to.value : config.closesAt,
          mode: select.value
        });
      });
    }
    return config;
  }

  function saveConfig() {
    var config = readConfigFromForm();
    Store.upsert(SUPABASE_TABLES.config, config);
    return config;
  }

  function modeFor(config) {
    var group = null;
    if (config.groups) {
      group = config.groups.filter(function (item) {
        return item.id === config.studentGroup;
      })[0];
    }
    if (group) return group.mode;
    return config.defaultMode;
  }

  function currentMode() {
    return modeFor(getConfig());
  }

  function applyMode() {
    var mode = currentMode();
    var hp = document.getElementById("dk-hp");
    var gd = document.getElementById("dk-gd");
    if (hp && gd) {
      gd.checked = mode === "gd";
      hp.checked = mode !== "gd";
    }
    return mode;
  }

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\u0111/g, "d")
      .replace(/\s+/g, " ")
      .trim();
  }

  function filterScope(control) {
    var card = control.closest(".card");
    if (card && card.querySelector("table")) return card;
    return control.closest(".screen") || document.body;
  }

  function rowMatches(row, controls) {
    return controls.every(function (control) {
      var wanted = normalize(control.value);
      if (!wanted || wanted === "all" || wanted.indexOf(": tat ca") > -1) {
        return true;
      }
      var col = control.getAttribute("data-filter-col");
      var key = control.getAttribute("data-filter");
      var dir = control.getAttribute("data-filter-dir");

      if (dir) {
        var dateKey = control.getAttribute("data-filter-date");
        var value = row.getAttribute("data-" + dateKey) || "";
        if (dir === "from") return value >= control.value;
        return value <= control.value;
      }
      if (key) {
        var attr = row.getAttribute("data-" + key);
        if (attr === null) return true;
        return normalize(attr) === wanted;
      }
      if (col !== null) {
        if (col === "-1") return normalize(row.textContent).indexOf(wanted) > -1;
        var cell = row.cells[Number(col)];
        if (!cell) return true;
        if (control.tagName === "SELECT") {
          return normalize(cell.textContent) === wanted;
        }
        return normalize(cell.textContent).indexOf(wanted) > -1;
      }
      return true;
    });
  }

  function applyFilters(scope) {
    var controls = scope.querySelectorAll(
      "[data-filter], [data-filter-col], [data-filter-date]"
    );
    if (!controls.length) return;
    var list = Array.prototype.slice.call(controls);
    var rows = scope.querySelectorAll("tbody tr");
    var visible = 0;
    Array.prototype.forEach.call(rows, function (row) {
      if (row.classList.contains("grp")) return;
      if (row.closest("table[data-nofilter]")) return;
      var ok = rowMatches(row, list);
      row.hidden = !ok;
      if (ok) visible++;
    });
    var empty = scope.querySelector("[data-empty]");
    if (empty) empty.hidden = visible > 0;
  }

  function bindFilters() {
    var controls = document.querySelectorAll(
      "[data-filter], [data-filter-col], [data-filter-date]"
    );
    Array.prototype.forEach.call(controls, function (control) {
      var scope = filterScope(control);
      var handler = function () {
        applyFilters(scope);
        updateTitles();
      };
      control.addEventListener("change", handler);
      control.addEventListener("input", handler);
      applyFilters(scope);
    });
  }

  function updateTitles() {
    var year = document.getElementById("tkb-namhoc");
    var sem = document.getElementById("tkb-hocky");
    var now = document.getElementById("tkb-now-title");
    if (year && sem && now) {
      now.textContent = "Học kỳ " + sem.value + " · Năm học " + year.value;
    }
    var pYear = document.getElementById("tkb-plan-namhoc");
    var pSem = document.getElementById("tkb-plan-hocky");
    var plan = document.getElementById("tkb-plan-title");
    if (pYear && pSem && plan) {
      plan.textContent = "học kỳ " + pSem.value + " năm học " + pYear.value;
    }
  }

  function bindTimetable() {
    var year = document.getElementById("tkb-namhoc");
    var sem = document.getElementById("tkb-hocky");
    if (!year || !sem) return;
    var cells = document.querySelectorAll(".tt-cell[data-namhoc]");
    var empty = document.getElementById("tkb-empty");
    var note = document.getElementById("tkb-gd-note");
    var mode = applyMode();
    var render = function () {
      var visible = 0;
      Array.prototype.forEach.call(cells, function (cell) {
        var match =
          cell.getAttribute("data-namhoc") === year.value &&
          cell.getAttribute("data-hocky") === sem.value &&
          mode !== "gd";
        cell.hidden = !match;
        if (match) visible++;
      });
      if (empty) empty.hidden = visible > 0;
      if (note) note.hidden = mode !== "gd";
    };
    year.addEventListener("change", function () {
      updateTitles();
      render();
    });
    sem.addEventListener("change", function () {
      updateTitles();
      render();
    });
    render();
  }

  var modalRoot = null;

  function closeModal() {
    if (modalRoot && modalRoot.parentNode) {
      modalRoot.parentNode.removeChild(modalRoot);
      modalRoot = null;
    }
  }

  function openConfirm(message, onConfirm) {
    closeModal();
    var wrap = document.createElement("div");
    wrap.className = "modal-mask";
    wrap.innerHTML =
      '<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">' +
      '<div class="dialog-head"><span id="confirm-title">Xác nhận thao tác</span><span>G8</span></div>' +
      '<div class="dialog-body"><p></p><div class="alert alert-warning"><span class="alert-icon">!</span>' +
      "<div><div class=\"alert-title\">Thao tác ghi / xóa</div>" +
      "Dữ liệu chỉ thay đổi khi bạn bấm Xác nhận; mọi thao tác được ghi nhật ký.</div></div></div>" +
      '<div class="dialog-foot"><button type="button" class="btn btn-ghost btn-sm" data-stay>Quay lại</button>' +
      '<button type="button" class="btn btn-primary btn-sm" data-yes>Xác nhận</button></div></div>';
    wrap.querySelector(".dialog-body p").textContent = message;
    document.body.appendChild(wrap);
    modalRoot = wrap;

    wrap.addEventListener("click", function (event) {
      if (event.target === wrap) closeModal();
    });
    wrap.querySelector("[data-stay]").addEventListener("click", closeModal);
    wrap.querySelector("[data-yes]").addEventListener("click", function () {
      closeModal();
      onConfirm();
    });
    wrap.querySelector("[data-yes]").focus();
    document.addEventListener("keydown", function escape(event) {
      if (event.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escape);
      }
    });
  }

  function toast(text) {
    var node = document.createElement("div");
    node.className = "toast";
    node.setAttribute("role", "status");
    node.textContent = text;
    document.body.appendChild(node);
    window.setTimeout(function () {
      if (node.parentNode) node.parentNode.removeChild(node);
    }, 3600);
  }

  function bindConfirm() {
    document.addEventListener("click", function (event) {
      var target = event.target.closest("[data-confirm]");
      if (!target) return;
      event.preventDefault();
      var message = target.getAttribute("data-confirm");
      openConfirm(message, function () {
        var isConfig = !!document.querySelector("[data-mode-default]");
        if (isConfig) saveConfig();
        var href = target.getAttribute("href");
        if (href && href !== "#") {
          window.location.href = href;
          return;
        }
        toast(
          isConfig
            ? "Đã lưu cấu hình đợt đăng ký cho sinh viên."
            : "Đã xác nhận: " + message
        );
      });
    });
  }

  function init() {
    bindConfirm();
    bindFilters();
    bindTimetable();
    updateTitles();
    applyMode();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.G8Store = Store;
  window.G8SaveConfig = saveConfig;
  window.G8CurrentMode = currentMode;
})();
