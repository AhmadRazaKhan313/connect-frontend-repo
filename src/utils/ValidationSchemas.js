import * as Yup from 'yup';

export const AddISPValidationSchema = Yup.object().shape({
    name: Yup.string().required('ISP name is required'),
    vlan: Yup.number().required('VLAN is requried'),
    openingBalance: Yup.number().required('Opening Balance is requried'),
    staticIpRate: Yup.number().required('Static Ip Rate is requried').min(0),
    color: Yup.string().required('Color is requried')
});

export const AddPackageValidationSchema = Yup.object().shape({
    isp: Yup.string().required('ISP id is required'),
    name: Yup.string().required('Package Name is requried'),
    bandwidth: Yup.number().required('Bandwidth is requried'),
    rateType: Yup.string().required('Rate type is requried'),
    ratePerDay: Yup.number(),
    purchaseRate: Yup.number().required('Purchase rate is requried'),
    saleRate: Yup.number()
        .required('Sale rate is requried')
        .test('greaterThan', 'Sale Rate must be greater than Purchase Rate', function (value) {
            const purchaseRate = this.parent.purchaseRate;
            return value > purchaseRate;
        }),
    validity: Yup.number().required('Validity is requried')
});

export const AddUserValidationSchema = Yup.object().shape({
    fullname: Yup.string().required('Full Name is requires'),
    email: Yup.string().email(),
    userId: Yup.string().required('User Id is requires'),
    cnic: Yup.string()
        .matches(/^\d{13}$/, 'Invalid CNIC format')
        .required('CNIC is requires'),
    mobile: Yup.string().matches(/^92(3)\d{9}$/, 'Invalid phone number format'),
    address: Yup.string().required('Address is requires'),
    sendWelcomeMessage: Yup.boolean().required()
});

export const AddStaffValidationSchema = Yup.object().shape({
    fullname: Yup.string().required('Full Name is requires'),
    cnic: Yup.string()
        .matches(/^\d{13}$/, 'Invalid CNIC format')
        .required('CNIC is requires'),
    mobile: Yup.string()
        .matches(/^92(3)\d{9}$/, 'Invalid phone number format')
        .required('Mobile is requires'),
    address: Yup.string().required('Address is requires'),
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().required('Password is required'),
    type: Yup.string().required('Type is required'),
    share: Yup.number().when('type', {
        is: (val) => val === 'partner',
        then: Yup.number().required('Share is required'),
        otherwise: Yup.number()
    }),
    sendWelcomeMessage: Yup.boolean().required()
});

export const CreateEntryValidationSchema = Yup.object().shape({
    entryDate: Yup.date().required('Entry Date is required'),
    isp: Yup.string().required('ISP is required'),
    userId: Yup.string().required('User id is required'),
    package: Yup.string().required('Package is required'),
    paymentMethod: Yup.string().required('Payment Method id is required'),
    tid: Yup.string(),
    ipType: Yup.string().required('IP type is required'),
    staticIp: Yup.string(),
    staticIpSaleRate: Yup.number(),
    saleRate: Yup.number(),
    startDate: Yup.date().required('Start Date is required'),
    expiryDate: Yup.date().required('Expiry Date is required'),
    sendAlertMessage: Yup.boolean()
});

export const SendInvoiceValidationSchema = Yup.object().shape({
    isp: Yup.string().required('ISP is required'),
    date: Yup.date().required('Date is required'),
    paymentMethod: Yup.string().required('Payment Method id is required'),
    tid: Yup.string(),
    amount: Yup.number().required('Amount is required'),
    comments: Yup.string()
});

export const AddExpenseValidationSchema = Yup.object().shape({
    spentBy: Yup.string().required('Spent By is required'),
    paymentMethod: Yup.string().required('Payment Method is required'),
    tid: Yup.string(),
    amount: Yup.number().required('Amount is required'),
    date: Yup.date().required('Date is required'),
    details: Yup.string().required('Details are required'),
    image: Yup.mixed().nullable()
});

export const UpdatePasswordValidationSchema = Yup.object().shape({
    password: Yup.string().required('Current Password is required'),
    newPassword: Yup.string().required('New Password is required')
});

export const UpdateProfileValidationSchema = Yup.object().shape({
    fullname: Yup.string().required('Full Name is requires'),
    cnic: Yup.string()
        .matches(/^\d{13}$/, 'Invalid CNIC format')
        .required('CNIC is requires'),
    mobile: Yup.string()
        .matches(/^92(3)\d{9}$/, 'Invalid phone number format')
        .required('Mobile is requires'),
    address: Yup.string().required('Address is requires')
});

export const CreateExtraIncomeValidationSchema = Yup.object().shape({
    date: Yup.date().required('Date is required'),
    category: Yup.string().required('Category is required'),
    userId: Yup.string(),
    amount: Yup.number(),
    paymentMethod: Yup.string().required('Payment Method id is required'),
    tid: Yup.string(),
    details: Yup.string().required('Details are required')
});
