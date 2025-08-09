import React from 'react'
import { Input, FormItem, Select, Card, DatePicker } from 'components/ui'
import { Field } from 'formik'
import { useSelector } from 'react-redux'
import 'dayjs/locale/es'
import { Controller } from 'react-hook-form'


const BasicInfoFields = ({ control, errors, setValue }) => {

    const supplierList = useSelector((state) => state.purchasForm.data.supplierList)

    const supplierOptions = supplierList.map((suplier) => {
        return {
            value: suplier.id,
            label: `${suplier.name}`
        }
    })


    return (
        <Card>
            <h5 className="mb-4">Información Básica</h5>
            <FormItem
                label="Fecha"
                invalid={errors.dateIssue}
                errorMessage={(errors.dateIssue) && (errors.dateIssue?.type === "typeError") ? "La fecha debe tener un formato válido" : errors.dateIssue?.message}
            >
                {/* <Field name="dateIssue" placeholder="Fecha...">
                    {({ field, form }) => (
                        <DatePicker
                            locale='es'
                            inputFormat="DD MMM YYYY"
                            field={field}
                            form={form}
                            value={field.value}
                            onChange={(date) => {
                                form.setFieldValue(field.name, date)
                            }}
                        />
                    )}
                </Field> */}
                <Controller
                    control={control}
                    name="dateIssue"
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            locale='es'
                            inputFormat="DD MMM YYYY"
                            // field={field}
                            // form={form}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Proveedor"
                invalid={true}
                errorMessage={(errors.supplier && errors.supplier.value) && errors.supplier.value.message}
            >
                <Controller
                    control={control}
                    name="supplier"
                    render={({ field: { onChange, value } }) => (
                        <Select
                            // field={field}
                            // form={form}
                            placeholder="Seleccione un proveedor..."
                            options={supplierOptions}
                            value={value}
                            // onChange={onChange}
                            onChange={onChange}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default BasicInfoFields