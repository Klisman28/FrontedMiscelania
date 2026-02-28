import React, { useState, useEffect } from 'react';
import { FormItem, FormContainer, Input, Button, DatePicker, Select, toast, Notification } from 'components/ui';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { apiCreateNote, apiUpdateNote } from '../../services/note/NotesService';
import { HiOutlineSave, HiCheck } from 'react-icons/hi';

const validationSchema = Yup.object().shape({
    clientName: Yup.string().min(2, 'Min 2 caracteres').max(150, 'Max 150 caracteres').required('Nombre del cliente es requerido'),
    orderDate: Yup.date().required('Fecha de pedido es requerida'),
    dueDate: Yup.date().min(
        Yup.ref('orderDate'),
        'Fecha de fin debe ser posterior a fecha de pedido'
    ).required('Fecha de fin es requerida'),
    phone: Yup.string()
        .matches(/^[0-9]+$/, 'Solo números permitidos')
        .min(8, 'Mínimo 8 dígitos')
        .max(15, 'Máximo 15 dígitos')
        .required('Teléfono requerido'),
    designDescription: Yup.string().min(10, 'Mínimo 10 caracteres').required('Descripción requerida'),
    status: Yup.string().required('Estado requerido'),
});

const statusOptions = [
    { value: 'INICIO', label: 'Inicio' },
    { value: 'PROGRESO', label: 'Progreso' },
    { value: 'FINALIZADO', label: 'Finalizado' },
];

const NoteForm = ({ initialData, onSuccess, onCancel }) => {

    const [initialValues, setInitialValues] = useState({
        clientName: '',
        orderDate: new Date(),
        dueDate: dayjs().add(1, 'week').toDate(),
        phone: '',
        designDescription: '',
        status: 'INICIO'
    });

    useEffect(() => {
        if (initialData) {
            setInitialValues({
                clientName: initialData.clientName || initialData.client_name || '',
                orderDate: initialData.orderDate ? new Date(initialData.orderDate) : (initialData.order_date ? new Date(initialData.order_date) : new Date()),
                dueDate: initialData.dueDate ? new Date(initialData.dueDate) : (initialData.due_date ? new Date(initialData.due_date) : new Date()),
                phone: initialData.phone || '',
                designDescription: initialData.designDescription || initialData.design_description || '',
                status: initialData.status || 'INICIO'
            });
        }
    }, [initialData]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = {
                clientName: values.clientName,
                orderDate: dayjs(values.orderDate).format('YYYY-MM-DD'),
                dueDate: dayjs(values.dueDate).format('YYYY-MM-DD'),
                phone: values.phone,
                designDescription: values.designDescription,
                status: values.status
            };

            if (initialData?.id) {
                await apiUpdateNote(initialData.id, payload);
            } else {
                await apiCreateNote(payload);
            }

            resetForm();
            onSuccess();
        } catch (error) {
            console.error('Error guardando nota:', error);
            const errorMessage = error.response?.data?.message || 'Error al guardar la nota';
            toast.push(
                <Notification title="Error" type="danger">
                    {errorMessage}
                </Notification>
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, touched, errors, setFieldValue, isSubmitting }) => (
                <Form>
                    <FormContainer>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Nombre del Cliente */}
                            <FormItem
                                label="Nombre del Cliente"
                                className="md:col-span-2"
                                invalid={errors.clientName && touched.clientName}
                                errorMessage={errors.clientName}
                            >
                                <Field
                                    type="text"
                                    name="clientName"
                                    placeholder="Ej. Juan Pérez - Empresa S.A."
                                    component={Input}
                                />
                            </FormItem>

                            {/* Fecha de Pedido */}
                            <FormItem
                                label="Fecha de Pedido"
                                invalid={errors.orderDate && touched.orderDate}
                                errorMessage={errors.orderDate}
                            >
                                <Field name="orderDate">
                                    {({ field, form }) => (
                                        <DatePicker
                                            value={field.value}
                                            onChange={date => form.setFieldValue(field.name, date)}
                                            placeholder="Seleccionar Fecha"
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            {/* Fecha de Finalización */}
                            <FormItem
                                label="Fecha de Finalización"
                                invalid={errors.dueDate && touched.dueDate}
                                errorMessage={errors.dueDate}
                            >
                                <Field name="dueDate">
                                    {({ field, form }) => (
                                        <DatePicker
                                            value={field.value}
                                            onChange={date => form.setFieldValue(field.name, date)}
                                            placeholder="Seleccionar Fecha"
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            {/* Teléfono */}
                            <FormItem
                                label="Teléfono (WhatsApp / Contacto)"
                                invalid={errors.phone && touched.phone}
                                errorMessage={errors.phone}
                            >
                                <Field
                                    type="text"
                                    name="phone"
                                    placeholder="Ej. 12345678"
                                    component={Input}
                                />
                            </FormItem>

                            {/* Estado */}
                            <FormItem
                                label="Estado del Trabajo (Scrum)"
                                invalid={errors.status && touched.status}
                                errorMessage={errors.status}
                            >
                                <Field name="status">
                                    {({ field, form }) => (
                                        <Select
                                            options={statusOptions}
                                            value={statusOptions.find(option => option.value === field.value)}
                                            onChange={option => form.setFieldValue(field.name, option.value)}
                                            placeholder="Seleccionar Estado"
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            {/* Descripción del Diseño */}
                            <FormItem
                                label="Descripción del Diseño / Pedido"
                                className="md:col-span-2"
                                invalid={errors.designDescription && touched.designDescription}
                                errorMessage={errors.designDescription}
                            >
                                <Field
                                    name="designDescription"
                                >
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            textArea
                                            placeholder="Descripción profunda del diseño solicitado..."
                                            rows={4}
                                        />
                                    )}
                                </Field>
                                <p className="text-xs text-gray-400 mt-2">Detalla lo mejor posible los colores, estilo, tallas u observaciones especiales del cliente para la nota.</p>
                            </FormItem>

                        </div>

                        <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                            <Button
                                type="button"
                                variant="plain"
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                icon={<HiOutlineSave />}
                                loading={isSubmitting}
                            >
                                {initialData ? 'Actualizar Nota' : 'Guardar Nueva Nota'}
                            </Button>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    );
};

export default NoteForm;
