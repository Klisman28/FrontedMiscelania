import React, { cloneElement } from 'react'
import { Avatar } from 'components/ui'
import Logo from 'components/template/Logo'
import { APP_NAME } from 'constants/app.constant'
import './styles.css';  // Asegúrate de importar el archivo CSS


const Side = ({ children, content, ...rest }) => {
	return (
		<div className="grid h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

			{/* Columna 1 */}
			<div className="bg-white columna1">
				<div>
					<div className="mb-6 flex items-center gap-4">
						<div className="text-white">

							{/* 
							Ajustamos la altura para que no sea forzosamente 'h-screen' en móviles;
							en lugar de forzar toda la pantalla, podemos usar 'min-h-screen' o
							simplemente 'py-8' o similar para no romper layout en pantallas muy pequeñas.
						*/}
							<div className="flex justify-center items-center min-h-screen bg-white-100">

								{/* 
								Cubo 1
								En móviles (sm:), w-12/h-12, en tablet (md:) w-16/h-16, 
								en desktop (lg:) w-20/h-20 
							*/}
								<div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 transform-style[preserve-3d] animate-rotateCube">
									<div className="absolute w-full h-full bg-white-500 border-2 border-white-700 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white-500 border-2 border-white-700 rotate-y-180 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white-500 border-2 border-white-700 rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white-500 border-2 border-white-700 -rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white-500 border-2 border-white-700 rotate-x-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white-500 border-2 border-white-700 -rotate-x-90 transform translateZ-[100px]" />
								</div>

								{/* Cubo 2 */}
								<div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 transform-style[preserve-3d] animate-rotateCube">
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 rotate-y-180 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 -rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 rotate-x-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 -rotate-x-90 transform translateZ-[100px]" />
								</div>

								{/* Cubo 3 */}
								<div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 transform-style[preserve-3d] animate-rotateCube">
									<div className="absolute w-full h-full bg-white border-2 border-white-700 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 rotate-y-180 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 -rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 rotate-x-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 -rotate-x-90 transform translateZ-[100px]" />
								</div>

								{/* Cubo 4 */}
								<div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 transform-style[preserve-3d] animate-rotateCube">
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 rotate-y-180 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 -rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 rotate-x-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 -rotate-x-90 transform translateZ-[100px]" />
								</div>

								{/* Cubo 5 */}
								<div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 transform-style[preserve-3d] animate-rotateCube">
									<div className="absolute w-full h-full bg-white border-2 border-white-700 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 rotate-y-180 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 -rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 rotate-x-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 -rotate-x-90 transform translateZ-[100px]" />
								</div>

								{/* Cubo 6 */}
								<div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 transform-style[preserve-3d] animate-rotateCube">
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 rotate-y-180 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 -rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 rotate-x-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-slate-500 border-2 border-white-700 -rotate-x-90 transform translateZ-[100px]" />
								</div>

								{/* Cubo 7 */}
								<div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 transform-style[preserve-3d] animate-rotateCube">
									<div className="absolute w-full h-full bg-white border-2 border-white-700 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 rotate-y-180 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 -rotate-y-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 rotate-x-90 transform translateZ-[100px]" />
									<div className="absolute w-full h-full bg-white border-2 border-white-700 -rotate-x-90 transform translateZ-[100px]" />
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Columna 2 y 3 (contenido y formulario, por ejemplo) */}
			<div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
				{/* Ajustamos el ancho y paddings dependiendo del punto de quiebre */}
				<Logo cla mode="dark" />

				<div className="formulario">
					<div className="">
						
						{content}
					</div>


					{children ? cloneElement(children, { ...rest }) : null}
				</div>
			</div>

		</div>
	)
}

export default Side