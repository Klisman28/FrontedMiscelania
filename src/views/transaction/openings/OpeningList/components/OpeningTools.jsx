import React from 'react'
import { Button } from 'components/ui'
import { HiDesktopComputer, HiInformationCircle } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { setDrawerOpen } from '../store/stateSlice'

const OpeningTools = () => {

    const dispatch = useDispatch();

    const handleOnClick = () => {
        dispatch(setDrawerOpen())
    }

    return (
        <div className='text-center border border-dashed rounded py-6 px-6 space-y-4'>
            <div className='text-amber-500 flex justify-center'>
                <HiInformationCircle className='w-6 h-6' />
                <span >
                    Para iniciar a vender, primero debes aperturar una caja
                </span>
            </div>
            <Button
                className="mr-2"
                variant="solid"
                icon={<HiDesktopComputer />}
                onClick={handleOnClick}
            >
                <span>Aperturar Caja</span>
            </Button>
        </div>
    )
}

export default OpeningTools
