export function TipBanner({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-[#ebbf0b] bg-[#fffbea] px-4 py-3 text-[14px] text-[#6b5900] shadow-sm">
      {text}
    </div>
  )
}
