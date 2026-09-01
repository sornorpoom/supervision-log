"use client";

import React, { useState, useEffect } from "react";
import { FolderCheck, Send, CheckCircle2, FileText, School, Calendar, Camera, BarChart3, RefreshCw, Layers, BookOpen } from "lucide-react";

const PA_ACTIVITIES = [
  { id: "1JZDMPICYQMpCuSrw0FfSzywicp4z1KOQ", label: "ส่วนที่ 10 การนิเทศโรงเรียน 70", type: "supervision" },
  { id: "1weieOmSg_4t55SzbdXux7aMSoLW5WEHi", label: "ส่วนที่ 9 การพัฒนาตนเอง 70", type: "selfDev" },
];

const CHIANG_MAI_DISTRICTS = [
  "เมืองเชียงใหม่", "จอมทอง", "แม่แจ่ม", "เชียงดาว", "ดอยสะเก็ด", "แม่แตง", "แม่ริม", "สะเมิง", 
  "ฝาง", "แม่อาย", "พร้าว", "สันป่าตอง", "สันกำแพง", "สันทราย", "หางดง", "ฮอด", "ดอยเต่า", 
  "อมก๋อย", "สารภี", "เวียงแหง", "ไชยปราการ", "แม่วาง", "แม่ออน", "ดอยหล่อ", "กัลยาณิวัฒนา", "ออนไลน์ / อื่นๆ"
];

// *** ใส่ Web App URL ของท่านตรงนี้ ***
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyr2LneMXl8D_L-1vMvCCpLFXz8ySZNxiHUi9arRRke2FKkf-H07W8zh6z2eU6_OcOa/exec";

const formatToThaiDate = (isoDate: string) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  const thaiYear = parseInt(year, 10) + 543;
  return `${day}/${month}/${thaiYear}`;
};

export default function SupervisionFormPage() {
  const [rawDate, setRawDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedActivityId, setSelectedActivityId] = useState(PA_ACTIVITIES[0].id);
  
  const [formData, setFormData] = useState({
    time: "09:00",
    district: CHIANG_MAI_DISTRICTS[0],
    schoolName: "",
    objective: "",
    strengths: "",
    improvements: "",
    agreements: "",
  });

  const [photoBase64, setPhotoBase64] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);

  // เช็กว่าเป็นโหมดพัฒนาตนเองหรือไม่
  const isSelfDev = selectedActivityId === PA_ACTIVITIES[1].id;

  const fetchHistory = async () => {
    if (!GAS_API_URL || GAS_API_URL.includes("วาง_WEB_APP_URL")) return;
    setIsFetchingHistory(true);
    try {
      const res = await fetch(GAS_API_URL);
      const result = await res.json();
      if (result.status === "success") {
        setHistoryLogs(result.data);
      }
    } catch (e) {
      console.log("Fetch standby");
    } finally {
      setIsFetchingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        setPhotoPreview(dataUrl);
        setPhotoBase64(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const thaiFormattedDate = formatToThaiDate(rawDate);
    const activityObj = PA_ACTIVITIES.find((a) => a.id === selectedActivityId);
    
    const payload = {
      ...formData,
      formType: isSelfDev ? "selfDev" : "supervision",
      activityFolderId: selectedActivityId,
      activityLabel: activityObj?.label || "",
      date: thaiFormattedDate,
      time: `${formData.time} น.`,
      photoBase64: photoBase64,
    };

    try {
      await fetch(GAS_API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      setSuccessMsg("บันทึกข้อมูลและสร้างเอกสารลง Google Drive เรียบร้อย!");
      setPhotoBase64("");
      setPhotoPreview("");
      setFormData((prev) => ({
        ...prev,
        schoolName: "",
        objective: "",
        strengths: "",
        improvements: "",
        agreements: "",
      }));

      setTimeout(() => {
        fetchHistory();
      }, 3000);

    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMsg(""), 5000);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <header className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            {isSelfDev ? <BookOpen className="w-8 h-8" /> : <School className="w-8 h-8" />}
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              {isSelfDev ? "ระบบบันทึกการพัฒนาตนเองและวิชาชีพ" : "ระบบบันทึกการนิเทศออนไลน์ (Supervision Log)"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              นายรัชภูมิ สมสมัย ศึกษานิเทศก์ สำนักงานศึกษาธิการจังหวัดเชียงใหม่
            </p>
          </div>
        </div>
      </header>

      {/* สถิติสรุป */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><BarChart3 className="w-5 h-5" /></div>
          <div>
            <div className="text-xs text-slate-500">บันทึกทั้งหมด</div>
            <div className="text-xl font-bold text-slate-900">{historyLogs.length} รายการ</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><School className="w-5 h-5" /></div>
          <div>
            <div className="text-xs text-slate-500">หน่วยงาน/โรงเรียน</div>
            <div className="text-xl font-bold text-slate-900">
              {new Set(historyLogs.map((l) => l.schoolName)).size} แห่ง
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 md:col-span-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><Layers className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-slate-500">โหมดปัจจุบัน</div>
              <div className="text-xs font-semibold text-blue-600">{isSelfDev ? "ส่วนที่ 9 พัฒนาตนเอง" : "ส่วนที่ 10 นิเทศโรงเรียน"}</div>
            </div>
          </div>
          <button onClick={fetchHistory} title="รีเฟรชประวัติ" className="text-slate-400 hover:text-slate-700">
            <RefreshCw className={`w-4 h-4 ${isFetchingHistory ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* แบบฟอร์ม Dynamic */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* เลือกหมวดหมู่กิจกรรม */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-2">
              <FolderCheck className="w-4 h-4 text-amber-600" />
              เลือกประเภทกิจกรรม (PA 2570) *
            </label>
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500"
            >
              {PA_ACTIVITIES.map((act) => (
                <option key={act.id} value={act.id}>{act.label}</option>
              ))}
            </select>
          </div>

          {/* หมวดที่ 1: ข้อมูลทั่วไป */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b pb-2 mb-4">
              <Calendar className="w-4 h-4 text-blue-600" />
              {isSelfDev ? "1. ข้อมูลการเข้าร่วมกิจกรรมพัฒนาตนเอง" : "1. ข้อมูลทั่วไปและการลงพื้นที่"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {isSelfDev ? "วันที่เข้าร่วม *" : "วันที่นิเทศ *"} <span className="text-blue-600 font-normal">({formatToThaiDate(rawDate)})</span>
                </label>
                <input
                  type="date"
                  value={rawDate}
                  onChange={(e) => setRawDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">เวลาดำเนินการ (24 ชม.) *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">พื้นที่ / รูปแบบ *</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {CHIANG_MAI_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist.includes("ออนไลน์") ? dist : `อ.${dist}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {isSelfDev ? "หน่วยงานที่จัด / สถาบัน / แพลตฟอร์ม *" : "ชื่อสถานศึกษา / หน่วยงานที่เข้านิเทศ *"}
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder={isSelfDev ? "เช่น สำนักงานเลขาธิการคุรุสภา, สพฐ., มหาวิทยาลัยเชียงใหม่" : "ระบุชื่อโรงเรียน เช่น โรงเรียนวัดดอนจั่น"}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {isSelfDev ? "ชื่อหลักสูตร / หัวข้อการอบรม-สัมมนา *" : "วัตถุประสงค์การนิเทศ"}
                </label>
                <input
                  type="text"
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                  placeholder={isSelfDev ? "เช่น หลักสูตรการประยุกต์ใช้ Generative AI ในการจัดการศึกษา" : "เช่น เพื่อติดตามการจัดการเรียนรู้เชิงรุก (Active Learning)"}
                  required={isSelfDev}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* หมวดที่ 2: สาระสำคัญ */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b pb-2 mb-4">
              <FileText className="w-4 h-4 text-emerald-600" />
              {isSelfDev ? "2. สรุปผลการเรียนรู้และการนำไปใช้" : "2. บันทึกผลการนิเทศและข้อเสนอแนะ"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {isSelfDev ? "องค์ความรู้สำคัญที่ได้รับ (Key Takeaways)" : "ประเด็นที่พบ / จุดเด่น (Strengths)"}
                </label>
                <textarea
                  name="strengths"
                  rows={2}
                  value={formData.strengths}
                  onChange={handleChange}
                  placeholder={isSelfDev ? "สรุปใจความสำคัญ หรือทักษะใหม่ที่ได้รับจากการเรียนรู้" : "จุดเด่นที่พบในการจัดการเรียนการสอน"}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {isSelfDev ? "การนำไปประยุกต์ใช้ในงานนิเทศ/ศธจ. (Application)" : "ข้อเสนอแนะเชิงวิชาการ (Recommendations)"}
                </label>
                <textarea
                  name="improvements"
                  rows={2}
                  value={formData.improvements}
                  onChange={handleChange}
                  placeholder={isSelfDev ? "แนวทางนำความรู้ไปต่อยอดในการพัฒนาครูหรือสถานศึกษา" : "ข้อเสนอแนะเพื่อพัฒนา"}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {isSelfDev ? "จำนวนชั่วโมง / บันทึกเพิ่มเติม" : "ข้อตกลงร่วม / แนวทางติดตามผล (Agreements)"}
                </label>
                <textarea
                  name="agreements"
                  rows={2}
                  value={formData.agreements}
                  onChange={handleChange}
                  placeholder={isSelfDev ? "เช่น จำนวน 6 ชั่วโมง, ได้รับเกียรติบัตรเรียบร้อย" : "ข้อตกลงร่วมกับครู/โรงเรียน"}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* แนบรูปถ่าย / เกียรติบัตร */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b pb-2 mb-4">
              <Camera className="w-4 h-4 text-purple-600" />
              {isSelfDev ? "3. ภาพถ่ายเกียรติบัตร / ร่องรอยการเรียนรู้" : "3. ภาพถ่ายกิจกรรมการนิเทศ"}
            </h2>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {photoPreview && (
                <div className="relative w-44 h-32 rounded-lg overflow-hidden border border-slate-300 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 text-white font-medium py-3 px-6 rounded-xl shadow-sm transition ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "กำลังบันทึกข้อมูลและส่งไฟล์ลง Drive..." : (isSelfDev ? "บันทึกข้อมูลการพัฒนาตนเอง" : "บันทึกข้อมูลการนิเทศ")}
          </button>
        </form>
      </div>

      {/* ประวัติย้อนหลัง */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ประวัติการบันทึกทั้งหมด ({historyLogs.length} รายการ)
        </h3>

        {historyLogs.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">ยังไม่มีประวัติ หรือกำลังโหลดข้อมูล...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {historyLogs.map((log) => (
              <div key={log.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900 text-sm md:text-base">
                    {log.schoolName} ({log.district})
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded">
                    {log.date}
                  </span>
                </div>
                <div className="text-xs text-amber-800">📁 {log.activityLabel}</div>
                {log.objective && <p className="text-xs text-slate-600"><strong>เรื่อง/หลักสูตร:</strong> {log.objective}</p>}
                {log.strengths && <p className="text-xs text-slate-600 line-clamp-1"><strong>สาระสำคัญ:</strong> {log.strengths}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
