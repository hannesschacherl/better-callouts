const a = require("obsidian");

class ColorPickerModal extends a.SuggestModal {
  constructor(app, options, onChoose) {
    super(app);
    this.options = options;
    this.onChoose = onChoose;
  }

  getSuggestions(query) {
    return this.options.filter((opt) =>
      opt.label.toLowerCase().includes(query.toLowerCase())
    );
  }

  renderSuggestion(item, el) {
    const container = el.createDiv({ cls: "color-suggestion-item" });
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "8px";

    const colorBox = container.createDiv();
    colorBox.style.width = "40px";
    colorBox.style.height = "20px";
    colorBox.style.borderRadius = "4px";
    colorBox.style.background = item.color;
    colorBox.style.border = "1px solid #888";

    if (item.hasBorder && item.borderColor) {
      colorBox.style.borderLeft = `10px solid ${item.borderColor}`;
    }

    container.appendText(item.label);
    container.prepend(colorBox);
  }

  onChooseSuggestion(item) {
    this.onChoose(item.value);
  }
}

class ColorCalloutSettingTab extends a.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  async display() {
    const Sortable = (await import("https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/+esm")).Sortable;

    const { containerEl: t } = this;
    t.empty();

    const headerRow = t.createDiv({ cls: "better-callouts-header" });
    const description = headerRow.createDiv();
    description.innerHTML = `<p>For <strong>Documentation</strong> about this Plugin have a look <a href="https://bettercallouts.schacherl.me/" target="_blank" rel="noopener">here</a>`;

    const addButton = headerRow.createEl("button", { text: "+" });
    addButton.classList.add("mod-cta");
    addButton.style.marginLeft = "12px";
    addButton.onclick = async () => {
      const hasEmpty = this.plugin.settings.colors.some(
        (c) =>
          (!c.label?.trim() && !c.value?.trim()) ||
          !c.color ||
          c.color === "#ffffff"
      );
      if (hasEmpty) {
        new a.Notice("Please fill in the existing empty entry first.");
        return;
      }

      const updated = [...this.plugin.settings.colors];
      const newCallout = {
        label: "New",
        value: "c-new",
        color: "var(--color-base-40)",
        textColor: "var(--text-normal)",
        hasBorder: false,
        borderColor: "#000000",
      };
      updated.push(newCallout);
      this.plugin.settings.colors = updated;

      await this.plugin.saveSettings();
      this.display();

      setTimeout(() => {
        const allCallouts = this.containerEl.querySelectorAll(".callout");
        const last = allCallouts[allCallouts.length - 1];
        if (last) {
          last.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);
    };

    const grid = t.createDiv({ cls: "better-callouts-grid" });

    this.plugin.settings.colors.forEach((s, i) => {
      const callout = grid.createDiv();
      callout.classList.add("callout");
      callout.setAttr("data-callout", s.value);
      callout.style.marginBottom = "-5px";
      callout.style.background = s.color;
      callout.style.borderRadius = "20px";
      callout.style.border = "1px solid var(--background-modifier-border)";
      if (s.hasBorder && s.borderColor) {
        callout.style.borderLeft = `16px solid ${s.borderColor}`;
      }

      if (s.value?.trim()) {
        callout.classList.add(s.value);
        callout.setAttr("data-callout", s.value);
      }

      const header = callout.createDiv({ cls: "callout-title" });
      header.style.display = "flex";
      header.style.justifyContent = "space-between";
      header.style.alignItems = "center";
      header.style.color = s.textColor || "#000000";

      const headerText = header.createDiv();
      headerText.setText(`[!${s.value || "unset"}]`);
      headerText.style.fontWeight = "bold";
      headerText.style.fontSize = "25px";

      const trash = header.createEl("button");
      trash.className = "clickable-icon";
      trash.style.marginLeft = "auto";
      trash.setAttr("aria-label", "Delete color");
      trash.innerHTML = `<svg viewBox="0 0 100 100" width="18" height="18"><path fill="currentColor" d="M30 30 L70 70 M70 30 L30 70" stroke-width="10" stroke="currentColor"/></svg>`;
      trash.onclick = async () => {
        const updated = [...this.plugin.settings.colors];
        updated.splice(i, 1);
        this.plugin.settings.colors = updated;
        await this.plugin.saveSettings();
        this.display();
      };

      const content = callout.createDiv({ cls: "callout-content" });
      content.style.color = s.textColor || "#000000";

      const makeField = (label, value, onChange) => {
        const setting = new a.Setting(content)
          .setName(label)
          .addText((text) => {
            text.setValue(value);
            text.onChange(async (v) => {
              await onChange(String(v));
            });
            text.inputEl.style.width = "250px";
            text.inputEl.style.color = s.textColor || "#000000";
            text.inputEl.addClass("callout-input");
          });

        setting.settingEl.style.border = "none";
        setting.settingEl.style.padding = "2px";
        setting.settingEl.style.margin = "0";
        setting.nameEl.style.opacity = "0.8";
        setting.nameEl.style.color = s.textColor || "#000000";
      };

      makeField("Label", s.label, async (val) => {
        const updated = [...this.plugin.settings.colors];
        updated[i] = {
          ...updated[i],
          label: val,
          value:
            (updated[i].hasBorder ? "cb-" : "c-") +
            val.toLowerCase().replace(/\s+/g, "-"),
        };
        this.plugin.settings.colors = updated;

        const v = updated[i].value;
        callout.classList.remove(s.value);
        if (v?.trim()) {
          callout.classList.add(v);
          callout.setAttr("data-callout", v);
          headerText.setText(`[!${v}]`);
        }

        await this.plugin.saveSettings();
      });

      makeField("Color", s.color, async (val) => {
        const updated = [...this.plugin.settings.colors];
        updated[i] = { ...updated[i], color: val };
        this.plugin.settings.colors = updated;
        callout.style.background = val;
        await this.plugin.saveSettings();
      });

      makeField("Text", s.textColor || "#000000", async (val) => {
        const updated = [...this.plugin.settings.colors];
        updated[i] = { ...updated[i], textColor: val };
        this.plugin.settings.colors = updated;

        content.style.color = val;
        header.style.color = val;

        content.querySelectorAll(".setting-item").forEach((el) => {
          el.querySelector(".setting-item-name")?.setCssStyles({ color: val });
          el.querySelector("input")?.setCssStyles({ color: val });
        });

        await this.plugin.saveSettings();
      });

      const borderToggle = new a.Setting(content)
        .setName("Has Border?")
        .addToggle((toggle) => {
          toggle.setValue(s.hasBorder || false).onChange(async (val) => {
            const updated = [...this.plugin.settings.colors];
            updated[i] = {
              ...updated[i],
              hasBorder: val,
              value:
                (val ? "cb-" : "c-") +
                updated[i].label.toLowerCase().replace(/\s+/g, "-"),
            };
            this.plugin.settings.colors = updated;
            await this.plugin.saveSettings();
            this.display();
          });
        });

      borderToggle.settingEl.style.border = "none";
      borderToggle.settingEl.style.padding = "2px";
      borderToggle.settingEl.style.margin = "0";
      borderToggle.nameEl.style.opacity = "0.8";
      borderToggle.nameEl.style.color = s.textColor || "#000000";

      if (s.hasBorder) {
        makeField("Border", s.borderColor || "#000000", async (val) => {
          const updated = [...this.plugin.settings.colors];
          updated[i] = { ...updated[i], borderColor: val };
          this.plugin.settings.colors = updated;
          callout.style.borderLeft = `16px solid ${val}`;
          await this.plugin.saveSettings();
        });
      }
    });

    // 🧩 Make callouts draggable via Sortable.js
    Sortable.create(grid, {
      animation: 150,
      handle: ".callout-title",
      ghostClass: "sortable-ghost",
      onEnd: async (evt) => {
        const newOrder = Array.from(grid.children).map((el) =>
          el.getAttribute("data-callout")
        );
        const reordered = newOrder
          .map((value) =>
            this.plugin.settings.colors.find((c) => c.value === value)
          )
          .filter(Boolean);

        this.plugin.settings.colors = reordered;
        await this.plugin.saveSettings();
      },
    });

    // Optional: add style for dragging
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>
        .sortable-ghost {
          opacity: 0.4;
          background: var(--background-secondary);
          border: 2px dashed var(--color-accent);
        }
      </style>`
    );
  }
}

module.exports = class ColorCalloutPickerPlugin extends a.Plugin {
  async onload() {
    const defaultSettings = { colors: [] };
    this.settings = Object.assign({}, defaultSettings, await this.loadData());

    this.addCommand({
      id: "insert-better-callout",
      name: "Insert Better Callout",
      editorCallback: async (editor) => {
        const modal = new ColorPickerModal(
          this.app,
          this.settings.colors,
          (selected) => {
            if (!selected) return;
            const text = `> [!${selected}] Title\n>Contents `;
            editor.replaceRange(text, editor.getCursor());
          }
        );
        modal.open();
      },
    });

    this.addSettingTab(new ColorCalloutSettingTab(this.app, this));
    await this.generateCalloutCSSFile();
  }

  async generateCalloutCSSFile() {
    // ... unverändert wie bei dir, hier gekürzt
  }

  async saveSettings() {
    // ... ebenfalls wie bei dir
  }
};
