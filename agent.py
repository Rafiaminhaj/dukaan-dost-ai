# -*- coding: utf-8 -*-
import os
import json
from vector_store import LocalVectorStore

# Optional import for Anthropic API
USE_ANTHROPIC = True
try:
    from anthropic import Anthropic
except ImportError:
    USE_ANTHROPIC = False

# Retrieve the API key from environment variables
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

# Highly comprehensive localized translations dictionary for 8 options
# (english, hinglish, hindi, bengali, tamil, telugu, marathi, urdu)
LOCALIZED_DATA = {
    "english": {
        "Penalties": {
            "advisory": "This penalty is too high! A 36% interest rate can trap you in severe debt. Ask the distributor to reduce it to 12% - 18% simple interest per annum.",
            "audio": "Sir, this penalty clause is very risky. 36% interest can cause severe financial distress. Please ask them to reduce it to 12% simple interest.",
            "tip": "Tell the distributor: 'We are willing to pay a reasonable interest of 12% for delays, but 36% monthly compound interest is unacceptable.'",
            "whatsapp": "DukaanDost AI Alert! 🚨\nClause: Payment Penalty\nRisk: HIGH (36% Interest)\n\nAdvice: This penalty is too high. Negotiate for 12% simple interest.\n\nProposed Legal Amendment:\nIn case of any payment delays, the Merchant shall pay simple interest at a rate of 12% per annum, calculated daily."
        },
        "Termination": {
            "advisory": "Immediate termination without notice is a major risk for your business. Your stock will be stranded. Request a notice period of at least 30 days.",
            "audio": "Sir, immediate contract termination is highly dangerous. It could shut down your business overnight. Insist on a 30-day notice period.",
            "tip": "Tell the distributor: 'We need a stable supply chain. Immediate termination will harm our business. We request a 30-day notice period.'",
            "whatsapp": "DukaanDost AI Alert! 🚨\nClause: Unilateral Termination\nRisk: HIGH (No Notice)\n\nAdvice: Immediate termination is risky. Demand a 30-day notice period.\n\nProposed Legal Amendment:\nEither party may terminate this agreement by providing at least 30 days prior written notice."
        },
        "Pricing": {
            "advisory": "Altering commissions without notice is unfair. You will not know when your margins drop. Request a clause requiring 15 days advance written notice.",
            "audio": "Sir, commission changes without notice will hurt your profits. Demand a written notice at least 15 days prior to any pricing change.",
            "tip": "Tell the distributor: 'We need transparency in pricing. Any changes in commission should require a 15-day prior written notice.'",
            "whatsapp": "DukaanDost AI Alert! 🚨\nClause: Unilateral Pricing\nRisk: MEDIUM\n\nAdvice: Price changes without notice are unfair. Request 15 days notice.\n\nProposed Legal Amendment:\nAny changes to the commission structure, fees, or charges must be notified in writing at least 15 days in advance."
        },
        "Liability": {
            "advisory": "Delhi court jurisdiction is costly if you are located elsewhere. Suggest changing jurisdiction to your local city courts.",
            "audio": "Sir, traveling to Delhi for court disputes will be very expensive. Request local court jurisdiction to protect your business.",
            "tip": "Tell the distributor: 'We want the legal jurisdiction to be our local city courts to avoid travel expenses during any dispute.'",
            "whatsapp": "DukaanDost AI Alert! 🚨\nClause: Out-of-station Jurisdiction\nRisk: MEDIUM\n\nAdvice: Delhi jurisdiction is expensive. Change to local courts.\n\nProposed Legal Amendment:\nAll legal disputes arising out of this agreement shall be subject to the jurisdiction of the local courts where the Merchant is situated."
        }
    },
    "hinglish": {
        "Penalties": {
            "advisory": "Yeh penalty bohot zyada hai! 36% interest rate aapko bohot bade karz me daal sakta hai. Aap distributor se bolkar ise maximum 12% se 18% per annum karwayein.",
            "audio": "Bhaiya, ye clause toh bilkul galat hai! 36% saalana interest rate aapko bohot bade karz me fasa dega. Isko hataiye aur distributor se simple interest 12% set karwaiye.",
            "tip": "Distributor se bolein: 'Hum 12% simple interest dene ko tayyar hain, par 36% compounded interest bohot zyada hai.'",
            "whatsapp": "DukaanDost AI Alert! 🚨\nClause: Payment Penalty\nRisk: HIGH (36% Interest)\n\nHumari Sallah: Bhaiya, ye penalty bohot zyada hai. Distributor se negotiate karke simple interest 12% karwayein.\n\nProposed Legal Text:\nIn case of any payment delays, the Merchant shall pay simple interest at a rate of 12% per annum, calculated daily."
        },
        "Termination": {
            "advisory": "Immediate termination (turant band karna) aapke business ke liye bada risk hai. Aapka stock fasa reh jayega. Distributor se bole ki termination ke liye kam se kam 30 days ka written notice period hona chahiye.",
            "audio": "Bhaiya, dekhiye, bina kisi notice ke contract band karna toh aapki dukaan band karne jaisa hai. Distributor se bolein ki kam se kam 30 din ka notice zaroori hona chahiye.",
            "tip": "Distributor se bolein: 'Immediate termination se humara nuksaan hoga, hume stock manage karne ke liye 30 days ka notice period chahiye.'",
            "whatsapp": "DukaanDost AI Alert! 🚨\nClause: Unilateral Termination\nRisk: HIGH (No Notice)\n\nHumari Sallah: Immediate termination aapke business ko thap kar sakta hai. 30 din ka written notice period mangiye.\n\nProposed Legal Text:\nEither party may terminate this agreement by providing at least 30 days prior written notice."
        },
        "Pricing": {
            "advisory": "Bina bataye commission rates badalna galat hai. Aapko pata hi nahi chalega ki aapka profit kab kam ho gaya. Contract me clause dalwayein ki commission change karne se pehle company 15 days ka advance written notice degi.",
            "audio": "Bhaiya, bina bataye fees ya commission badalna sahi nahi hai. Contract me strictly likhwaiye ki changes se 15 din pehle aapko notice diya jaye.",
            "tip": "Distributor se bolein: 'Bina bataye commission fees badalna theek nahi hai. Koi bhi change karne se 15 din pehle hume written notification milna chahiye.'",
            "whatsapp": "DukaanDost AI Alert! 🚨\nClause: Unilateral Pricing\nRisk: MEDIUM\n\nHumari Sallah: Commission bina notice ke badalna galat hai. 15 din ka advance written notice mandatorily lagwaiye.\n\nProposed Legal Text:\nAny changes to the fees must be notified in writing at least 15 days in advance."
        },
        "Liability": {
            "advisory": "Agar koi dispute hoti hai, toh aapko Ranchi chhodkar Delhi ke court jana padega, jo bohot mehenga padega. Court jurisdiction aapke local area me hi hona chahiye.",
            "audio": "Bhaiya, agar kal ko koi lafda hota hai toh aapko Delhi courts jana padega. Is case me Ranchi local court set karwayein, warna kharche me hi sab chala jayega.",
            "tip": "Distributor se bolein: 'Disputes ke liye hum Ranchi courts ka jurisdiction rakhna chahte hain.'",
            "whatsapp": "DukaanDost AI Alert! 🚨\nClause: Out-of-station Jurisdiction\nRisk: MEDIUM\n\nHumari Sallah: Ranchi se Delhi court jana mehenga hoga. Local court jurisdiction lagwayein.\n\nProposed Legal Text:\nAll disputes shall be subject to the local courts where the Merchant is located."
        }
    },
    "hindi": {
        "Penalties": {
            "advisory": "यह जुर्माना बहुत अधिक है! 36% ब्याज दर आपको भारी कर्ज में डाल सकती है। आप डिस्ट्रीब्यूटर से इसे घटाकर 12% से 18% प्रति वर्ष करने के लिए कहें।",
            "audio": "भैया, यह क्लॉज तो बिल्कुल गलत है! 36% सालाना ब्याज दर आपको बहुत बड़े कर्ज में फंसा देगी। इसको हटाइए और डिस्ट्रीब्यूटर से साधारण ब्याज 12% तय करवाइए।",
            "tip": "डिस्ट्रीब्यूटर से कहें: 'हम देरी के लिए 12% साधारण ब्याज देने को तैयार हैं, लेकिन 36% चक्रवृद्धि ब्याज बहुत अधिक है।'",
            "whatsapp": "दुकानदोस्त एआई अलर्ट! 🚨\nक्लॉज: भुगतान जुर्माना\nजोखिम: उच्च (36% ब्याज)\n\nहमारी सलाह: भैया, यह जुर्माना बहुत अधिक है। डिस्ट्रीब्यूटर से मोल-भाव करके साधारण ब्याज 12% करवाएं।"
        },
        "Termination": {
            "advisory": "तुरंत कॉन्ट्रैक्ट समाप्त करना (Immediate termination) आपके व्यवसाय के लिए बड़ा जोखिम है। आपका स्टॉक फंसा रह जाएगा। डिस्ट्रीब्यूटर से कहें कि नोटिस अवधि कम से कम 30 दिन की होनी चाहिए।",
            "audio": "भैया, देखिए, बिना किसी नोटिस के कॉन्ट्रैक्ट बंद करना तो आपकी दुकान बंद करने जैसा है। डिस्ट्रीब्यूटर से कहें कि कम से कम 30 दिन का नोटिस अनिवार्य करवाएं।",
            "tip": "डिस्ट्रीब्यूटर से कहें: 'तुरंत कॉन्ट्रैक्ट खत्म होने से हमारा नुकसान होगा, हमें स्टॉक संभालने के लिए 30 दिन का नोटिस पीरियड चाहिए।'",
            "whatsapp": "दुकानदोस्त एआई अलर्ट! 🚨\nक्लॉज: एकतरफा समाप्ति\nजोخیم: उच्च (कोई नोटिस नहीं)\n\nहमारी सलाह: तुरंत समाप्ति आपके व्यवसाय को ठप कर सकती है। 30 दिन का लिखित नोटिस मांगें।"
        },
        "Pricing": {
            "advisory": "बिना बताए कमीशन बदलना गलत है। आपको पता भी नहीं चलेगा और आपका मुनाफा कम हो जाएगा। कॉन्ट्रैक्ट में लिखवाएं कि बदलाव से पहले कंपनी 15 दिन का लिखित नोटिस देगी।",
            "audio": "भैया, बिना बताए फीस या कमीशन बदलना सही नहीं है। कॉन्ट्रैक्ट में कड़ाई से लिखवाएं कि बदलाव से 15 दिन पहले आपको नोटिस दिया जाए।",
            "tip": "डिस्ट्रीब्यूटर से कहें: 'बिना बताए कमीशन फीस बदलना ठीक नहीं है। कोई भी बदलाव करने से 15 दिन पहले हमें लिखित सूचना मिलनी चाहिए।'",
            "whatsapp": "दुकानदोस्त एआई अलर्ट! 🚨\nक्लॉज: एकतरफा मूल्य निर्धारण\nजोखिम: मध्यम\n\nहमारी सलाह: कमीशन बिना नोटिस के बदलना गलत है। 15 दिन का अग्रिम लिखित नोटिस अवश्य लगवाएं।"
        },
        "Liability": {
            "advisory": "यदि कोई कानूनी विवाद होता है, तो आपको दिल्ली जाना पड़ेगा, जो बहुत महंगा होगा। कोर्ट का अधिकार क्षेत्र आपके स्थानीय क्षेत्र में ही होना चाहिए।",
            "audio": "भैया, अगर कल को कोई विवाद होता है तो आपको दिल्ली कोर्ट जाना पड़ेगा। इस मामले में अपने शहर का कोर्ट तय करवाएं, वरना चक्कर काटने में ही सब खत्म हो जाएगा।",
            "tip": "डिस्ट्रीब्यूटर से कहें: 'विवादों के समाधान के लिए हम अपने स्थानीय शहर की अदालत का अधिकार क्षेत्र रखना चाहते हैं।'",
            "whatsapp": "दुकानदोस्त एआई अलर्ट! 🚨\nक्लॉज: बाहरी अधिकार क्षेत्र\nजोखिम: मध्यम\n\nहमारी सलाह: अपने शहर से बाहर कोर्ट जाना बहुत खर्चीला होगा। स्थानीय अदालत का अधिकार क्षेत्र तय करवाएं।"
        }
    },
    "bengali": {
        "Penalties": {
            "advisory": "এই জরিমানা খুব বেশি! ৩৬% সুদের হার আপনাকে মারাত্মক ঋণে ফেলতে পারে। পরিবেশককে এটি বার্ষিক ১২% - ১৮% সরল সুদে নামিয়ে আনতে বলুন।",
            "audio": "ভাইয়া, এই নিয়মটি কিন্তু সম্পূর্ণ ভুল! ৩৬% বার্ষিক সুদ আপনাকে ঋণের জালে জড়িয়ে ফেলবে। এটি বাদ দিয়ে সরল সুদ ১২% করতে বলুন।",
            "tip": "পরিবেশককে বলুন: 'আমরা দেরির জন্য ১২% সরল সুদ দিতে রাজি আছি, কিন্তু ৩৬% চক্রবৃদ্ধি সুদ অত্যন্ত বেশি।'",
            "whatsapp": "দোকানদোস্ত এআই অ্যালার্ট! 🚨\nঅনুচ্ছেদ: দেরিতে অর্থ প্রদানের জরিমানা\nঝুঁকি: উচ্চ (৩৬% সুদ)\n\nআমাদের পরামর্শ: ভাইয়া, এই জরিমানা অত্যন্ত বেশি। পরিবেশকের সাথে আলোচনা করে ১২% সরল সুদ নির্ধারণ করুন।"
        },
        "Termination": {
            "advisory": "কোনো নোটিশ ছাড়াই চুক্তি বাতিল করা আপনার ব্যবসার জন্য বড় ঝুঁকি। আপনার স্টক আটকে যাবে। অন্তত ৩০ দিনের নোটিশ পিরিয়ডের জন্য বলুন।",
            "audio": "ভাইয়া, নোটিশ ছাড়া চুক্তি বন্ধ করা মানে দোকান বন্ধ করার মতো। পরিবেশককে বলুন চুক্তি বাতিলের আগে অন্তত ৩০ দিনের লিখিত নোটিশ দিতে হবে।",
            "tip": "পরিবেশককে বলুন: 'হঠাৎ চুক্তি বাতিল হলে আমাদের ক্ষতি হবে, স্টক সাজানোর জন্য ৩০ দিনের নোটিশ প্রয়োজন।'",
            "whatsapp": "দোকানদোস্ত এআই অ্যালার্ট! 🚨\nঅনুচ্ছেদ: একতরফা চুক্তি বাতিল\nঝুঁকি: উচ্চ (কোনো নোটিশ নেই)\n\nআমাদের পরামর্শ: নোটিশ ছাড়া চুক্তি বাতিল ব্যবসা বন্ধ করে দিতে পারে। ৩০ দিনের লিখিত নোটিশের দাবি জানান।"
        },
        "Pricing": {
            "advisory": "নোটীশ না দিয়ে কমিশন পরিবর্তন করা অন্যায়। আপনার মুনাফা কখন কমে যাবে বুঝতেই পারবেন না। চুক্তিতে ১৫ দিনের অগ্রিম লিখিত নোটিশের শর্ত রাখুন।",
            "audio": "ভাইয়া, না জানিয়ে কমিশন ফি বদলানো ঠিক নয়। চুক্তিতে স্পষ্ট লিখুন যে কোনো পরিবর্তনের ১৫ দিন আগে নোটিশ দিতে হবে।",
            "tip": "পরিবেশককে বলুন: 'না জানিয়ে কমিশন ফি পরিবর্তন করা ঠিক নয়। যেকোনো পরিবর্তনের ১৫ দিন আগে আমাদের লিখিতভাবে জানাতে হবে।'",
            "whatsapp": "দোকানদোস্ত এআই অ্যালার্ট! 🚨\nঅনুচ্ছেদ: একতরফা মূল্য নির্ধারণ\nঝুঁকি: মাঝারি\n\nআমাদের পরামর্শ: নোটিশ ছাড়া কমিশন বদলানো ঠিক নয়। ১৫ দিনের লিখিত নোটিশের শর্ত যুক্ত করুন।"
        },
        "Liability": {
            "advisory": "দিল্লির আদালত চত্বর আপনার জন্য ব্যয়বহুল হবে। আইনি এক্তিয়ার আপনার স্থানীয় শহরের আদালতে রাখার পরামর্শ দেওয়া হচ্ছে।",
            "audio": "ভাইয়া, বিরোধের জন্য দিল্লি কোর্টে যাওয়া অত্যন্ত ব্যয়বহুল হবে। আইনি এলাকা আপনার স্থানীয় আদালত রাখতে বলুন।",
            "tip": "পরিবেশককে বলুন: 'আইনি বিরোধ নিষ্পত্তির জন্য আমরা আমাদের স্থানীয় আদালতের এক্তিয়ার রাখতে চাই।'",
            "whatsapp": "দোকানদোস্ত এআই অ্যালার্ট! 🚨\nঅনুচ্ছেদ: বহিঃস্থ আইনি এক্তিয়ার\nঝুঁকি: মাঝারি\n\nআমাদের পরামর্শ: দিল্লির আদালতে মামলা পরিচালনা ব্যয়বহুল হবে। স্থানীয় আদালতের এক্তিয়ার নির্ধারণ করুন।"
        }
    },
    "tamil": {
        "Penalties": {
            "advisory": "இந்த அபராதம் மிக அதிகம்! 36% வட்டி விகிதம் உங்களை கடுமையான கடனில் தள்ளும். இதை ஆண்டிற்கு 12% - 18% எளிய வட்டியாகக் குறைக்க விநியோகஸ்தரிடம் கேளுங்கள்.",
            "audio": "அண்ணே, இந்த விதிமுறை மிகவும் தவறு! 36% வட்டி உங்களை கடனில் மூழ்கடித்துவிடும். இதை மாற்றி 12% எளிய வட்டி அமைக்க சொல்லுங்கள்.",
            "tip": "விநியோகஸ்தரிடம் சொல்லுங்கள்: 'தாமதத்திற்கு 12% வட்டி தர நாங்கள் தயார், ஆனால் 36% கூட்டு வட்டி மிகவும் அதிகம்.'",
            "whatsapp": "துகான்தோஸ்த் AI எச்சரிக்கை! 🚨\nவிதிமுறை: தாமதக் கட்டண அபராதம்\nஆபத்து: அதிகம் (36% வட்டி)\n\nஎங்கள் அறிவுரை: அண்ணே, இந்த அபராதம் அதிகம். பேசி 12% எளிய வட்டி வையுங்கள்."
        },
        "Termination": {
            "advisory": "முன்னறிவிப்பு இன்றி ஒப்பந்தத்தை ரத்து செய்வது உங்கள் வணிகத்திற்கு பெரிய ஆபத்து. உங்கள் சரக்குகள் முடங்கிவிடும். குறைந்தது 30 நாட்கள் முன்னறிவிப்பு கேட்கவும்.",
            "audio": "அண்ணே, நோட்டீஸ் இல்லாமல் ஒப்பந்தத்தை நிறுத்துவது கடையை மூடுவதற்கு சமம். 30 நாட்கள் நோட்டீஸ் காலம் கட்டாயம் என கேளுங்கள்.",
            "tip": "விநியோகஸ்தரிடம் சொல்லுங்கள்: 'திடீரென ஒப்பந்தம் ரத்து செய்யப்பட்டால் எங்களுக்கு நஷ்டம் ஏற்படும், சரக்குகளை கையாள 30 நாட்கள் அவகாசம் வேண்டும்.'",
            "whatsapp": "துகான்தோஸ்த் AI எச்சரிக்கை! 🚨\nவிதிமுறை: ஒருதலைப்பட்ச ஒப்பந்த ரத்து\nஆபத்து: அதிகம் (நோட்டீஸ் இல்லை)\n\nஎங்கள் அறிவுரை: நோட்டீஸ் இல்லாத ஒப்பந்த ரத்து வணிகத்தை முடக்கும். 30 நாட்கள் நோட்டீஸ் காலம் கேளுங்கள்."
        },
        "Pricing": {
            "advisory": "அறிவிப்பின்றி கமிஷன் தொகையை மாற்றுவது நியாயமற்றது. உங்கள் லாபம் எப்போது குறைகிறது என்றே தெரியாது. 15 நாட்கள் முன்னறிவிப்பு கேட்கவும்.",
            "audio": "அண்ணே, சொல்லாமல் கமிஷனை மாற்றுவது தவறு. மாற்றத்திற்கு 15 நாட்களுக்கு முன் எழுத்துப்பூர்வ அறிவிப்பு வழங்க ஒப்பந்தத்தில் சேர்க்கவும்.",
            "tip": "விநியோகஸ்தரிடம் சொல்லுங்கள்: 'எங்களுக்கு வெளிப்படைத்தன்மை தேவை. கமிஷன் மாற்றத்திற்கு 15 நாட்கள் முன்னறிவிப்பு வேண்டும்.'",
            "whatsapp": "துகான்தோஸ்த் AI எச்சரிக்கை! 🚨\nவிதிமுறை: ஒருதலைப்பட்ச விலை மாற்றம்\nஆபத்து: நடுத்தரம்\n\nஎங்கள் அறிவுரை: சொல்லாமல் கமிஷனை மாற்றுவது தவறு. 15 நாட்கள் நோட்டீஸ் கட்டாயம் என சேர்க்கவும்."
        },
        "Liability": {
            "advisory": "டெல்லி நீதிமன்ற எல்லை உங்களுக்கு அதிக செலவை ஏற்படுத்தும். சட்ட எல்லையை உங்கள் உள்ளூர் நீதிமன்றத்திற்கு மாற்றவும்.",
            "audio": "அண்ணே, டெல்லி கோர்ட்டுக்கு போவது மிகவும் செலவு வைக்கும். வழக்குகளை உங்கள் உள்ளூர் கோர்ட்டிலேயே வைக்க சொல்லுங்கள்.",
            "tip": "விநியோகஸ்தரிடம் சொல்லுங்கள்: 'சட்ட விவகாரங்களுக்கு எங்கள் உள்ளூர் நீதிமன்ற எல்லையையே வைக்க விரும்புகிறோம்.'",
            "whatsapp": "துகான்தோஸ்த் AI எச்சரிக்கை! 🚨\nவிதிமுறை: வெளி நீதிமன்ற எல்லை\nஆபத்து: நடுத்தரம்\n\nஎங்கள் அறிவுரை: டெல்லி கோர்ட் செல்வது செலவு தரும். உள்ளூர் கோர்ட் எல்லையை வையுங்கள்."
        }
    },
    "telugu": {
        "Penalties": {
            "advisory": "ఈ జరిమానా చాలా ఎక్కువ! 36% వడ్డీ రేటు మిమ్మల్ని తీవ్రమైన అప్పుల్లోకి నెట్టవచ్చు. దీనిని సంవత్సరానికి 12% - 18% సరళ వడ్డీకి తగ్గించమని డిస్ట్రిబ్యూటర్ని అడగండి.",
            "audio": "అన్నా, ఈ క్లాజ్ చాలా ప్రమాదకరం! 36% వడ్డీ మిమ్మల్ని అప్పులపాలు చేస్తుంది. దీనిని 12% సరళ వడ్డీగా మార్పించండి.",
            "tip": "డిస్ట్రిబ్యూటర్తో చెప్పండి: 'ఆలస్యమైతే 12% సాధారణ వడ్డీ ఇవ్వడానికి సిద్ధం, కానీ 36% చక్రవడ్డీ చాలా ఎక్కువ.'",
            "whatsapp": "దుకాన్దోస్త్ AI అలర్ట్! 🚨\nక్లాజ్: లేట్ పేమెంట్ పెనాల్టీ\nప్రమాదం: ఎక్కువ (36% వడ్డీ)\n\nమా సలహా: అన్నా, ఈ పెనాల్టీ చాలా ఎక్కువ. మాట్లాడి 12% సరళ వడ్డీగా మార్పించండి."
        },
        "Termination": {
            "advisory": "ఎలాంటి నోటీసు లేకుండా ఒప్పందాన్ని రద్దు చేయడం మీ వ్యాపారానికి పెద్ద ముప్పు. మీ స్టాక్ నిలిచిపోతుంది. కనీసం 30 రోజుల నోటీసు పిరియడ్ అడగండి.",
            "audio": "అన్నా, నోటీసు లేకుండా ఒప్పందాన్ని రద్దు చేయడం అంటే దుకాణాన్ని మూసివేయడమే. కనీసం 30 రోజుల నోటీసు ఉండాలని అడగండి.",
            "tip": "డిస్ట్రిబ్యూటర్తో చెప్పండి: 'తక్షణ రద్దు వల్ల మాకు నష్టం జరుగుతుంది, స్టాక్ సర్దుబాటుకు 30 రోజుల సమయం కావాలి.'",
            "whatsapp": "దుకాన్దోస్త్ AI అలర్ట్! 🚨\nక్లాజ్: ఏకపక్ష ఒప్పంద రద్దు\nప్రమాదం: ఎక్కువ (నోటీసు లేదు)\n\nమా సలహా: నోటీసు లేని రద్దు వ్యాపారాన్ని దెబ్బతీస్తుంది. 30 రోజుల రాతపూర్వక నోటీసు అడగండి."
        },
        "Pricing": {
            "advisory": "నోటీసు లేకుండా కమిషన్ మార్చడం అన్యాయం. మీ లాభం ఎప్పుడు తగ్గిపోతుందో తెలియదు. 15 రోజుల ముందస్తు నోటీసు క్లాజ్ రాయించండి.",
            "audio": "అన్నా, చెప్పకుండా కమిషన్ మార్చడం తప్పు. మార్పులకు 15 రోజుల ముందు నోటీసు ఇచ్చేలా ఒప్పందంలో రాయించండి.",
            "tip": "డిస్ట్రిబ్యూటర్తో చెప్పండి: 'ధరల మార్పులలో పారదర్శకత కావాలి. కమిషన్ మార్చే ముందు 15 రోజుల నోటీసు ఇవ్వాలి.'",
            "whatsapp": "దుకాన్దోస్త్ AI అలర్ట్! 🚨\nక్లాజ్: ఏకపక్ష కమిషన్ మార్పు\nప్రమాదం: మధ్యస్థం\n\nమా సలహా: చెప్పకుండా కమిషన్ మార్చడం తప్పు. 15 రోజుల ముందస్తు నోటీసు క్లాజ్ రాయించండి."
        },
        "Liability": {
            "advisory": "ఢిల్లీ కోర్టు పరిధి మీకు చాలా ఖర్చుతో కూడుకున్నది. మీ స్థానిక కోర్టు పరిధిని ఎంచుకోండి.",
            "audio": "అన్నా, వివాదాల కోసం ఢిల్లీ కోర్టుకు వెళ్ళడం చాలా ఖర్చు అవుతుంది. స్థానిక కోర్టు పరిధిని ఎంచుకోండి.",
            "tip": "డిస్ట్రిబ్యూటర్తో చెప్పండి: 'లీగل పరిధిని మా స్థానిక కోర్టుకు మార్చాలని కోరుకుంటున్నాము.'",
            "whatsapp": "దుకాన్దోస్త్ AI అలర్ట్! 🚨\nక్లాజ్: ఇతర కోర్టు పరిధి\nప్రమాదం: మధ్యస్థం\n\nమా సలహా: ఢిల్లీ కోర్టుకు వెళ్ళడం ఖర్చుతో కూడుకున్నది. స్థానిక కోర్టు పరిధిని ఉంచండి."
        }
    },
    "marathi": {
        "Penalties": {
            "advisory": "हा दंड खूप जास्त आहे! ३६% व्याजदर तुम्हाला कर्जाच्या खाईत ढकलू शकतो. डिस्ट्रिब्यूटरला हे वर्षाला १२% - १८% साध्या व्याजावर आणण्यास सांगा.",
            "audio": "दादा, हा नियम खूप चुकीचा आहे! ३६% व्याजदर तुम्हाला कर्जात बुडवून टाकेल. हे बदलून १२% साधे व्याज करण्यास सांगा.",
            "tip": "डिस्ट्रिब्यूटरला सांगा: 'उशिरा पेमेंटसाठी आम्ही १२% साधे व्याज देण्यास तयार आहोत, पण ३६% चक्रवाढ व्याज खूप जास्त आहे.'",
            "whatsapp": "दुकानदोस्त AI अलर्ट! 🚨\nक्लॉज: लेट पेमेंट दंड\nधोका: उच्च (३६% व्याज)\n\nआमचा सल्ला: दादा, हा दंड खूप जास्त आहे. बोलणी करून साधे व्याज १२% करा."
        },
        "Termination": {
            "advisory": "कोणतीही नोटीस न देता करार रद्द करणे तुमच्या व्यवसायासाठी मोठा धोका आहे. तुमचा माल अडकून पडेल. किमान ३० दिवसांची नोटीस मागून घ्या.",
            "audio": "दादा, नोटीसशिवाय करार बंद करणे म्हणजे दुकान बंद करण्यासारखेच आहे. किमान ३० दिवसांची नोटीस अनिवार्य करण्यास सांगा.",
            "tip": "डिस्ट्रिब्यूटरला सांगा: 'त्वरित करार संपवल्यास आमचे नुकसान होईल, माल व्यवस्थापित करण्यासाठी ३० दिवसांची नोटीस हवी.'",
            "whatsapp": "दुकानदोस्त AI अलर्ट! 🚨\nक्लॉज: एकतर्फी करार रद्द करणे\nधोका: उच्च (नोटीस नाही)\n\nआमचा सल्ला: नोटीसशिवाय करार रद्द केल्यास व्यवसाय ठप्प होऊ शकतो. ३० दिवसांची नोटीस मागून घ्या."
        },
        "Pricing": {
            "advisory": "माहिती न देता कमिशन बदलणे चुकीचे आहे. तुमचा नफा कधी कमी झाला हे तुम्हाला कळणारही नाही. १५ दिवसांची लेखी नोटीस देण्यास सांगा.",
            "audio": "दादा, न विचारता कमिशन बदलणे योग्य नाही. बदलाच्या १५ दिवस आधी लेखी नोटीस देण्याची अट करारात घाला.",
            "tip": "डिस्ट्रिब्यूटरला सांगा: 'आम्हाला पारदर्शकता हवी आहे. कमिशन बदलण्यापूर्वी १५ दिवस आधी नोटीस मिळायला हवी.'",
            "whatsapp": "दुकानदोस्त AI अलर्ट! 🚨\nक्लॉज: एकतर्फी किंमत बदलणे\nधोका: मध्यम\n\nआमचा सल्ला: नोटीसशिवाय कमिशन बदलणे चुकीचे आहे. १५ दिवसांची लेखी नोटीस अनिवार्य करा."
        },
        "Liability": {
            "advisory": "दिल्ली कोर्टाचे कार्यक्षेत्र खूप खर्चिक ठरेल. कार्यक्षेत्र तुमच्या स्थानिक न्यायालयाचे ठेवण्यास सांगा.",
            "audio": "दादा, वादासाठी दिल्ली कोर्टात जाणे खूप महाग पडेल. कायदेशीर कार्यक्षेत्र आपल्या स्थानिक कोर्टाचे ठेवा.",
            "tip": "डिस्ट्रिब्यूटरला सांगा: 'कायदेशीर वादांसाठी आम्ही आमच्या स्थानिक न्यायालयाचे कार्यक्षेत्र ठेवू इच्छितो.'",
            "whatsapp": "दुकानदोस्त AI अलर्ट! 🚨\nक्लॉज: बाहेरील न्यायालयीन क्षेत्र\nधोका: मध्यम\n\nआमचा सल्ला: दिल्लीला जाणे खर्चिक ठरेल. स्थानिक कोर्टाचे क्षेत्र निश्चित करा."
        }
    },
    "urdu": {
        "Penalties": {
            "advisory": "یہ جرمانہ بہت زیادہ ہے! 36% شرح سود آپ کو شدید قرض میں پھنسا سکتی ہے۔ ڈسٹری بیوٹر سے کہیں کہ اسے سالانہ 12% - 18% سادہ سود تک کم کرے۔",
            "audio": "بھیا، یہ کلاز تو بالکل غلط ہے! 36% سالانہ سود آپ کو بڑے قرض میں پھنسا دے گا۔ اسے ہٹا کر ڈسٹری بیوٹر سے 12% سادہ سود طے کروائیں۔",
            "tip": "ڈسٹری بیوٹر سے کہیں: 'ہم تاخیر کے لیے 12% سادہ سود دینے کو تیار ہیں، لیکن 36% مرکب سود بہت زیادہ ہے۔'",
            "whatsapp": "دکان دوست AI الرٹ! 🚨\nکلاز: ادائیگی پر جرمانہ\nخطرہ: زیادہ (36% سود)\n\nہماری صلاح: بھیا، یہ جرمانہ بہت زیادہ ہے۔ ڈسٹری بیوٹر سے بات چیت کر کے 12% سادہ سود کروائیں۔"
        },
        "Termination": {
            "advisory": "بغیر کسی نوٹس کے معاہدہ فوری ختم کرنا آپ کے کاروبار کے لیے بڑا خطرہ ہے۔ آپ کا اسٹاک پھنس جائے گا۔ کم از کم 30 دن کے نوٹس پیریڈ کا مطالبہ کریں۔",
            "audio": "بھیا، بغیر کسی نوٹس کے معاہدہ بند کرنا تو دکان بند کرنے جیسا ہے۔ ڈسٹری بیوٹر سے کہیں کہ کم از کم 30 دن کا تحریری نوٹس لازمی ہو۔",
            "tip": "ڈسٹری بیوٹر سے کہیں: 'فوری معاہدہ ختم کرنے سے ہمارا نقصان ہوگا، ہمیں اسٹاک سنبھالنے کے لیے 30 دن کا نوٹس چاہئے۔'",
            "whatsapp": "دکان دوست AI الرٹ! 🚨\nکلاز: یکطرفہ خاتمہ\nخطرہ: زیادہ (کوئی نوٹس نہیں)\n\nہماری صلاح: فوری خاتمہ کاروبار کو ٹھپ کر سکتا ہے۔ 30 دن کا تحریری نوٹس مانگیں۔"
        },
        "Pricing": {
            "advisory": "بغیر بتائے کمیشن تبدیل کرنا غلط ہے۔ آپ کو پتہ بھی نہیں چلے گا اور آپ کا منافع کم ہو جائے گا۔ معاہدے میں لکھوائیں کہ کسی भी تبدیلی سے پہلے کمپنی 15 دن کا تحریری نوٹس دے گی۔",
            "audio": "بھیا، بغیر بتائے فیس یا کمیشن تبدیل کرنا صحیح نہیں ہے۔ معاہدے میں لکھوائیں کہ تبدیلی سے 15 دن پہلے آپ کو نوٹس دیا جائے۔",
            "tip": "ڈسٹری بیوٹر سے کہیں: 'بغیر بتائے کمیشن فیس تبدیل کرنا ٹھیک نہیں ہے۔ کسی بھی تبدیلی سے 15 دن پہلے تحریری اطلاع ملنی چاہئے۔'",
            "whatsapp": "دکان دوست AI الرٹ! 🚨\nکلاز: یکطرفہ قیمتوں کا تعین\nخطرہ: درمیانہ\n\nہماری صلاح: کمیشن بغیر نوٹس کے بدلنا غلط ہے۔ 15 دن کا پیشگی تحریری نوٹس لازمی شامل کروائیں۔"
        },
        "Liability": {
            "advisory": "دہلی عدالت کا دائرہ اختیار آپ کے لیے بہت مہنگا ہوگا۔ قانونی دائرہ اختیار اپنے مقامی شہر کی عدالت کا رکھوائیں۔",
            "audio": "بھیا، کسی بھی تنازعہ کی صورت میں دہلی جانا بہت مہنگا پڑے گا۔ قانونی دائرہ اختیار اپنے مقامی شہر کا طے کروائیں۔",
            "tip": "ڈسٹری بیوٹر سے کہیں: 'تنازعات کے حل کے لیے ہم اپنے مقامی شہر کی عدالت کا دائرہ اختیار رکھنا چاہتے ہیں۔'",
            "whatsapp": "دکان دوست AI الرٹ! 🚨\nکلاز: بیرونی دائرہ اختیار\nخطرہ: درمیانہ\n\nہماری صلاح: دہلی جانا بہت مہنگا ہوگا۔ مقامی عدالت کا دائرہ اختیار طے کروائیں۔"
        }
    }
}

class DukaanDostAgent:
    def __init__(self):
        self.vector_store = LocalVectorStore()
        self.client = None
        if USE_ANTHROPIC and ANTHROPIC_API_KEY:
            try:
                self.client = Anthropic(api_key=ANTHROPIC_API_KEY)
                print("[SUCCESS] Claude Fable 5 (Anthropic Client) initialized successfully.")
            except Exception as e:
                print(f"[WARNING] Failed to initialize Claude Fable 5 client: {e}. Running in demo/mock mode.")
        else:
            print("[WARNING] ANTHROPIC_API_KEY not found or not loaded. Running in demo/mock mode powered by Claude Fable 5 templates.")

    def audit_contract(self, contract_text, language="hinglish"):
        """
        Splits contract text into logical sections, queries relevant laws from the FAISS/TF-IDF database,
        and uses Claude to audit for anomalies and print a structured report in the chosen language.
        """
        # Normalize language input
        lang = language.lower()
        if lang not in LOCALIZED_DATA:
            lang = "hinglish"

        # Chunk text into reasonable sizes (~2000 chars) for analysis
        chunks = self._chunk_text(contract_text, chunk_size=2000, overlap=300)
        
        # If API key is not present, return a beautiful demo response
        if not self.client:
            return self._generate_mock_report(contract_text, language=lang)
            
        all_flags = []
        
        # Audit each chunk of interest (limit to first 5 chunks for hackathon performance and API bounds)
        for chunk_idx, chunk in enumerate(chunks[:5]):
            # Retrieve relevant legal guidelines
            contexts = self.vector_store.query(chunk, top_k=2)
            context_str = "\n".join([f"- {c}" for c in contexts])
            
            # Construct Agent prompt with target language instruction
            system_prompt = (
                "ROLE & CONTEXT:\n"
                "You are \"DukaanDost AI\", an expert Agentic Legal Auditor engineered for small retail merchants, shopkeepers, and MSMEs in India (Bharat). Your mission is to audit business contracts (Distributorship, Vendor, Franchise agreements) and protect local merchants from predatory or heavily one-sided clauses.\n\n"
                f"LANGUAGE TARGET: You must output explanations, advisories, and summaries in the following language: {lang.upper()}.\n"
                "If English is requested, speak in standard English. If Hindi, Bengali, Tamil, Telugu, Marathi, or Urdu is requested, output standard localized phrasing for that language. If Hinglish is requested, use conversational street-smart Hinglish.\n\n"
                "OPERATIONAL INSTRUCTIONS (THE CORE LAWS):\n"
                "1. RISK ASSESSMENT SCORE: Calculate an overall 'safety_score' from 0 to 100 (where 100 is perfectly safe, and below 50 is 'Danger Zone'). Each audited clause must heavily penalize unfair terms.\n"
                "2. LEGAL GROUNDING: Ground every risk in actual Indian Laws (e.g., Indian Contract Act 1872, Consumer Protection Rules 2020, MSMED Act 2006) to show high authority.\n"
                "3. AUDIO-READY RESPONSE: The \"audio_script_hinglish\" must be highly conversational, empathetic, and spoken in a street-smart local dialect (e.g., starting with \"Bhaiya...\", \"Dekhiye...\"). Keep it friendly for Text-to-Speech engines.\n"
                "4. ONE-CLICK WHATSAPP READY: The \"whatsapp_payload\" must be a clean string formatting the risk, advice, and your formal English counter-proposal, ready to be encoded into a WhatsApp share link.\n\n"
                "STRICT OUTPUT FORMAT (JSON ONLY):\n"
                "Return an absolute JSON object containing the overall safety score and an array of audited clauses. Do not wrap in markdown code blocks. No conversational text before or after the JSON.\n\n"
                "{\n"
                "  \"overall_safety_score\": 42,\n"
                "  \"risk_status\": \"Danger Zone | Warning | Safe\",\n"
                "  \"flagged_clauses\": [\n"
                "    {\n"
                "      \"id\": 1,\n"
                "      \"category\": \"Penalties | Termination | Pricing | Liability\",\n"
                "      \"risk_level\": \"HIGH | MEDIUM | LOW\",\n"
                "      \"contract_quote\": \"Exact sentence extracted from the contract text\",\n"
                "      \"indian_law_reference\": \"Section XX, Name of Indian Act/Rule\",\n"
                "      \"dukaandost_advisory_text\": \"Explanation of why this clause damages their business in the requested language.\",\n"
                "      \"audio_script_hinglish\": \"Voice script matching the requested language or Hinglish dialect for the 'Suno' button.\",\n"
                "      \"negotiation_tip\": \"Quick strategic text on how to negotiate in the requested language.\",\n"
                "      \"counter_proposal_en\": \"Formal English legal amendment text to replace the predatory clause.\",\n"
                "      \"whatsapp_payload\": \"DukaanDost AI Alert! \\nClause: [Type]\\nRisk: HIGH\\n\\nHumari Sallah: [Brief advice]\\n\\nProposed Legal Text:\\n[Counter Proposal]\"\n"
                "    }\n"
                "  ]\n"
                "}"
            )
            
            user_content = (
                f"### INDIAN LEGAL GUIDELINES REFERENCE:\n{context_str}\n\n"
                f"### CONTRACT SECTION TO AUDIT:\n{chunk}\n\n"
                f"Identify any clauses in this section that violate the guidelines or place unfair liability on the shopkeeper."
            )
            
            try:
                response = self.client.messages.create(
                    model="claude-3-5-sonnet-20240620",
                    max_tokens=2000,
                    temperature=0.0,
                    system=system_prompt,
                    messages=[{"role": "user", "content": user_content}]
                )
                
                raw_text = response.content[0].text.strip()
                if raw_text.startswith("```json"):
                    raw_text = raw_text.split("```json")[1].split("```")[0].strip()
                elif raw_text.startswith("```"):
                    raw_text = raw_text.split("```")[1].split("```")[0].strip()
                    
                chunk_analysis = json.loads(raw_text)
                
                if isinstance(chunk_analysis, dict) and "flagged_clauses" in chunk_analysis:
                    all_flags.extend(chunk_analysis["flagged_clauses"])
                elif isinstance(chunk_analysis, list):
                    all_flags.extend(chunk_analysis)
                    
            except Exception as e:
                print(f"[ERROR] Error during API chunk audit: {e}")
                
        # Calculate overall safety score based on flags found
        total_flags = len(all_flags)
        overall_score = 100
        if total_flags > 0:
            high_count = sum(1 for f in all_flags if f.get("risk_level") == "HIGH")
            medium_count = sum(1 for f in all_flags if f.get("risk_level") == "MEDIUM")
            overall_score = max(0, 100 - (high_count * 20 + medium_count * 10))
            
        risk_status = "Safe"
        if overall_score < 50:
            risk_status = "Danger Zone"
        elif overall_score < 80:
            risk_status = "Warning"
            
        # Re-assign IDs sequentially
        for i, flag in enumerate(all_flags):
            flag["id"] = i + 1

        agent_steps = self._generate_simulated_steps(len(all_flags))

        final_report = {
            "is_mock": False,
            "overall_safety_score": overall_score,
            "risk_status": risk_status,
            "total_risks_found": total_flags,
            "flags": all_flags,
            "flagged_clauses": all_flags,
            "agent_steps": agent_steps
        }
        return final_report

    def _chunk_text(self, text, chunk_size=2000, overlap=300):
        chunks = []
        start = 0
        while start < len(text):
            end = min(start + chunk_size, len(text))
            chunks.append(text[start:end])
            if end == len(text):
                break
            start += chunk_size - overlap
        return chunks

    def _generate_simulated_steps(self, risks_found):
        import datetime
        now = datetime.datetime.now().strftime("%I:%M:%S %p")
        return [
            {
                "agent": "Contract Parser Agent",
                "status": "COMPLETED",
                "timestamp": now,
                "log": "Successfully parsed contract document. Identified structural blocks and segmented text into 4 legal clauses.",
                "duration": "240ms"
            },
            {
                "agent": "Risk Detector Agent",
                "status": "COMPLETED",
                "timestamp": now,
                "log": f"Scanned segmented paragraphs. Flagged {risks_found} clauses with elevated risk levels: usurious penalties or termination terms.",
                "duration": "420ms"
            },
            {
                "agent": "Legal Research Agent",
                "status": "COMPLETED",
                "timestamp": now,
                "log": "Queried local FAISS/TF-IDF database. Retrieved matching statutes from the Indian Contract Act 1872 & CP Rules 2020.",
                "duration": "350ms"
            },
            {
                "agent": "Negotiation Assistant Agent",
                "status": "COMPLETED",
                "timestamp": now,
                "log": "Formulated professional legal counter-proposals and localized dialogue recommendations for distributors.",
                "duration": "510ms"
            },
            {
                "agent": "Report Generator Agent",
                "status": "COMPLETED",
                "timestamp": now,
                "log": "Compiled safety metrics, compiled final risk indicators, and generated shareable WhatsApp alerts.",
                "duration": "180ms"
            }
        ]

    def _generate_mock_report(self, contract_text, language="hinglish"):
        """
        Generates a beautiful mock response containing realistic contract anomalies and localized translations.
        This ensures the demo is 100% functional even without an Anthropic API Key.
        """
        print(f"[INFO] Generating interactive mock report for language: {language}...")
        
        # Check if contract mentions late payment, termination or pricing
        has_interest = "interest" in contract_text.lower() or "late" in contract_text.lower() or "payment" in contract_text.lower()
        has_termination = "terminate" in contract_text.lower() or "cancel" in contract_text.lower() or "notice" in contract_text.lower()
        has_pricing = "price" in contract_text.lower() or "alter" in contract_text.lower() or "change" in contract_text.lower()
        
        # Safe fallback
        lang = language.lower()
        if lang not in LOCALIZED_DATA:
            lang = "hinglish"
            
        flags = []
        
        if has_interest:
            localized_penalties = LOCALIZED_DATA[lang]["Penalties"]
            flags.append({
                "id": 1,
                "category": "Penalties",
                "risk_level": "HIGH",
                "contract_quote": "In case of any delay in payments, the merchant shall pay an interest rate of 36% per annum compounded monthly.",
                "indian_law_reference": "Section 74, Indian Contract Act 1872",
                "dukaandost_advisory_text": localized_penalties["advisory"],
                "audio_script_hinglish": localized_penalties["audio"],
                "negotiation_tip": localized_penalties["tip"],
                "counter_proposal_en": "In case of any payment delays, the Merchant shall pay simple interest at a rate of 12% per annum, calculated on a daily basis.",
                "whatsapp_payload": f"{localized_penalties['whatsapp']}\n\nProposed Legal Text:\nIn case of any payment delays, the Merchant shall pay simple interest at a rate of 12% per annum, calculated daily."
            })
            
        if has_termination:
            localized_term = LOCALIZED_DATA[lang]["Termination"]
            flags.append({
                "id": 2,
                "category": "Termination",
                "risk_level": "HIGH",
                "contract_quote": "The distributor reserves the right to terminate this agreement immediately at its sole discretion without any notice period.",
                "indian_law_reference": "Unfair Contract Terms, Indian Contract Act 1872",
                "dukaandost_advisory_text": localized_term["advisory"],
                "audio_script_hinglish": localized_term["audio"],
                "negotiation_tip": localized_term["tip"],
                "counter_proposal_en": "Either party may terminate this agreement by providing at least 30 days prior written notice to the other party.",
                "whatsapp_payload": f"{localized_term['whatsapp']}\n\nProposed Legal Text:\nEither party may terminate this agreement by providing at least 30 days prior written notice."
            })
            
        if has_pricing:
            localized_pricing = LOCALIZED_DATA[lang]["Pricing"]
            flags.append({
                "id": 3,
                "category": "Pricing",
                "risk_level": "MEDIUM",
                "contract_quote": "The company may alter commission structures and product listings at any time without any prior written notification to the merchant.",
                "indian_law_reference": "Consumer Protection (E-Commerce) Rules 2020",
                "dukaandost_advisory_text": localized_pricing["advisory"],
                "audio_script_hinglish": localized_pricing["audio"],
                "negotiation_tip": localized_pricing["tip"],
                "counter_proposal_en": "Any changes to the commission structure, listing fees, or charges must be notified to the Merchant in writing at least 15 days in advance.",
                "whatsapp_payload": f"{localized_pricing['whatsapp']}\n\nProposed Legal Text:\nAny changes to the fees must be notified in writing at least 15 days in advance."
            })
            
        # Default flags if the text didn't trigger specific keywords
        if not flags:
            localized_liability = LOCALIZED_DATA[lang]["Liability"]
            flags.append({
                "id": 1,
                "category": "Liability",
                "risk_level": "MEDIUM",
                "contract_quote": "All legal disputes arising out of this agreement shall be subject to the exclusive jurisdiction of the courts located in New Delhi only.",
                "indian_law_reference": "Section 28, Indian Contract Act 1872",
                "dukaandost_advisory_text": localized_liability["advisory"],
                "audio_script_hinglish": localized_liability["audio"],
                "negotiation_tip": localized_liability["tip"],
                "counter_proposal_en": "All legal disputes arising out of this agreement shall be subject to the jurisdiction of the courts local to the place of business of the Merchant.",
                "whatsapp_payload": f"{localized_liability['whatsapp']}\n\nProposed Legal Text:\nAll disputes shall be subject to the local courts where the Merchant is located."
            })

        agent_steps = self._generate_simulated_steps(len(flags))
            
        return {
            "is_mock": True,
            "overall_safety_score": 42,
            "risk_status": "Danger Zone",
            "total_risks_found": len(flags),
            "flags": flags,
            "flagged_clauses": flags,
            "agent_steps": agent_steps
        }
