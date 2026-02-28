import { useState } from "react";
import Select from "react-select";
import axiosClient from "../../../api/axiosClient";
import { toast } from "react-toastify";
import { AsyncPaginate } from "react-select-async-paginate";

export default function SerialNumberSelect({ onClose, idBarang, qty }) {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedFor, setLoadedFor] = useState(null); // track which idBarang was loaded

  const loadOptions = async (search, loadedOptions, { page }) => {
    // ❗ Don’t fetch if idBarang is missing
    if (!idBarang) return;

    // ❗ Prevent duplicate calls for same barang
    if (loadedFor === idBarang) return;

    try {
      setLoading(true);

      const res = await axiosClient.get(
        `/inventory/serial-number?id_barang=${idBarang}&is_used=0`
      );


      const mappedOptions = res.data.data.map(item => ({
        value: item.id,
        label: item.serial_number,
      }));

      const list = res.data?.data || [];
      const hasMore = res.data?.pagination.page < res.data?.pagination.total_pages

      setLoadedFor(idBarang);// optional callback

      return {
        options: list.map((u) => ({
          value: u.id,
          label: u.serial_number,
        })),
        hasMore,
        additional: {
          page: page + 1,
        },
      };


      setOptions(mappedOptions);
      
    } catch (err) {
      console.error("Failed to load serial numbers", err);
    } finally {
      setLoading(false);
    }
  };

  // Limit selection to qty
  const handleChange = (value) => {
    if (value.length > qty) {
      // Optionally show a message to user
      toast.warning(`Anda hanya bisa memilih maksimal ${qty} serial number.`);
      return;
    }
    setValue(value);
  }

  return (
    <AsyncPaginate
      isMulti
      loadOptions={loadOptions}
      value={value}
      isLoading={loading}
      onChange={handleChange}
      onMenuClose={()=> {
        onClose(value)}
      }
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      isClearable
      placeholder={
        idBarang
          ? "Select serial numbers"
          : "Select barang first"
      }
      additional={{
        page: 1,
      }}
      isDisabled={!idBarang}
      loadOptionsOnMenuOpen
    />
  );
}
