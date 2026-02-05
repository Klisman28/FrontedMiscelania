import React, { useRef, useEffect } from 'react'
import { Input, FormItem, Select, Badge, Switcher } from 'components/ui'
import { Field } from 'formik'
import { NumberFormatBase } from 'react-number-format'
import { useSelector } from 'react-redux'

/* Wrappers -------------------------------------------------------------- */
const NumberInput = (props) => <Input {...props} value={props.field.value} />

const NumberFormatInput = ({ onValueChange, ...rest }) => (
    <NumberFormatBase
        customInput={Input}
        type="text"
        onValueChange={onValueChange}
        autoComplete="off"
        {...rest}
    />
)

/* Componente principal -------------------------------------------------- */
const BasicInfoFields = (props) => {
    const { values, touched, errors } = props

    /* Unidades desde Redux */
    const unitList = useSelector((state) => state.productForm.data.unitList)
    const unitOptions = unitList.map((u) => ({
        value: u.id,
        label: `${u.name} (${u.symbol})`
    }))

    /* Estado calculado de expiración */
    const getStatus = (date) => {
        if (!date) return null
        const today = new Date().toISOString().slice(0, 10) // YYYY‑MM‑DD
        return date < today ? 'Vencido' : 'Vigente'
    }
    const statusExpiration = getStatus(values.expirationDate)

    const dateRef = useRef(null)
    useEffect(() => {
        if (values.hasExpiration && dateRef.current) {
            dateRef.current.focus()
        }
    }, [values.hasExpiration])

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900">Información General</h4>
                <p className="text-sm text-gray-500 mt-1">Detalles básicos del producto</p>
            </div>

            <div className="grid grid-cols-12 gap-x-6 gap-y-6">

                {/* Fila 1: Nombre (8 cols) & Código (4 cols) */}
                <div className="col-span-12 md:col-span-8">
                    <FormItem
                        label="Nombre de Producto *"
                        invalid={errors.name && touched.name}
                        errorMessage={errors.name}
                    >
                        <Field
                            type="text"
                            name="name"
                            autoComplete="off"
                            placeholder="Ej. Televisor 40 pulgadas"
                            component={Input}
                        />
                    </FormItem>
                </div>

                <div className="col-span-12 md:col-span-4">
                    <FormItem
                        label="Código *"
                        invalid={errors.sku && touched.sku}
                        errorMessage={errors.sku}
                    >
                        <Field
                            type="text"
                            name="sku"
                            autoComplete="off"
                            placeholder="Ej. SKU‑1234"
                            component={Input}
                        />
                    </FormItem>
                </div>

                {/* Fila 2: Descripción (12 cols) */}
                <div className="col-span-12">
                    <FormItem
                        label="Descripción del Producto"
                        invalid={errors.description && touched.description}
                        errorMessage={errors.description}
                    >
                        <Field
                            type="text"
                            name="description"
                            autoComplete="off"
                            placeholder="Descripción detallada del producto"
                            component={Input}
                            textArea
                        />
                    </FormItem>
                </div>

                {/* Fila 3: Stock (4), Min (4), Unit (4) */}
                <div className="col-span-12 md:col-span-4">
                    <FormItem
                        label="Stock *"
                        invalid={errors.stock && touched.stock}
                        errorMessage={errors.stock}
                    >
                        <Field name="stock">
                            {({ field, form }) => (
                                <NumberFormatInput
                                    form={form}
                                    field={field}
                                    placeholder="Ej. 100"
                                    customInput={NumberInput}
                                    onValueChange={(e) =>
                                        form.setFieldValue(field.name, e.value)
                                    }
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>

                <div className="col-span-12 md:col-span-4">
                    <FormItem
                        label="Stock Mínimo *"
                        invalid={errors.stockMin && touched.stockMin}
                        errorMessage={errors.stockMin}
                    >
                        <Field name="stockMin">
                            {({ field, form }) => (
                                <NumberFormatInput
                                    form={form}
                                    field={field}
                                    placeholder="Ej. 10"
                                    customInput={NumberInput}
                                    onValueChange={(e) =>
                                        form.setFieldValue(field.name, e.value)
                                    }
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>

                <div className="col-span-12 md:col-span-4">
                    <FormItem
                        label="Unidad *"
                        invalid={errors.unitId && touched.unitId}
                        errorMessage={errors.unitId}
                    >
                        <Field name="unitId">
                            {({ field, form }) => (
                                <Select
                                    field={field}
                                    form={form}
                                    placeholder="Seleccione"
                                    options={unitOptions}
                                    value={unitOptions.find(
                                        (opt) => opt.value === values.unitId
                                    )}
                                    onChange={(opt) =>
                                        form.setFieldValue(field.name, opt.value)
                                    }
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>

                {/* Expiración Switch */}
                <div className="col-span-12 mt-2 pt-4 border-t border-gray-100 border-dashed">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900">Control de Vencimiento</span>
                                <span className="text-xs text-gray-500">Habilita esta opción si el producto caduca</span>
                            </div>
                            <Field name="hasExpiration">
                                {({ field, form }) => (
                                    <div className="ml-2">
                                        <Switcher
                                            name="hasExpiration"
                                            onChange={(val) => {
                                                form.setFieldValue('hasExpiration', val);
                                                if (!val) {
                                                    form.setFieldValue('expirationDate', '');
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </Field>
                        </div>

                        {values.hasExpiration && (
                            <div className="flex items-start gap-4 animate-fadeIn">
                                <FormItem
                                    label="Fecha de Vencimiento"
                                    className="w-full md:w-48"
                                    layout="vertical"
                                    invalid={errors.expirationDate && touched.expirationDate}
                                >
                                    <div className="flex flex-col">
                                        <Field name="expirationDate">
                                            {({ field, form }) => (
                                                <Input
                                                    {...field}
                                                    ref={dateRef}
                                                    type="date"
                                                    size="md"
                                                    className="font-medium"
                                                    onChange={(e) =>
                                                        form.setFieldValue('expirationDate', e.target.value)
                                                    }
                                                />
                                            )}
                                        </Field>
                                        <div className="mt-1 min-h-[20px]">
                                            {errors.expirationDate && touched.expirationDate && (
                                                <p className="text-xs text-red-500 leading-4 mb-0 text-left">
                                                    {errors.expirationDate}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </FormItem>
                                {statusExpiration && (
                                    <div className="mt-8">
                                        <Badge
                                            className={`px-3 py-1.5 flex items-center justify-center text-xs font-bold uppercase tracking-wider rounded-md border ${statusExpiration === 'Vencido'
                                                ? 'bg-red-50 text-red-600 border-red-200'
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                }`}
                                        >
                                            {statusExpiration}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BasicInfoFields
