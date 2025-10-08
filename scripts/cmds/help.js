const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    version: "3.0",
    role: 0,
    countdown: 0,
    author: "ST | Sheikh Tamim", // 🔒 ক্রেডিট অপরিবর্তিত
    description: "Displays available commands, categories and details.",
    category: "help",
  },

  onStart: async ({ api, event, args }) => {
    const cmdsFolderPath = path.join(__dirname, ".");
    const files = fs.readdirSync(cmdsFolderPath).filter(f => f.endsWith(".js"));

    const sendMessage = async (msg) => {
      try {
        return await api.sendMessage(msg, event.threadID);
      } catch (e) {
        console.error("Send error:", e);
      }
    };

    // Collect categories dynamically
    const getCategories = () => {
      const cats = {};
      for (const file of files) {
        try {
          const cmd = require(path.join(cmdsFolderPath, file));
          if (!cmd.config) continue;
          const cat = cmd.config.category || "Uncategorized";
          if (!cats[cat]) cats[cat] = [];
          cats[cat].push(cmd.config.name);
        } catch (e) {
          console.error("Error in file:", file, e);
        }
      }
      return cats;
    };

    try {
      // ========== CATEGORY VIEW ==========
      if (args.length > 1 && args.includes("|")) {
        const pipeIndex = args.indexOf("|");
        const catName = args.slice(pipeIndex + 1).join(" ").toLowerCase();
        const categories = getCategories();
        const match = Object.keys(categories).find(c => c.toLowerCase() === catName);

        if (match) {
          const cmds = categories[match];
          let msg = `╭─『 📂 CATEGORY: ${match} 』\n`;
          msg += `│ ✦ ${cmds.join("  ✦ ")}\n`;
          msg += `╰───────────────────◊\n`;
          msg += `✅ Total ${match}: ${cmds.length} commands`;
          return await sendMessage(msg);
        } else {
          return await sendMessage(`❌ Category not found: ${catName}`);
        }
      }

      // ========== SINGLE COMMAND INFO ==========
      if (args[0]) {
        const name = args[0].toLowerCase();
        const commands = files.map(f => require(path.join(cmdsFolderPath, f)));
        const cmd = commands.find(
          c =>
            c.config?.name?.toLowerCase() === name ||
            (c.config?.aliases && c.config.aliases.map(a => a.toLowerCase()).includes(name))
        );

        if (cmd) {
          const conf = cmd.config;
          let info = `╭───────────────────◊\n`;
          info += `│ ⚡ COMMAND: ${conf.name}\n`;
          info += `├───────────────────◊\n`;
          info += `│ 📝 Version: ${conf.version || "N/A"}\n`;
          info += `│ 👤 Author: ${conf.author || "Unknown"}\n`;
          info += `│ 🔐 Role: ${conf.role ?? "N/A"}\n`;
          info += `│ 📂 Category: ${conf.category || "Uncategorized"}\n`;
          if (conf.aliases?.length) info += `│ 🔄 Aliases: ${conf.aliases.join(", ")}\n`;
          if (conf.countDown !== undefined) info += `│ ⏱️ Cooldown: ${conf.countDown}s\n`;
          info += `├───────────────────◊\n`;

          // Descriptions
          if (conf.description) {
            const desc = typeof conf.description === "string" ? conf.description : conf.description.en || "";
            if (desc) info += `│ 📋 Description:\n│ ${desc}\n├───────────────────◊\n`;
          }
          if (conf.shortDescription) {
            const sdesc = typeof conf.shortDescription === "string" ? conf.shortDescription : conf.shortDescription.en || "";
            if (sdesc) info += `│ 📄 Short:\n│ ${sdesc}\n├───────────────────◊\n`;
          }
          if (conf.longDescription) {
            const ldesc = typeof conf.longDescription === "string" ? conf.longDescription : conf.longDescription.en || "";
            if (ldesc) info += `│ 📖 Long:\n│ ${ldesc}\n├───────────────────◊\n`;
          }

          // Guide
          const guide = conf.guide ? (typeof conf.guide === "string" ? conf.guide : conf.guide.en || "") : "";
          info += `│ 📚 Usage:\n│ ${guide.replace(/{pn}/g, `/${conf.name}`) || "No guide"}\n`;
          info += `╰───────────────────◊\n`;
          info += `   🔰𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘁🔰Command Info`;

          return await sendMessage(info);
        } else {
          return await sendMessage(`❌ Command not found: ${name}`);
        }
      }

      // ========== FULL HELP ==========
      const categories = getCategories();
      let help = "╭────────『🔰𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘁🔰』────────◊\n\n";
      for (const cat in categories) {
        help += `╭─ ${cat.toUpperCase()} (${categories[cat].length})\n`;
        help += `│ ✦ ${categories[cat].join(" ✦ ")}\n`;
        help += "╰─────────────────────◊\n\n";
      }
      help += "╭─────────────◊\n";
      help += "│ 💡 Tips:\n";
      help += "│ • /help <cmd>\n";
      help += "│ • /help | <category>\n";
      help += "│👉আমার বস:m.me/61581900625860\n";
      help += "╰─────────────◊\n";
      help += "         「 🔰𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘁🔰 」";

      return await sendMessage(help);

    } catch (err) {
      console.error("Help error:", err);
      return await sendMessage("⚠️ Error while generating help.");
    }
  },
};
