import type { UIStrings } from "./en";

/**
 * Vietnamese (vi). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const vi: UIStrings = {
  meta: {
    title: "DrFurman.ai — Hướng dẫn Nutritarian bằng AI, 24/7",
    description:
      "Trò chuyện với AI của Dr. Fuhrman, được huấn luyện trên toàn bộ kho tư liệu của ông — 12 cuốn sách, mọi bài giảng video, hơn 20,000+ câu hỏi đáp của thành viên, và tất cả 180 sản phẩm. Sẵn sàng 24/7 bằng mọi ngôn ngữ mà Gemini 3.5 Flash nói được.",
    ogTitle: "DrFurman.ai — Hướng dẫn Nutritarian bằng AI, 24/7",
    ogDescription:
      "Trò chuyện 24/7 với một trợ lý được huấn luyện trên toàn bộ công trình của Dr. Joel Fuhrman.",
    ogImageAlt: "Dr. Fuhrman AI — mọi cuốn sách, mọi bài giảng, mọi câu trả lời.",
    twitterTitle: "DrFurman.ai — Hướng dẫn Nutritarian bằng AI, 24/7",
    twitterDescription:
      "Trò chuyện 24/7 với một trợ lý được huấn luyện trên toàn bộ công trình của Dr. Joel Fuhrman.",
  },

  nav: {
    chat: "Trò chuyện với AI",
    corpus: "Những gì AI biết",
    examples: "Ví dụ",
    comingSoon: "Sắp ra mắt",
    language: "Ngôn ngữ",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "Đã là thành viên drfuhrman.com?",
    memberLoginCta: "Đăng nhập",
    headline: "Mọi cuốn sách. Mọi bài giảng. Mọi câu trả lời.",
  },

  corpus: {
    headline: "Xây dựng trên bốn thập kỷ{br}nghiên cứu của Dr. Fuhrman.",
    subheading:
      "AI của DFO không phỏng đoán — nó trả lời từ kho tư liệu thực của Dr. Fuhrman.",
    stats: {
      everyWord: "Mọi",
      lecturesUnit: "bài giảng video",
      lecturesFlavor:
        "Mọi bài giảng được ghi hình của Dr. Fuhrman, được lập chỉ mục và có thể giải đáp bằng ngôn ngữ dễ hiểu.",
      booksUnit: "cuốn sách",
      booksFlavor:
        "Toàn bộ thư viện sách đã xuất bản của Dr. Fuhrman, từ Eat to Live đến Fast Food Genocide.",
      qasUnit: "câu hỏi đáp của thành viên",
      qasFlavor:
        "Những câu trả lời mà Dr. Fuhrman đã đích thân đưa ra cho cộng đồng Member Center của ông qua nhiều năm.",
      productsUnit: "sản phẩm",
      productsFlavor:
        "Mọi thực phẩm bổ sung và sản phẩm trên DrFuhrman.com, với đầy đủ dữ liệu thành phần và thông số.",
    },
    languagePrefix: "Nói được bằng mọi ngôn ngữ mà Gemini 3.5 Flash hỗ trợ",
    videoAriaLabel:
      "Một cuốn sách sức khỏe bìa cứng đang mở trên bàn gỗ ấm áp, xung quanh là bông cải xanh tươi, cải xoăn, việt quất, óc chó và một chiếc điện thoại hiển thị giao diện trò chuyện",
  },

  examples: {
    headline: "Hãy thử hỏi AI của DFO một câu hỏi thực tế.",
    description:
      "Nhấp vào bất kỳ câu hỏi nào để đưa nó vào ô chat phía trên — ô nhập liệu của bạn sẽ được lấy nét để bạn có thể nhấn {kbd}Enter{/kbd} để gửi.",
    questions: [
      "Cách đơn giản nhất để bắt đầu ăn theo Nutritarian là gì?",
      "Hãy cho tôi biết về độ nhạy insulin.",
      "Dr. Fuhrman khuyên gì cho huyết áp cao?",
      "Làm thế nào để thực hiện thử thách Nutritarian 5 ngày?",
      "Sự khác biệt giữa rau họ cải và rau lá xanh là gì?",
      "Tôi nên đọc cuốn sách nào của Dr. Fuhrman trước?",
    ],
    ctaHint: "Đưa vào chat →",
    videoAriaLabel:
      "Một người trong căn bếp ngập nắng đang kiểm tra AI của DFO trên điện thoại bên trên một tô quả mọng và rau xanh tươi",
  },

  chat: {
    welcomeMessage:
      "Xin chào, tôi là AI của Dr. Joel Fuhrman. Tôi ở đây để giúp bạn giành lại quyền kiểm soát sức khỏe của mình — gần đây bạn đang băn khoăn điều gì?",
    starters: [
      "Chào Dr. Fuhrman AI. Bạn có thể cho tôi biết những bước tôi có thể thực hiện để bắt đầu một lối sống lành mạnh hơn không?",
      "Chào Dr. Fuhrman AI, bạn có thể cho tôi biết Nutritarian là gì không?",
      "Chào Dr. Fuhrman AI. Bạn có thể cho tôi biết về độ nhạy insulin không?",
    ],
    tryAsking: "Thử hỏi",
    emailLabel: "Trước tiên, email của bạn là gì?",
    emailLabelValid: "Email của bạn",
    emailAriaLabel: "Email của bạn",
    emailPlaceholderSticky: "Trước tiên, email của bạn để bắt đầu trò chuyện…",
    askButton: "Hỏi",
    questionPlaceholder: "Nhập câu hỏi của bạn…",
    questionAriaLabel: "Hỏi Dr. Fuhrman AI",
    questionPlaceholderSticky:
      "Hỏi Dr. Fuhrman AI — ăn uống, đảo ngược bệnh tật, giảm cân…",
    sendAriaLabel: "Gửi tin nhắn",
    disclaimer: [
      "Hãy kiểm tra lại thông tin quan trọng.",
      "Không thay thế cho lời khuyên y tế.",
      "AI có thể mắc lỗi.",
    ],
    errorEmailRequired: "Vui lòng nhập email của bạn ở trên để bắt đầu trò chuyện.",
    errorEmailInvalid: "Vui lòng nhập một địa chỉ email hợp lệ.",
    errorEmailTooLong: "Email quá dài.",
    errorDisposable:
      "Vui lòng sử dụng một địa chỉ email cố định — không hỗ trợ hộp thư dùng một lần.",
    errorNetwork:
      "Lỗi mạng — tin nhắn đó chưa được gửi đi. Vui lòng thử lại.",
    quotaExhaustedNudge:
      "Bạn đã dùng hết tin nhắn miễn phí của mình — hãy tiếp tục trò chuyện với AI của Dr. Fuhrman.",
    signupHeadline: "Muốn tiếp tục trò chuyện với AI của Dr. Fuhrman?",
    signupBody:
      "Tiếp tục cuộc trò chuyện — và mở khóa toàn bộ trải nghiệm thành viên Nutritarian — tại DrFuhrman.com.",
    signupButton: "Đăng ký tại DrFuhrman.com",
  },

  transcript: {
    heading: "Câu trả lời thực, thẳng từ kho tư liệu",
    subheading:
      "Một cuộc trò chuyện thực với AI của Dr. Fuhrman — mọi câu trả lời đều dựa trên chính sách, bài giảng và chương trình của ông, với nguồn chính xác được hiển thị. Cuộn xuống để đọc toàn bộ.",
    online: "Trực tuyến",
    assistantLabel: "Trợ lý",
    recommendationPrefix: "Tôi nhận thấy bạn có thể quan tâm đến",
    composerAria: "Đặt câu hỏi của riêng bạn trong khung chat",
    composerPlaceholder: "Hỏi AI của Dr. Fuhrman câu hỏi của riêng bạn…",
    questions: [
      "Ba bước đầu tiên để bắt đầu chế độ ăn Nutritarian là gì?",
      "Trong một câu, chế độ ăn Nutritarian là gì?",
      "Kể tên ba loại rau lá xanh giàu dưỡng chất.",
    ],
    answers: [
      [
        "Dựa trên công trình của tôi trong *Eat for Health*, ba bước đầu tiên để chuyển sang một chế độ ăn Nutritarian lành mạnh là [[7]]:",
        "**1. Tái lập trình suy nghĩ và khẩu vị của bạn để ưa thích những thực phẩm giàu vi chất dinh dưỡng.** Bạn phải thay đổi tư duy của mình. Thay vì tập trung vào những gì bạn đang từ bỏ, hãy rèn luyện bản thân khao khát những thực phẩm nuôi dưỡng và bảo vệ cơ thể bạn nhiều nhất—rau lá xanh, đậu, hành, nấm, quả mọng và hạt. Khi bạn ăn những thực phẩm này, vị giác của bạn thực sự thay đổi, và những gì từng có vẻ nhạt nhẽo hay buồn tẻ trở nên sống động và thỏa mãn.",
        "**2. Loại bỏ những triệu chứng đói gây nghiện dẫn đến ăn quá mức bằng cách lấy thực phẩm giàu vi chất dinh dưỡng làm nền tảng cho chế độ ăn của bạn.** Hầu hết mọi người bị mắc kẹt trong vòng luẩn quẩn của “cơn đói độc hại”—run rẩy, đau đầu và thèm ăn do cai nghiện khỏi những thực phẩm chế biến sẵn ít dưỡng chất. Khi bạn xây dựng chế độ ăn xoay quanh những thực phẩm có mật độ dinh dưỡng cao, sức hút gây nghiện đó giảm dần. Bạn trải nghiệm cơn đói thực sự ở cổ họng, chứ không phải những triệu chứng thải độc khó chịu ở dạ dày, và cơ thể bạn cuối cùng được thỏa mãn với lượng calo đúng đắn.",
        "**3. Hạn chế những thực phẩm không lành mạnh trong chế độ ăn hằng ngày của bạn.** Khi bạn lấp đầy đĩa của mình bằng thực phẩm giàu dưỡng chất, bạn tự nhiên giảm bớt những sản phẩm chế biến sẵn, tinh chế và có nguồn gốc động vật. Đây không phải là chuyện hoàn hảo trong một ngày; đó là việc đưa những thực phẩm thực vật giàu vi chất dinh dưỡng thành nhân vật chính và để những lựa chọn không lành mạnh lùi ra ngoại vi cho đến khi chúng không còn chi phối bạn nữa.",
        "Ba bước này phối hợp với nhau—bạn không thể tách rời chúng hoàn toàn. Khi mật độ dinh dưỡng trong chế độ ăn của bạn tăng lên, ham muốn của bạn với thực phẩm ít dưỡng chất giảm xuống, và khả năng ăn vì sức khỏe thực sự thay vì vì sự nghiện ngập trở nên tự động [[7]].",
      ],
      [
        "Chế độ ăn Nutritarian là một phong cách ăn uống giàu dưỡng chất được xây dựng trên nguyên tắc Sức khỏe bằng Dưỡng chất chia cho Calo [[4]], theo đó bạn tối đa hóa vi chất dinh dưỡng trên mỗi calo bằng cách nhấn mạnh rau xanh, đậu, hành, nấm, quả mọng và hạt trong khi tránh thực phẩm chế biến sẵn, đường, bột mì trắng và dầu tinh chế [[1]][[5]].",
      ],
      [
        "Tôi sẽ giới thiệu cho bạn **cải xoăn, cải rổ và rau bina**. Những loại rau lá xanh đậm này đạt điểm cao nhất trên thang mật độ dinh dưỡng—100 trên 100—vì chúng chứa đầy vitamin, khoáng chất và các hóa chất thực vật chống ung thư giúp bảo vệ chống lại bệnh tật [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Sắp ra mắt",
    headline: "Mang AI của DFO theo bạn — mọi lúc mọi nơi.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Ứng dụng di động gốc với nhận diện ảnh thực phẩm",
        body: "Chụp ảnh thức ăn của bạn tại siêu thị, trong bếp, hoặc ở nhà hàng. AI của DFO sẽ cho bạn biết ngay lập tức liệu nó có phù hợp với lối sống Nutritarian hay không — và nên thay thế bằng gì nếu không phù hợp.",
        imageAlt:
          "Một người giơ điện thoại lên tại chợ nông sản, camera khung hình bên trên cải xoăn và cà chua tươi với một vòng phân tích màu xanh lá",
      },
      {
        badge: "Ngoại tuyến · Gemma 4",
        title: "AI của DFO, chạy hoàn toàn trên thiết bị của bạn",
        body: "Một phiên bản nén của AI DFO, được hỗ trợ bởi mô hình mở Gemma 4 của Google. Hoạt động trên máy bay, trong những căn bếp xa xôi, ở cuối lối đi thực phẩm bổ sung — không cần kết nối.",
        imageAlt:
          "Một du khách ngồi ghế cạnh cửa sổ máy bay đang sử dụng AI của DFO trên điện thoại, những đám mây vàng dịu của giờ hoàng hôn hiện qua cửa sổ",
      },
    ],
  },

  bios: {
    headline: "Những bộ óc đằng sau AI.",
    subheading:
      "Giọng nói của AI DFO bắt nguồn từ hàng thập kỷ thực hành lâm sàng và giảng dạy của Dr. Joel và Dr. Cara Fuhrman.",
    roles: [
      "Bác sĩ gia đình được cấp chứng chỉ, tác giả, nhà nghiên cứu dinh dưỡng",
      "Bác sĩ y học gia đình, người ủng hộ dinh dưỡng từ thực vật",
    ],
    bodies: [
      "Dr. Fuhrman là tác giả sách bán chạy số 1 của New York Times và là bác sĩ gia đình được cấp chứng chỉ chuyên về y học dinh dưỡng. Ông đặt ra thuật ngữ Nutritarian để mô tả một chế độ ăn hướng tới sự xuất sắc về dinh dưỡng, và đã dành bốn thập kỷ thực hành lâm sàng và nghiên cứu để ghi lại cách một chế độ ăn giàu vi chất dinh dưỡng có thể ngăn ngừa và đảo ngược bệnh mãn tính.",
      "Dr. Cara Fuhrman là bác sĩ y học gia đình với niềm đam mê dinh dưỡng từ thực vật và giúp các gia đình xây dựng thói quen lành mạnh trọn đời. Bà hợp tác với Dr. Joel Fuhrman trong các chương trình giáo dục đưa phương pháp Nutritarian đến với nhiều người hơn. Cùng với cha mình, bà đồng sáng lập LongevityRx, một phòng khám y học trường thọ tiên tiến ở San Diego.",
    ],
    footerPrefix: "Để xem tiểu sử đầy đủ, sách và nghiên cứu, hãy truy cập",
  },

  cta: {
    headline: "Sẵn sàng đặt câu hỏi cho AI của Dr. Fuhrman chưa?",
    description:
      "Dùng thử miễn phí. Không cần tài khoản để bắt đầu. Ô chat ở ngay đầu trang này.",
    buttonText: "Thử AI của DFO ngay",
  },

  footer: {
    poweredBy: "Được hỗ trợ bởi",
    aiSafety: "An toàn & Đạo đức AI",
    terms: "Điều khoản",
    privacy: "Quyền riêng tư",
  },
};
