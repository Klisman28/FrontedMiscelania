import React, { useState, useEffect } from 'react'
import { Input, FormItem, Upload, toast } from 'components/ui'
import { HiTrash, HiOutlinePhotograph, HiOutlineRefresh, HiOutlineOfficeBuilding } from 'react-icons/hi'
import { Field } from 'formik'
import { presignConfigImage, getOrFetchConfigSignedUrl } from 'services/uploadsService'

const GeneralConfigFields = props => {
    const { touched, errors, values } = props
    const [previewUrl, setPreviewUrl] = useState('')
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        let mounted = true
        const fetchUrl = async () => {
            if (values.logoKey && !previewUrl && !values.logoUrl) {
                const url = await getOrFetchConfigSignedUrl(values.logoKey)
                if (mounted && url) setPreviewUrl(url)
            } else if (values.logoUrl && !previewUrl) {
                setPreviewUrl(values.logoUrl)
            }
        }
        fetchUrl()
        return () => { mounted = false }
    }, [values.logoKey, values.logoUrl, previewUrl])

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl])

    const beforeUpload = (files) => {
        let valid = true
        const allowedFileType = ['image/jpeg', 'image/png', 'image/webp']
        const maxFileSize = 2 * 1024 * 1024
        for (let f of files) {
            if (!allowedFileType.includes(f.type)) {
                toast.push(<div className="text-red-500">Solo formato .jpeg, .png o .webp</div>, { placement: 'top-center' })
                valid = false
            }
            if (f.size >= maxFileSize) {
                toast.push(<div className="text-red-500">Máximo 2MB</div>, { placement: 'top-center' })
                valid = false
            }
        }
        return valid
    }

    const onFileUpload = async (form, files) => {
        if (!files || !files.length) return
        const file = files[0]
        try {
            setIsUploading(true)
            const presignRes = await presignConfigImage({ fileName: file.name, contentType: file.type })
            const { uploadUrl, key } = presignRes.data?.data || presignRes.data
            setPreviewUrl(URL.createObjectURL(file))
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file
            })
            if (uploadRes.ok) {
                form.setFieldValue('logoKey', key)
                toast.push(<div className="text-emerald-500">Logo subido correctamente</div>, { placement: 'top-center' })
            } else {
                throw new Error('Upload failed')
            }
        } catch (error) {
            toast.push(<div className="text-red-500">Error al subir el logo</div>, { placement: 'top-center' })
        } finally {
            setIsUploading(false)
        }
    }

    const handleDeleteImage = (form) => {
        form.setFieldValue('logoKey', null)
        form.setFieldValue('logoUrl', null)
        setPreviewUrl('')
    }

    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
            {/* Section Label */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500"></div>
                <h3 className="text-lg font-bold text-slate-800">Identidad del Negocio</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* ─── Logo Column ─── */}
                <div className="md:col-span-4">
                    <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 rounded-2xl p-5 text-center h-full flex flex-col">
                        <div className="flex items-center gap-2 justify-center mb-4">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Logotipo</span>
                        </div>

                        <FormItem className="mb-0 flex-1 flex flex-col justify-center">
                            <Field name="logoKey">
                                {({ form }) => {
                                    const hasImage = !!previewUrl || !!values.logoKey
                                    if (hasImage) {
                                        return (
                                            <div className="space-y-3">
                                                <div className="relative group rounded-2xl border border-slate-200/80 bg-white aspect-square max-w-[180px] mx-auto flex items-center justify-center overflow-hidden shadow-sm">
                                                    <img
                                                        className={`object-contain w-full h-full p-3 ${isUploading ? 'opacity-40 blur-sm' : ''}`}
                                                        src={previewUrl || values.logoUrl}
                                                        alt="Logo"
                                                    />
                                                    {isUploading && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="block h-8 w-8 border-[3px] border-slate-200 border-t-indigo-500 rounded-full animate-spin"></span>
                                                        </div>
                                                    )}
                                                    {!isUploading && (
                                                        <div className="absolute inset-0 flex items-center gap-2 justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                                                            <Upload showList={false} beforeUpload={beforeUpload} onChange={(files) => onFileUpload(form, files)}>
                                                                <button type="button" className="p-2.5 bg-white rounded-xl text-indigo-600 hover:text-indigo-800 shadow-lg transition-all hover:scale-110" title="Cambiar">
                                                                    <HiOutlineRefresh className="text-lg" />
                                                                </button>
                                                            </Upload>
                                                            <button type="button" onClick={() => handleDeleteImage(form)} className="p-2.5 bg-white rounded-xl text-red-500 hover:text-red-700 shadow-lg transition-all hover:scale-110" title="Eliminar">
                                                                <HiTrash className="text-lg" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-400 text-center">Pasa el cursor para cambiar</p>
                                            </div>
                                        )
                                    }
                                    return (
                                        <Upload draggable beforeUpload={beforeUpload} onChange={(files) => onFileUpload(form, files)} showList={false} disabled={isUploading}>
                                            <div className="aspect-square max-w-[180px] mx-auto border-2 border-dashed border-slate-300/60 rounded-2xl bg-white flex flex-col justify-center items-center transition-all hover:bg-indigo-50/30 hover:border-indigo-300/60 cursor-pointer group">
                                                {isUploading ? (
                                                    <span className="block h-8 w-8 border-[3px] border-slate-200 border-t-indigo-500 rounded-full animate-spin"></span>
                                                ) : (
                                                    <>
                                                        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm ring-1 ring-slate-200/50 group-hover:ring-indigo-200/50 group-hover:from-indigo-50 group-hover:to-indigo-100/50 transition-all duration-300 group-hover:scale-110">
                                                            <HiOutlinePhotograph className="text-2xl text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                                        </div>
                                                        <p className="mt-3 font-semibold text-xs text-slate-600 group-hover:text-indigo-600 transition-colors">Subir Logo</p>
                                                        <p className="mt-0.5 text-[10px] text-slate-400">JPG, PNG o WebP</p>
                                                    </>
                                                )}
                                            </div>
                                        </Upload>
                                    )
                                }}
                            </Field>
                        </FormItem>
                    </div>
                </div>

                {/* ─── Company Name Column ─── */}
                <div className="md:col-span-8 flex flex-col justify-center">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-indigo-50/50 to-transparent rounded-2xl border border-indigo-100/50">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 flex-shrink-0">
                                <HiOutlineOfficeBuilding className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <FormItem
                                    label="Nombre de la Empresa"
                                    labelClass="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
                                    invalid={errors.companyName && touched.companyName}
                                    errorMessage={errors.companyName}
                                    className="mb-0"
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="companyName"
                                        placeholder="Ej: Mi Tienda SRL"
                                        component={Input}
                                        className="h-12 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-slate-800 placeholder:text-slate-400 text-base transition-all"
                                    />
                                </FormItem>
                                <p className="text-[11px] text-slate-400 mt-2">
                                    Se mostrará en tickets, boletas y facturas de venta.
                                </p>
                            </div>
                        </div>

                        {/* Preview Card */}
                        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Vista previa del encabezado</p>
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/50">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Logo" className="w-12 h-12 object-contain rounded-lg bg-white p-1 ring-1 ring-slate-200/60 shadow-sm" />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center ring-1 ring-slate-200/60 shadow-sm">
                                        <HiOutlinePhotograph className="w-6 h-6 text-slate-300" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-base font-bold text-slate-800">
                                        {values.companyName || <span className="text-slate-300 font-normal italic">Nombre de la empresa</span>}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Comprobante de Venta
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GeneralConfigFields
