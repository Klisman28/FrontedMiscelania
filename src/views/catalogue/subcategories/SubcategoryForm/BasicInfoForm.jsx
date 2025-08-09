import { useEffect, useState } from 'react'
import { Input, FormItem, Select } from 'components/ui'
import { Field } from 'formik'
import { getCategories } from '../SubcategoryList/store/dataSlice'
import { useDispatch } from 'react-redux'

const BasicInfoForm = props => {

	const dispatch = useDispatch()
	const [categories, setCategories] = useState([])

	const { touched, errors, values } = props

	const optionCategories = categories.map((category) => {
		return {
			value: category.id,
			label: category.name
		}
	})

	const fetchData = async () => {
		const res = await dispatch(getCategories())
		if(res.payload.type === 'success') {
			setCategories(res.payload.data.categories)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<>
			<FormItem
				label="Nombre Subcategoría"
				invalid={errors.name && touched.name}
				errorMessage={errors.name}
			>
				<Field
					type="text"
					autoComplete="off"
					name="name"
					placeholder="Nombre subcategoría"
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
					placeholder="S001"
					component={Input}
				/>
			</FormItem>
			{/* <FormItem
				label="Categoría"
				invalid={errors.categoryId && touched.categoryId}
				errorMessage={errors.code}
			>
				<Field
					type="text"
					autoComplete="off"
					name="categoryId"
					placeholder=""
					component={Input}
				/>
			</FormItem> */}
			<FormItem
				label="Categoría"
				// asterisk
				invalid={errors.categoryId && touched.categoryId}
				errorMessage={errors.categoryId}
			>
				<Field name="categoryId">
					{({ field, form }) => (
						<Select
							field={field}
							form={form}
							placeholder="Selecionar categoría..."
							options={optionCategories}
							value={optionCategories.filter(option => option.value === values.categoryId)}
							onChange={option => form.setFieldValue(field.name, option.value)}
						/>
					)}
				</Field>
			</FormItem>
		</>
	)
}

export default BasicInfoForm
