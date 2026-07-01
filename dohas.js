const dohas = [
  {
    id: 1,
    author: "Kabir Saheb",
    original: "काल करे सो आज कर, आज करे सो अब।\nपल में परलय होएगी, बहुरी करेगा कब।।",
    translation_hi: "जो काम कल करना है उसे आज करो, और जो आज करना है उसे अभी करो। पल भर में प्रलय हो सकती है, फिर तुम अपना काम कब करोगे?",
    translation_mr: "उद्याचे काम आज करा आणि आजचे काम आत्ताच करा. एका क्षणात प्रलय येऊ शकतो (वेळ निघून जाऊ शकते), मग तुम्ही तुमचे काम कधी करणार?",
    translation_en: "Do tomorrow's work today, and today's work now. If the moment is lost in a flash, when will you ever get it done?",
    category: "karma"
  },
  {
    id: 2,
    author: "Kabir Saheb",
    original: "बुरा जो देखन मैं चला, बुरा न मिलिया कोय।\nजो दिल खोजा आपना, मुझसे बुरा न कोय।।",
    translation_hi: "जब मैं इस संसार में बुराई खोजने चला तो मुझे कोई बुरा नहीं मिला। लेकिन जब मैंने अपने मन में झाँका तो पाया कि मुझसे बुरा कोई नहीं है, यानी बुराई बाहर नहीं हमारे भीतर ही है।",
    translation_mr: "जेव्हा मी या जगात वाईट शोधायला निघालो, तेव्हा मला कोणीही वाईट आढळले नाही. पण जेव्हा मी स्वतःच्या मनात डोकावून पाहिले, तेव्हा कळले की माझ्याइतके वाईट कोणीच नाही (वाईट बाहेर नाही तर आपल्या आतच असते).",
    translation_en: "I went searching for the bad, but I found no bad person. When I searched my own heart, I found none worse than myself.",
    category: "truth"
  },
  {
    id: 3,
    author: "Kabir Saheb",
    original: "ऐसी वाणी बोलिए, मन का आपा खोए।\nअोरन को शीतल करे, आपहु शीतल होए।।",
    translation_hi: "ऐसी मधुर भाषा बोलें जिससे मन का अहंकार दूर हो जाए। इससे दूसरों को शांति और प्रसन्नता मिलती है, और बोलने वाले का मन भी शांत रहता है।",
    translation_mr: "अशी गोड भाषा बोला ज्याने मनाचा अहंकार दूर होईल. यामुळे इतरांना आनंद व शांती मिळते आणि बोलणाऱ्याच्या मनालाही शीतलता लाभते.",
    translation_en: "Speak words that are sweet and free from ego. Such speech cools and comforts others, and brings peace to your own heart as well.",
    category: "peace"
  },
  {
    id: 4,
    author: "Kabir Saheb",
    original: "मानुष जन्म दुर्लभ है, मिले न बारम्बार।\nतरुवर से पत्ता टूट गिरे, बहुरि न लगता डार।।",
    translation_hi: "मानव जीवन अत्यंत दुर्लभ है, यह बार-बार नहीं मिलता। जैसे वृक्ष से गिरा पत्ता दोबारा उसकी डाली पर नहीं लग सकता, वैसे ही गंवाया हुआ मानव जीवन वापस नहीं मिलता।",
    translation_mr: "मानवी जन्म अत्यंत दुर्मिळ आहे, तो वारंवार मिळत नाही. ज्याप्रमाणे झाडावरून गळलेले पान पुन्हा फांदीला जोडले जाऊ शकत नाही, त्याचप्रमाणे गमावलेला मानवी जन्म पुन्हा मिळत नाही.",
    translation_en: "Human birth is extremely rare and cannot be attained repeatedly. Just as a leaf fallen from a tree cannot be reattached to its branch, a wasted human life cannot be regained.",
    category: "life"
  },
  {
    id: 5,
    author: "Tulsidas",
    original: "दया धरम का मूल है, पाप मूल अभिमान।\nतुलसी दया न छांड़िए, जब लग घट में प्रान।।",
    translation_hi: "दया धर्म का मूल (जड़) है, और अभिमान (अहंकार) सभी पापों की जड़ है। इसलिए जब तक शरीर में प्राण हैं, तब तक दया का भाव कभी नहीं छोड़ना चाहिए।",
    translation_mr: "दया हा धर्माचा पाया आहे आणि अहंकार हा सर्व पापांचे मूळ आहे. म्हणूनच शरीरात जोपर्यंत प्राण आहेत, तोपर्यंत मनातील दयेची भावना कधीही सोडू नये.",
    translation_en: "Compassion is the root of religion, while pride is the root of sin. Tulsi says, never abandon compassion as long as there is breath in your body.",
    category: "devotion"
  },
  {
    id: 6,
    author: "Rahim Das",
    original: "रहिमन धागा प्रेम का, मत तोड़ो चटकाय।\nटूटे से फिर ना मिले, मिले गाँठ परि जाय।।",
    translation_hi: "प्रेम रूपी धागे को झटके से मत तोड़ो। एक बार टूटने के बाद वह दोबारा नहीं जुड़ता, और यदि जुड़ भी जाए, तो उसमें गांठ (दरार) रह जाती है।",
    translation_mr: "प्रेमाचा धागा झटका देऊन तोडू नका. एकदा तुटल्यावर तो पुन्हा जुळत नाही आणि जर जुळलाच, तर त्यात कायमची गाठ (दुरावा) उरते.",
    translation_en: "Do not snap the delicate thread of love. Once broken, it cannot be rejoined, and even if you do join it, a knot remains forever.",
    category: "peace"
  },
  {
    id: 7,
    author: "Kabir Saheb",
    original: "धीरे-धीरे रे मना, धीरे सब कुछ होय।\nमाली सींचे सौ घड़ा, ऋतु आए फल होय।।",
    translation_hi: "हे मन, धीरज रखो, सब कुछ धीरे-धीरे ही होता है। माली चाहे सौ घड़े पानी से पौधे को सींचे, लेकिन फल तो सही ऋतु आने पर ही लगेगा, अर्थात धैर्य रखने से ही सफलता मिलती है।",
    translation_mr: "हे मना, संयम ठेव, सर्व गोष्टी हळूहळूच होतात. माळ्याने जरी झाडाला शंभर घागरी पाणी घातले, तरी फळ योग्य ऋतू आल्यावरच लागेल, म्हणजेच संयम बाळगल्यानेच यश मिळते.",
    translation_en: "Have patience, O mind, everything happens in its own time. The gardener may water the plant with a hundred pots of water, but fruit only appears when the season arrives.",
    category: "peace"
  },
  {
    id: 8,
    author: "Kabir Saheb",
    original: "दुख में सुमिरन सब करे, सुख में करे न कोय।\nजो सुख में सुमिरन करे, तो दुख काहे को होय।।",
    translation_hi: "दुख में ईश्वर को सब याद करते हैं, लेकिन सुख में कोई याद नहीं करता। यदि सुख में भी ईश्वर का स्मरण किया जाए, तो दुख कभी आएगा ही नहीं।",
    translation_mr: "दुःखात देवाचे स्मरण सर्वच करतात, पण सुखात कोणीही करत नाही. जर सुखातही देवाचे स्मरण केले, तर दुःख कधी येईलच कशाला?",
    translation_en: "Everyone remembers God in times of sorrow, but no one remembers Him in joy. If one remembers God in joy, why would sorrow ever visit?",
    category: "devotion"
  },
  {
    id: 9,
    author: "Tulsidas",
    original: "तुलसी मीठे बचन ते, सुख उपजत चहुँ ओर।\nबसीकरन इक मंत्र है, परिहरू बचन कठोर।।",
    translation_hi: "मीठे वचन बोलने से चारों ओर सुख का संचार होता है। यह किसी को भी वश में करने का एक अचूक मंत्र है, इसलिए कठोर वचनों का त्याग कर देना चाहिए।",
    translation_mr: "गोड बोलण्याने चहूबाजूंनी सुखाचा प्रसार होतो. हा कोणालाही आपलेसे करण्याचा एक मंत्र आहे, म्हणून कठोर बोलण्याचा त्याग केला पाहिजे.",
    translation_en: "Sweet words spread happiness in all directions. It is a powerful mantra to win anyone over, so abandon harsh speech.",
    category: "peace"
  },
  {
    id: 10,
    author: "Rahim Das",
    original: "कहि रहीम संपति सगे, बनत बहुत बहु रीत।\nबिपति कसौटी जे कसे, तेई साचे मीत।।",
    translation_hi: "रहीम कहते हैं कि जब हमारे पास संपत्ति होती है, तो बहुत से लोग हमारे मित्र बन जाते हैं। लेकिन जो विपत्ति (संकट) के समय साथ निभाए, वही सच्चा मित्र है।",
    translation_mr: "रहीम म्हणतात की आपल्याकडे संपत्ती असते तेव्हा अनेक जण आपले मित्र बनतात. पण जो संकटाच्या काळात मदतीला धावून येतो, तोच खरा मित्र असतो.",
    translation_en: "Rahim says, when we have wealth, many people become our friends. But he who stands by us in times of adversity is the only true friend.",
    category: "karma"
  },
  {
    id: 11,
    author: "Meera Bai",
    original: "पायो जी मैंने राम रतन धन पायो।\nवस्तु अमोलिक दी मेरे सतगुरु, किरपा कर अपनायो।।",
    translation_hi: "मैंने राम नाम रूपी अमूल्य रत्न धन प्राप्त कर लिया है। मेरे सद्गुरु ने मुझे यह अनमोल भक्ति रूपी वस्तु दी और मुझ पर अपनी विशेष कृपा करके इसे अपनाया है।",
    translation_mr: "मी राम नामाचे अमूल्य रत्न प्राप्त केले आहे. माझ्या सद्गुरूंनी मला ही अमूल्य भक्ती रूपी वस्तू दिली आणि माझ्यावर विशेष कृपा करून तिचा स्वीकार केला.",
    translation_en: "I have found the priceless wealth of the Divine Name. My true Guru bestowed this invaluable spiritual gift upon me out of pure grace.",
    category: "devotion"
  },
  {
    id: 12,
    author: "Meera Bai",
    original: "मेरे तो गिरधर गोपाल, दूसरो न कोई।\nजाके सिर मोर मुकुट, मेरो पति सोई।।",
    translation_hi: "मेरे तो केवल गिरधर गोपाल (श्री कृष्ण) ही सर्वस्व हैं, उनके अतिरिक्त मेरा संसार में कोई नहीं है। जिनके सिर पर मोर मुकुट सुशोभित है, वही मेरे स्वामी (पति) हैं।",
    translation_mr: "माझे केवळ गिरधर गोपाल (श्री कृष्ण) हेच सर्वस्व आहेत, त्यांच्याशिवाय माझे या जगात कोणी नाही. ज्यांच्या मस्तकावर मोराचा मुकुट सुशोभित आहे, तेच माझे स्वामी आहेत.",
    translation_en: "Only Girdhar Gopal (Krishna) is mine, there is no other in this world. He who wears the beautiful peacock crown is my sole Lord.",
    category: "devotion"
  },
  {
    id: 13,
    author: "Garib Das Ji",
    original: "गरीब, अनभै वाणी कबीर की, काया करहु कबीर।\nजनम जनम के संकट कटैं, जो सुमिरैं मन धीर।।",
    translation_hi: "संत गरीबदास जी कहते हैं कि कबीर साहेब की वाणी निडर (निर्भय) है, अपने मन और शरीर को कबीर साहेब की भक्ति में लगाओ। धीरज धरकर स्मरण करने से जन्म-जन्म के संकट कट जाते हैं।",
    translation_mr: "संत गरीबदास जी म्हणतात की कबीर साहेबांची वाणी निर्भय आहे, आपले मन आणि शरीर कबीर साहेबांच्या भक्तीत लावा. संयमाने देवाचे स्मरण केल्यास जन्मोजन्मीचे संकट दूर होतात.",
    translation_en: "Saint Garib Das says, the words of Kabir Saheb are fearless; immerse your body and mind in devotion. Chanting with patience dissolves the sorrows of lifetimes.",
    category: "devotion"
  },
  {
    id: 14,
    author: "Garib Das Ji",
    original: "गरीब, जम जौरा जासे डरें, धर्मराज करैं प्रणाम।\nवह अविगत कबीर हैं, सतगुरु पुरुष का नाम।।",
    translation_hi: "संत गरीबदास जी कहते हैं कि काल और मृत्यु जिससे डरते हैं और धर्मराज भी जिन्हें प्रणाम करते हैं, वे अविनाशी कबीर साहेब ही हैं, जो हमारे सच्चे गुरु हैं।",
    translation_mr: "संत गरीबदास जी म्हणतात की काळ आणि मृत्यू ज्यांना घाबरतात आणि धर्मराजही ज्यांना प्रणाम करतात, ते अविनाशी कबीर साहेबच आहेत, जे आपले खरे सद्गुरू आहेत.",
    translation_en: "Saint Garib Das says, He whom death fears and Dharmaraj bows down to, is the eternal Kabir, the name of the true Guru.",
    category: "devotion"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dohas;
}
