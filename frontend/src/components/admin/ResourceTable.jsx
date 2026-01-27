import { useEffect, useState } from "react";
import { fetchResources, deleteResource } from "../../services/resourceApi";

export default function ResourceTable({ refresh }) {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadResources = async () => {
    setLoading(true);
    try {
      const res = await fetchResources();
      setResources(res.data || []);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [refresh]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?\nThis cannot be undone."
    );

    if (!confirmDelete) return;

    await deleteResource(id);
    loadResources();
  };

  const filtered = resources.filter((r) =>
    r.originalName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#F3F4F4] rounded-xl border border-black/10 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-[#061E29]">
          Uploaded Resources
        </h2>

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            bg-[#E7ECEE]
            text-[#061E29]
            border border-black/10
            px-3 py-2 rounded-lg text-sm
            outline-none
            focus:ring-2 focus:ring-[#1D546D]
            transition
          "
        />
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-[#5F9598] py-4">
          Loading resources...
        </p>
      )}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <div className="text-center text-[#5F9598] py-10 text-sm">
          No resources uploaded yet
          <br />
          Upload documents to enable AI answers
        </div>
      )}

      {/* TABLE */}
      {!loading && filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">

            {/* HEAD */}
            <thead>
              <tr className="bg-[#E7ECEE] text-[#475569] text-left border-b border-black/10">
                <th className="py-3 px-2 font-medium">Document</th>
                <th className="py-3 px-2 font-medium">Type</th>
                <th className="py-3 px-2 text-right font-medium">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r._id}
                  className="
                    border-b border-black/5
                    hover:bg-[#EAEFF1]
                    transition
                  "
                >
                  <td className="py-3 px-2 font-medium text-[#061E29]">
                    {r.originalName}
                  </td>

                  <td className="py-3 px-2 text-[#5F9598] uppercase text-xs">
                    {r.fileType.replace(".", "")}
                  </td>

                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="
                        text-red-500
                        hover:text-red-700
                        text-sm
                        transition
                      "
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}
