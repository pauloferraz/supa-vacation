import { ImageUpload, Input, Loading } from '@/components';

import { Product } from '@prisma/client';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';

export interface ProductFormProps {
  initialValues?: Product;
  isNew?: boolean;
}

const ProductFormSchema = Yup.object().shape({
  title: Yup.string().trim().required(),
  description: Yup.string().trim().required(),
  price: Yup.number().positive().integer().min(1).required(),
  color: Yup.number().positive().integer().min(1).required(),
});

const ProductForm = ({ initialValues, isNew = true }: ProductFormProps) => {
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialValues?.image ?? '');

  const upload = async (image) => {
    if (!image) return;

    let toastId;
    try {
      setDisabled(true);
      toastId = toast.loading('Uploading...');
      const { data } = await axios.post('/api/image-upload', { image });
      setImageUrl(data?.url);
      toast.success('Successfully uploaded', { id: toastId });
    } catch (e) {
      toast.error('Unable to upload', { id: toastId });
      setImageUrl('');
    } finally {
      setDisabled(false);
    }
  };

  const handleOnSubmit = async (values: Product = null) => {
    let toastId;
    try {
      setDisabled(true);
      toastId = toast.loading('Submitting...');

      await axios.post('/api/products/create', { ...values, image: imageUrl });

      toast.success('Successfully submitted', { id: toastId });

      router.push('/');
    } catch (e) {
      toast.error('Unable to submit', { id: toastId });
      setDisabled(false);
    }
  };

  const handleOnEditSubmit = async (values: Product) => {
    let toastId;
    try {
      setDisabled(true);
      toastId = toast.loading('Submitting...');

      await axios.patch(`/api/products/${initialValues.id}`, values);
      toast.success('Successfully submitted', { id: toastId });

      router.push('/');
    } catch (e) {
      toast.error('Unable to submit', { id: toastId });
      setDisabled(false);
    }
  };

  const { image, ...initialFormValues } = initialValues ?? {
    image: '',
    title: '',
    description: '',
    price: 0,
    size: '',
    color: 1,
    active: 1,
  };

  return (
    <div>
      <div className='mb-8 max-w-md'>
        <ImageUpload
          initialImage={{ src: image, alt: initialFormValues.title }}
          onChangePicture={upload}
        />
      </div>

      <Formik
        initialValues={initialFormValues}
        validationSchema={ProductFormSchema}
        validateOnBlur={false}
        onSubmit={isNew ? handleOnSubmit : handleOnEditSubmit}>
        {({ isSubmitting, isValid }) => (
          <Form className='space-y-8'>
            <div className='space-y-6'>
              <Input
                name='title'
                type='text'
                label='Title'
                placeholder='Entire rental unit - Amsterdam'
                disabled={disabled}
              />

              <Input
                name='description'
                type='textarea'
                label='Description'
                placeholder='Very charming and modern apartment in Amsterdam...'
                disabled={disabled}
                rows={5}
              />

              <Input
                name='price'
                type='number'
                min='0'
                label='Price per night'
                placeholder='100'
                disabled={disabled}
              />

              <div className='flex space-x-4'>
                <Input
                  name='size'
                  type='text'
                  label='size'
                  placeholder='Size'
                  disabled={disabled}
                />
                <Input
                  name='color'
                  type='text'
                  label='color'
                  placeholder='Color'
                  disabled={disabled}
                />
                <Input
                  name='active'
                  type='text'
                  label='active'
                  placeholder='Active'
                  disabled={disabled}
                />
              </div>
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

export default ProductForm;
