"use client";

import { useState, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbztSnfrP1pyAOPz-UIKn3XAAi-ZJKRybLhsRFQfOroYid_ts9Ebk01lTtZeo28TuFS1/exec";

// ── ページ1フォーム ────────────────────────────────────
type FormState = {
  name: string; kana: string; birthday: string; gender: string; tel: string;
  zip: string; address1: string; address2: string; job: string; visit: string;
  referral: string[]; referrerName: string; snsChannels: string[]; snsOther: string; referralOther: string; painLevel: string; duration: string; painTypes: string[];
  cause: string; symptomDetail: string; otherHospital: string; medicine: string;
  medicineDetail: string; surgery: string; surgeryDetail: string; allergy: string;
  allergyDetail: string; sleep: string; exercise: string; desk: string;
  pregnant: string; other: string; consent: boolean;
};

const initialForm: FormState = {
  name: "", kana: "", birthday: "", gender: "", tel: "",
  zip: "", address1: "", address2: "", job: "", visit: "",
  referral: [], referrerName: "", snsChannels: [], snsOther: "", referralOther: "", painLevel: "", duration: "", painTypes: [],
  cause: "", symptomDetail: "", otherHospital: "", medicine: "",
  medicineDetail: "", surgery: "", surgeryDetail: "", allergy: "",
  allergyDetail: "", sleep: "", exercise: "", desk: "",
  pregnant: "", other: "", consent: false,
};

// ── ページ2ヒアリングシート ────────────────────────────
type HearingState = {
  troubleTime: string[];
  troubleTimeOther: string;
  bodyScore: string;
  worsenWork: string[];
  worsenFamily: string[];
  worsenPrivate: string[];
  worsenOther: string;
  symptomCause: string[];
  currentMaintain: string[];
  currentMaintainSportsOther: string;
  pastMaintain: string[];
  pastMaintainSportsOther: string;
  healthInvestment: string;
  idealBodyTreatment: string;
  idealBodyRoot: string;
  idealBodyMaintenance: string;
  healthConsciousness: string;
  improvementPeriod: string;
  monthlyBudget: string;
  visitFrequency: string;
  preferredTimeZone: string[];
  preferredAMHour: string;
  preferredHour: string;
};

const initialHearing: HearingState = {
  troubleTime: [], troubleTimeOther: "",
  bodyScore: "",
  worsenWork: [], worsenFamily: [], worsenPrivate: [], worsenOther: "",
  symptomCause: [],
  currentMaintain: [], currentMaintainSportsOther: "",
  pastMaintain: [], pastMaintainSportsOther: "",
  healthInvestment: "",
  idealBodyTreatment: "",
  idealBodyRoot: "",
  idealBodyMaintenance: "",
  healthConsciousness: "",
  improvementPeriod: "",
  monthlyBudget: "",
  visitFrequency: "",
  preferredTimeZone: [], preferredAMHour: "", preferredHour: "",
};

function toggleArr(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

// ── SVG 前面 ──────────────────────────────────────────────
function FrontSVG({ selected, onToggle }: { selected: Set<string>; onToggle: (part: string) => void }) {
  const regions: { part: string; shape: React.ReactNode }[] = [
    {
      part: "頭部",
      shape: (
        <>
          <ellipse cx="70" cy="26" rx="22" ry="24" />
          <ellipse cx="63" cy="24" rx="3" ry="2" fill="rgba(80,140,100,0.3)" pointerEvents="none" />
          <ellipse cx="77" cy="24" rx="3" ry="2" fill="rgba(80,140,100,0.3)" pointerEvents="none" />
          <path d="M65 32 Q70 36 75 32" fill="none" stroke="rgba(80,140,100,0.35)" strokeWidth="1.2" pointerEvents="none" />
        </>
      ),
    },
    { part: "首・頸部", shape: <rect x="62" y="49" width="16" height="14" rx="4" /> },
    { part: "右肩", shape: <ellipse cx="30" cy="72" rx="17" ry="11" /> },
    { part: "左肩", shape: <ellipse cx="110" cy="72" rx="17" ry="11" /> },
    { part: "右胸部", shape: <path d="M46 63 Q70 58 70 63 L70 108 Q42 108 42 108 Q40 80 46 63 Z" /> },
    { part: "左胸部", shape: <path d="M70 63 Q94 63 94 63 Q100 80 98 108 L70 108 Z" /> },
    { part: "右腹部", shape: <path d="M42 108 Q70 114 70 108 L70 148 Q70 154 44 148 Z" /> },
    { part: "左腹部", shape: <path d="M70 108 Q98 108 98 108 L96 148 Q70 154 70 148 Z" /> },
    { part: "骨盤・股関節", shape: <path d="M44 148 Q70 154 96 148 Q100 162 96 178 Q70 180 44 178 Q40 162 44 148 Z" /> },
    { part: "右上腕", shape: <rect x="11" y="68" width="19" height="42" rx="9" /> },
    { part: "左上腕", shape: <rect x="110" y="68" width="19" height="42" rx="9" /> },
    { part: "右肘・前腕", shape: <rect x="10" y="110" width="17" height="38" rx="7" /> },
    { part: "左肘・前腕", shape: <rect x="113" y="110" width="17" height="38" rx="7" /> },
    { part: "右手首・手", shape: <ellipse cx="19" cy="161" rx="10" ry="13" /> },
    { part: "左手首・手", shape: <ellipse cx="121" cy="161" rx="10" ry="13" /> },
    { part: "右太もも", shape: <path d="M44 180 Q56 178 64 182 L62 228 Q54 232 44 228 Z" /> },
    { part: "左太もも", shape: <path d="M76 182 Q84 178 96 180 L96 228 Q86 232 78 228 Z" /> },
    { part: "右ひざ", shape: <ellipse cx="53" cy="234" rx="12" ry="8" /> },
    { part: "左ひざ", shape: <ellipse cx="87" cy="234" rx="12" ry="8" /> },
    { part: "右すね・足首", shape: <path d="M42 242 L64 242 L62 280 Q53 284 44 280 Z" /> },
    { part: "左すね・足首", shape: <path d="M76 242 L98 242 L96 280 Q87 284 78 280 Z" /> },
    { part: "右足首（前面）", shape: <ellipse cx="53" cy="286" rx="11" ry="7" /> },
    { part: "左足首（前面）", shape: <ellipse cx="87" cy="286" rx="11" ry="7" /> },
  ];

  return (
    <svg className="body-svg" width="130" height="300" viewBox="0 0 140 300">
      <line x1="70" y1="63" x2="70" y2="108" stroke="rgba(80,140,100,0.35)" strokeWidth="1.2" pointerEvents="none" />
      <line x1="70" y1="108" x2="70" y2="148" stroke="rgba(80,140,100,0.35)" strokeWidth="1.2" pointerEvents="none" />
      {regions.map(({ part, shape }) => {
        const active = selected.has(part);
        return (
          <g key={part} className="body-region" onClick={() => onToggle(part)} style={{ cursor: "pointer" }}>
            {renderRegionShape(shape, active, true)}
          </g>
        );
      })}
    </svg>
  );
}

// ── SVG 背面 ──────────────────────────────────────────────
function BackSVG({ selected, onToggle }: { selected: Set<string>; onToggle: (part: string) => void }) {
  const regions: { part: string; shape: React.ReactNode }[] = [
    {
      part: "後頭部",
      shape: (
        <>
          <ellipse cx="70" cy="26" rx="22" ry="24" />
          <path d="M52 36 Q60 44 70 46 Q80 44 88 36" fill="none" stroke="rgba(60,120,80,0.3)" strokeWidth="1.5" pointerEvents="none" />
        </>
      ),
    },
    { part: "首の後ろ", shape: <rect x="62" y="49" width="16" height="14" rx="4" /> },
    { part: "左肩（背面）", shape: <ellipse cx="30" cy="72" rx="17" ry="11" /> },
    { part: "右肩（背面）", shape: <ellipse cx="110" cy="72" rx="17" ry="11" /> },
    {
      part: "左背中（上部）",
      shape: (
        <>
          <path d="M46 63 Q70 60 70 63 L70 108 Q44 108 44 108 Q42 80 46 63 Z" />
          <path d="M52 70 Q58 80 54 96" fill="none" stroke="rgba(60,120,80,0.3)" strokeWidth="1.5" pointerEvents="none" />
        </>
      ),
    },
    {
      part: "右背中（上部）",
      shape: (
        <>
          <path d="M70 63 Q94 63 94 63 Q98 80 96 108 L70 108 Z" />
          <path d="M88 70 Q82 80 86 96" fill="none" stroke="rgba(60,120,80,0.3)" strokeWidth="1.5" pointerEvents="none" />
        </>
      ),
    },
    { part: "左腰", shape: <path d="M44 108 Q70 112 70 108 L70 148 Q70 152 46 148 Z" /> },
    { part: "右腰", shape: <path d="M70 108 Q96 108 96 108 L94 148 Q70 152 70 148 Z" /> },
    {
      part: "お尻・仙骨",
      shape: (
        <>
          <path d="M42 148 Q70 152 98 148 Q104 162 100 180 Q85 188 70 186 Q55 188 40 180 Q36 162 42 148 Z" />
          <path d="M70 152 Q68 165 70 180" fill="none" stroke="rgba(60,120,80,0.25)" strokeWidth="1.2" pointerEvents="none" />
        </>
      ),
    },
    { part: "左上腕（背面）", shape: <rect x="11" y="68" width="19" height="42" rx="9" /> },
    { part: "右上腕（背面）", shape: <rect x="110" y="68" width="19" height="42" rx="9" /> },
    { part: "左肘（背面）", shape: <rect x="10" y="110" width="17" height="38" rx="7" /> },
    { part: "右肘（背面）", shape: <rect x="113" y="110" width="17" height="38" rx="7" /> },
    { part: "左ふともも（裏）", shape: <path d="M40 186 Q54 182 64 186 L62 230 Q52 234 42 230 Z" /> },
    { part: "右ふともも（裏）", shape: <path d="M76 186 Q86 182 100 186 L98 230 Q88 234 78 230 Z" /> },
    { part: "左ひざ裏", shape: <ellipse cx="52" cy="236" rx="12" ry="8" /> },
    { part: "右ひざ裏", shape: <ellipse cx="88" cy="236" rx="12" ry="8" /> },
    { part: "左ふくらはぎ", shape: <path d="M40 244 Q54 242 64 244 Q66 260 62 280 Q52 284 42 280 Q38 260 40 244 Z" /> },
    { part: "右ふくらはぎ", shape: <path d="M76 244 Q90 242 100 244 Q102 260 98 280 Q88 284 78 280 Q74 260 76 244 Z" /> },
    { part: "左足首（背面）", shape: <ellipse cx="52" cy="288" rx="11" ry="7" /> },
    { part: "右足首（背面）", shape: <ellipse cx="88" cy="288" rx="11" ry="7" /> },
  ];

  return (
    <svg className="body-svg" width="130" height="300" viewBox="0 0 140 300">
      <line x1="70" y1="63" x2="70" y2="108" stroke="rgba(60,120,80,0.35)" strokeWidth="1.2" pointerEvents="none" />
      <line x1="70" y1="108" x2="70" y2="148" stroke="rgba(60,120,80,0.35)" strokeWidth="1.2" pointerEvents="none" />
      {regions.map(({ part, shape }) => {
        const active = selected.has(part);
        return (
          <g key={part} className="body-region" onClick={() => onToggle(part)} style={{ cursor: "pointer" }}>
            {renderRegionShape(shape, active, false)}
          </g>
        );
      })}
    </svg>
  );
}

function renderRegionShape(shape: React.ReactNode, active: boolean, isFront: boolean) {
  const activeFill = "rgba(217,79,79,0.55)";
  const activeStroke = "#b83232";
  const normalFill = isFront ? "rgba(110,190,140,0.22)" : "rgba(90,170,120,0.18)";
  const normalStroke = isFront ? "#7dba9a" : "#6aaa88";

  if (!shape) return null;
  function applyStyle(node: React.ReactNode): React.ReactNode {
    if (!node || typeof node !== "object") return node;
    const el = node as React.ReactElement<React.SVGProps<SVGElement>>;
    if (!el.props) return node;
    const tag = el.type;
    const isDecoration = el.props.pointerEvents === "none" || (el.props as { fill?: string }).fill === "none";
    if (isDecoration) return el;
    const children = el.props.children
      ? Array.isArray(el.props.children) ? el.props.children.map(applyStyle) : applyStyle(el.props.children)
      : undefined;
    const isShape = tag === "ellipse" || tag === "rect" || tag === "path" || tag === "circle";
    if (isShape) {
      return { ...el, props: { ...el.props, fill: active ? activeFill : normalFill, stroke: active ? activeStroke : normalStroke, strokeWidth: active ? "2.5" : "1.5", children } };
    }
    if (children !== undefined) return { ...el, props: { ...el.props, children } };
    return el;
  }
  if (Array.isArray(shape)) return shape.map(applyStyle);
  return applyStyle(shape);
}

// ── ヒアリング用チェックボタン ────────────────────────────
function CheckBtn({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="check-btn">
      <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

// ── メインコンポーネント ───────────────────────────────────
export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [hearing, setHearing] = useState<HearingState>(initialHearing);
  const [page, setPage] = useState<1 | 2>(1);
  const [selectedParts, setSelectedParts] = useState<Set<string>>(new Set());
  const [zipStatus, setZipStatus] = useState<{ msg: string; type: "ok" | "err" | "" }>({ msg: "", type: "" });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [bodyImages, setBodyImages] = useState<{ front: string; back: string }>({ front: "", back: "" });
  const composingKanaRef = useRef<string>("");

  function hiraganaToKatakana(s: string): string {
    return s.replace(/[ぁ-ゖ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60));
  }

  const KATAKANA_ALLOWED = /^[ァ-ヶー・　 ]+$/;

  const set = (key: keyof FormState, val: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setH = (key: keyof HearingState, val: string | string[]) =>
    setHearing((h) => ({ ...h, [key]: val }));

  const progress = (() => {
    let filled = 0;
    const total = 8;
    if (form.name.trim()) filled++;
    if (form.kana.trim()) filled++;
    if (form.birthday) filled++;
    if (form.gender) filled++;
    if (form.visit) filled++;
    if (selectedParts.size > 0) filled++;
    if (form.painLevel) filled++;
    if (form.consent) filled++;
    return Math.round((filled / total) * 100);
  })();

  const togglePart = useCallback((part: string) => {
    setSelectedParts((prev) => {
      const next = new Set(prev);
      if (next.has(part)) next.delete(part); else next.add(part);
      return next;
    });
  }, []);

  const removePart = (part: string) => {
    setSelectedParts((prev) => { const next = new Set(prev); next.delete(part); return next; });
  };

  async function lookupZip() {
    const raw = form.zip.replace(/[^0-9]/g, "");
    if (raw.length !== 7) { setZipStatus({ msg: "⚠️ 郵便番号は7桁で入力してください（ハイフン不要）", type: "err" }); return; }
    setZipStatus({ msg: "検索中...", type: "" });
    try {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${raw}`);
      const json = await res.json();
      if (json.results?.length > 0) {
        const r = json.results[0];
        set("address1", r.address1 + r.address2 + r.address3);
        set("zip", raw.slice(0, 3) + "-" + raw.slice(3));
        setZipStatus({ msg: "✅ 住所が自動入力されました。番地・建物名を続けて入力してください。", type: "ok" });
      } else {
        setZipStatus({ msg: "⚠️ 該当する住所が見つかりませんでした。手動で入力してください。", type: "err" });
      }
    } catch {
      setZipStatus({ msg: "⚠️ 通信エラーが発生しました。手動で入力してください。", type: "err" });
    }
  }

  async function svgToBase64(svgEl: SVGSVGElement | null): Promise<string> {
    if (!svgEl) return "";
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = svgEl.width.baseVal.value * 2;
        canvas.height = svgEl.height.baseVal.value * 2;
        const ctx = canvas.getContext("2d")!;
        ctx.scale(2, 2);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(""); };
      img.src = url;
    });
  }

  async function goToPage2() {
    const errors: string[] = [];
    if (!form.name.trim()) errors.push("お名前");
    const kanaConverted = hiraganaToKatakana(form.kana.trim());
    if (kanaConverted !== form.kana.trim()) {
      setForm((f) => ({ ...f, kana: kanaConverted }));
    }
    if (!kanaConverted) {
      errors.push("フリガナ");
    } else if (!KATAKANA_ALLOWED.test(kanaConverted)) {
      errors.push("フリガナはカタカナで入力してください（漢字・英数字は使えません）");
    }
    if (!form.birthday) errors.push("生年月日");
    if (!form.gender) errors.push("性別");
    if (!form.visit) errors.push("来院歴");
    if (selectedParts.size === 0) errors.push("痛い部位（体の図をタッチしてください）");
    if (!form.painLevel) errors.push("痛みの強さ");
    if (!form.consent) errors.push("個人情報への同意");
    if (errors.length > 0) {
      alert("以下の項目をご記入ください：\n・" + errors.join("\n・"));
      return;
    }
    const frontSvgEl = document.querySelector<SVGSVGElement>("#front-svg-wrap svg");
    const backSvgEl = document.querySelector<SVGSVGElement>("#back-svg-wrap svg");
    const front = await svgToBase64(frontSvgEl);
    const back = await svgToBase64(backSvgEl);
    setBodyImages({ front, back });
    setPage(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToPage1() {
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    setSending(true);
    setSubmitError(false);

    const frontImg = bodyImages.front;
    const backImg = bodyImages.back;

    const preferredTimeStr = [
      hearing.preferredTimeZone.includes("午前") ? `午前${hearing.preferredAMHour ? `（${hearing.preferredAMHour}時頃）` : ""}` : "",
      hearing.preferredTimeZone.includes("午後") ? `午後${hearing.preferredHour ? `（${hearing.preferredHour}時頃）` : ""}` : "",
    ].filter(Boolean).join("・");

    const referralStr = form.referral
      .map((r) => {
        if (r === "ご紹介" && form.referrerName.trim()) {
          return `ご紹介（${form.referrerName.trim()}）`;
        }
        if (r === "SNS" && form.snsChannels.length > 0) {
          const channels = form.snsChannels
            .map((c) => (c === "その他" && form.snsOther.trim() ? `その他：${form.snsOther.trim()}` : c))
            .join(", ");
          return `SNS（${channels}）`;
        }
        if (r === "その他" && form.referralOther.trim()) {
          return `その他（${form.referralOther.trim()}）`;
        }
        return r;
      })
      .join("・");

    const data = {
      name: form.name, kana: form.kana, birthday: form.birthday,
      gender: form.gender, tel: form.tel, zip: form.zip,
      address1: form.address1, address2: form.address2, job: form.job,
      visit: form.visit, referral: referralStr,
      painParts: [...selectedParts].join("・"),
      painLevel: form.painLevel, duration: form.duration,
      painType: form.painTypes.join("・"), cause: form.cause,
      symptomDetail: form.symptomDetail, otherHospital: form.otherHospital,
      medicine: form.medicine, medicineDetail: form.medicineDetail,
      surgery: form.surgery, surgeryDetail: form.surgeryDetail,
      allergy: form.allergy, allergyDetail: form.allergyDetail,
      sleep: form.sleep, exercise: form.exercise, desk: form.desk,
      pregnant: form.pregnant, other: form.other,
      frontImg, backImg,
      // ヒアリングシート
      troubleTime: [...hearing.troubleTime, hearing.troubleTimeOther ? `その他：${hearing.troubleTimeOther}` : ""].filter(Boolean).join("・"),
      bodyScore: hearing.bodyScore,
      worsenWork: hearing.worsenWork.join("・"),
      worsenFamily: hearing.worsenFamily.join("・"),
      worsenPrivate: hearing.worsenPrivate.join("・"),
      worsenOther: hearing.worsenOther,
      symptomCause: hearing.symptomCause.join("・"),
      currentMaintain: [...hearing.currentMaintain, hearing.currentMaintainSportsOther ? `運動その他：${hearing.currentMaintainSportsOther}` : ""].filter(Boolean).join("・"),
      pastMaintain: [...hearing.pastMaintain, hearing.pastMaintainSportsOther ? `運動その他：${hearing.pastMaintainSportsOther}` : ""].filter(Boolean).join("・"),
      healthInvestment: hearing.healthInvestment,
      idealBody: [
        hearing.idealBodyTreatment ? `治療ゾーン：${hearing.idealBodyTreatment}` : "",
        hearing.idealBodyRoot ? `根本改善ゾーン：${hearing.idealBodyRoot}` : "",
        hearing.idealBodyMaintenance ? `メンテナンスゾーン：${hearing.idealBodyMaintenance}` : "",
      ].filter(Boolean).join("・"),
      healthConsciousness: hearing.healthConsciousness,
      improvementPeriod: hearing.improvementPeriod,
      monthlyBudget: hearing.monthlyBudget,
      visitFrequency: hearing.visitFrequency,
      preferredTime: preferredTimeStr,
    };

    try {
      await fetch(SCRIPT_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const today = new Date().toISOString().split("T")[0];
      await supabase.from("patients").insert({
        id: `p-${Date.now()}`,
        name: form.name, kana: form.kana, birthday: form.birthday,
        gender: form.gender, tel: form.tel,
        address: `${form.address1}${form.address2}`,
        job: form.job,
        initial_pain_parts: [...selectedParts].join("・"),
        initial_pain_level: form.painLevel,
        cause: form.cause, duration: form.duration,
        referral: referralStr,
        registered_at: today, initial_staff: "",
      });

      setSending(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSending(false);
      setSubmitError(true);
    }
  }

  // ── 維持行動セクション共通 ─────────────────────────────────
  function MaintainSection({ prefix, values, sportsOther, onToggle, onSportsOther }: {
    prefix: string; values: string[]; sportsOther: string;
    onToggle: (v: string) => void; onSportsOther: (v: string) => void;
  }) {
    const groups = [
      { label: "運動", items: ["ランニング", "ウォーキング", "野球", "サッカー", "テニス"] },
      { label: "筋肉", items: ["自宅で筋トレ", "ジム通い", "パーソナルジム"] },
      { label: "柔軟", items: ["ストレッチ", "健康体操", "ヨガ", "ピラティス"] },
      { label: "栄養", items: ["健康な食事バランス", "サプリメント", "プロテイン", "腸内環境を整える", "水を毎日2L以上飲む"] },
      { label: "休息", items: ["お風呂にしっかり浸かる", "睡眠を多く取る"] },
    ];
    return (
      <div>
        {groups.map(({ label, items }) => (
          <div key={label} className="maintain-group">
            <div className="maintain-group-label">{label}</div>
            <div className="check-group">
              {items.map((item) => (
                <CheckBtn key={item} id={`${prefix}-${item}`} label={item} checked={values.includes(item)} onChange={() => onToggle(item)} />
              ))}
              {label === "運動" && (
                <div className="other-inline">
                  <span className="other-inline-label">その他</span>
                  <input
                    type="text" placeholder="種目を入力"
                    value={sportsOther}
                    onChange={(e) => onSportsOther(e.target.value)}
                    style={{ width: "120px", padding: "6px 10px", fontSize: "14px", border: "1.5px solid var(--border)", borderRadius: "9px" }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {sending && (
        <div className="sending-overlay show">
          <div className="sending-box">
            <div className="spinner" />
            <p>送信中です...<br />しばらくお待ちください</p>
          </div>
        </div>
      )}

      <header>
        <div className="header-logo">🌿 NAGINAINE SEIKOTSUIN</div>
        <h1>なぎナイン整骨院</h1>
        <p className="subtitle">{page === 1 ? "問診票 / Medical Questionnaire" : "ヒアリングシート / Hearing Sheet"}</p>
        <div className="leaf-deco">🌿</div>
      </header>

      {/* ページインジケーター */}
      {!submitted && (
        <div className="progress-bar">
          <div className="page-indicator">
            <div className={`page-step ${page === 1 ? "active" : "done"}`}>
              <span className="step-num">{page === 1 ? "1" : "✓"}</span>
              <span className="step-label">問診票</span>
            </div>
            <div className="step-line" />
            <div className={`page-step ${page === 2 ? "active" : ""}`}>
              <span className="step-num">2</span>
              <span className="step-label">ヒアリング</span>
            </div>
          </div>
          {page === 1 && (
            <>
              <div className="progress-labels" style={{ marginTop: "8px" }}>
                <span>📋 記入進捗</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </>
          )}
        </div>
      )}

      <div className="container">
        {submitted ? (
          <div className="success-screen">
            <div className="check-icon">✓</div>
            <h2>ご記入ありがとうございます</h2>
            <p>
              問診票の送信が完了しました。<br />
              受付までお声がけください。<br /><br />
              お体の回復のため、<br />精一杯サポートいたします。
            </p>
            <p className="clinic-name">🌿 なぎナイン整骨院</p>
          </div>
        ) : page === 1 ? (
          <>
            {/* 1 基本情報 */}
            <div className="section">
              <div className="section-header">👤 基本情報</div>
              <div className="section-body">
                <div className="field">
                  <label>お名前<span className="required">必須</span></label>
                  <input
                    type="text"
                    placeholder="例：山田 太郎"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    onCompositionStart={() => { composingKanaRef.current = ""; }}
                    onCompositionUpdate={(e) => {
                      const d = e.data || "";
                      if (!/[一-鿿]/.test(d)) {
                        composingKanaRef.current = d;
                      }
                    }}
                    onCompositionEnd={() => {
                      const kana = hiraganaToKatakana(composingKanaRef.current);
                      composingKanaRef.current = "";
                      if (kana) {
                        setForm((prev) => ({ ...prev, kana: prev.kana + kana }));
                      }
                    }}
                  />
                </div>
                <div className="row">
                  <div className="field">
                    <label>フリガナ<span className="required">必須</span></label>
                    <input type="text" placeholder="ヤマダ タロウ" value={form.kana} onChange={(e) => set("kana", e.target.value)} onBlur={(e) => set("kana", hiraganaToKatakana(e.target.value))} />
                  </div>
                  <div className="field">
                    <label>生年月日<span className="required">必須</span></label>
                    <input type="date" value={form.birthday} onChange={(e) => set("birthday", e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label>性別<span className="required">必須</span></label>
                  <div className="radio-group">
                    {["男性", "女性", "その他"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="gender" id={`g-${v}`} value={v} checked={form.gender === v} onChange={() => set("gender", v)} />
                        <label htmlFor={`g-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="row">
                  <div className="field">
                    <label>電話番号<span className="required">必須</span></label>
                    <input type="tel" placeholder="090-0000-0000" value={form.tel} onChange={(e) => set("tel", e.target.value)} />
                  </div>
                  <div className="field">
                    <label>職業</label>
                    <select value={form.job} onChange={(e) => set("job", e.target.value)}>
                      <option value="">選択</option>
                      {["会社員","自営業","主婦・主夫","学生","パート・アルバイト","無職","その他"].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>郵便番号<span style={{ fontSize: "12px", color: "var(--accent)", marginLeft: "8px", fontWeight: "normal" }}>ハイフン不要</span></label>
                  <div className="zip-row">
                    <input
                      type="tel" placeholder="例：1234567" maxLength={8} inputMode="numeric"
                      value={form.zip}
                      onChange={(e) => {
                        set("zip", e.target.value);
                        if (e.target.value.replace(/[^0-9]/g, "").length === 7) setTimeout(lookupZip, 0);
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); lookupZip(); } }}
                    />
                    <button className="zip-btn" type="button" onClick={lookupZip}>📍 住所を検索</button>
                  </div>
                  {zipStatus.msg && <div className={`zip-status ${zipStatus.type}`}>{zipStatus.msg}</div>}
                </div>
                <div className="field">
                  <label>都道府県・市区町村</label>
                  <input type="text" placeholder="例：大阪府大阪市北区" value={form.address1} onChange={(e) => set("address1", e.target.value)} />
                </div>
                <div className="field">
                  <label>番地・建物名</label>
                  <input type="text" placeholder="例：梅田1-2-3 ○○マンション101" value={form.address2} onChange={(e) => set("address2", e.target.value)} />
                </div>
              </div>
            </div>

            {/* 2 来院 */}
            <div className="section">
              <div className="section-header">🚪 来院のきっかけ</div>
              <div className="section-body">
                <div className="field">
                  <label>初めてのご来院ですか？<span className="required">必須</span></label>
                  <div className="radio-group">
                    {[{ v: "初診", l: "初めて" }, { v: "再診", l: "以前来たことがある" }].map(({ v, l }) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="visit" id={`v-${v}`} value={v} checked={form.visit === v} onChange={() => set("visit", v)} />
                        <label htmlFor={`v-${v}`}>{l}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>何でお知りになりましたか？</label>
                  <div className="check-group">
                    {["ご紹介","ネット検索","SNS","チラシ","看板","その他"].map((v) => (
                      <div className="check-btn" key={v}>
                        <input type="checkbox" id={`r-${v}`} value={v} checked={form.referral.includes(v)} onChange={() => set("referral", toggleArr(form.referral, v))} />
                        <label htmlFor={`r-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                  {form.referral.includes("ご紹介") && (
                    <div style={{ marginTop: "10px" }}>
                      <label style={{ fontSize: "13px", color: "var(--accent)", display: "block", marginBottom: "4px" }}>紹介者のお名前（カタカナ）</label>
                      <input type="text" placeholder="ヤマダ タロウ" value={form.referrerName} onChange={(e) => set("referrerName", e.target.value)} />
                    </div>
                  )}
                  {form.referral.includes("SNS") && (
                    <div style={{ marginTop: "10px" }}>
                      <label style={{ fontSize: "13px", color: "var(--accent)", display: "block", marginBottom: "4px" }}>どのSNSですか？（複数選択可）</label>
                      <div className="check-group">
                        {["Instagram","TikTok","YouTube","X(旧Twitter)","Facebook","その他"].map((v) => (
                          <div className="check-btn" key={v}>
                            <input type="checkbox" id={`sns-${v}`} value={v} checked={form.snsChannels.includes(v)} onChange={() => set("snsChannels", toggleArr(form.snsChannels, v))} />
                            <label htmlFor={`sns-${v}`}>{v}</label>
                          </div>
                        ))}
                      </div>
                      {form.snsChannels.includes("その他") && (
                        <input type="text" placeholder="その他のSNS名（例：Threads、LINE VOOM）" value={form.snsOther} onChange={(e) => set("snsOther", e.target.value)} style={{ marginTop: "6px" }} />
                      )}
                    </div>
                  )}
                  {form.referral.includes("その他") && (
                    <div style={{ marginTop: "10px" }}>
                      <label style={{ fontSize: "13px", color: "var(--accent)", display: "block", marginBottom: "4px" }}>きっかけを具体的に</label>
                      <input type="text" placeholder="例：友人のブログ、テレビ番組など" value={form.referralOther} onChange={(e) => set("referralOther", e.target.value)} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3 症状 */}
            <div className="section">
              <div className="section-header">🩺 症状・お体の状態</div>
              <div className="section-body">
                <div className="field">
                  <label>痛い・辛い部位をタッチしてください<span className="required">必須</span></label>
                  <div className="sub-label">前面・背面の体の図を直接タップ。複数選択できます。</div>
                  <div className="body-map-hint">🌿 体の図の部位をタップ → 赤くなったら選択済み</div>
                  <div className="body-views">
                    <div className="body-view-col">
                      <div className="body-view-label">前　面</div>
                      <div className="body-view-wrap">
                        <span className="lr-label">右</span>
                        <div id="front-svg-wrap"><FrontSVG selected={selectedParts} onToggle={togglePart} /></div>
                        <span className="lr-label">左</span>
                      </div>
                    </div>
                    <div className="body-view-col">
                      <div className="body-view-label">背　面</div>
                      <div className="body-view-wrap">
                        <span className="lr-label">左</span>
                        <div id="back-svg-wrap"><BackSVG selected={selectedParts} onToggle={togglePart} /></div>
                        <span className="lr-label">右</span>
                      </div>
                    </div>
                  </div>
                  <div className="selected-parts-display">
                    {selectedParts.size === 0 ? (
                      <div className="empty-hint">タッチした部位がここに表示されます</div>
                    ) : (
                      <div className="selected-tags">
                        {[...selectedParts].map((part) => (
                          <span className="part-tag" key={part}>
                            {part}<span className="rm" onClick={() => removePart(part)}>×</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <hr className="divider" />
                <div className="field">
                  <label>痛みの強さ（1〜10）<span className="required">必須</span></label>
                  <div className="sub-label">1＝ほとんど気にならない　10＝我慢できないほど</div>
                  <div className="pain-scale">
                    {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                      <div className="pain-scale-item" key={n}>
                        <input type="radio" name="pain" id={`p${n}`} value={String(n)} checked={form.painLevel === String(n)} onChange={() => set("painLevel", String(n))} />
                        <label htmlFor={`p${n}`}>{n}</label>
                      </div>
                    ))}
                  </div>
                  <div className="pain-scale-labels"><span>軽度</span><span>中程度</span><span>重度</span></div>
                </div>

                <hr className="divider" />
                <div className="field">
                  <label>いつから症状がありますか？</label>
                  <div className="radio-group">
                    {["今日","数日前","1〜2週間","1ヶ月以上","半年以上"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="dur" id={`d-${v}`} value={v} checked={form.duration === v} onChange={() => set("duration", v)} />
                        <label htmlFor={`d-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="divider" />
                <div className="field">
                  <label>痛みの特徴（複数選択可）</label>
                  <div className="check-group">
                    {["ズキズキ","しびれ","重い・だるい","突っ張り","動くと痛い","安静時も痛い","朝が特に辛い","夜が特に辛い"].map((v) => (
                      <div className="check-btn" key={v}>
                        <input type="checkbox" id={`s-${v}`} checked={form.painTypes.includes(v)} onChange={() => set("painTypes", toggleArr(form.painTypes, v))} />
                        <label htmlFor={`s-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="divider" />
                <div className="field">
                  <label>原因・きっかけ</label>
                  <div className="radio-group col">
                    {[
                      { v: "交通事故", icon: "🚗" },
                      { v: "仕事中のケガ（労災）", icon: "💼" },
                      { v: "スポーツ中のケガ", icon: "⚽" },
                      { v: "日常生活でのケガ", icon: "🏠" },
                      { v: "心当たりがない・慢性的", icon: "❓" },
                    ].map(({ v, icon }) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="cause" id={`c-${v}`} value={v} checked={form.cause === v} onChange={() => set("cause", v)} />
                        <label htmlFor={`c-${v}`}>{icon} {v}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>症状の詳細（自由記入）</label>
                  <textarea placeholder="どのような動きで痛むか、など詳しくお書きください" value={form.symptomDetail} onChange={(e) => set("symptomDetail", e.target.value)} />
                </div>
              </div>
            </div>

            {/* 4 既往歴 */}
            <div className="section">
              <div className="section-header">📋 現在の治療・既往歴</div>
              <div className="section-body">
                <div className="field">
                  <label>現在、他の病院・接骨院に通っていますか？</label>
                  <div className="radio-group">
                    {["はい","いいえ"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="other_h" id={`oh-${v}`} value={v} checked={form.otherHospital === v} onChange={() => set("otherHospital", v)} />
                        <label htmlFor={`oh-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>服薬中のお薬はありますか？</label>
                  <div className="radio-group">
                    {["はい","いいえ"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="med" id={`med-${v}`} value={v} checked={form.medicine === v} onChange={() => set("medicine", v)} />
                        <label htmlFor={`med-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {form.medicine === "はい" && (
                  <div className="field">
                    <label>お薬の名前</label>
                    <input type="text" placeholder="薬の名前をご記入ください" value={form.medicineDetail} onChange={(e) => set("medicineDetail", e.target.value)} />
                  </div>
                )}
                <div className="field">
                  <label>過去に大きなケガや手術はありましたか？</label>
                  <div className="radio-group">
                    {["はい","いいえ"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="surg" id={`su-${v}`} value={v} checked={form.surgery === v} onChange={() => set("surgery", v)} />
                        <label htmlFor={`su-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {form.surgery === "はい" && (
                  <div className="field">
                    <label>手術・ケガの内容</label>
                    <input type="text" placeholder="例：腰椎椎間板ヘルニアの手術" value={form.surgeryDetail} onChange={(e) => set("surgeryDetail", e.target.value)} />
                  </div>
                )}
                <div className="field">
                  <label>アレルギーはありますか？</label>
                  <div className="radio-group">
                    {["はい","いいえ"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="alg" id={`al-${v}`} value={v} checked={form.allergy === v} onChange={() => set("allergy", v)} />
                        <label htmlFor={`al-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {form.allergy === "はい" && (
                  <div className="field">
                    <label>アレルギーの内容</label>
                    <input type="text" placeholder="例：金属アレルギー、花粉症など" value={form.allergyDetail} onChange={(e) => set("allergyDetail", e.target.value)} />
                  </div>
                )}
              </div>
            </div>

            {/* 5 生活習慣 */}
            <div className="section">
              <div className="section-header">🌿 生活習慣</div>
              <div className="section-body">
                <div className="field">
                  <label>睡眠時間（1日平均）</label>
                  <div className="radio-group">
                    {["5時間未満","5〜7時間","7〜9時間","9時間以上"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="sleep" id={`sl-${v}`} value={v} checked={form.sleep === v} onChange={() => set("sleep", v)} />
                        <label htmlFor={`sl-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>運動習慣</label>
                  <div className="radio-group">
                    {["ほとんどしない","週1〜2回","週3回以上"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="ex" id={`ex-${v}`} value={v} checked={form.exercise === v} onChange={() => set("exercise", v)} />
                        <label htmlFor={`ex-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>デスクワーク・スマホ使用時間</label>
                  <div className="radio-group">
                    {["2時間未満","2〜5時間","5時間以上"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="desk" id={`de-${v}`} value={v} checked={form.desk === v} onChange={() => set("desk", v)} />
                        <label htmlFor={`de-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>女性の方：妊娠中または可能性がありますか？</label>
                  <div className="radio-group">
                    {["はい","いいえ","非該当"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="preg" id={`pr-${v}`} value={v} checked={form.pregnant === v} onChange={() => set("pregnant", v)} />
                        <label htmlFor={`pr-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 6 同意 */}
            <div className="section">
              <div className="section-header">✅ 個人情報の取り扱いと同意</div>
              <div className="section-body">
                <div className="consent-box">
                  ご記入いただいた個人情報は、なぎナイン整骨院における施術・医療サービスの提供のみに使用いたします。第三者への提供は法令に基づく場合を除き行いません。
                </div>
                <label className="consent-check">
                  <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} />
                  <span>上記の内容を理解し、個人情報の取り扱いに同意します</span>
                </label>
              </div>
            </div>

            <div className="field">
              <label>その他のご要望・ご質問</label>
              <textarea placeholder="施術に関する不安点やご希望があればご記入ください" value={form.other} onChange={(e) => set("other", e.target.value)} />
            </div>

            <button className="submit-btn" onClick={goToPage2}>
              次へ　→
            </button>
            <div className="form-footer">
              なぎナイン整骨院 / ご不明な点は受付スタッフまでお気軽にお声がけください
            </div>
          </>
        ) : (
          <>
            {/* ── ページ2 ヒアリングシート ── */}
            <button className="back-btn" type="button" onClick={goToPage1}>
              ← 問診票に戻る
            </button>

            {/* Q1 困っている時間帯 */}
            <div className="section">
              <div className="section-header">🕐 今回の症状でどのような時に困っていますか？</div>
              <div className="section-body">
                <div className="field">
                  <div className="check-group">
                    {["起床時","仕事の前半","仕事の後半","仕事後","睡眠時","趣味","子育て","家事","介護"].map((v) => (
                      <CheckBtn key={v} id={`tt-${v}`} label={v} checked={hearing.troubleTime.includes(v)} onChange={() => setH("troubleTime", toggleArr(hearing.troubleTime, v))} />
                    ))}
                  </div>
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: "var(--accent)", whiteSpace: "nowrap" }}>その他</span>
                    <input type="text" placeholder="自由記入" value={hearing.troubleTimeOther} onChange={(e) => setH("troubleTimeOther", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Q2 体の満足度 */}
            <div className="section">
              <div className="section-header">💯 現在のあなたの体の満足度を教えてください</div>
              <div className="section-body">
                <div className="field">
                  <div className="radio-group" style={{ flexWrap: "wrap" }}>
                    {["10%","20%","30%","40%","50%","60%","70%","80%","90%","100%"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="bodyScore" id={`bs-${v}`} value={v} checked={hearing.bodyScore === v} onChange={() => setH("bodyScore", v)} />
                        <label htmlFor={`bs-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Q3 悪化した時 */}
            <div className="section">
              <div className="section-header">⚠️ 今の状態が悪化したらどんなことが困りますか？</div>
              <div className="section-body">
                <div className="field">
                  <label>仕事</label>
                  <div className="check-group">
                    {["仕事での作業に支障が出る","周りに迷惑がかかる","仕事ができなくなる"].map((v) => (
                      <CheckBtn key={v} id={`ww-${v}`} label={v} checked={hearing.worsenWork.includes(v)} onChange={() => setH("worsenWork", toggleArr(hearing.worsenWork, v))} />
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>家事育児</label>
                  <div className="check-group">
                    {["イライラが増える","家事・育児に差し支える","家族、子どもに迷惑がかかる"].map((v) => (
                      <CheckBtn key={v} id={`wf-${v}`} label={v} checked={hearing.worsenFamily.includes(v)} onChange={() => setH("worsenFamily", toggleArr(hearing.worsenFamily, v))} />
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>プライベート</label>
                  <div className="check-group">
                    {["ストレスが溜まる","趣味が楽しめなくなる","日常生活が困難になる"].map((v) => (
                      <CheckBtn key={v} id={`wp-${v}`} label={v} checked={hearing.worsenPrivate.includes(v)} onChange={() => setH("worsenPrivate", toggleArr(hearing.worsenPrivate, v))} />
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>その他</label>
                  <input type="text" placeholder="自由記入" value={hearing.worsenOther} onChange={(e) => setH("worsenOther", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Q4 症状の原因 */}
            <div className="section">
              <div className="section-header">🔍 今回の症状の原因として、ご自身で考えられる原因は何だと思いますか？</div>
              <div className="section-body">
                <div className="field">
                  <div className="check-group">
                    {[
                      "日常生活での姿勢が悪い","運動不足","筋力低下・不足","体が硬い","血流が悪い","睡眠不足",
                      "甘い物をよく食べる","糖質が多い","脂っこいものをよく食べる","お酒を週3以上飲む","水分不足",
                      "健康予防意識の低さ","自律神経の乱れ","環境の変化","人間関係","体重の増減",
                    ].map((v) => (
                      <CheckBtn key={v} id={`sc-${v}`} label={v} checked={hearing.symptomCause.includes(v)} onChange={() => setH("symptomCause", toggleArr(hearing.symptomCause, v))} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Q5 現在継続中の行動 */}
            <div className="section">
              <div className="section-header">✅ 今も継続している体を維持するための行動を教えてください（複数回答可）</div>
              <div className="section-body">
                <MaintainSection
                  prefix="cur"
                  values={hearing.currentMaintain}
                  sportsOther={hearing.currentMaintainSportsOther}
                  onToggle={(v) => setH("currentMaintain", toggleArr(hearing.currentMaintain, v))}
                  onSportsOther={(v) => setH("currentMaintainSportsOther", v)}
                />
              </div>
            </div>

            {/* Q6 過去3年の行動 */}
            <div className="section">
              <div className="section-header">📅 過去3年以内に行っていた体を維持するための行動を教えてください（現在は行っていない・複数回答可）</div>
              <div className="section-body">
                <MaintainSection
                  prefix="past"
                  values={hearing.pastMaintain}
                  sportsOther={hearing.pastMaintainSportsOther}
                  onToggle={(v) => setH("pastMaintain", toggleArr(hearing.pastMaintain, v))}
                  onSportsOther={(v) => setH("pastMaintainSportsOther", v)}
                />
              </div>
            </div>

            {/* Q7 現在の健康投資 */}
            <div className="section">
              <div className="section-header">💰 現在、自分の健康や体調管理に対してどれくらい投資されていますか？</div>
              <div className="section-body">
                <div className="field">
                  <div className="radio-group" style={{ flexWrap: "wrap" }}>
                    {["0円","1,000円〜","3,000円〜","5,000円〜","8,000円〜","10,000円〜","15,000円〜","20,000円〜"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="healthInv" id={`hi-${v}`} value={v} checked={hearing.healthInvestment === v} onChange={() => setH("healthInvestment", v)} />
                        <label htmlFor={`hi-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Q8 理想のカラダ */}
            <div className="section">
              <div className="section-header">🌟 あなたがこれから目指したい理想のカラダの状態はどれですか？（各ゾーンから1つずつ選択）</div>
              <div className="section-body">
                <div className="field">
                  <div className="ideal-body-group">
                    <div className="ideal-zone-label" style={{ background: "var(--primary-pale)", color: "var(--primary-dark)" }}>治療ゾーン</div>
                    <div className="radio-group" style={{ marginBottom: "16px" }}>
                      {["動かせない","動けるが痛い","痛みが少ない"].map((v) => (
                        <div className="radio-btn" key={v}>
                          <input type="radio" name="idealBodyTreatment" id={`ibt-${v}`} value={v} checked={hearing.idealBodyTreatment === v} onChange={() => setH("idealBodyTreatment", v)} />
                          <label htmlFor={`ibt-${v}`}>{v}</label>
                        </div>
                      ))}
                    </div>
                    <div className="ideal-zone-label" style={{ background: "#e8f5ee", color: "#2d6a4f" }}>根本改善ゾーン</div>
                    <div className="radio-group" style={{ marginBottom: "16px" }}>
                      {["違和感がある","日常に差し支えがない","なんとなく体が軽い"].map((v) => (
                        <div className="radio-btn" key={v}>
                          <input type="radio" name="idealBodyRoot" id={`ibr-${v}`} value={v} checked={hearing.idealBodyRoot === v} onChange={() => setH("idealBodyRoot", v)} />
                          <label htmlFor={`ibr-${v}`}>{v}</label>
                        </div>
                      ))}
                    </div>
                    <div className="ideal-zone-label" style={{ background: "#d4edda", color: "#155724" }}>メンテナンスゾーン</div>
                    <div className="radio-group">
                      {["軽い","楽に動ける","絶好調"].map((v) => (
                        <div className="radio-btn" key={v}>
                          <input type="radio" name="idealBodyMaintenance" id={`ibm-${v}`} value={v} checked={hearing.idealBodyMaintenance === v} onChange={() => setH("idealBodyMaintenance", v)} />
                          <label htmlFor={`ibm-${v}`}>{v}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Q9 健康意識 */}
            <div className="section">
              <div className="section-header">💡 健康予防に対する意識はどの程度ですか？</div>
              <div className="section-body">
                <div className="field">
                  <div className="radio-group col">
                    {["全く意識していない","そんなに意識していない","大事だということは理解している","かなり意識している","意識して行動している"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="hc" id={`hc-${v}`} value={v} checked={hearing.healthConsciousness === v} onChange={() => setH("healthConsciousness", v)} />
                        <label htmlFor={`hc-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Q10 改善希望期間 */}
            <div className="section">
              <div className="section-header">📆 どのくらいの期間で改善をご希望ですか？</div>
              <div className="section-body">
                <div className="field">
                  <div className="radio-group" style={{ flexWrap: "wrap" }}>
                    {["1か月","2か月","3か月","6ヶ月","1年以内","1年以上","2年以上"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="ip" id={`ip-${v}`} value={v} checked={hearing.improvementPeriod === v} onChange={() => setH("improvementPeriod", v)} />
                        <label htmlFor={`ip-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Q11 月額投資 */}
            <div className="section">
              <div className="section-header">💴 理想な身体を維持するために１ヶ月どれくらい投資できそうですか？</div>
              <div className="section-body">
                <div className="field">
                  <div className="radio-group" style={{ flexWrap: "wrap" }}>
                    {["0円","1,000円〜","3,000円〜","5,000円〜","8,000円〜","10,000円〜","15,000円〜","20,000円〜"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="mb" id={`mb-${v}`} value={v} checked={hearing.monthlyBudget === v} onChange={() => setH("monthlyBudget", v)} />
                        <label htmlFor={`mb-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Q12 通院頻度・時間帯 */}
            <div className="section">
              <div className="section-header">🏥 通院する場合には、お時間はどれくらい作れそうですか？</div>
              <div className="section-body">
                <div className="field">
                  <label>通院頻度</label>
                  <div className="radio-group" style={{ flexWrap: "wrap" }}>
                    {["毎日","週2以上","週1回","月3回","月2回","月1回","必要なら作ります"].map((v) => (
                      <div className="radio-btn" key={v}>
                        <input type="radio" name="vf" id={`vf-${v}`} value={v} checked={hearing.visitFrequency === v} onChange={() => setH("visitFrequency", v)} />
                        <label htmlFor={`vf-${v}`}>{v}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>通いやすい時間帯</label>
                  <div className="check-group" style={{ marginBottom: "10px" }}>
                    {["午前","午後"].map((v) => (
                      <CheckBtn key={v} id={`tz-${v}`} label={v} checked={hearing.preferredTimeZone.includes(v)} onChange={() => setH("preferredTimeZone", toggleArr(hearing.preferredTimeZone, v))} />
                    ))}
                  </div>
                  {hearing.preferredTimeZone.includes("午前") && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                      <span style={{ fontSize: "13px", color: "var(--accent)", minWidth: "28px" }}>午前</span>
                      <input
                        type="tel" inputMode="numeric" placeholder="例：10"
                        value={hearing.preferredAMHour}
                        onChange={(e) => setH("preferredAMHour", e.target.value)}
                        style={{ width: "80px", padding: "8px 10px", fontSize: "14px", border: "1.5px solid var(--border)", borderRadius: "9px" }}
                      />
                      <span style={{ fontSize: "13px", color: "var(--muted)" }}>時頃</span>
                    </div>
                  )}
                  {hearing.preferredTimeZone.includes("午後") && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                      <span style={{ fontSize: "13px", color: "var(--accent)", minWidth: "28px" }}>午後</span>
                      <input
                        type="tel" inputMode="numeric" placeholder="例：14"
                        value={hearing.preferredHour}
                        onChange={(e) => setH("preferredHour", e.target.value)}
                        style={{ width: "80px", padding: "8px 10px", fontSize: "14px", border: "1.5px solid var(--border)", borderRadius: "9px" }}
                      />
                      <span style={{ fontSize: "13px", color: "var(--muted)" }}>時頃</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {submitError && (
              <div className="error-box">
                ⚠️ 送信に失敗しました。通信環境を確認して再度お試しください。<br />
                問題が続く場合はスタッフにお声がけください。
              </div>
            )}

            <button className="submit-btn" onClick={handleSubmit} disabled={sending}>
              🌿 送信する →
            </button>
            <div className="form-footer">
              なぎナイン整骨院 / ご不明な点は受付スタッフまでお気軽にお声がけください
            </div>
          </>
        )}
      </div>
    </>
  );
}
