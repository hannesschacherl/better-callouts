# Better Callouts Documentation

Docs also available on [Better Callouts Documentation](https://bettercallouts.schacherl.me).

`Better Callouts` is an Obsidian plugin that lets you create, edit, and manage custom callout styles visually — no CSS knowledge needed. It handles everything for you, including automatic snippet generation.

## ✨ Features

- 🎨 Visual editor for creating callouts
- 🧠 Custom color, text color, and optional border for the callouts
- 💾 Generates valid Obsidian CSS snippets
- 🔄 Automatically keeps `.obsidian/snippets/betterCallouts.css` up to date

---

## 🚀 How to Use

### 1. Enable the Plugin

- Copy the plugin folder to `.obsidian/plugins/better-callouts`
-  Enable it in **Settings → Community Plugins**
- Add a new Callout (this makes the plugin compile everything into the `CSS-File`)
- Go to `Settings → Appearance` Scroll down to `CSS-Snippets`
- Enable `BetterCallouts` (This adds all styles created by the plugin to your notes)

If you use `Obsidian Publish:`
- Add the changes from the `.obsidian/snippets/betterCallouts.css` to your `publish.css` file for them to work on the published Obsidian
- I would recommend setting up a file watcher that watches the `.obsidian/snippets/` folder and runs a shell script to merge the files into your `publish.css` when detecting changes


---

### 2. Create a New Callout

- Go to **Settings → Better Callouts**
- Click the **+** button to add a new callout
- Go down to the last Callout (your new created)
- Fill out the following fields:
   - **Label**: Name of the callout (e.g. "Important")
   - **Color**: Background color
   - **Text**: Text color
   - **Border**: (optional) Enable and set a left border color
   - **Border Color:** (only if Border is set to yes) Add a color for the border
- The callout preview will update in real time.
- Your callout will be saved automatically and added to the generated CSS snippet.

**Accepted colors:**
- Named colors (e.g. `red`, `blue`, `darkgreen`)
- HEX values (e.g. `#ffcc00`, `#123456`)
- RGB and RGBA (e.g. `rgb(255, 0, 0)`, `rgba(0, 128, 255, 0.2)`)
- HSL and HSLA (e.g. `hsl(200, 100%, 50%)`, `hsla(0, 100%, 50%, 0.5)`)
- Obsidian variables (e.g. `var(--text-accent)`, `var(--color-base-40)`)

---

### 3. Where Is everything?

The Plugin uses the following files:

```plaintext
Vault
├── .obsidian
│   ├── plugins
│   │   ├── better-callouts
│   │   │   ├── data.json
│   │   │   ├── main.js
│   │   │   └── manifest.json
│   ├── snippets
│   │   ├── betterCallouts.css
```

`plugins > better-callouts > main.js:` here is the logic for everything this plugin does

`plugins > better-callouts > data.json:` here are all your custom callouts stored

`plugins > better-callouts > manifest.json:` tells obsidian information about this plugin

`snippets > betterCallouts.css:` this is the automatically generated `CSS-File`

### Inserting templates
Nice! Now You've set up the plugin to work for all your custom callouts.

You can insert them into your file using code like this:
```md
> [!c-my-callout] Title
> Content
```
The `[!c-my-callout]` for the callout you want to add is displayed in the settings screen of this plugin.

If you want an even easier way for inserting the callouts you can:
- press `CTRL / CMD` + `P` (to open the command palette)
- search for `Better Callouts: Insert better callout` (only works when in edit mode)
- select the callout you want to insert from the modal