// src/app/components/ContentSpinner.tsx
export default function ContentSpinner() {
  return (
    <div className="w-full h-[750px] flex items-center justify-center">
      <div className="animate-spin h-10 w-10 rounded-full border-t-4 border-cyan-500 border-opacity-60" />
    </div>
  );
}
