import { Loading } from '@/components';
import Input from '@/components/Input';
import { Company, User } from '@prisma/client';
import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export interface UserFormProps {
  initialValues?: User;
  companyId: string;
}

const UserForm = ({ initialValues, companyId }: UserFormProps) => {
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);

  const handleOnEditSubmit = async (values: Company) => {
    let toastId;
    try {
      setDisabled(true);
      toastId = toast.loading('Submitting...');

      await axios.patch(`/api/user/${initialValues.id}`, values);
      toast.success('Successfully submitted', { id: toastId });

      router.push('/');
    } catch (e) {
      toast.error('Unable to submit', { id: toastId });
      setDisabled(false);
    }
  };

  const { ...initialFormValues } = initialValues;

  return (
    <div>
      <h2>{initialValues.name}</h2>
      <p>{initialValues.email}</p>

      <Formik
        initialValues={{
          ...initialFormValues,
          companyId: companyId,
          isBuyer: companyId && true,
        }}
        validateOnBlur={false}
        onSubmit={handleOnEditSubmit}>
        {({ isSubmitting, isValid }) => (
          <Form className='space-y-8'>
            <div className='space-y-6'>
              <Input
                name='companyId'
                type='text'
                disabled={disabled}
                className='hidden'
              />
            </div>
            <div className='space-y-2'>
              <label>
                Esse usuário é um comprador?{' '}
                <Field type='checkbox' name='isBuyer' />
              </label>
            </div>
            <div className='space-y-2'>
              <label>
                Está ativo? <Field type='checkbox' name='active' />
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

export default UserForm;
