import React, { useState, useEffect } from 'react'
import { ConfirmDialog, DoubleSidedImage } from 'components/shared'
import { FormItem, Dialog, Upload, toast } from 'components/ui'
import { HiEye, HiTrash, HiOutlinePhotograph, HiOutlineRefresh } from 'react-icons/hi'
import { Field } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { presignProductImage, getOrFetchSignedUrl } from 'services/uploadsService'
import { useSelector } from 'react-redux'

const ProductImages = (props) => {
    const { values, onImageClick } = props

    const [previewUrl, setPreviewUrl] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // Read roles from Redux
    const user = useSelector((state) => state.auth.user)
    const authority = user?.authority || []
    const isSuperAdmin = user?.isSuperAdmin

    // Authorization logic
    const canManageImage = isSuperAdmin || authority.includes('admin') || authority.includes('almacenero')

    useEffect(() => {
        let mounted = true
        const fetchUrl = async () => {
            if (values.imageKey && !previewUrl && !values.imageUrl) {
                const url = await getOrFetchSignedUrl(values.imageKey)
                if (mounted && url) {
                    setPreviewUrl(url)
                }
            } else if (values.imageUrl && !previewUrl) {
                setPreviewUrl(values.imageUrl)
            }
        }
        fetchUrl()
        return () => { mounted = false }
    }, [values.imageKey, values.imageUrl, previewUrl])

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    const beforeUpload = (files) => {
        let valid = true
        const allowedFileType = ['image/jpeg', 'image/png', 'image/webp']
        const maxFileSize = 2 * 1024 * 1024 // 2MB

        for (let f of files) {
            if (!allowedFileType.includes(f.type)) {
                toast.push(<div className="text-red-500">Por favor, sube un archivo .jpeg, .png o .webp</div>, { placement: 'top-center' })
                valid = false
            }
            if (f.size >= maxFileSize) {
                toast.push(<div className="text-red-500">La imagen no puede pesar más de 2MB</div>, { placement: 'top-center' })
                valid = false
            }
        }
        return valid
    }

    const onFileUpload = async (form, field, files) => {
        if (!files || !files.length) return

        setErrorMsg('')
        const file = files[0]

        // C) Presign + Upload
        try {
            setIsUploading(true)

            // 1. Get presigned URL
            const presignRes = await presignProductImage({
                fileName: file.name,
                contentType: file.type
            })

            const resData = presignRes.data?.data || presignRes.data
            const { uploadUrl, key } = resData

            // B) Preview (local show while uploading or after)
            const localUrl = URL.createObjectURL(file)
            setPreviewUrl(localUrl)

            // 2. Upload direct to S3
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file
            })

            if (uploadRes.ok) {
                // Guardar imageKey
                form.setFieldValue('imageKey', key)
                // Opcional: borrar el anterior de preview
                toast.push(<div className="text-emerald-500">Imagen subida con éxito</div>, { placement: 'top-center' })
            } else {
                throw new Error('Error al subir objeto a S3')
            }

        } catch (error) {
            console.error(error)
            toast.push(<div className="text-red-500">Error al subir la imagen</div>, { placement: 'top-center' })
            setErrorMsg('Error al subir la imagen')
            // Don't set imageKey on fail, but we left the localUrl so they see preview or can throw it away
        } finally {
            setIsUploading(false)
        }
    }

    const handleDeleteImage = (form) => {
        // En "Eliminar", setear imageKey = null
        form.setFieldValue('imageKey', null)
        form.setFieldValue('imageUrl', null) // Limpiar tambien si estuviera
        setPreviewUrl('')
        toast.push(<div className="text-slate-600">Imagen removida</div>, { placement: 'top-center' })
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900">Imagen</h4>
                <p className="text-sm text-gray-500 mt-1">Foto principal del producto</p>
                {!canManageImage && (
                    <p className="text-xs text-red-500 mt-2">No tienes permisos para modificar imágenes.</p>
                )}
            </div>

            <FormItem className="mb-0 text-center">
                <Field name="imageKey">
                    {({ form }) => {
                        const hasImage = !!previewUrl || !!values.imageKey

                        if (hasImage && !errorMsg) {
                            return (
                                <div className="space-y-4">
                                    <div className="relative group rounded-xl border border-slate-200 aspect-[4/3] flex items-center justify-center bg-gray-50 overflow-hidden">
                                        {/* If loading and we have a local url, it shows local. If it's done or fetched, it shows signed */}
                                        <img
                                            className={`object-contain w-full h-full ${isUploading ? 'opacity-50 blur-sm' : ''}`}
                                            src={previewUrl || values.imageUrl}
                                            alt="Preview"
                                        />

                                        {isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="block h-8 w-8 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></span>
                                            </div>
                                        )}

                                        {!isUploading && canManageImage && (
                                            <div className="absolute inset-0 flex items-center gap-3 justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                                <Upload
                                                    showList={false}
                                                    beforeUpload={beforeUpload}
                                                    onChange={(files) => onFileUpload(form, 'imageKey', files)}
                                                >
                                                    <button type="button" className="p-2 bg-white rounded-full text-indigo-600 hover:text-indigo-800 shadow transition-colors" title="Cambiar imagen">
                                                        <HiOutlineRefresh className="text-xl" />
                                                    </button>
                                                </Upload>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteImage(form)}
                                                    className="p-2 bg-white rounded-full text-red-600 hover:text-red-800 shadow transition-colors"
                                                    title="Eliminar imagen"
                                                >
                                                    <HiTrash className="text-xl" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {canManageImage && !isUploading && (
                                        <div className="flex gap-2 justify-center mt-2">
                                            <Upload
                                                className="w-full"
                                                showList={false}
                                                beforeUpload={beforeUpload}
                                                onChange={(files) => onFileUpload(form, 'imageKey', files)}
                                            >
                                                <div className="w-full text-center text-xs text-indigo-600 font-semibold cursor-pointer hover:underline py-2">
                                                    Cambiar imagen
                                                </div>
                                            </Upload>
                                            <div className="w-px bg-slate-200 my-2"></div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteImage(form)}
                                                className="w-full text-center text-xs text-red-600 font-semibold cursor-pointer hover:underline py-2"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        return (
                            <Upload
                                draggable
                                beforeUpload={beforeUpload}
                                onChange={(files) => onFileUpload(form, 'imageKey', files)}
                                showList={false}
                                disabled={!canManageImage || isUploading}
                            >
                                <div className={`my-0 w-full aspect-[4/3] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col justify-center items-center transition-colors group ${canManageImage && !isUploading ? 'hover:bg-slate-100 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}>
                                    {isUploading ? (
                                        <span className="block h-8 w-8 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            <div className="p-4 rounded-full bg-white shadow-sm ring-1 ring-slate-900/5 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-indigo-500">
                                                <HiOutlinePhotograph className="text-3xl" />
                                            </div>
                                            <p className="mt-4 font-semibold text-sm text-slate-900">
                                                {canManageImage ? 'Arrastra tu imagen aquí' : 'Sin imagen'}
                                            </p>
                                            {canManageImage && (
                                                <p className="mt-1 text-xs text-slate-500">
                                                    o haz clic para seleccionar (jpg, png, webp)
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </Upload>
                        )
                    }}
                </Field>
            </FormItem>
            {errorMsg && <p className="text-red-500 text-sm mt-2 text-center">{errorMsg}</p>}
        </div>
    )
}

export default ProductImages
