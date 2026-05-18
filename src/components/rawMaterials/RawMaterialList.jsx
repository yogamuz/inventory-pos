// src/components/rawMaterials/RawMaterialList.jsx
import {
  FlaskConical,
  Edit3,
  TrendingDown,
  PackagePlus,
  Trash2,
  Pencil,
} from "lucide-react";

function RawMaterialList({
  rawMaterials,
  onAdjust,
  onRestock,
  onUsage,
  loading,
  onEdit,
  onDelete,
}) {
  if (!rawMaterials || rawMaterials.length === 0) {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <FlaskConical className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Tidak ada bahan mentah
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Tidak ada data bahan mentah untuk ditampilkan.
        </p>
      </div>
    );
  }

  const getStockBadge = (stock, threshold) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
          Habis
        </span>
      );
    }
    if (stock < threshold) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
          Menipis
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
        Aman
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      {loading && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-700 border-t-transparent"></div>
            <span>Memuat data...</span>
          </div>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
              No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bahan Mentah
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Satuan
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stok
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Min. Stok
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rawMaterials.map((rm, index) => (
            <tr key={rm.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-4 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">{index + 1}</div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-10 w-10">
                    {rm.imageUrl ? (
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={rm.imageUrl}
                        alt={rm.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FlaskConical className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {rm.name}
                    </div>
                    {rm.notes && (
                      <div className="text-xs text-gray-400 truncate max-w-[160px]">
                        {rm.notes}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {rm.unit}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span
                  className={`text-sm font-semibold ${
                    rm.stock === 0
                      ? "text-red-600"
                      : rm.stock < rm.lowStockThreshold
                        ? "text-yellow-600"
                        : "text-gray-900"
                  }`}
                >
                  {rm.stock}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm text-gray-500">
                  {rm.lowStockThreshold}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-center">
                {getStockBadge(rm.stock, rm.lowStockThreshold)}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => onRestock(rm)}
                    title="Restock"
                    className="text-green-600 hover:text-green-900 inline-flex items-center px-2 py-1 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <PackagePlus className="h-4 w-4 mr-1" />
                    Restock
                  </button>
                  {/* <button
                    onClick={() => onUsage(rm)}
                    title="Catat Pemakaian"
                    className="text-orange-600 hover:text-orange-900 inline-flex items-center px-2 py-1 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <TrendingDown className="h-4 w-4 mr-1" />
                    Pakai
                  </button> */}
                  {/* <button
                    onClick={() => onAdjust(rm)}
                    title="Adjust Stok"
                    className="text-blue-600 hover:text-blue-900 inline-flex items-center px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Adjust
                  </button> */}
                  <button
                    onClick={() => onEdit(rm)}
                    title="Edit Bahan"
                    className="text-purple-600 hover:text-purple-900 inline-flex items-center px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(rm)}
                    title="Hapus Bahan"
                    className="text-red-600 hover:text-red-900 inline-flex items-center px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RawMaterialList;
