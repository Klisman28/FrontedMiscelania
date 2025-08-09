import React from 'react'
import { Input, FormItem, Select } from 'components/ui'
import { Field } from 'formik'
import { NumericFormat } from 'react-number-format'
import { useSelector } from 'react-redux'

const CurrencyInput = props => {
	return <Input {...props} value={props.field.value} prefix="Q" />
}

const NumberFormatInput = ({ onValueChange, ...rest }) => {
	return (
		<NumericFormat
			customInput={Input}
			type="text"
			onValueChange={onValueChange}
			autoComplete="off"
			{...rest}
		/>
	)
}

const BasicInfoForm = props => {

	const { values, touched, errors } = props

	const cashierList = useSelector((state) => state.openingForm.data.cashierList)

	const cashierOptions = cashierList.map((cashier) => {
		return {
			value: cashier.id,
			label: `${cashier.name} (${cashier.code})`
		}
	})

	return (
		<>
			<FormItem
				label="Saldo Inicial"
				invalid={errors.initBalance && touched.initBalance}
				errorMessage={errors.initBalance}
			>
				<Field name="initBalance">
					{({ field, form }) => {
						return (
							<NumberFormatInput
								form={form}
								field={field}
								placeholder="0.00"
								customInput={CurrencyInput}
								onValueChange={e => {
									form.setFieldValue(field.name, e.value)
								}}
							/>
						)
					}}
				</Field>
			</FormItem>
			<FormItem
				label="Caja"
				invalid={errors.cashierId && touched.cashierId}
				errorMessage={errors.cashierId}
			>
				<Field name="cashierId">
					{({ field, form }) => (
						<Select
							field={field}
							form={form}
							placeholder="Seleccione una marca..."
							options={cashierOptions}
							value={cashierOptions.filter(cashier => cashier.value === values.cashierId)}
							onChange={option => form.setFieldValue(field.name, option.value)}
						/>
					)}
				</Field>
			</FormItem>
		</>
	)
}

export default BasicInfoForm
