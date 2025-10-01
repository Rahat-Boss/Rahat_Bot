module.exports = {
  config: {
    name: "funnyvideo",
    aliases: ["fv"],
    version: "1.0",
    author: "Akash × ChatGPT",
    countDown: 5,
    role: 0,
    shortDescription: "Watch funny video",
    longDescription: "Watch funny video (costs 10 coins from your balance)",
    category: "entertainment",
    guide: "{p}funnyvideo"
  },

  onStart: async function ({ api, event, usersData }) {
    const { senderID, threadID, messageID } = event;
    const userData = await usersData.get(senderID);

    if (userData.money < 10) {
      return api.sendMessage("📛 পর্যাপ্ত কয়েন নেই (কমপক্ষে 10 কয়েন দরকার)", threadID, messageID);
    }

    // কয়েন কেটে নেওয়া
    await usersData.set(senderID, { 
      money: userData.money - 10, 
      exp: userData.exp, 
      data: userData.data 
    });

    const videos = [
      "https://drive.google.com/uc?export=download&id=1SAALOmQPtcdInvK1FghkzHfn2Yig2CsK",
      "https://drive.google.com/uc?export=download&id=1serqpRO5mVHYpLtoBEOHM7elZrUWggU5",
      "https://drive.google.com/uc?export=download&id=15JqeLaMNh81KstjbJVFs7hVi6Ni1Y39r"
    ];
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    return api.sendMessage({
      body: `😂 মজার ভিডিও হাজির!\n💸 10 কয়েন কেটে নেওয়া হয়েছে\n📌 নতুন Balance: ${userData.money - 10}`,
      attachment: await global.utils.getStreamFromURL(randomVideo)
    }, threadID, messageID);
  }
};
