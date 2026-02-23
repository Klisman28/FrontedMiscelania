/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react'
import {
    Card, Table, Input, Button, Tag, Pagination, toast, Notification, Spinner,
    Dialog, FormItem, FormContainer, Select, DatePicker
} from 'components/ui'
import { HiOutlineSearch, HiPlusCircle } from 'react-icons/hi'
import { getSaasCompanies, createSaasCompany, updateSaasCompanyStatus } from 'services/saasCompanies.service'
import { searchSaasUsers } from 'services/saasUsers.service'
import dayjs from 'dayjs'
import debounce from 'lodash/debounce'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import AsyncSelect from 'react-select/async'

const { Tr, Th, Td, THead, TBody } = Table

const statusColorStyles = {
    active: 'bg-green-100 text-green-600',
    suspended: 'bg-red-100 text-red-600',
    trialing: 'bg-blue-100 text-blue-600',
    past_due: 'bg-orange-100 text-orange-600',
    canceled: 'bg-gray-100 text-gray-600'
}

const planOptions = [
    { value: 'basic', label: 'Basic' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise' }
]

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Requerido'),
    slug: Yup.string().required('Requerido'),
    plan: Yup.string().required('Requerido'),
    seats: Yup.number().min(1, 'Mínimo 1').required('Requerido'),
    ownerUserId: Yup.number().required('Debe seleccionar un Dueño'),
    subscription_end: Yup.date().nullable()
})

const CompaniesList = () => {
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(false)
    const [rowLoading, setRowLoading] = useState({})

    // Pagination & Search
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: ''
    })

    // Modal
    const [modalOpen, setModalOpen] = useState(false)

    const fetchCompanies = useCallback(async () => {
        setLoading(true)
        try {
            const params = {
                offset: (tableData.pageIndex - 1) * tableData.pageSize,
                limit: tableData.pageSize,
                search: tableData.query
            }
            const { items, total } = await getSaasCompanies(params)

            setCompanies(items)
            setTableData(prev => ({
                ...prev,
                total: total
            }))

        } catch (error) {
            console.error('Error fetching companies', error)
            const message = error.response?.data?.body?.message || error.response?.data?.message || 'Error al cargar empresas'

            if (error.response?.status === 403) {
                toast.push(
                    <Notification title="Acceso Denegado" type="danger">
                        No autorizado (solo SuperAdmin)
                    </Notification>
                )
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        {message}
                    </Notification>
                )
            }
            if (error.response?.status === 403) setCompanies([])
        } finally {
            setLoading(false)
        }
    }, [tableData.pageIndex, tableData.pageSize, tableData.query])

    useEffect(() => {
        fetchCompanies()
    }, [fetchCompanies])

    const onSearchChange = debounce((val) => {
        setTableData(prev => ({ ...prev, query: val, pageIndex: 1 }))
    }, 500)

    const onPaginationChange = (page) => {
        setTableData(prev => ({ ...prev, pageIndex: page }))
    }

    const loadUsers = useCallback(async (inputValue) => {
        // If inputValue is provided, check length. If empty, proceed to load defaults.
        if (inputValue && inputValue.length < 2) return []

        try {
            const params = { limit: 10 }
            if (inputValue) {
                params.search = inputValue
            }

            const resp = await searchSaasUsers(params)
            const payload = resp.data.data || resp.data.body || resp.data
            // Handle different possible structures: { users: [...] } or direct array or { data: [...] }
            const users = payload.users || (Array.isArray(payload) ? payload : [])

            return users.map(user => ({
                value: user.id,
                label: `${user.username} — ${user.email}`,
                user: user
            }))
        } catch (e) {
            console.error('Error loading users:', e)
            return []
        }
    }, [])

    // Create Company
    const handleCreate = async (values, { setSubmitting, resetForm, setFieldError }) => {
        setSubmitting(true)
        try {
            const payload = {
                ...values,
                subscription_end: values.subscription_end ? dayjs(values.subscription_end).format('YYYY-MM-DD') : null
            }
            await createSaasCompany(payload)
            toast.push(
                <Notification title="Éxito" type="success">Empresa creada correctamente</Notification>
            )
            setModalOpen(false)
            resetForm()
            // Reset to page 1
            setTableData(prev => ({ ...prev, pageIndex: 1 }))
            if (tableData.pageIndex === 1) {
                fetchCompanies()
            }
        } catch (error) {
            console.error(error)
            const errorData = error.response?.data?.body || error.response?.data
            const message = errorData?.message || 'Error al crear empresa'

            // Handle field specific errors
            if (errorData?.field === 'ownerUserId') {
                setFieldError('ownerUserId', message)
            } else if (message.includes('slug') || message.includes('exist')) {
                setFieldError('slug', 'El slug ya existe o no es válido')
                toast.push(<Notification title="Error" type="danger">{message}</Notification>)
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        {message}
                    </Notification>
                )
            }
        } finally {
            setSubmitting(false)
        }
    }

    // Update Status
    const handleStatusUpdate = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
        setRowLoading(prev => ({ ...prev, [id]: true }))
        try {
            await updateSaasCompanyStatus(id, newStatus)
            toast.push(
                <Notification title="Actualizado" type="success">
                    Estado actualizado a {newStatus}
                </Notification>
            )
            // Refresh list
            fetchCompanies()
        } catch (error) {
            const message = error.response?.data?.message || 'Error al actualizar estado'
            toast.push(
                <Notification title="Error" type="danger">
                    {message}
                </Notification>
            )
        } finally {
            setRowLoading(prev => ({ ...prev, [id]: false }))
        }
    }

    const generateSlug = (name, setFieldValue) => {
        if (!name) return
        const slug = name.toString().toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
        setFieldValue('slug', slug)
    }

    return (
        <Card className="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold">Empresas SaaS</h3>
                    <p className="text-gray-500 text-sm">Gestiona tenants y suscripciones</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                    <Input
                        placeholder="Buscar empresa..."
                        prefix={<HiOutlineSearch className="text-lg" />}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    <Button icon={<HiPlusCircle />} variant="solid" onClick={() => setModalOpen(true)}>
                        Crear Empresa
                    </Button>
                </div>
            </div>

            {loading && companies.length === 0 ? (
                <div className="flex justify-center p-8"><Spinner size={40} /></div>
            ) : (
                <>
                    <Table>
                        <THead>
                            <Tr>
                                <Th>Empresa</Th>
                                <Th>Owner</Th>
                                <Th>Plan</Th>
                                <Th>Seats</Th>
                                <Th>Estado</Th>
                                <Th>Vencimiento</Th>
                                <Th>Acciones</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {companies.length > 0 ? companies.map(company => (
                                <Tr key={company.id}>
                                    <Td className="font-semibold">
                                        <div className="flex flex-col">
                                            <span>{company.name || '-'}</span>
                                            <span className="text-xs text-gray-500">{company.slug}</span>
                                        </div>
                                    </Td>
                                    <Td>{company.ownerName || company.owner?.username || company.owner?.email || '—'}</Td>
                                    <Td>
                                        <Tag className="bg-indigo-100 text-indigo-600 border-0 uppercase font-bold text-xs">{company.plan || 'Basic'}</Tag>
                                    </Td>
                                    <Td>{company.seats || 0}</Td>
                                    <Td>
                                        <Tag className={`${statusColorStyles[company.status] || 'bg-gray-100 text-gray-600'} border-0 rounded font-bold`}>
                                            {(company.status || 'unknown').toUpperCase()}
                                        </Tag>
                                    </Td>
                                    <Td>{company.subscription_end ? dayjs(company.subscription_end).format('DD/MM/YYYY') : '-'}</Td>
                                    <Td>
                                        <Button
                                            size="xs"
                                            variant="twoTone"
                                            color={company.status === 'active' ? 'red-600' : 'green-600'} // Red for Suspend, Green for Activate
                                            loading={rowLoading[company.id]}
                                            onClick={() => handleStatusUpdate(company.id, company.status)}
                                        >
                                            {company.status === 'active' ? 'Suspender' : 'Activar'}
                                        </Button>
                                    </Td>
                                </Tr>
                            )) : (
                                <Tr>
                                    <Td colSpan={7} className="text-center py-8 text-gray-500">
                                        No hay empresas registradas
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                    <div className="mt-4 flex justify-end">
                        <Pagination
                            currentPage={tableData.pageIndex}
                            total={tableData.total}
                            pageSize={tableData.pageSize}
                            onChange={onPaginationChange}
                        />
                    </div>
                </>
            )}

            <Dialog isOpen={modalOpen} onClose={() => setModalOpen(false)} width={700}>
                <h5 className="mb-4">Crear Nueva Empresa (Owner Existente)</h5>
                <Formik
                    initialValues={{
                        name: '', slug: '', plan: 'basic', seats: 1, subscription_end: null, ownerUserId: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleCreate}
                >
                    {({ values, touched, errors, setFieldValue, isSubmitting }) => (
                        <Form>
                            <FormContainer>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormItem label="Nombre Empresa" invalid={errors.name && touched.name} errorMessage={errors.name}>
                                        <Field name="name">
                                            {({ field }) => (
                                                <Input {...field} placeholder="Ej. Empresa Demo" onChange={e => {
                                                    field.onChange(e)
                                                    generateSlug(e.target.value, setFieldValue)
                                                }} />
                                            )}
                                        </Field>
                                    </FormItem>
                                    <FormItem label="Slug (URL)" invalid={errors.slug && touched.slug} errorMessage={errors.slug}>
                                        <Field name="slug" placeholder="empresa-demo" component={Input} />
                                    </FormItem>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormItem label="Plan" invalid={errors.plan && touched.plan} errorMessage={errors.plan}>
                                        <Field name="plan">
                                            {({ field, form }) => (
                                                <Select
                                                    options={planOptions}
                                                    value={planOptions.find(option => option.value === field.value)}
                                                    onChange={option => form.setFieldValue(field.name, option.value)}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                    <FormItem label="Seats (Usuarios)" invalid={errors.seats && touched.seats} errorMessage={errors.seats}>
                                        <Field name="seats" type="number" component={Input} min={1} />
                                    </FormItem>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormItem label="Asignar Owner (Buscar Usuario)" invalid={errors.ownerUserId && touched.ownerUserId} errorMessage={errors.ownerUserId}>
                                        <Field name="ownerUserId">
                                            {({ field, form }) => (
                                                <Select
                                                    componentAs={AsyncSelect}
                                                    cacheOptions
                                                    defaultOptions
                                                    loadOptions={loadUsers}
                                                    placeholder="Buscar por usuario o email..."
                                                    onChange={option => form.setFieldValue(field.name, option ? option.value : '')}
                                                    noOptionsMessage={() => "Sin resultados..."}
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                    <FormItem label="Vencimiento Suscripción (Opcional)">
                                        <Field name="subscription_end">
                                            {({ field, form }) => (
                                                <DatePicker
                                                    value={field.value}
                                                    placeholder="Seleccionar fecha"
                                                    onChange={date => form.setFieldValue(field.name, date)}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>

                                <div className="text-right mt-6">
                                    <Button className="mr-2" variant="plain" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
                                    <Button variant="solid" type="submit" loading={isSubmitting}>Crear Empresa</Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </Card>
    )
}

export default CompaniesList
