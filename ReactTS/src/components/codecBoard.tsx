export default function CodecBoard() {
  return (
    <div className="flex items-center justify-between gap-4 w-full h-64 bg-slate-100 p-4">
      <div className="w-24 h-24 bg-blue-300 flex items-center justify-center rounded-full">
        [AVATAR L]
      </div>

      <div className="flex-1 h-full bg-white border-2 border-slate-300 rounded p-4 shadow-sm relative">
        <p className="text-slate-600 italic">
          Typewriter text will appear here...
        </p>
        
        <div className="absolute bottom-2 right-4 text-xs text-slate-400">
          Waiting for input...
        </div>
      </div>

      <div className="w-24 h-24 bg-red-300 flex items-center justify-center rounded-full">
        [AVATAR R]
      </div>

    </div>
  );
}