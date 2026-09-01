"use client";

import React, { useState } from "react";
import { FolderCheck, Send, CheckCircle2, FileText, School, Calendar, ExternalLink, Loader2 } from "lucide-react";

const PA_ACTIVITIES = [
  { id: "1K82qP0IeKyS40jzDcv4dA-cfcur0zxmw", label: "ส่วนที่ 2 ข้อตกลงตามตำแหน่ง 70" },
  { id: "1bPJCLdTWKD2yMYQXvXcZNs__m-W9jAMV", label: "ส่วนที่ 3 ข้อตกลงตามประเด็นท้าทาย 70" },
  { id: "1jQr7TAd_GSZ3rp2X7P__smuh_Ki1Epwx", label: "ส่วนที่ 4 รายงานการวิจัย 70" },
  { id: "1p3dtwzRUiuYa5vhyW1-W3cPAVISNx0GL", label: "ส่วนที่ 5 การเขียนบทความ 70" },
  { id: "1A7HKOYxPxyI64lcOPj1JTWkBxUpkwSZQ", label: "ส่วนที่ 6 Youtube 70" },
  { id: "11ypLZxbYSQ1pgx5Ucvldhv7UpyojYMN_", label: "ส่วนที่ 7 การเป็นวิทยากร 70" },
  { id: "18YtNXoitAQ6YbhhUPm2a1B_BZe6JQun-", label: "ส่วนที่ 8 ชั้นหนังสือออนไลน์ 70" },
  { id: "1weieOmSg_4t55SzbdXux7aMSoLW5WEHi", label: "ส่วนที่ 9 การพัฒนาตนเอง 70" },
  { id: "1JZDMPICYQMpCuSrw0FfSzywicp4z1KOQ", label: "ส่วนที่ 10 การนิเทศโรงเรียน 70" },
  { id: "1BgMIQdvAtb1XlLkq-eoE_ABITUFX3oTP", label: "ส่วนที่ 11 Assessment Talk 70" },
  { id: "1Ejg77Vhch7kaRCSllencBx98fHzpb8yK", label: "ส่วนที่ 12 Google Classroom 70" },
  { id: "1pvLao9eWo1tsYekjqliw7R_wmIbd4Bus", label: "ส่วนที่ 13 AI for education 70" },
  { id: "18zTgRAr5_Uq7DZpYrijV_oykUvLqq7K5", label: "ส่วนที่ 14 Story book 70" },
  { id: "17I_A1UxeVsbBlVttc2dgGRSOrd4yt-eO", label: "ส่วนที่ 15 PISA 2029 70" },
  { id: "1GXKnx3_gyEv5B-fXAhEADMWA_8Lxt8Yb", label: "ส่วนที่ 16 AI for digital art 70" },
];

// *** วาง Web App URL จาก Google Apps Script ตรงนี้ ***
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbz_svWuKBgvw6tsa3kPAis4saZZAf4odPWhasf9D8WlzQ6BuJG70EqwKqkahoRdh_RU/exec";

export default function SupervisionFormPage() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    district: "เมืองเชียงใหม่",
    schoolName: "",
    activityFolderId: PA_ACTIVITIES[8].id, // ค่าเริ่มต้น: ส่วนที่ 10
    objective: "",
    strengths: "",
    improvements: "",
    agreements: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submittedLogs, setSubmittedLogs] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const activityObj = PA_ACTIVITIES.find((a) => a.id === formData.activityFolderId);
    const payload = {
      ...formData,
      activityLabel: activityObj?.label || "",
    };

    try {
      const res = await fetch(GAS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.status === "success") {
        const newLog = {
          ...payload,
          id: Date.now(),
          docUrl: result.docUrl,
          createdAt: new Date().toLocaleTimeString("th-TH"),
        };
        setSubmittedLogs((prev) => [newLog, ...prev]);
        setSuccessMsg("บันทึกลง Google Sheets และสร้าง Google Docs ลง Drive เรียบร้อย!");
        
        // ล้างเฉพาะเนื้อหาส่วนประเด็น
        setFormData(prev => ({
          ...prev,
          schoolName: "",
          objective: "",
          strengths: "",
          improvements: "",
          agreements: ""
        }));
      } else {
        alert("เกิดข้อผิดพลาด: " + result.message);
      }
    } catch (err) {
      alert("ไม่สามารถเชื่อมต่อ Google Apps Script ได้ กรุณาตรวจสอบ URL หรือสิทธิ์การเข้าถึง");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <School className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              ระบบบันทึกการนิเทศออนไลน์ (Supervision Log)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              นายรัชภูมิ สมสมัย ศึกษานิเทศก์ สำนักงานศึกษาธิการจังหวัดเชียงใหม่
            </p>
          </div>
        </div>
      </header>

      {successMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b pb-2 mb-4">
              <Calendar className="w-4 h-4 text-blue-600" />
              1. ข้อมูลทั่วไปและการลงพื้นที่
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">วันที่นิเทศ *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">เวลานิเทศ</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">อำเภอ / พื้นที่ *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="เช่น เมืองเชียงใหม่"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">ชื่อสถานศึกษา / หน่วยงานที่เข้านิเทศ *</label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="ระบุชื่อโรงเรียน"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b pb-2 mb-4">
              <FolderCheck className="w-4 h-4 text-amber-600" />
              2. โครงการ/กิจกรรม และโฟลเดอร์จัดเก็บ (PA 2570)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">เลือกกิจกรรม (Google Drive ปลายทาง) *</label>
                <select
                  name="activityFolderId"
                  value={formData.activityFolderId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PA_ACTIVITIES.map((act) => (
                    <option key={act.id} value={act.id}>
                      {act.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">วัตถุประสงค์การนิเทศ</label>
                <input
                  type="text"
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                  placeholder="ระบุวัตถุประสงค์"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b pb-2 mb-4">
              <FileText className="w-4 h-4 text-emerald-600" />
              3. บันทึกผลการนิเทศและข้อเสนอแนะ
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">ประเด็นที่พบ / จุดเด่น (Strengths)</label>
                <textarea
                  name="strengths"
                  rows={2}
                  value={formData.strengths}
                  onChange={handleChange}
                  placeholder="จุดเด่นที่พบ"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">ข้อเสนอแนะเชิงวิชาการ (Recommendations)</label>
                <textarea
                  name="improvements"
                  rows={2}
                  value={formData.improvements}
                  onChange={handleChange}
                  placeholder="ข้อเสนอแนะเพื่อพัฒนา"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">ข้อตกลงร่วม / แนวทางติดตามผล (Agreements)</label>
                <textarea
                  name="agreements"
                  rows={2}
                  value={formData.agreements}
                  onChange={handleChange}
                  placeholder="ข้อตกลงร่วมกับครู/โรงเรียน"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 text-white font-medium py-3 px-6 rounded-xl shadow-sm transition ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                กำลังบันทึกข้อมูลและส่งไฟล์ลง Google Drive...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                บันทึกข้อมูลและสร้างเอกสารลง Drive
              </>
            )}
          </button>
        </form>
      </div>

      {submittedLogs.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ประวัติการบันทึกล่าสุด
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {submittedLogs.map((log) => (
              <div key={log.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold text-slate-900">{log.schoolName} ({log.district})</span>
                  {log.docUrl && (
                    <a
                      href={log.docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded"
                    >
                      เปิดไฟล์ Google Docs <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg inline-block">
                  📁 {log.activityLabel}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
