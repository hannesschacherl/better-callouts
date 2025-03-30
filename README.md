# Better Callouts Documentation

Docs also available on [Better Callouts Documentation](https://bettercallouts.schacherl.me).

`Better Callouts` is an Obsidian plugin that lets you create, edit, and manage custom callout styles visually — no CSS knowledge needed. It handles everything for you, including automatic snippet generation.


---

## ✨ Features

- 🎨 Visual editor for creating callouts
- 🧠 Custom color, text color, and optional border for the callouts
- 💾 Generates valid Obsidian CSS snippets
- 🔄 Automatically keeps `.obsidian/snippets/betterCallouts.css` up to date
- ⚡ Templater integration for easy inserting custom callouts in notes

---

## 🚀 How to Use

### 1. Enable the Plugin

1. Copy the plugin folder to `.obsidian/plugins/better-callouts`
2. Enable it in **Settings → Community Plugins**
3. Add a new Callout (this makes the plugin compile everything into the `CSS-File`)
4. Go to `Settings → Appearance` Scroll down to `CSS-Snippets`
5. Enable `BetterCallouts` (This adds all styles created by the plugin to your notes)

If you use `Obsidian Publish:`
- Add the changes from the `.obsidian/snippets/betterCallouts.css` to your `publish.css` file for them to work on the published Obsidian

---

### 2. Create a New Callout

1. Go to **Settings → Better Callouts**
2. Click the **`+`** button to add a new callout
3. Go down to the last Callout (your new created)
4. Fill out the following fields:
   - **Label**: Name of the callout (e.g. "Important")
   - **Color**: Background color `(any valid CSS code will work in here)`
   - **Text**: Text color `(any valid CSS code will work in here)`
   - **Border**: (optional) Enable and set a left border color
   - **Border Color:** (only if Border is set to yes) Add a color for the border `(any valid CSS code will work in here)`
1. The callout preview will update in real time.
2. Your callout will be saved automatically and added to the generated CSS snippet.

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

**plugins > better-callouts:** here is the logic for everything this plugin does
**snippets > betterCallouts.css:** this is the automatically generated `CSS-File`

### Templater Integration
Once you've done all steps above you can fully enjoy the custom Callouts but you need to add them manually like this:
```md
> [!c-my-callout] Title
> Content
```

If you want to make this process better you can:
- install the plugin `Templater` via the `Community Plugins` Tab.
- Set your Templates folder in the `Templater Settings`
- Create a new file in the Templates folder
- Call my plugins `API` inside a Templater block, that inserts the Callout like this:

```txt
<%*
const selected = await app.plugins.plugins["better-callouts"]
.api.getSelectedColorAsync();

if (selected) {
  tR += `> [!${selected}]\n> `;
}
%>
```

**What this does:**
- Opens a Menu that displays the Callout's colors and their name for you to choose from
- If you've chosen one, Templater will insert a blank callout with the chosen `custom callout` into your file
