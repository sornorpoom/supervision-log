"use client";

import React, { useState, useEffect } from "react";
import { FolderCheck, Send, CheckCircle2, FileText, School, Calendar, Camera, BarChart3, RefreshCw, Layers } from "lucide-react";

// รายการหมวดหมู่กิจกรรม PA 2570
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

// รายชื่อ 25 อำเภอในจังหวัดเชียงใหม่
const CHIANG_MAI_DISTRICTS = [
  "เมืองเชียงใหม่",
  "จอมทอง",
  "แม่แจ่ม",
  "เชียงดาว",
  "ดอยสะเก็ด",
  "แม่แตง",
  "แม่ริม",
  "สะเมิง",
  "ฝาง",
  "แม่อาย",
  "พร้าว",
  "สันป่าตอง",
  "สันกำแพง",
  "สันทราย",
  "หางดง",
  "ฮอด",
  "ดอยเต่า",
  "อมก๋อย",
  "สารภี",
  "เวียงแหง",
  "ไชยปราการ",
  "แม่วาง",
  "แม่ออน",
  "ดอยหล่อ",
  "กัลยาณิวัฒนา"
];

// *** ตรวจสอบและใส่ Web App URL ของท่านตรงนี้ ***
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyr2LneMXl8D_L-1vMvCCpLFXz8ySZNxiHUi9arRRke2FKkf-H07W8zh6z2eU6_OcOa/exec";

// ฟังก์ชันแปลง ค.ศ. (YYYY-MM-DD) เป็น วัน/เดือน/พ.ศ.
const formatToThaiDate = (isoDate: string) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  const thaiYear = parseInt(year, 10) + 543;
  return `${day}/${month}/${thaiYear}`;
};

export default function SupervisionFormPage() {
  const [rawDate, setRawDate] = useState(new Date().toISOString().split("T")[0]);
  const [formData, setFormData] = useState({
    time: "09:00",
    district: CHIANG_MAI_DISTRICTS[0],
    schoolName: "",
    activityFolderId: PA_ACTIVITIES[8].id,
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
      console.log("Fetch history standby");
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
    const activityObj = PA_ACTIVITIES.find((a) => a.id === formData.activityFolderId);
    
    const payload = {
      ...formData,
      date: thaiFormattedDate, // ส่งวันที่ในรูปแบบ วัน/เดือน/พ.ศ.
      time: `${formData.time} น.`, // ส่งเวลาในระบบ 24 ชม. พร้อมระบุ น.
      activityLabel: activityObj?.label || "",
      photoBase64: photoBase64,
    };

    try {
      await fetch(GAS_API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      setSuccessMsg("บันทึกข้อมูล ภาพถ่าย และสร้าง Google Docs สำเร็จเรียบร้อย!");
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

      {/* สถิติสรุป */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><BarChart3 className="w-5 h-5" /></div>
          <div>
            <div className="text-xs text-slate-500">จำนวนการนิเทศทั้งหมด</div>
            <div className="text-xl font-bold text-slate-900">{historyLogs.length} ครั้ง</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><School className="w-5 h-5" /></div>
          <div>
            <div className="text-xs text-slate-500">โรงเรียนที่เข้านิเทศ</div>
            <div className="text-xl font-bold text-slate-900">
              {new Set(historyLogs.map((l) => l.schoolName)).size} แห่ง
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 md:col-span-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><Layers className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-slate-500">สถานะฐานข้อมูล</div>
              <div className="text-xs font-semibold text-emerald-600">Google Drive เชื่อมต่อแล้ว</div>
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

      {/* ฟอร์มบันทึก */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b pb-2 mb-4">
              <Calendar className="w-4 h-4 text-blue-600" />
              1. ข้อมูลทั่วไปและการลงพื้นที่
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* 1. วันที่นิเทศ (แสดง พ.ศ. กำกับ) */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  วันที่นิเทศ * <span className="text-blue-600 font-normal">({formatToThaiDate(rawDate)})</span>
                </label>
                <input
                  type="date"
                  value={rawDate}
                  onChange={(e) => setRawDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 2. เวลานิเทศ (00:00 - 24:00 น.) */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  เวลานิเทศ (24 ชม.) *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 3. Dropdown 25 อำเภอ เชียงใหม่ */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  อำเภอ / พื้นที่ (เชียงใหม่) *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {CHIANG_MAI_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      อ.{dist}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">ชื่อสถานศึกษา / หน่วยงานที่เข้านิเทศ *</label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="ระบุชื่อโรงเรียน เช่น โรงเรียนวัดดอนจั่น"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
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
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {PA_ACTIVITIES.map((act) => (
                    <option key={act.id} value={act.id}>{act.label}</option>
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* แนบภาพถ่าย */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b pb-2 mb-4">
              <Camera className="w-4 h-4 text-purple-600" />
              4. ภาพถ่ายกิจกรรมการนิเทศ (แนบลง Google Docs อัตโนมัติ)
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
            {isLoading ? "กำลังบันทึกข้อมูลและส่งไฟล์ลง Drive..." : "บันทึกข้อมูลและสร้างเอกสารลง Drive"}
          </button>
        </form>
      </div>

      {/* ประวัติการนิเทศ */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ประวัติการนิเทศทั้งหมด ({historyLogs.length} รายการ)
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
                    {log.date} เวลา {log.time}
                  </span>
                </div>
                <div className="text-xs text-amber-800">📁 {log.activityLabel}</div>
                {log.strengths && <p className="text-xs text-slate-600"><strong>จุดเด่น:</strong> {log.strengths}</p>}
                {log.improvements && <p className="text-xs text-slate-600"><strong>ข้อเสนอแนะ:</strong> {log.improvements}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
