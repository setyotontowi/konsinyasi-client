import { useState } from "react";
import Select from "react-select";
import axiosClient from "../../../api/axiosClient";
import { toast } from "react-toastify";

export default function SerialNumberSelect({ onClose, idBarang, qty }) {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedFor, setLoadedFor] = useState(null); // track which idBarang was loaded

  const fetchSerialNumbers = async () => {
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

      setOptions(mappedOptions);
      setLoadedFor(idBarang);// optional callback
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
    <Select
      isMulti
      options={options}
      value={value}
      isLoading={loading}
      onChange={handleChange}
      onMenuOpen={fetchSerialNumbers}
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
      isDisabled={!idBarang}
    />
  );
}
