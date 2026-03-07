import React from 'react'
import { Input, FormItem } from 'components/ui'
import { Field } from 'formik'
import { NumberFormatBase } from 'react-number-format'
import { HiOutlineReceiptTax } from 'react-icons/hi'

const NumberInput = props => {
    return <Input {...props} value={props.field.value} className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 tabular-nums font-mono text-slate-800 placeholder:text-slate-400 transition-all" />
}

const NumberFormatInput = ({ onValueChange, ...rest }) => {
    return (
        <NumberFormatBase
            customInput={NumberInput}
            type="text"
            onValueChange={onValueChange}
            autoComplete="off"
            {...rest}
        />
    )
}

const TicketConfigFields = props => {
    const { touched, errors } = props

    return (
        <div className="group bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200/60 transition-all duration-300 p-6 h-full flex flex-col">
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                    <HiOutlineReceiptTax className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                    <h5 className="text-base font-bold text-slate-900 leading-tight">Ticket</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">Numeración de tickets</p>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-amber-200/60 via-transparent to-transparent mb-5"></div>

            {/* Field */}
            <div className="flex-1">
                <FormItem
                    label="Número Inicial"
                    labelClass="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2"
                    invalid={errors.ticketNum && touched.ticketNum}
                    errorMessage={errors.ticketNum}
                    className="mb-0"
                >
                    <Field name="ticketNum">
                        {({ field, form }) => (
                            <NumberFormatInput
                                form={form}
                                field={field}
                                placeholder="0001"
                                onValueChange={e => form.setFieldValue(field.name, e.value)}
                            />
                        )}
                    </Field>
                </FormItem>
            </div>
        </div>
    )
}

export default TicketConfigFields