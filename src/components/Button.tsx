import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { Loading } from './Loading';

type ButtonProps = {
  label: string;
  href: string;
  loading: boolean;
  toggleLoading: Dispatch<SetStateAction<boolean>>;
};

export const Button = ({
  href,
  label,
  loading,
  toggleLoading,
}: ButtonProps) => {
  return (
    <Link href={href}>
      <button
        onClick={() => toggleLoading(!loading)}
        disabled={loading}
        className='customButton'>
        {loading ? <Loading text='Loading' /> : label}
      </button>
    </Link>
  );
};
