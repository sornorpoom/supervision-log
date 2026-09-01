"use client";

import React, { useState } from "react";
import { FolderCheck, Send, CheckCircle2, FileText, School, Calendar } from "lucide-react";

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

export default function SupervisionFormPage() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    district: "เมืองเชียงใหม่",
    schoolName: "",
    activityFolderId: PA_ACTIVITIES[8].id,
    objective: "",
    strengths: "",
    improvements: "",
    agreements: "",
  });

  const [submittedLogs, setSubmittedLogs] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      ...formData,
      id: Date.now(),
      activityLabel: PA_ACTIVITIES.find((a) => a.id === formData.activityFolderId)?.label,
      createdAt: new Date().toLocaleTimeString("th-TH"),
    };
    setSubmittedLogs((prev) => [newLog, ...prev]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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

      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>บันทึกข้อมูลตัวอย่างสำเร็จ (รอบทดสอบ UI)</span>
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
                <label className="block text-xs font-medium text-slate-600 mb-1">เลือกกิจกรรม (Google Drive) *</label>
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
                  placeholder="เช่น นิเทศติดตามการจัดการเรียนรู้เชิงรุก (Active Learning)"
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
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl shadow-sm transition"
          >
            <Send className="w-4 h-4" />
            บันทึกข้อมูลการนิเทศ (ทดสอบรอบที่ 1)
          </button>
        </form>
      </div>

      {submittedLogs.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ประวัติการบันทึกในการทดสอบรอบนี้ ({submittedLogs.length} รายการ)
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {submittedLogs.map((log) => (
              <div key={log.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold text-slate-900">{log.schoolName} ({log.district})</span>
                  <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-full">
                    {log.date} เวลา {log.time}
                  </span>
                </div>
                <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg inline-block">
                  📁 {log.activityLabel}
                </div>
                {log.objective && <p className="text-sm text-slate-600"><strong>วัตถุประสงค์:</strong> {log.objective}</p>}
                {log.strengths && <p className="text-sm text-slate-600"><strong>จุดเด่น:</strong> {log.strengths}</p>}
                {log.improvements && <p className="text-sm text-slate-600"><strong>ข้อเสนอแนะ:</strong> {log.improvements}</p>}
                {log.agreements && <p className="text-sm text-slate-600"><strong>ข้อตกลงร่วม:</strong> {log.agreements}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
