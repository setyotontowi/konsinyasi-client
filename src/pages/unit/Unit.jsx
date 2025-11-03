import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUnits } from "../../store/unitSlice";
import UnitTable from "./UnitTable";
import PageHeader from "../../components/PageHeader";
import { RectangleGroupIcon } from "@heroicons/react/24/outline";

const Unit = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchUnits({ query: search }));
  };

  return (
    <>
        <div className="masterdata titlerounded-2xl bg-white border border-gray-200">
        <PageHeader
          title="Unit Pengguna"
          onAdd={() => dispatch(openAddModal())}
          search={search}
          setSearch={setSearch}
          addLabel="Tambah Unit"
          AddIcon={RectangleGroupIcon}
        />

        {/* Table */}
        <UnitTable 
          search={search}
        />
        
        </div>
    </>
  );
};

export default Unit;
