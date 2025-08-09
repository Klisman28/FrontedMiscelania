import React from 'react'
import { Card, Avatar } from 'components/ui'
import { IconText } from 'components/shared'
import { HiMail, HiPhone, HiExternalLink } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const SupplierInfo = ({data}) => {
  return (
    <Card>
        <h5 className="mb-4">Proveedor</h5>
        <Link className="group flex items-center justify-between" to="/app/crm/customer-details?id=11">
            <div className="flex items-center">
                {/* <Avatar shape="circle" src={data.img} /> */}
                <div className="ltr:ml-2 rtl:mr-2">
                    <div className="font-semibold group-hover:text-gray-900 group-hover:dark:text-gray-100">{data.name}</div>
                    <span>
                        RUC:
                        <span className="font-semibold">{data.ruc} </span>
                    </span>
                </div>
            </div>
            <HiExternalLink className="text-xl hidden group-hover:block" />
        </Link>
        <hr className="my-5" />
        <IconText 
            className="mb-4"
            icon={<HiMail className="text-xl opacity-70" />}
        >
            <span className="font-semibold">{data.email}</span>
        </IconText>
        <IconText icon={<HiPhone className="text-xl opacity-70" />}>
            <span className="font-semibold">{data.telephone}</span>
        </IconText>
        <hr className="my-5" />
    </Card>
  )
}

export default SupplierInfo