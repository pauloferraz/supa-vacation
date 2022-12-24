import Input from '@/components/Input';
import { Company } from '@prisma/client';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';

export interface CompanyFormProps {
  initialValues?: Company;
  isNew?: boolean;
}

const CompanyFormSchema = Yup.object().shape({
  name: Yup.string().trim().required(),
});

const CompanyForm = ({ initialValues, isNew = true }: CompanyFormProps) => {
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);

  const handleOnSubmit = async (values: Company = null) => {
    let toastId;
    try {
      setDisabled(true);
      toastId = toast.loading('Submitting...');

      await axios.post('/api/company/create', { ...values });

      toast.success('Successfully submitted', { id: toastId });

      router.push('/');
    } catch (e) {
      toast.error('Unable to submit', { id: toastId });
      setDisabled(false);
    }
  };

  const handleOnEditSubmit = async (values: Company) => {
    let toastId;
    try {
      setDisabled(true);
      toastId = toast.loading('Submitting...');

      await axios.patch(`/api/company/${initialValues.id}`, values);
      toast.success('Successfully submitted', { id: toastId });

      router.push('/');
    } catch (e) {
      toast.error('Unable to submit', { id: toastId });
      setDisabled(false);
    }
  };

  const { ...initialFormValues } = initialValues ?? {
    name: '',
  };

  return (
    <div>
      <Formik
        initialValues={initialFormValues}
        validationSchema={CompanyFormSchema}
        validateOnBlur={false}
        onSubmit={isNew ? handleOnSubmit : handleOnEditSubmit}>
        {({ isSubmitting, isValid }) => (
          <Form className='space-y-8'>
            <div className='space-y-6'>
              <Input
                name='name'
                type='text'
                label='Nome da empresa'
                placeholder='Digite o nome da empresa'
                disabled={disabled}
              />
            </div>

            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={disabled || !isValid}
                className='bg-rose-600 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 hover:bg-rose-500 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-600'>
                {isSubmitting ? 'Submitting...' : 'Save'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CompanyForm;
