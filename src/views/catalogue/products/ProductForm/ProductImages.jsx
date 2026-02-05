import React, { useState } from 'react'
import { ConfirmDialog, DoubleSidedImage } from 'components/shared'
import { FormItem, Dialog, Upload } from 'components/ui'
import { HiEye, HiTrash, HiOutlinePhotograph } from 'react-icons/hi'
import { Field } from 'formik'
import cloneDeep from 'lodash/cloneDeep'

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
        setTimeout(() => setSelectedImg({}), 300)
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

    // Only showing the first image as main image in this modernized view, 
    // or if list, showing them vertically? Requirement says "Imagen de producto...".
    // I will keep list logic but style it as a single main hero if possible, or grid.

    return (
        <>
            {imgList.map((img) => (
                <div className="group relative rounded-xl border border-slate-200 aspect-[4/3] flex items-center justify-center bg-gray-50 overflow-hidden" key={img.id}>
                    <img className="object-cover w-full h-full" src={img.img} alt={img.name} />
                    <div className="absolute inset-0 bg-black/40 group-hover:flex hidden items-center justify-center gap-2 transition-all">
                        <span onClick={() => onViewOpen(img)} className="text-white hover:text-indigo-200 cursor-pointer p-2 bg-black/20 rounded-full backdrop-blur-sm transition-colors">
                            <HiEye className="text-xl" />
                        </span>
                        <span onClick={() => onDeleteConfirmation(img)} className="text-white hover:text-red-200 cursor-pointer p-2 bg-black/20 rounded-full backdrop-blur-sm transition-colors">
                            <HiTrash className="text-xl" />
                        </span>
                    </div>
                </div>
            ))}
            <Dialog isOpen={viewOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <h5 className="mb-4">{selectedImg.name}</h5>
                <img className="w-full rounded-lg" src={selectedImg.img} alt={selectedImg.name} />
            </Dialog>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                onClose={onDeleteConfirmationClose}
                onRequestClose={onDeleteConfirmationClose}
                type="danger"
                title="Eliminar imagen"
                onCancel={onDeleteConfirmationClose}
                onConfirm={onDelete}
                confirmButtonColor="red-600"
            >
                <p>¿Estás seguro de eliminar esta imagen?</p>
            </ConfirmDialog>
        </>
    )
}

const ProductImages = (props) => {
    const { values } = props

    const beforeUpload = (file) => {
        let valid = true
        const allowedFileType = ['image/jpeg', 'image/png']
        const maxFileSize = 500000
        for (let f of file) {
            if (!allowedFileType.includes(f.type)) valid = 'Please upload a .jpeg or .png file!'
            if (f.size >= maxFileSize) valid = 'Upload image cannot be more than 500KB!'
        }
        return valid
    }

    const onUpload = (form, field, files) => {
        if (!files || !files.length) return
        const existingImages = values.imgList || []
        let imageId = '1-img-0'
        if (existingImages.length > 0) {
            const prevImgId = existingImages[existingImages.length - 1].id
            const splitImgId = prevImgId.split('-')
            const lastNumber = parseInt(splitImgId[splitImgId.length - 1], 10)
            splitImgId.pop()
            const newIdNumber = lastNumber + 1
            splitImgId.push(newIdNumber)
            imageId = splitImgId.join('-')
        }
        const latestFile = files[files.length - 1]
        const newImage = { id: imageId, name: latestFile.name, img: URL.createObjectURL(latestFile) }
        const updatedImageList = [...existingImages, newImage]
        form.setFieldValue(field.name, updatedImageList)
        form.setFieldValue('imageUrl', newImage.img)
    }

    const handleImageDelete = (form, field, deletedImg) => {
        let updatedList = cloneDeep(values.imgList) || []
        updatedList = updatedList.filter((img) => img.id !== deletedImg.id)
        form.setFieldValue(field.name, updatedList)
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900">Imagen</h4>
                <p className="text-sm text-gray-500 mt-1">Foto principal del producto</p>
            </div>

            <FormItem className="mb-0">
                <Field name="imgList">
                    {({ field, form }) => {
                        const currentImages = values.imgList || []
                        if (currentImages.length > 0) {
                            return (
                                <div className="space-y-4">
                                    <ImageList imgList={currentImages} onImageDelete={(img) => handleImageDelete(form, field, img)} />
                                    {/* Small button to change/add more if needed, basically a re-upload trigger */}
                                    <Upload className="min-h-fit" beforeUpload={beforeUpload} onChange={(files) => onUpload(form, field, files)} showList={false} draggable>
                                        <div className="text-center text-xs text-indigo-600 font-semibold cursor-pointer hover:underline py-2">
                                            Cambiar imagen
                                        </div>
                                    </Upload>
                                </div>
                            )
                        }

                        return (
                            <Upload beforeUpload={beforeUpload} onChange={(files) => onUpload(form, field, files)} showList={false} draggable>
                                <div className="my-0 w-full aspect-[4/3] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 flex flex-col justify-center items-center cursor-pointer transition-colors group">
                                    <div className="p-4 rounded-full bg-white shadow-sm ring-1 ring-slate-900/5 group-hover:scale-110 transition-transform">
                                        <HiOutlinePhotograph className="text-3xl text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                    <p className="mt-4 font-semibold text-sm text-slate-900">
                                        Arrastra tu imagen aquí
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        o haz clic para seleccionar (jpg, png)
                                    </p>
                                </div>
                            </Upload>
                        )
                    }}
                </Field>
            </FormItem>
        </div>
    )
}

export default ProductImages
