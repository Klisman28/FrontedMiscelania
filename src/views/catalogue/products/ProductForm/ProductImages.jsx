import React, { useState } from 'react'
import { AdaptableCard, ConfirmDialog, DoubleSidedImage } from 'components/shared'
import { FormItem, Dialog, Upload } from 'components/ui'
import { HiEye, HiTrash } from 'react-icons/hi'
import { Field } from 'formik'
import cloneDeep from 'lodash/cloneDeep'

/* -------------------------------------------------------
 * Subcomponente que muestra la lista de imágenes
 * ----------------------------------------------------- */
const ImageList = (props) => {
    const { imgList, onImageDelete } = props

    const [selectedImg, setSelectedImg] = useState({})
    const [viewOpen, setViewOpen] = useState(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const onViewOpen = (img) => {
        setSelectedImg(img)
        setViewOpen(true)
    }

    const onDialogClose = () => {
        setViewOpen(false)
        setTimeout(() => {
            setSelectedImg({})
        }, 300)
    }

    const onDeleteConfirmation = (img) => {
        setSelectedImg(img)
        setDeleteConfirmationOpen(true)
    }

    const onDeleteConfirmationClose = () => {
        setSelectedImg({})
        setDeleteConfirmationOpen(false)
    }

    const onDelete = () => {
        onImageDelete?.(selectedImg)
        setDeleteConfirmationOpen(false)
    }

    return (
        <>
            {imgList.map((img) => (
                <div
                    className="group relative rounded border p-2 flex"
                    key={img.id}
                >
                    <img
                        className="rounded max-h-[140px] max-w-full"
                        src={img.img}
                        alt={img.name}
                    />
                    <div className="absolute inset-2 bg-gray-900/[.7] group-hover:flex hidden text-xl items-center justify-center">
                        <span
                            onClick={() => onViewOpen(img)}
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                        >
                            <HiEye />
                        </span>
                        <span
                            onClick={() => onDeleteConfirmation(img)}
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                        >
                            <HiTrash />
                        </span>
                    </div>
                </div>
            ))}
            {/* Modal para ver imagen en grande */}
            <Dialog
                isOpen={viewOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h5 className="mb-4">{selectedImg.name}</h5>
                <img
                    className="w-full"
                    src={selectedImg.img}
                    alt={selectedImg.name}
                />
            </Dialog>
            {/* Confirmación para eliminar */}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                onClose={onDeleteConfirmationClose}
                onRequestClose={onDeleteConfirmationClose}
                type="danger"
                title="Remove image"
                onCancel={onDeleteConfirmationClose}
                onConfirm={onDelete}
                confirmButtonColor="red-600"
            >
                <p>Are you sure you want to remove this image?</p>
            </ConfirmDialog>
        </>
    )
}

/* -------------------------------------------------------
 * Componente principal ProductImages
 * ----------------------------------------------------- */
const ProductImages = (props) => {
    const { values } = props

    // Validaciones básicas de los archivos
    const beforeUpload = (file) => {
        let valid = true
        const allowedFileType = ['image/jpeg', 'image/png']
        const maxFileSize = 500000 // 500KB

        for (let f of file) {
            if (!allowedFileType.includes(f.type)) {
                valid = 'Please upload a .jpeg or .png file!'
            }
            if (f.size >= maxFileSize) {
                valid = 'Upload image cannot be more than 500KB!'
            }
        }

        return valid
    }

    // Maneja la subida de archivos al campo del formulario
    const onUpload = (form, field, files) => {
        // En caso de que no haya archivos, salimos
        if (!files || !files.length) {
            return
        }

        // Asegurarse de que imgList sea siempre un array
        const existingImages = values.imgList || []
        let imageId = '1-img-0'

        // Calculamos un nuevo ID basado en el último de la lista
        if (existingImages.length > 0) {
            const prevImgId = existingImages[existingImages.length - 1].id
            const splitImgId = prevImgId.split('-')
            const lastNumber = parseInt(splitImgId[splitImgId.length - 1], 10)
            splitImgId.pop() // remove el número viejo
            const newIdNumber = lastNumber + 1
            splitImgId.push(newIdNumber)
            imageId = splitImgId.join('-')
        }

        // Tomamos el último archivo subido (latestUpload)
        const latestUploadIndex = files.length - 1
        const latestFile = files[latestUploadIndex]

        // Creamos el objeto de imagen
        const newImage = {
            id: imageId,
            name: latestFile.name,
            img: URL.createObjectURL(latestFile),
        }

        // Añadimos la imagen al array
        const updatedImageList = [...existingImages, newImage]

        // Actualizamos el campo Formik de imgList
        form.setFieldValue(field.name, updatedImageList)

        // (Opcional) Si quieres actualizar el campo "imageUrl" automáticamente:
        form.setFieldValue('imageUrl', newImage.img)
    }

    // Maneja la eliminación de una imagen
    const handleImageDelete = (form, field, deletedImg) => {
        // Clonamos la lista de imágenes
        let updatedList = cloneDeep(values.imgList) || []
        // Filtramos la que se desea eliminar
        updatedList = updatedList.filter((img) => img.id !== deletedImg.id)
        // Actualizamos Formik
        form.setFieldValue(field.name, updatedList)
    }

    return (
        <AdaptableCard className="mb-4">
            <h5>Product Image</h5>
            <p className="mb-6">Add or change image for the product</p>

            <FormItem>
                <Field name="imgList">
                    {({ field, form }) => {
                        const currentImages = values.imgList || []

                        // Si ya hay imágenes, mostramos la galería + el botón para subir más
                        if (currentImages.length > 0) {
                            return (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                    <ImageList
                                        imgList={currentImages}
                                        onImageDelete={(img) =>
                                            handleImageDelete(form, field, img)
                                        }
                                    />
                                    <Upload
                                        className="min-h-fit"
                                        beforeUpload={beforeUpload}
                                        onChange={(files) =>
                                            onUpload(form, field, files)
                                        }
                                        showList={false}
                                        draggable
                                    >
                                        <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center">
                                            <DoubleSidedImage
                                                src="/img/others/upload.png"
                                                darkModeSrc="/img/others/upload-dark.png"
                                            />
                                            <p className="font-semibold text-center text-gray-800 dark:text-white">
                                                Upload
                                            </p>
                                        </div>
                                    </Upload>
                                </div>
                            )
                        }

                        // Si no hay imágenes, mostramos el área “Drop/Browse”
                        return (
                            <Upload
                                beforeUpload={beforeUpload}
                                onChange={(files) => onUpload(form, field, files)}
                                showList={false}
                                draggable
                            >
                                <div className="my-16 text-center">
                                    <DoubleSidedImage
                                        className="mx-auto"
                                        src="/img/others/upload.png"
                                        darkModeSrc="/img/others/upload-dark.png"
                                    />
                                    <p className="font-semibold">
                                        <span className="text-gray-800 dark:text-white">
                                            Drop your image here, or{' '}
                                        </span>
                                        <span className="text-blue-500">
                                            browse
                                        </span>
                                    </p>
                                    <p className="mt-1 opacity-60 dark:text-white">
                                        Support: jpeg, png
                                    </p>
                                </div>
                            </Upload>
                        )
                    }}
                </Field>
            </FormItem>
        </AdaptableCard>
    )
}

export default ProductImages
