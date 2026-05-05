# Mattermost RTL & Telegram Style

یک پلاگین برای Mattermost که بخش گفتگو در کانال‌ها را به سبک تلگرام تبدیل می‌کند و از متن راست‌به‌چپ (فارسی، عربی، عبری) پشتیبانی می‌کند.

A Mattermost plugin that transforms channel chat into Telegram-style bubbles with full RTL (Persian / Arabic / Hebrew) text support.

---

## ✨ ویژگی‌ها / Features

| ویژگی | توضیح |
|-------|-------|
| 💬 **حباب‌های تلگرام‌مانند** | پیام‌های شما در سمت راست، پیام‌های دیگران در سمت چپ |
| 🔄 **RTL خودکار** | تشخیص خودکار متن فارسی / عربی / عبری و تنظیم جهت راست‌به‌چپ |
| 🌐 **دو‌زبانه** | پشتیبانی کامل از متون مخلوط فارسی و لاتین |
| 🎨 **سازگار با تم** | از متغیرهای رنگی Mattermost استفاده می‌کند — با همه تم‌ها کار می‌کند |
| 📝 **Markdown کامل** | تمام قابلیت‌های Markdown موجود در Mattermost حفظ می‌شود |
| ⚡ **بدون تغییر فونت** | فونت دست‌نخورده باقی می‌ماند (قابل ترکیب با پلاگین فونت) |
| 🖱️ **دکمه‌های Hover بدون تداخل** | دکمه‌های reaction و reply همیشه خارج از ناحیه متن قرار می‌گیرند |

---

## 📸 پیش‌نمایش / Preview

```
┌─────────────────────────────────────────┐
│                                         │
│  🟦 Ali                                 │
│  ┌──────────────────────┐               │
│  │ سلام! چطوری؟         │               │
│  └──────────────────────┘               │
│                        ┌─────────────┐  │
│                        │ خوبم، ممنون │  │
│                        └─────────────┘  │
│                                         │
│  🟦 Sara                                │
│  ┌──────────────────────────────────┐   │
│  │ Hello! How is everyone doing?    │   │
│  └──────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔧 نصب / Installation

### پیش‌نیاز / Requirements

- Mattermost Server **7.0.0** یا بالاتر
- Node.js **16+** و npm (برای ساخت از سورس)

### روش ۱: ساخت از سورس / Build from Source

```bash
# Clone the repository
git clone https://github.com/hadikhanian/mattermost-rtl.git
cd mattermost-rtl

# Build the plugin package
make build

# Output: mattermost-rtl-plugin-1.0.0.zip
```

### روش ۲: آپلود Release آماده / Use Pre-built Release

از صفحه [Releases](https://github.com/hadikhanian/mattermost-rtl/releases) آخرین فایل `.zip` را دانلود کنید.

### نصب در Mattermost

1. وارد **System Console** شوید
2. به **Plugin Management** بروید
3. روی **Upload Plugin** کلیک کنید و فایل `.zip` را آپلود کنید
4. پلاگین را **فعال (Enable)** کنید

---

## ⚙️ تنظیمات / Settings

در **System Console → Plugins → Mattermost RTL & Telegram Style**:

| تنظیم | پیش‌فرض | توضیح |
|--------|---------|-------|
| Enable RTL Text Detection | **✅ روشن** | تشخیص و تنظیم خودکار جهت متن RTL |
| Enable Telegram-style Chat Bubbles | **✅ روشن** | نمایش پیام‌ها به صورت حباب تلگرام‌مانند |

---

## 🎨 طراحی بصری / Visual Design

### ساختار پیام / Message Structure

```
دیگران (Others):
[👤 Avatar] [╔══════════════╗]  [action buttons →]
            [║ پیام دیگران  ║]
            [╚══════════════╝]

خودم (Me):
[← action buttons] [╔══════════════╗]  [👤 hidden]
                   [║   پیام من    ║]
                   [╚══════════════╝]
```

### رنگ‌بندی / Color Scheme

- **پیام‌های دیگران**: پس‌زمینه `--center-channel-bg` (سفید در تم روشن، تیره در تم تاریک)
- **پیام‌های خودتان**: همان پس‌زمینه + ۱۴٪ رنگ accent تم (`--button-bg`)
- تمام رنگ‌ها از متغیرهای CSS Mattermost گرفته می‌شوند — تغییر تم خودکار اعمال می‌شود

### دکمه‌های Hover / Hover Actions

دکمه‌های reaction، reply و سایر اقدامات:
- برای **پیام‌های دیگران**: در سمت **راست** حباب ظاهر می‌شوند
- برای **پیام‌های خودتان**: در سمت **چپ** حباب ظاهر می‌شوند

→ در هر دو حالت، دکمه‌ها **هرگز روی متن** قرار نمی‌گیرند.

---

## 🔤 پشتیبانی RTL / RTL Support

### تشخیص خودکار

پلاگین متن هر پیام را بررسی می‌کند:
- اگر اولین کاراکتر قوی **فارسی / عربی / عبری** باشد → `direction: rtl`
- اگر اولین کاراکتر قوی **لاتین** باشد → `direction: ltr`
- متون خنثی → مرورگر جهت را تعیین می‌کند (`unicode-bidi: plaintext`)

### موارد خاص

| محتوا | رفتار |
|-------|-------|
| متن فارسی ساده | RTL کامل |
| متن انگلیسی ساده | LTR کامل |
| متن مخلوط فارسی-انگلیسی | جهت بر اساس اولین کاراکتر قوی |
| بلوک‌های کد (```` ``` ````) | همیشه LTR (کد باید LTR بماند) |
| کد inline (`` `code` ``) | همیشه LTR |
| جداول Markdown | RTL برای سطرها، LTR برای محتوای کد |

---

## 🧩 سازگاری / Compatibility

- ✅ Mattermost 7.x, 8.x, 9.x
- ✅ تم‌های روشن و تاریک (Light / Dark)
- ✅ تم‌های سفارشی (از CSS variables استفاده می‌شود)
- ✅ قابل ترکیب با پلاگین‌های فونت فارسی
- ✅ حالت Collapsed Threads
- ✅ پیام‌های متوالی (Combined posts)
- ✅ پیام‌های سیستمی (نمایش مرکزی، بدون حباب)

---

## 🛠️ توسعه / Development

```bash
# Clone
git clone https://github.com/hadikhanian/mattermost-rtl.git
cd mattermost-rtl

# Install dependencies
cd webapp && npm install && cd ..

# Watch mode (rebuilds on file change)
make dev

# Production build + package
make build

# Clean all build artifacts
make clean
```

### ساختار پروژه / Project Structure

```
mattermost-rtl/
├── plugin.json                  # Plugin manifest & settings schema
├── Makefile                     # Build commands
├── README.md
└── webapp/
    ├── package.json
    ├── webpack.config.js
    └── src/
        ├── index.jsx            # Plugin entry point
        ├── plugin.jsx           # Plugin class (initialize / uninitialize)
        ├── utils/
        │   └── rtl.js           # MutationObserver + RTL detection logic
        └── styles/
            └── main.css         # Telegram bubble layout + RTL CSS
```

---

## 🤝 مشارکت / Contributing

Pull Request خوش‌آمد است!

1. Fork کنید
2. یک branch جدید بسازید: `git checkout -b feature/my-feature`
3. تغییرات را Commit کنید: `git commit -m 'Add some feature'`
4. Push کنید: `git push origin feature/my-feature`
5. یک Pull Request باز کنید

---

## 📄 مجوز / License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🐛 گزارش مشکل / Report Issues

[GitHub Issues](https://github.com/hadikhanian/mattermost-rtl/issues)
