import React from 'react'
import { Card, Avatar } from 'components/ui'
import { IconText } from 'components/shared'
import { HiMail, HiPhone, HiExternalLink } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const CustomerInfo = ({ data, type }) => {
    return (
        <Card>
            <h5 className="mb-4">Cliente</h5>
            <Link className="group flex items-center justify-between" to="/app/crm/customer-details?id=11">
                <div className="flex items-center">
                    {/* <Avatar shape="circle" src={data.img} /> */}
                    <div className="ltr:ml-2 rtl:mr-2">
                        <div className="font-semibold group-hover:text-gray-900 group-hover:dark:text-gray-100">
                            {type === 'Boleta' ?
                                data.fullname : data.name
                            }
                        </div>
                        <span>
                            {type === 'Boleta'
                                ?
                                <>
                                    <span>DNI:</span>
                                    <span className="font-semibold">{data.dni} </span>
                                </>
                                :
                                <>
                                    <span>RUC:</span>
                                    <span className="font-semibold">{data.ruc} </span>
                                </>
                            }
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
        </Card>
    )
}

export default CustomerInfo