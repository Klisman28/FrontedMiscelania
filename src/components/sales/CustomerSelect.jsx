// CustomerSelect Component
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
                    <span className="font-medium block text-slate-900 leading-5">{props.label}</span>
                    {props.data.original?.nit && (
                        <span className="text-xs text-slate-500 block">NIT: {props.data.original.nit}</span>
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
                options={customers}
                value={value}
                onChange={onChange}

                filterOption={filterOption}

                isLoading={isLoading}
                getOptionLabel={(e) => e.label}
                getOptionValue={(e) => e.value}
                components={{ Control, Option }}
                placeholder={isLoading ? "Cargando clientes..." : "Seleccione cliente..."}
                noOptionsMessage={({ inputValue }) => inputValue ? "No se encontraron resultados" : "Sin clientes"}
                isDisabled={disabled || isLoading}
                isClearable
                isSearchable

                // CRÍTICO: Evitar que el dropdown se corte o se superponga
                menuPortalTarget={document.body}
                menuPosition="fixed"
                maxMenuHeight={260}
                styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                    control: (base) => ({ ...base, minHeight: '44px' }),
                }}

                classNames={{
                    control: (state) =>
                        `!border-slate-300 !rounded-xl !shadow-sm hover:!border-indigo-400 !bg-white h-11 ${state.isFocused ? '!ring-2 !ring-indigo-200 !border-indigo-300' : ''}`,
                    menu: () => "!rounded-xl !shadow-lg !border !border-slate-100 !mt-1 !overflow-hidden",
                    option: (state) =>
                        `${state.isFocused ? '!bg-slate-50 !text-slate-900' : '!text-slate-600'} !cursor-pointer !py-2.5 !px-4`,
                    singleValue: () => "!text-slate-900 !font-medium",
                    input: () => "!text-slate-700",
                    placeholder: () => "!text-slate-400"
                }}
                unstyled
            />
        </div>
    )
}

export default CustomerSelect
