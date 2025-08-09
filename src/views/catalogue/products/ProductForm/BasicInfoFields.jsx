/********************************************************************
 *  BasicInfoFields.jsx
 *  Versión con “Fecha de expiración” opcional usando <Switcher />
 *******************************************************************/

import React, { useRef, useEffect } from 'react'
import { AdaptableCard } from 'components/shared'
import { Input, FormItem, Select, Badge, Switcher } from 'components/ui'
import { Field } from 'formik'
import { NumberFormatBase } from 'react-number-format'
import { useSelector } from 'react-redux'

/* Ejemplo de categorías (si las necesitas en otro lado) */
export const categories = [
    { label: 'Bolsos', value: 'bags' },
    { label: 'Ropa', value: 'cloths' },
    { label: 'Dispositivos', value: 'devices' },
    { label: 'Zapatos', value: 'shoes' },
    { label: 'Relojes', value: 'watches' }
]

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
    const { values, touched, errors, setFieldValue } = props

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

    /* Auto‑focus al activar expiración */
    const dateRef = useRef(null)
    useEffect(() => {


        if (values.hasExpiration && dateRef.current) {
            dateRef.current.focus()
        }
    }, [values.hasExpiration])

    return (
        <AdaptableCard className="mb-4" divider>
            <p className="mb-6 text-lg italic font-semibold text-dark dark:text-light">
                Información General
            </p>



            {/* Fila 1: Nombre & Código */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Fila 4: Descripción del Producto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    />
                </FormItem>
            </div>
            {/* Fila 2: Stock, Stock Mínimo, Unidad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                                placeholder="Seleccione una unidad"
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

            {/* Fila 0: Switcher para expiración */}
            <FormItem label="¿El producto expira?">
                <Field name="hasExpiration">
                    {({ field, form }) => (
                        <Switcher
                            name="hasExpiration"
                            onChange={(val) => {
                                form.setFieldValue('hasExpiration', val);
                                if (!val) {
                                    form.setFieldValue('expirationDate', '');  // Resetea la fecha cuando se apaga
                                }
                            }}
                            checkedContent="No"
                            unCheckedContent="Si"
                        />
                    )}
                </Field>
            </FormItem>
            {/* Fila 3: Expiración (opcional) */}
            {values.hasExpiration && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormItem
                        label="Fecha de expiración *"
                        invalid={errors.expirationDate && touched.expirationDate}
                        errorMessage={errors.expirationDate}
                    >
                        <Field name="expirationDate">
                            {({ field, form }) => (
                                <Input
                                    {...field}
                                    ref={dateRef}
                                    type="date"
                                    placeholder="YYYY‑MM‑DD"
                                    onChange={(e) =>
                                        form.setFieldValue('expirationDate', e.target.value)
                                    }
                                    className={`${statusExpiration === 'Vencido'
                                            ? 'border-red-500'  // Color de borde para vencido
                                            : 'border-emerald-500' // Color de borde para vigente
                                        } border-2 p-2 rounded-md`} // Borde y padding ajustado
                                />
                            )}
                        </Field>
                    </FormItem>

                    <div className="flex items-end">
                        {statusExpiration && (
                            <Badge
                                className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-full ${statusExpiration === 'Vencido'
                                    ? 'bg-red-500'
                                    : 'bg-emerald-500'
                                    } text-white`}
                            >
                                {statusExpiration === 'Vencido' ? 'V' : 'N'} {/* Usar solo la inicial para ahorrar espacio */}
                            </Badge>
                        )}
                    </div>

                </div>
            )}



        </AdaptableCard>
    )
}

export default BasicInfoFields
