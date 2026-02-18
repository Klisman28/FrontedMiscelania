import React, { useEffect } from 'react'
import { FormItem, Select, DatePicker } from 'components/ui'
import { useSelector, useDispatch } from 'react-redux'
import 'dayjs/locale/es'
import { Controller } from 'react-hook-form'
import { getWarehouses } from 'store/warehouses/warehousesSlice'
import { HiOutlineOfficeBuilding, HiOutlineCalendar, HiOutlineTruck } from 'react-icons/hi'

/**
 * BasicInfoFields — Información de la compra
 * Diseño premium sin Card wrapper propio (vive dentro del panel derecho)
 */
const BasicInfoFields = ({ control, errors }) => {

    const dispatch = useDispatch()
    const supplierList = useSelector((state) => state.purchasForm.data.supplierList)
    const warehouseList = useSelector((state) => state.warehouses?.warehouses || [])

    const supplierOptions = supplierList.map((s) => ({
        value: s.id,
        label: s.name
    }))

    const warehouseOptions = warehouseList.map((w) => ({
        value: w.id,
        label: w.name
    }))

    useEffect(() => {
        dispatch(getWarehouses())
    }, [dispatch])

    return (
        <div>
            {/* Header de sección */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Información de Compra
                </span>
            </div>

            {/* Bodega */}
            <div className="mb-3">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    <HiOutlineOfficeBuilding className="text-slate-400" />
                    Bodega de destino
                </label>
                <FormItem
                    invalid={errors.warehouseId}
                    errorMessage={errors.warehouseId?.message}
                    className="mb-0"
                >
                    <Controller
                        control={control}
                        name="warehouseId"
                        render={({ field: { onChange, value } }) => (
                            <Select
                                placeholder="Seleccione una bodega..."
                                options={warehouseOptions}
                                value={warehouseOptions.find(o => o.value === value)}
                                onChange={(opt) => onChange(opt?.value)}
                                className="h-10"
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Fecha */}
            <div className="mb-3">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    <HiOutlineCalendar className="text-slate-400" />
                    Fecha de compra
                </label>
                <FormItem
                    invalid={errors.dateIssue}
                    errorMessage={
                        errors.dateIssue?.type === 'typeError'
                            ? 'La fecha debe tener un formato válido'
                            : errors.dateIssue?.message
                    }
                    className="mb-0"
                >
                    <Controller
                        control={control}
                        name="dateIssue"
                        render={({ field: { onChange, value } }) => (
                            <DatePicker
                                locale="es"
                                inputFormat="DD/MM/YYYY"
                                value={value}
                                onChange={onChange}
                                placeholder="DD/MM/YYYY"
                                clearable={false}
                                className="h-10"
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Proveedor */}
            <div className="mb-0">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    <HiOutlineTruck className="text-slate-400" />
                    Proveedor
                </label>
                <FormItem
                    invalid={errors.supplier?.value}
                    errorMessage={errors.supplier?.value?.message}
                    className="mb-0"
                >
                    <Controller
                        control={control}
                        name="supplier"
                        render={({ field: { onChange, value } }) => (
                            <Select
                                placeholder="Seleccione un proveedor..."
                                options={supplierOptions}
                                value={value}
                                onChange={onChange}
                                className="h-10"
                            />
                        )}
                    />
                </FormItem>
            </div>
        </div>
    )
}

export default BasicInfoFields