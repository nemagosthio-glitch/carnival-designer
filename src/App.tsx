import React, { useState, ChangeEvent } from 'react';
// تأكد من إضافة مكتبة html2pdf.js للمشروع
import html2pdf from 'html2pdf.js';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    // 1. المدخلات الأساسية
    name: '', goal: '', age: '6-9 سنين', totalTime: '4 ساعات',
    // 2. الخيمة الافتتاحية
    openTime: '', openTheme: '', hymnCount: 3,
    // 3. الخيمة التعليمية
    tentName: '', sketchTime: '20', charCount: 3, theaterType: 'درامي اشخاص', showType: 'عرض تمثيلي',
    // 4. بارتيشن الألعاب
    gameObjective: '', tools: '', childrenCount: 20, gameTime: '',
    // 5. الديكور والكرافت
    craftTime: '', craftChildren: '', craftTools: '',
    // 6. المخرجات
    results: { titles: '', opening: '', script: '', game: '', decor: '' }
  });

const API_KEY = "AIzaSyCVHu-p0Jr8Z2F_yWbmE5WcvvyZUNHqSOU";

const askGemini = async (prompt: string, targetKey: string) => {
    setLoading(true);
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        const resData = await response.json();
        
        if (resData.error) {
            alert(`خطأ من جوجل: ${resData.error.message}`);
        } else if (resData.candidates && resData.candidates[0].content.parts[0].text) {
            const text = resData.candidates[0].content.parts[0].text;
            setData(prev => ({ ...prev, results: { ...prev.results, [targetKey]: text } }));
        }
    } catch (e) {
        alert("فشل الاتصال.. تأكد من الإنترنت");
    }
    setLoading(false);
};
  
  // دالة تصدير الـ PDF التي تحافظ على التنسيق واللغة العربية
  const downloadPDF = () => {
    const element = document.getElementById('full-carnival-content');
    const opt = {
      margin: 5,
      filename: `كرنفال_${data.name || 'خادم_جيمناي'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div dir="rtl" style={{ backgroundColor: '#fdf3e7', minHeight: '100vh', padding: '20px', fontFamily: 'Arial', textAlign: 'right' }}>
      
      {/* القسم القابل للطباعة */}
      <div id="full-carnival-content" style={{ padding: '10px' }}>
        <header style={{ backgroundColor: '#ffcc5c', padding: '15px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: 0 }}>🎡 Carnival Designer AI (النسخة الكاملة الاحترافية)</h2>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* أولاً: المدخلات الأساسية */}
          <section style={cardStyle}>
            <h3 style={titleStyle}>📝 المدخلات الأساسية</h3>
            <input placeholder="اسم الكرنفال" style={inputStyle} onChange={(e) => setData({...data, name: e.target.value})} />
            <input placeholder="الهدف الروحي" style={inputStyle} onChange={(e) => setData({...data, goal: e.target.value})} />
            <select style={inputStyle} onChange={(e) => setData({...data, age: e.target.value})}>
               <option>حضانة (3-5 سنين)</option>
               <option>ابتدائي صغير (6-9 سنين)</option>
               <option>ابتدائي كبير (10-12 سنة)</option>
            </select>
            <button style={btnStyle} onClick={() => askGemini(`بناءً على كرنفال "${data.name}" وهدفه "${data.goal}" لسن "${data.age}"، اقترح 5 أسماء كرياتيف وشعار، و9 عناوين لخيام تعليمية.`, 'titles')}>توليد الأفكار الأساسية ✨</button>
            <div style={resStyle}>{data.results.titles}</div>
          </section>

          {/* ثانياً: الخيمة الافتتاحية */}
          <section style={cardStyle}>
            <h3 style={titleStyle}>⛺ الخيمة الافتتاحية</h3>
            <input placeholder="الموضوع" style={inputStyle} onChange={(e) => setData({...data, openTheme: e.target.value})} />
            <input placeholder="عدد الترانيم" type="number" style={inputStyle} onChange={(e) => setData({...data, hymnCount: +e.target.value})} />
            <button style={btnStyle} onClick={() => askGemini(`ألف 3 شعارات لافتتاحية كرنفال عن "${data.openTheme}" واقترح ${data.hymnCount} ترانيم مناسبة لسن "${data.age}".`, 'opening')}>توليد محتوى الافتتاح</button>
            <div style={resStyle}>{data.results.opening}</div>
          </section>

          {/* ثالثاً: الخيمة التعليمية */}
          <section style={{ ...cardStyle, gridColumn: 'span 2' }}>
            <h3 style={titleStyle}>📖 الخيمة التعليمية (The Core)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '10px' }}>
              <input placeholder="اسم الخيمة" style={inputStyle} onChange={(e) => setData({...data, tentName: e.target.value})} />
              <input placeholder="وقت الاسكتش" style={inputStyle} onChange={(e) => setData({...data, sketchTime: e.target.value})} />
              <select style={inputStyle} onChange={(e) => setData({...data, theaterType: e.target.value})}>
                  <option>درامي اشخاص</option><option>مسكات</option><option>مسرح أسود</option><option>مسرح ظل</option><option>عرايس</option>
              </select>
              <select style={inputStyle} onChange={(e) => setData({...data, showType: e.target.value})}>
                  <option>عرض تمثيلي</option><option>عرض مغنى</option>
              </select>
            </div>
            <button style={{ ...btnStyle, backgroundColor: '#4db8ff' }} onClick={() => askGemini(`اكتب Script مسرحي لسن "${data.age}" عن "${data.goal}"، النوع "${data.theaterType}"، في وقت "${data.sketchTime}" دقيقة.`, 'script')}>توليد الإسكتش والأنشطة 🎭</button>
            <div style={{ ...resStyle, minHeight: '150px' }}>{data.results.script}</div>
          </section>

          {/* رابعاً: بارتيشن الألعاب */}
          <section style={cardStyle}>
            <h3 style={titleStyle}>🎮 بارتيشن الألعاب (Fun Zone)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input placeholder="هدف اللعبة" style={inputStyle} onChange={(e) => setData({...data, gameObjective: e.target.value})} />
              <input placeholder="وقت اللعبة (دقيقة)" type="number" style={inputStyle} onChange={(e) => setData({...data, gameTime: e.target.value})} />
            </div>
            <label style={labelStyle}>الخامات المتاحة:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', fontSize: '12px', background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
              {['أقماع', 'كرات', 'بالونات', 'حبال', 'مواسير', 'حرة'].map(tool => (
                <label key={tool}><input type="checkbox" value={tool} onChange={(e) => {
                  const val = e.target.value;
                  const current = data.tools ? data.tools.split(', ').filter(t => t !== '') : [];
                  setData({...data, tools: e.target.checked ? [...current, val].join(', ') : current.filter(t => t !== val).join(', ')});
                }} /> {tool}</label>
              ))}
            </div>
            <button style={btnStyle} onClick={() => askGemini(`ابتكر لعبة لسن "${data.age}" لعدد 20 لاعب، وقتها "${data.gameTime}"، الهدف: "${data.gameObjective}"، الخامات: "${data.tools}".`, 'game')}>ابتكار اللعبة 🎲</button>
            <div style={resStyle}>{data.results.game}</div>
          </section>

          {/* خامساً: الديكور والعمل الفني */}
          <section style={cardStyle}>
            <h3 style={titleStyle}>🎨 الديكور والكرافت</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input placeholder="وقت الكرافت" type="number" style={inputStyle} onChange={(e) => setData({...data, craftTime: e.target.value})} />
              <input placeholder="عدد الأطفال" type="number" style={inputStyle} onChange={(e) => setData({...data, craftChildren: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', fontSize: '11px', background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px' }}>
              {['كرتون', 'ورق', 'خيش', 'فوم', 'إعادة تدوير', 'حرة'].map(tool => (
                <label key={tool}><input type="checkbox" value={tool} onChange={(e) => {
                  const val = e.target.value;
                  const current = data.craftTools ? data.craftTools.split(', ') : [];
                  setData({...data, craftTools: e.target.checked ? [...current, val].join(', ') : current.filter(t => t !== val).join(', ')});
                }} /> {tool}</label>
              ))}
            </div>
            <button style={{ ...btnStyle, backgroundColor: '#28a745' }} onClick={() => {
              const prompt = `ابتكر عمل فني لعدد "${data.craftChildren}" طفل في وقت "${data.craftTime}" دقيقة. الخامات: "${data.craftTools}". الهدف: "${data.goal}". اشرح الخطوات بوضوح.`;
              askGemini(prompt, 'decor');
            }}>توليد الديكور والكرافت 🖼️</button>
            <div style={resStyle}>{data.results.decor}</div>
          </section>

        </div>
      </div>

      {/* زرار التحميل النهائي */}
      <div style={{ textAlign: 'center', marginTop: '30px', paddingBottom: '50px' }}>
        <button 
          style={{ 
            padding: '15px 40px', 
            backgroundColor: '#d9534f', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50px', 
            fontSize: '20px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(217, 83, 79, 0.4)'
          }} 
          onClick={downloadPDF}
        >
          تحميل ملف الكرنفال كاملاً PDF 📄
        </button>
      </div>
    </div>
  );
}

// Styles
const cardStyle = { background: '#fff', padding: '20px', borderRadius: '15px', borderTop: '5px solid #ffcc5c', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const titleStyle = { margin: '0 0 15px 0', color: '#856404', fontSize: '18px' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#fd7e14', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' };
const resStyle = { marginTop: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '8px', fontSize: '13px', whiteSpace: 'pre-wrap', border: '1px dashed #ccc' };
