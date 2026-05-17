mkdir broadcast-bot && cd broadcast-bot && cat << 'EOF' > index.js
const http = require('http');
const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');

http.createServer((req, res) => {
   res.write("Broadcast Bot is alive!");
   res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const prefix = "!"; 

client.once('ready', () => {
    console.log(`[✔] تم تشغيل بوت النشر بنجاح باسم: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'bc' || command === 'broadcast') {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply("❌ عذراً يا غالي، هذا الأمر مخصص للمسؤولين فقط!");
        }

        const broadcastMessage = args.join(' ');
        if (!broadcastMessage) return message.reply("❌ اكتب الكلام أو العرض بعد الأمر! مثال:\n`!bc أهلاً بكم...`");

        await message.guild.members.fetch();
        const members = message.guild.members.cache.filter(member => !member.user.bot);

        message.reply(`📢 جاري بدء النشر إلى **${members.size}** عضو...`);

        let successCount = 0;
        let failCount = 0;

        for (const [id, member] of members) {
            try {
                await member.send(broadcastMessage);
                successCount++;
            } catch (error) {
                failCount++;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        message.channel.send(`✅ **اكتملت عملية النشر بنجاح!**\n\n🔹 تم الإرسال إلى: \`${successCount}\` عضو.\n🔸 فشل الإرسال إلى: \`${failCount}\` عضو.`);
    }
});

// ضع توكن البوت الجديد هنا داخل القوسين
client.login('MTUwNTYyMTQ5MjkyOTY1OTA0MQ.GNptnx.CahwztzAdSUz84w9O1sTJ7zXBvDxcDBqLgT0D4');
EOF
