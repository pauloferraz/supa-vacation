import { Loading } from '@/components';
import Input from '@/components/Input';
import { Company } from '@prisma/client';
import axios from 'axios';
import { Field, Form, Formik } from 'formik';
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
    active: true,
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
            <div className='space-y-2'>
              <label>
                Está ativa? <Field type='checkbox' name='active' />
              </label>
            </div>
            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={disabled || !isValid}
                className='customButton'>
                {isSubmitting ? <Loading text='Loading' /> : 'Save'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CompanyForm;
