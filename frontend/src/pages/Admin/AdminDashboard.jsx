import { useState } from "react";
import UploadResource from "../../components/admin/UploadResource";
import ResourceTable from "../../components/admin/ResourceTable";
import AdminStats from "../../components/admin/AdminStats";
import AdminHeader from "../AdminHeader";

export default function AdminDashboard() {
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      {/* ADMIN HEADER */}
      <AdminHeader />

      {/* MAIN DASHBOARD CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>

        {/* STATS */}
        <AdminStats />

        {/* UPLOAD */}
        <UploadResource onUpload={() => setRefresh(!refresh)} />

        {/* TABLE */}
        <ResourceTable refresh={refresh} />

      </div>
    </>
  );
}
