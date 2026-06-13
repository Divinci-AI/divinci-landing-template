import type { UIStrings } from "./en";

/**
 * Turkish (tr). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const tr: UIStrings = {
  meta: {
    title: "DrFurman.ai — Yapay zeka destekli Nutritarian rehberliği, 24/7",
    description:
      "Tüm külliyatıyla eğitilmiş Dr. Fuhrman yapay zekasıyla sohbet edin: 12 kitap, tüm video dersleri, 20,000+ üye sorusu ve 180 ürünün tamamı. Gemini 3.5 Flash'ın konuştuğu her dilde 24/7 erişilebilir.",
    ogTitle: "DrFurman.ai — Yapay zeka destekli Nutritarian rehberliği, 24/7",
    ogDescription:
      "Dr. Joel Fuhrman'ın eksiksiz çalışmalarıyla eğitilmiş bir asistanla 24/7 sohbet edin.",
    ogImageAlt:
      "Dr. Fuhrman AI — her kitap, her ders, her cevap.",
    twitterTitle: "DrFurman.ai — Yapay zeka destekli Nutritarian rehberliği, 24/7",
    twitterDescription:
      "Dr. Joel Fuhrman'ın eksiksiz çalışmalarıyla eğitilmiş bir asistanla 24/7 sohbet edin.",
  },

  nav: {
    chat: "Yapay zeka ile sohbet et",
    corpus: "Neler biliyor",
    examples: "Örnekler",
    comingSoon: "Çok yakında",
    language: "Dil",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "drfuhrman.com üyesi misiniz?",
    memberLoginCta: "Giriş yapın",
    headline: "Her kitap. Her ders. Her cevap.",
  },

  corpus: {
    headline: "Dr. Fuhrman'ın{br}kırk yıllık araştırması üzerine kurulu.",
    subheading:
      "DFO yapay zekası tahmin yürütmez — Dr. Fuhrman'ın gerçek külliyatından yanıt verir.",
    stats: {
      everyWord: "Her",
      lecturesUnit: "video dersi",
      lecturesFlavor:
        "Dr. Fuhrman'ın verdiği her kayıtlı ders, indekslenmiş ve sade bir dille yanıtlanabilir.",
      booksUnit: "kitap",
      booksFlavor:
        "Dr. Fuhrman'ın Eat to Live'dan Fast Food Genocide'a kadar eksiksiz yayımlanmış kütüphanesi.",
      qasUnit: "üye sorusu",
      qasFlavor:
        "Dr. Fuhrman'ın yıllar içinde Member Center topluluğuna bizzat verdiği yanıtlar.",
      productsUnit: "ürün",
      productsFlavor:
        "DrFuhrman.com'daki her takviye ve ürün, eksiksiz içerik ve özellik verileriyle.",
    },
    languagePrefix:
      "Gemini 3.5 Flash'ın desteklediği her dilde konuşur",
    videoAriaLabel:
      "Sıcak ahşap bir masanın üzerinde açık, ciltli bir sağlık kitabı; etrafında taze brokoli, kara lahana, yaban mersini, ceviz ve bir sohbet arayüzü gösteren bir akıllı telefon",
  },

  examples: {
    headline: "DFO yapay zekasına gerçek bir soru sormayı deneyin.",
    description:
      "Yukarıdaki sohbete eklemek için herhangi bir soruya tıklayın — giriş alanınız odağı alır, böylece göndermek için {kbd}Enter{/kbd} tuşuna basabilirsiniz.",
    questions: [
      "Nutritarian beslenmeye başlamanın en basit yolu nedir?",
      "Bana insülin duyarlılığından bahset.",
      "Dr. Fuhrman yüksek tansiyon için ne önerir?",
      "5 günlük bir Nutritarian meydan okumasını nasıl yaparım?",
      "Turpgiller ve yeşil yapraklı sebzeler arasındaki fark nedir?",
      "Dr. Fuhrman'ın kitaplarından hangisini önce okumalıyım?",
    ],
    ctaHint: "Sohbete ekle →",
    videoAriaLabel:
      "Güneşli bir mutfakta, bir kase böğürtlen ve taze yeşilliklerin üzerinde akıllı telefonundan DFO yapay zekasına bakan bir kişi",
  },

  chat: {
    welcomeMessage:
      "Merhaba, ben Dr. Joel Fuhrman'ın yapay zekasıyım. Sağlığınızın kontrolünü yeniden ele almanıza yardımcı olmak için buradayım — son zamanlarda aklınızda ne var?",
    starters: [
      "Merhaba, Dr. Fuhrman AI. Daha sağlıklı bir yaşam tarzına başlamak için atabileceğim adımları bana anlatır mısın?",
      "Merhaba Dr. Fuhrman AI, Nutritarian'ın ne olduğunu bana anlatır mısın?",
      "Merhaba Dr. Fuhrman AI. Bana insülin duyarlılığından bahseder misin?",
    ],
    tryAsking: "Sormayı deneyin",
    emailLabel: "Önce, e-postanız nedir?",
    emailLabelValid: "E-postanız",
    emailAriaLabel: "E-postanız",
    emailPlaceholderSticky: "Önce, sohbete başlamak için e-postanız…",
    askButton: "Sor",
    questionPlaceholder: "Sorunuzu yazın…",
    questionAriaLabel: "Dr. Fuhrman AI'ya sorun",
    questionPlaceholderSticky:
      "Dr. Fuhrman AI'ya sorun — beslenme, hastalıkları tersine çevirme, kilo verme…",
    sendAriaLabel: "Mesaj gönder",
    disclaimer: [
      "Önemli bilgileri iki kez kontrol edin.",
      "Tıbbi tavsiyenin yerini tutmaz.",
      "Yapay zeka hata yapabilir.",
    ],
    errorEmailRequired:
      "Sohbete başlamak için lütfen yukarıya e-postanızı girin.",
    errorEmailInvalid: "Lütfen geçerli bir e-posta adresi girin.",
    errorEmailTooLong: "E-posta çok uzun.",
    errorDisposable:
      "Lütfen kalıcı bir e-posta adresi kullanın — geçici posta kutuları desteklenmez.",
    errorNetwork:
      "Ağ hatası — bu mesaj iletilemedi. Lütfen tekrar deneyin.",
    quotaExhaustedNudge:
      "Ücretsiz mesajınızı kullandınız — Dr. Fuhrman'ın yapay zekasıyla konuşmaya devam edin.",
    signupHeadline: "Dr. Fuhrman'ın yapay zekasıyla konuşmaya devam etmek ister misiniz?",
    signupBody:
      "Sohbete devam edin — ve eksiksiz Nutritarian üyelik deneyiminin kilidini açın — DrFuhrman.com'da.",
    signupButton: "DrFuhrman.com'da kaydolun",
  },

  transcript: {
    heading: "Gerçek cevaplar, doğrudan külliyattan",
    subheading:
      "Dr. Fuhrman AI ile gerçek bir konuşma — her yanıt, tam kaynakları gösterilerek, kendi kitaplarına, derslerine ve programlarına dayandırılmıştır. Tamamını okumak için kaydırın.",
    online: "Çevrimiçi",
    assistantLabel: "Asistan",
    recommendationPrefix: "İlginizi çekebileceğini fark ettim",
    composerAria: "Sohbette kendi sorunuzu sorun",
    composerPlaceholder: "Dr. Fuhrman'ın yapay zekasına kendi sorunuzu sorun…",
    questions: [
      "Bir Nutritarian diyetine başlamak için ilk üç adım nedir?",
      "Tek cümleyle, Nutritarian diyeti nedir?",
      "Besin değeri yüksek üç yapraklı yeşillik söyle.",
    ],
    answers: [
      [
        "*Eat for Health* adlı çalışmama dayanarak, sağlıklı bir Nutritarian diyetine geçiş için ilk üç adım şunlardır [[7]]:",
        "**1. Düşüncenizi ve damak zevkinizi, mikrobesin açısından zengin gıdaları tercih edecek şekilde yeniden programlayın.** Bakış açınızı değiştirmeniz gerekir. Vazgeçtiğiniz şeylere odaklanmak yerine, kendinizi vücudunuzu beslemek ve korumak için en çok işe yarayan gıdaları — yapraklı yeşillikleri, baklagilleri, soğanları, mantarları, meyveleri ve tohumları — arzulamaya alıştırın. Bu gıdaları tükettikçe, tat alma tomurcuklarınız gerçekten değişir ve bir zamanlar yavan ya da sıkıcı görünen şeyler canlı ve doyurucu hale gelir.",
        "**2. Mikrobesin açısından zengin gıdaları diyetinizin temeli haline getirerek, aşırı yemeye yol açan bağımlılık yapan açlık belirtilerini ortadan kaldırın.** Çoğu insan «toksik açlık» döngülerine — besin değeri düşük, işlenmiş gıdalardan yoksun kalmanın yol açtığı titreme, baş ağrısı ve isteklere — hapsolmuştur. Diyetinizi yüksek besin yoğunluğuna sahip gıdaların etrafında kurduğunuzda, bu bağımlılık yaratan çekim azalır. Midede rahatsız edici detoks belirtileri yerine boğazda gerçek açlık hissedersiniz ve vücudunuz nihayet doğru miktarda kaloriyle doyar.",
        "**3. Günlük diyetinizdeki sağlıksız gıdaları sınırlayın.** Tabağınızı besin değeri yüksek gıdalarla doldurdukça, işlenmiş, rafine ve hayvansal kaynaklı ürünleri doğal olarak azaltırsınız. Mesele bir günde mükemmelliğe ulaşmak değil; mikrobesin açısından zengin bitkisel gıdaları başrole koymak ve sağlıksız seçenekleri, sizin üzerinizdeki hakimiyetlerini yitirene kadar kenara itmektir.",
        "Bu üç adım birlikte işler — onları tamamen birbirinden ayıramazsınız. Diyetinizin besin yoğunluğu arttıkça, besin değeri düşük gıdalara olan isteğiniz azalır ve bağımlılık yerine gerçek sağlık için yeme yeteneğiniz otomatik hale gelir [[7]].",
      ],
      [
        "Nutritarian diyeti, Sağlığın, Kaloriye bölünen Besinlere eşit olduğu ilkesi [[4]] üzerine kurulu, besin değeri yüksek bir beslenme tarzıdır; burada işlenmiş gıdalardan, şekerden, beyaz undan ve rafine yağlardan kaçınırken yeşil sebzeleri, baklagilleri, soğanları, mantarları, meyveleri ve tohumları öne çıkararak kalori başına mikrobesinleri en üst düzeye çıkarırsınız [[1]][[5]].",
      ],
      [
        "Sizi **kara lahana, yaprak lahana ve ıspanağa** yönlendiririm. Bu koyu yapraklı yeşillikler, besin yoğunluğu çizgisinin en tepesinde — 100 üzerinden 100 — yer alır; çünkü hastalıklara karşı koruyan vitaminler, mineraller ve kanserle savaşan fitokimyasallarla doludurlar [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Çok yakında",
    headline: "DFO yapay zekasını her yere yanınızda taşıyın.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Yemek fotoğrafı tanıma özellikli yerel mobil uygulama",
        body: "Markette, mutfakta veya bir restoranda yemeğinizin fotoğrafını çekin. DFO yapay zekası, bunun bir Nutritarian yaşam tarzına uyup uymadığını ve uymuyorsa neyle değiştireceğinizi anında söyler.",
        imageAlt:
          "Bir çiftçi pazarında akıllı telefonunu kaldıran bir kişi; kamera, taze kara lahana ve domateslerin üzerine yeşil bir analiz halkasıyla odaklanmış",
      },
      {
        badge: "Çevrimdışı · Gemma 4",
        title: "DFO yapay zekası, tamamen cihazınızda çalışıyor",
        body: "DFO yapay zekasının, Google'ın Gemma 4 açık modeliyle çalışan sıkıştırılmış bir sürümü. Uçaklarda, uzak mutfaklarda, takviye reyonunun arkasında çalışır — bağlantı gerektirmez.",
        imageAlt:
          "Uçakta pencere kenarındaki koltukta akıllı telefonundan DFO yapay zekasını kullanan bir yolcu; pencereden yumuşak altın saat bulutları görünüyor",
      },
    ],
  },

  bios: {
    headline: "Yapay zekanın arkasındaki zihinler.",
    subheading:
      "DFO yapay zekasının sesi, Dr. Joel ve Dr. Cara Fuhrman'ın onlarca yıllık klinik uygulama ve öğretimine dayanır.",
    roles: [
      "Sertifikalı aile hekimi, yazar, beslenme araştırmacısı",
      "Aile hekimi, bitki temelli beslenme savunucusu",
    ],
    bodies: [
      "Dr. Fuhrman, New York Times'ın 1 numaralı çok satan yazarı ve beslenme tıbbı alanında uzmanlaşmış sertifikalı bir aile hekimidir. Beslenme mükemmelliğini hedefleyen bir diyeti tanımlamak için Nutritarian terimini ortaya attı ve mikrobesinler açısından zengin bir diyetin kronik hastalıkları nasıl önleyip tersine çevirebileceğini belgelemek için kırk yıllık klinik uygulama ve araştırmaya adandı.",
      "Dr. Cara Fuhrman, bitki temelli beslenmeye ve ailelerin ömür boyu sürecek sağlıklı alışkanlıklar oluşturmasına yardımcı olmaya tutkuyla bağlı bir aile hekimidir. Nutritarian yaklaşımını daha geniş bir kitleye ulaştıran eğitim programlarında Dr. Joel Fuhrman ile iş birliği yapar. Babasıyla birlikte, San Diego'da ileri düzey bir uzun yaşam tıbbı kliniği olan LongevityRx'in kurucu ortağı oldu.",
    ],
    footerPrefix: "Tam biyografiler, kitaplar ve araştırmalar için ziyaret edin:",
  },

  cta: {
    headline: "Dr. Fuhrman'ın yapay zekasına bir soru sormaya hazır mısınız?",
    description:
      "Denemesi ücretsiz. Başlamak için hesaba gerek yok. Sohbet bu sayfanın tam üstünde.",
    buttonText: "DFO yapay zekasını şimdi dene",
  },

  footer: {
    poweredBy: "Tarafından geliştirildi",
    aiSafety: "Yapay Zeka Güvenliği ve Etiği",
    terms: "Şartlar",
    privacy: "Gizlilik",
  },
};
