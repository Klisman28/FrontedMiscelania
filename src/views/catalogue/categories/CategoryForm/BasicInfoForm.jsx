import React from 'react'
import { Input, FormItem } from 'components/ui'
import { Field } from 'formik'

const BasicInfoForm = props => {

	const { touched, errors } = props

	return (
		<>
			<FormItem
				label="Nombre Categoría"
				invalid={errors.name && touched.name}
				errorMessage={errors.name}
			>
				<Field 
					type="text" 
					autoComplete="off" 
					name="name" 
					placeholder="Nombre categoría" 
					component={Input}
				/>
			</FormItem>
			<FormItem
				label="Código"
				invalid={errors.code && touched.code}
				errorMessage={errors.code}
			>
				<Field
					type="text" 
					autoComplete="off" 
					name="code" 
					placeholder="C01" 
					component={Input} 
				/>
			</FormItem>
		</>
	)
}

export default BasicInfoForm
