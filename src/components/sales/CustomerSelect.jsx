// CustomerSelect Component
import React, { useRef, useState, useEffect } from 'react'
import Select from 'react-select'
import { components } from 'react-select'
import { matchSorter } from 'match-sorter'
import { getCustomers } from '../../services/customers.api'
import { HiOutlineUser, HiCheck } from 'react-icons/hi'
import toast from 'react-hot-toast'

// Control: Contenedor principal con icono absoluto
const Control = ({ children, ...props }) => {
    return (
        <components.Control {...props} className="relative flex items-center border border-gray-300 dark:border-gray-600 rounded-lg py-1 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 bg-white dark:bg-gray-800 min-h-[42px] transition-all">
            <HiOutlineUser className="text-lg text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            {children}
        </components.Control>
    )
}

// ValueContainer: Aquí se aplica el padding para dejar espacio al icono y a los indicadores
const ValueContainer = ({ children, ...props }) => {
    return (
        <components.ValueContainer {...props}>
            {children}
        </components.ValueContainer>
    )
}

// SingleValue: El texto seleccionado
const SingleValue = ({ children, ...props }) => {
    return (
        <components.SingleValue {...props}>
            {children}
        </components.SingleValue>
    )
}

const Option = (props) => {
    return (
        <components.Option {...props}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{props.label}</span>
                    {props.data.original?.nit && (
                        <>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-slate-500">NIT: {props.data.original.nit}</span>
                        </>
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

    // Handler personalizado para onChange
    const handleChange = (selectedOption) => {
        if (selectedOption === null) {
            // Cliente limpiado/removido
            toast('Cliente removido', {
                icon: '👤',
                duration: 2000,
                position: 'bottom-center',
            })
        }
        onChange(selectedOption)
    }

    return (
        <div className="customer-select-wrapper">
            <Select
                options={customers}
                value={value}
                onChange={handleChange}

                filterOption={filterOption}

                isLoading={isLoading}
                getOptionLabel={(e) => e.label}
                getOptionValue={(e) => e.value}
                components={{ Control, ValueContainer, SingleValue, Option }}
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
                    menu: (base) => ({ ...base, zIndex: 9999, backgroundColor: 'white' }),
                    menuList: (base) => ({ ...base, backgroundColor: 'white', padding: 0 }),
                    control: (base) => ({ ...base, minHeight: '44px' }),
                    // CRÍTICO: Padding para el ValueContainer (donde vive el texto)
                    valueContainer: (base) => ({
                        ...base,
                        paddingLeft: '44px',  // Espacio para el icono
                        paddingRight: '12px'  // Espacio para indicadores
                    }),
                    // CRÍTICO: SingleValue (texto seleccionado) sin padding extra
                    singleValue: (base) => ({
                        ...base,
                        marginLeft: 0,
                        marginRight: 0
                    }),
                }}

                classNames={{
                    control: (state) =>
                        `!border-slate-300 !rounded-xl !shadow-sm hover:!border-indigo-400 !bg-white h-11 ${state.isFocused ? '!ring-2 !ring-indigo-200 !border-indigo-300' : ''}`,
                    menu: () => "!bg-white !rounded-xl !shadow-lg !border !border-slate-200 !mt-1 !overflow-hidden",
                    menuList: () => "!bg-white !p-0",

                    option: (state) =>
                        `${state.isFocused ? '!bg-slate-50 !text-slate-900' : '!bg-white !text-slate-700'} !cursor-pointer !py-2.5 !px-4`,

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
