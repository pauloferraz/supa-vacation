import { Loading } from '@/components';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

type ButtonProps = {
  label: string;
  href: string;
  loading: boolean;
  toggleLoading: Dispatch<SetStateAction<boolean>>;
};

const Button = ({ href, label, loading, toggleLoading }: ButtonProps) => {
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

export default Button;
