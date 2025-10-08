const moment = require('moment-timezone');
const axios = require('axios');

module.exports = {
  config: {
    name: "intro",
    aliases: ["inf", "in4"],
    version: "1.0",
    author: "Saim",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Displays Owner Intro with a random caption and video"
    },
    longDescription: {
      en: "Shows the owner's details, one random caption, and a video."
    },
    category: "Information",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    this.sendInfo(message);
  },

  onChat: async function ({ event, message }) {
    if (event.body && ["intro", "inf", "in4"].includes(event.body.toLowerCase())) {
      this.sendInfo(message);
    }
  },

  sendInfo: async function (message) {
    const now = moment().tz('Asia/Dhaka');
    const time = now.format('h:mm:ss A');

    const captions = [
      "❝ 🤫 Silence speaks louder than words. ❞",
      "❝ ✨ Be yourself, everyone else is already taken. ❞",
      "❝ 🔮 The best way to predict the future is to create it. ❞",
      "❝ 💭 Dreams don’t work unless you do. ❞",
      "❝ 🛠️ Don’t wait for opportunity, create it. ❞",
      "❝ ⏳ Every day is a second chance. ❞",
      "❝ 🧠 Life is tough, but so are you. ❞",
      "❝ 🧩 Success is the sum of small efforts, repeated daily. ❞",
      "❝ 🌈 Don’t just exist, live. ❞",
      "❝ 🧠 The only limit is your mind. ❞",
      "❝ 🎯 Take the risk or lose the chance. ❞",
      "❝ 🔥 Be fearless in the pursuit of what sets your soul on fire. ❞",
      "❝ ⚡ Don’t stop when you’re tired. Stop when you’re done. ❞",
      "❝ ☔ Don’t wait for the storm to pass, learn to dance in the rain. ❞"
    ];

    const randomCaption = captions[Math.floor(Math.random() * captions.length)];

    const body = `
┏━━━━━━━━━━━━━━━┓
┃   🌟 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🌟    
┣━━━━━━━━━━━━━━━┫
┃👤 𝐍𝐚𝐦𝐞      :🔰𝗥𝗮𝗵𝗮𝘁🔰
┃🚹 𝐆𝐞𝐧𝐝𝐞𝐫    : 𝐌𝐚𝐥e
┃🎂 𝐀𝐠𝐞       :16
┃🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧  : 𝐈𝐬𝐥𝐚𝐦
┃🏫 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 :বয়ড়া ইসরাইল 
┃𝐀𝐝𝐝𝐫𝐞𝐬𝐬:জামালপুর,বাংলাদেশ 
┣━━━━━━━━━━━━━━━┫
┃𝐓𝐢𝐤𝐭𝐨𝐤 : @where.is.she15
┃📢 𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦 :আছে🥴🤪
┃🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : বায়ো-তে আছে
┣━━━━━━━━━━━━━━━┫
┃ 🕒 𝐔𝐩𝐝𝐚𝐭𝐞𝐝 𝐓𝐢𝐦𝐞:  ${time}
┗━━━━━━━━━━━━━━━┛

`;

    const videoUrl = "https://graph.facebook.com/61581900625860/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";

    try {
      const response = await axios.get(videoUrl, { responseType: 'stream' });

      setTimeout(() => {
        message.reply({
          body,
          attachment: response.data
        });
      }, 5000);
    } catch (err) {
      message.reply("⚠️ Failed to load video. Please try again later.");
    }
  }
};
