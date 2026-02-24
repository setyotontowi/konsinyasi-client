import { useState, useEffect } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import axiosClient from "../api/axiosClient";

export default function UnitNonPbfSelect({ 
    unitSelected = null,
    name,
    onChange,
    isDisabled = false
}) {

    const [unit, setUnit] = useState(unitSelected || null);

    useEffect(() => {
        if (unitSelected == undefined || unitSelected.value == null || unitSelected.value == "") {
          setDefaultUnit()
          return;
        }
        console.log("unit selected", unitSelected)
        axiosClient.get("/unit", {
            params: {
              id: unitSelected.value,
            },
          })
          .then((res) => {
            const data = res.data?.data[0]
            if (!data) return;
            setUnit({label: data.nama, value: data.id})
          });
    }, [unitSelected]);

    const setDefaultUnit = () => {
      setUnit({label: "Pilih unit tujuan...", value:null})
    }

    const loadUnitOptions = async (search, loadedOptions, { page }) => {
        try {
          const res = await axiosClient.get("/unit", {
            params: {
              nama: search,
              id: unitSelected.value,
              page,
              limit: 20,
            },
          });
    
          const list = res.data?.data || [];
          const hasMore = res.data?.pagination.page < res.data?.pagination.total_pages

          console.log("refreshed", list);
    
          return {
            options: list.map((u) => ({
              value: u.id,
              label: u.nama,
            })),
            hasMore,
            additional: {
              page: page + 1,
            },
          };
        } catch (err) {
          console.error(err);
          return {
            options: [],
            hasMore: false,
          };
        }
    };

    return (
        <AsyncPaginate
            value={unit} 
            loadOptions={loadUnitOptions}
            onChange={(opt) => onChange(name, opt)}
            isDisabled={isDisabled}
            additional={{
                page: 1,
            }}
            placeholder="Pilih unit tujuan.."
            debounceTimeout={300}
            loadOptionsOnMenuOpen
        />
    )
}