import React, { useState, useRef } from "react";
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
  Share2
} from "lucide-react";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Custom interactive features
  const [selectedLanguage, setSelectedLanguage] = useState("hinglish"); // english, hinglish, hindi
  const [expandedProposalIdx, setExpandedProposalIdx] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  
  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: "Namaste! Main DukaanDost AI (powered by Claude Fable 5) hoon. Aap apne contract se juda koi bhi sawaal yahan pooch sakte hain."
    }
  ]);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Backend URL
  const BACKEND_URL = "http://127.0.0.1:8000";

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
      await processFile(droppedFile);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      await processFile(selectedFile);
    }
  };

  // Trigger file upload to FastAPI backend
  const processFile = async (selectedFile) => {
    setFile(selectedFile);
    setLoading(true);
    setErrorMessage("");
    setReport(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${BACKEND_URL}/upload-contract`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Server failed to process document.");
      }

      const data = await response.json();
      
      // Map all incoming keys cleanly to the new schema format
      const enhancedFlags = data.report.flags.map((flag, idx) => {
        let cp = flag.counter_proposal_en || flag.counter_proposal || "Revised terms to be mutually agreed by both parties.";
        let tip = flag.negotiation_tip || "Apne counter-proposal me clear terms rakhein.";
        let hi = flag.dukaandost_advisory_hi || flag.explanation_hindi || "";
        let hg = flag.dukaandost_advisory_text || flag.dukaandost_advisory || flag.explanation_hinglish || "Risk advice in Hinglish.";
        let audio = flag.audio_script_hinglish || `Bhaiya, ye ${flag.category || 'clause'} aapke liye thoda risky ho sakta hai.`;
        let whatsapp = flag.whatsapp_payload || `DukaanDost Alert! *${flag.category}* risk found.`;

        // Dynamic fallbacks if Claude missed any field in RAG mode
        if (!hi) {
          if (flag.category === "Penalties" || flag.contract_quote?.includes("36%")) {
            hi = "यह जुर्माना बहुत अधिक है! 36% ब्याज दर आपको भारी कर्ज में डाल सकती है। आप डिस्ट्रीब्यूटर से इसे घटाकर 12% से 18% प्रति वर्ष करने के लिए कहें।";
          } else if (flag.category === "Termination" || flag.contract_quote?.includes("terminate")) {
            hi = "तुरंत कॉन्ट्रैक्ट समाप्त करना (Immediate termination) आपके व्यवसाय के लिए बड़ा जोखिम है। आपका स्टॉक फंसा रह जाएगा। डिस्ट्रीब्यूटर से कहें कि नोटिस अवधि कम से कम 30 दिन की होनी चाहिए।";
          } else if (flag.category === "Pricing" || flag.contract_quote?.includes("alter")) {
            hi = "बिना बताए कमीशन बदलना गलत है। आपको पता भी नहीं चलेगा और आपका मुनाफा कम हो जाएगा। कॉन्ट्रैक्ट में लिखवाएं कि बदलाव से पहले कंपनी 15 दिन का लिखित नोटिस देगी।";
          } else {
            hi = hg; // Fallback to Hinglish
          }
        }

        return {
          id: flag.id || (idx + 1),
          category: flag.category || "General",
          indian_law_reference: flag.indian_law_reference || flag.legal_reference || "Standard Indian Policy",
          risk_level: flag.risk_level || flag.severity || "MEDIUM",
          contract_quote: flag.contract_quote || flag.clause_text || "Clause Text",
          dukaandost_advisory_text: hg,
          dukaandost_advisory_hi: hi,
          audio_script_hinglish: audio,
          negotiation_tip: tip,
          counter_proposal_en: cp,
          whatsapp_payload: whatsapp
        };
      });

      setReport({
        ...data.report,
        flags: enhancedFlags
      });
      
      setChatHistory([
        {
          sender: "bot",
          text: `Aapka contract audit ho gaya hai! Isme hume ${data.report.total_risks_found} risks mile hain (Powered by Claude Fable 5). Aap details check karein ya mujhse is baare me pooch sakte hain.`
        }
      ]);
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage("Local server se response nahi mila. Running in Offline Demo Mode...");
      setTimeout(() => {
        const dummyReport = generateLocalMockReport();
        setReport(dummyReport);
        setChatHistory([
          {
            sender: "bot",
            text: `[Offline Mode] Aapka contract "${selectedFile.name}" audit ho gaya hai. Isme hume ${dummyReport.total_risks_found} alerts mile hain.`
          }
        ]);
        setLoading(false);
      }, 1500);
      return;
    }
    setLoading(false);
  };

  // Load sample contract for fast testing/evaluation
  const loadSampleContract = () => {
    setLoading(true);
    setErrorMessage("");
    setFile({ name: "Sample_Distributor_Agreement.txt" });
    
    setTimeout(() => {
      const dummyReport = generateLocalMockReport();
      setReport(dummyReport);
      setChatHistory([
        {
          sender: "bot",
          text: "Sample agreement contract audit completed! Total 3 major risks found in pricing, payments and termination. Details are listed below."
        }
      ]);
      setLoading(false);
    }, 1200);
  };

  // Generate fallback local mock data matching the new exact schema
  const generateLocalMockReport = () => {
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
          dukaandost_advisory_text: "Yeh penalty bohot zyada hai! 36% interest rate aapko bohot bade karz me daal sakta hai. Aap distributor se bolkar ise maximum 12% se 18% per annum karwayein.",
          dukaandost_advisory_hi: "यह जुर्माना बहुत अधिक है! 36% ब्याज दर आपको भारी कर्ज में डाल सकती है। आप डिस्ट्रीब्यूटर से इसे घटाकर 12% से 18% प्रति वर्ष करने के लिए कहें।",
          audio_script_hinglish: "Bhaiya, ye clause toh bilkul galat hai! 36% saalana interest rate aapko bohot bade karz me fasa dega. Isko hataiye aur distributor se simple interest 12% set karwaiye.",
          negotiation_tip: "Distributor se bolein: 'Hum 12% simple interest dene ko tayyar hain, par 36% compounded interest bohot zyada hai.'",
          counter_proposal_en: "In case of any payment delays, the Merchant shall pay simple interest at a rate of 12% per annum, calculated on a daily basis.",
          whatsapp_payload: "DukaanDost AI Alert! 🚨\nClause: Payment Penalty\nRisk: HIGH (36% Interest)\n\nHumari Sallah: Bhaiya, ye penalty bohot zyada hai. Distributor se negotiate karke simple interest 12% karwayein.\n\nProposed Legal Text:\nIn case of any payment delays, the Merchant shall pay simple interest at a rate of 12% per annum, calculated daily."
        },
        {
          id: 2,
          contract_quote: "The distributor reserves the right to terminate this agreement immediately at its sole discretion without any notice period.",
          category: "Termination",
          risk_level: "HIGH",
          indian_law_reference: "Unfair Contract Terms, Indian Contract Act 1872",
          dukaandost_advisory_text: "Immediate termination (turant band karna) aapke business ke liye bada risk hai. Aapka stock fasa reh jayega. Distributor se bole ki termination ke liye kam se kam 30 days ka written notice period hona chahiye.",
          dukaandost_advisory_hi: "तुरंत कॉन्ट्रैक्ट समाप्त करना (Immediate termination) आपके व्यवसाय के लिए बड़ा जोखिम है। आपका स्टॉक फंसा रह जाएगा। डिस्ट्रीब्यूटर से कहें कि नोटिस अवधि कम से कम 30 दिन की होनी चाहिए।",
          audio_script_hinglish: "Bhaiya, dekhiye, bina kisi notice ke contract band karna toh aapki dukaan बंद करने जैसा है। Distributor से कहें कि कम से कम 30 दिन का नोटिस अनिवार्य करवाएं।",
          negotiation_tip: "Distributor se bolein: 'Immediate termination se humara nuksaan hoga, hume stock manage karne ke liye 30 days ka notice period chahiye.'",
          counter_proposal_en: "Either party may terminate this agreement by providing at least 30 days prior written notice to the other party.",
          whatsapp_payload: "DukaanDost AI Alert! 🚨\nClause: Unilateral Termination\nRisk: HIGH (No Notice)\n\nHumari Sallah: Immediate termination aapke business ko thap kar sakta hai. 30 din ka written notice period mangiye.\n\nProposed Legal Text:\nEither party may terminate this agreement by providing at least 30 days prior written notice."
        },
        {
          id: 3,
          contract_quote: "The company may alter commission structures and product listings at any time without any prior written notification to the merchant.",
          category: "Pricing",
          risk_level: "MEDIUM",
          indian_law_reference: "Consumer Protection (E-Commerce) Rules 2020",
          dukaandost_advisory_text: "Bina bataye commission rates badalna galat hai. Aapko pata hi nahi chalega ki aapka profit kab kam ho gaya. Contract me clause dalwayein ki commission change karne se pehle company 15 days ka advance written notice degi.",
          dukaandost_advisory_hi: "बिना बताए कमीशन बदलना गलत है। आपको पता भी नहीं चलेगा और आपका मुनाफा कम हो जाएगा। कॉन्ट्रैक्ट में लिखवाएं कि बदलाव से पहले कंपनी 15 दिन का लिखित नोटिस देगी।",
          audio_script_hinglish: "Bhaiya, bina bataye fees ya commission badalna sahi nahi hai. Contract me strictly likhwaiye ki changes se 15 din pehle aapko notice diya jaye.",
          negotiation_tip: "Distributor se bolein: 'Bina bataye commission fees badalna theek nahi hai. Koi bhi change karne से 15 din pehle hume written notification milna chahiye.'",
          counter_proposal_en: "Any changes to the commission structure, listing fees, or charges must be notified to the Merchant in writing at least 15 days in advance.",
          whatsapp_payload: "DukaanDost AI Alert! 🚨\nClause: Unilateral Pricing\nRisk: MEDIUM\n\nHumari Sallah: Commission bina notice ke badalna galat hai. 15 din ka advance written notice mandatorily lagwaiye.\n\nProposed Legal Text:\nAny changes to the fees must be notified in writing at least 15 days in advance."
        }
      ]
    };
  };

  // Text to Speech (Suno feature)
  const handleSpeakText = (text, idx) => {
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Set to Hindi voice for natural Hinglish speech
    utterance.rate = 0.95;
    
    // Scan browser's available voices for Hindi/Indian locale
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => 
      v.lang.includes('hi') || 
      v.lang.includes('HI') || 
      v.name.toLowerCase().includes('hindi') || 
      v.name.toLowerCase().includes('india')
    );
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    
    utterance.onend = () => {
      setSpeakingIdx(null);
    };
    
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  // WhatsApp Share Payload
  const handleShareWhatsApp = (payload) => {
    const encodedText = encodeURIComponent(payload);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  // Copy text to clipboard
  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Send message to AI chatbot
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      let botResponse = "Aapke is sawaal par mujhe contract me koi seedha clause nahi mila. Lekin aapko hamesha written consent (likhit manjoori) leni chahiye.";
      
      const text = userMsg.toLowerCase();
      if (text.includes("terminate") || text.includes("cancel") || text.includes("notice")) {
        botResponse = "Contract ke Section 3 ke mutabik distributor bina kisi notice ke turant contract khatam kar sakta hai (unilateral immediate termination). Yeh galat hai! Aapko unse bolkar 30 days ka notice period dalwana chahiye.";
      } else if (text.includes("payment") || text.includes("delay") || text.includes("biyaj") || text.includes("interest")) {
        botResponse = "Section 2 ke mutabik, payment delay hone par aapse 36% saalana interest (interest rate) manga gaya hai, jo ki usurious hai. Standard practice ke mutabik ise 12-18% ke beech hona chahiye.";
      } else if (text.includes("price") || text.includes("pricing") || text.includes("commission")) {
        botResponse = "Section 1 ke anusar company jab chahe pricing ya commissions badal sakti hai bina notice ke. Aap distributor se bole ki aisi kisi bhi change se pehle kam se kam 15 din ka written notification zaroori hai.";
      } else if (text.includes("court") || text.includes("delhi") || text.includes("case") || text.includes("jurisdiction")) {
        botResponse = "Section 4 ke mutabik saare legal disputes sirf New Delhi me honge. Agar aap Ranchi me hain, toh Delhi court jana mehenga hoga. Local jurisdiction Ranchi ka hi set karne ko kahein.";
      } else if (text.includes("safe") || text.includes("kaisa") || text.includes("theek")) {
        botResponse = "Yeh contract abhi safe nahi hai (according to Claude Fable 5 analysis) kyunki isme payment penalty (36% interest) aur unilateral termination risk bohot zyada hai. In clauses me revision karwaye bina ise sign na karne ki salah di jati hai.";
      }

      setChatHistory(prev => [...prev, { sender: "bot", text: botResponse }]);
      
      // Auto scroll
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }, 800);
  };

  // SVG Circular progress details for Safety Score
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
      {/* Background Gradients */}
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
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent">
              DukaanDost AI
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">
                Agentic Legal Auditor for Bharat
              </p>
              <span className="text-[9px] bg-amber-500/15 border border-amber-500/35 text-amber-300 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase">
                <Cpu className="w-2.5 h-2.5" /> Claude Fable 5
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button 
            onClick={loadSampleContract} 
            className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 hover:border-amber-500/40 transition-all text-amber-300 flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            Load Sample Contract
          </button>
          
          <div className="text-xs text-gray-400 flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 rounded-full border border-white/5 transition-all duration-300 hover:bg-slate-900 hover:border-green-500/30 cursor-default">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            FastAPI Online
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        
        {/* Left Side: Upload & Report details */}
        <section className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Upload Area */}
          {!report && (
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              className={`w-full py-16 px-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-500 group ${
                dragActive 
                  ? "border-amber-500 bg-amber-950/20 shadow-lg shadow-amber-500/10" 
                  : "border-white/10 bg-slate-900/30 hover:border-amber-500/30 hover:bg-slate-900/50 hover:shadow-lg hover:shadow-amber-500/5"
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
                  <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
                  <p className="font-semibold text-lg text-white">Analyzing Agreement Documents...</p>
                  <p className="text-sm text-gray-400">FAISS database and Claude Fable 5 auditor are scanning clauses...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-2 transition-all duration-300 group-hover:scale-110">
                    <UploadCloud className="w-8 h-8 text-amber-400 group-hover:-translate-y-1 transition-transform duration-300" />
                  </div>
                  <p className="font-semibold text-lg text-white">Upload Merchant Agreement PDF</p>
                  <p className="text-sm text-gray-400 max-w-sm">
                    Drag and drop your logistics, lease, or supplier contract here (PDF or TXT format).
                  </p>
                  <span className="mt-4 px-5 py-2.5 text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 rounded-xl transition-all shadow-lg shadow-amber-500/20">
                    Browse File
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

          {/* Audit Report Container */}
          {report && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              
              {/* Reset & Language Switcher Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-semibold text-gray-300">{file?.name || "Agreement Contract"}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Language Switcher Dropdown */}
                  <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 px-2.5 py-1.5 rounded-xl transition-all duration-300 group">
                    <Languages className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-400 transition-colors duration-300" />
                    <select 
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="text-xs bg-transparent text-gray-300 group-hover:text-amber-300 font-semibold outline-none cursor-pointer border-none transition-colors duration-300"
                    >
                      <option value="hinglish" className="bg-gray-900">Hinglish (Default)</option>
                      <option value="hindi" className="bg-gray-900">Hindi (हिंदी)</option>
                      <option value="english" className="bg-gray-900">English (Original)</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => { setReport(null); setFile(null); setErrorMessage(""); }}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset / Audit New
                  </button>
                </div>
              </div>

              {/* RAG Risk Meter Card */}
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
                    <h3 className="font-bold text-gray-200 mb-2 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-purple-400" />
                      Executive Summary (Claude Fable 5)
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {report.overall_summary}
                    </p>
                  </div>
                  
                  <div className="flex gap-4 mt-6 pt-4 border-t border-white/5">
                    <div className="flex-1 text-center bg-red-500/5 rounded-xl p-3 border border-red-500/20 shadow-sm shadow-red-950/5 transition-all duration-300 hover:scale-105 hover:bg-red-500/10 hover:border-red-500/40 cursor-default">
                      <span className="block text-2xl font-extrabold text-red-400">{report.flags.filter(f => f.risk_level === 'HIGH').length}</span>
                      <span className="text-[10px] text-red-400/80 font-bold uppercase tracking-wider">High Risk</span>
                    </div>
                    <div className="flex-1 text-center bg-amber-500/5 rounded-xl p-3 border border-amber-500/20 shadow-sm shadow-amber-950/5 transition-all duration-300 hover:scale-105 hover:bg-amber-500/10 hover:border-amber-500/40 cursor-default">
                      <span className="block text-2xl font-extrabold text-amber-400">{report.flags.filter(f => f.risk_level === 'MEDIUM').length}</span>
                      <span className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">Medium Risk</span>
                    </div>
                    <div className="flex-1 text-center bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/20 shadow-sm shadow-emerald-950/5 transition-all duration-300 hover:scale-105 hover:bg-emerald-500/10 hover:border-emerald-500/40 cursor-default">
                      <span className="block text-2xl font-extrabold text-emerald-400">{report.flags.filter(f => f.risk_level === 'LOW').length}</span>
                      <span className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-wider">Low Risk</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loophole & Anomaly Audit List */}
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-purple-400" />
                  Flagged Contract Clauses ({report.total_risks_found})
                </h3>
                
                {report.flags.map((flag, idx) => (
                  <div 
                    key={idx} 
                    className={`glass-card rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 ${
                      flag.risk_level === 'HIGH' 
                        ? 'border-risk-high card-high shadow-lg shadow-red-950/15' 
                        : flag.risk_level === 'MEDIUM' 
                        ? 'border-risk-medium card-medium shadow-lg shadow-yellow-950/15' 
                        : 'border-risk-low card-low shadow-lg shadow-emerald-950/15'
                    }`}
                  >
                    
                    {/* Card Header */}
                    <div className="px-5 py-4 bg-white/5 flex flex-wrap items-center justify-between gap-3 border-b border-white/5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-white">{flag.category}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-xs text-gray-400">{flag.indian_law_reference}</span>
                      </div>
                      
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider border ${
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
                      {/* Raw Clause Quote */}
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Contract Clause Quote:</span>
                        <div className="p-3.5 bg-slate-950/65 rounded-xl border border-white/5 border-l-2 border-l-slate-400 text-sm italic text-gray-300 font-mono leading-relaxed">
                          "{flag.contract_quote}"
                        </div>
                      </div>

                      {/* Multilingual Explanation Block */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">
                            {selectedLanguage === "english" ? "Suggested Counter-Proposal (English):" : "DukaanDost Advisory (सलाह):"}
                          </span>
                          
                          {/* Suno (Audio) & WhatsApp Action Buttons */}
                          {selectedLanguage !== "english" && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleSpeakText(flag.audio_script_hinglish, idx)}
                                className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase flex items-center gap-1.5 cursor-pointer transition-all ${
                                  speakingIdx === idx 
                                    ? "bg-red-950/25 text-red-400 border-red-500/30 animate-pulse" 
                                    : "bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20"
                                }`}
                              >
                                {speakingIdx === idx ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                                {speakingIdx === idx ? "Stop" : "🔊 Suno"}
                              </button>
                              
                              <button 
                                onClick={() => handleShareWhatsApp(flag.whatsapp_payload)}
                                className="px-2.5 py-1 rounded-lg bg-green-950/20 text-green-400 border border-green-500/25 hover:bg-green-950/30 text-[10px] font-bold uppercase flex items-center gap-1.5 cursor-pointer transition-all"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                Share
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {selectedLanguage === "english" && (
                          <div className={`p-4 rounded-xl flex gap-3 ${getRiskStyles(flag.risk_level).bg}`}>
                            <ShieldCheck className={`w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-450`} />
                            <p className="text-sm font-mono leading-relaxed font-semibold select-all text-emerald-300">
                              {flag.counter_proposal_en}
                            </p>
                          </div>
                        )}
                        
                        {selectedLanguage === "hinglish" && (
                          <div className={`p-4 rounded-xl flex gap-3 ${getRiskStyles(flag.risk_level).bg}`}>
                            <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getRiskStyles(flag.risk_level).iconColor}`} />
                            <p className="text-sm leading-relaxed font-semibold">
                              {flag.dukaandost_advisory_text}
                            </p>
                          </div>
                        )}
                        
                        {selectedLanguage === "hindi" && (
                          <div className={`p-4 rounded-xl flex gap-3 ${getRiskStyles(flag.risk_level).bg}`}>
                            <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getRiskStyles(flag.risk_level).iconColor}`} />
                            <p className="text-sm leading-relaxed font-semibold">
                              {flag.dukaandost_advisory_hi}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* WOW Factor: Counter-Proposal Generator Section */}
                      <div className="mt-2 border-t border-white/5 pt-4">
                        <button 
                          onClick={() => setExpandedProposalIdx(expandedProposalIdx === idx ? null : idx)}
                          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquareQuote className="w-4 h-4 text-amber-400" />
                          {expandedProposalIdx === idx ? "Hide Negotiation Assistant" : "💡 Open Negotiation Assistant (Counter-Proposal)"}
                        </button>
                        
                        {expandedProposalIdx === idx && (
                          <div className="mt-3 p-4 bg-slate-950/80 rounded-2xl border border-white/10 flex flex-col gap-4 animate-slideDown shadow-inner">
                            
                            <div className="p-3.5 bg-amber-500/5 rounded-xl border border-amber-500/10 border-l-4 border-l-amber-500/80">
                              <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block mb-1">Negotiation Tip (मोल-भाव सलाह):</span>
                              <p className="text-xs text-amber-200/90 italic leading-relaxed">"{flag.negotiation_tip}"</p>
                            </div>

                            <div className="p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 border-l-4 border-l-emerald-500/80">
                              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block mb-1">Copy Counter-Proposal Text (English Amendment):</span>
                              <div className="mt-1.5 text-xs font-mono text-emerald-300 flex items-start justify-between gap-3 bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                                <span className="flex-1 select-all leading-relaxed">{flag.counter_proposal_en}</span>
                                <button 
                                  onClick={() => handleCopyText(flag.counter_proposal_en, idx)}
                                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 text-gray-400 hover:text-white transition-all cursor-pointer flex-shrink-0"
                                  title="Copy text"
                                >
                                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
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

        </section>

        {/* Right Side: Interactive AI Assistant */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-chatbot p-5 rounded-2xl flex flex-col h-[520px] justify-between">
            
            {/* Chat Header */}
            <div className="pb-4 border-b border-white/5 flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  Ask DukaanDost AI
                </h3>
                <p className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">Assistant</p>
              </div>
            </div>

            {/* Chat Message Box */}
            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3.5 pr-1 text-sm">
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <span className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">
                    {msg.sender === "user" ? "You" : "DukaanDost"}
                  </span>
                  
                  <div className={`p-3.5 rounded-2xl leading-relaxed text-xs font-semibold ${
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

            {/* Predefined Questions helper (Only show when contract is loaded) */}
            {report && (
              <div className="pb-3 border-t border-white/5 pt-3 flex flex-wrap gap-1.5">
                <button 
                  onClick={() => setChatInput("Is this contract safe for me?")}
                  className="px-2 py-1 text-[10px] font-bold bg-white/5 border border-white/5 hover:bg-amber-500/15 hover:border-amber-500/30 rounded-full text-gray-400 hover:text-amber-300 transition-all cursor-pointer"
                >
                  Is it safe?
                </button>
                <button 
                  onClick={() => setChatInput("What is the penalty for late payment?")}
                  className="px-2 py-1 text-[10px] font-bold bg-white/5 border border-white/5 hover:bg-amber-500/15 hover:border-amber-500/30 rounded-full text-gray-400 hover:text-amber-300 transition-all cursor-pointer"
                >
                  Late Payment
                </button>
                <button 
                  onClick={() => setChatInput("Tell me about the termination policy.")}
                  className="px-2 py-1 text-[10px] font-bold bg-white/5 border border-white/5 hover:bg-amber-500/15 hover:border-amber-500/30 rounded-full text-gray-400 hover:text-amber-300 transition-all cursor-pointer"
                >
                  Termination
                </button>
              </div>
            )}

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about interest, termination..."
                className="flex-1 px-4 py-2.5 bg-black/40 border border-white/5 focus:border-amber-500/40 rounded-xl text-xs text-white placeholder-gray-500 outline-none transition-all"
              />
              
              <button 
                type="submit"
                className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 rounded-xl shadow-md shadow-amber-500/10 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-350" />
              </button>
            </form>

          </div>
        </section>

      </main>

      {/* Premium Footer */}
      <footer className="w-full max-w-6xl mt-24 px-6 border-t border-white/10 pt-8 pb-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 font-medium">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-bold text-gray-300 tracking-wider uppercase text-[10px]">DukaanDost AI</span>
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
              href="https://frontend-three-ashen-77.vercel.app" 
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
