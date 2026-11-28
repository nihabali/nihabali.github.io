window.DATA = window.DATA || {};
// Main website settings. Edit freely.
window.DATA.site = {
  websiteUrl: "https://nihabali.github.io/",
  defaultLang: "en",              // "en" or "bn"
  enabledSections: ["contact", "about", "tech", "anime", "movies", "music", "dreams", "gallery"],
  socialPreviewImage: "assets/images/social/og-preview.jpg",
  title: { en: "Nihab Ali — Tech Enthusiast & Open-Source Explorer", bn: "নিহাব আলি — প্রযুক্তি ও ওপেন-সোর্স অনুসন্ধানী" },
  ui: {
    nav: { about: { en: "About", bn: "পরিচিতি" }, tech: { en: "Open Source", bn: "ওপেন-সোর্স" }, anime: { en: "Anime", bn: "অ্যানিমে" }, movies: { en: "Movies", bn: "মুভি" }, music: { en: "Music", bn: "গান" }, dreams: { en: "Dreams", bn: "স্বপ্ন" }, gallery: { en: "Gallery", bn: "গ্যালারি" }, online: { en: "Find me online", bn: "অনলাইনে আমি" }, contact: { en: "Contact", bn: "যোগাযোগ" } },
    watching: { en: "Currently watching", bn: "এখন দেখছি" }, topRated: { en: "My highest rated", bn: "আমার সবচেয়ে প্রিয়" },
    completed: { en: "Completed", bn: "শেষ করেছি" }, planning: { en: "Plan to watch", bn: "দেখার তালিকায়" },
    visit: { en: "Visit", bn: "দেখুন" }, prev: { en: "Previous", bn: "আগের" }, next: { en: "Next", bn: "পরের" }, find: { en: "Find me online", bn: "অনলাইনে আমি" }, explore: { en: "Explore", bn: "সূচি" }, privacy: { en: "Privacy", bn: "গোপনীয়তা" },
    privacyText: { en: "This site has no analytics, no cookies and no contact form. Your browser keeps only your language, theme and color choices and a small anime cache on your own device. Anime titles and posters load from AniList, song thumbnails from YouTube, movie lists and posters from TMDB (when enabled) and fonts from Google Fonts, so those services can see that you visited. My phone number and email are public because I chose to share them.", bn: "এই সাইটে কোনো অ্যানালিটিক্স, কুকি বা কন্টাক্ট ফর্ম নেই। আপনার ব্রাউজারে শুধু ভাষা, থিম ও রঙের পছন্দ আর অ্যানিমের একটি ছোট ক্যাশ আপনার নিজের ডিভাইসে থাকে। অ্যানিমের নাম ও পোস্টার AniList থেকে, গানের থাম্বনেইল YouTube থেকে, মুভি লিস্ট ও পোস্টার TMDB থেকে (চালু থাকলে) এবং ফন্ট Google Fonts থেকে আসে, তাই ওই সার্ভিসগুলো আপনার ভিজিট দেখতে পারে। আমার ফোন নম্বর ও ইমেইল আমি নিজেই প্রকাশ্যে দিয়েছি।" },
    hindiNote: { en: "A few from the playlist", bn: "প্লেলিস্টের কয়েকটি" }, tmdb: { en: "This product uses the TMDB API but is not endorsed or certified by TMDB.", bn: "This product uses the TMDB API but is not endorsed or certified by TMDB." }, movieFail: { en: "Movie lists could not be loaded right now.", bn: "এই মুহূর্তে মুভি লিস্ট লোড করা যায়নি।" }, ytNote: { en: "Playlist data via YouTube API Services.", bn: "Playlist data via YouTube API Services." }, interests: { en: "Interests", bn: "আগ্রহ" }, bdTime: { en: "Bangladesh time", bn: "বাংলাদেশের সময়" }, now: { en: "Now", bn: "এখন" }, watchingNow: { en: "Watching", bn: "দেখছি" }, years: { en: "years exploring open-source Android apps", bn: "বছর ধরে ওপেন-সোর্স অ্যান্ড্রয়েড অ্যাপ ঘাঁটছি" }, builtWith: { en: "Built with HTML, CSS & JavaScript", bn: "HTML, CSS ও JavaScript দিয়ে বানানো" }, openAnilist: { en: "Open my AniList", bn: "আমার AniList দেখুন" }, animeFail: { en: "Titles could not be loaded right now. Please visit my AniList profile.", bn: "এই মুহূর্তে নামগুলো লোড করা যায়নি। আমার AniList প্রোফাইলে দেখুন।" },
    songs: { en: "songs", bn: "টি গান" }, openPlaylist: { en: "Open playlist", bn: "প্লেলিস্ট খুলুন" }, faves: { en: "Favourites in this playlist", bn: "এই প্লেলিস্টে প্রিয়" },
    call: { en: "Call me", bn: "কল করুন" }, whatsapp: { en: "WhatsApp message", bn: "WhatsApp-এ মেসেজ" }, email: { en: "Send an email", bn: "ইমেইল পাঠান" },
    contactNote: { en: "The easiest way to reach me is a call, a WhatsApp message or an email.", bn: "আমার সঙ্গে যোগাযোগের সহজ উপায়: কল, WhatsApp বা ইমেইল।" }, phoneLabel: { en: "Phone", bn: "ফোন" }, waLabel: { en: "WhatsApp", bn: "WhatsApp" }, mailLabel: { en: "Email", bn: "ইমেইল" },
    top: { en: "Back to top", bn: "ওপরে যান" }, palette: { en: "Color palette", bn: "রঙের থিম" },
    palNames: { green: { en: "Green", bn: "সবুজ" }, ocean: { en: "Ocean", bn: "সমুদ্র" }, sunset: { en: "Sunset", bn: "সূর্যাস্ত" }, violet: { en: "Violet", bn: "বেগুনি" }, rose: { en: "Rose", bn: "গোলাপি" }, mono: { en: "Mono", bn: "সাদা-কালো" } },
    theme: { en: "Toggle theme", bn: "থিম বদলান" }, menu: { en: "Menu", bn: "মেনু" }, close: { en: "Close", bn: "বন্ধ করুন" }, skip: { en: "Skip to content", bn: "মূল অংশে যান" }
  }
};
