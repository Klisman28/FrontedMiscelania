import React from 'react'

/**
 * Skeleton loader para las tarjetas de producto del POS.
 * Mantiene la misma estructura geométrica que PosProductCard para evitar el "Layout Shift"
 * y dar una percepción de carga mucho más rápida y profesional.
 */
const PosProductSkeleton = () => {
    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col animate-pulse">
            {/* Aspect Ratio 1:1 Imagen */}
            <div className="relative w-full aspect-square bg-slate-100 shrink-0"></div>

            {/* Información Inferior */}
            <div className="p-3 flex flex-col gap-2 flex-1 border-t border-slate-50">
                {/* Marca (línea muy fina) */}
                <div className="h-2 w-16 bg-slate-200 rounded-full mt-1"></div>

                {/* Nombre de Producto (2 líneas) */}
                <div className="h-3 w-full bg-slate-200 rounded-full mt-1.5"></div>
                <div className="h-3 w-2/3 bg-slate-200 rounded-full"></div>

                {/* Espaciador flexible para empujar el footer hacia abajo */}
                <div className="flex-1 min-h-[10px]"></div>

                {/* Footer: Precio y Botón circular */}
                <div className="flex items-center justify-between mt-auto pt-1">
                    <div className="h-4 w-12 bg-slate-200 rounded-md"></div>
                    <div className="h-8 w-8 rounded-full bg-slate-200 shrink-0"></div>
                </div>
            </div>
        </div>
    )
}

export default PosProductSkeleton
