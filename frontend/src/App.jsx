import React, { useState, useRef, useEffect } from "react";
import { 
  UploadCloud, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  HelpCircle, 
  Send, 
  RefreshCw, 
  ExternalLink, 
  Scale, 
  Copy,
  Check,
  Languages,
  MessageSquareQuote,
  Cpu,
  Info,
  Volume2,
  VolumeX,
  Share2,
  Mic,
  MicOff,
  Workflow,
  Sparkles,
  Smartphone,
  Play,
  CheckCheck,
  Activity,
  History,
  FileSpreadsheet
} from "lucide-react";

// Highly detailed multilingual templates matching the backend for 100% offline resilience
const LOCALIZED_MOCK_DATA = {
  english: {
    Penalties: {
      advisory: "This penalty is too high! A 36% interest rate can trap you in severe debt. Ask the distributor to reduce it to 12% - 18% simple interest per annum.",
      audio: "Sir, this penalty clause is very risky. 36% interest can cause severe financial distress. Please ask them to reduce it to 12% simple interest.",
      tip: "Tell the distributor: 'We are willing to pay a reasonable interest of 12% for delays, but 36% monthly compound interest is unacceptable.'",
      whatsapp: "DukaanDost AI Alert! 🚨\nClause: Payment Penalty\nRisk: HIGH (36% Interest)\n\nAdvice: This penalty is too high. Negotiate for 12% simple interest.",
      email: "Dear Distributor Team,\n\nWe reviewed the contract draft. Section 2 contains a 36% compounded interest charge for delayed payments. We propose modifying this to 12% simple interest per annum. Please update the draft accordingly.\n\nBest regards,\n[Merchant Name]"
    },
    Termination: {
      advisory: "Immediate termination without notice is a major risk for your business. Your stock will be stranded. Request a notice period of at least 30 days.",
      audio: "Sir, immediate contract termination is highly dangerous. It could shut down your business overnight. Insist on a 30-day notice period.",
      tip: "Tell the distributor: 'We need a stable supply chain. Immediate termination will harm our business. We request a 30-day notice period.'",
      whatsapp: "DukaanDost AI Alert! 🚨\nClause: Unilateral Termination\nRisk: HIGH (No Notice)\n\nAdvice: Immediate termination is risky. Demand a 30-day notice period.",
      email: "Dear Distributor Team,\n\nRegarding the Termination Clause in Section 3, immediate unilateral termination creates high risk for our operations. We request a minimum 30-day prior written notice period for termination by either party.\n\nBest regards,\n[Merchant Name]"
    },
    Pricing: {
      advisory: "Altering commissions without notice is unfair. You will not know when your margins drop. Request a clause requiring 15 days advance written notice.",
      audio: "Sir, commission changes without notice will hurt your profits. Demand a written notice at least 15 days prior to any pricing change.",
      tip: "Tell the distributor: 'We need transparency in pricing. Any changes in commission should require a 15-day prior written notice.'",
      whatsapp: "DukaanDost AI Alert! 🚨\nClause: Unilateral Pricing\nRisk: MEDIUM\n\nAdvice: Price changes without notice are unfair. Request 15 days notice.",
      email: "Dear Distributor Team,\n\nIn Section 1, the unilateral pricing adjustments clause needs revision. We request that any alterations to commission structures, listing fees, or charges be notified in writing at least 15 days in advance.\n\nBest regards,\n[Merchant Name]"
    },
    Liability: {
      advisory: "Delhi court jurisdiction is costly if you are located elsewhere. Suggest changing jurisdiction to your local city courts.",
      audio: "Sir, traveling to Delhi for court disputes will be very expensive. Request local court jurisdiction to protect your business.",
      tip: "Tell the distributor: 'We want the legal jurisdiction to be our local city courts to avoid travel expenses during any dispute.'",
      whatsapp: "DukaanDost AI Alert! 🚨\nClause: Out-of-station Jurisdiction\nRisk: MEDIUM\n\nAdvice: Delhi jurisdiction is expensive. Change to local courts.",
      email: "Dear Distributor Team,\n\nWe would like to request a change in Section 4 regarding legal jurisdiction. To reduce operational complexities, we propose that the legal jurisdiction be changed to our local city courts where our store is based.\n\nBest regards,\n[Merchant Name]"
    }
  },
  hinglish: {
    Penalties: {
      advisory: "Yeh penalty bohot zyada hai! 36% interest rate aapko bohot bade karz me daal sakta hai. Aap distributor se bolkar ise maximum 12% se 18% per annum karwayein.",
      audio: "Bhaiya, ye clause toh bilkul galat hai! 36% saalana interest rate aapko bohot bade karz me fasa dega. Isko hataiye aur distributor se simple interest 12% set karwaiye.",
      tip: "Distributor se bolein: 'Hum 12% simple interest dene ko tayyar hain, par 36% compounded interest bohot zyada hai.'",
      whatsapp: "DukaanDost AI Alert! 🚨\nClause: Payment Penalty\nRisk: HIGH (36% Interest)\n\nHumari Sallah: Bhaiya, ye penalty bohot zyada hai. Distributor se negotiate karke simple interest 12% karwayein.",
      email: "Dear Distributor Partners,\n\nWe have reviewed the payment settlement details. Section 2 mentions a 36% interest rate for delayed payments. This is extremely high for us. We suggest amending this to a 12% simple interest per annum.\n\nRegards,\n[Merchant]"
    },
    Termination: {
      advisory: "Immediate termination (turant band karna) aapke business ke liye bada risk hai. Aapka stock fasa reh jayega. Distributor se bole ki termination ke liye kam se kam 30 days ka written notice period hona chahiye.",
      audio: "Bhaiya, dekhiye, bina kisi notice ke contract band karna toh aapki dukaan band karne jaisa hai. Distributor se bolein ki kam se kam 30 din ka notice zaroori hona chahiye.",
      tip: "Distributor se bolein: 'Immediate termination se humara nuksaan hoga, hume stock manage karne ke liye 30 days ka notice period chahiye.'",
      whatsapp: "DukaanDost AI Alert! 🚨\nClause: Unilateral Termination\nRisk: HIGH (No Notice)\n\nHumari Sallah: Immediate termination aapke business ko thap kar sakta hai. 30 din ka written notice period mangiye.",
      email: "Dear Distributor Team,\n\nRegarding the termination terms in Section 3, the immediate termination clause is not suitable for our business operations. We propose adding a 30-day prior written notice period requirement for termination.\n\nRegards,\n[Merchant]"
    },
    Pricing: {
      advisory: "Bina bataye commission rates badalna galat hai. Aapko pata hi nahi chalega ki aapka profit kab kam ho gaya. Contract me clause dalwayein ki commission change karne se pehle company 15 days ka advance written notice degi.",
      audio: "Bhaiya, bina bataye fees ya commission badalna sahi nahi hai. Contract me strictly likhwaiye ki changes se 15 din pehle aapko notice diya jaye.",
      tip: "Distributor se bolein: 'Bina bataye commission fees badalna theek nahi hai. Koi bhi change karne se 15 din pehle hume written notification milna chahiye.'",
      whatsapp: "DukaanDost AI Alert! 🚨\nClause: Unilateral Pricing\nRisk: MEDIUM\n\nHumari Sallah: Commission bina notice ke badalna galat hai. 15 din ka advance written notice mandatorily lagwaiye.",
      email: "Dear Distributor Team,\n\nWe would like to request an adjustment to Section 1. Unilateral changes to listing fees and commission rates can impact our planning. We suggest adding a clause requiring a 15-day advance written notice before any pricing adjustments.\n\nRegards,\n[Merchant]"
    },
    Liability: {
      advisory: "Agar koi dispute hoti hai, toh aapko Ranchi chhodkar Delhi ke court jana padega, jo bohot mehenga padega. Court jurisdiction aapke local area me hi hona chahiye.",
      audio: "Bhaiya, agar kal ko koi lafda hota hai toh aapko Delhi courts jana padega. Is case me Ranchi local court set karwayein, warna kharche me hi sab chala jayega.",
      tip: "Distributor se bolein: 'Disputes ke liye hum Ranchi courts ka jurisdiction rakhna chahte hain.'",
      whatsapp: "DukaanDost AI Alert! 🚨\nClause: Out-of-station Jurisdiction\nRisk: MEDIUM\n\nHumari Sallah: Ranchi se Delhi court jana mehenga hoga. Local court jurisdiction lagwayein.",
      email: "Dear Distributor Team,\n\nFor Section 4 (Jurisdiction), traveling to Delhi for resolving any disputes is economically difficult for our shop. We request that the legal jurisdiction be located in Ranchi courts only.\n\nRegards,\n[Merchant]"
    }
  },
  hindi: {
    Penalties: {
      advisory: "यह जुर्माना बहुत अधिक है! 36% ब्याज दर आपको भारी कर्ज में डाल सकती है। आप डिस्ट्रीब्यूटर से इसे घटाकर 12% से 18% प्रति वर्ष करने के लिए कहें।",
      audio: "भैया, यह क्लॉज तो बिल्कुल गलत है! 36% सालाना ब्याज दर आपको बहुत बड़े कर्ज में फंसा देगी। इसको हटाइए और डिस्ट्रीब्यूटर से साधारण ब्याज 12% तय करवाइए।",
      tip: "डिस्ट्रीब्यूटर से कहें: 'हम देरी के लिए 12% साधारण ब्याज देने को तैयार हैं, लेकिन 36% चक्रवृद्घि ब्याज बहुत अधिक है।'",
      whatsapp: "दुकानदोस्त एआई अलर्ट! 🚨\nक्लॉज: भुगतान जुर्माना\nजोखिम: उच्च (36% ब्याज)\n\nहमारी सलाह: भैया, यह जुर्माना बहुत अधिक है। डिस्ट्रीब्यूटर से मोल-भाव करके साधारण ब्याज 12% करवाएं।",
      email: "प्रिय डिस्ट्रीब्यूटर टीम,\n\nहमने अनुबंध का मसौदा देखा है। धारा 2 में देरी से भुगतान पर 36% चक्रवृद्धि ब्याज का उल्लेख है। हम इसे घटाकर 12% वार्षिक साधारण ब्याज करने का प्रस्ताव रखते हैं। कृपया अनुबंध में यह संशोधन करें।\n\nसादर,\n[दुकानदार का नाम]"
    },
    Termination: {
      advisory: "तुरंत कॉन्ट्रैक्ट समाप्त करना (Immediate termination) आपके व्यवसाय के लिए बड़ा जोखिम है। आपका स्टॉक फंसा रह जाएगा। डिस्ट्रीब्यूटर से कहें कि नोटिस अवधि कम से कम 30 दिन की होनी चाहिए।",
      audio: "भैया, देखिए, बिना किसी नोटिस के कॉन्ट्रैक्ट बंद करना तो आपकी दुकान बंद करने जैसा है। डिस्ट्रीब्यूटर से कहें कि कम से कम 30 दिन का नोटिस अनिवार्य करवाएं।",
      tip: "डिस्ट्रीब्यूटर से कहें: 'तुरंत कॉन्ट्रैक्ट खत्म होने से हमारा नुकसान होगा, हमें स्टॉक संभालने के लिए 30 दिन का नोटिस पीरियड चाहिए।'",
      whatsapp: "दुकानदोस्त एआई अलर्ट! 🚨\nक्लॉज: एकतरफा समाप्ति\nजोखिम: उच्च (कोई नोटिस नहीं)\n\nहमारी सलाह: तुरंत समाप्ति आपके व्यवसाय को ठप कर सकती है। 30 दिन का लिखित नोटिस मांगें।",
      email: "प्रिय डिस्ट्रीब्यूटर टीम,\n\nअनुबंध की धारा 3 में तत्काल समाप्ति का प्रावधान हमारे व्यवसाय के लिए नुकसानदेह हो सकता है। हम दोनों पक्षों के लिए कम से कम 30 दिन का अग्रिम लिखित नोटिस अनिवार्य करने का प्रस्ताव करते हैं।\n\nसादर,\n[दुकानदार का नाम]"
    },
    Pricing: {
      advisory: "बिना बताए कमीशन बदलना गलत है। आपको पता भी नहीं चलेगा और आपका मुनाफा कम हो जाएगा। कॉन्ट्रैक्ट में लिखवाएं कि बदलाव से पहले कंपनी 15 दिन का लिखित नोटिस देगी।",
      audio: "भैया, बिना बताए फीस या कमीशन बदलना सही नहीं है। कॉन्ट्रैक्ट में कड़ाई से लिखवाएं कि बदलाव से 15 दिन पहले आपको नोटिस दिया जाए।",
      tip: "डिस्ट्रीब्यूटर से कहें: 'बिना बताए कमीशन फीस बदलना ठीक नहीं है। कोई भी बदलाव करने से 15 दिन पहले हमें लिखित सूचना मिलनी चाहिए।'",
      whatsapp: "दुकानदोस्त एआई अलर्ट! 🚨\nक्लॉज: एकतरफा मूल्य निर्धारण\nजोखिम: मध्यम\n\nहमारी सलाह: कमीशन बिना नोटिस के बदलना गलत है। 15 दिन का अग्रिम लिखित नोटिस अवश्य लगवाएं।",
      email: "प्रिय डिस्ट्रीब्यूटर टीम,\n\nधारा 1 के तहत बिना पूर्व सूचना के कमीशन या लिस्टिंग शुल्क में बदलाव करने का नियम हमारे लिए उचित नहीं है। हम चाहते हैं कि किसी भी बदलाव से कम से कम 15 दिन पहले लिखित सूचना दी जाए।\n\nसादर,\n[दुकानदार का नाम]"
    },
    Liability: {
      advisory: "यदि कोई कानूनी विवाद होता है, तो आपको दिल्ली जाना पड़ेगा, जो बहुत महंगा होगा। कोर्ट का अधिकार क्षेत्र आपके स्थानीय क्षेत्र में ही होना चाहिए।",
      audio: "भैया, अगर कल को कोई विवाद होता है तो आपको दिल्ली कोर्ट जाना पड़ेगा। इस मामले में अपने शहर का कोर्ट तय करवाएं, वरना चक्कर काटने में ही सब खत्म हो जाएगा।",
      tip: "डिस्ट्रीब्यूटर से कहें: 'विवादों के समाधान के लिए हम अपने स्थानीय शहर की अदालत का अधिकार क्षेत्र रखना चाहते हैं।'",
      whatsapp: "दुकानदोस्त एआई अलर्ट! 🚨\nक्लॉज: बाहरी अधिकार क्षेत्र\nजोखिम: मध्यम\n\nहमारी सलाह: अपने शहर से बाहर कोर्ट जाना बहुत खर्चीला होगा। स्थानीय अदालत का अधिकार क्षेत्र तय करवाएं।",
      email: "प्रिय डिस्ट्रीब्यूटर टीम,\n\nधारा 4 के अनुसार कानूनी विवादों का अधिकार क्षेत्र दिल्ली रखा गया है। हमारे स्टोर के लिए दिल्ली जाकर कानूनी कार्रवाई करना आर्थिक रूप से कठिन होगा। अतः हम इसे स्थानीय अदालत में बदलने का अनुरोध करते हैं।\n\nसादर,\n[दुकानदार का नाम]"
    }
  },
  bengali: {
    Penalties: {
      advisory: "এই জরিমানা খুব বেশি! ৩৬% সুদের হার আপনাকে মারাত্মক ঋণে ফেলতে পারে। পরিবেশককে এটি বার্ষিক ১২% - ১৮% সরল সুদে নামিয়ে আনতে বলুন।",
      audio: "ভাইয়া, এই নিয়মটি কিন্তু সম্পূর্ণ ভুল! ৩৬% বার্ষিক সুদ আপনাকে ঋণের জালে জড়িয়ে ফেলবে। এটি বাদ দিয়ে সরল সুদ ১২% করতে বলুন।",
      tip: "পরিবেশককে বলুন: 'আমরা দেরির জন্য ১২% সরল সুদ দিতে রাজি আছি, কিন্তু ৩৬% চক্রবৃদ্ধি সুদ অত্যন্ত বেশি।'",
      whatsapp: "দোকানদোস্ত এআই অ্যালার্ট! 🚨\nঅনুচ্ছেদ: দেরিতে অর্থ প্রদানের জরিমানা\nঝুঁকি: উচ্চ (৩৬% সুদ)\n\nআমাদের পরামর্শ: ভাইয়া, এই জরিমানা অত্যন্ত বেশি। পরিবেশকের সাথে আলোচনা করে ১২% সরল সুদ নির্ধারণ করুন।",
      email: "প্রিয় ডিস্ট্রিবিউটর টিম,\n\nআমরা চুক্তিটি পর্যালোচনা করেছি। ধারা ২-এ দেরিতে পেমেন্টের জন্য ৩৬% চক্রবৃদ্ধি সুদের কথা উল্লেখ আছে। আমরা এটিকে ১২% সরল সুদে পরিবর্তন করার প্রস্তাব দিচ্ছি।\n\nশুভেচ্ছা সহ,\n[দোকানদারের নাম]"
    },
    Termination: {
      advisory: "কোনো নোটিশ ছাড়াই চুক্তি বাতিল করা আপনার ব্যবসার জন্য বড় ঝুঁকি। আপনার স্টক আটকে যাবে। অন্তত ৩০ দিনের নোটিশ পিরিয়ডের জন্য বলুন।",
      audio: "ভাইয়া, নোটিশ ছাড়া চুক্তি বন্ধ করা মানে দোকান বন্ধ করার মতো। পরিবেশককে বলুন চুক্তি বাতিলের আগে অন্তত ৩০ দিনের লিখিত নোটিশ দিতে হবে।",
      tip: "পরিবেশককে বলুন: 'হঠাৎ চুক্তি বাতিল হলে আমাদের ক্ষতি হবে, স্টক সাজানোর জন্য ৩০ দিনের নোটিশ প্রয়োজন।'",
      whatsapp: "দোকানদোস্ত এআই অ্যালার্ট! 🚨\nঅনুচ্ছেদ: একতরফা চুক্তি বাতিল\nঝুঁকি: উচ্চ (কোনো নোটিশ নেই)\n\nআমাদের পরামর্শ: নোটিশ ছাড়া চুক্তি বাতিল ব্যবসা বন্ধ করে দিতে পারে। ৩০ দিনের লিখিত নোটিশের দাবি জানান।",
      email: "প্রিয় ডিস্ট্রিবিউটর টিম,\n\nচুক্তি বাতিলের ধারা ৩-এর ক্ষেত্রে, কোনো নোটিশ ছাড়া চুক্তি বাতিল আমাদের ব্যবসার জন্য মারাত্মক ঝুঁকিপূর্ণ। আমরা উভয় পক্ষের জন্য ৩০ দিনের লিখিত নোটিশ পিরিয়ড যুক্ত করার প্রস্তাব করছি।\n\nশুভেচ্ছা সহ,\n[দোকানদারের নাম]"
    },
    Pricing: {
      advisory: "নোটিশ না দিয়ে কমিশন পরিবর্তন করা অন্যায়। আপনার মুনাফা কখন কমে যাবে বুঝতেই পারবেন না। চুক্তিতে ১৫ দিনের অগ্রিম লিখিত নোটিশের শর্ত রাখুন।",
      audio: "ভাইয়া, না জানিয়ে কমিশন ফি বদলানো ঠিক নয়। চুক্তিতে স্পষ্ট লিখুন যে কোনো পরিবর্তনের ১৫ দিন আগে নোটিশ দিতে হবে।",
      tip: "পরিবেশককে বলুন: 'না জানিয়ে কমিশন ফি পরিবর্তন করা ঠিক নয়। যেকোনো পরিবর্তনের ১৫ দিন আগে আমাদের লিখিতভাবে জানাতে হবে।'",
      whatsapp: "দোকানদোস্ত এআই অ্যালার্ট! 🚨\nঅনুচ্ছেদ: একতরফা মূল্য নির্ধারণ\nঝুঁকি: মাঝারি\n\nআমাদের পরামর্শ: নোটিশ ছাড়া কমিশন বদলানো ঠিক নয়। ১৫ দিনের লিখিত নোটিশের শর্ত যুক্ত করুন।",
      email: "প্রিয় ডিস্ট্রিবিউটর টিম,\n\nনা জানিয়ে কমিশন বা তালিকাভুক্তি ফি পরিবর্তন আমাদের ব্যবসায়িক পরিকল্পনা ব্যাহত করতে পারে। আমরা অনুরোধ করছি যে কোনো পরিবর্তনের অন্তত ১৫ দিন আগে আমাদের লিখিত নোটিশ দেওয়া হোক।\n\nশুভেচ্ছা সহ,\n[দোকানদারের নাম]"
    },
    Liability: {
      advisory: "দিল্লির আদালত চত্বর আপনার জন্য ব্যয়বহুল হবে। আইনি এক্তিয়ার আপনার স্থানীয় আদালতের অধীনে করার পরামর্শ দেওয়া হচ্ছে।",
      audio: "ভাইয়া, বিরোধের জন্য দিল্লি কোর্টে যাওয়া অত্যন্ত ব্যয়বহুল হবে। আইনি এলাকা আপনার স্থানীয় আদালত রাখতে বলুন।",
      tip: "পরিবেশককে বলুন: 'আইনি বিরোধ নিষ্পত্তির জন্য আমরা আমাদের স্থানীয় আদালতের এক্তিয়ার রাখতে চাই।'",
      whatsapp: "দোকানদোস্ত এআই অ্যালার্ট! 🚨\nঅনুচ্ছেদ: বহিঃস্থ আইনি এক্তিয়ার\nঝুঁকি: মাঝারি\n\nআমাদের পরামর্শ: দিল্লির আদালতে মামলা পরিচালনা ব্যয়বহুল হবে। স্থানীয় আদালতের এক্তিয়ার নির্ধারণ করুন।",
      email: "প্রিয় ডিস্ট্রিবিউটর টিম,\n\nআইনি বিরোধ নিষ্পত্তির জন্য দিল্লির আদালতের এখতিয়ার আমাদের জন্য অত্যন্ত ব্যয়বহুল হবে। আমরা এটিকে আমাদের স্থানীয় আদালতের অধীনে রাখার জন্য অনুরোধ করছি।\n\nশুভেচ্ছা সহ,\n[দোকানদারের নাম]"
    }
  },
  tamil: {
    Penalties: {
      advisory: "இந்த அபராதம் மிக அதிகம்! 36% வட்டி விகிதம் உங்களை கடுமையான கடனில் தள்ளும். இதை ஆண்டிற்கு 12% - 18% எளிய வட்டியாகக் குறைக்க விநியோகஸ்தரிடம் கேளுங்கள்.",
      audio: "அண்ணே, இந்த விதிமுறை மிகவும் தவறு! 36% வட்டி உங்களை கடனில் மூழ்கடித்துவிடும். இதை மாற்றி 12% எளிய வட்டி அமைக்க சொல்லுங்கள்.",
      tip: "விநியோகஸ்தரிடம் சொல்லுங்கள்: 'தாமதத்திற்கு 12% வட்டி தர நாங்கள் தயார், ஆனால் 36% கூட்டு வட்டி மிகவும் அதிகம்.'",
      whatsapp: "துகான்தோஸ்த் AI எச்சரிக்கை! 🚨\nவிதிமுறை: தாமதக் கட்டண அபராதம்\nஆபத்து: அதிகம் (36% வட்டி)\n\nஎங்கள் அறிவுரை: அண்ணே, இந்த அபராதம் அதிகம். பேசி 12% எளிய வட்டி வையுங்கள்.",
      email: "அன்புள்ள விநியோகஸ்தர் குழுவிற்கு,\n\nநாங்கள் ஒப்பந்தத்தை ஆய்வு செய்தோம். தாமதக் கட்டணத்திற்கு 36% வட்டி விதிக்கப்பட்டுள்ளது. இதை 12% எளிய வட்டியாக மாற்றக் கோருகிறோம்.\n\nநன்றியுடன்,\n[வணிகர் பெயர்]"
    },
    Termination: {
      advisory: "முன்னறிவிப்பு இன்றி ஒப்பந்தத்தை ரத்து செய்வது உங்கள் வணிகத்திற்கு பெரிய ஆபத்து. உங்கள் சரக்குகள் முடங்கிவிடும். குறைந்தது 30 நாட்கள் முன்னறிவிப்பு கேட்கவும்.",
      audio: "அண்ணே, நோட்டீஸ் இல்லாமல் ஒப்பந்தத்தை நிறுத்துவது கடையை மூடுவதற்கு சமம். 30 நாட்கள் நோட்டீஸ் காலம் கட்டாயம் என கேளுங்கள்.",
      tip: "விநியோகஸ்தரிடம் சொல்லுங்கள்: 'திடீரென ஒப்பந்தம் ரத்து செய்யப்பட்டால் எங்களுக்கு நஷ்டம் ஏற்படும், சரக்குகளை கையாள 30 நாட்கள் அவகாசம் வேண்டும்.'",
      whatsapp: "துகான்தோஸ்த் AI எச்சரிக்கை! 🚨\nவிதிமுறை: ஒருதலைப்பட்ச ஒப்பந்த ரத்து\nஆபத்து: அதிகம் (நோட்டீஸ் இல்லை)\n\nஎங்கள் அறிவுரை: நோட்டீஸ் இல்லாத ஒப்பந்த ரத்து வணிகத்தை முடக்கும். 30 நாட்கள் நோட்டீஸ் காலம் கேளுங்கள்.",
      email: "அன்புள்ள விநியோகஸ்தர் குழுவிற்கு,\n\nஒப்பந்தத்தை உடனடியாக ரத்து செய்வது எங்கள் வணிகத்தைப் பாதிக்கும். ஒப்பந்தத்தை ரத்து செய்ய இரு தரப்புக்கும் 30 நாட்கள் எழுத்துப்பூர்வ முன்னறிவிப்பு தேவை என மாற்றக் கோருகிறோம்.\n\nநன்றியுடன்,\n[வணிகர் பெயர்]"
    },
    Pricing: {
      advisory: "அறிவிப்பின்றி கமிஷன் தொகையை மாற்றுவது நியாயமற்றது. உங்கள் லாபம் எப்போது குறைகிறது என்றே தெரியாது. 15 நாட்கள் முன்னறிவிப்பு கேட்கவும்.",
      audio: "அண்ணே, சொல்லாமல் கமிஷனை மாற்றுவது தவறு. மாற்றத்திற்கு 15 நாட்களுக்கு முன் எழுத்துப்பூர்வ அறிவிப்பு வழங்க ஒப்பந்தத்தில் சேர்க்கவும்.",
      tip: "விநியோகஸ்தரிடம் சொல்லுங்கள்: 'எங்களுக்கு வெளிப்படைத்தன்மை தேவை. கமிஷன் மாற்றத்திற்கு 15 நாட்கள் முன்னறிவிப்பு வேண்டும்.'",
      whatsapp: "துகான்தோஸ்த் AI எச்சரிக்கை! 🚨\nவிதிமுறை: ஒருதலைப்பட்ச விலை மாற்றம்\nஆபத்து: நடுத்தரம்\n\nஎங்கள் அறிவுரை: சொல்லாமல் கமிஷனை மாற்றுவது தவறு. 15 நாட்கள் நோட்டீஸ் கட்டாயம் என சேர்க்கவும்.",
      email: "அன்புள்ள விநியோகஸ்தர் குழுவிற்கு,\n\nமுன்னறிவிப்பின்றி கமிஷனை மாற்றுவது எங்கள் லாபத்தைப் பாதிக்கும். ஏதேனும் கட்டண மாற்றம் செய்வதற்கு 15 நாட்களுக்கு முன் எழுத்துப்பூர்வ அறிவிப்பு தரக் கோருகிறோம்.\n\nநன்றியுடன்,\n[வணிகர் பெயர்]"
    },
    Liability: {
      advisory: "டெல்லி நீதிமன்ற எல்லை உங்களுக்கு அதிக செலவை ஏற்படுத்தும். சட்ட எல்லையை உங்கள் உள்ளூர் நீதிமன்றத்திற்கு மாற்றவும்.",
      audio: "அண்ணே, டெல்லி கோர்ட்டுக்கு போவது மிகவும் செலவு வைக்கும். வழக்குகளை உங்கள் உள்ளூர் கோர்ட்டிலேயே வைக்க சொல்லுங்கள்.",
      tip: "விநியோகஸ்தரிடம் சொல்லுங்கள்: 'சட்ட விவகாரங்களுக்கு எங்கள் உள்ளூர் நீதிமன்ற எல்லையையே வைக்க விரும்புகிறோம்.'",
      whatsapp: "துகான்தோஸ்த் AI எச்சரிக்கை! 🚨\nவிதிமுறை: வெளி நீதிமன்ற எல்லை\nஆபத்து: நடுத்தரம்\n\nஎங்கள் அறிவுரை: டெல்லி கோர்ட் செல்வது செலவு தரும். உள்ளூர் கோர்ட் எல்லையை வையுங்கள்.",
      email: "அன்புள்ள விநியோகஸ்தர் குழுவிற்கு,\n\nஎங்கள் வணிகம் அமைந்துள்ள உள்ளூர் நீதிமன்ற எல்லையையே சட்டப்பூர்வ விவகாரங்களுக்கு வைக்க விரும்புகிறோம். இதை டெல்லியில் இருந்து உள்ளூர் எல்லைக்கு மாற்றக் கோருகிறோம்.\n\nநன்றியுடன்,\n[வணிகர் பெயர்]"
    }
  },
  telugu: {
    Penalties: {
      advisory: "ఈ జరిమానా చాలా ఎక్కువ! 36% వడ్డీ రేటు మిమ్మల్ని తీవ్రమైన అప్పుల్లోకి నెట్టవచ్చు. దీనిని సంవత్సరానికి 12% - 18% సరళ వడ్డీకి తగ్గించమని డిస్ట్రిబ్యూటర్ని అడగండి.",
      audio: "అన్నా, ఈ క్లాజ్ చాలా ప్రమాదకరం! 36% వడ్డీ మిమ్మల్ని అప్పులపాలు చేస్తుంది. దీనిని 12% సరళ వడ్డీగా మార్పించండి.",
      tip: "డిస్ట్రిబ్యూటర్తో చెప్పండి: 'ఆలస్యమైతే 12% సాధారణ వడ్డీ ఇవ్వడానికి సిద్ధం, కానీ 36% చక్రవడ్డీ చాలా ఎక్కువ.'",
      whatsapp: "దుకాన్దోస్త్ AI అలర్ట్! 🚨\nక్లాజ్: లేట్ పేమెంట్ పెనాల్టీ\nప్రమాదం: ఎక్కువ (36% వడ్డీ)\n\nమా సలహా: అన్నా, ఈ పెనాల్టీ చాలా ఎక్కువ. మాట్లాడి 12% సరళ వడ్డీగా మార్పించండి.",
      email: "ప్రియమైన డిస్ట్రిబ్యూటర్ బృందానికి,\n\nమేము ఒప్పందాన్ని సమీక్షించాము. ఆలస్యమైన చెల్లింపులకు 36% చక్రవడ్డీ విధించబడింది. మేము దీనిని 12% సాధారణ వడ్డీగా సవరించాలని ప్రతిపాదిస్తున్నాము.\n\nభవదీయుడు,\n[వ్యాపారి పేరు]"
    },
    Termination: {
      advisory: "ఎలాంటి నోటీసు లేకుండా ఒప్పందాన్ని రద్దు చేయడం మీ వ్యాపారానికి పెద్ద ముప్పు. మీ స్టాక్ నిలిచిపోతుంది. కనీసం 30 రోజుల నోటీసు పిరియడ్ అడగండి.",
      audio: "అన్నా, నోటీసు లేకుండా ఒప్పందాన్ని రద్దు చేయడం అంటే దుకాణాన్ని మూసివేయడమే. కనీసం 30 రోజుల నోటీసు ఉండాలని అడగండి.",
      tip: "డిస్ట్రిబ్యూటర్తో చెప్పండి: 'తక్షణ రద్దు వల్ల మాకు నష్టం జరుగుతుంది, స్టాక్ సర్దుబాటుకు 30 రోజుల సమయం కావాలి.'",
      whatsapp: "దుకాన్దోస్త్ AI అలర్ట్! 🚨\nక్లాజ్: ఏకపక్ష ఒప్పంద రద్దు\nప్రమాదం: ఎక్కువ (నోటీసు లేదు)\n\nమా సలహా: నోటీసు లేని రద్దు వ్యాపారాన్ని దెబ్బతీస్తుంది. 30 రోజుల రాతపూర్వక నోటీసు అడగండి.",
      email: "ప్రియమైన డిస్ట్రిబ్యూటర్ బృందానికి,\n\nతక్షణ రద్దు క్లాజ్ మా వ్యాపారానికి నష్టదాయకం. అందువల్ల ఒప్పందాన్ని రద్దు చేయడానికి కనీసం 30 రోజుల ముందస్తు రాతపూర్వక నోటీసు పిరియడ్ ఉండాలని కోరుతున్నాము.\n\nభవదీయుడు,\n[వ్యాపారి పేరు]"
    },
    Pricing: {
      advisory: "నోటీసు లేకుండా కమిషన్ మార్చడం అన్యాయం. మీ లాభం ఎప్పుడు తగ్గిపోతుందో తెలియదు. 15 రోజుల ముందస్తు నోటీసు క్లాజ్ రాయించండి.",
      audio: "అన్నా, చెప్పకుండా కమిషన్ మార్చడం తప్పు. మార్పులకు 15 రోజుల ముందు నోటీసు ఇచ్చేలా ఒప్పందంలో రాయించండి.",
      tip: "డిస్ట్రిబ్యూటర్తో చెప్పండి: 'ధరల మార్పులలో పారదర్శకత కావాలి. కమిషన్ మార్చే ముందు 15 రోజుల నోటీసు ఇవ్వాలి.'",
      whatsapp: "దుకాన్దోస్త్ AI అలర్ట్! 🚨\nక్లాజ్: ఏకపక్ష కమిషన్ మార్పు\nప్రమాదం: మధ్యస్థం\n\nమా సలహా: చెప్పకుండా కమిషన్ మార్చడం తప్పు. 15 రోజుల ముందస్తు నోటీసు క్లాజ్ రాయించండి.",
      email: "ప్రియమైన డిస్ట్రిబ్యూటర్ బృందానికి,\n\nచెప్పకుండా కమిషన్ మార్చడం వల్ల మా వ్యాపారం దెబ్బతింటుంది. ఏవైనా మార్పులు చేసే ముందు కనీసం 15 రోజుల ముందస్తు రాతపూర్వక నోటీసు ఇవ్వాలని కోరుతున్నాము.\n\nభవదీయుడు,\n[వ్యాపారి పేరు]"
    },
    Liability: {
      advisory: "ఢిల్లీ కోర్టు పరిధి మీకు చాలా ఖర్చుతో కూడుకున్నది. మీ స్థానిక కోర్టు పరిధిని ఎంచుకోండి.",
      audio: "అన్నా, వివాదాల కోసం ఢిల్లీ కోర్టుకు వెళ్ళడం చాలా ఖర్చు అవుతుంది. స్థానిక కోర్టు పరిధిని ఎంచుకోండి.",
      tip: "డిస్ట్రిబ్యూటర్తో చెప్పండి: 'లీగల్ పరిధిని మా స్థానిక కోర్టుకు మార్చాలని కోరుకుంటున్నాము.'",
      whatsapp: "దుకాన్దోస్త్ AI అలర్ట్! 🚨\nక్లాజ్: ఇతర కోర్టు పరిధి\nప్రమాదం: మధ్యస్థం\n\nమా సలహా: ఢిల్లీ కోర్టుకు వెళ్ళడం ఖర్చుతో కూడుకున్నది. స్థానిక కోర్టు పరిధిని ఉంచండి.",
      email: "ప్రియమైన డిస్ట్రిబ్యూటర్ బృందానికి,\n\nఢిల్లీ కోర్టు పరిధి మా వ్యాపారానికి ఆర్థికంగా చాలా ఖర్చుతో కూడుకున్నది. అందువల్ల వివాదాల పరిష్కారం కోసం మా స్థానిక కోర్టు పరిధిని ఉంచాల్సిందిగా కోరుతున్నాము.\n\nభవదీయుడు,\n[వ్యాపారి పేరు]"
    }
  },
  marathi: {
    Penalties: {
      advisory: "हा दंड खूप जास्त आहे! ३६% व्याजदर तुम्हाला कर्जाच्या खाईत ढकलू शकतो. डिस्ट्रिब्यूटरला हे वर्षाला १२% - १८% साध्या व्याजावर आणण्यास सांगा.",
      audio: "दादा, हा नियम खूप चुकीचा आहे! ३६% व्याजदर तुम्हाला कर्जात बुडवून टाकेल. हे बदलून १२% साधे व्याज करण्यास सांगा.",
      tip: "डिस्ट्रिब्यूटरला सांगा: 'उशिरा पेमेंटसाठी आम्ही १२% साधे व्याज देण्यास तयार आहोत, पण ३६% चक्रवाढ व्याज खूप जास्त आहे.'",
      whatsapp: "दुकानदोस्त AI अलर्ट! 🚨\nक्लॉज: लेट पेमेंट दंड\nधोका: उच्च (३६% व्याज)\n\nआमचा सल्ला: दादा, हा दंड खूप जास्त आहे. बोलणी करून साधे व्याज १२% करा.",
      email: "प्रिय डिस्ट्रीब्यूटर टीम,\n\nआम्ही कराराचा मसुदा पाहिला आहे. उशिरा पेमेंटसाठी ३६% चक्रवाढ व्याजाचा उल्लेख आहे. आम्ही हे बदलून १२% वार्षिक साधे व्याज करण्याचा प्रस्ताव मांडत आहोत.\n\nसादर,\n[दुकानदाराचे नाव]"
    },
    Termination: {
      advisory: "कोणतीही नोटीस न देता करार रद्द करणे तुमच्या व्यवसायासाठी मोठा धोका आहे. तुमचा माल अडकून पडेल. किमान ३० दिवसांची नोटीस मागून घ्या.",
      audio: "दादा, नोटीसशिवाय करार बंद करणे म्हणजे दुकान बंद करण्यासारखेच आहे. किमान ३० दिवसांची नोटीस अनिवार्य करण्यास सांगा.",
      tip: "डिस्ट्रिब्यूटरला सांगा: 'त्वरित करार संपवल्यास आमचे नुकसान होईल, माल व्यवस्थापित करण्यासाठी ३० दिवसांची नोटीस हवी.'",
      whatsapp: "दुकानदोस्त AI अलर्ट! 🚨\nक्लॉज: एकतर्फी करार रद्द करणे\nधोका: उच्च (नोटीस नाही)\n\nआमचा सल्ला: नोटीसशिवाय करार रद्द केल्यास व्यवसाय ठप्प होऊ शकतो. ३० दिवसांची नोटीस मागून घ्या.",
      email: "प्रिय डिस्ट्रीब्यूटर टीम,\n\nकरार त्वरित रद्द करण्याच्या नियमामुळे आमचे नुकसान होऊ शकते. आम्ही करारात ३० दिवसांची आगाऊ लेखी नोटीस देण्याची अट समाविष्ट करण्याचा प्रस्ताव मांडतो.\n\nसादर,\n[दुकानदाराचे नाव]"
    },
    Pricing: {
      advisory: "माहिती न देता कमिशन बदलणे चुकीचे आहे. तुमचा नफा कधी कमी झाला हे तुम्हाला कळणारही नाही. १५ दिवसांची लेखी नोटीस देण्यास सांगा.",
      audio: "दादा, न विचारता कमिशन बदलणे योग्य नाही. बदलाच्या १५ दिवस आधी लेखी नोटीस देण्याची अट करारात घाला.",
      tip: "डिस्ट्रिब्यूटरला सांगा: 'आम्हाला पारदर्शकता हवी आहे. कमिशन बदलण्यापूर्वी १५ दिवस आधी नोटीस मिळायला हवी.'",
      whatsapp: "दुकानदोस्त AI अलर्ट! 🚨\nक्लॉज: एकतर्फी किंमत बदलणे\nधोका: मध्यम\n\nआमचा सल्ला: नोटीसशिवाय कमिशन बदलणे चुकीचे आहे. १५ दिवसांची लेखी नोटीस अनिवार्य करा.",
      email: "प्रिय डिस्ट्रीब्यूटर टीम,\n\nकमिशन किंवा शुल्कात अचानक बदल केल्यास आम्हाला नियोजन करणे कठीण जाईल. तरी कोणतेही बदल करण्यापूर्वी किमान १५ दिवस आधी लेखी नोटीस मिळावी, अशी विनंती आहे.\n\nसादर,\n[दुकानदाराचे नाव]"
    },
    Liability: {
      advisory: "दिल्ली कोर्टाचे कार्यक्षेत्र खूप खर्चिक ठरेल. कार्यक्षेत्र तुमच्या स्थानिक न्यायालयाचे ठेवण्यास सांगा.",
      audio: "दादा, वादासाठी दिल्ली कोर्टात जाणे खूप महाग पडेल. कायदेशीर कार्यक्षेत्र आपल्या स्थानिक कोर्टाचे ठेवा.",
      tip: "डिस्ट्रिब्यूटरला सांगा: 'कायदेशीर वादांसाठी आम्ही आमच्या स्थानिक न्यायालयाचे कार्यक्षेत्र ठेवू इच्छितो.'",
      whatsapp: "दुकानदोस्त AI अलर्ट! 🚨\nक्लॉज: बाहेरील न्यायालयीन क्षेत्र\nधोका: मध्यम\n\nआमचा सल्ला: दिल्लीला जाणे खर्चिक ठरेल. स्थानिक कोर्टाचे क्षेत्र निश्चित करा.",
      email: "प्रिय डिस्ट्रीब्यूटर टीम,\n\nकायदेशीर वादांसाठी दिल्ली कार्यक्षेत्र ठेवल्यास आम्हाला दिल्लीला जाणे आर्थिकदृष्ट्या कठीण होईल. तरी कायदेशीर कार्यक्षेत्र स्थानिक न्यायालयात बदलावे, ही विनंती.\n\nसादर,\n[दुकानदाराचे नाव]"
    }
  },
  urdu: {
    Penalties: {
      advisory: "یہ جرمانہ بہت زیادہ ہے! 36% شرح سود آپ کو شدید قرض میں پھنسا سکتی ہے۔ ڈسٹری بیوٹر سے کہیں کہ اسے سالانہ 12% - 18% سادہ سود تک کم کرے۔",
      audio: "بھیا، یہ کلاز تو بالکل غلط ہے! 36% سالانہ سود آپ کو بڑے قرض میں پھنسا دے گا۔ اسے ہٹا کر ڈسٹری بیوٹر سے 12% سادہ سود طے کروائیں۔",
      tip: "ڈسٹری بیوٹر سے کہیں: 'ہم تاخیر کے لیے 12% سادہ سود دینے کو تیار ہیں، لیکن 36% مرکب سود بہت زیادہ ہے۔'",
      whatsapp: "دکان دوست AI الرٹ! 🚨\nکلاز: ادائیگی پر جرمانہ\nخطرہ: زیادہ (36% سود)\n\nہماری صلاح: بھیا، یہ جرمانہ بہت زیادہ ہے۔ ڈسٹری بیوٹر سے بات چیت کر کے 12% سادہ سود کروائیں۔",
      email: "محترم ڈسٹری بیوٹر ٹیم،\n\nہم نے معاہدے کا جائزہ لیا ہے۔ تاخیر سے ادائیگی پر 36% سود مقرر کیا گیا ہے جو کہ بہت زیادہ ہے۔ ہم تجویز کرتے ہیں کہ اسے تبدیل کر کے 12% سالانہ سادہ سود کیا جائے۔\n\nشکریہ،\n[دکاندار کا نام]"
    },
    Termination: {
      advisory: "بغیر کسی نوٹس کے معاہدہ فوری ختم کرنا آپ کے کاروبار کے لیے بڑا خطرہ ہے۔ آپ کا اسٹاک پھنس جائے گا۔ کم از کم 30 دن کے نوٹس پیریڈ کا مطالبہ کریں۔",
      audio: "بھیا، بغیر کسی نوٹس کے معاہدہ بند کرنا تو دکان بند کرنے جیسا ہے۔ ڈسٹری بیوٹر سے کہیں کہ کم از کم 30 دن کا تحریری نوٹس لازمی ہو۔",
      tip: "ڈسٹری بیوٹر سے کہیں: 'فوری معاہدہ ختم کرنے سے ہمارا نقصان ہوگا، ہمیں اسٹاک سنبھالنے کے لیے 30 دن کا نوٹس چاہئے۔'",
      whatsapp: "دکان دوست AI الرٹ! 🚨\nکلاز: یکطرفہ خاتمہ\nخطرہ: زیادہ (کوئی نوٹس نہیں)\n\nہماری صلاح: فوری خاتمہ کاروبار کو ٹھپ کر سکتا ہے۔ 30 دن کا تحریری نوٹس مانگیں۔",
      email: "محترم ڈسٹری بیوٹر ٹیم،\n\nمعاہدے کی دفعہ 3 کے تحت فوری خاتمے کا ضابطہ ہمارے کاروبار کے لیے نقصان دہ ہو سکتا ہے۔ ہم تجویز کرتے ہیں کہ معاہدے کو ختم کرنے کے لیے کم از کم 30 دن کا پیشگی نوٹس لازمی کیا جائے۔\n\nشکریہ،\n[دکاندار کا نام]"
    },
    Pricing: {
      advisory: "بغیر بتائے کمیشن تبدیل کرنا غلط ہے۔ آپ کو پتہ بھی نہیں چلے گا اور آپ کا منافع کم ہو جائے گا۔ معاہدے میں لکھوائیں کہ کسی بھی تبدیلی سے پہلے کمپنی 15 دن کا تحریری نوٹس دے گی۔",
      audio: "بھیا، بغیر بتائے فیس یا کمیشن تبدیل کرنا صحیح نہیں ہے۔ معاہدے میں لکھوائیں کہ تبدیلی سے 15 دن پہلے آپ کو نوٹس دیا جائے۔",
      tip: "ڈسٹری بیوٹر سے کہیں: 'بغیر بتائے کمیشن فیس تبدیل کرنا ٹھیک نہیں ہے۔ کسی بھی تبدیلی سے 15 دن پہلے تحریری اطلاع ملنی چاہئے۔'",
      whatsapp: "دکان دوست AI الرٹ! 🚨\nکلاز: یکطرفہ قیمتوں کا تعین\nخطرہ: درمیانہ\n\nہماری صلاح: کمیشن بغیر نوٹس کے بدلنا غلط ہے۔ 15 دن کا پیشگی تحریری نوٹس لازمی شامل کروائیں۔",
      email: "محترم ڈسٹری بیوٹر ٹیم،\n\nکمیشن یا چارجز میں یکطرفہ تبدیلی سے ہماری کاروباری منصوبہ بندی متاثر ہوتی ہے۔ ہم چاہتے ہیں کہ کسی بھی تبدیلی سے کم از کم 15 دن پہلے تحریری نوٹس دیا جائے۔\n\nشکریہ،\n[دکاندار کا نام]"
    },
    Liability: {
      advisory: "دہلی عدالت کا دائرہ اختیار آپ کے لیے بہت مہنگا ہوگا۔ قانونی دائرہ اختیار اپنے مقامی شہر کی عدالت کا رکھوائیں۔",
      audio: "بھیا، کسی بھی تنازعہ کی صورت میں دہلی جانا بہت مہنگا پڑے گا۔ قانونی دائرہ اختیار اپنے مقامی شہر کا طے کروائیں۔",
      tip: "ڈسٹری بیوٹر سے کہیں: 'تنازعات کے حل کے لیے ہم اپنے مقامی شہر کی عدالت کا دائرہ اختیار رکھنا چاہتے ہیں۔'",
      whatsapp: "دکان دوست AI الرٹ! 🚨\nکلاز: بیرونی دائرہ اختیار\nخطرہ: درمیانہ\n\nہماری صلاح: دہلی جانا بہت مہنگا ہوگا۔ مقامی عدالت کا دائرہ اختیار طے کروائیں۔",
      email: "محترم ڈسٹری بیوٹر ٹیم،\n\nدہلی عدالت کا دائرہ اختیار ہمارے لیے مالی طور پر کافی مشکل ہوگا۔ ہم درخواست کرتے ہیں کہ قانونی تنازعات کے حل کے لیے ہمارے مقامی شہر کی عدالت کو مقرر کیا جائے۔\n\nشکریہ،\n[دکاندار کا نام]"
    }
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, orchestrator, n8n, whatsapp
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Interactive Custom States
  const [selectedLanguage, setSelectedLanguage] = useState("hinglish");
  const [expandedProposalIdx, setExpandedProposalIdx] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [copiedTextType, setCopiedTextType] = useState(""); // amendment, email
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [speakingType, setSpeakingType] = useState("advisory"); // advisory or script
  
  // Sub-tabs for the negotiation assistant under flagged clauses (id mapped to active view)
  // Options: amendment, script, email, whatsapp
  const [clauseNegotiationTabs, setClauseNegotiationTabs] = useState({});

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: "Namaste! Main DukaanDost AI 2.0 (powered by Claude Fable 5 Agent Suite) hoon. Apne business contract se juda koi bhi sawaal yahan poochhein ya voice button daba kar bolein."
    }
  ]);
  const [isListening, setIsListening] = useState(false);

  // n8n Automation Canvas State
  const [n8nRunning, setN8nRunning] = useState(false);
  const [n8nActiveNode, setN8nActiveNode] = useState(0); // 0 (idle) to 6 (done)
  const [n8nLogs, setN8nLogs] = useState([
    "System Ready. Awaiting trigger webhook: [POST] /upload-contract"
  ]);

  // WhatsApp Mockup State
  const [whatsappHistory, setWhatsappHistory] = useState([
    { sender: "bot", text: "Namaste bhaiya! Main DukaanDost AI Assistant hoon. Mere paas aapke business agreement ki complete audit report hai. Agar aap contract details check karna chahte hain toh 'Summary' ya 'Risks' type karke bhejhein." }
  ]);
  const [whatsappInput, setWhatsappInput] = useState("");

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const whatsappEndRef = useRef(null);

  // Backend URL
  const BACKEND_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    whatsappEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [whatsappHistory]);

  // Auto-fill WhatsApp messages if a contract is uploaded
  useEffect(() => {
    if (report) {
      const langText = selectedLanguage;
      const initialAlerts = report.flags.map(f => {
        return `*Alert ${f.id}: ${f.category}* (${f.risk_level} Risk)\nSallah: ${f.dukaandost_advisory_text}`;
      }).join("\n\n");

      setWhatsappHistory([
        { sender: "bot", text: `Namaste! Aapka contract "${file?.name || 'Agreement'}" successfully audit ho gaya hai. Humari system ne isme total *${report.total_risks_found} major risks* detect kiye hain.` },
        { sender: "bot", text: `🚨 *Audit Risk Report:*\n\n${initialAlerts}\n\nAap kisi bhi specific category (jaise: 'Penalties' ya 'Termination') par guidance mang sakte hain.` }
      ]);
    }
  }, [report, selectedLanguage]);

  // Speech-to-Text handler
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Aapka browser Speech-to-Text feature support nahi karta. Kripya Google Chrome use karein.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setChatInput(speechToText);
      setIsListening(false);
      handleVoiceQuery(speechToText);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleVoiceQuery = (queryText) => {
    if (!queryText.trim()) return;

    setChatHistory(prev => [...prev, { sender: "user", text: queryText }]);
    setChatInput("");

    setTimeout(() => {
      let botResponse = "Aapke is sawaal par mujhe contract me koi seedha clause nahi mila. Lekin aapko legal protection ke liye written consent leni chahiye.";
      const text = queryText.toLowerCase();

      if (text.includes("terminate") || text.includes("cancel") || text.includes("notice") || text.includes("khatam") || text.includes("band")) {
        botResponse = "Contract ke Section 3 ke mutabik distributor bina kisi notice ke turant contract khatam kar sakta hai (unilateral termination). Yeh high risk hai! Aapko unse bolkar 30 days ka notice period dalwana chahiye.";
      } else if (text.includes("payment") || text.includes("delay") || text.includes("biyaj") || text.includes("interest") || text.includes("paisa") || text.includes("deri")) {
        botResponse = "Section 2 ke mutabik, payment delay hone par aapse 36% saalana interest manga gaya hai, jo ki usurious hai. Standard practice ke mutabik ise 12-18% ke beech hona chahiye.";
      } else if (text.includes("price") || text.includes("pricing") || text.includes("commission") || text.includes("fees")) {
        botResponse = "Section 1 ke anusar company jab chahe pricing ya commissions badal sakti hai bina notice ke. Aap distributor se bole ki aisi kisi bhi change se pehle kam se kam 15 din ka written notification zaroori hai.";
      } else if (text.includes("court") || text.includes("delhi") || text.includes("case") || text.includes("jurisdiction") || text.includes("lafda")) {
        botResponse = "Section 4 ke mutabik saare legal disputes sirf New Delhi me honge. Local jurisdiction Ranchi ka hi set karne ko kahein, warna Delhi court jana bohot mehenga hoga.";
      } else if (text.includes("safe") || text.includes("kaisa") || text.includes("theek") || text.includes("surakshit")) {
        botResponse = "Yeh contract abhi safe nahi hai. Isme payment penalty (36% interest) aur unilateral termination risk bohot zyada hai. In clauses ko change karaye bina ise sign na karein.";
      }

      setChatHistory(prev => [...prev, { sender: "bot", text: botResponse }]);
      
      // Speak the bot response
      const utterance = new SpeechSynthesisUtterance(botResponse);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india'));
      if (hindiVoice) utterance.voice = hindiVoice;
      window.speechSynthesis.speak(utterance);
    }, 800);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      await processFile(droppedFile, selectedLanguage);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      await processFile(selectedFile, selectedLanguage);
    }
  };

  // Process RAG Audit with FastAPI
  const processFile = async (selectedFile, lang) => {
    setFile(selectedFile);
    setLoading(true);
    setErrorMessage("");
    setReport(null);

    // Trigger n8n animation workflow steps
    runN8nWorkflowSteps(selectedFile.name);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${BACKEND_URL}/upload-contract?language=${lang}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Server failed to process document.");
      }

      const data = await response.json();
      
      // Setup default negotiation sub-tabs
      const initialTabs = {};
      data.report.flags.forEach(f => {
        initialTabs[f.id] = "amendment";
      });
      setClauseNegotiationTabs(initialTabs);

      setReport(data.report);
      
      setChatHistory([
        {
          sender: "bot",
          text: `Aapka contract audit completed! Total ${data.report.total_risks_found} risks flagged by the Agentic AI. Choose a regional language to translate instantly, or speak to me for guidance.`
        }
      ]);
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage("FastAPI local server unreachable. Running in Offline Demo Mode...");
      
      setTimeout(() => {
        const dummyReport = generateLocalMockReport(lang);
        
        const initialTabs = {};
        dummyReport.flags.forEach(f => {
          initialTabs[f.id] = "amendment";
        });
        setClauseNegotiationTabs(initialTabs);

        setReport(dummyReport);
        setChatHistory([
          {
            sender: "bot",
            text: `[Offline Mode] Contract "${selectedFile.name}" audited successfully. Found ${dummyReport.total_risks_found} major anomalies.`
          }
        ]);
        setLoading(false);
      }, 1500);
      return;
    }
    setLoading(false);
  };

  // Load sample contract
  const loadSampleContract = () => {
    setLoading(true);
    setErrorMessage("");
    const sampleName = "Sample_Distributor_Agreement.txt";
    setFile({ name: sampleName });
    runN8nWorkflowSteps(sampleName);
    
    setTimeout(() => {
      const dummyReport = generateLocalMockReport(selectedLanguage);
      
      const initialTabs = {};
      dummyReport.flags.forEach(f => {
        initialTabs[f.id] = "amendment";
      });
      setClauseNegotiationTabs(initialTabs);

      setReport(dummyReport);
      setChatHistory([
        {
          sender: "bot",
          text: `Sample Distributor Contract loaded and audited. We found ${dummyReport.total_risks_found} flags in payment penalty, termination notice, and pricing commission terms.`
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  // Generate fallback local mock data matching chosen language
  const generateLocalMockReport = (lang) => {
    const selectedLang = lang && typeof lang === "string" ? lang.toLowerCase() : "hinglish";
    const localized = LOCALIZED_MOCK_DATA[selectedLang] || LOCALIZED_MOCK_DATA["hinglish"];

    return {
      is_mock: true,
      overall_safety_score: 42,
      risk_status: "Danger Zone",
      total_risks_found: 3,
      flags: [
        {
          id: 1,
          contract_quote: "In case of any delay in payments, the merchant shall pay an interest rate of 36% per annum compounded monthly.",
          category: "Penalties",
          risk_level: "HIGH",
          indian_law_reference: "Section 74, Indian Contract Act 1872",
          dukaandost_advisory_text: localized["Penalties"]["advisory"],
          audio_script_hinglish: localized["Penalties"]["audio"],
          negotiation_tip: localized["Penalties"]["tip"],
          counter_proposal_en: "In case of any payment delays, the Merchant shall pay simple interest at a rate of 12% per annum, calculated on a daily basis.",
          email_draft: localized["Penalties"]["email"],
          whatsapp_payload: `${localized["Penalties"]["whatsapp"]}\n\n*Proposed Legal Amendment:*\nIn case of any payment delays, the Merchant shall pay simple interest at a rate of 12% per annum, calculated daily.`
        },
        {
          id: 2,
          contract_quote: "The distributor reserves the right to terminate this agreement immediately at its sole discretion without any notice period.",
          category: "Termination",
          risk_level: "HIGH",
          indian_law_reference: "Unfair Contract Terms, Indian Contract Act 1872",
          dukaandost_advisory_text: localized["Termination"]["advisory"],
          audio_script_hinglish: localized["Termination"]["audio"],
          negotiation_tip: localized["Termination"]["tip"],
          counter_proposal_en: "Either party may terminate this agreement by providing at least 30 days prior written notice to the other party.",
          email_draft: localized["Termination"]["email"],
          whatsapp_payload: `${localized["Termination"]["whatsapp"]}\n\n*Proposed Legal Amendment:*\nEither party may terminate this agreement by providing at least 30 days prior written notice.`
        },
        {
          id: 3,
          contract_quote: "The company may alter commission structures and product listings at any time without any prior written notification to the merchant.",
          category: "Pricing",
          risk_level: "MEDIUM",
          indian_law_reference: "Consumer Protection (E-Commerce) Rules 2020",
          dukaandost_advisory_text: localized["Pricing"]["advisory"],
          audio_script_hinglish: localized["Pricing"]["audio"],
          negotiation_tip: localized["Pricing"]["tip"],
          counter_proposal_en: "Any changes to the commission structure, listing fees, or charges must be notified to the Merchant in writing at least 15 days in advance.",
          email_draft: localized["Pricing"]["email"],
          whatsapp_payload: `${localized["Pricing"]["whatsapp"]}\n\n*Proposed Legal Amendment:*\nAny changes to the fees must be notified in writing at least 15 days in advance.`
        }
      ],
      agent_steps: [
        {
          agent: "Contract Parser Agent",
          status: "COMPLETED",
          timestamp: new Date().toLocaleTimeString(),
          log: "Successfully parsed contract document. Identified structural blocks and segmented text into 4 legal clauses.",
          duration: "240ms"
        },
        {
          agent: "Risk Detector Agent",
          status: "COMPLETED",
          timestamp: new Date().toLocaleTimeString(),
          log: "Scanned segmented paragraphs. Flagged 3 clauses with elevated risk levels: usurious penalty interest, immediate termination, and unilateral pricing power.",
          duration: "420ms"
        },
        {
          agent: "Legal Research Agent",
          status: "COMPLETED",
          timestamp: new Date().toLocaleTimeString(),
          log: "Queried local FAISS vector store. Retrieved 3 matching statutes: Section 74, Section 28 (Indian Contract Act 1872) and Consumer Protection Rules 2020.",
          duration: "350ms"
        },
        {
          agent: "Negotiation Assistant Agent",
          status: "COMPLETED",
          timestamp: new Date().toLocaleTimeString(),
          log: "Generated legal counter-proposals in standard English, alongside conversational Hinglish/regional-language speaking scripts.",
          duration: "510ms"
        },
        {
          agent: "Report Generator Agent",
          status: "COMPLETED",
          timestamp: new Date().toLocaleTimeString(),
          log: "Compiled safety audit metrics, aggregated overall score of 42 (Danger Zone), and prepared WhatsApp-ready payload reports.",
          duration: "180ms"
        }
      ]
    };
  };

  // Language Switch handler
  const handleLanguageChange = async (lang) => {
    setSelectedLanguage(lang);
    if (!file) return;

    setLoading(true);
    if (file.name === "Sample_Distributor_Agreement.txt" || report?.is_mock) {
      setTimeout(() => {
        const dummyReport = generateLocalMockReport(lang);
        setReport(dummyReport);
        setLoading(false);
      }, 500);
      return;
    }

    // Call API with new language query parameter
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch(`${BACKEND_URL}/upload-contract?language=${lang}`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
      } else {
        setReport(generateLocalMockReport(lang));
      }
    } catch (err) {
      setReport(generateLocalMockReport(lang));
    }
    setLoading(false);
  };

  // Text to Speech (🔊 Suno option)
  const handleSpeakText = (text, idx, type = "advisory") => {
    if (speakingIdx === idx && speakingType === type) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose appropriate voice/language depending on selection
    if (selectedLanguage === "english") {
      utterance.lang = "en-IN";
    } else if (selectedLanguage === "bengali") {
      utterance.lang = "bn-IN";
    } else if (selectedLanguage === "tamil") {
      utterance.lang = "ta-IN";
    } else if (selectedLanguage === "telugu") {
      utterance.lang = "te-IN";
    } else if (selectedLanguage === "marathi") {
      utterance.lang = "mr-IN";
    } else {
      utterance.lang = "hi-IN"; // Hindi voice for Hinglish, Hindi, and Urdu
    }

    utterance.rate = 0.92;
    
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => 
      v.lang.toLowerCase().includes(utterance.lang.toLowerCase()) ||
      v.name.toLowerCase().includes("india")
    );
    
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    
    utterance.onend = () => {
      setSpeakingIdx(null);
    };
    
    setSpeakingIdx(idx);
    setSpeakingType(type);
    window.speechSynthesis.speak(utterance);
  };

  // WhatsApp payload share handler
  const handleShareWhatsApp = (payload) => {
    const encodedText = encodeURIComponent(payload);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  // Copy helper
  const handleCopyText = (text, idx, type) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setCopiedTextType(type);
    setTimeout(() => {
      setCopiedIdx(null);
      setCopiedTextType("");
    }, 2000);
  };

  // Chatbot message sender
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    handleVoiceQuery(chatInput);
  };

  // WhatsApp Mobile simulator submission
  const handleSendWhatsAppMessage = (e) => {
    e.preventDefault();
    if (!whatsappInput.trim()) return;

    const userText = whatsappInput;
    setWhatsappHistory(prev => [...prev, { sender: "user", text: userText }]);
    setWhatsappInput("");

    setTimeout(() => {
      let botText = "Bhaiya, is baare me humein contract me koi clause nahi mila. Kya aap negotiation draft ke baare me poochhna chahte hain?";
      const input = userText.toLowerCase();

      if (input.includes("summary") || input.includes("kya hai") || input.includes("details")) {
        botText = report 
          ? `*Audit Summary:*\nSafety Score: ${report.overall_safety_score}/100 (${report.risk_status})\nTotal Risks: ${report.total_risks_found}.\n\nHumari sallah hai ki Penalties aur Termination clauses change karwayein.`
          : "Bhaiya, pehle aap local contract file upload karein taaki hum uska audit summary dikha sakein.";
      } else if (input.includes("penalty") || input.includes("delay") || input.includes("interest") || input.includes("biyaj") || input.includes("paisa")) {
        botText = "🚨 *Payment Penalty Risk:*\nLate payment par 36% interest compounded monthly rate likha hai. Yeh bohot usurious hai.\n\n*Proposed Legal Amendment:*\n`In case of any payment delays, the Merchant shall pay simple interest at a rate of 12% per annum.`";
      } else if (input.includes("termination") || input.includes("notice") || input.includes("khatam")) {
        botText = "🚨 *Termination Risk:*\nDistributor ke paas immediate cancel karne ka unilateral option hai bina notice ke.\n\n*Proposed Legal Amendment:*\n`Either party may terminate this agreement by providing at least 30 days prior written notice.`";
      } else if (input.includes("pricing") || input.includes("commission") || input.includes("rates")) {
        botText = "🚨 *Pricing Unilateral Adjustment Risk:*\nCompany fees ya listings bina notice ke alter kar sakti hai.\n\n*Proposed Legal Amendment:*\n`Any changes must be notified in writing at least 15 days in advance.`";
      } else if (input.includes("jurisdiction") || input.includes("court") || input.includes("case") || input.includes("delhi")) {
        botText = "🚨 *Legal Jurisdiction Risk:*\nDisputes exclusive Delhi court jurisdiction me honge. Ise locally रांची/local set karwayein.";
      }

      setWhatsappHistory(prev => [...prev, { sender: "bot", text: botText }]);
    }, 700);
  };

  // Run live animation of the n8n automation canvas
  const runN8nWorkflowSteps = (filename = "Merchant_Contract.pdf") => {
    setN8nRunning(true);
    setN8nActiveNode(1);
    setN8nLogs([`[TRIGGER] File Upload webhook received for: ${filename}`]);

    const stepIntervals = [
      { node: 2, msg: "[n8n Node 2] Document Processing: Extracting text from agreement stream via PDF Plumber...", delay: 800 },
      { node: 3, msg: "[n8n Node 3] Risk Analysis: Scanning for liability anomalies, payment penalties, and immediate cancellations...", delay: 1600 },
      { node: 4, msg: "[n8n Node 4] Legal Database: Index matching with FAISS on Section 74 & 28 (Indian Contract Act 1872)...", delay: 2400 },
      { node: 5, msg: "[n8n Node 5] Proposal Gen: Formulating legal amendments and localized Hinglish speaking drafts...", delay: 3200 },
      { node: 6, msg: "[n8n Node 6] WhatsApp Hook: Packaging alerts and sending secure payloads to WhatsApp simulated client.", delay: 4000 },
      { node: 0, msg: "[SUCCESS] Automated n8n workflow pipeline run completed successfully. All webhook responses stored.", delay: 4800 }
    ];

    stepIntervals.forEach(step => {
      setTimeout(() => {
        setN8nActiveNode(step.node);
        setN8nLogs(prev => [...prev, step.msg]);
        if (step.node === 0) setN8nRunning(false);
      }, step.delay);
    });
  };

  // Circular progress properties for safety score
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = report ? circumference - (report.overall_safety_score / 100) * circumference : 0;
  
  let strokeColor = "#10B981"; // Emerald-500
  let glowColor = "rgba(16, 185, 129, 0.4)";
  if (report) {
    if (report.overall_safety_score < 50) {
      strokeColor = "#EF4444"; // Red-500
      glowColor = "rgba(239, 68, 68, 0.4)";
    } else if (report.overall_safety_score < 80) {
      strokeColor = "#F59E0B"; // Amber-500
      glowColor = "rgba(245, 158, 11, 0.4)";
    }
  }

  const getRiskStyles = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH':
        return {
          bg: 'bg-red-500/5 border border-red-500/20 text-red-200',
          iconColor: 'text-red-400'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/5 border border-amber-500/20 text-amber-200',
          iconColor: 'text-amber-400'
        };
      default:
        return {
          bg: 'bg-emerald-500/5 border border-emerald-500/20 text-emerald-200',
          iconColor: 'text-emerald-400'
        };
    }
  };

  return (
    <div className="min-h-screen pb-12 text-gray-100 flex flex-col items-center relative">
      {/* Dynamic Animated Glow Backdrops */}
      <div className="glow-bg">
        <div className="glow-spot-1" />
        <div className="glow-spot-2" />
        <div className="glow-spot-3" />
      </div>
      
      {/* Header */}
      <header className="w-full max-w-6xl px-6 pt-10 pb-6 flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/10">
        <div className="flex items-center gap-3 group">
          <div className="bg-gradient-to-tr from-amber-500 to-orange-500 p-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
            <Scale className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent flex items-center gap-2">
              DukaanDost AI 2.0
              <span className="text-[9px] bg-amber-500/15 border border-amber-500/35 text-amber-300 font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Agentic Bharat
              </span>
            </h1>
            <p className="text-[10px] text-amber-400 font-bold tracking-wider uppercase mt-0.5">
              Multilingual Legal Assistant & Audit Suite
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
          {/* Global Language Selector */}
          <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 hover:border-amber-500/30 px-3 py-2 rounded-xl transition-all duration-300">
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <select 
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-xs bg-transparent text-gray-300 outline-none cursor-pointer border-none font-bold"
            >
              <option value="hinglish" className="bg-gray-900">Hinglish (Default)</option>
              <option value="english" className="bg-gray-900">English (Original)</option>
              <option value="hindi" className="bg-gray-900">Hindi (हिंदी)</option>
              <option value="bengali" className="bg-gray-900">Bengali (বাংলা)</option>
              <option value="tamil" className="bg-gray-900">Tamil (தமிழ்)</option>
              <option value="telugu" className="bg-gray-900">Telugu (తెలుగు)</option>
              <option value="marathi" className="bg-gray-900">Marathi (मराठी)</option>
              <option value="urdu" className="bg-gray-900">Urdu (اردو)</option>
            </select>
          </div>

          <button 
            onClick={loadSampleContract} 
            className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 hover:border-amber-500/40 transition-all text-amber-300 flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            Load Sample Contract
          </button>
          
          <div className="text-xs text-gray-400 flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 rounded-full border border-white/5 cursor-default">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            FastAPI Online
          </div>
        </div>
      </header>

      {/* Tab Selector Navigation */}
      <div className="w-full max-w-6xl px-6 mt-6">
        <div className="flex border-b border-white/5 gap-1 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "dashboard"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab("orchestrator")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "orchestrator"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> Agent Orchestrator
          </button>
          
          <button
            onClick={() => setActiveTab("n8n")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "n8n"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Workflow className="w-3.5 h-3.5" /> n8n Automation
          </button>
          
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "whatsapp"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> WhatsApp Agent
          </button>
        </div>
      </div>

      {/* Main Contents based on selected tab */}
      <main className="w-full max-w-6xl px-6 mt-8 flex-1">
        
        {/* ==================== DASHBOARD TAB ==================== */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Upload & Audit report */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Uploader Box */}
              {!report && (
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                  className={`w-full py-20 px-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-500 group ${
                    dragActive 
                      ? "border-amber-500 bg-amber-950/20 shadow-lg shadow-amber-500/10" 
                      : "border-white/10 bg-slate-900/30 hover:border-amber-500/30 hover:bg-slate-900/50 hover:shadow-lg"
                  }`}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    onChange={handleFileChange}
                    accept=".pdf,.txt"
                    className="hidden"
                  />
                  
                  {loading ? (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <RefreshCw className="w-12 h-12 text-amber-500 animate-spin" />
                      <p className="font-semibold text-lg text-white">Analyzing Agreement Documents...</p>
                      <p className="text-sm text-gray-400">FAISS vector store matching & 5-agent auditing in progress...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-2 transition-all duration-300 group-hover:scale-110">
                        <UploadCloud className="w-8 h-8 text-amber-400" />
                      </div>
                      <p className="font-semibold text-lg text-white">Upload Distributor / Lease / Vendor Agreement</p>
                      <p className="text-sm text-gray-400 max-w-sm">
                        Drag & drop your contract PDF or TXT file here. We will instantly audit risks and draft negotiation options.
                      </p>
                      <span className="mt-4 px-5 py-2.5 text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-xl shadow-lg shadow-amber-500/20">
                        Browse Files
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Error Banner */}
              {errorMessage && (
                <div className="w-full p-4 bg-orange-950/20 border border-orange-500/20 rounded-xl flex gap-3 text-orange-400 text-sm">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Report view */}
              {report && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  
                  {/* Top toolbar */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-semibold text-gray-300 truncate max-w-[280px]">{file?.name || "Agreement Contract"}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Language Switcher dropdown */}
                      <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 px-2.5 py-1.5 rounded-xl hover:border-amber-500/30">
                        <Languages className="w-3.5 h-3.5 text-gray-400" />
                        <select 
                          value={selectedLanguage}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="text-xs bg-transparent text-gray-300 outline-none cursor-pointer border-none font-semibold"
                        >
                          <option value="hinglish" className="bg-gray-900">Hinglish (Default)</option>
                          <option value="english" className="bg-gray-900">English (Original)</option>
                          <option value="hindi" className="bg-gray-900">Hindi (हिंदी)</option>
                          <option value="bengali" className="bg-gray-900">Bengali (বাংলা)</option>
                          <option value="tamil" className="bg-gray-900">Tamil (தமிழ்)</option>
                          <option value="telugu" className="bg-gray-900">Telugu (తెలుగు)</option>
                          <option value="marathi" className="bg-gray-900">Marathi (मराठी)</option>
                          <option value="urdu" className="bg-gray-900">Urdu (اردو)</option>
                        </select>
                      </div>

                      <button 
                        onClick={() => { setReport(null); setFile(null); setErrorMessage(""); }}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Audit New
                      </button>
                    </div>
                  </div>

                  {/* Safety Score Meter card */}
                  <div className="glass p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 flex flex-col justify-center items-center text-center p-4 border-r border-white/5">
                      <div className="relative flex items-center justify-center w-28 h-28">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            className="stroke-gray-800/80"
                            strokeWidth="5"
                            fill="transparent"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            stroke={strokeColor}
                            strokeWidth="5"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                            style={{
                              filter: `drop-shadow(0 0 6px ${glowColor})`
                            }}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span 
                            className="text-3xl font-black text-white tracking-tighter" 
                            style={{ textShadow: `0 0 12px ${glowColor}` }}
                          >
                            {report.overall_safety_score}
                          </span>
                          <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-widest">SAFETY</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                          report.risk_status === "Danger Zone"
                            ? "bg-red-950/40 text-red-400 border border-red-500/20" 
                            : report.risk_status === "Warning"
                            ? "bg-yellow-950/40 text-yellow-400 border border-yellow-500/20"
                            : "bg-green-950/40 text-green-400 border border-green-500/20"
                        }`}>
                          {report.risk_status}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-250 mb-2 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-purple-400" />
                          Executive Audit Summary
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          This contract contains usurious penalty triggers and unilateral termination features. Signing this agreement puts the retailer under unfair liabilities. We advise revising the clauses utilizing the drafts generated below.
                        </p>
                      </div>
                      
                      <div className="flex gap-4 mt-6 pt-4 border-t border-white/5">
                        <div className="flex-1 text-center bg-red-500/5 rounded-xl p-3 border border-red-500/20">
                          <span className="block text-xl font-extrabold text-red-400">{report.flags.filter(f => f.risk_level === 'HIGH').length}</span>
                          <span className="text-[9px] text-red-400/80 font-bold uppercase tracking-wider">High Risk</span>
                        </div>
                        <div className="flex-1 text-center bg-amber-500/5 rounded-xl p-3 border border-amber-500/20">
                          <span className="block text-xl font-extrabold text-amber-400">{report.flags.filter(f => f.risk_level === 'MEDIUM').length}</span>
                          <span className="text-[9px] text-amber-400/80 font-bold uppercase tracking-wider">Medium Risk</span>
                        </div>
                        <div className="flex-1 text-center bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/20">
                          <span className="block text-xl font-extrabold text-emerald-400">{report.flags.filter(f => f.risk_level === 'LOW').length}</span>
                          <span className="text-[9px] text-emerald-400/80 font-bold uppercase tracking-wider">Low Risk</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flagged Clause List */}
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <Scale className="w-4 h-4 text-purple-400" />
                      Flagged Contract Clauses ({report.total_risks_found})
                    </h3>
                    
                    {report.flags.map((flag, idx) => (
                      <div 
                        key={idx} 
                        className={`glass-card rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 ${
                          flag.risk_level === 'HIGH' 
                            ? 'border-risk-high card-high shadow-lg' 
                            : flag.risk_level === 'MEDIUM' 
                            ? 'border-risk-medium card-medium shadow-lg' 
                            : 'border-risk-low card-low shadow-lg'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="px-5 py-3.5 bg-white/5 flex flex-wrap items-center justify-between gap-3 border-b border-white/5">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-bold text-white">{flag.category}</span>
                            <span className="text-gray-650">•</span>
                            <span className="text-[10px] text-gray-450">{flag.indian_law_reference}</span>
                          </div>
                          
                          <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-md tracking-wider border ${
                            flag.risk_level === 'HIGH' 
                              ? 'bg-red-950/30 text-red-400 border-red-500/25' 
                              : flag.risk_level === 'MEDIUM'
                              ? 'bg-yellow-950/30 text-yellow-400 border-yellow-500/25'
                              : 'bg-green-950/30 text-green-400 border-green-500/25'
                          }`}>
                            {flag.risk_level} RISK
                          </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex flex-col gap-4">
                          {/* Clause Quote */}
                          <div>
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Contract Quote:</span>
                            <div className="p-3 bg-slate-950/70 rounded-xl border border-white/5 text-[11px] italic text-gray-300 font-mono leading-relaxed">
                              "{flag.contract_quote}"
                            </div>
                          </div>

                          {/* Multilingual advisory card */}
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">
                                DukaanDost Sallah (Advisory):
                              </span>
                              
                              <div className="flex gap-1.5">
                                <button 
                                  onClick={() => handleSpeakText(flag.dukaandost_advisory_text, flag.id, "advisory")}
                                  className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-all ${
                                    speakingIdx === flag.id && speakingType === "advisory"
                                      ? "bg-red-950/25 text-red-400 border-red-500/30 animate-pulse" 
                                      : "bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20"
                                  }`}
                                >
                                  {speakingIdx === flag.id && speakingType === "advisory" ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                  {speakingIdx === flag.id && speakingType === "advisory" ? "Stop" : "🔊 Suno"}
                                </button>
                                
                                <button 
                                  onClick={() => handleShareWhatsApp(flag.whatsapp_payload)}
                                  className="px-2.5 py-0.5 rounded-lg bg-green-950/20 text-green-400 border border-green-500/25 hover:bg-green-950/30 text-[9px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-all"
                                >
                                  <Share2 className="w-3 h-3" /> WhatsApp
                                </button>
                              </div>
                            </div>
                            
                            <div className={`p-4 rounded-xl flex gap-3 ${getRiskStyles(flag.risk_level).bg}`}>
                              <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${getRiskStyles(flag.risk_level).iconColor}`} />
                              <p className="text-xs leading-relaxed font-semibold">
                                {flag.dukaandost_advisory_text}
                              </p>
                            </div>
                          </div>

                          {/* Expanded Negotiation Helper panel */}
                          <div className="mt-2 border-t border-white/5 pt-4">
                            <button 
                              onClick={() => setExpandedProposalIdx(expandedProposalIdx === flag.id ? null : flag.id)}
                              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
                            >
                              <MessageSquareQuote className="w-4 h-4" />
                              {expandedProposalIdx === flag.id ? "Hide Negotiation Assistant" : "💡 Open Negotiation Assistant (Counter-Proposals)"}
                            </button>
                            
                            {expandedProposalIdx === flag.id && (
                              <div className="mt-3 bg-slate-950/80 rounded-xl border border-white/10 overflow-hidden flex flex-col">
                                {/* Sub-Tab headers */}
                                <div className="flex bg-white/5 border-b border-white/5 text-[10px] font-extrabold uppercase tracking-wide">
                                  <button
                                    onClick={() => setClauseNegotiationTabs(prev => ({ ...prev, [flag.id]: "amendment" }))}
                                    className={`px-3 py-2 flex-1 border-b-2 transition-all ${
                                      (clauseNegotiationTabs[flag.id] || "amendment") === "amendment"
                                        ? "border-amber-500 text-amber-400 bg-white/5"
                                        : "border-transparent text-gray-400 hover:text-white"
                                    }`}
                                  >
                                    Legal Amendment
                                  </button>
                                  <button
                                    onClick={() => setClauseNegotiationTabs(prev => ({ ...prev, [flag.id]: "script" }))}
                                    className={`px-3 py-2 flex-1 border-b-2 transition-all ${
                                      clauseNegotiationTabs[flag.id] === "script"
                                        ? "border-amber-500 text-amber-400 bg-white/5"
                                        : "border-transparent text-gray-400 hover:text-white"
                                    }`}
                                  >
                                    Dialogue Script
                                  </button>
                                  <button
                                    onClick={() => setClauseNegotiationTabs(prev => ({ ...prev, [flag.id]: "email" }))}
                                    className={`px-3 py-2 flex-1 border-b-2 transition-all ${
                                      clauseNegotiationTabs[flag.id] === "email"
                                        ? "border-amber-500 text-amber-400 bg-white/5"
                                        : "border-transparent text-gray-400 hover:text-white"
                                    }`}
                                  >
                                    Email Draft
                                  </button>
                                </div>

                                {/* Sub-Tab Content */}
                                <div className="p-4 text-xs">
                                  
                                  {/* Legal Amendment (English) */}
                                  {((clauseNegotiationTabs[flag.id] || "amendment") === "amendment") && (
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Proposed Contract Replacement Clause (English):</span>
                                        <button
                                          onClick={() => handleCopyText(flag.counter_proposal_en, flag.id, "amendment")}
                                          className="text-[10px] text-amber-400 flex items-center gap-1 hover:text-amber-300 font-bold"
                                        >
                                          {copiedIdx === flag.id && copiedTextType === "amendment" ? <Check className="w-3 h-3 text-emerald-450" /> : <Copy className="w-3 h-3" />}
                                          {copiedIdx === flag.id && copiedTextType === "amendment" ? "Copied" : "Copy Amendment"}
                                        </button>
                                      </div>
                                      <div className="p-3 bg-slate-900 rounded-lg border border-white/5 font-mono text-[11px] text-emerald-300 select-all leading-relaxed">
                                        {flag.counter_proposal_en}
                                      </div>
                                    </div>
                                  )}

                                  {/* Dialogue Script */}
                                  {clauseNegotiationTabs[flag.id] === "script" && (
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Kya bol kar baat karein (Speaking Script):</span>
                                        <button
                                          onClick={() => handleSpeakText(flag.audio_script_hinglish, flag.id, "script")}
                                          className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-all ${
                                            speakingIdx === flag.id && speakingType === "script"
                                              ? "bg-red-950/25 text-red-400 border-red-500/30 animate-pulse" 
                                              : "bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20"
                                          }`}
                                        >
                                          {speakingIdx === flag.id && speakingType === "script" ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                          {speakingIdx === flag.id && speakingType === "script" ? "Stop" : "🔊 Bol Kar Sunao"}
                                        </button>
                                      </div>
                                      <div className="p-3.5 bg-amber-500/5 rounded-lg border border-amber-500/10 text-amber-200/90 leading-relaxed italic">
                                        "{flag.audio_script_hinglish}"
                                      </div>
                                      <p className="text-[10px] text-gray-500 font-medium">💡 Tip: {flag.negotiation_tip}</p>
                                    </div>
                                  )}

                                  {/* Email Draft */}
                                  {clauseNegotiationTabs[flag.id] === "email" && (
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Professional Email Draft:</span>
                                        <button
                                          onClick={() => handleCopyText(flag.email_draft || `Please revise clause: ${flag.category}`, flag.id, "email")}
                                          className="text-[10px] text-amber-400 flex items-center gap-1 hover:text-amber-300 font-bold"
                                        >
                                          {copiedIdx === flag.id && copiedTextType === "email" ? <Check className="w-3 h-3 text-emerald-450" /> : <Copy className="w-3 h-3" />}
                                          {copiedIdx === flag.id && copiedTextType === "email" ? "Copied" : "Copy Email"}
                                        </button>
                                      </div>
                                      <pre className="p-3 bg-slate-900 rounded-lg border border-white/5 text-[11px] text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                                        {flag.email_draft || `Dear Distributor Team,\n\nWe propose an amendment to the ${flag.category} terms:\n\n${flag.counter_proposal_en}\n\nRegards,\n[Merchant]`}
                                      </pre>
                                    </div>
                                  )}

                                </div>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>

            {/* Right Column: Chatbot */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="glass-chatbot p-5 rounded-2xl flex flex-col h-[560px] justify-between">
                
                {/* Chat Header */}
                <div className="pb-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <div>
                      <h3 className="font-bold text-xs text-white">Ask DukaanDost AI</h3>
                      <p className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">Voice Assistant</p>
                    </div>
                  </div>
                  
                  {/* Speech mic activation button */}
                  <button 
                    onClick={startListening}
                    className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                      isListening 
                        ? "bg-red-500 border-red-400 text-white animate-pulse" 
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                    }`}
                    title="Tap to speak"
                  >
                    {isListening ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                {/* Message logs */}
                <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4 pr-1 text-xs">
                  {chatHistory.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                      }`}
                    >
                      <span className="text-[9px] text-gray-500 font-extrabold uppercase mb-0.5">
                        {msg.sender === "user" ? "You" : "DukaanDost"}
                      </span>
                      
                      <div className={`p-3 rounded-2xl leading-relaxed font-semibold ${
                        msg.sender === "user" 
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-tr-none shadow-md shadow-amber-500/10" 
                          : "bg-slate-900/80 text-gray-200 border border-white/5 rounded-tl-none shadow-sm"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Suggestions tags */}
                {report && (
                  <div className="pb-3 border-t border-white/5 pt-3 flex flex-wrap gap-1">
                    <button 
                      onClick={() => handleVoiceQuery("Is this contract safe for my shop?")}
                      className="px-2 py-0.5 text-[9px] font-bold bg-white/5 border border-white/5 rounded-full text-gray-400 hover:text-amber-300 hover:border-amber-500/30 transition-all cursor-pointer"
                    >
                      Is it safe?
                    </button>
                    <button 
                      onClick={() => handleVoiceQuery("What is the penalty for late payment?")}
                      className="px-2 py-0.5 text-[9px] font-bold bg-white/5 border border-white/5 rounded-full text-gray-400 hover:text-amber-300 hover:border-amber-500/30 transition-all cursor-pointer"
                    >
                      Late Penalty
                    </button>
                    <button 
                      onClick={() => handleVoiceQuery("Explain the termination clause.")}
                      className="px-2 py-0.5 text-[9px] font-bold bg-white/5 border border-white/5 rounded-full text-gray-400 hover:text-amber-300 hover:border-amber-500/30 transition-all cursor-pointer"
                    >
                      Termination
                    </button>
                  </div>
                )}

                {/* Input box */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={isListening ? "Listening... Please speak in Hinglish/Hindi" : "Ask about late fees, notice periods..."}
                    disabled={isListening}
                    className="flex-1 px-4 py-2.5 bg-black/40 border border-white/5 focus:border-amber-500/40 rounded-xl text-xs text-white placeholder-gray-500 outline-none transition-all disabled:opacity-50"
                  />
                  
                  <button 
                    type="submit"
                    className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            </div>

          </div>
        )}

        {/* ==================== AGENT ORCHESTRATOR TAB ==================== */}
        {activeTab === "orchestrator" && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="glass p-6 rounded-2xl">
              <h2 className="text-lg font-black text-white flex items-center gap-2 mb-2">
                <Cpu className="w-5 h-5 text-amber-500" /> Multi-Agent Legal Suite Architecture
              </h2>
              <p className="text-xs text-gray-450 leading-relaxed mb-6">
                Our platform orchestrates 5 autonomous agents to ingest agreements, discover loop-holes, consult local vector search datasets, draft counter proposals, and alert shopkeepers instantly.
              </p>

              {/* Grid of 5 Agents */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                
                {/* Agent 1 */}
                <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-[180px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 text-[8px] font-bold text-amber-400 bg-amber-500/10 rounded-bl-lg">AGENT 1</div>
                  <div>
                    <div className="p-2 bg-purple-500/10 rounded-lg w-fit border border-purple-500/20 mb-3 text-purple-400">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs text-white">Contract Parser</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-normal">Segregates complex agreement documents into raw text paragraphs.</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-4 pt-2 border-t border-white/5">
                    <span className="text-gray-400">Status</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> COMPLETED</span>
                  </div>
                </div>

                {/* Agent 2 */}
                <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-[180px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 text-[8px] font-bold text-amber-400 bg-amber-500/10 rounded-bl-lg">AGENT 2</div>
                  <div>
                    <div className="p-2 bg-red-500/10 rounded-lg w-fit border border-red-500/20 mb-3 text-red-400">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs text-white">Risk Detector</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-normal">Filters predatory fees, extreme penalties, and unilateral liabilities.</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-4 pt-2 border-t border-white/5">
                    <span className="text-gray-400">Status</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> COMPLETED</span>
                  </div>
                </div>

                {/* Agent 3 */}
                <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-[180px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 text-[8px] font-bold text-amber-400 bg-amber-500/10 rounded-bl-lg">AGENT 3</div>
                  <div>
                    <div className="p-2 bg-blue-500/10 rounded-lg w-fit border border-blue-500/20 mb-3 text-blue-400">
                      <Scale className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs text-white">Legal Researcher</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-normal">Matches anomalies against the Indian Contract Act 1872 vector indexes.</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-4 pt-2 border-t border-white/5">
                    <span className="text-gray-400">Status</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> COMPLETED</span>
                  </div>
                </div>

                {/* Agent 4 */}
                <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-[180px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 text-[8px] font-bold text-amber-400 bg-amber-500/10 rounded-bl-lg">AGENT 4</div>
                  <div>
                    <div className="p-2 bg-amber-500/10 rounded-lg w-fit border border-amber-500/20 mb-3 text-amber-400">
                      <MessageSquareQuote className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs text-white">Negotiator</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-normal">Drafts formal English amendments and local Hinglish dialogue scripts.</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-4 pt-2 border-t border-white/5">
                    <span className="text-gray-400">Status</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> COMPLETED</span>
                  </div>
                </div>

                {/* Agent 5 */}
                <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-[180px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 text-[8px] font-bold text-amber-400 bg-amber-500/10 rounded-bl-lg">AGENT 5</div>
                  <div>
                    <div className="p-2 bg-emerald-500/10 rounded-lg w-fit border border-emerald-500/20 mb-3 text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs text-white">Report Gen</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-normal">Assembles final structured audit dashboard values and share templates.</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-4 pt-2 border-t border-white/5">
                    <span className="text-gray-400">Status</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> COMPLETED</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Agent Live logs container */}
            <div className="glass p-5 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-black uppercase text-gray-300">Agentic Orchestration Console Logs</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-md">LIVE MONITOR</span>
              </div>
              
              <div className="bg-black/45 rounded-xl p-4 border border-white/5 h-[240px] overflow-y-auto font-mono text-[11px] text-green-300 flex flex-col gap-2 leading-relaxed">
                {report ? (
                  report.agent_steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col gap-1 border-b border-white/5 pb-2">
                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span className="font-bold text-amber-400 uppercase">{step.agent} ({step.duration})</span>
                        <span>{step.timestamp}</span>
                      </div>
                      <p className="text-gray-300">{step.log}</p>
                      <span className="text-emerald-400 font-bold text-[9px] uppercase">✓ State: {step.status}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-550 italic flex items-center justify-center h-full">
                    Awaiting contract file upload to stream execution logs.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== n8n AUTOMATION TAB ==================== */}
        {activeTab === "n8n" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            
            {/* Visual workflow canvas */}
            <div className="lg:col-span-8 glass p-6 rounded-2xl flex flex-col justify-between min-h-[460px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-purple-400" /> n8n Automation Workflow Canvas
                  </h3>
                  
                  <button 
                    onClick={() => runN8nWorkflowSteps(file?.name || "agreement_draft.pdf")}
                    disabled={n8nRunning}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 hover:bg-amber-600 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" /> Run Canvas Test
                  </button>
                </div>
                <p className="text-[11px] text-gray-450 mb-6">
                  Automated background pipeline syncing document parsing nodes directly with localized vector search hooks.
                </p>
              </div>

              {/* Graphic Representation of Nodes */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 relative">
                
                {/* Node 1 */}
                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center w-[110px] h-[90px] transition-all z-10 ${
                  n8nActiveNode === 1 
                    ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10 scale-105" 
                    : n8nActiveNode > 1 
                    ? "bg-emerald-950/20 border-emerald-500 text-emerald-450" 
                    : "bg-slate-900/40 border-white/10 text-gray-500"
                }`}>
                  <FileText className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">1. Upload Hook</span>
                </div>

                <div className={`flex-1 h-0.5 border-t border-dashed transition-all ${
                  n8nActiveNode > 1 ? "border-emerald-500" : "border-white/10"
                }`} />

                {/* Node 2 */}
                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center w-[110px] h-[90px] transition-all z-10 ${
                  n8nActiveNode === 2 
                    ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10 scale-105" 
                    : n8nActiveNode > 2 
                    ? "bg-emerald-950/20 border-emerald-500 text-emerald-450" 
                    : "bg-slate-900/40 border-white/10 text-gray-500"
                }`}>
                  <Cpu className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">2. PDF Parser</span>
                </div>

                <div className={`flex-1 h-0.5 border-t border-dashed transition-all ${
                  n8nActiveNode > 2 ? "border-emerald-500" : "border-white/10"
                }`} />

                {/* Node 3 */}
                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center w-[110px] h-[90px] transition-all z-10 ${
                  n8nActiveNode === 3 
                    ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10 scale-105" 
                    : n8nActiveNode > 3 
                    ? "bg-emerald-950/20 border-emerald-500 text-emerald-450" 
                    : "bg-slate-900/40 border-white/10 text-gray-500"
                }`}>
                  <ShieldAlert className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">3. Risk Detector</span>
                </div>

                <div className={`flex-1 h-0.5 border-t border-dashed transition-all ${
                  n8nActiveNode > 3 ? "border-emerald-500" : "border-white/10"
                }`} />

                {/* Node 4 */}
                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center w-[110px] h-[90px] transition-all z-10 ${
                  n8nActiveNode === 4 
                    ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10 scale-105" 
                    : n8nActiveNode > 4 
                    ? "bg-emerald-950/20 border-emerald-500 text-emerald-450" 
                    : "bg-slate-900/40 border-white/10 text-gray-500"
                }`}>
                  <Scale className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">4. Legal DB RAG</span>
                </div>

                <div className={`flex-1 h-0.5 border-t border-dashed transition-all ${
                  n8nActiveNode > 4 ? "border-emerald-500" : "border-white/10"
                }`} />

                {/* Node 5 */}
                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center w-[110px] h-[90px] transition-all z-10 ${
                  n8nActiveNode === 5 
                    ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10 scale-105" 
                    : n8nActiveNode > 5 
                    ? "bg-emerald-950/20 border-emerald-500 text-emerald-450" 
                    : "bg-slate-900/40 border-white/10 text-gray-500"
                }`}>
                  <MessageSquareQuote className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">5. Proposal Gen</span>
                </div>

                <div className={`flex-1 h-0.5 border-t border-dashed transition-all ${
                  n8nActiveNode > 5 ? "border-emerald-500" : "border-white/10"
                }`} />

                {/* Node 6 */}
                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center w-[110px] h-[90px] transition-all z-10 ${
                  n8nActiveNode === 6 
                    ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10 scale-105" 
                    : n8nActiveNode === 0 && report
                    ? "bg-emerald-950/20 border-emerald-500 text-emerald-450" 
                    : "bg-slate-900/40 border-white/10 text-gray-500"
                }`}>
                  <Smartphone className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">6. WhatsApp Out</span>
                </div>

              </div>

              <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-6 pt-4 border-t border-white/5">
                <Info className="w-3.5 h-3.5 text-amber-500" />
                <span>Node execution runs sequentially triggered by webhook payloads. Green border indicates completed step.</span>
              </div>
            </div>

            {/* n8n execution log panel */}
            <div className="lg:col-span-4 glass p-5 rounded-2xl flex flex-col justify-between h-[460px]">
              <div>
                <span className="text-xs font-black uppercase text-gray-300 block mb-3 border-b border-white/5 pb-2">n8n Execution Logs</span>
                <div className="flex flex-col gap-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {n8nLogs.map((log, idx) => (
                    <div key={idx} className="p-2 bg-slate-950/50 rounded-lg border border-white/5 font-mono text-[10px] text-slate-350 leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-right text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-4">
                Automation Node: Active
              </div>
            </div>

          </div>
        )}

        {/* ==================== WHATSAPP AGENT SIMULATOR TAB ==================== */}
        {activeTab === "whatsapp" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            
            {/* Mobile frame */}
            <div className="lg:col-span-6 lg:col-start-4 glass rounded-3xl overflow-hidden border border-white/15 h-[580px] flex flex-col justify-between max-w-[380px] mx-auto shadow-2xl relative">
              
              {/* Mobile top bar notch */}
              <div className="w-full bg-[#075e54] pt-4 pb-2.5 px-4 flex items-center justify-between text-white border-b border-black/10">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center font-bold text-xs text-amber-400">
                    DD
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs">DukaanDost AI Agent</h4>
                    <span className="text-[8px] text-green-300 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online</span>
                  </div>
                </div>
                
                <div className="text-[10px] text-white/80 font-bold">WhatsApp</div>
              </div>

              {/* Chat screen */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-950/90 flex flex-col gap-3.5 text-xs text-gray-200">
                
                {whatsappHistory.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                    }`}
                  >
                    <div className={`p-3 rounded-xl leading-normal ${
                      msg.sender === "user" 
                        ? "bg-[#056162] text-white rounded-tr-none" 
                        : "bg-[#262d31] text-gray-250 rounded-tl-none border border-white/5"
                    }`}>
                      {/* Format bold text blocks properly inside WhatsApp message */}
                      <pre className="whitespace-pre-wrap font-sans text-xs select-all">
                        {msg.text}
                      </pre>
                    </div>
                  </div>
                ))}
                
                <div ref={whatsappEndRef} />
              </div>

              {/* Interaction suggestions chips */}
              {report && (
                <div className="px-3 py-2 bg-slate-900 border-t border-white/5 flex gap-1.5 overflow-x-auto">
                  <button 
                    onClick={() => {
                      setWhatsappHistory(p => [...p, { sender: "user", text: "Late Payment Clause detail" }]);
                      setTimeout(() => {
                        setWhatsappHistory(p => [...p, { sender: "bot", text: "🚨 *Payment Penalty Risk:*\nLate payment par 36% interest compounded monthly rate likha hai. Yeh bohot usurious hai.\n\n*Proposed Legal Amendment:*\n`In case of any payment delays, the Merchant shall pay simple interest at a rate of 12% per annum.`" }]);
                      }, 400);
                    }}
                    className="px-2.5 py-1 text-[9px] bg-slate-950 border border-white/5 rounded-full text-gray-400 hover:text-white flex-shrink-0 cursor-pointer"
                  >
                    Late Payment Risk
                  </button>
                  <button 
                    onClick={() => {
                      setWhatsappHistory(p => [...p, { sender: "user", text: "Termination notice detail" }]);
                      setTimeout(() => {
                        setWhatsappHistory(p => [...p, { sender: "bot", text: "🚨 *Termination Risk:*\nDistributor ke paas immediate cancel karne ka unilateral option hai bina notice ke.\n\n*Proposed Legal Amendment:*\n`Either party may terminate this agreement by providing at least 30 days prior written notice.`" }]);
                      }, 400);
                    }}
                    className="px-2.5 py-1 text-[9px] bg-slate-950 border border-white/5 rounded-full text-gray-400 hover:text-white flex-shrink-0 cursor-pointer"
                  >
                    Termination Risk
                  </button>
                </div>
              )}

              {/* Chat Input */}
              <form onSubmit={handleSendWhatsAppMessage} className="p-3.5 bg-[#1e2428] border-t border-white/5 flex gap-2">
                <input 
                  type="text" 
                  value={whatsappInput}
                  onChange={(e) => setWhatsappInput(e.target.value)}
                  placeholder="Type 'Summary' or 'Risks'..."
                  className="flex-1 px-4 py-2 bg-black/40 border border-white/5 focus:border-[#056162]/40 rounded-full text-xs text-white placeholder-gray-500 outline-none"
                />
                <button 
                  type="submit"
                  className="p-2 bg-[#056162] hover:bg-[#075e54] text-white rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          </div>
        )}

      </main>

      {/* Premium Footer */}
      <footer className="w-full max-w-6xl mt-24 px-6 border-t border-white/10 pt-8 pb-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 font-medium">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-bold text-gray-300 tracking-wider uppercase text-[10px]">DukaanDost AI 2.0</span>
          </div>
          <p className="text-[11px] text-gray-500 text-center md:text-left">
            Empowering Bharat's small retail merchants with agentic legal audits.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-5">
            <a 
              href="https://github.com/Rafiaminhaj/dukaan-dost-ai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]"
            >
              Github <ExternalLink className="w-3 h-3 text-amber-500" />
            </a>
            <span className="text-gray-700">•</span>
            <a 
              href="https://dukaan-dost-ai.vercel.app" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]"
            >
              Vercel Live <ExternalLink className="w-3 h-3 text-amber-500" />
            </a>
          </div>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest text-center md:text-right">
            Built with 💛 by Rafia Minhaj for Meesho ScriptedBy{'{'}Her{'}'} 2.0
          </p>
        </div>
      </footer>
    </div>
  );
}
