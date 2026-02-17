import React, { useRef, useState, useEffect } from 'react'
import Select from 'react-select'
import { components } from 'react-select'
import { matchSorter } from 'match-sorter'
import { getCustomers } from '../../services/customers.api'
import { HiOutlineUser, HiCheck } from 'react-icons/hi'
import toast from 'react-hot-toast'

const Control = ({ children, ...props }) => {
    return (
        <components.Control {...props} className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg pr-3 pl-10 py-1 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 bg-white dark:bg-gray-800 min-h-[42px] relative transition-all">
            <HiOutlineUser className="text-lg text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {children}
        </components.Control>
    )
}

const Option = (props) => {
    return (
        <components.Option {...props}>
            <div className="flex items-center justify-between">
                <div>
                    <span className="font-semibold block text-gray-800 dark:text-gray-100">{props.label}</span>
                    {props.data.original?.nit && (
                        <span className="text-xs text-gray-400 block mt-0.5">NIT: {props.data.original.nit}</span>
                    )}
                </div>
                {props.isSelected && <HiCheck className="text-indigo-600 text-lg" />}
            </div>
        </components.Option>
    )
}

const CustomerSelect = ({ value, onChange, disabled }) => {
    const [customers, setCustomers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Cargar solo una vez al montar (o al intentar abrir)
    useEffect(() => {
        if (isLoaded) return;

        const loadAll = async () => {
            setIsLoading(true)
            try {
                const list = await getCustomers()
                const options = list.map(c => {
                    let label = c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim()
                    if (!label || label === ' ') label = `Cliente #${c.id}`
                    // Fix backend legacy data
                    if (label === 'null null') label = `Cliente #${c.id}`

                    return {
                        value: String(c.id), // React-Select prefiere value primitivo como key
                        label: label,
                        original: c
                    }
                })
                setCustomers(options)
                setIsLoaded(true)
            } catch (err) {
                console.error("Error loading customers", err)
                toast.error("No se pudo cargar la lista de clientes")
            } finally {
                setIsLoading(false)
            }
        }

        loadAll()
    }, [isLoaded])

    // Función de filtrado local para React-Select
    const filterOption = ({ label, data }, inputValue) => {
        // Usa match-sorter o búsqueda simple sobre el label y campos extra
        if (!inputValue) return true
        const searchInput = inputValue.toLowerCase()
        const labelMatch = label.toLowerCase().includes(searchInput)
        const nitMatch = data.original?.nit?.toLowerCase().includes(searchInput)
        const phoneMatch = data.original?.phone?.toLowerCase().includes(searchInput)
        // También buscar por ID o nombre completo concatenado extra
        const idMatch = String(data.value).includes(searchInput)

        return labelMatch || nitMatch || phoneMatch || idMatch
    }

    // Buscamos el objeto seleccionado correspondiente al 'value' (que podría ser solo el objeto {value, label} o null
    // Si value viene de Controller como null/undefined, es null.

    return (
        <div className="customer-select-wrapper">
            <Select
                options={customers} // Lista completa
                value={value}       // Objeto {value, label}
                onChange={onChange} // Devuelve objeto {value, label} a RHF Controller

                filterOption={filterOption} // IMPORTANTE: Filtrado local custom

                isLoading={isLoading}
                getOptionLabel={(e) => e.label}
                getOptionValue={(e) => e.value}
                components={{ Control, Option }}
                placeholder={isLoading ? "Cargando clientes..." : "Seleccione cliente..."}
                noOptionsMessage={({ inputValue }) => inputValue ? "No se encontraron resultados" : "Sin clientes"}
                isDisabled={disabled || isLoading}
                isClearable
                isSearchable

                classNames={{
                    control: (state) =>
                        `!border-gray-200 dark:!border-gray-700 !rounded-xl !shadow-sm hover:!border-indigo-500 !bg-white dark:!bg-gray-800 ${state.isFocused ? '!ring-2 !ring-indigo-500/20 !border-indigo-500' : ''}`,
                    menu: () => "!rounded-xl !shadow-lg !border !border-gray-100 dark:!border-gray-700 !mt-1 !overflow-hidden !z-50",
                    option: (state) =>
                        `${state.isFocused ? '!bg-indigo-50 dark:!bg-indigo-900/30 !text-indigo-600 dark:!text-indigo-400' : '!text-gray-600 dark:!text-gray-300'} !cursor-pointer !py-2.5 !px-4`,
                    singleValue: () => "!text-gray-700 dark:!text-gray-200 !font-medium",
                    input: () => "!text-gray-700 dark:!text-gray-200",
                    placeholder: () => "!text-gray-400"
                }}
                unstyled
            />
        </div>
    )
}

export default CustomerSelect
