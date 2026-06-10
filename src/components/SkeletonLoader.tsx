export function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xs flex flex-col h-full animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="h-56 bg-slate-200" />
      
      {/* Content placeholders */}
      <div className="p-6 flex-grow space-y-4">
        {/* Title placeholder */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded-sm w-3/4" />
          <div className="h-4 bg-slate-200 rounded-sm w-1/2" />
        </div>
        
        {/* Meta details placeholders */}
        <div className="space-y-2 pt-2">
          <div className="h-3.5 bg-slate-200 rounded-sm w-5/6" />
          <div className="h-3.5 bg-slate-200 rounded-sm w-2/3" />
        </div>

        {/* Bar placeholder */}
        <div className="h-1.5 bg-slate-200 rounded-full w-full" />
        
        {/* Button placeholder */}
        <div className="h-10 bg-slate-200 rounded-xl w-full pt-4 border-t border-slate-50" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      <td className="px-6 py-4.5">
        <div className="h-4 bg-slate-200 rounded-sm w-16" />
      </td>
      <td className="px-6 py-4.5">
        <div className="h-4 bg-slate-200 rounded-sm w-20" />
      </td>
      <td className="px-6 py-4.5">
        <div className="h-4 bg-slate-200 rounded-sm w-48" />
      </td>
      <td className="px-6 py-4.5">
        <div className="h-4 bg-slate-200 rounded-sm w-28" />
      </td>
      <td className="px-6 py-4.5 text-right">
        <div className="h-4 bg-slate-200 rounded-sm w-16 ml-auto" />
      </td>
      <td className="px-6 py-4.5 text-center">
        <div className="h-4 bg-slate-200 rounded-sm w-10 mx-auto" />
      </td>
      <td className="px-6 py-4.5 text-center">
        <div className="h-8 bg-slate-200 rounded-lg w-20 mx-auto" />
      </td>
    </tr>
  );
}

export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="overflow-x-auto bg-white rounded-3xl border border-slate-100 shadow-sm">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 font-prompt">ประเทศ</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 font-prompt">CODE</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 font-prompt">ชื่อโปรแกรมทัวร์</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 font-prompt">ช่วงเวลาเดินทาง</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 font-prompt">ราคาเริ่มต้น</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 font-prompt">ที่นั่งว่าง</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 font-prompt">รายละเอียด</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {Array.from({ length: count }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
